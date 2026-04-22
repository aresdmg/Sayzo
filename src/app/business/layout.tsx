'use client'

import Navbar from "@/components/layout/navbar"
import React from "react"

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
        </>
    )
}