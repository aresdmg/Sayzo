import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar"
import { BrainCircuit } from "lucide-react"

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="h-12 flex justify-center items-center border-b border-zinc-200 space-x-1.5">
                    <BrainCircuit className="size-5" />
                    <span className="text-xl font-semibold text-zinc-900">Sayzo</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
