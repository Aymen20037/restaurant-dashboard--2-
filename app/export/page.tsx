"use client"

import { useEffect, useState } from "react"
import { Download, FileText, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "../components/sidebar"

type WhatsAppCampaign = {
  id: string
  name: string
  type: string
  status: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  startDate: string
  endDate: string
  targetAudience?: string | null
  createdAt: string
  updatedAt: string
  userId: string
}

export default function ExportAndWhatsAppPage() {
  const [loadingExport, setLoadingExport] = useState(false)
  const [loadingCampaigns, setLoadingCampaigns] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>([])

  const [exportSettings, setExportSettings] = useState({
    format: "csv", 
    period: "month" as "week" | "month" | "quarter" | "year" | "custom",
    startDate: "",
    endDate: "",
    includeOrders: true,
    includeCustomers: true,
    includePayments: true,
    includeReviews: false,
  })

  const exportTypes = [
    {
      id: "orders",
      name: "Historique des commandes",
      description: "Toutes les commandes avec détails clients et produits",
      icon: FileText,
    },
    {
      id: "customers",
      name: "Base de données clients",
      description: "Informations clients et historique d'achat",
      icon: FileText,
    },
    {
      id: "payments",
      name: "Transactions financières",
      description: "Historique des paiements et revenus",
      icon: FileText,
    },
    {
      id: "reviews",
      name: "Avis et évaluations",
      description: "Tous les avis clients avec notes",
      icon: FileText,
    },
  ]

  useEffect(() => {
    async function fetchCampaigns() {
      setLoadingCampaigns(true)
      try {
        const res = await fetch("/api/whatsapp-campaigns")
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des campagnes")
        }
        const json = await res.json()
        setCampaigns(json.campaigns || [])
      } catch (error) {
        setMessage(`Erreur campagnes : ${(error as Error).message}`)
      } finally {
        setLoadingCampaigns(false)
      }
    }
    fetchCampaigns()
  }, [])

  async function handleExport() {
    setLoadingExport(true)
    setMessage(null)
    try {
      const payload = {
        format: exportSettings.format,
        period: exportSettings.period,
        startDate: exportSettings.period === "custom" ? exportSettings.startDate : undefined,
        endDate: exportSettings.period === "custom" ? exportSettings.endDate : undefined,
        includeOrders: exportSettings.includeOrders,
        includeCustomers: exportSettings.includeCustomers,
        includePayments: exportSettings.includePayments,
        includeReviews: exportSettings.includeReviews,
      }
  
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
  
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Erreur lors de l'export")
      }
  
      const data = await response.json()
      console.log("Données exportées :", data)
  
      if (data.format === "csv" && data.files) {
        data.files.forEach((file: { name: string; content: string }) => {
          const blob = new Blob(["\uFEFF" + file.content], { type: "text/csv;charset=utf-8;" })
          const url = window.URL.createObjectURL(blob)
  
          const a = document.createElement("a")
          a.href = url
          a.download = file.name
          a.style.display = "none"
          document.body.appendChild(a)
          a.click()
  
          setTimeout(() => {
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
          }, 100)
        })
  
        setMessage("Export CSV téléchargé avec succès.")
      } else if (data.format === "json") {
        console.log("Export JSON :", data.data)
        setMessage("Export JSON reçu (voir console).")
      } else {
        setMessage("Format de réponse inattendu.")
      }
    } catch (error: any) {
      setMessage(`Erreur export : ${error.message}`)
    } finally {
      setLoadingExport(false)
    }
  }
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={true} />

      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Gestion Export & WhatsApp</h1>

        <Tabs defaultValue="export" className="space-y-6 max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-2 gap-2">
            <TabsTrigger value="export">Export des données</TabsTrigger>
            <TabsTrigger value="whatsapp">Campagnes WhatsApp</TabsTrigger>
          </TabsList>

          {/* Onglet Export */}
          <TabsContent value="export">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Types de données</CardTitle>
                  <CardDescription>Sélectionnez les données à exporter</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {exportTypes.map(({ id, name, description, icon: Icon }) => {
                    const key = ("include" + id.charAt(0).toUpperCase() + id.slice(1)) as
                      | "includeOrders"
                      | "includeCustomers"
                      | "includePayments"
                      | "includeReviews"
                    return (
                      <div key={id} className="flex items-center space-x-3 p-2 border rounded-lg">
                        <Checkbox
                          id={id}
                          checked={exportSettings[key]}
                          onCheckedChange={(checked) =>
                            setExportSettings((prev) => ({
                              ...prev,
                              [key]: checked,
                            }))
                          }
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <Icon className="h-4 w-4 text-purple-600" />
                            <Label htmlFor={id} className="font-medium cursor-pointer">
                              {name}
                            </Label>
                          </div>
                          <p className="text-sm text-gray-600">{description}</p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Paramètres d'export</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="format">Format</Label>
                    <Select
                      value={exportSettings.format}
                      onValueChange={(value) =>
                        setExportSettings((prev) => ({ ...prev, format: value as any }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                        <SelectItem value="json">JSON (.json)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="period">Période</Label>
                    <Select
                      value={exportSettings.period}
                      onValueChange={(value) =>
                        setExportSettings((prev) => ({
                          ...prev,
                          period: value as typeof exportSettings.period,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Cette semaine</SelectItem>
                        <SelectItem value="month">Ce mois</SelectItem>
                        <SelectItem value="quarter">Ce trimestre</SelectItem>
                        <SelectItem value="year">Cette année</SelectItem>
                        <SelectItem value="custom">Personnalisée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {exportSettings.period === "custom" && (
                    <>
                      <div>
                        <Label htmlFor="startDate">Date de début</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={exportSettings.startDate}
                          onChange={(e) =>
                            setExportSettings((prev) => ({ ...prev, startDate: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Date de fin</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={exportSettings.endDate}
                          onChange={(e) =>
                            setExportSettings((prev) => ({ ...prev, endDate: e.target.value }))
                          }
                        />
                      </div>
                    </>
                  )}

                  <Button
                    className="bg-droovo-gradient hover:opacity-90 w-full"
                    onClick={handleExport}
                    disabled={loadingExport}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {loadingExport ? "Export en cours..." : "Exporter"}
                  </Button>

                  {message && (
                    <p
                      className={`mt-2 text-sm ${
                        message.startsWith("Erreur") ? "text-red-600" : "text-green-700"
                      }`}
                    >
                      {message}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet WhatsApp */}
          <TabsContent value="whatsapp">
            <Card className="shadow-lg border-0 max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>
                  <MessageSquare className="inline-block mr-2 h-5 w-5 text-green-600" />
                  Campagnes WhatsApp Business
                </CardTitle>
                <CardDescription>
                  Liste des campagnes WhatsApp Business récentes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingCampaigns && <p>Chargement des campagnes...</p>}
                {!loadingCampaigns && campaigns.length === 0 && (
                  <p>Aucune campagne WhatsApp trouvée.</p>
                )}
                {campaigns.map((campagne) => (
                  <div
                    key={campagne.id}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                  >
                    <h3 className="font-semibold text-lg">{campagne.name}</h3>
                    <p>
                      Statut : <strong>{campagne.status}</strong> - Budget :{" "}
                      <strong>{campagne.budget.toFixed(2)} DH</strong>
                    </p>
                    <p>
                      Période :{" "}
                      <strong>
                        {new Date(campagne.startDate).toLocaleDateString()} -{" "}
                        {new Date(campagne.endDate).toLocaleDateString()}
                      </strong>
                    </p>
                    <p>Impressions : {campagne.impressions}</p>
                    <p>Clics : {campagne.clicks}</p>
                    <p>Conversions : {campagne.conversions}</p>
                    {campagne.targetAudience && (
                      <p>Audience ciblée : {campagne.targetAudience}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
