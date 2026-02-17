
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const prisma = new PrismaClient()

async function main() {
    console.log("Testing database connection...")
    try {
        // Try to count users
        const userCount = await prisma.user.count()
        console.log(`Successfully connected! User count: ${userCount}`)

        // Try to create a dummy user to verify write access
        const email = `test-verify-${Date.now()}@example.com`
        const user = await prisma.user.create({
            data: {
                email: email,
                name: "Verification User"
            }
        })
        console.log(`Successfully created test user: ${user.id}`)

        // Clean up
        await prisma.user.delete({ where: { id: user.id } })
        console.log("Successfully cleaned up test user.")

        console.log("PASS: Database is fully functional.")
    } catch (error) {
        console.error("FAIL: Database check failed:", error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
