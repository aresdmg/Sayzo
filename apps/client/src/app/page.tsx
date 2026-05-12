"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  BellDot,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Link2,
  MessageSquareText,
  ScanSearch,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { SayzoLogo } from "@/components/brand/sayzo-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Link2,
    title: "Business-specific review links",
    description: "Create dedicated review destinations for each business and share them anywhere your team interacts with customers.",
  },
  {
    icon: ShieldCheck,
    title: "Built-in duplicate prevention",
    description: "Fingerprint-backed checks help reduce repeat submissions from the same device and keep feedback cleaner.",
  },
  {
    icon: BarChart3,
    title: "Operational review analytics",
    description: "Track rating averages, review volume, and recent feedback trends without exporting data into another tool.",
  },
  {
    icon: MessageSquareText,
    title: "Centralized feedback workflow",
    description: "Manage multiple businesses from one workspace and move from review collection to follow-up faster.",
  },
];

const proofPoints = [
  "Multi-business management",
  "Customer review collection",
  "Device-based spam prevention",
  "Shareable public review pages",
];

const steps = [
  {
    step: "01",
    title: "Create your business workspace",
    description: "Register your account, add one or more businesses, and keep operations organized from day one.",
  },
  {
    step: "02",
    title: "Share your review link",
    description: "Generate a business-specific public page and send it after support calls, deliveries, or completed service.",
  },
  {
    step: "03",
    title: "Monitor sentiment and act",
    description: "Use your dashboard to spot rating trends, review velocity, and the comments that need attention.",
  },
];

const metrics = [
  { label: "Average rating", value: "4.8", hint: "Trend visibility across businesses" },
  { label: "Review links", value: "12", hint: "Active collection channels" },
  { label: "Recent reviews", value: "184", hint: "Last 30 days snapshot" },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/92 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex">
            <SayzoLogo />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
            <a href="#features" className="transition hover:text-zinc-950">
              Features
            </a>
            <a href="#workflow" className="transition hover:text-zinc-950">
              Workflow
            </a>
            <a href="#insights" className="transition hover:text-zinc-950">
              Insights
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="cursor-pointer hidden sm:inline-flex" onClick={() => router.push("/auth/login")}>
              Log in
            </Button>
            <Button className="cursor-pointer bg-blue-600 text-white shadow-sm shadow-blue-950/10 hover:bg-blue-700" onClick={() => router.push("/auth/register")}>
              Create account
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-zinc-200">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_44%)]" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(to_left,rgba(255,255,255,0.88),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0.66))]" />

          <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
            <div className="max-w-3xl space-y-8">
              <Badge className="border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50">
                Review operations for small scale business
              </Badge>

              <div className="space-y-5">
                <h1 className="font-heading text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                  Turn customer feedback into an operational system, not a scattered inbox.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                  Sayzo helps businesses collect customer reviews through dedicated links, reduce duplicate submissions,
                  and monitor rating performance from one clean workspace.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="cursor-pointer bg-blue-600 px-6 text-white shadow-sm shadow-blue-950/10 hover:bg-blue-700"
                  onClick={() => router.push("/auth/register")}
                >
                  Start with Sayzo
                  <ArrowRight className="size-4" />
                </Button>
                <Button size="lg" variant="outline" className="cursor-pointer px-6" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                  Explore capabilities
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {proofPoints.map((point) => (
                  <div key={point} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm">
                    <CheckCircle2 className="size-4 text-blue-600" />
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:pl-6">
              <Card className="border border-zinc-200/80 bg-white shadow-[0_28px_80px_-38px_rgba(15,23,42,0.34)] ring-0">
                <CardHeader className="border-b border-zinc-200/80">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-blue-600">Operations overview</div>
                      <CardTitle className="mt-2 text-2xl font-semibold text-zinc-950">Customer review command center</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
                    <div className="flex items-center gap-3 text-zinc-700">
                      <BellDot className="size-4 text-blue-600" />
                      New review activity from Downtown Studio
                    </div>
                    <div className="text-xs font-medium text-zinc-500">2m ago</div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {metrics.map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <div className="text-xs uppercase -tracking-normal text-zinc-500 font-semibold">{metric.label}</div>
                        <div className="mt-2 text-2xl font-semibold text-zinc-950">{metric.value}</div>
                        <div className="mt-1 text-xs text-zinc-600">{metric.hint}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-zinc-950">Recent trend</div>
                        <div className="text-sm text-zinc-600">Review volume and quality this week</div>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                        <TrendingUp className="size-4" />
                        +18%
                      </div>
                    </div>

                    <div className="mt-6 flex h-44 items-end gap-3">
                      {[42, 58, 54, 72, 68, 80, 92].map((height, index) => (
                        <div key={index} className="flex flex-1 flex-col items-center gap-3 h-full justify-end">
                          <div
                            className="w-full rounded-md bg-linear-to-t from-blue-600 via-blue-500 to-sky-500"
                            style={{ height: `${height}%` }}
                          />
                          <div className="text-xs text-zinc-500">{["M", "T", "W", "T", "F", "S", "S"][index]}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-zinc-950">Operational queue</div>
                        <div className="text-sm text-zinc-600">What needs attention right now</div>
                      </div>
                      <Button variant="ghost" size="sm" className="cursor-pointer text-zinc-600 hover:text-zinc-950">
                        Open
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                    <div className="mt-4 grid gap-3">
                      {[
                        { icon: ScanSearch, label: "Generate a review link for Northside Repairs" },
                        { icon: CircleDot, label: "Review three new comments with 4-star ratings" },
                      ].map((item) => {
                        const Icon = item.icon;

                        return (
                          <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                            <Icon className="size-4 text-blue-600" />
                            <span>{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-zinc-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Core capabilities</div>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                Built for teams that need review collection to be reliable and repeatable.
              </h2>
              <p className="text-base leading-7 text-zinc-600">
                Sayzo keeps the workflow tight: create a business, publish a review page, collect responses, and monitor the
                outcomes in one place.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Card key={feature.title} className="border border-zinc-200/80 bg-zinc-50 shadow-none ring-0">
                    <CardContent className="flex gap-4 p-6">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-950/10">
                        <Icon className="size-5" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-zinc-950">{feature.title}</h3>
                        <p className="text-sm leading-6 text-zinc-600">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-10 grid gap-4 border-t border-zinc-200 pt-8 md:grid-cols-3">
              {[
                "Use one workspace across multiple businesses",
                "Move customers into a consistent review collection path",
                "Keep analytics and feedback close to operations",
              ].map((line) => (
                <div key={line} className="text-sm leading-6 text-zinc-600">
                  <span className="mr-2 inline-block size-1.5 rounded-full bg-blue-600 align-middle" />
                  {line}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="bg-zinc-50">
          <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="space-y-4">
                <div className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">Workflow</div>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                  A straightforward path from customer interaction to business insight.
                </h2>
                <p className="text-base leading-7 text-zinc-600">
                  The product already supports the core loop teams care about: create a business profile, share a review page,
                  and monitor the resulting sentiment from the dashboard.
                </p>
              </div>

              <div className="grid gap-4">
                {steps.map((step) => (
                  <Card key={step.step} className="border border-zinc-200/80 bg-white shadow-none ring-0">
                    <CardContent className="flex gap-5 p-6">
                      <div className="text-3xl font-semibold tracking-tight text-blue-600">{step.step}</div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-zinc-950">{step.title}</h3>
                        <p className="text-sm leading-6 text-zinc-600">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="insights" className="border-y border-zinc-200 bg-zinc-950 text-zinc-50">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-18 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
            <div className="space-y-5">
              <div className="text-sm font-medium uppercase tracking-[0.22em] text-blue-300">Insights</div>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Review intelligence that stays close to daily operations.
              </h2>
              <p className="text-base leading-7 text-zinc-300">
                Teams should not need a separate reporting workflow just to understand customer sentiment. Sayzo’s business
                dashboard keeps totals, average ratings, and recent feedback in one surface.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Business performance snapshots",
                  body: "Surface total reviews and average ratings per business without leaving the operational workspace.",
                },
                {
                  title: "Recent feedback visibility",
                  body: "Keep current comments close to the metrics so teams can connect trends with customer language.",
                },
                {
                  title: "Shared-link collection model",
                  body: "Push customers to a clean public review route instead of collecting feedback through disconnected forms.",
                },
                {
                  title: "Room to grow",
                  body: "The schema already leaves space for richer review formats such as audio-backed feedback and transcripts.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-lg font-medium text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
            <div className="rounded-[32px] border border-zinc-200 bg-zinc-950 px-6 py-10 text-center text-zinc-50 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.48)] sm:px-10 sm:py-14">
              <div className="mx-auto max-w-3xl space-y-5">
                <div className="text-sm font-medium uppercase tracking-[0.22em] text-blue-300">Get started</div>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Build a more disciplined review pipeline with Sayzo.
                </h2>
                <p className="text-base leading-7 text-zinc-300">
                  Create your account, add your first business, and start collecting customer feedback through a cleaner,
                  more professional system.
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <Button size="lg" className="cursor-pointer bg-blue-600 px-6 text-white hover:bg-blue-700" onClick={() => router.push("/auth/register")}>
                    Create account
                  </Button>
                  <Button size="lg" variant="outline" className="cursor-pointer border-white/20 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white" onClick={() => router.push("/auth/login")}>
                    Log in
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <SayzoLogo compact />
          <div className="text-sm text-zinc-500">Customer review collection, duplicate prevention, and analytics in one workspace.</div>
          <div className="text-sm text-zinc-500">© {new Date().getFullYear()} Sayzo</div>
        </div>
      </footer>
    </div>
  );
}
