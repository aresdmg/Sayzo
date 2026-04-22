'use client'

import Navbar from "@/components/layout/navbar";
import React from "react";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="w-full h-auto" >
                {children}
            </main>
        </>
    )
}