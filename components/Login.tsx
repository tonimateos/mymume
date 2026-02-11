"use client"

import { signIn } from "next-auth/react"

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
            <div className="text-center space-y-6 max-w-md px-6">
                <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    MyMuMe
                </h1>
                <p className="text-neutral-400 text-lg">
                    Connect your Google account to save and manage your favorite Spotify playlist.
                </p>
                <button
                    onClick={() => signIn("google")}
                    className="px-8 py-3 bg-white text-neutral-900 font-semibold rounded-full hover:bg-neutral-200 transition-all transform hover:scale-105 shadow-lg shadow-white/10"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}
