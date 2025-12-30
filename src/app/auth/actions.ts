'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { signInSchema, signUpSchema, forgotPasswordSchema, updatePasswordSchema } from "@/lib/auth-schemas"
import { z } from "zod"
import { headers } from "next/headers"

// ... (login and signup remain unchanged) ...

export async function login(data: z.infer<typeof signInSchema>) {
  const supabase = await createClient()

  // Validate fields with Zod
  const result = signInSchema.safeParse(data)

  if (!result.success) {
    return { error: "Validation failed" }
  }

  const { email, password } = result.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/')
}

export async function signup(data: z.infer<typeof signUpSchema>) {
  const supabase = await createClient()

  const result = signUpSchema.safeParse(data)

  if (!result.success) {
    return { error: "Validation failed" }
  }

  const { email, password } = result.data

  const origin = (await headers()).get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Usually signup requires email confirmation, so we don't redirect to dashboard immediately usually.
  // But for now, we can maybe redirect to a verification page or just return success message.
  return { success: true, message: "Check your email to confirm your account." }
}

export async function resetPassword(data: z.infer<typeof forgotPasswordSchema>) {
  const supabase = await createClient()
  const origin = (await headers()).get("origin")

  const result = forgotPasswordSchema.safeParse(data)

  if (!result.success) {
    return { error: "Validation failed" }
  }

  const { email } = result.data

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/?modal=update_password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: "Password reset link sent to your email." }
}

export async function updatePassword(data: z.infer<typeof updatePasswordSchema>) {
  const supabase = await createClient()

  const result = updatePasswordSchema.safeParse(data)

  if (!result.success) {
    return { error: "Validation failed" }
  }

  const { password } = result.data

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const origin = (await headers()).get("origin")

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
