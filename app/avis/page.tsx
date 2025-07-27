"use client"

import { useState, useEffect } from "react"
import { Search, Star, MessageSquare, ThumbsUp, ThumbsDown, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "../components/sidebar"
import { cn } from "@/lib/utils"

type ReviewType = {
  id: string
  rating: number
  comment: string
  createdAt: string
  response: string | null
  helpful: number
  notHelpful: number
  customer: {
    name: string
  }
  order: string | null
  avatar?: string | null
}

export default function AvisPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [reviews, setReviews] = useState<ReviewType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [responseTexts, setResponseTexts] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true)
      try {
        const res = await fetch("/api/reviews")
        if (!res.ok) throw new Error("Erreur lors du chargement des avis")
        const data = await res.json()
        setReviews(data)
        setError(null)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-300"
          )}
        />
      ))
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600"
    if (rating >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter
    return matchesSearch && matchesRating
  })

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((review) => review.rating === rating).length
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
    return { rating, count, percentage }
  })

  const handleResponseChange = (id: string, text: string) => {
    setResponseTexts((prev) => ({ ...prev, [id]: text }))
  }

  const handlePublishResponse = async (reviewId: string) => {
    const responseText = responseTexts[reviewId]
    if (!responseText || responseText.trim() === "") return alert("Veuillez écrire une réponse.")

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, response: responseText }),
      })
      if (!res.ok) throw new Error("Erreur lors de la publication de la réponse")

      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                response: responseText,
              }
            : r
        )
      )
      setResponseTexts((prev) => ({ ...prev, [reviewId]: "" }))
    } catch (error) {
      alert("Erreur lors de la réponse. Veuillez réessayer.")
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Avis Clients</h1>
            <Badge className="bg-white/20 text-white">{filteredReviews.length} avis</Badge>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {error && (
            <div className="text-red-600 text-center font-semibold mb-4">{error}</div>
          )}

          {/* Stats Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-purple-600">
                  {averageRating.toFixed(1)}
                </CardTitle>
                <div className="flex justify-center">{renderStars(Math.round(averageRating))}</div>
                <CardDescription>Note moyenne sur {reviews.length} avis</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Répartition des notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm w-8 text-right">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avis positifs (4-5★)</span>
                  <span className="font-semibold text-green-600">
                    {reviews.filter((r) => r.rating >= 4).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avis avec réponse</span>
                  <span className="font-semibold">{reviews.filter((r) => r.response).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taux de réponse</span>
                  <span className="font-semibold text-purple-600">
                    {reviews.length > 0
                      ? Math.round((reviews.filter((r) => r.response).length / reviews.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher dans les avis..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Select value={ratingFilter} onValueChange={setRatingFilter} disabled={loading}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrer par note" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les notes</SelectItem>
                    <SelectItem value="5">5 étoiles</SelectItem>
                    <SelectItem value="4">4 étoiles</SelectItem>
                    <SelectItem value="3">3 étoiles</SelectItem>
                    <SelectItem value="2">2 étoiles</SelectItem>
                    <SelectItem value="1">1 étoile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {loading && <p className="text-center text-gray-500">Chargement des avis...</p>}

            {!loading && filteredReviews.length === 0 && (
              <p className="text-center text-gray-500">Aucun avis trouvé.</p>
            )}

            {!loading &&
              filteredReviews.map((review) => (
                <Card key={review.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Review Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={review.avatar || "/placeholder.svg"}
                              alt={review.customer.name}
                            />
                            <AvatarFallback>
                              {review.customer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{review.customer.name}</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex">{renderStars(review.rating)}</div>
                              <span className={cn("font-semibold", getRatingColor(review.rating))}>
                                {review.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{new Date(review.createdAt).toLocaleDateString("fr-FR")}</p>
                          <p className="text-xs">Commande: {review.order || "N/A"}</p>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="pl-12">
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>

                        {/* Review Actions */}
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Button variant="ghost" size="sm" className="h-8 px-2" disabled>
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {review.helpful}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2" disabled>
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              {review.notHelpful}
                            </Button>
                          </div>

                          {!review.response && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Reply className="mr-2 h-3 w-3" />
                                  Répondre
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Répondre à l'avis de {review.customer.name}</DialogTitle>
                                  <DialogDescription>
                                    Votre réponse sera visible publiquement
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="flex">{renderStars(review.rating)}</div>
                                      <span className="font-semibold">{review.customer.name}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{review.comment}</p>
                                  </div>
                                  <Textarea
                                    placeholder="Écrivez votre réponse..."
                                    rows={4}
                                    value={responseTexts[review.id] || ""}
                                    onChange={(e) => handleResponseChange(review.id, e.target.value)}
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      className="bg-droovo-gradient hover:opacity-90"
                                      onClick={() => handlePublishResponse(review.id)}
                                    >
                                      Publier la réponse
                                    </Button>
                                    {/* No cancel button needed; closing dialog is automatic */}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          {/* Restaurant Response */}
                          {review.response && (
                            <div className="mt-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="h-4 w-4 text-purple-600" />
                                <span className="font-semibold text-purple-600">
                                  Réponse du restaurant
                                </span>
                              </div>
                              <p className="text-gray-700">{review.response}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </main>
      </div>
    </div>
  )
}

