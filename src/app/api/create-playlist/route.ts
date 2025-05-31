import { NextRequest, NextResponse } from 'next/server'
import { getSongsFromSpotify } from '@/data/songs'

interface CreatePlaylistRequest {
    intensity: 'low' | 'medium' | 'high'
    duration: number
    accessToken: string
    userId: string
}

export async function POST(request: NextRequest) {
    try {
        const { intensity, duration, accessToken, userId }: CreatePlaylistRequest = await request.json()

        if (!intensity || !duration || !accessToken || !userId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
        }

        // Step 1: Get songs dynamically from Spotify
        console.log(`Fetching ${intensity} intensity songs for ${duration} minutes...`)
        const selectedSongs = await getSongsFromSpotify(intensity, duration, accessToken)

        if (selectedSongs.length === 0) {
            return NextResponse.json({ error: 'No songs found for this intensity. Please try again.' }, { status: 400 })
        }

        console.log(`Found ${selectedSongs.length} songs:`, selectedSongs.map(s => `${s.name} - ${s.artist}`))

        // Step 2: Create playlist name with timestamp for uniqueness
        const intensityLabels = { low: 'Chill', medium: 'Steady', high: 'Intense' }
        const timestamp = new Date().toLocaleDateString()
        const playlistName = `${intensityLabels[intensity]} Workout (${duration} min) - ${timestamp}`
        const playlistDescription = `AI-generated ${intensity} intensity workout playlist for ${duration} minutes. Created with fresh tracks from Spotify recommendations.`

        // Step 3: Create the playlist in Spotify
        console.log('Creating playlist in Spotify...')
        const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playlistName,
                description: playlistDescription,
                public: false // Private playlist by default
            })
        })

        if (!createPlaylistResponse.ok) {
            const error = await createPlaylistResponse.text()
            console.error('Failed to create playlist:', error)
            return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 })
        }

        const playlist = await createPlaylistResponse.json()
        console.log('Playlist created with ID:', playlist.id)

        // Step 4: Add songs to the playlist
        const trackUris = selectedSongs.map(song => song.spotifyUri)

        console.log('Adding tracks to playlist...')
        const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: trackUris
            })
        })

        if (!addTracksResponse.ok) {
            const error = await addTracksResponse.text()
            console.error('Failed to add tracks:', error)
            return NextResponse.json({ error: 'Failed to add tracks to playlist' }, { status: 500 })
        }

        console.log('Tracks added successfully!')

        // Step 5: Return success response
        return NextResponse.json({
            success: true,
            playlist: {
                id: playlist.id,
                name: playlist.name,
                description: playlist.description,
                external_urls: playlist.external_urls,
                tracks: selectedSongs
            }
        })

    } catch (error) {
        console.error('Playlist creation error:', error)
        return NextResponse.json({
            error: 'Internal server error. Please try again.'
        }, { status: 500 })
    }
}