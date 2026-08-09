"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs if not explicitly passed
  const pathSegments = pathname.split("/").filter(Boolean);
  
  const generatedItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    ...pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const formattedLabel = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      return { label: formattedLabel, href: index === pathSegments.length - 1 ? undefined : href };
    }),
  ];

  const displayItems = items || generatedItems;

  return (
    <nav aria-label="Breadcrumb" style={styles.container}>
      <ol style={styles.list}>
        {displayItems.map((item, idx) => {
          const isLast = idx === displayItems.length - 1;
          return (
            <li key={idx} style={styles.item}>
              {idx > 0 && <span style={styles.separator}>/</span>}
              {isLast || !item.href ? (
                <span style={styles.current}>{item.label}</span>
              ) : (
                <Link href={item.href} style={styles.link}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const styles = {
  container: {
    padding: "0.75rem 1.25rem",
    backgroundColor: "rgba(13, 33, 55, 0.4)",
    borderBottom: "1px solid rgba(212, 160, 23, 0.15)",
  },
  list: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    margin: 0,
    padding: 0,
    listStyle: "none",
    fontSize: "0.85rem",
    maxWidth: "1280px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  separator: {
    color: "#64748b",
  },
  link: {
    color: "#94a3b8",
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
  current: {
    color: "#fbbf24",
    fontWeight: 600,
  },
};
