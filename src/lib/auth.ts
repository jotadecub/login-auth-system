import { cookies } from "next/headers";

type Session = {
    userId: string;
    email: string;
    name?: string;
} | null;

export async function getSession(): Promise<Session> {
    const sessionCookies = await cookies();
    const sessionCookie = sessionCookies.get("session");

    if (!sessionCookie) {
        return null;
    }

    try {
        return JSON.parse(sessionCookie.value) as Session;
    } catch {
        return null;
    }
}

export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session !==null;
}