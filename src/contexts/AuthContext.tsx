'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SpotifyUser {
    id: string
    display_name: string
    email: string
    access_token: string
    refresh_token: string
}

interface AuthContextType {
    user: SpotifyUser | null
    login: () => void
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SpotifyUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check if user data is in URL (after Spotify redirect)
        const urlParams = new URLSearchParams(window.location.search)
        const authSuccess = urlParams.get('auth')
        const userData = urlParams.get('user')

        if (authSuccess === 'success' && userData) {
            try {
                const parsedUser = JSON.parse(decodeURIComponent(userData))
                setUser(parsedUser)
                // Store in sessionStorage for persistence during the session
                sessionStorage.setItem('spotify_user', JSON.stringify(parsedUser))

                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname)
            } catch (error) {
                console.error('Failed to parse user data:', error)
            }
        } else {
            // Check if user data exists in sessionStorage
            const storedUser = sessionStorage.getItem('spotify_user')
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser))
                } catch (error) {
                    console.error('Failed to parse stored user data:', error)
                    sessionStorage.removeItem('spotify_user')
                }
            }
        }

        setIsLoading(false)
    }, [])

    const login = () => {
        window.location.href = '/api/auth/spotify'
    }

    const logout = () => {
        setUser(null)
        sessionStorage.removeItem('spotify_user')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}