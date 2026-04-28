'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  LayoutGrid,
  Link2,
  List,
  Loader2,
  Plus,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Business, businessesSchema } from "@/types/business";
import { trpc } from "@/utils/trpc";

export default function BusinessPage() {
  const [isList, setIsList] = useState(false);
  const [showCreateBusinessForm, setShowCreateBusinessForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Business>({
    resolver: zodResolver(businessesSchema),
    mode: "onChange",
  });

  const myBusiness = trpc.business.myBusinesses.useQuery(undefined, {
    placeholderData: (prev) => prev,
  });

  const businessCreation = trpc.business.create.useMutation({
    onSuccess() {
      toast.success("Business created");
      reset();
      setShowCreateBusinessForm(false);
    },
    onError(error) {
      toast.error(error.message);
    },
    onSettled() {
      myBusiness.refetch();
    },
  });

  const businessList = myBusiness.data ?? [];
  const activeCount = businessList.filter((item) => item.isActive).length;
  const reviewLinkCount = businessList.filter((item) => item.reviewLink).length;

  const summaryCards = useMemo(() => [
    {
      label: "Businesses",
      value: String(businessList.length),
      note: "Profiles managed in your workspace",
      icon: Building2,
    },
    {
      label: "Active",
      value: String(activeCount),
      note: "Ready to receive customer feedback",
      icon: TrendingUp,
    },
    {
      label: "Review links",
      value: String(reviewLinkCount),
      note: "Businesses already equipped for collection",
      icon: Link2,
    },
  ], [activeCount, businessList.length, reviewLinkCount]);

  const handleBusinessCreation = async (data: Business) => {
    await businessCreation.mutateAsync({
      name: data.name,
    });
  };

  return (
    <>
      <AnimatePresence>
        {showCreateBusinessForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/35 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="w-full max-w-xl rounded-[28px] border border-zinc-200 bg-white shadow-[0_30px_90px_-38px_rgba(15,23,42,0.38)]"
            >
              <form onSubmit={handleSubmit(handleBusinessCreation)} className="space-y-6 p-6 sm:p-7">
                <div className="space-y-2">
                  <div className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Create business</div>
                  <h2 className="font-heading text-2xl font-semibold tracking-tight text-zinc-950">
                    Add a business to your review operations workspace
                  </h2>
                  <p className="text-sm leading-6 text-zinc-600">
                    Create the business profile first. You can generate its public review link after setup.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-zinc-800">Business name</Label>
                  <Input
                    placeholder="Acme Service Studio"
                    {...register("name")}
                    className="h-12 border-zinc-300 bg-white text-zinc-950 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  {errors.name && (
                    <p className="flex items-center gap-1.5 text-sm text-red-600">
                      <AlertCircle className="size-4" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowCreateBusinessForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={businessCreation.isPending} className="bg-blue-600 text-white hover:bg-blue-700">
                    {businessCreation.isPending ? <Loader2 className="animate-spin" /> : "Create business"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-[calc(100vh-3rem)] bg-zinc-50">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <section className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_26px_80px_-42px_rgba(15,23,42,0.25)]">
            <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-10">
              <div className="space-y-5">
                <Badge className="w-fit border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50">
                  Business management
                </Badge>
                <div className="space-y-3">
                  <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                    Organize every business you manage from one clean workspace.
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                    Create business profiles, track which ones are active, and move each location into review collection and analytics.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button onClick={() => setShowCreateBusinessForm(true)} className="bg-blue-600 text-white hover:bg-blue-700">
                    <Plus className="size-4" />
                    Add business
                  </Button>
                  <Button variant="outline" onClick={() => setIsList((value) => !value)}>
                    {isList ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
                    {isList ? "Grid view" : "List view"}
                  </Button>
                </div>
              </div>

              <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5">
                <div className="text-sm font-medium text-zinc-950">Operating model</div>
                <div className="mt-5 grid gap-3">
                  {[
                    "Create a profile for each business you operate",
                    "Generate public review destinations when each business is ready",
                    "Use business dashboards to monitor reviews and ratings over time",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
                      <CheckCircle2 className="mt-0.5 size-4 text-blue-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {myBusiness.isLoading
              ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-36 rounded-[24px]" />)
              : summaryCards.map((card) => {
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

          <section className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-none sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-950">Your businesses</h2>
                <p className="mt-1 text-sm text-zinc-600">Open a business to manage its review link, activity status, and analytics.</p>
              </div>
              <div className="text-sm text-zinc-500">{businessList.length} total profiles</div>
            </div>

            {myBusiness.isLoading ? (
              <div className={`grid gap-4 ${isList ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                {Array.from({ length: isList ? 4 : 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-36 rounded-[24px]" />
                ))}
              </div>
            ) : businessList.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Building2 className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-zinc-950">No businesses yet</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Add your first business to begin collecting customer reviews through a dedicated Sayzo page.
                </p>
                <Button onClick={() => setShowCreateBusinessForm(true)} className="mt-5 bg-blue-600 text-white hover:bg-blue-700">
                  Create your first business
                </Button>
              </div>
            ) : (
              <div className={`grid gap-4 ${isList ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                {businessList.map((business) => (
                  <Link
                    key={business.id}
                    href={`/business/${business.id}`}
                    className="group rounded-[24px] border border-zinc-200 bg-zinc-50 p-5 transition hover:border-blue-200 hover:bg-blue-50/30"
                  >
                    <div className={`flex ${isList ? "flex-col gap-5 sm:flex-row sm:items-center sm:justify-between" : "flex-col gap-5"}`}>
                      <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white">
                          {business.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-zinc-950">{business.name}</div>
                          <div className="mt-1 text-sm text-zinc-600">
                            {business.reviewLink ? "Review link available" : "Review link not generated yet"}
                          </div>
                        </div>
                      </div>

                      <div className={`flex ${isList ? "items-center gap-3 sm:min-w-[280px] sm:justify-end" : "items-center justify-between"} `}>
                        <Badge
                          className={
                            business.isActive
                              ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                              : "border border-zinc-200 bg-white text-zinc-600 hover:bg-white"
                          }
                        >
                          {business.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                          Open workspace
                          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
