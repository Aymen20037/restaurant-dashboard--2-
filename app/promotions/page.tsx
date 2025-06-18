"use client"

import { useState } from "react"
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

  const promotions = [
    {
      id: 1,
      name: "Menu Découverte",
      description: "Tajine + Salade + Thé à prix réduit",
      type: "Menu",
      discount: 20,
      originalPrice: 170,
      promoPrice: 136,
      startDate: "2023-05-01",
      endDate: "2023-05-31",
      active: true,
      usageCount: 45,
      maxUsage: 100,
    },
    {
      id: 2,
      name: "Livraison Gratuite",
      description: "Livraison offerte pour toute commande supérieure à 150 DH",
      type: "Livraison",
      discount: 100,
      originalPrice: 25,
      promoPrice: 0,
      startDate: "2023-05-15",
      endDate: "2023-06-15",
      active: true,
      usageCount: 78,
      maxUsage: 200,
    },
    {
      id: 3,
      name: "Happy Hour",
      description: "30% de réduction sur tous les plats de 14h à 16h",
      type: "Horaire",
      discount: 30,
      originalPrice: 0,
      promoPrice: 0,
      startDate: "2023-05-01",
      endDate: "2023-12-31",
      active: true,
      usageCount: 123,
      maxUsage: 500,
    },
    {
      id: 4,
      name: "Première Commande",
      description: "15% de réduction pour les nouveaux clients",
      type: "Nouveau client",
      discount: 15,
      originalPrice: 0,
      promoPrice: 0,
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      active: true,
      usageCount: 234,
      maxUsage: 1000,
    },
  ]

  const getStatusColor = (active: boolean) => {
    return active ? "bg-green-500" : "bg-red-500"
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Menu":
        return "bg-purple-500"
      case "Livraison":
        return "bg-blue-500"
      case "Horaire":
        return "bg-orange-500"
      case "Nouveau client":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch = promo.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && promo.active) ||
      (statusFilter === "inactive" && !promo.active)
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Gestion des Promotions</h1>
            <Badge className="bg-white/20 text-white">{filteredPromotions.length} promotions</Badge>
            <div className="ml-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-white/20 hover:bg-white/30 text-white" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer une promotion
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle promotion</DialogTitle>
                    <DialogDescription>Configurez votre promotion pour attirer plus de clients</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="promoName">Nom de la promotion</Label>
                        <Input id="promoName" placeholder="Ex: Menu Découverte" />
                      </div>
                      <div>
                        <Label htmlFor="promoType">Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="menu">Menu</SelectItem>
                            <SelectItem value="livraison">Livraison</SelectItem>
                            <SelectItem value="horaire">Horaire</SelectItem>
                            <SelectItem value="nouveau">Nouveau client</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Description de la promotion..." rows={3} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="discount">Réduction (%)</Label>
                        <Input id="discount" type="number" placeholder="20" />
                      </div>
                      <div>
                        <Label htmlFor="startDate">Date de début</Label>
                        <Input id="startDate" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Date de fin</Label>
                        <Input id="endDate" type="date" />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="maxUsage">Utilisation maximum</Label>
                        <Input id="maxUsage" type="number" placeholder="100" />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch id="active" />
                        <Label htmlFor="active">Promotion active</Label>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button className="bg-droovo-gradient hover:opacity-90">Créer la promotion</Button>
                      <Button variant="outline">Annuler</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Filters */}
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
                    <SelectItem value="all">Toutes les promotions</SelectItem>
                    <SelectItem value="active">Actives</SelectItem>
                    <SelectItem value="inactive">Inactives</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Promotions Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPromotions.map((promo) => (
              <Card key={promo.id} className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{promo.name}</CardTitle>
                      <CardDescription className="mt-1">{promo.description}</CardDescription>
                    </div>
                    <Badge className={cn("text-white", getStatusColor(promo.active))}>
                      {promo.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={cn("text-white", getTypeColor(promo.type))}>{promo.type}</Badge>
                    <div className="flex items-center gap-1 text-2xl font-bold text-purple-600">
                      <Percent className="h-5 w-5" />
                      {promo.discount}
                    </div>
                  </div>

                  {promo.type === "Menu" && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Prix original:</span>
                        <span className="line-through text-gray-500">{promo.originalPrice} DH</span>
                      </div>
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-sm">Prix promo:</span>
                        <span className="text-purple-600">{promo.promoPrice} DH</span>
                      </div>
                    </div>
                  )}

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
                        {promo.usageCount} / {promo.maxUsage} utilisations
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(promo.usageCount / promo.maxUsage) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
