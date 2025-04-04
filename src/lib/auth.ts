import { cookies } from "next/headers";
import prisma from "./prisma";
import bcrypt from "bcrypt";

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

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function comparePasswords(plainPassword: string, 
hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
}

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
    });
}

export async function createUser(data: { email: string; password: string; name?: string}) {
    const hashedPassword = await hashPassword(data.password)

    return prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
        }
    })
}