'use client'

import Link from "next/link";
import { ArrowRight, Building2, CircleOff, Plus, Star, TrendingUp } from "lucide-react";
import { useMemo, useSyncExternalStore } from "react";

import { getStoredUserInfoRaw, parseStoredUserInfo, subscribeStoredUserInfo } from "@/lib/auth-storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

export default function HomePage() {
  const { data: user } = trpc.user.me.useQuery(undefined, {
    placeholderData: (prev) => prev,
  });
  const businesses = trpc.business.myBusinesses.useQuery(undefined, {
    refetchOnMount: true,
  });

  const storedUserRaw = useSyncExternalStore(subscribeStoredUserInfo, getStoredUserInfoRaw, () => null);
  const storedUser = useMemo(() => parseStoredUserInfo(storedUserRaw), [storedUserRaw]);

  const name = user?.name ?? storedUser?.name ?? "there";
  const businessList = businesses.data ?? [];
  const activeBusinesses = businessList.filter((business) => business.isActive).length;
  const inactiveBusinesses = businessList.length - activeBusinesses;

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-zinc-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_26px_80px_-42px_rgba(15,23,42,0.25)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <Badge className="w-fit border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50">
                Workspace overview
              </Badge>
              <div className="space-y-3">
                <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                  Welcome back, {name}.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                  Keep your review workflow moving: manage businesses, publish review links, and watch customer sentiment
                  develop over time.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
                  <Link href="/business">
                    Manage businesses
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/profile">Review profile settings</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5">
              <div className="text-sm font-medium text-zinc-950">What Sayzo helps you do</div>
              <div className="mt-5 grid gap-3">
                {[
                  "Create and manage multiple businesses from one account",
                  "Generate dedicated review collection pages for customers",
                  "Track rating trends and recent feedback in the dashboard",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {businesses.isLoading
            ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-36 rounded-[24px]" />)
            : [
                {
                  label: "Total businesses",
                  value: String(businessList.length),
                  note: "Accounts currently set up in your workspace",
                  icon: Building2,
                },
                {
                  label: "Active businesses",
                  value: String(activeBusinesses),
                  note: "Able to collect customer feedback now",
                  icon: TrendingUp,
                },
                {
                  label: "Inactive businesses",
                  value: String(inactiveBusinesses),
                  note: "Paused or not yet collecting reviews",
                  icon: CircleOff,
                },
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

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border border-zinc-200/80 bg-white shadow-none ring-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-zinc-950">Next actions</CardTitle>
              <CardDescription>Use the current product flow to expand review coverage.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {[
                {
                  title: "Add another business",
                  description: "Set up a new business profile before sending out review requests.",
                  href: "/business",
                },
                {
                  title: "Open your business workspace",
                  description: "See current businesses, statuses, and navigation into each dashboard.",
                  href: "/business",
                },
                {
                  title: "Check your account profile",
                  description: "Review personal account details and keep your workspace current.",
                  href: "/profile",
                },
              ].map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 transition hover:border-blue-200 hover:bg-blue-50/40"
                >
                  <div>
                    <div className="font-medium text-zinc-950">{action.title}</div>
                    <div className="mt-1 text-sm text-zinc-600">{action.description}</div>
                  </div>
                  <ArrowRight className="size-4 text-zinc-500" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-zinc-200/80 bg-white shadow-none ring-0">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-zinc-950">Businesses in your workspace</CardTitle>
                <CardDescription>Quick access to the businesses you’re currently managing.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/business">
                  <Plus className="size-4" />
                  Add business
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {businesses.isLoading ? (
                <div className="grid gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 rounded-2xl" />
                  ))}
                </div>
              ) : businessList.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Star className="size-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-zinc-950">Create your first business</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Once a business is created, you can activate it, generate a review page, and begin collecting feedback.
                  </p>
                  <Button asChild className="mt-5 bg-blue-600 text-white hover:bg-blue-700">
                    <Link href="/business">Go to business setup</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {businessList.slice(0, 6).map((business) => (
                    <Link
                      key={business.id}
                      href={`/business/${business.id}`}
                      className="flex items-center justify-between rounded-[22px] border border-zinc-200 bg-zinc-50 px-4 py-4 transition hover:border-blue-200 hover:bg-blue-50/35"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white">
                          {business.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-zinc-950">{business.name}</div>
                          <div className="mt-1 text-sm text-zinc-600">
                            {business.reviewLink ? "Review page available" : "Review page not generated yet"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={
                            business.isActive
                              ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                              : "border border-zinc-200 bg-white text-zinc-600 hover:bg-white"
                          }
                        >
                          {business.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <ArrowRight className="size-4 text-zinc-500" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
