import { NextRequest, NextResponse } from "next/server";

const isDev = process.env.NODE_ENV === "development";

const allowedOrigins = isDev
  ? ["http://localhost:3000"]
  : ["https://acme.com", "https://my-app.org"];

const allowedAgents = [
  "Mozilla/5.0",
  "AppleWebKit/537.36 (KHTML, like Gecko)",
  "Chrome/130.0.0.0",
  "Safari/537.36",
];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const config = {
  matcher: "/api/:path*",
};

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  const isPreflight = request.method === "OPTIONS";

  const userAgent = request.headers.get("user-agent");

  const isAllowedAgent = allowedAgents.some((agent) =>
    userAgent?.includes(agent)
  );

  const response = NextResponse.next();

  // if (!isAllowedAgent) {
  //   return NextResponse.json(
  //     {
  //       success: false,
  //       message: "User-agent no permitido",
  //     },
  //     {
  //       status: 404,
  //     }
  //   );
  // }

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
