'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { trpc } from "@/utils/trpc"
import { ArrowLeft, EllipsisVertical } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

export default function DynamicBusinessPage() {
    const router = useRouter()
    const param = useParams()
    const businessId = param?.id

    const { data, isLoading, refetch } = trpc.business.getById.useQuery({ id: businessId as string })

    const handleToggleStatus = trpc.business.toggleActivity.useMutation({
        onSuccess() {
            toast.success("Activity status changed")
            refetch()
        },
        onError(error) {
            toast.error(error?.message)
        },
    })

    const handleDelete = trpc.business.delete.useMutation({
        onSuccess() {
            toast.success("Business deleted")
            router.push('/business')
        },
        onError(error) {
            toast.error(error?.message)
        },
    })

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => history.back()} className="cursor-pointer" >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {isLoading ? (
                                <Skeleton className="w-48 h-6" />
                            ) : (
                                data?.name
                            )}
                        </h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-muted-foreground">
                                Business ID: {businessId}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {data?.isActive ? (
                        <Badge className="rounded-sm bg-green-100 text-emerald-800 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            Active
                        </Badge>
                    ) : (
                        <Badge className="rounded-sm bg-red-100 text-red-800 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                            Inactive
                        </Badge>)}
                    <Button className="cursor-pointer" >
                        Create review link
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="cursor-pointer text-zinc-500 hover:text-zinc-700">
                                <EllipsisVertical className="size-5" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48 border border-zinc-200" >
                            <DropdownMenuLabel className="text-xs text-zinc-500">
                                More options
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={async () => await handleToggleStatus.mutateAsync({ id: data?.id! })} className="cursor-pointer focus:bg-secondary focus:text-secondary-foreground">
                                    {data?.isActive ? "Set as inactive" : "Set as active"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={async () => await handleDelete.mutateAsync({ id: data?.id! })} className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-100" >
                                    Delete business
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                    <h3 className="text-xl font-semibold mt-1">
                        {isLoading ? <Skeleton className="w-16 h-5" /> : "1,245"}
                    </h3>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                    <h3 className="text-xl font-semibold mt-1">
                        {isLoading ? <Skeleton className="w-16 h-5" /> : "4.6 ⭐"}
                    </h3>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Response Rate</p>
                    <h3 className="text-xl font-semibold mt-1">
                        {isLoading ? <Skeleton className="w-16 h-5" /> : "78%"}
                    </h3>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Requests Sent</p>
                    <h3 className="text-xl font-semibold mt-1">
                        {isLoading ? <Skeleton className="w-16 h-5" /> : "320"}
                    </h3>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white border rounded-xl p-5">
                    <h2 className="font-semibold mb-4">Recent Reviews</h2>
                    <div className="space-y-4 text-sm text-muted-foreground">
                        <p>No reviews yet (connect your backend here)</p>
                    </div>
                </div>

                <div className="bg-white border rounded-xl p-5">
                    <h2 className="font-semibold mb-4">Business Info</h2>
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="text-muted-foreground">Status</p>
                            <p>{data?.isActive ? "Active" : "Inactive"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Created</p>
                            <p>
                                {new Date(data?.createdAt!).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Owner</p>
                            <p>
                                You
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}