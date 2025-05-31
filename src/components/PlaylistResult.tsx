'use client'

import { Song } from '@/data/songs'

interface PlaylistResultProps {
    playlist: {
        id: string
        name: string
        description: string
        external_urls: { spotify: string }
        tracks: Song[]
    }
    onCreateAnother: () => void
}

export default function PlaylistResult({ playlist, onCreateAnother }: PlaylistResultProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 px-4 py-8">
            <div className="max-w-md mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Playlist Created! 🎵
                    </h1>
                    <p className="text-gray-600">
                        Your workout playlist is ready to pump you up
                    </p>
                </div>

                {/* Playlist Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h2 className="font-bold text-lg text-gray-900">{playlist.name}</h2>
                            <p className="text-sm text-gray-600">{playlist.tracks.length} songs</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{playlist.description}</p>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <a
                            href={playlist.external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                            <span>Open in Spotify</span>
                        </a>

                        <button
                            onClick={onCreateAnother}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                        >
                            Create Another Playlist
                        </button>
                    </div>
                </div>

                {/* Track List */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Track List</h3>
                    <div className="space-y-3">
                        {playlist.tracks.map((track, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{track.name}</p>
                                    <p className="text-sm text-gray-600 truncate">{track.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-blue-900 mb-1">
                                Pro Tip
                            </h4>
                            <p className="text-sm text-blue-800">
                                Your playlist has been saved to your Spotify account. You can find it in your library and edit it anytime!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}