'use client'

import { setStoredUserInfo } from "@/lib/auth-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Login, loginSchema } from "@/types/auth"
import { trpc } from "@/utils/trpc"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Eye, EyeClosed, Loader2, ShieldCheck, Star, TrendingUp } from "lucide-react"
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
        onSuccess: (e) => {
            setStoredUserInfo(e)
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
        <div className="relative min-h-screen overflow-hidden bg-zinc-50">
            <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.05fr] lg:items-center">
                    <section className="hidden lg:block">
                        <div className="max-w-md space-y-5">
                            <div className="space-y-3">
                                <h1 className="font-heading text-[2rem] font-semibold tracking-tight text-zinc-950">
                                    A simpler workspace for review operations.
                                </h1>
                            </div>
                            <div className="grid gap-2.5">
                                {[
                                    { icon: Star, title: "Track live feedback", body: "Keep ratings and comments visible in one operational workspace." },
                                    { icon: ShieldCheck, title: "Reduce duplicate noise", body: "Built-in protection helps keep submitted reviews cleaner." },
                                    { icon: TrendingUp, title: "Manage business growth", body: "Move from review collection to insight without leaving the platform." },
                                ].map((item) => {
                                    const Icon = item.icon

                                    return (
                                        <div key={item.title} className="rounded-xl border border-zinc-200 bg-white/80 p-3.5 shadow-sm">
                                            <div className="flex items-start gap-3">
                                                <div className="flex size-9 items-center justify-center text-blue-700">
                                                    <Icon className="size-4" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <div className="text-sm font-medium text-zinc-950">{item.title}</div>
                                                    <p className="text-sm leading-5 text-zinc-600">{item.body}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto w-full max-w-lg">
                        <div className="rounded-lg border border-zinc-200/80 bg-white px-5 py-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.18)] sm:px-6 sm:py-6">
                                <div className="space-y-2.5">
                                    <div className="text-xs font-medium uppercase tracking-[0.22em] text-blue-600">Sign in</div>
                                    <h2 className="font-heading text-[1.75rem] font-semibold tracking-tight text-zinc-950">
                                        Sign in to Sayzo
                                    </h2>
                                    <p className="text-sm leading-5 text-zinc-600">
                                        Access your workspace to manage businesses, review links, and customer feedback.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(handleLogin)} className="mt-5 space-y-3.5">
                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium text-zinc-800">Email</Label>
                                        <Input
                                            {...register("email")}
                                            placeholder="name@company.com"
                                            className="border-zinc-300 bg-white text-sm text-zinc-950 shadow-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                        {errors.email && (
                                            <p className="flex items-center gap-1.5 text-sm text-red-600">
                                                <AlertCircle className="size-4" />
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium text-zinc-800">Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                {...register("password")}
                                                placeholder="Enter your password"
                                                className="border-zinc-300 bg-white pr-10 text-sm text-zinc-950 shadow-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(prev => !prev)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-800"
                                            >
                                                {showPassword ? <Eye className="size-5" /> : <EyeClosed className="size-5" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="flex items-center gap-1.5 text-sm text-red-600">
                                                <AlertCircle className="size-4" />
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={mutation.isPending}
                                        className="cursor-pointer w-full bg-blue-600 text-sm font-medium text-white shadow-sm shadow-blue-950/10 hover:bg-blue-700"
                                    >
                                        {mutation.isPending ? <Loader2 className="animate-spin" /> : "Log in"}
                                    </Button>
                                </form>

                                <div className="mt-4 border-t border-zinc-200 pt-3 text-sm text-zinc-500">
                                    Don’t have an account?{" "}
                                    <Link href="/auth/register" className="font-medium text-blue-600 transition hover:text-blue-700">
                                        Create one
                                    </Link>
                                </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
