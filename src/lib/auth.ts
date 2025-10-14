'use server'

import { cookies } from "next/headers";

export async function getCurrentUser() {
  const token = (await cookies()).get("payload-token")?.value;
  if (!token) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/me`, {
    headers: { Authorization: `JWT ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const { user } = await res.json();
  return user;
}