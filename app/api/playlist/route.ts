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
    const { url, text, nickname, voiceType } = body

    // Handle generic profile update (Step 1 & 2)
    if (nickname || voiceType) {
        try {
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    ...(nickname && { nickname }),
                    ...(voiceType && { voiceType })
                }
            })
            return NextResponse.json({ success: true })
        } catch (error) {
            console.error("Error updating profile:", error)
            return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
        }
    }

    if (!url && !text) {
        return NextResponse.json({ error: "URL or Text is required" }, { status: 400 })
    }

    if (text) {
        try {
            // Save to DB
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    playlistText: text,
                    playlistUrl: null,
                    sourceType: 'text_list'
                },
            })

            return NextResponse.json({ type: 'text', content: text })
        } catch (error) {
            console.error("Error processing text playlist:", error)
            return NextResponse.json({ error: "Failed to process text list" }, { status: 500 })
        }
    }

    const playlistId = extractPlaylistId(url)
    if (!playlistId) {
        return NextResponse.json({ error: "Invalid Spotify Playlist URL" }, { status: 400 })
    }

    try {
        const playlistData = await getPlaylist(playlistId)
        console.log(`[API] Fetched playlist data`, playlistData)

        // Convert tracks to text list
        let textList = ""
        if (playlistData.tracks && playlistData.tracks.items) {
            textList = playlistData.tracks.items
                .map((item: { track: { name: string, artists: { name: string }[] } | null }) => item.track)
                .filter((track: { name: string, artists: { name: string }[] } | null): track is { name: string, artists: { name: string }[] } => track !== null)
                .map((track: { name: string, artists: { name: string }[] }) => `${track.artists[0]?.name || 'Unknown Artist'} - ${track.name}`)
                .join('\n')

            console.log(`[API] Generated text list length: ${textList.length}`)
            if (textList.length > 0) {
                console.log(`[API] First line of text list: ${textList.split('\n')[0]}`)
            }
        } else {
            console.log("[API] No tracks found to convert.")
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                playlistUrl: url,
                playlistText: textList,
                sourceType: 'text_list' // Switch to text list view
            },
        })
        console.log("[API] User updated with playlist text.")

        return NextResponse.json({ type: 'text', content: textList })
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
            select: {
                playlistUrl: true,
                playlistText: true,
                sourceType: true,
                musicIdentity: true,
                nickname: true,
                voiceType: true
            },
        })

        if (!user) {
            return NextResponse.json({ playlist: null })
        }

        // Handle Text List
        if (user.sourceType === 'text_list' && user.playlistText) {
            return NextResponse.json({
                type: 'text',
                content: user.playlistText,
                musicIdentity: user.musicIdentity,
                nickname: user.nickname,
                voiceType: user.voiceType
            })
        }

        // Handle Spotify URL
        if (!user.playlistUrl) {
            return NextResponse.json({ playlist: null })
        }

        // If we have text content (legacy or new), return it
        if (user.playlistText) {
            return NextResponse.json({
                type: 'text',
                content: user.playlistText,
                musicIdentity: user.musicIdentity,
                nickname: user.nickname,
                voiceType: user.voiceType
            })
        }

        // Strictly do not fetch from Spotify on GET. 
        return NextResponse.json({ playlist: null })

    } catch (error) {
        console.error("Error fetching saved playlist:", error)
        return NextResponse.json({ error: "Failed to fetch saved playlist" }, { status: 500 })
    }
}
