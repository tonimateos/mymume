import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST() {
    try {
        const mocksDir = path.join(process.cwd(), "public/mocks")

        // Create mocks dir if it doesn't exist (though it should be created by now)
        if (!fs.existsSync(mocksDir)) {
            return NextResponse.json({ error: "No mocks available yet" }, { status: 404 })
        }

        const files = fs.readdirSync(mocksDir).filter(file => file.endsWith('.mp3'))

        if (files.length === 0) {
            return NextResponse.json({ error: "No mock audio files found in public/mocks/" }, { status: 404 })
        }

        const randomFile = files[Math.floor(Math.random() * files.length)]
        const audioUrl = `/mocks/${randomFile}`

        // Simulate AI generation delay
        await new Promise(resolve => setTimeout(resolve, 3000))

        return NextResponse.json({ audioUrl })
    } catch (error) {
        console.error("Error generating audio:", error)
        return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 })
    }
}
