"use client";

import Link from "next/link";
import { trpc } from "@/utils/trpc";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { USER_INFO_KEY } from "@/app/auth/login/page";
import { useEffect, useMemo } from "react";

export default function Navbar() {
    const { data, isPending } = trpc.user.me.useQuery(undefined,
        {
            refetchOnMount: true,
            placeholderData: (prev) => prev
        }
    );

    const localUser = useMemo(() => {
        if (typeof window === "undefined") return null;
        try {
            return JSON.parse(localStorage.getItem(USER_INFO_KEY) ?? "null");
        } catch {
            return null;
        }
    }, []);

    useEffect(() => {
        if (data?.avatar || data?.name) {
            const existing =
                JSON.parse(localStorage.getItem(USER_INFO_KEY) ?? "{}");

            localStorage.setItem(
                USER_INFO_KEY,
                JSON.stringify({
                    ...existing,
                    avatar: data?.avatar ?? existing.avatar,
                    name: data?.name ?? existing.name,
                })
            );
        }
    }, [data]);

    const avatarSrc = data?.avatar || localUser?.avatar || "";
    const userName = data?.name || localUser?.name || "U";


    return (
        <div className="w-full h-12 bg-zinc-100 flex justify-start items-center px-5 border-b">
            <div className="w-1/2">
                <div className="w-1/2 flex justify-center items-center">
                    <Link href="/home" className="text-xl font-medium">
                        Sayzo
                    </Link>
                </div>
            </div>

            <div className="w-1/2 flex justify-between items-center">
                <div className="w-1/2 flex justify-evenly items-center">
                    <Link className="font-medium" href="/home">Home</Link>
                    <Link className="font-medium" href="/business">Business</Link>
                    <Link className="font-medium" href="/reviews">Reviews</Link>
                    <Link className="font-medium" href="/reviews">Contact us</Link>
                </div>

                <div className="w-1/2 h-full flex justify-center items-center">
                    {isPending ? (
                        <Skeleton className="w-10 h-10 rounded-full" />
                    ) : (
                        <Link href="/profile">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={avatarSrc} />
                                <AvatarFallback>
                                    {userName.charAt(0)?.toUpperCase() ?? "U"}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}