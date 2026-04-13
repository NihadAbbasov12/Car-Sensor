import { cookies } from "next/headers";

const SESSION_COOKIE = "carsensor_token";

export async function getSessionToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export const sessionCookieName = SESSION_COOKIE;
