"use client"

import { trpc } from "@/utils/trpc"

export default function Home() {
    const { data, isLoading, isError, error } = trpc.health.useQuery()

    return (
        <>
            {isLoading ? <span>Loading</span> : (data && JSON.stringify(data))}
            {
                isError ? (error && JSON.stringify(error)) : null
            }
        </>
    )
}
