"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Send, ThumbsUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sanitizeReviewName, sanitizeReviewComment, clientRateLimit } from "@/lib/security";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: number;
  helpful: number;
}

const defaultReviews: Review[] = [
  {
    id: "demo-1",
    name: "Priya S.",
    rating: 5,
    comment:
      "I used this for my biology class and finally understood what a peer-reviewed paper actually says. The 'So What' section is my favorite!",
    date: Date.now() - 86400000 * 3,
    helpful: 12,
  },
  {
    id: "demo-2",
    name: "Marcus T.",
    rating: 4,
    comment:
      "The depth slider is genius. I started at high school level then worked my way up to undergrad. Felt like leveling up in a game.",
    date: Date.now() - 86400000 * 7,
    helpful: 8,
  },
  {
    id: "demo-3",
    name: "Sarah K.",
    rating: 5,
    comment:
      "As a teacher, I use this to help my students access real research instead of just Wikipedia. Game changer for science fairs.",
    date: Date.now() - 86400000 * 14,
    helpful: 21,
  },
];

export function FeedbackSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try Supabase first, fall back to defaults
    fetch("/api/review")
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews && data.reviews.length > 0) {
          setReviews(
            data.reviews.map((r: Record<string, unknown>) => ({
              id: r.id as string,
              name: r.name as string,
              rating: r.rating as number,
              comment: r.comment as string,
              date: new Date(r.created_at as string).getTime(),
              helpful: (r.helpful as number) || 0,
            }))
          );
        } else {
          setReviews(defaultReviews);
        }
      })
      .catch(() => setReviews(defaultReviews));
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !comment.trim() || rating === 0) {
      setError("Please fill in all fields and select a rating.");
      return;
    }

    // Client-side rate limit: 3 reviews per hour
    const rateCheck = clientRateLimit("review", 3, 3600_000);
    if (!rateCheck.allowed) {
      setError("You've submitted too many reviews. Please try again later.");
      return;
    }

    // Sanitize inputs
    const cleanName = sanitizeReviewName(name);
    const cleanComment = sanitizeReviewComment(comment);

    if (cleanName.length < 1 || cleanComment.length < 1) {
      setError("Name and comment contain invalid characters.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          rating,
          comment: cleanComment,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit review.");
        setSubmitting(false);
        return;
      }

      const data = await res.json();

      // Add to local list
      const newReview: Review = {
        id: data.review?.id || crypto.randomUUID(),
        name: cleanName,
        rating,
        comment: cleanComment,
        date: Date.now(),
        helpful: 0,
      };

      setReviews((prev) => [newReview, ...prev]);
      setName("");
      setRating(0);
      setComment("");
      setShowForm(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setError("Network error. Your review was not saved.");
    } finally {
      setSubmitting(false);
    }
  };

  const markHelpful = async (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpful: r.helpful + 1 } : r))
    );

    // Persist to Supabase
    fetch("/api/review", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  };

  return (
    <section className="px-4 py-20" id="reviews">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What people are saying
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Real feedback from students, teachers, and curious minds.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-5 w-5 ${
                    s <= Math.round(Number(avgRating))
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">{avgRating}</span>
            <span className="text-sm text-muted-foreground">
              ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review, i) => (
            <motion.div
              key={review.id}
              className="rounded-xl border border-border/50 bg-card p-5"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{review.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3 w-3 ${
                        s <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>

              <button
                onClick={() => markHelpful(review.id)}
                className="mt-3 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                <ThumbsUp className="h-3 w-3" />
                Helpful ({review.helpful})
              </button>
            </motion.div>
          ))}
        </div>

        {/* Submit review */}
        <div className="mt-8 text-center">
          {submitted && (
            <motion.p
              className="mb-4 text-sm font-medium text-green-500"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Thanks for your review!
            </motion.p>
          )}

          {error && (
            <p className="mb-4 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          {!showForm ? (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowForm(true)}
            >
              <MessageSquare className="h-4 w-4" />
              Write a Review
            </Button>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="mx-auto max-w-md space-y-4 rounded-xl border border-border/50 bg-card p-6 text-left"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Your Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex M."
                  required
                  maxLength={100}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          s <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Your Review
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({1000 - comment.length} chars left)
                  </span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value.substring(0, 1000))
                  }
                  placeholder="What did you think of PaperSimple?"
                  required
                  rows={3}
                  maxLength={1000}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={submitting}
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
}
