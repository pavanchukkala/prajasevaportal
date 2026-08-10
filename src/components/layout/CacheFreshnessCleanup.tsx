"use client";

import { useEffect } from "react";

export default function CacheFreshnessCleanup() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Unregister any stale Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      }).catch((err) => {
        console.warn("[CacheFreshness] Service worker unregister check:", err);
      });
    }

    // 2. Clear stale CacheStorage (Service Worker / PWA caches)
    if ("caches" in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      }).catch((err) => {
        console.warn("[CacheFreshness] CacheStorage clear check:", err);
      });
    }

    // 3. Compare deployment version with localStorage to invalidate stale app shells
    const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || "8d92257";
    const storedVersion = localStorage.getItem("psip_app_version");

    if (storedVersion && storedVersion !== currentVersion) {
      console.log(`[CacheFreshness] New deployment detected (${storedVersion} -> ${currentVersion}). Refreshing app shell.`);
      localStorage.setItem("psip_app_version", currentVersion);
    } else if (!storedVersion) {
      localStorage.setItem("psip_app_version", currentVersion);
    }
  }, []);

  return null;
}
