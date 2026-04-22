'use client'

import Navbar from "@/components/layout/navbar"
import React from "react"

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
        </>
    )
}