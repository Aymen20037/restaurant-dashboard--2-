"use client"

import { useEffect, useState } from "react"
import { QrCode, Download, Copy, Smartphone, Printer, Eye, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "../components/sidebar"
import { toast } from "@/components/ui/use-toast"
import jsPDF from "jspdf"


interface QrSettings {
  restaurantName: string
  description: string
  customMessage: string
}

export default function QRCodePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [qrSettings, setQrSettings] = useState<QrSettings>({
    restaurantName: "",
    description: "",
    customMessage: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user")
        if (!res.ok) throw new Error()
        const data = await res.json()
        setQrSettings({
          restaurantName: data.restaurantName ?? "",
          description: data.description ?? "",
          customMessage: data.customMessage ?? "",
        })
      } catch {
        toast({ title: "Erreur", description: "Impossible de charger les informations" })
      }
    }
    fetchUserData()
  }, [])

  const restaurantSlug = qrSettings.restaurantName.toLowerCase().replace(/\s+/g, "-")
  const restaurantUrl = `https://droovo.app/restaurant/${encodeURIComponent(restaurantSlug)}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(restaurantUrl)}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copié !", description: "Le lien a été copié dans le presse-papiers" })
  }

  const downloadQR = (format: string) => {
    const link = document.createElement("a")
    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&format=${format}&data=${encodeURIComponent(restaurantUrl)}`
    link.download = `qr-code.${format}`
    link.click()
  }
  const handlePrintPDF = () => {
    const doc = new jsPDF()
    const img = new Image()
    img.src = qrCodeUrl 
  
    img.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth()
      const centerX = pageWidth / 2
  
      const imgWidth = 100
      const imgHeight = 100
      const imgX = centerX - imgWidth / 2
      const imgY = 40
  
      doc.setFontSize(18)
      doc.setTextColor(40, 40, 40)
      doc.text("QR Code de votre restaurant", centerX, 20, { align: "center" })
  
      doc.setDrawColor(200)
      doc.rect(imgX - 5, imgY - 5, imgWidth + 10, imgHeight + 10) 
  
      doc.addImage(img, "PNG", imgX, imgY, imgWidth, imgHeight)
  
      doc.setFontSize(14)
      doc.setTextColor(60, 60, 60)
      doc.text(qrSettings.restaurantName, centerX, imgY + imgHeight + 15, { align: "center" })
  
      doc.setFontSize(11)
      doc.setTextColor(90, 90, 90)
      doc.text(qrSettings.description, centerX, imgY + imgHeight + 25, { align: "center" })
  
      if (qrSettings.customMessage) {
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(qrSettings.customMessage, centerX, imgY + imgHeight + 40, { align: "center" })
      }
  
      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text("Généré par Droovo", centerX, 280, { align: "center" })
  
      doc.save("Votre-QR-Code.pdf")
    }
  }
  

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1">
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

            {/* QR CODE VIEW */}
            <TabsContent value="qr-code" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">

                <Card className="border-0 shadow-lg">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                      <QrCode className="h-5 w-5" />
                      Votre QR Code
                    </CardTitle>
                    <CardDescription>
                      Les clients peuvent scanner ce code pour accéder à votre restaurant
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-white rounded-lg shadow-inner">
                        <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <p className="font-semibold text-lg">{qrSettings.restaurantName}</p>
                      <p className="text-sm text-gray-600">{qrSettings.description}</p>
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

                    <Button className="w-full" variant="outline" onClick={handlePrintPDF}>
  <Printer className="mr-2 h-4 w-4" />
  Imprimer pour affichage
</Button>

                  </CardContent>
                </Card>

                {/* Custom Message */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Personnalisation</CardTitle>
                    <CardDescription>Message affiché avec le QR code</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Nom du restaurant</Label>
                      <Input value={qrSettings.restaurantName} readOnly />
                    </div>
                    <div>
  <Label>Description</Label>
  <Input
    value={qrSettings.description}
    onChange={(e) => setQrSettings({ ...qrSettings, description: e.target.value })}
/>
</div>

<div>
  <Label>Message personnalisé</Label>
  <Textarea
    value={qrSettings.customMessage}
    rows={3}
    onChange={(e) => setQrSettings({ ...qrSettings, customMessage: e.target.value })}
/>
</div>

<Button
  className="w-full mt-2 bg-droovo-gradient hover:opacity-90"
  onClick={async () => {
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: qrSettings.description,
          customMessage: qrSettings.customMessage,
        }),
      })

      if (!res.ok) throw new Error()
      toast({ title: "Modifications enregistrées", description: "Vos informations ont été mises à jour" })
    } catch {
      toast({ title: "Erreur", description: "Échec de la mise à jour des informations" })
    }
  }}
>
  Sauvegarder les modifications
</Button>

                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* LINK TAB */}
            <TabsContent value="link" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Lien Personnel</CardTitle>
                  <CardDescription>Partagez ce lien sur vos réseaux sociaux</CardDescription>
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
                      WhatsApp
                    </Button>
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      <Share2 className="mr-2 h-4 w-4" />
                      Facebook
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ANALYTICS */}
            <TabsContent value="analytics" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Activité des scans</CardTitle>
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
