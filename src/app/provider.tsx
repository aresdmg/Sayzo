"use client"

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "@/utils/trpc";
import { httpBatchLink } from "@trpc/react-query";

export function Provider({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient()
    const trpcClient = trpc.createClient({
        links: [
            httpBatchLink({
                url: "/api/trpc"
            })
        ]
    })

    return (
        <>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </trpc.Provider>
        </>
    )
}