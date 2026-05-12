'use client'

import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Link2,
  Loader2,
  MoreHorizontal,
  Power,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { ApiRequestError, businessesApi, reviewsApi, type Business, type Review } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function DynamicBusinessPage() {
  const router = useRouter();
  const param = useParams();
  const businessId = param?.id as string;
  const [data, setData] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingReviewLink, setIsGeneratingReviewLink] = useState(false);

  const loadBusiness = useCallback(async () => {
    if (!businessId) return;

    setIsLoading(true);

    try {
      const response = await businessesApi.getById(businessId);
      setData(response.data ?? null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load business");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  const loadReviews = useCallback(async () => {
    if (!businessId) return;

    setIsReviewsLoading(true);

    try {
      const response = await reviewsApi.getByBusinessId(businessId);
      setReviews(response.data ?? []);
    } catch (error) {
      if (error instanceof ApiRequestError && error.statusCode === 404) {
        setReviews([]);
      } else {
        toast.error(error instanceof Error ? error.message : "Unable to load reviews");
        setReviews([]);
      }
    } finally {
      setIsReviewsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadBusiness();
      void loadReviews();
    });
  }, [loadBusiness, loadReviews]);

  const handleToggleStatus = async (id: string) => {
    setIsTogglingStatus(true);

    try {
      await businessesApi.toggleActive(id);
      toast.success("Business status updated");
      await loadBusiness();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update business status");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);

    try {
      await businessesApi.delete(id);
      toast.success("Business deleted");
      router.push("/business");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete business");
      setIsDeleting(false);
    }
  };

  const handleGenerateReviewLink = async (id: string) => {
    setIsGeneratingReviewLink(true);

    try {
      await businessesApi.createReviewLink(id);
      toast.success("Review link created");
      await loadBusiness();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create review link");
    } finally {
      setIsGeneratingReviewLink(false);
    }
  };

  const chartData = useMemo(
    () =>
      reviews
        .slice()
        .reverse()
        .map((review, index) => ({
          date: new Date(review.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          reviews: index + 1,
          rating: review.rating,
        })),
    [reviews]
  );

  const averageRating = data?.avgRating ? Number(data.avgRating).toFixed(1) : "0.0";
  const reviewLink = data?.reviewLink ?? null;
  const businessDataId = data?.id ?? null;

  const handleLinkCopying = (reviewLink: string) => {
    const fullLink = `${window.location.origin}${reviewLink}`;
    window.navigator.clipboard.writeText(fullLink);
    toast.success("Review link copied");
  };

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-zinc-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_26px_80px_-42px_rgba(15,23,42,0.25)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.06fr_0.94fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <Button variant="ghost" className="w-fit px-0 text-zinc-600 hover:bg-transparent hover:text-zinc-950" onClick={() => router.push("/business")}>
                <ArrowLeft className="size-4" />
                Back to businesses
              </Button>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  {isLoading ? (
                    <Skeleton className="h-8 w-48 rounded-xl" />
                  ) : (
                    <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                      {data?.name}
                    </h1>
                  )}
                  {data && (
                    <Badge
                      className={
                        data.isActive
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                          : "border border-zinc-200 bg-white text-zinc-600 hover:bg-white"
                      }
                    >
                      {data.isActive ? "Active" : "Inactive"}
                    </Badge>
                  )}
                </div>
                <p className="max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                  Manage review collection, monitor feedback quality, and control whether this business is live for customers.
                </p>
                {!isLoading && data?.id && (
                  <div className="text-sm text-zinc-500">Business ID: {data.id}</div>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {reviewLink ? (
                  <>
                    <Button onClick={() => handleLinkCopying(reviewLink)} className="bg-blue-600 text-white hover:bg-blue-700">
                      <Copy className="size-4" />
                      Copy review link
                    </Button>
                    <Button variant="outline" onClick={() => window.open(reviewLink, "_blank", "noopener,noreferrer")}>
                      <ExternalLink className="size-4" />
                      Open public page
                    </Button>
                  </>
                ) : (
                  <Button
                    disabled={isGeneratingReviewLink || !businessDataId}
                    onClick={async () => {
                      if (!businessDataId) return;
                      await handleGenerateReviewLink(businessDataId);
                    }}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isGeneratingReviewLink ? <Loader2 className="animate-spin" /> : <Link2 className="size-4" />}
                    Create review link
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <MoreHorizontal className="size-4" />
                      More actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>Business actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        disabled={!businessDataId || isTogglingStatus}
                        onClick={async () => {
                          if (!businessDataId) return;
                          await handleToggleStatus(businessDataId);
                        }}
                      >
                        <Power className="size-4" />
                        {data?.isActive ? "Set as inactive" : "Set as active"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!businessDataId || isDeleting}
                        onClick={async () => {
                          if (!businessDataId) return;
                          await handleDelete(businessDataId);
                        }}
                        className="text-red-600 focus:bg-red-50 focus:text-red-600"
                      >
                        <Trash2 className="size-4" />
                        Delete business
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5">
              <div className="text-sm font-medium text-zinc-950">Current collection setup</div>
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Review page</div>
                  <div className="mt-2 text-sm font-medium text-zinc-950">
                    {data?.reviewLink ? "Ready to share with customers" : "Not generated yet"}
                  </div>
                  <div className="mt-1 text-sm text-zinc-600">
                    {data?.reviewLink ? data.reviewLink : "Create the review link to start collecting feedback."}
                  </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Owner</div>
                  <div className="mt-2 text-sm font-medium text-zinc-950">{data?.owner?.name ?? "Loading..."}</div>
                  <div className="mt-1 text-sm text-zinc-600">
                    {data?.owner?.joined ? `Account active since ${new Date(data.owner.joined).toLocaleDateString()}` : "Owner information unavailable"}
                  </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-4 text-blue-600" />
                    <p className="text-sm leading-6 text-zinc-600">
                      Customer reviews on Sayzo are protected with duplicate-prevention checks to help keep business feedback cleaner.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-36 rounded-[24px]" />)
            : [
                {
                  label: "Total reviews",
                  value: `${data?.totalReviews ?? 0}`,
                  note: "Customer submissions received",
                },
                {
                  label: "Average rating",
                  value: averageRating,
                  note: "Current score across all reviews",
                },
                {
                  label: "Recent feedback",
                  value: `${reviews.length}`,
                  note: "Entries visible in the current review feed",
                },
              ].map((item) => (
                <Card key={item.label} className="border border-zinc-200/80 bg-white shadow-none ring-0">
                  <CardHeader>
                    <CardDescription>{item.label}</CardDescription>
                    <CardTitle className="text-3xl font-semibold text-zinc-950">{item.value}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-sm text-zinc-600">{item.note}</CardContent>
                </Card>
              ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="border border-zinc-200/80 bg-white shadow-none ring-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-zinc-950">Review momentum</CardTitle>
              <CardDescription>Simple visibility into review activity for this business.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isReviewsLoading ? (
                <Skeleton className="h-full w-full rounded-[20px]" />
              ) : chartData.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-[24px] border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
                  No review data yet for this business.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e4e4e7",
                        borderRadius: "14px",
                        fontSize: "12px",
                      }}
                    />
                    <Line type="monotone" dataKey="reviews" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border border-zinc-200/80 bg-white shadow-none ring-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-zinc-950">Recent customer feedback</CardTitle>
              <CardDescription>The latest comments submitted to this business.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {isReviewsLoading ? (
                Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-2xl" />)
              ) : reviews.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-center text-sm text-zinc-500">
                  No reviews yet. Generate the public page and start collecting customer feedback.
                </div>
              ) : (
                reviews.slice(0, 4).map((review) => (
                  <div key={review.id} className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex items-center justify-between">
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
