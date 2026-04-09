"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FileText,
    Home,
    MessageCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface NavbarProps extends React.ComponentPropsWithoutRef<"header"> {
    className?: string;
}

export interface BottomNavProps
    extends React.ComponentPropsWithoutRef<"nav"> {
    className?: string;
}

type NavItem = {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: (pathname: string) => boolean;
};

const primaryNavItems: NavItem[] = [
    {
        href: "/chat",
        label: "Chat",
        icon: MessageCircle,
        isActive: (pathname) => pathname.startsWith("/chat"),
    },
    {
        href: "/avatar/idle",
        label: "Home",
        icon: Home,
        isActive: (pathname) =>
            pathname === "/" || pathname.startsWith("/home") || pathname.startsWith("/avatar"),
    },
    {
        href: "/medical_details",
        label: "Medical",
        icon: FileText,
        isActive: (pathname) => pathname.startsWith("/medical_details"),
    },
];

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
    ({ className, ...props }, ref) => {
        return (
            <header
                ref={ref}
                className={cn(
                    "sticky top-0 z-50 border-b border-border/70 bg-background/95 px-4 backdrop-blur",
                    className
                )}
                {...props}
            >
                <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
                    <Link
                        href="/avatar/idle"
                        className="flex items-center gap-3 text-primary transition-colors hover:text-primary/90"
                    >
                        <Image
                            src="/logo.svg"
                            alt="BetterYou logo"
                            width={34}
                            height={34}
                            className="rounded-xl"
                        />
                        <div className="leading-tight">
                            <p className="text-sm font-semibold text-foreground">
                                BetterYou
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Connect the dots.
                            </p>
                        </div>
                    </Link>
                </div>
            </header>
        );
    }
);

Navbar.displayName = "Navbar";

export const BottomNav = React.forwardRef<HTMLElement, BottomNavProps>(
    ({ className, ...props }, ref) => {
        const pathname = usePathname();

        return (
            <nav
                ref={ref}
                className={cn(
                    "z-40 mt-auto px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3",
                    className
                )}
                {...props}
            >
                <div className="mx-auto flex max-w-md items-center justify-between rounded-[28px] border border-border/70 bg-background/95 px-3 py-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)] backdrop-blur">
                    {primaryNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.isActive(pathname);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex min-w-[88px] flex-col items-center justify-center gap-1 rounded-2xl px-4 py-2 text-xs font-medium transition-all",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        );
    }
);

BottomNav.displayName = "BottomNav";
