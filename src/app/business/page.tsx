'use client'

import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronRight, LayoutGrid, List, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Business, businessesSchema } from "@/types/business";
import { zodResolver } from "@hookform/resolvers/zod";
import { USER_INFO_KEY } from "../auth/register/page";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function BusinessPage() {
    const router = useRouter()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Business>({
        resolver: zodResolver(businessesSchema),
        mode: "onChange"
    })
    const [isList, setIsList] = useState(true)
    const [showCreateBusinessForm, setShowCreateBusinessForm] = useState(false)

    const businessCreation = trpc.business.create.useMutation({
        onSuccess() {
            toast.success("Congratulations")
            reset()
            setShowCreateBusinessForm(e => !e)
        },
        onError(e) {
            toast.error(e.message)
        },
        onSettled() {
            myBusiness.refetch()
        }
    })

    const handleBusinessCreation = async (data: Business) => {
        const storedUser = localStorage.getItem(USER_INFO_KEY)

        if (!storedUser) {
            toast.error("User not found")
            return
        }

        const localUser = JSON.parse(storedUser)

        try {
            await businessCreation.mutateAsync({
                ownerId: localUser?.id,
                name: data.name
            });
        } catch (error) {
            console.error("Mutation failed:", error);
        }
    }

    const myBusiness = trpc.business.myBusinesses.useQuery(undefined, {
        refetchOnMount: true
    })

    return (
        <>
            <AnimatePresence>
                {
                    showCreateBusinessForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="w-full h-screen bg-zinc-500/10 fixed backdrop-blur-3xl flex justify-center items-center" >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="w-1/3 h-auto bg-white border shadow-sm border-zinc-400/30 rounded-xl p-5 " >
                                <form onSubmit={handleSubmit(handleBusinessCreation)} className="w-full flex justify-center items-center flex-col space-y-5" >
                                    <div className="w-full flex justify-center items-center flex-col -space-y-0.5" >
                                        <h1 className="text-lg font-semibold" > Create your business </h1>
                                        <p className="text-xs text-zinc-700" >Get started with your business in seconds</p>
                                    </div>
                                    <div className="w-full flex justify-center items-start flex-col space-y-1.5" >
                                        <Label>Name</Label>
                                        <Input placeholder="Name of the business" {...register("name")} />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm flex gap-1 items-center">
                                                <AlertCircle className="size-4" />
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-full flex justify-end items-center space-x-1.5" >
                                        <Button className="cursor-pointer" type="button" variant={"destructive"} onClick={() => setShowCreateBusinessForm(e => !e)} >
                                            Cancel
                                        </Button>
                                        <Button className="cursor-pointer" type="submit" disabled={businessCreation.isPending} >
                                            {
                                                businessCreation.isPending ? <span className="animate-spin" ><Loader2 /></span> : "Continue"
                                            }
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div >
                    )
                }
            </AnimatePresence >
            <div className="w-full h-auto px-60 py-5 flex justify-end items-center z-10 ">
                <div className="w-1/2 flex justify-start items-center" >
                    <h1 className="text-lg font-medium" >Your businesses</h1>
                </div>
                <div className="w-1/2 flex justify-end items-center space-x-2.5">
                    <Button className="cursor-pointer" variant={"secondary"} onClick={() => setIsList(e => !e)} >
                        {isList ? <List size={32} /> : <LayoutGrid size={32} />}
                    </Button>
                    <Button className="cursor-pointer" onClick={() => setShowCreateBusinessForm(e => !e)} >
                        <Plus />
                        <p>
                            Add a Business
                        </p>
                    </Button>
                </div>
            </div>
            <div className="w-full px-60 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 -mt-5">
                {
                    myBusiness.isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} >
                                <Skeleton className="w-full h-52 rounded-xl" />
                            </div>
                        ))
                    ) : myBusiness.data?.map((e) => (
                        <div key={e.id} className="group border border-zinc-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all" >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                                    {e.name?.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="font-semibold text-zinc-900 leading-tight">
                                        {e.name}
                                    </h2>
                                    <p className="text-xs text-zinc-500">
                                        ID: {e.id}
                                    </p>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-1">
                                <p className="text-xs text-zinc-500">Slug</p>
                                <p className="text-sm text-zinc-700 font-medium truncate">
                                    {e.slug}
                                </p>
                            </div>
                            <div className="mt-5 flex items-center justify-between">
                                <Badge className={e.isActive ? `bg-green-100 text-emerald-800` : `bg-red-100 text-red-800`} >
                                    {e.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <Button variant={"link"} className="cursor-pointer" onClick={() => router.push(`/business/${e.id}`)} >
                                    <p> View more </p>
                                    <span>
                                        <ChevronRight />
                                    </span>
                                </Button>
                            </div>
                        </div>
                    ))
                }
            </div >
        </>
    )
}