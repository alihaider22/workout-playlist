'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

type WorkoutIntensity = 'low' | 'medium' | 'high'

interface WorkoutFormData {
    intensity: WorkoutIntensity
    duration: number
}

interface WorkoutFormProps {
    onPlaylistCreated?: (playlist: any) => void
}

export default function WorkoutForm({ onPlaylistCreated }: WorkoutFormProps) {
    const { user, logout } = useAuth()
    const [formData, setFormData] = useState<WorkoutFormData>({
        intensity: 'medium',
        duration: 30
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleIntensityChange = (intensity: WorkoutIntensity) => {
        setFormData(prev => ({ ...prev, intensity }))
    }

    const handleDurationChange = (duration: number) => {
        setFormData(prev => ({ ...prev, duration }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/create-playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    intensity: formData.intensity,
                    duration: formData.duration,
                    accessToken: user?.access_token,
                    userId: user?.id
                })
            })

            if (!response.ok) {
                throw new Error('Failed to create playlist')
            }

            const result = await response.json()

            if (result.success) {
                // Pass the playlist result to parent component
                onPlaylistCreated?.(result.playlist)
            } else {
                throw new Error(result.error || 'Failed to create playlist')
            }
        } catch (error) {
            console.error('Error creating playlist:', error)
            alert('Sorry, there was an error creating your playlist. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const intensityOptions = [
        { value: 'low' as const, label: 'Low', description: 'Chill & relaxed' },
        { value: 'medium' as const, label: 'Medium', description: 'Steady energy' },
        { value: 'high' as const, label: 'High', description: 'Pump it up!' }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 px-4 py-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-sm text-gray-600">Connected as</p>
                                <p className="font-medium text-gray-900">{user?.display_name}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Logout
                        </button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Workout Playlist
                    </h1>
                    <p className="text-gray-600">
                        Create the perfect playlist for your workout
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                    {/* Intensity Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Workout Intensity
                        </label>
                        <div className="space-y-3">
                            {intensityOptions.map((option) => (
                                <div key={option.value} className="relative">
                                    <input
                                        type="radio"
                                        id={option.value}
                                        name="intensity"
                                        value={option.value}
                                        checked={formData.intensity === option.value}
                                        onChange={() => handleIntensityChange(option.value)}
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor={option.value}
                                        className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.intensity === option.value
                                                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {option.label}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {option.description}
                                                </div>
                                            </div>
                                            <div
                                                className={`w-4 h-4 rounded-full border-2 ${formData.intensity === option.value
                                                        ? 'border-purple-500 bg-purple-500'
                                                        : 'border-gray-300'
                                                    }`}
                                            >
                                                {formData.intensity === option.value && (
                                                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Duration Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Workout Duration
                        </label>
                        <div className="space-y-4">
                            <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>15 min</span>
                                    <span className="font-medium text-gray-900">{formData.duration} minutes</span>
                                    <span>60 min</span>
                                </div>
                                <input
                                    type="range"
                                    min="15"
                                    max="60"
                                    step="5"
                                    value={formData.duration}
                                    onChange={(e) => handleDurationChange(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                />
                            </div>

                            {/* Manual input option */}
                            <div className="flex items-center space-x-2">
                                <label htmlFor="duration-input" className="text-sm text-gray-600">
                                    Or enter manually:
                                </label>
                                <input
                                    id="duration-input"
                                    type="number"
                                    min="15"
                                    max="60"
                                    value={formData.duration}
                                    onChange={(e) => handleDurationChange(Number(e.target.value))}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <span className="text-sm text-gray-600">min</span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 active:transform active:scale-95'
                            } text-white shadow-lg`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Creating Playlist...</span>
                            </div>
                        ) : (
                            'Create My Playlist'
                        )}
                    </button>
                </form>

                {/* Info Card */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-blue-800">
                                We'll create a 10-song playlist perfectly matched to your workout intensity and duration.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}