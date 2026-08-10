import type { NextConfig } from "next";

const APP_VERSION =
  process.env.RENDER_GIT_COMMIT?.slice(0, 7) ||
  process.env.NEXT_PUBLIC_APP_VERSION ||
  "8d92257";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
          {
            key: "X-App-Version",
            value: APP_VERSION,
          },
          {
            key: "X-Commit-SHA",
            value: APP_VERSION,
          },
        ],
      },
      {
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
          {
            key: "X-App-Version",
            value: APP_VERSION,
          },
          {
            key: "X-Commit-SHA",
            value: APP_VERSION,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
