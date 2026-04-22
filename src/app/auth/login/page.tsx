'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Login, loginSchema } from "@/types/auth"
import { trpc } from "@/utils/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Eye, EyeClosed, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function SignIn() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Login>({
        resolver: zodResolver(loginSchema),
        mode: "onChange"
    })

    const mutation = trpc.user.login.useMutation({
        onSuccess: () => {
            toast.success("Welcome")
            reset()
            router.push('/home')
        },
        onError: (e) => {
            toast.error(e.message)
        }
    })

    const handleLogin = async (data: Login) => {
        await mutation.mutateAsync({
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
                                Welcome back.
                            </h2>
                            <p className="mt-4 text-sm text-white/90 max-w-xs">
                                Log in to continue managing your workflows and scaling your business.
                            </p>
                        </div>

                        <p className="text-xs text-white/80">
                            © {new Date().getFullYear()} Sayzo Inc.
                        </p>
                    </div>

                    <div className="p-8 md:p-10 bg-white/90">
                        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-semibold text-zinc-900">
                                    Sign in to your account
                                </h1>
                                <p className="text-sm text-zinc-500">
                                    Enter your credentials to continue
                                </p>
                            </div>

                            <div className="space-y-5">
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
                                    <div className="flex justify-between items-center">
                                        <Label className="text-zinc-700">Password</Label>
                                        <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline" >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <div className="relative">
                                        <Input type={showPassword ? "text" : "password"} {...register("password")} placeholder="••••••••" className="h-11 pr-10 bg-white border-zinc-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" />
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
                                {mutation.isPending ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Login"
                                )}
                            </Button>

                            <p className="text-sm text-zinc-500 text-center">
                                Don’t have an account?{" "}
                                <Link href="/auth/register" className="text-blue-600 hover:underline font-medium" >
                                    Create one
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}