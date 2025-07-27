"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Eye, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sidebar } from "../components/sidebar"

type Category = {
  id: string
  name: string
}

interface Dish {
  id: string
  name: string
  price: number
  description: string | null
  category: Category | string
  preparationTime: number | null
  ingredients: string[] | null
  isAvailable: boolean
}

export default function PlatsPage() {
  const [isSidebarOpen] = useState(true)

  // Tous les plats chargés au début
  const [dishes, setDishes] = useState<Dish[]>([])
  // Plats filtrés localement
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([])

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Debounce pour la recherche
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 400)
    return () => clearTimeout(handler)
  }, [searchQuery])

  const [newDish, setNewDish] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    preparationTime: "",
    ingredients: "",
    isAvailable: true,
  })

  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit" | null>(null)
  const [editDish, setEditDish] = useState<typeof newDish | null>(null)

  // Charger catégories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories")
        if (!res.ok) throw new Error("Erreur récupération catégories")
        const data = await res.json()
        if (Array.isArray(data.categories)) {
          setCategories(data.categories)
          if (data.categories.length > 0) {
            setNewDish((prev) => ({
              ...prev,
              categoryId: data.categories[0].id,
            }))
          }
        }
      } catch (error) {
        console.error("Erreur fetch catégories:", error)
      }
    }
    fetchCategories()
  }, [])

  // Charger tous les plats au montage (sans filtres)
  useEffect(() => {
    async function fetchDishes() {
      setLoading(true)
      try {
        const res = await fetch(`/api/dishes`)
        if (!res.ok) throw new Error("Erreur récupération plats")
          const data = await res.json()
        setDishes(
          Array.isArray(data.dishes)
            ? data.dishes.map((d: any) => ({
                ...d,
                category: d.categories || "Sans catégorie",
              }))
            : []
        )
        
      } catch (error) {
        console.error("Erreur fetch plats:", error)
        setDishes([])
      } finally {
        setLoading(false)
      }
    }
    fetchDishes()
  }, [])

  // Filtrer localement sur catégorie + recherche (debounced)
  useEffect(() => {
    let filtered = dishes

    if (categoryFilter !== "all") {
      filtered = filtered.filter((d) =>
        typeof d.category === "string"
          ? d.category === categoryFilter
          : d.category.id === categoryFilter
      )
    }

    if (debouncedSearch.trim() !== "") {
      const search = debouncedSearch.toLowerCase()
      filtered = filtered.filter((d) => d.name.toLowerCase().includes(search))
    }

    setFilteredDishes(filtered)
  }, [dishes, categoryFilter, debouncedSearch])

  function handleNewDishChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { id, value, type, checked } = e.target as HTMLInputElement
    setNewDish((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  async function handleAddDish(
    event: React.FormEvent<HTMLFormElement>,
    closeDialog: () => void
  ) {
    event.preventDefault()
    try {
      if (!newDish.categoryId) {
        alert("Veuillez sélectionner une catégorie")
        return
      }

      const payload = {
        ...newDish,
        price: Number(newDish.price),
        preparationTime: newDish.preparationTime ? Number(newDish.preparationTime) : null,
        ingredients: newDish.ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
      }

      const res = await fetch("/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Erreur création plat")
      }

      const created = await res.json()

      // Mise à jour locale immédiate
      setDishes((prev) => [created.dish, ...prev])

      setNewDish({
        name: "",
        price: "",
        description: "",
        categoryId: categories.length > 0 ? categories[0].id : "",
        preparationTime: "",
        ingredients: "",
        isAvailable: true,
      })

      closeDialog()
    } catch (error) {
      console.error("Erreur création plat:", error)
      alert(`Erreur création plat: ${(error as Error).message}`)
    }
  }

  const handleViewDish = async (dishId: string) => {
    try {
      const res = await fetch(`/api/dishes/${dishId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'affichage")

      setSelectedDish(data.dish)
      setModalMode("view")
      setEditDish(null)
    } catch (error) {
      console.error("Erreur view:", error)
    }
  }

  const handleEditDish = async (dishId: string) => {
    try {
      const res = await fetch(`/api/dishes/${dishId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'affichage")
  
      setSelectedDish(data.dish)
      setEditDish({
        name: data.dish.name,
        price: data.dish.price.toString(),
        description: data.dish.description || "",
        categoryId: data.dish.categories?.id || "",
        preparationTime: data.dish.preparationTime
          ? data.dish.preparationTime.toString()
          : "",
        ingredients: data.dish.ingredients || "",
        isAvailable: data.dish.isAvailable,
      })
      setModalMode("edit")
    } catch (error) {
      console.error("Erreur edit:", error)
    }
  }
  
  function handleEditDishChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (!editDish) return
    const { id, value, type, checked } = e.target as HTMLInputElement
    setEditDish({
      ...editDish,
      [id]: type === "checkbox" ? checked : value,
    })
  }

  async function handleSubmitEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedDish || !editDish) return

    try {
      const payload = {
        ...editDish,
        price: Number(editDish.price),
        preparationTime: editDish.preparationTime ? Number(editDish.preparationTime) : null,
        ingredients: editDish.ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
      }
      const res = await fetch(`/api/dishes/${selectedDish.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Erreur modification plat")
      }
      const data = await res.json()

      // Mise à jour locale immédiate
      setDishes((prev) =>
        prev.map((d) => (d.id === selectedDish.id ? data.dish : d))
      )
      setSelectedDish(null)
      setModalMode(null)
      setEditDish(null)
    } catch (error) {
      console.error("Erreur modification plat:", error)
      alert(`Erreur modification plat: ${(error as Error).message}`)
    }
  }

  const handleDeleteDish = async (dishId: string) => {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer ce plat ?")
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/dishes/${dishId}`, {
        method: "DELETE",
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur suppression plat")

      // Mise à jour locale immédiate
      setDishes((prev) => prev.filter((d) => d.id !== dishId))
      alert("Plat supprimé avec succès")
    } catch (error) {
      console.error("Erreur suppression plat:", error)
      alert("Erreur lors de la suppression du plat.")
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1">
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Gestion des Plats</h1>
            <Badge className="bg-white/20 text-white">{filteredDishes.length} plats</Badge>
            <div className="ml-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="bg-white/20 hover:bg-white/30 text-white"
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un plat
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau plat</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations pour ajouter un nouveau plat à
                      votre menu
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const close = () => {
                        const dialog = document.querySelector("dialog")
                        if (dialog) dialog.close()
                      }
                      handleAddDish(e, close)
                    }}
                    className="space-y-4"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Nom du plat</Label>
                        <Input
                          id="name"
                          placeholder="Ex: Tajine"
                          value={newDish.name}
                          onChange={handleNewDishChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Prix (DH)</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="120"
                          value={newDish.price}
                          onChange={handleNewDishChange}
                          required
                          min={0}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Description du plat..."
                        rows={3}
                        value={newDish.description}
                        onChange={handleNewDishChange}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="categoryId">Catégorie</Label>
                        <Select
  value={newDish.categoryId}
  onValueChange={(val) => setNewDish((prev) => ({ ...prev, categoryId: val }))}
>
  <SelectTrigger>
    <SelectValue placeholder="Sélectionner une catégorie" />
  </SelectTrigger>
  <SelectContent>
    {categories.map((cat) => (
      <SelectItem key={cat.id} value={cat.id}>
        {cat.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                      </div>
                      <div>
                        <Label htmlFor="preparationTime">Temps de préparation (min)</Label>
                        <Input
                          id="preparationTime"
                          type="number"
                          placeholder="30"
                          value={newDish.preparationTime}
                          onChange={handleNewDishChange}
                          min={0}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="ingredients">Ingrédients</Label>
                      <Input
                        id="ingredients"
                        placeholder="Ex: tomate, oignon, ail"
                        value={newDish.ingredients}
                        onChange={handleNewDishChange}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isAvailable"
                        checked={newDish.isAvailable}
                        onCheckedChange={(checked) =>
                          setNewDish((prev) => ({ ...prev, isAvailable: checked }))
                        }
                      />
                      <Label htmlFor="isAvailable">Plat disponible</Label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="bg-droovo-gradient hover:opacity-90">
                        Ajouter le plat
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
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
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="placeholder">
                        Aucune catégorie disponible
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <p className="text-center text-gray-500">Chargement des plats...</p>
          ) : filteredDishes.length === 0 ? (
            <p className="text-center text-gray-500">Aucun plat trouvé.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDishes.map((dish) => (
                <Card key={dish.id} className="border-0 shadow-lg overflow-hidden">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-orange-100 flex items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={dish.isAvailable ? "bg-green-500" : "bg-red-500"}>
                        {dish.isAvailable ? "Disponible" : "Indisponible"}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-black/50 text-white">{dish.preparationTime ?? "?"} min</Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg">{dish.name}</h3>
                      <span className="text-lg font-bold text-purple-600">{dish.price} DH</span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{dish.description}</p>

                    <Badge variant="outline" className="text-xs">
                      {dish.category
                        ? typeof dish.category === "string"
                          ? dish.category
                          : dish.category.name
                        : "Sans catégorie"}
                    </Badge>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDish(dish.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditDish(dish.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteDish(dish.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Modal de visualisation */}
          <Dialog open={modalMode === "view"} onOpenChange={(open) => !open && setModalMode(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedDish?.name}</DialogTitle>
                <DialogDescription>
                  {selectedDish?.description || "Aucune description"}
                </DialogDescription>
              </DialogHeader>
              <div>
                <p>
                  <strong>Prix :</strong> {selectedDish?.price} DH
                </p>
                <p>
                  <strong>Catégorie :</strong>{" "}
                  {selectedDish?.category
                    ? typeof selectedDish.category === "string"
                      ? selectedDish.category
                      : selectedDish.category.name
                    : "Sans catégorie"}
                </p>
                <p>
                  <strong>Temps de préparation :</strong>{" "}
                  {selectedDish?.preparationTime ?? "?"} min
                </p>
                <p>
                  <strong>Ingrédients :</strong>{" "}
                  {Array.isArray(selectedDish?.ingredients) && selectedDish.ingredients.length > 0
                    ? selectedDish.ingredients.join(", ")
                    : "Non renseignés"}
                </p>
                <p>
                  <strong>Disponible :</strong> {selectedDish?.isAvailable ? "Oui" : "Non"}
                </p>
              </div>
              <Button
                className="mt-4"
                onClick={() => {
                  setModalMode(null)
                  setSelectedDish(null)
                }}
              >
                Fermer
              </Button>
            </DialogContent>
          </Dialog>

          {/* Modal d'édition */}
          <Dialog open={modalMode === "edit"} onOpenChange={(open) => !open && setModalMode(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Modifier le plat</DialogTitle>
              </DialogHeader>

              {editDish && (
                <form onSubmit={handleSubmitEdit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Nom du plat</Label>
                      <Input
                        id="name"
                        value={editDish.name}
                        onChange={handleEditDishChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Prix (DH)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={editDish.price}
                        onChange={handleEditDishChange}
                        required
                        min={0}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editDish.description}
                      onChange={handleEditDishChange}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="categoryId">Catégorie</Label>
                      <Select
                        value={editDish.categoryId}
                        onValueChange={(val) =>
                          setEditDish((prev) => prev ? { ...prev, categoryId: val } : null)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="preparationTime">Temps de préparation (min)</Label>
                      <Input
                        id="preparationTime"
                        type="number"
                        value={editDish.preparationTime}
                        onChange={handleEditDishChange}
                        min={0}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ingredients">Ingrédients</Label>
                    <Input
                      id="ingredients"
                      value={editDish.ingredients}
                      onChange={handleEditDishChange}
                      placeholder="Ex: tomate, oignon, ail"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isAvailable"
                      checked={editDish.isAvailable}
                      onCheckedChange={(checked) =>
                        setEditDish((prev) => (prev ? { ...prev, isAvailable: checked } : null))
                      }
                    />
                    <Label htmlFor="isAvailable">Plat disponible</Label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-droovo-gradient hover:opacity-90">
                      Enregistrer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setModalMode(null)
                        setSelectedDish(null)
                        setEditDish(null)
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
