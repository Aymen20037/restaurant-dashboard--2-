"use client"

import { useState, useEffect } from "react"
import { Download, Eye, Edit, Palette, Printer, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "../components/sidebar"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

type MenuSettings = {
  title: string
  subtitle?: string
  description?: string
  showPrices?: boolean
  showDescriptions?: boolean
  showImages?: boolean
  colorTheme?: string
  layout?: string
  language?: string
}

type Dish = {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  category?: {
    id: string
    name: string
  }
}

export default function MenuPDFPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [menuSettings, setMenuSettings] = useState<MenuSettings>({
    title: "Menu",
    subtitle: "Restaurant ",
    description: "Découvrez notre cuisine authentique dans une ambiance chaleureuse",
    showPrices: true,
    showDescriptions: true,
    showImages: false,
    colorTheme: "droovo",
    layout: "classic",
  })

  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<{ restaurantName?: string; city?: string; phone?: string }>({})

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, dishesRes] = await Promise.all([
          fetch("/api/menu", { credentials: "include" }),
          fetch("/api/dishes", { credentials: "include" }),
        ])

        if (!settingsRes.ok) {
          const err = await settingsRes.json().catch(() => null)
          throw new Error(err?.message || "Erreur lors du chargement des réglages")
        }
        if (!dishesRes.ok) {
          const err = await dishesRes.json().catch(() => null)
          throw new Error(err?.message || "Erreur lors du chargement des plats")
        }

        const settingsJson = await settingsRes.json()
        const settingsData: MenuSettings = settingsJson.settings || {}
        const userInfo = settingsJson.user || {}

        const dishesJson = await dishesRes.json()
const dishesData: Dish[] = (dishesJson.dishes || []).map((d: any) => ({
  ...d,
  category: d.categories || null, // transformer categories -> category
}))


        setMenuSettings(settingsData)
        setDishes(dishesData)
        setUser(userInfo)
      } catch (err: any) {
        setError(err.message || "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const menuCategories = dishes.reduce<Record<string, Dish[]>>((acc, dish) => {
    const catName = dish.category?.name || "Sans catégorie"
    if (!acc[catName]) acc[catName] = []
    acc[catName].push(dish)
    return acc
  }, {})

  const colorThemes = [
    { id: "droovo", name: "Droovo", primary: "#8B5CF6", secondary: "#F59E0B" },
    { id: "classic", name: "Classique", primary: "#1F2937", secondary: "#D97706" },
    { id: "elegant", name: "Élégant", primary: "#374151", secondary: "#10B981" },
    { id: "modern", name: "Moderne", primary: "#6366F1", secondary: "#EC4899" },
  ]

  // Sélection du thème actuel et classe mise en page
  const currentTheme = colorThemes.find((t) => t.id === menuSettings.colorTheme) ?? colorThemes[0]

  const layoutClass = {
    classic: "max-w-2xl",
    modern: "max-w-3xl",
    elegant: "max-w-xl",
    compact: "max-w-md",
  }[menuSettings.layout ?? "classic"]

  const generatePDF = async () => {
    const element = document.getElementById("pdf-content")
    if (!element) return

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    })
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF("p", "mm", "a4")
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
    pdf.save("menu.pdf")
  }

  
  const shareMenu = async () => {
    try {
      const shareUrl = window.location.href
      if (navigator.share) {
        await navigator.share({
          title: "Consultez notre menu",
          text: "Voici notre menu numérique",
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        alert("Lien copié dans le presse-papiers ✅")
      }
    } catch (error) {
      alert("Échec du partage : " + (error as Error).message)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      let res = await fetch("/api/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuSettings),
        credentials: "include",
      })

      if (res.status === 404) {
        res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(menuSettings),
          credentials: "include",
        })
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        const msg = errorData?.message || "Erreur lors de la sauvegarde"
        throw new Error(msg)
      }

      window.alert("Réglages sauvegardés avec succès !")
    } catch (e: any) {
      window.alert("Erreur: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  function formatPrice(price: any) {
    if (price == null) return "-"
    if (typeof price === "number") return price.toFixed(2)
    if (typeof price === "string") return parseFloat(price).toFixed(2)
    if (typeof price === "object" && typeof price.toNumber === "function")
      return price.toNumber().toFixed(2)
    return "-"
  }

  const previewMenu = () => {
    const element = document.getElementById("pdf-content")
    if (!element) {
      alert("Contenu du menu introuvable pour l'aperçu.")
      return
    }

    const printWindow = window.open("", "_blank", "width=800,height=600")
    if (!printWindow) {
      alert("Impossible d'ouvrir la fenêtre d'aperçu.")
      return
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Aperçu du menu</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2, h3, h4 { color: ${currentTheme.primary}; }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Menu PDF & Prévisualisation</h1>
            <div className="ml-auto flex gap-2">
              <Button
                onClick={previewMenu}
                className="bg-white/20 hover:bg-white/30 text-white"
                variant="outline"
                disabled={saving}
              >
                <Eye className="mr-2 h-4 w-4" />
                Aperçu
              </Button>
              <Button
                onClick={generatePDF}
                className="bg-white/20 hover:bg-white/30 text-white"
                variant="outline"
                disabled={saving}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
              </Button>
              <Button
                onClick={saveSettings}
                className="bg-white/20 hover:bg-white/30 text-white"
                variant="outline"
                disabled={saving}
              >
                Sauvegarder
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <Tabs defaultValue="design" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="design">Design & Style</TabsTrigger>
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="preview">Aperçu</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Design Settings */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Personnalisation du design
                    </CardTitle>
                    <CardDescription>Configurez l'apparence de votre menu PDF</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="colorTheme">Thème de couleurs</Label>
                      <Select
                        value={menuSettings?.colorTheme ?? ""}
                        onValueChange={(value) =>
                          setMenuSettings({ ...menuSettings!, colorTheme: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorThemes.map((theme) => (
                            <SelectItem key={theme.id} value={theme.id}>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: theme.primary }}
                                  />
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: theme.secondary }}
                                  />
                                </div>
                                {theme.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="layout">Mise en page</Label>
                      <Select
                        value={menuSettings?.layout ?? ""}
                        onValueChange={(value) =>
                          setMenuSettings({ ...menuSettings!, layout: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classic">Classique</SelectItem>
                          <SelectItem value="modern">Moderne</SelectItem>
                          <SelectItem value="elegant">Élégant</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                  

                    <div className="space-y-3">
                      <Label>Options d'affichage</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showPrices" className="text-sm">
                            Afficher les prix
                          </Label>
                          <Switch
                            id="showPrices"
                            checked={menuSettings?.showPrices ?? false}
                            onCheckedChange={(checked) =>
                              setMenuSettings({ ...menuSettings!, showPrices: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showDescriptions" className="text-sm">
                            Afficher les descriptions
                          </Label>
                          <Switch
                            id="showDescriptions"
                            checked={menuSettings?.showDescriptions ?? false}
                            onCheckedChange={(checked) =>
                              setMenuSettings({ ...menuSettings!, showDescriptions: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showImages" className="text-sm">
                            Inclure les images
                          </Label>
                          <Switch
                            id="showImages"
                            checked={menuSettings?.showImages ?? false}
                            onCheckedChange={(checked) =>
                              setMenuSettings({ ...menuSettings!, showImages: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Header Settings */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>En-tête du menu</CardTitle>
                    <CardDescription>Informations affichées en haut du menu</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Titre principal</Label>
                      <Input
                        id="title"
                        value={menuSettings?.title ?? ""}
                        onChange={(e) =>
                          setMenuSettings({ ...menuSettings!, title: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="subtitle">Sous-titre</Label>
                      <Input
                        id="subtitle"
                        value={menuSettings?.subtitle ?? ""}
                        onChange={(e) =>
                          setMenuSettings({ ...menuSettings!, subtitle: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={menuSettings?.description ?? ""}
                        onChange={(e) =>
                          setMenuSettings({ ...menuSettings!, description: e.target.value })
                        }
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contenu */}
            <TabsContent value="content" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Contenu du menu</CardTitle>
                  <CardDescription>Gérez les catégories et plats de votre menu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(menuCategories).map(([categoryName, dishes]) => (
                      <div key={categoryName} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">{categoryName}</h3>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {dishes.map((dish) => (
                            <div
                              key={dish.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded"
                            >
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{dish.name}</h4>
                                  {menuSettings?.showPrices && (
                                    <span className="font-semibold text-purple-600">
                                      {formatPrice(dish.price)} DH
                                    </span>
                                  )}
                                </div>
                                {menuSettings?.showDescriptions && dish.description && (
                                  <p className="text-sm text-gray-600">{dish.description}</p>
                                )}
                              </div>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aperçu */}
            <TabsContent value="preview" className="space-y-6">
              {loading ? (
                <p>Chargement du menu...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : (
                <div
                  id="pdf-content"
                  className={`bg-white border rounded-lg p-8 shadow-inner mx-auto ${layoutClass}`}
                  style={{ color: currentTheme.primary }}
                >
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: currentTheme.primary }}>
                      {menuSettings?.title}
                    </h1>
                    <h2
                      className="text-xl mb-4"
                      style={{ color: currentTheme.secondary }}
                    >
                      {menuSettings?.subtitle}
                    </h2>
                    {menuSettings?.description && (
                      <p
                        className="italic"
                        style={{ color: currentTheme.secondary }}
                      >
                        {menuSettings.description}
                      </p>
                    )}
                  </div>

                  {/* Menu Categories and Dishes */}
                  <div className="space-y-8">
                    {Object.entries(menuCategories).map(([categoryName, dishes]) => (
                      <div key={categoryName}>
                        <h3
                          className="text-xl font-bold mb-4 border-b-2 pb-2"
                          style={{
                            color: currentTheme.secondary,
                            borderColor: currentTheme.secondary + "33",
                          }}
                        >
                          {categoryName}
                        </h3>
                        <div className="space-y-3">
                          {dishes.map((dish) => (
                            <div
                              key={dish.id}
                              className="flex justify-between items-start"
                            >
                              <div className="flex-1">
                                <h4 className="font-semibold">{dish.name}</h4>
                                {menuSettings?.showDescriptions && dish.description && (
                                  <p
                                    className="text-sm"
                                    style={{ color: currentTheme.primary }}
                                  >
                                    {dish.description}
                                  </p>
                                )}
                                {menuSettings?.showImages && dish.image && (
                                  <img
                                    src={dish.image}
                                    alt={dish.name}
                                    className="w-20 h-20 object-cover rounded mt-2"
                                  />
                                )}
                              </div>
                              {menuSettings?.showPrices && (
                                <span
                                  className="font-semibold"
                                  style={{ color: currentTheme.primary }}
                                >
                                  {formatPrice(dish.price)} DH
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div
                    className="mt-8 pt-4 border-t text-center text-sm"
                    style={{ color: currentTheme.secondary }}
                  >
                    <p>{user.restaurantName ?? "Restaurant"} - {user.city ?? "Ville inconnue"}</p>
                    <p>Tél: {user.phone ?? "Numéro non disponible"}</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
