
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
        // Check if user already has a location
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { city: true, country: true }
        })

        if (user?.city && user?.country) {
            return NextResponse.json({ city: user.city, country: user.country, skipped: true })
        }

        // Try to get IP from various headers
        let ip = req.headers.get("x-forwarded-for")?.split(',')[0] ||
            req.headers.get("x-real-ip") ||
            req.headers.get("cf-connecting-ip")

        console.log(`[CITY API] Initial IP from headers: ${ip}`)

        // Local development fallback: if IP is local or missing, fetch public IP
        if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
            try {
                const ipifyRes = await fetch('https://api64.ipify.org?format=json')
                if (ipifyRes.ok) {
                    const ipifyData = await ipifyRes.json()
                    if (ipifyData.ip) {
                        ip = ipifyData.ip
                        console.log(`[CITY API] Local environment detected. Using public IP fallback: ${ip}`)
                    }
                }
            } catch (err) {
                console.error("[CITY API] Public IP fallback failed:", err)
            }
        }

        console.log(`[CITY API] Final IP for detection: ${ip}`)

        let city = user?.city || null
        let country = user?.country || null

        if (ip && ip !== '127.0.0.1' && ip !== '::1') {
            try {
                // Using freeipapi.com which supports HTTPS for free
                const ipRes = await fetch(`https://freeipapi.com/api/json/${ip}`)
                console.log(`[CITY API] Service Response Status: ${ipRes.status}`)

                if (ipRes.ok) {
                    const ipData = await ipRes.json()
                    console.log(`[CITY API] Service Data:`, JSON.stringify(ipData))

                    if (ipData.cityName || ipData.countryName) {
                        city = ipData.cityName || city
                        country = ipData.countryName || country

                        await prisma.user.update({
                            where: { id: session.user.id },
                            data: {
                                ...(city && { city }),
                                ...(country && { country })
                            }
                        })

                        console.log(`[CITY API] Database updated with location: ${city}, ${country}`)
                    } else {
                        console.warn(`[CITY API] No location data in service response`)
                    }
                } else {
                    console.warn(`[CITY API] Service request failed`)
                }
            } catch (err) {
                console.error("[CITY API] Service call error:", err)
            }
        }

        return NextResponse.json({ city, country })

    } catch (error) {
        console.error("[CITY API] Error:", error)
        return NextResponse.json({ error: "Failed to detect city" }, { status: 500 })
    }
}
