"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Edit, Trash2, Percent, Calendar, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Sidebar } from "../components/sidebar"
import { cn } from "@/lib/utils"

export default function PromotionsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [promotions, setPromotions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [editingPromotion, setEditingPromotion] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)


  
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    value: "",
    code: "",
    minAmount: "",
    maxDiscount: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
    isActive: true,
    userId: "",
  })

  useEffect(() => {
    fetch("/api/account")
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          setForm((prev) => ({ ...prev, userId: data.id }))
        } else {
          setError("Impossible de récupérer l'utilisateur connecté.")
        }
      })
      .catch(() => setError("Erreur lors de la récupération de l'utilisateur."))
  }, [])

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/promotions")
      const data = await res.json()
      setPromotions(data)
      setError("")
    } catch (err) {
      setError("Erreur lors de la récupération des promotions.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const requiredFields = [
      "name",
      "description",
      "type",
      "value",
      "code",
      "minAmount",
      "maxDiscount",
      "usageLimit",
      "startDate",
      "endDate",
      "userId",
    ]
    for (const field of requiredFields) {
      if (!form[field as keyof typeof form]) {
        setError("Veuillez remplir tous les champs obligatoires.")
        return false
      }
    }
    if (isNaN(Number(form.value))) {
      setError("La valeur de la promotion doit être un nombre.")
      return false
    }
    return true
  }

  const handleCreateOrUpdatePromotion = async () => {
    if (!validateForm()) return
  
    try {
      const url = editingPromotion ? `/api/promotions/${editingPromotion.id}` : "/api/promotions"
      const method = editingPromotion ? "PUT" : "POST"
  
      const payload = {
        ...form,
        value: parseFloat(form.value),
        minAmount: parseFloat(form.minAmount),
        maxDiscount: parseFloat(form.maxDiscount),
        usageLimit: parseInt(form.usageLimit, 10),
      }
  
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
  
      if (res.ok) {
        fetchPromotions()
        setEditingPromotion(null)
        setForm((prev) => ({
          name: "",
          description: "",
          type: "",
          value: "",
          code: "",
          minAmount: "",
          maxDiscount: "",
          usageLimit: "",
          startDate: "",
          endDate: "",
          isActive: true,
          userId: prev.userId,
        }))
      } else {
        const errorData = await res.json()
        setError(errorData.error || "Une erreur est survenue.")
      }
    } catch (err) {
      setError("Erreur lors de la création ou de la mise à jour de la promotion.")
      console.error(err)
    }
  }
  const handleEditClick = (promo: any) => {
    setEditingPromotion(promo)
    setForm((prev) => ({
      ...prev,
      name: promo.name,
      description: promo.description,
      type: promo.type,
      value: promo.value,
      code: promo.code || "",
      minAmount: promo.minAmount || "",
      maxDiscount: promo.maxDiscount || "",
      usageLimit: promo.usageLimit || "",
      startDate: promo.startDate.split("T")[0],
      endDate: promo.endDate.split("T")[0],
      isActive: promo.isActive,
      userId: prev.userId,
    }))
    setIsDialogOpen(true) 
  }
  

  const filteredPromotions = promotions.filter((promo: any) => {
    const matchesSearch = promo.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && promo.isActive) ||
      (statusFilter === "inactive" && !promo.isActive)
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (active: boolean) => (active ? "bg-green-500" : "bg-red-500")

const getTypeColor = (type: string) => {
  switch (type) {
    case "PERCENTAGE":
      return "bg-purple-500"
    case "FIXED_AMOUNT":
      return "bg-blue-500"
    case "FREE_DELIVERY":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}


const handleDeletePromotion = async (id: string) => {
  const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cette promotion ?")
  if (!confirmDelete) return

  try {
    const res = await fetch(`/api/promotions/${id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      fetchPromotions()
    } else {
      const errorData = await res.json()
      setError(errorData.error || "Erreur lors de la suppression.")
    }
  } catch (err) {
    setError("Erreur serveur lors de la suppression.")
    console.error(err)
  }
}

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Gestion des Promotions</h1>
            <Badge className="bg-white/20 text-white">{filteredPromotions.length} promotions</Badge>
            <div className="ml-auto">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
  <Button
    className="bg-white/20 hover:bg-white/30 text-white"
    variant="outline"
    onClick={() => {
      setEditingPromotion(null)
      setForm({
        name: "",
        description: "",
        type: "",
        value: "",
        code: "",
        minAmount: "",
        maxDiscount: "",
        usageLimit: "",
        startDate: "",
        endDate: "",
        isActive: true,
        userId: form.userId, 
      })
      setIsDialogOpen(true)
    }}
  >
    <Plus className="mr-2 h-4 w-4" />
    Créer une promotion
  </Button>
</DialogTrigger>

                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingPromotion ? "Modifier la promotion" : "Nouvelle promotion"}</DialogTitle>
                    <DialogDescription>Remplissez les informations</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Nom</Label>
                        <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choisir un type" />
                          </SelectTrigger>
                          <SelectContent>
  <SelectItem value="PERCENTAGE">Pourcentage</SelectItem>
  <SelectItem value="FIXED_AMOUNT">Montant fixe</SelectItem>
  <SelectItem value="FREE_DELIVERY">Livraison gratuite</SelectItem>
</SelectContent>


                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label>Réduction (%)</Label>
                        <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
                      </div>
                      <div>
                        <Label>Date début</Label>
                        <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                      </div>
                      <div>
                        <Label>Date fin</Label>
                        <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                    <div>
  <Label>Code promotion</Label>
  <Input
    value={form.code}
    onChange={(e) => setForm({ ...form, code: e.target.value })}
  />
</div>

<div className="grid gap-4 md:grid-cols-2">
  <div>
    <Label>Montant minimum (€)</Label>
    <Input
      type="number"
      value={form.minAmount}
      onChange={(e) => setForm({ ...form, minAmount: e.target.value })}
    />
  </div>
  <div>
    <Label>Réduction maximale (€)</Label>
    <Input
      type="number"
      value={form.maxDiscount}
      onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
    />
  </div>
</div>

                      <div>
                        <Label>Utilisation max</Label>
                        <Input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch id="active" checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleCreateOrUpdatePromotion} className="bg-droovo-gradient hover:opacity-90">
                        {editingPromotion ? "Mettre à jour" : "Créer"}
                      </Button>
                      <Button
  variant="outline"
  onClick={() => {
    setEditingPromotion(null)
    setForm({
      name: "",
      description: "",
      type: "",
      value: "",
      code: "",
      minAmount: "",
      maxDiscount: "",
      usageLimit: "",
      startDate: "",
      endDate: "",
      isActive: true,
      userId: "",
    })
    setIsDialogOpen(false) 
  }}
>
  Annuler
</Button>

                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>
        <main className="p-6 space-y-6">
  {error && <div className="text-red-500 text-center">{error}</div>}
  {isLoading ? (
    <div className="text-center">Chargement...</div>
  ) : (
    <>
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher une promotion..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="active">Actives</SelectItem>
                <SelectItem value="inactive">Inactives</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPromotions.length > 0 ? (
          filteredPromotions.map((promo: any) => (
            <Card key={promo.id} className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{promo.name}</CardTitle>
                    <CardDescription className="mt-1">{promo.description}</CardDescription>
                  </div>
                  <Badge className={cn("text-white", getStatusColor(promo.isActive))}>
                    {promo.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={cn("text-white", getTypeColor(promo.type))}>{promo.type}</Badge>
                  <div className="flex items-center gap-1 text-2xl font-bold text-purple-600">
                    <Percent className="h-5 w-5" />
                    {promo.value}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(promo.startDate).toLocaleDateString("fr-FR")} -{" "}
                      {new Date(promo.endDate).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="h-4 w-4" />
                    <span>
                      {promo.usageCount} / {promo.usageLimit ?? "∞"} utilisations
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(promo.usageCount / (promo.usageLimit || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEditClick(promo)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeletePromotion(promo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500">Aucune promotion trouvée.</div>
        )}
      </div>
    </>
  )}
</main>
      </div>
    </div>
  )
}
