import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { fetchPlaylistTracks } from "@/lib/scraper"
import { NextResponse } from "next/server"

// Helper to extract playlist ID from URL
function extractPlaylistId(url: string) {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { url, text, nickname, voiceType, musicalAttributes } = body

    // Handle generic profile update
    if (nickname || voiceType) {
        try {
            let city = undefined

            // Deduce city if nickname is being set (usually the first set)
            if (nickname) {
                try {
                    // Try to get IP from headers
                    const forwarded = req.headers.get("x-forwarded-for")
                    const ip = forwarded ? forwarded.split(',')[0] : "8.8.8.8" // fallback for testing if no IP

                    if (ip && ip !== '127.0.0.1' && ip !== '::1') {
                        const ipRes = await fetch(`http://ip-api.com/json/${ip}?fields=city`)
                        if (ipRes.ok) {
                            const ipData = await ipRes.json()
                            if (ipData.city) {
                                city = ipData.city
                                console.log(`[API] Deduced city for user: ${city}`)
                            }
                        }
                    }
                } catch (ipErr) {
                    console.error("Error deducing city:", ipErr)
                }
            }

            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    ...(nickname && { nickname }),
                    ...(voiceType && { voiceType }),
                    ...(musicalAttributes && { musicalAttributes }),
                    ...(city && { city })
                }
            })
            return NextResponse.json({ success: true, city })
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
        console.log(`[API] Scraping playlist ID: ${playlistId}`)

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder()

                const sendUpdate = (data: unknown) => {
                    controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"))
                }

                try {
                    const scrapedTracks = await fetchPlaylistTracks(playlistId, (count) => {
                        sendUpdate({ type: 'progress', count })
                    })

                    // Convert tracks to text list
                    const textList = scrapedTracks
                        .map(track => `${track.artists} - ${track.title}`)
                        .join('\n')

                    console.log(`[API] Generated text list from scrape. Total tracks: ${scrapedTracks.length}`)

                    await prisma.user.update({
                        where: { id: session.user.id },
                        data: {
                            playlistUrl: url,
                            playlistText: textList,
                            sourceType: 'text_list'
                        },
                    })

                    sendUpdate({ type: 'text', content: textList })
                    controller.close()
                } catch (error: unknown) {
                    console.error("Error in playlist route (scraping):", error)
                    const message = error instanceof Error ? error.message : "Failed to scrape playlist"
                    sendUpdate({ error: "Failed to scrape playlist", details: message })
                    controller.close()
                }
            }
        })

        return new Response(stream, {
            headers: {
                'Content-Type': 'application/x-ndjson',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        })
    } catch (error: unknown) {
        console.error("Error creating stream:", error)
        return NextResponse.json({ error: "Failed to start processing" }, { status: 500 })
    }
}

export async function GET() {
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
                voiceType: true,
                musicalAttributes: true,
                city: true
            },
        })

        if (!user) {
            return NextResponse.json({
                playlist: null,
                isSpotifyConnected: false
            })
        }

        // Create base response with profile data
        const responseData: Record<string, unknown> = {
            nickname: user.nickname,
            voiceType: user.voiceType,
            musicalAttributes: user.musicalAttributes,
            musicIdentity: user.musicIdentity,
            city: user.city,
            isSpotifyConnected: false // Default
        }

        // Add playlist data if it exists
        if (user.sourceType === 'text_list' && user.playlistText) {
            responseData.type = 'text'
            responseData.content = user.playlistText
        } else if (user.playlistUrl) {
            responseData.type = 'spotify'
            responseData.url = user.playlistUrl
            // For now we don't return full tracks in info, Step 3/4 handles that if needed
        }

        return NextResponse.json(responseData)

    } catch (error) {
        console.error("Error fetching saved playlist:", error)
        return NextResponse.json({ error: "Failed to fetch saved playlist" }, { status: 500 })
    }
}
