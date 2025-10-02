"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE_NAME = "soon-session";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (email === "admin@soon.so" && password === "password") {
    const sessionData = JSON.stringify({ userId: "admin", loggedInAt: Date.now() });
    cookies().set(SESSION_COOKIE_NAME, sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Invalid credentials" };
}

export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect("/admin");
}
