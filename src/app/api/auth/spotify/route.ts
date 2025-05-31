import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
        return NextResponse.redirect(new URL('/?error=access_denied', request.url))
    }

    if (!code) {
        // Step 1: Redirect to Spotify authorization
        const scope = 'playlist-modify-public playlist-modify-private user-read-private user-read-email'
        const state = Math.random().toString(36).substring(7)

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: process.env.SPOTIFY_CLIENT_ID!,
            scope: scope,
            redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/spotify`,
            state: state
        })

        const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`
        return NextResponse.redirect(authUrl)
    }

    // Step 2: Exchange code for access token
    try {
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
            },
            body: new URLSearchParams({
                code: code,
                redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/spotify`,
                grant_type: 'authorization_code'
            })
        })

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange code for token')
        }

        const tokenData = await tokenResponse.json()

        // Get user profile
        const profileResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            }
        })

        if (!profileResponse.ok) {
            throw new Error('Failed to fetch user profile')
        }

        const profileData = await profileResponse.json()

        // Create a success URL with user data (in a real app, you'd store this securely)
        const successUrl = new URL('/', request.url)
        successUrl.searchParams.set('auth', 'success')
        successUrl.searchParams.set('user', encodeURIComponent(JSON.stringify({
            id: profileData.id,
            display_name: profileData.display_name,
            email: profileData.email,
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token
        })))

        return NextResponse.redirect(successUrl)

    } catch (error) {
        console.error('Spotify auth error:', error)
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
    }
}