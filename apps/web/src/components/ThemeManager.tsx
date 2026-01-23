"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ThemeManager() {
    const pathname = usePathname();

    useEffect(() => {
        const root = document.documentElement;

        // Remove existing theme
        root.removeAttribute("data-theme");

        // Apply new theme based on path
        if (pathname.startsWith("/practice")) {
            root.setAttribute("data-theme", "practice");
        } else if (pathname.startsWith("/dashboard")) {
            root.setAttribute("data-theme", "dashboard");
        } else if (pathname.startsWith("/settings")) {
            root.setAttribute("data-theme", "settings");
        } else if (pathname === "/" || pathname === "") {
            root.setAttribute("data-theme", "home");
        }
    }, [pathname]);

    return null;
}
