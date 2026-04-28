'use client'

import { MessageSquareText, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

export default function ReviewsPage() {
  const businesses = trpc.business.myBusinesses.useQuery(undefined, {
    placeholderData: (prev) => prev,
  });
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  const businessList = businesses.data ?? [];
  const effectiveSelectedBusinessId = selectedBusinessId ?? businessList[0]?.id ?? null;

  const selectedBusiness = businessList.find((business) => business.id === effectiveSelectedBusinessId) ?? null;
  const reviews = trpc.review.getByBusinessId.useQuery(
    { id: effectiveSelectedBusinessId ?? "" },
    {
      enabled: Boolean(effectiveSelectedBusinessId),
      placeholderData: (prev) => prev,
    }
  );

  const reviewList = reviews.data ?? [];
  const averageRating = (() => {
    if (reviewList.length === 0) return "0.0";

    const total = reviewList.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviewList.length).toFixed(1);
  })();

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-zinc-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_26px_80px_-42px_rgba(15,23,42,0.25)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.06fr_0.94fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <Badge className="w-fit border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50">
                Reviews workspace
              </Badge>
              <div className="space-y-3">
                <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                  Keep customer feedback visible, organized, and easy to act on.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                  Choose a business to review its latest customer comments, overall score, and current submission volume.
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5">
              <div className="text-sm font-medium text-zinc-950">How this page works</div>
              <div className="mt-5 grid gap-3">
                {[
                  "Select one of your businesses to load its protected review feed",
                  "Use the business detail workspace for link creation and activation controls",
                  "Monitor recent sentiment before diving deeper into each business dashboard",
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
                { label: "Businesses", value: String(businessList.length), note: "Available for review inspection", icon: MessageSquareText },
                { label: "Selected reviews", value: String(reviewList.length), note: "Loaded for the current business", icon: TrendingUp },
                { label: "Average rating", value: averageRating, note: "Calculated from the current feed", icon: Star },
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

        <section className="grid gap-4 xl:grid-cols-[0.42fr_0.58fr]">
          <Card className="border border-zinc-200/80 bg-white shadow-none ring-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-zinc-950">Choose a business</CardTitle>
              <CardDescription>Switch between businesses to inspect different review feeds.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {businesses.isLoading ? (
                Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-20 rounded-2xl" />)
              ) : businessList.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-center">
                  <p className="text-sm leading-6 text-zinc-600">
                    You need at least one business before reviews can be displayed here.
                  </p>
                  <Button asChild className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
                    <Link href="/business">Set up a business</Link>
                  </Button>
                </div>
              ) : (
                businessList.map((business) => (
                  <button
                    key={business.id}
                    type="button"
                    onClick={() => setSelectedBusinessId(business.id)}
                    className={`rounded-[22px] border p-4 text-left transition ${
                      effectiveSelectedBusinessId === business.id
                        ? "border-blue-200 bg-blue-50/50"
                        : "border-zinc-200 bg-zinc-50 hover:border-blue-200 hover:bg-blue-50/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium text-zinc-950">{business.name}</div>
                        <div className="mt-1 text-sm text-zinc-600">
                          {business.reviewLink ? "Review page active" : "Review page not generated yet"}
                        </div>
                      </div>
                      <Badge
                        className={
                          business.isActive
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                            : "border border-zinc-200 bg-white text-zinc-600 hover:bg-white"
                        }
                      >
                        {business.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border border-zinc-200/80 bg-white shadow-none ring-0">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-zinc-950">
                  {selectedBusiness ? `${selectedBusiness.name} reviews` : "Review feed"}
                </CardTitle>
                <CardDescription>
                  {selectedBusiness ? "Recent customer comments and rating data for the selected business." : "Choose a business to load reviews."}
                </CardDescription>
              </div>
              {selectedBusiness && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/business/${selectedBusiness.id}`}>Open business workspace</Link>
                </Button>
              )}
            </CardHeader>
            <CardContent className="grid gap-3">
              {!selectedBusiness ? (
                <div className="rounded-[24px] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-10 text-center text-sm text-zinc-500">
                  Select a business to inspect customer feedback.
                </div>
              ) : reviews.isLoading ? (
                Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28 rounded-2xl" />)
              ) : reviewList.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-10 text-center">
                  <p className="text-sm leading-6 text-zinc-600">
                    No reviews have been submitted for this business yet.
                  </p>
                </div>
              ) : (
                reviewList.map((review) => (
                    <div key={review.id} className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star key={index} className={`size-4 ${index < review.rating ? "fill-current" : ""}`} />
                          ))}
                        </div>
                        <div className="text-xs text-zinc-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-zinc-700">{review.content}</p>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
