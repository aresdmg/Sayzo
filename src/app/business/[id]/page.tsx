'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { trpc } from "@/utils/trpc"
import { ArrowLeft, Copy, EllipsisVertical, Loader2, Share } from "lucide-react"
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

    const handleGenerateReviewLink = trpc.business.createReviewLink.useMutation({
        onSuccess: () => {
            refetch()
        },
        onError: (e) => {
            toast.error(e.message)
        },
    })

    const handleLinkCopying = (reviewLink: string) => {
        const baseDomain = window.location.origin
        const fullLink = baseDomain + reviewLink
        window.navigator.clipboard.writeText(fullLink)
        toast.info("Link copied")
    }

    return (
        <div className="w-full max-w-7xl mx-auto py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => history.back()} className="cursor-pointer" >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            {isLoading ? (
                                <Skeleton className="w-48 h-6" />
                            ) : (
                                data?.name
                            )}
                        </h1>
                        <p className="text-xs text-zinc-400" >
                            ID: {data?.id }
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {
                        data?.isActive ? (
                            <Badge className="rounded-sm bg-green-100 text-emerald-800 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                Active
                            </Badge>
                        ) : (
                            <Badge className="rounded-sm bg-red-100 text-red-800 flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full" />
                                Inactive
                            </Badge>)
                    }
                    {
                        data?.reviewLink ?
                            <div className="flex justify-center items-end space-x-1.5" >
                                <Button className="cursor-pointer translate-y-0" variant={"secondary"} onClick={() => handleLinkCopying(data?.reviewLink!)} size={"sm"} >
                                    <Copy className="size-4" />
                                    <p className="text-sm" >
                                        Copy
                                    </p>
                                </Button>
                                <Button className="cursor-pointer translate-y-0" variant={"secondary"} size={"sm"} >
                                    <Share className="size-4" />
                                    <p className="text-sm">
                                        Share QR
                                    </p>
                                </Button>
                            </div>
                            :
                            <Button className="cursor-pointer" disabled={handleGenerateReviewLink?.isPending} onClick={async () => await handleGenerateReviewLink.mutateAsync({ id: data?.id! })} >
                                {
                                    handleGenerateReviewLink.isPending ? <span className="animate-spin" ><Loader2 /></span> : "Create review link"
                                }
                            </Button>
                    }
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

            <div className="w-full h-auto py-5 flex justify-center items-start flex-col space-y-1.5" >
                <div className="w-full flex justify-between items-center" >
                    <h1 className="text-lg font-medium" >Business stats</h1>
                </div>
                <div className="w-full flex justify-center items-center space-x-3.5" >
                    <Card className="w-1/3 h-auto" >
                        <CardHeader>
                            <CardTitle>Total Reviews</CardTitle>
                            <CardDescription className="text-xs">Total reviews of the busines</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card Content</p>
                        </CardContent>
                    </Card>
                    <Card className="w-1/3 h-auto" >
                        <CardHeader>
                            <CardTitle>Average rating</CardTitle>
                            <CardDescription className="text-xs" >Average rating of the business</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card Content</p>
                        </CardContent>
                    </Card>
                    <Card className="w-1/3 h-auto" >
                        <CardHeader>
                            <CardTitle>Response Rate</CardTitle>
                            <CardDescription className="text-xs" >
                                Response rate of your users
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card Content</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div>
            </div>
        </div>
    )
}