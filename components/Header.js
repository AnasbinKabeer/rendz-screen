"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CirclePlay, Disc, Layers, Rows3, Settings } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Program", icon: Layers },
    { href: "/results", label: "Results", icon: CirclePlay },
    { href: "/schedule", label: "Schedule", icon: Rows3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-10 w-[800px] bg-white rounded-lg border-b-2 mt-3 border-gray-300 mb-3 justify-around items-center gap-4 px-3 py-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center text-sm gap-1 px-3 py-1 rounded-lg transition ${
              isActive
                ? "bg-violet-700 text-white"
                : "text-gray-700 hover:text-gray-500"
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
