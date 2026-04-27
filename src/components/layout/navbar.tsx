"use client";

import Link from "next/link";
import { trpc } from "@/utils/trpc";
import {
    getStoredUserInfoRaw,
    parseStoredUserInfo,
    setStoredUserInfo,
    subscribeStoredUserInfo,
} from "@/lib/auth-storage";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { SayzoLogo } from "../brand/sayzo-logo";

export default function Navbar() {
    const { data, isPending } = trpc.user.me.useQuery(undefined,
        {
            refetchOnMount: true,
            placeholderData: (prev) => prev
        }
    );

    const storedUserRaw = useSyncExternalStore(subscribeStoredUserInfo, getStoredUserInfoRaw, () => null);
    const localUser = useMemo(() => parseStoredUserInfo(storedUserRaw), [storedUserRaw]);

    useEffect(() => {
        if (data?.avatar || data?.name) {
            const existing = parseStoredUserInfo(getStoredUserInfoRaw()) ?? {};

            setStoredUserInfo({
                ...existing,
                avatar: data?.avatar ?? existing.avatar,
                name: data?.name ?? existing.name,
            });
        }
    }, [data]);

    const avatarSrc = data?.avatar || localUser?.avatar || "";
    const userName = data?.name || localUser?.name || "U";


    return (
        <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/92 backdrop-blur">
            <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/home" className="inline-flex">
                        <SayzoLogo compact />
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {[
                            { href: "/home", label: "Home" },
                            { href: "/business", label: "Business" },
                            { href: "/reviews", label: "Reviews" },
                            { href: "/profile", label: "Profile" },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
                                href={item.href}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                        <div className="text-sm font-medium text-zinc-950">{userName}</div>
                        <div className="text-xs text-zinc-500">Sayzo workspace</div>
                    </div>

                    {isPending ? (
                        <Skeleton className="h-10 w-10 rounded-full" />
                    ) : (
                        <Link href="/profile">
                            <Avatar className="h-10 w-10 ring-1 ring-zinc-200">
                                <AvatarImage src={avatarSrc} />
                                <AvatarFallback className="bg-blue-50 font-medium text-blue-700">
                                    {userName.charAt(0)?.toUpperCase() ?? "U"}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
