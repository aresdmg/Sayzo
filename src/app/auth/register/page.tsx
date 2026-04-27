'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Register, registerSchema } from "@/types/auth"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Eye, EyeClosed, Loader2, Building2, Link2, MessageSquareText } from "lucide-react"
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
        <div className="relative min-h-screen overflow-hidden bg-zinc-50">
            <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.05fr] lg:items-center">
                    <section className="hidden lg:block">
                        <div className="max-w-md space-y-5">
                            <div className="space-y-3">
                                <h1 className="font-heading text-[2rem] font-semibold tracking-tight text-zinc-950">
                                    Start with a focused customer feedback workspace.
                                </h1>
                            </div>
                            <div className="grid gap-2.5">
                                {[
                                    { icon: Building2, title: "Set up business profiles", body: "Create a clean structure for every location or brand you manage." },
                                    { icon: Link2, title: "Publish review pages", body: "Generate customer-facing review links inside the same workflow." },
                                    { icon: MessageSquareText, title: "Monitor feedback clearly", body: "Keep comments and ratings visible once collection begins." },
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
                                    <div className="text-xs font-medium uppercase tracking-[0.22em] text-blue-600">Create account</div>
                                    <h2 className="font-heading text-[1.75rem] font-semibold tracking-tight text-zinc-950">
                                        Create your Sayzo account
                                    </h2>
                                    <p className="text-sm leading-5 text-zinc-600">
                                        Set up your workspace and start collecting customer feedback through professional review pages.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(handleRegister)} className="mt-5 space-y-3.5">
                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium text-zinc-800">Full name</Label>
                                        <Input
                                            {...register("name")}
                                            placeholder="Jane Smith"
                                            className="border-zinc-300 bg-white text-sm text-zinc-950 shadow-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                        {errors.name && (
                                            <p className="flex items-center gap-1.5 text-sm text-red-600">
                                                <AlertCircle className="size-4" />
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

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
                                                placeholder="Create a secure password"
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
                                        className="cursor-pointer w-full bg-blue-600 text-sm text-white shadow-sm shadow-blue-950/10 hover:bg-blue-700"
                                    >
                                        {mutation.isPending ? <Loader2 className="animate-spin" /> : "Create account"}
                                    </Button>
                                </form>

                                <div className="mt-4 border-t border-zinc-200 pt-3 text-sm text-zinc-500">
                                    Already have an account?{" "}
                                    <Link href="/auth/login" className="font-medium text-blue-600 transition hover:text-blue-700">
                                        Sign in
                                    </Link>
                                </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
