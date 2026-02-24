
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        console.log(`[RESET API] Resetting profile for user: ${session.user.id}`)

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                nickname: null,
                voiceType: null,
                musicalAttributes: null,
                city: null,
                country: null,
                playlistUrl: null,
                playlistText: null,
                musicIdentity: null,
                sourceType: "spotify_url" // Default value
            }
        })

        console.log(`[RESET API] Profile successfully reset for user: ${session.user.id}`)
        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("[RESET API] Error resetting profile:", error)
        return NextResponse.json({ error: "Failed to reset profile" }, { status: 500 })
    }
}
