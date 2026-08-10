export const APP_VERSION =
  process.env.RENDER_GIT_COMMIT?.slice(0, 7) ||
  process.env.NEXT_PUBLIC_APP_VERSION ||
  "8d92257";

export const BUILD_ID =
  process.env.RENDER_BUILD_ID ||
  process.env.BUILD_ID ||
  `build-${APP_VERSION}`;

export const BUILD_TIMESTAMP = new Date().toISOString();

export function getVersionDetails() {
  return {
    version: APP_VERSION,
    commit_sha: APP_VERSION,
    build_id: BUILD_ID,
    build_timestamp: BUILD_TIMESTAMP,
    environment: process.env.NODE_ENV || "development",
  };
}
