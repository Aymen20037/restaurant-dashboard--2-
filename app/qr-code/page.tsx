"use client"

import { useState } from "react"
import { QrCode, Download, Share2, Eye, Copy, Smartphone, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "../components/sidebar"
import { toast } from "@/components/ui/use-toast"

export default function QRCodePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [qrSettings, setQrSettings] = useState({
    restaurantName: "Le Marrakchi",
    description: "Restaurant traditionnel marocain",
    promoActive: true,
    promoText: "10% de réduction sur votre première commande",
    customMessage: "Bienvenue chez Le Marrakchi ! Scannez pour commander",
  })

  const restaurantUrl = `https://droovo.app/restaurant/le-marrakchi`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(restaurantUrl)}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copié !",
      description: "Le lien a été copié dans le presse-papiers",
    })
  }

  const downloadQR = (format: string) => {
    const link = document.createElement("a")
    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&format=${format}&data=${encodeURIComponent(restaurantUrl)}`
    link.download = `qr-code-le-marrakchi.${format}`
    link.click()
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">QR Code & Lien Personnel</h1>
            <Badge className="bg-white/20 text-white">Actif</Badge>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <Tabs defaultValue="qr-code" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="qr-code">QR Code</TabsTrigger>
              <TabsTrigger value="link">Lien Personnel</TabsTrigger>
              <TabsTrigger value="analytics">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="qr-code" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* QR Code Display */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                      <QrCode className="h-5 w-5" />
                      Votre QR Code
                    </CardTitle>
                    <CardDescription>
                      Les clients peuvent scanner ce code pour accéder directement à votre restaurant
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-white rounded-lg shadow-inner">
                        <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code Restaurant" className="w-64 h-64" />
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <p className="font-semibold text-lg">{qrSettings.restaurantName}</p>
                      <p className="text-sm text-gray-600">{qrSettings.description}</p>
                      {qrSettings.promoActive && <Badge className="bg-orange-500">{qrSettings.promoText}</Badge>}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={() => downloadQR("png")} className="bg-droovo-gradient hover:opacity-90">
                        <Download className="mr-2 h-4 w-4" />
                        PNG
                      </Button>
                      <Button onClick={() => downloadQR("svg")} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        SVG
                      </Button>
                    </div>

                    <Button className="w-full" variant="outline">
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimer pour affichage
                    </Button>
                  </CardContent>
                </Card>

                {/* QR Code Settings */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Personnalisation</CardTitle>
                    <CardDescription>Configurez les informations affichées avec le QR code</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="restaurantName">Nom du restaurant</Label>
                      <Input
                        id="restaurantName"
                        value={qrSettings.restaurantName}
                        onChange={(e) => setQrSettings({ ...qrSettings, restaurantName: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={qrSettings.description}
                        onChange={(e) => setQrSettings({ ...qrSettings, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="customMessage">Message personnalisé</Label>
                      <Textarea
                        id="customMessage"
                        value={qrSettings.customMessage}
                        onChange={(e) => setQrSettings({ ...qrSettings, customMessage: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="promoActive">Promotion active</Label>
                        <p className="text-sm text-gray-600">Afficher une promotion avec le QR code</p>
                      </div>
                      <Switch
                        id="promoActive"
                        checked={qrSettings.promoActive}
                        onCheckedChange={(checked) => setQrSettings({ ...qrSettings, promoActive: checked })}
                      />
                    </div>

                    {qrSettings.promoActive && (
                      <div>
                        <Label htmlFor="promoText">Texte de la promotion</Label>
                        <Input
                          id="promoText"
                          value={qrSettings.promoText}
                          onChange={(e) => setQrSettings({ ...qrSettings, promoText: e.target.value })}
                        />
                      </div>
                    )}

                    <Button className="w-full bg-droovo-gradient hover:opacity-90">
                      Sauvegarder les modifications
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Usage Instructions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Comment utiliser votre QR Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <Printer className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold">1. Imprimez</h3>
                      <p className="text-sm text-gray-600">Téléchargez et imprimez votre QR code</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                        <Eye className="h-6 w-6 text-orange-600" />
                      </div>
                      <h3 className="font-semibold">2. Affichez</h3>
                      <p className="text-sm text-gray-600">Placez-le dans votre restaurant, sur vos tables</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Smartphone className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold">3. Clients scannent</h3>
                      <p className="text-sm text-gray-600">Accès direct à votre menu et commande</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="link" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Lien Personnel du Restaurant</CardTitle>
                  <CardDescription>Partagez ce lien sur vos réseaux sociaux et supports marketing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input value={restaurantUrl} readOnly className="flex-1" />
                    <Button onClick={() => copyToClipboard(restaurantUrl)} variant="outline">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Button className="bg-green-500 hover:bg-green-600">
                      <Share2 className="mr-2 h-4 w-4" />
                      Partager sur WhatsApp
                    </Button>
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      <Share2 className="mr-2 h-4 w-4" />
                      Partager sur Facebook
                    </Button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Aperçu du partage</h4>
                    <div className="border rounded-lg p-3 bg-white">
                      <h5 className="font-semibold">{qrSettings.restaurantName}</h5>
                      <p className="text-sm text-gray-600">{qrSettings.description}</p>
                      <p className="text-xs text-blue-600 mt-1">{restaurantUrl}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Scans aujourd'hui</p>
                        <p className="text-2xl font-bold text-purple-600">47</p>
                      </div>
                      <QrCode className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Scans ce mois</p>
                        <p className="text-2xl font-bold text-orange-600">1,234</p>
                      </div>
                      <Smartphone className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Conversions</p>
                        <p className="text-2xl font-bold text-green-600">23%</p>
                      </div>
                      <Eye className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Commandes via QR</p>
                        <p className="text-2xl font-bold text-blue-600">289</p>
                      </div>
                      <Share2 className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Activité des scans</CardTitle>
                  <CardDescription>Nombre de scans par jour sur les 30 derniers jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-1">
                    {Array.from({ length: 30 }, (_, i) => (
                      <div
                        key={i}
                        className="bg-purple-200 rounded-t"
                        style={{
                          height: `${Math.random() * 100}%`,
                          width: "3%",
                        }}
                      />
                    ))}
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
