
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    const targetUserId = searchParams.get("userId")

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!targetUserId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    try {
        // Verify a positive connection exists
        const connection = await prisma.mumeConnection.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: session.user.id,
                    receiverId: targetUserId
                }
            }
        })

        if (!connection || connection.status !== "positive") {
            return NextResponse.json({ error: "Access denied. Mutual match required." }, { status: 403 })
        }

        // Fetch the target user's songs (playlistText or from Spotify if we had that, but let's stick to what we have)
        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: {
                playlistText: true,
                nickname: true
            }
        })

        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Parse songs from the playlist text if available
        const songs = targetUser.playlistText
            ? targetUser.playlistText.split('\n').filter(s => s.trim().length > 0)
            : []

        return NextResponse.json({
            nickname: targetUser.nickname,
            songs
        })

    } catch (error) {
        console.error("Error fetching matched user songs:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
