"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE_NAME = "soon-session";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.g...