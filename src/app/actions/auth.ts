"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { 
    getUserByEmail, 
    comparePasswords, 
    createUser,
    getUserPermissions,
    generateToken,
} from "@/lib/auth";
import prisma from "@/lib/prisma";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

type LoginResult = {
    success: boolean
    error?: string
    requiresTwoFactor?: boolean
    userId?: string
}

export async function login(formData: FormData): Promise<LoginResult> {
    // Validate the form data
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
        return {
            success: false,
            error: "Datos de inicio de sesion inválidos"
        };
    };

    try {
        // Fetch the user from the database
        const user = await getUserByEmail(email);
    
        // If the user doesn't exist or the password is incorrect
        if (!user || !(await comparePasswords(password, user.password))) {
            return {
              success: false,
              error: "Credenciales incorrectas",
            }
        }

        // Obtain user permissions
        const permissions = await getUserPermissions(user.id)

        // Create a user session
        const session = {
            userID: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions,
        }

        // Generate a token for the session
        const token = generateToken(session)

        // Set the session cookie
        const sessionExpiry = new Date()
        sessionExpiry.setDate(sessionExpiry.getDate() + 7)

        const cookieStore = await cookies();
        cookieStore.set({
            name: "session",
            value: JSON.stringify(session),
            expires: sessionExpiry,
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })

        return { success: true }
    } catch (error) {
        console.error("Error during login:", error);
        return {
            success: false,
            error: "Error al procesar la solicitud",
        }
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    return { success: true };
}

export async function register(formData: FormData): Promise<LoginResult> {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    const role = (formData.get("role") as Role) || "USER"

    const validationResult = z
        .object({
            email: z.string().email(),
            password: z.string().min(6),
            name: z.string().optional(),
            role: z.enum(["USER", "EDITOR", "ADMIN", "SUPER_ADMIN"]).default("USER"),
        })
        .safeParse({ email, password, name, role })

    if (!validationResult.success) {
        return {
            success: false,
            error: "Datos de registro inválidos",
        }
    }

    try {
        // Check if the user already exists
        const existingUser = await getUserByEmail(email)

        if (existingUser) {
            return {
                success: false,
                error: "El usuario ya existe",
            }
        }

        // Create a new user
        await createUser({
            email,
            password,
            name: name || undefined,
            role,
        })

        // Login the user automatically after registration
        return login(formData)
    } catch (error) {
        console.error("Error during registration:", error)
        return {
            success: false,
            error: "Error al procesar la solicitud",
        }
    }
}

// export async function getSession() {
//     const cookieStore = await cookies();
//     const sessionCookie = cookieStore.get("session");
  
//     if (!sessionCookie) {
//       return null
//     }
  
//     try {
//       return JSON.parse(sessionCookie.value)
//     } catch (error) {
//       return null
//     }
//   }
  
