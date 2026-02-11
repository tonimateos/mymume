import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import Login from "@/components/Login"
import Dashboard from "@/components/Dashboard"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    return <Dashboard />
  }

  return <Login />
}
