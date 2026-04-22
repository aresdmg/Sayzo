'use client'

import { Button } from "@/components/ui/button";
import { AlertCircle, LayoutGrid, List, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Business, businessesSchema } from "@/types/business";
import { zodResolver } from "@hookform/resolvers/zod";
import { USER_INFO_KEY } from "../auth/register/page";

export default function BusinessPage() {
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<Business>({
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
                                className="w-2/5 h-auto bg-white border shadow-sm border-zinc-400/30 rounded-xl p-5 " >
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
            <div className="w-full h-auto py-5 flex justify-end items-center z-10 ">
                <div className="w-1/2 flex justify-center items-center" >
                    <h1 className="text-lg font-medium" >Your businesses</h1>
                </div>
                <div className="w-1/2 flex justify-center items-center space-x-1">
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
        </>
    )
}