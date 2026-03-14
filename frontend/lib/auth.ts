import { auth } from "@/auth"

/** Use in Server Components to get the current session */
export async function getServerSession() {
  return await auth()
}

/** Use in Server Components to get the FastAPI JWT */
export async function getAccessToken(): Promise<string | null> {
  const session = await auth()
  return session?.accessToken ?? null
}
