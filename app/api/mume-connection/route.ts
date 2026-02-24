
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { receiverId, status } = await req.json()

        if (!receiverId || !status) {
            return NextResponse.json({ error: "Missing receiverId or status" }, { status: 400 })
        }

        // Only allow "positive" or "negative" status
        if (!["positive", "negative"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 })
        }

        // Create or update the connection
        const connection = await prisma.mumeConnection.upsert({
            where: {
                senderId_receiverId: {
                    senderId: session.user.id,
                    receiverId: receiverId
                }
            },
            update: {
                status,
                updatedAt: new Date()
            },
            create: {
                senderId: session.user.id,
                receiverId,
                status
            }
        })

        return NextResponse.json({ success: true, connection })

    } catch (error) {
        console.error("Error creating/updating connection:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
