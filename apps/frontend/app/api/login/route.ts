import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { loginRequest } from "../../../lib/api";
import { sessionCookieName } from "../../../lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await loginRequest(body);

    (await cookies()).set(sessionCookieName, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Login failed",
      },
      { status: 401 },
    );
  }
}
