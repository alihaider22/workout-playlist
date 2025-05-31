// Spotify API helper functions for dynamic song selection
export interface Song {
    name: string
    artist: string
    spotifyUri: string
    id: string
}

const workoutSeeds = {
    high: {
        genres: ['electronic', 'hip-hop', 'rock', 'pop', 'dance'],
        searchTerms: ['workout', 'gym', 'pump up', 'energy', 'beast mode'],
        audioFeatures: {
            min_energy: 0.7,
            max_energy: 1.0,
            min_valence: 0.4,
            max_valence: 1.0,
            min_tempo: 120,
            max_tempo: 180
        }
    },
    medium: {
        genres: ['pop', 'indie', 'alternative', 'dance', 'funk'],
        searchTerms: ['running', 'cardio', 'upbeat', 'motivation', 'fitness'],
        audioFeatures: {
            min_energy: 0.4,
            max_energy: 0.8,
            min_valence: 0.3,
            max_valence: 0.9,
            min_tempo: 100,
            max_tempo: 140
        }
    },
    low: {
        genres: ['ambient', 'chill', 'indie', 'folk', 'acoustic'],
        searchTerms: ['yoga', 'stretching', 'calm', 'relaxing', 'meditation'],
        audioFeatures: {
            min_energy: 0.1,
            max_energy: 0.5,
            min_valence: 0.1,
            max_valence: 0.7,
            min_tempo: 60,
            max_tempo: 120
        }
    }
} as const

export async function getSongsFromSpotify(
    intensity: 'low' | 'medium' | 'high',
    duration: number,
    accessToken: string
): Promise<Song[]> {
    const seeds = workoutSeeds[intensity]

    try {
        console.log(`Getting ${intensity} intensity songs for ${duration} minutes...`)

        // Method 1: Try Spotify's recommendations API first
        try {
            const params = new URLSearchParams({
                limit: '50', // Get more to shuffle from
                seed_genres: seeds.genres.slice(0, 3).join(','), // Max 5 seeds total
                ...Object.fromEntries(
                    Object.entries(seeds.audioFeatures).map(([key, value]) => [key, value.toString()])
                )
            })

            console.log('Trying recommendations API with params:', params.toString())

            const response = await fetch(`https://api.spotify.com/v1/recommendations?${params}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                console.log(`Found ${data.tracks.length} recommendations`)

                if (data.tracks.length > 0) {
                    // Convert to our Song format and shuffle
                    const songs: Song[] = data.tracks.map((track: any) => ({
                        name: track.name,
                        artist: track.artists.map((artist: any) => artist.name).join(', '),
                        spotifyUri: track.uri,
                        id: track.id
                    }))

                    // Shuffle and return up to 10 songs
                    const shuffled = songs.sort(() => Math.random() - 0.5)
                    const selected = shuffled.slice(0, 10)
                    console.log('Selected songs:', selected.map(s => `${s.name} - ${s.artist}`))
                    return selected
                }
            } else {
                console.log('Recommendations API failed with status:', response.status)
            }
        } catch (recError) {
            console.log('Recommendations API failed, trying search...', recError)
        }

        // Method 2: Fallback to search
        return await searchForSongs(intensity, accessToken)

    } catch (error) {
        console.error('Error fetching songs from Spotify:', error)
        throw new Error('Failed to fetch songs from Spotify')
    }
}

async function searchForSongs(
    intensity: 'low' | 'medium' | 'high',
    accessToken: string
): Promise<Song[]> {
    const seeds = workoutSeeds[intensity]
    const allSongs: Song[] = []

    try {
        console.log('Using search fallback for', intensity, 'intensity')

        // Search using multiple terms to get variety
        for (const term of seeds.searchTerms.slice(0, 3)) { // Try first 3 terms
            console.log('Searching for:', term)

            const response = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(term)}&type=track&limit=20`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            )

            if (response.ok) {
                const data = await response.json()
                const songs: Song[] = data.tracks.items.map((track: any) => ({
                    name: track.name,
                    artist: track.artists.map((artist: any) => artist.name).join(', '),
                    spotifyUri: track.uri,
                    id: track.id
                }))

                allSongs.push(...songs)
                console.log(`Found ${songs.length} songs for "${term}"`)
            }
        }

        // Remove duplicates and shuffle
        const uniqueSongs = allSongs.filter((song, index, self) =>
            index === self.findIndex(s => s.id === song.id)
        )

        const shuffled = uniqueSongs.sort(() => Math.random() - 0.5)
        const selected = shuffled.slice(0, 10)

        console.log(`Search fallback found ${selected.length} unique songs`)
        console.log('Final selected songs:', selected.map(s => `${s.name} - ${s.artist}`))
        return selected

    } catch (error) {
        console.error('Search fallback failed:', error)
        return []
    }
}
