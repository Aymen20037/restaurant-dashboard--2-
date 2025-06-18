"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Eye, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

export default function PlatsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const dishes = [
    {
      id: 1,
      name: "Tajine Poulet aux Olives",
      description: "Tajine traditionnel avec poulet fermier, olives vertes et citron confit",
      price: 120,
      category: "Plats principaux",
      image: "/placeholder.svg",
      available: true,
      preparationTime: "25 min",
      ingredients: ["Poulet", "Olives vertes", "Citron confit", "Gingembre", "Safran"],
    },
    {
      id: 2,
      name: "Couscous Royal",
      description: "Couscous avec agneau, poulet, merguez et légumes de saison",
      price: 150,
      category: "Plats principaux",
      image: "/placeholder.svg",
      available: true,
      preparationTime: "30 min",
      ingredients: ["Semoule", "Agneau", "Poulet", "Merguez", "Légumes"],
    },
    {
      id: 3,
      name: "Pastilla au Poulet",
      description: "Feuilleté croustillant au poulet, amandes et épices",
      price: 130,
      category: "Entrées",
      image: "/placeholder.svg",
      available: true,
      preparationTime: "20 min",
      ingredients: ["Pâte filo", "Poulet", "Amandes", "Cannelle", "Œufs"],
    },
    {
      id: 4,
      name: "Salade Marocaine",
      description: "Salade fraîche aux tomates, concombres et herbes",
      price: 35,
      category: "Entrées",
      image: "/placeholder.svg",
      available: true,
      preparationTime: "10 min",
      ingredients: ["Tomates", "Concombres", "Oignons", "Persil", "Menthe"],
    },
    {
      id: 5,
      name: "Thé à la Menthe",
      description: "Thé vert traditionnel à la menthe fraîche",
      price: 15,
      category: "Boissons",
      image: "/placeholder.svg",
      available: true,
      preparationTime: "5 min",
      ingredients: ["Thé vert", "Menthe fraîche", "Sucre"],
    },
  ]

  const categories = ["Entrées", "Plats principaux", "Desserts", "Boissons"]

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || dish.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Gestion des Plats</h1>
            <Badge className="bg-white/20 text-white">{filteredDishes.length} plats</Badge>
            <div className="ml-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-white/20 hover:bg-white/30 text-white" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un plat
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau plat</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations pour ajouter un nouveau plat à votre menu
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="dishName">Nom du plat</Label>
                        <Input id="dishName" placeholder="Ex: Tajine Poulet" />
                      </div>
                      <div>
                        <Label htmlFor="price">Prix (DH)</Label>
                        <Input id="price" type="number" placeholder="120" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Description du plat..." rows={3} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="category">Catégorie</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="prepTime">Temps de préparation</Label>
                        <Input id="prepTime" placeholder="25 min" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="ingredients">Ingrédients</Label>
                      <Input id="ingredients" placeholder="Séparez par des virgules" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="available" />
                      <Label htmlFor="available">Plat disponible</Label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button className="bg-droovo-gradient hover:opacity-90">Ajouter le plat</Button>
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
                    placeholder="Rechercher un plat..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrer par catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Dishes Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDishes.map((dish) => (
              <Card key={dish.id} className="border-0 shadow-lg overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-orange-100 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className={dish.available ? "bg-green-500" : "bg-red-500"}>
                      {dish.available ? "Disponible" : "Indisponible"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-black/50 text-white">{dish.preparationTime}</Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg">{dish.name}</h3>
                      <span className="text-lg font-bold text-purple-600">{dish.price} DH</span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{dish.description}</p>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {dish.category}
                      </Badge>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{dish.name}</DialogTitle>
                            <DialogDescription>{dish.category}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="aspect-video bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg flex items-center justify-center">
                              <Camera className="h-16 w-16 text-gray-400" />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <h4 className="font-semibold mb-2">Informations</h4>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <strong>Prix:</strong> {dish.price} DH
                                  </p>
                                  <p>
                                    <strong>Temps de préparation:</strong> {dish.preparationTime}
                                  </p>
                                  <p>
                                    <strong>Statut:</strong>
                                    <Badge className={cn("ml-2", dish.available ? "bg-green-500" : "bg-red-500")}>
                                      {dish.available ? "Disponible" : "Indisponible"}
                                    </Badge>
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Ingrédients</h4>
                                <div className="flex flex-wrap gap-1">
                                  {dish.ingredients.map((ingredient, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {ingredient}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-sm text-gray-600">{dish.description}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
