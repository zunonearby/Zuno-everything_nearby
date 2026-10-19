import { NextRequest, NextResponse } from "next/server";
import { DEV_MOCK_AUTH_COOKIE } from "@zuno/config";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true, redirect: "/login" });
  response.cookies.set({
    name: DEV_MOCK_AUTH_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return response;
}
