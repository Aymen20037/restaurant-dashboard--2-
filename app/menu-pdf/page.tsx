"use client"

import { useState } from "react"
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

export default function MenuPDFPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [menuSettings, setMenuSettings] = useState({
    title: "Le Marrakchi - Menu",
    subtitle: "Restaurant Traditionnel Marocain",
    description: "Découvrez notre cuisine authentique dans une ambiance chaleureuse",
    showPrices: true,
    showDescriptions: true,
    showImages: false,
    colorTheme: "droovo",
    layout: "classic",
    language: "fr",
  })

  const menuCategories = [
    {
      name: "Entrées",
      dishes: [
        { name: "Pastilla au Poulet", price: 130, description: "Feuilleté croustillant au poulet, amandes et épices" },
        { name: "Salade Marocaine", price: 35, description: "Salade fraîche aux tomates, concombres et herbes" },
        { name: "Briouates aux Crevettes", price: 85, description: "Petits feuilletés aux crevettes et épices" },
      ],
    },
    {
      name: "Plats Principaux",
      dishes: [
        {
          name: "Tajine Poulet aux Olives",
          price: 120,
          description: "Tajine traditionnel avec poulet fermier et olives vertes",
        },
        { name: "Couscous Royal", price: 150, description: "Couscous avec agneau, poulet, merguez et légumes" },
        { name: "Tajine Kefta", price: 110, description: "Boulettes de viande hachée aux tomates et épices" },
        { name: "Rfissa", price: 140, description: "Plat traditionnel au poulet et vermicelles" },
      ],
    },
    {
      name: "Desserts",
      dishes: [
        { name: "Cornes de Gazelle", price: 45, description: "Pâtisseries aux amandes et fleur d'oranger" },
        { name: "Chebakia", price: 35, description: "Pâtisseries au miel et graines de sésame" },
        { name: "Mousse au Chocolat", price: 40, description: "Mousse légère au chocolat noir" },
      ],
    },
    {
      name: "Boissons",
      dishes: [
        { name: "Thé à la Menthe", price: 15, description: "Thé vert traditionnel à la menthe fraîche" },
        { name: "Café Marocain", price: 20, description: "Café épicé à la cannelle et cardamome" },
        { name: "Jus d'Orange Frais", price: 25, description: "Jus d'orange pressé minute" },
        { name: "Limonade Maison", price: 22, description: "Limonade fraîche aux herbes" },
      ],
    },
  ]

  const colorThemes = [
    { id: "droovo", name: "Droovo", primary: "#8B5CF6", secondary: "#F59E0B" },
    { id: "classic", name: "Classique", primary: "#1F2937", secondary: "#D97706" },
    { id: "elegant", name: "Élégant", primary: "#374151", secondary: "#10B981" },
    { id: "modern", name: "Moderne", primary: "#6366F1", secondary: "#EC4899" },
  ]

  const generatePDF = () => {
    console.log("Generating PDF with settings:", menuSettings)
    // Ici, vous appelleriez votre API de génération de PDF
  }

  const previewMenu = () => {
    console.log("Opening menu preview")
    // Ici, vous ouvririez un aperçu du menu
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
              <Button onClick={previewMenu} className="bg-white/20 hover:bg-white/30 text-white" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Aperçu
              </Button>
              <Button onClick={generatePDF} className="bg-white/20 hover:bg-white/30 text-white" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
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
                        value={menuSettings.colorTheme}
                        onValueChange={(value) => setMenuSettings({ ...menuSettings, colorTheme: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorThemes.map((theme) => (
                            <SelectItem key={theme.id} value={theme.id}>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primary }} />
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.secondary }} />
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
                        value={menuSettings.layout}
                        onValueChange={(value) => setMenuSettings({ ...menuSettings, layout: value })}
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

                    <div>
                      <Label htmlFor="language">Langue</Label>
                      <Select
                        value={menuSettings.language}
                        onValueChange={(value) => setMenuSettings({ ...menuSettings, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="en">English</SelectItem>
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
                            checked={menuSettings.showPrices}
                            onCheckedChange={(checked) => setMenuSettings({ ...menuSettings, showPrices: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showDescriptions" className="text-sm">
                            Afficher les descriptions
                          </Label>
                          <Switch
                            id="showDescriptions"
                            checked={menuSettings.showDescriptions}
                            onCheckedChange={(checked) =>
                              setMenuSettings({ ...menuSettings, showDescriptions: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showImages" className="text-sm">
                            Inclure les images
                          </Label>
                          <Switch
                            id="showImages"
                            checked={menuSettings.showImages}
                            onCheckedChange={(checked) => setMenuSettings({ ...menuSettings, showImages: checked })}
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
                        value={menuSettings.title}
                        onChange={(e) => setMenuSettings({ ...menuSettings, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="subtitle">Sous-titre</Label>
                      <Input
                        id="subtitle"
                        value={menuSettings.subtitle}
                        onChange={(e) => setMenuSettings({ ...menuSettings, subtitle: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={menuSettings.description}
                        onChange={(e) => setMenuSettings({ ...menuSettings, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Contenu du menu</CardTitle>
                  <CardDescription>Gérez les catégories et plats de votre menu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {menuCategories.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">{category.name}</h3>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {category.dishes.map((dish, dishIndex) => (
                            <div key={dishIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{dish.name}</h4>
                                  <span className="font-semibold text-purple-600">{dish.price} DH</span>
                                </div>
                                <p className="text-sm text-gray-600">{dish.description}</p>
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

            <TabsContent value="preview" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Aperçu du menu</CardTitle>
                  <CardDescription>Voici comment votre menu apparaîtra dans le PDF</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border rounded-lg p-8 shadow-inner max-w-2xl mx-auto">
                    {/* Menu Header */}
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold text-purple-600 mb-2">{menuSettings.title}</h1>
                      <h2 className="text-xl text-gray-600 mb-4">{menuSettings.subtitle}</h2>
                      {menuSettings.description && <p className="text-gray-600 italic">{menuSettings.description}</p>}
                    </div>

                    {/* Menu Content */}
                    <div className="space-y-8">
                      {menuCategories.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                          <h3 className="text-xl font-bold text-orange-600 mb-4 border-b-2 border-orange-200 pb-2">
                            {category.name}
                          </h3>
                          <div className="space-y-3">
                            {category.dishes.map((dish, dishIndex) => (
                              <div key={dishIndex} className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{dish.name}</h4>
                                  {menuSettings.showDescriptions && (
                                    <p className="text-sm text-gray-600">{dish.description}</p>
                                  )}
                                </div>
                                {menuSettings.showPrices && (
                                  <span className="font-bold text-purple-600 ml-4">{dish.price} DH</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
                      <p>Restaurant Le Marrakchi - Casablanca, Maroc</p>
                      <p>Tél: +212 522 123 456 | www.lemarrakchi.ma</p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 mt-6">
                    <Button onClick={generatePDF} className="bg-droovo-gradient hover:opacity-90">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger PDF
                    </Button>
                    <Button variant="outline">
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimer
                    </Button>
                    <Button variant="outline">
                      <Share2 className="mr-2 h-4 w-4" />
                      Partager
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
