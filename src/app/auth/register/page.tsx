'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Register, registerSchema } from "@/types/auth"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Eye, EyeClosed, Loader2 } from "lucide-react"
import { trpc } from "@/utils/trpc"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUp() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<Register>({
        resolver: zodResolver(registerSchema),
        mode: "onChange"
    })

    const mutation = trpc.user.register.useMutation({
        onSuccess: () => {
            toast.success("User created")
            reset()
            router.push('/auth/login')
        },
        onError: (e) => {
            toast.error(e.message)
        },
    })

    const handleRegister = async (data: Register) => {
        await mutation.mutateAsync({
            name: data.name,
            email: data.email,
            password: data.password
        })
    }

    return (
        <>
            <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 relative overflow-hidden">

                <div className="absolute inset-0">
                    <div className="absolute -top-30 left-1/2 -translate-x-1/2 w-150 h-150 bg-blue-500/20 blur-[120px] rounded-full" />
                    <div className="absolute -bottom-25 -right-20 w-100 h-100 bg-indigo-400/20 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-zinc-200 shadow-xl bg-white/80 backdrop-blur-xl">
                    <div className="hidden md:flex flex-col justify-between p-10 bg-linear-to-br from-blue-600 to-indigo-500 text-white">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center font-bold">
                                    S
                                </div>
                                <span className="text-lg font-semibold">Sayzo</span>
                            </div>

                            <h2 className="text-3xl font-semibold leading-tight">
                                Build faster. <br /> Scale smarter.
                            </h2>

                            <p className="mt-4 text-sm text-white/90 max-w-xs">
                                The modern platform to manage revies and growth — all in one place.
                            </p>
                        </div>

                        <p className="text-xs text-white/80">
                            © {new Date().getFullYear()} Sayzo Inc.
                        </p>
                    </div>

                    <div className="p-8 md:p-10 bg-white/90">
                        <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-semibold text-zinc-900">
                                    Create your account
                                </h1>
                                <p className="text-sm text-zinc-500">
                                    Start your 14-day free trial. No credit card required.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-zinc-700">Full Name</Label>
                                    <Input {...register("name")} placeholder="Elon Musk" className="h-11 bg-white border-zinc-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all" />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm flex gap-1 items-center">
                                            <AlertCircle className="size-4" />
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-zinc-700">Email</Label>
                                    <Input {...register("email")} placeholder="elon@tesla.com" className="h-11 bg-white border-zinc-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all" />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm flex gap-1 items-center">
                                            <AlertCircle className="size-4" />
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-zinc-700">Password</Label>
                                    <div className="relative">
                                        <Input type={showPassword ? "text" : "password"} {...register("password")} placeholder="••••••••" className="h-11 pr-10 bg-white border-zinc-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"/>
                                        <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700">
                                            {showPassword ? <Eye className="size-5" /> : <EyeClosed className="size-5" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-sm flex gap-1 items-center">
                                            <AlertCircle className="size-4" />
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Button type="submit" disabled={mutation.isPending} className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer" >
                                {mutation.isPending ? (<Loader2 className="animate-spin" />) : ("Create account")}
                            </Button>

                            <p className="text-sm text-zinc-500 text-center">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}