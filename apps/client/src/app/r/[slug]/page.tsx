'use client'

import { Button } from "@/components/ui/button"
import { businessesApi, reviewsApi, type Business } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Star } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Fingerprint from "@fingerprintjs/fingerprintjs"
import { toast } from "sonner"

export default function ReviewFormPage() {
    const params = useParams()
    const businessSlug = params?.slug
    const [hovered, setHovered] = useState(0);

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('')
    const [business, setBusiness] = useState<Business | null>(null)
    const [isBusinessLoading, setIsBusinessLoading] = useState(true)
    const [isReviewSubmitting, setIsReviewSubmitting] = useState(false)

    const getFingerprint = async () => {
        const fp = await Fingerprint.load()
        const result = await fp.get()
        return result.visitorId
    }

    useEffect(() => {
        if (!businessSlug) return;

        let isMounted = true;
        queueMicrotask(() => {
            setIsBusinessLoading(true);

            businessesApi.getBySlug(businessSlug as string)
                .then((response) => {
                    if (isMounted) setBusiness(response.data ?? null);
                })
                .catch((error) => {
                    if (!isMounted) return;
                    toast.error(error instanceof Error ? error.message : "Unable to load business");
                    setBusiness(null);
                })
                .finally(() => {
                    if (isMounted) setIsBusinessLoading(false);
                });
        });

        return () => {
            isMounted = false;
        };
    }, [businessSlug])

    const handleReviewCreation = async () => {
        const businessId = business?.id;
        if (!businessId) return;

        const key = `review_submitted_${businessId}`;
        const alreadySubmitted = localStorage.getItem(key) === "true";
        if (alreadySubmitted) {
            toast.error("You have already submitted a review");
            return;
        }

        setIsReviewSubmitting(true);

        try {
            const fp = await getFingerprint();
            await reviewsApi.create({
                businessId,
                content: review,
                rating,
                fingerprint: fp,
            });
            toast.success("Review submitted");
            localStorage.setItem(key, "true");
            setRating(0);
            setReview('');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to submit review");
        } finally {
            setIsReviewSubmitting(false);
        }
    }

    return (
        <>
            <div className="w-full h-screen ">
                <nav className="flex justify-start items-center w-full h-12 bg-zinc-50 border-b border-zinc-800/20 px-60" >
                    <h1 className="text-xl font-semibold text-primary" >
                        Sayzo
                    </h1>
                </nav>
                <main className="w-full h-auto py-10 flex justify-center items-center flex-col space-y-3" >
                    <div className="flex justify-center items-center flex-col" >
                        <h1 className="text-4xl font-medium" >Tell us about your experience</h1>
                        <p className="text-sm text-zinc-500" >Please fill the form below to let us know about your experience</p>
                    </div>
                    <div className="w-full h-auto py-10 flex justify-center items-center" >
                        <div className="w-1/3 h-auto rounded-md border border-zinc-500/10 shadow-md flex justify-start items-center p-5 flex-col" >
                            {
                                isBusinessLoading ? <Skeleton className="w-80 h-5 rounded-full" /> : <h1 className="text-lg font-medium" >{`Review for ${business?.name}`}</h1>
                            }
                            <div className="w-full flex flex-col justify-center items-center pt-5">
                                <div className="w-full flex flex-col justify-center items-center " >
                                    {
                                        isBusinessLoading ?
                                            <Skeleton className="w-80 h-5 rounded-full mb-3" /> :
                                            <h1 className="mb-3">{`How much would you rate ${business?.name} ?`}</h1>
                                    }
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star}
                                                onMouseEnter={() => setHovered(star)}
                                                onMouseLeave={() => setHovered(0)}
                                                fill={star <= (hovered || rating) ? "orange" : "none"}
                                                className="w-8 h-8 cursor-pointer transition-colors duration-200"
                                                strokeWidth="0.5px"
                                                onClick={() => setRating(star)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="w-full flex flex-col justify-center items-center pt-5">
                                    {
                                        isBusinessLoading ?
                                            <Skeleton className="w-80 h-5 rounded-full mb-3" /> :
                                            <h1 className="mb-3">{`Describe your experience with ${business?.name} ?`}</h1>
                                    }
                                    <Textarea className="w-full h-20" placeholder={`Tell us about your exprience. Be descriptive or just keep it short as you like ;)`} value={review} onChange={(e) => setReview(e.target.value)} />
                                </div>
                                <div className="w-full flex justify-end items-center space-x-2.5 pt-5">
                                    <Button className="w-20 cursor-pointer" variant={"secondary"} onClick={() => { setReview(""); setRating(0) }} >
                                        Clear
                                    </Button>
                                    <Button disabled={isReviewSubmitting} className="w-20 cursor-pointer" onClick={handleReviewCreation}>
                                        {
                                            isReviewSubmitting ? <span className="animate-spin" ><Loader2 /></span> : "Submit"
                                        }
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main >
            </div >
        </>
    )
}
