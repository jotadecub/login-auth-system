import { cookies } from "next/headers";
import prisma from "./prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { authenticator } from "otplib";

// Asegurate to have this enviroments variables set in your .env file
const JWT_SECRET = process.env.JWT_SECRET || "juanjuanjuan";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

type Session = {
    userId: string
    email: string
    name?: string
    role: Role
    permissions?: string[]
} | null

// Function to create a JWT token
export function generateToken(payload: any, expiresIn = "7d") {
    return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

// Function to verify a JWT token
export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}

export async function getSession(): Promise<Session> {
    const sessionCookies = await cookies();
    const sessionCookie = sessionCookies.get("session");

    if (!sessionCookie) {
        return null;
    }

    try {
        // If we are using JWT, verify the token
        const payload = verifyToken(sessionCookie.value)
        if (!payload) return null

        return payload as Session
    } catch {
        return null
    }

    // If we are using session cookies, parse the cookie value and return it
    // //     return JSON.parse(sessionCookie.value) as Session;
    // // } catch {
    // //     return null;
    // }
}

export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session !==null;
}

export async function hasRole(requiredRoles: Role[]): Promise<boolean> {
    const session = await getSession()
    if (!session) return false

    return requiredRoles.includes(session.role)
}

export async function hasPermission(permissionName: string): Promise<boolean> {
    const session = await getSession()
    if (!session) return false

    // If is SUPER_ADMIN, him have all permissions
    if (session.role === "SUPER_ADMIN") return true

    // Verify specific permissions
    if (session.permissions?.includes(permissionName)) return true

    // Search in the database if they not are in the session
    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { permissions: true},
    })

    return user?.permissions.some((p) => p.name === permissionName) || false
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
        include: { permissions: true },
    });
}

export async function createUser(data: {
    email: string; 
    password: string;
    name?: string
    role: Role;
}) {
    const hashedPassword = await hashPassword(data.password)

    return prisma.user.create({
        data: {
            ...data,
            role: data.role || "USER",
            password: hashedPassword,
        },
        include: { permissions: true },
    })
}

export async function getUserPermissions(userId: string): Promise<string[]> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { permissions: true },
    })

    return user?.permissions.map((p) => p.name) || []
}

// Functions for forgot password and reset password
export async function generatePasswordResetToken(email: string) {
    const user = await getUserByEmail(email)
  
    if (!user) {
      throw new Error("Usuario no encontrado")
    }
  
    // Generate a unique token
    const resetToken = uuidv4()
  
    // Set expiry time for the token (1 hour in this case)
    const resetTokenExpiry = new Date()
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1)
  
    // Save in the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })
  
    return resetToken
  }
  
  export async function resetPassword(token: string, newPassword: string) {
    // Find user by token and check if it is valid
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    })
  
    if (!user) {
      throw new Error("Token inválido o expirado")
    }
  
    // Hash the new password
    const hashedPassword = await hashPassword(newPassword)
  
    // Update the user with the new password and clear the token and expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })
  
    return true
}

// Functions for two-factor authentication
export function generateTwoFactorSecret() {
    return authenticator.generateSecret()
  }
  
  export function generateTwoFactorQRCode(email: string, secret: string) {
    const appName = "Mi Aplicación"
    const otpauth = authenticator.keyuri(email, appName, secret)
    return otpauth
  }
  
  export function verifyTwoFactorToken(token: string, secret: string) {
    return authenticator.verify({ token, secret })
  }
  
  export async function enableTwoFactor(userId: string, secret: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
      },
    })
  
    return true
  }
  
  export async function disableTwoFactor(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    })
  
    return true
}