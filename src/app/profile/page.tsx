'use client'

import { Building2, Loader2, LogOut, Mail, ShieldCheck, Star, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { clearStoredUserInfo } from "@/lib/auth-storage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

export default function Profile() {
  const router = useRouter();
  const { data: user, isLoading } = trpc.user.me.useQuery(undefined, {
    placeholderData: (prev) => prev,
  });
  const businesses = trpc.business.myBusinesses.useQuery(undefined, {
    refetchOnMount: true,
  });

  const logout = trpc.user.logout.useMutation({
    onSuccess() {
      clearStoredUserInfo();
      toast.success("Logged out");
      router.push("/auth/login");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const businessList = businesses.data ?? [];
  const activeCount = businessList.filter((item) => item.isActive).length;
  const withLinksCount = businessList.filter((item) => item.reviewLink).length;

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-zinc-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_26px_80px_-42px_rgba(15,23,42,0.25)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <Badge className="w-fit border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50">
                Account profile
              </Badge>
              <div className="space-y-3">
                <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                  Your Sayzo account and workspace identity.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                  Review your account details, see the current size of your workspace, and sign out when needed.
                </p>
              </div>
              <Button
                variant="outline"
                disabled={logout.isPending}
                onClick={async () => await logout.mutateAsync()}
                className="w-fit"
              >
                {logout.isPending ? <Loader2 className="animate-spin" /> : <LogOut className="size-4" />}
                Sign out
              </Button>
            </div>

            <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5">
              <div className="text-sm font-medium text-zinc-950">Account summary</div>
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Access level</div>
                  <div className="mt-2 text-sm font-medium text-zinc-950">Business workspace owner</div>
                  <div className="mt-1 text-sm text-zinc-600">You can manage businesses, review links, and analytics inside this account.</div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-4 text-blue-600" />
                    <p className="text-sm leading-6 text-zinc-600">
                      Authentication is handled with secure access and refresh tokens, while customer review collection uses duplicate-prevention checks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {isLoading || businesses.isLoading
            ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-36 rounded-[24px]" />)
            : [
                { label: "Businesses", value: String(businessList.length), note: "Profiles in your workspace", icon: Building2 },
                { label: "Active", value: String(activeCount), note: "Currently able to collect reviews", icon: Star },
                { label: "Review links", value: String(withLinksCount), note: "Businesses ready to receive feedback", icon: ShieldCheck },
              ].map((card) => {
                const Icon = card.icon;

                return (
                  <Card key={card.label} className="border border-zinc-200/80 bg-white shadow-none ring-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardDescription>{card.label}</CardDescription>
                          <CardTitle className="mt-2 text-3xl font-semibold text-zinc-950">{card.value}</CardTitle>
                        </div>
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                          <Icon className="size-5" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 text-sm text-zinc-600">{card.note}</CardContent>
                  </Card>
                );
              })}
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.44fr_0.56fr]">
          <Card className="border border-zinc-200/80 bg-white shadow-none ring-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-zinc-950">Identity</CardTitle>
              <CardDescription>Your primary account details inside Sayzo.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-48 rounded-[24px]" />
              ) : (
                <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-16 ring-1 ring-zinc-200">
                      <AvatarImage src={user?.avatar ?? ""} />
                      <AvatarFallback className="bg-blue-50 font-medium text-blue-700">
                        {user?.name?.charAt(0).toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-lg font-semibold text-zinc-950">{user?.name}</div>
                      <div className="text-sm text-zinc-500">{user?.email}</div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
                      <User2 className="size-4 text-blue-600" />
                      <span>Account holder: {user?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
                      <Mail className="size-4 text-blue-600" />
                      <span>Contact email: {user?.email}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-zinc-200/80 bg-white shadow-none ring-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-zinc-950">Workspace snapshot</CardTitle>
              <CardDescription>A quick read on what this account currently manages.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {businesses.isLoading ? (
                Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-2xl" />)
              ) : (
                <>
                  <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4">
                    <div className="font-medium text-zinc-950">Business coverage</div>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      You currently manage {businessList.length} businesses, with {activeCount} active and {withLinksCount} already equipped with public review links.
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4">
                    <div className="font-medium text-zinc-950">Operational next step</div>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      If any active businesses do not have review links yet, open their business workspace and create the public page before customer outreach.
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4">
                    <div className="font-medium text-zinc-950">Session control</div>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Use the sign-out action above to clear your current session from this browser.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
