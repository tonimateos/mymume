import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { getPlaylist, extractPlaylistId } from "@/lib/spotify"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { url } = body

    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const playlistId = extractPlaylistId(url)
    if (!playlistId) {
        return NextResponse.json({ error: "Invalid Spotify Playlist URL" }, { status: 400 })
    }

    try {
        // Fetch from Spotify to validate and get details
        const playlistData = await getPlaylist(playlistId)

        // Save to DB (Update user's playlistUrl)
        await prisma.user.update({
            where: { id: session.user.id },
            data: { playlistUrl: url },
        })

        return NextResponse.json(playlistData)
    } catch (error) {
        console.error("Error in playlist route:", error)
        return NextResponse.json({ error: "Failed to fetch playlist" }, { status: 500 })
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { playlistUrl: true },
        })

        if (!user || !user.playlistUrl) {
            return NextResponse.json({ playlist: null })
        }

        const playlistId = extractPlaylistId(user.playlistUrl)
        if (!playlistId) {
            // Should not happen if validation worked before, but handle it
            return NextResponse.json({ playlist: null })
        }

        const playlistData = await getPlaylist(playlistId)
        return NextResponse.json(playlistData)

    } catch (error) {
        console.error("Error fetching saved playlist:", error)
        return NextResponse.json({ error: "Failed to fetch saved playlist" }, { status: 500 })
    }
}
