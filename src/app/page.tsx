'use client'

import { useState } from 'react'
import WorkoutForm from '@/components/WorkoutForm'
import LoginPage from '@/components/LoginPage'
import PlaylistResult from '@/components/PlaylistResult'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

function AppContent() {
  const { user, isLoading } = useAuth()
  const [createdPlaylist, setCreatedPlaylist] = useState<any>(null)

  const handlePlaylistCreated = (playlist: any) => {
    setCreatedPlaylist(playlist)
  }

  const handleCreateAnother = () => {
    setCreatedPlaylist(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  if (createdPlaylist) {
    return (
      <PlaylistResult
        playlist={createdPlaylist}
        onCreateAnother={handleCreateAnother}
      />
    )
  }

  return <WorkoutForm onPlaylistCreated={handlePlaylistCreated} />
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}