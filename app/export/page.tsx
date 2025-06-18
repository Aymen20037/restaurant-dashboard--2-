"use client"

import { useState } from "react"
import { Download, FileText, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "../components/sidebar"

export default function ExportPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [exportSettings, setExportSettings] = useState({
    format: "excel",
    period: "month",
    startDate: "",
    endDate: "",
    includeOrders: true,
    includeCustomers: true,
    includePayments: true,
    includeReviews: false,
    emailNotification: true,
    whatsappNotification: false,
  })

  const exportTypes = [
    {
      id: "orders",
      name: "Historique des commandes",
      description: "Toutes les commandes avec détails clients et produits",
      icon: FileText,
      count: "1,247 commandes",
    },
    {
      id: "customers",
      name: "Base de données clients",
      description: "Informations clients et historique d'achat",
      icon: FileText,
      count: "892 clients",
    },
    {
      id: "payments",
      name: "Transactions financières",
      description: "Historique des paiements et revenus",
      icon: FileText,
      count: "1,156 transactions",
    },
    {
      id: "reviews",
      name: "Avis et évaluations",
      description: "Tous les avis clients avec notes",
      icon: FileText,
      count: "234 avis",
    },
  ]

  const whatsappTemplates = [
    {
      id: "promo",
      name: "Promotion spéciale",
      message: "🍽️ Offre spéciale chez {restaurant_name}! {promo_details}. Commandez maintenant: {restaurant_link}",
    },
    {
      id: "new_dish",
      name: "Nouveau plat",
      message: "🆕 Découvrez notre nouveau plat: {dish_name} à {price} DH! Commandez sur: {restaurant_link}",
    },
    {
      id: "weekend",
      name: "Offre weekend",
      message: "🎉 Ce weekend, profitez de nos menus spéciaux chez {restaurant_name}! Réservez: {restaurant_link}",
    },
  ]

  const handleExport = () => {
    // Simulation de l'export
    console.log("Export settings:", exportSettings)
    // Ici, vous appelleriez votre API d'export
  }

  const sendWhatsAppCampaign = (template: any) => {
    console.log("Sending WhatsApp campaign with template:", template)
    // Ici, vous appelleriez votre API WhatsApp Business
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Export & Communication</h1>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <Tabs defaultValue="export" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="export">Export de données</TabsTrigger>
              <TabsTrigger value="whatsapp">Campagnes WhatsApp</TabsTrigger>
            </TabsList>

            <TabsContent value="export" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Export Types */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Types de données à exporter</CardTitle>
                      <CardDescription>Sélectionnez les données que vous souhaitez exporter</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {exportTypes.map((type) => (
                        <div key={type.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Checkbox
                            id={type.id}
                            checked={exportSettings[`include${type.id.charAt(0).toUpperCase() + type.id.slice(1)}`]}
                            onCheckedChange={(checked) =>
                              setExportSettings({
                                ...exportSettings,
                                [`include${type.id.charAt(0).toUpperCase() + type.id.slice(1)}`]: checked,
                              })
                            }
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4 text-purple-600" />
                              <Label htmlFor={type.id} className="font-medium">
                                {type.name}
                              </Label>
                            </div>
                            <p className="text-sm text-gray-600">{type.description}</p>
                            <p className="text-xs text-gray-500">{type.count}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Export Settings */}
                <div className="space-y-4">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Paramètres d'export</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="format">Format de fichier</Label>
                        <Select
                          value={exportSettings.format}
                          onValueChange={(value) => setExportSettings({ ...exportSettings, format: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                            <SelectItem value="csv">CSV (.csv)</SelectItem>
                            <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="period">Période</Label>
                        <Select
                          value={exportSettings.period}
                          onValueChange={(value) => setExportSettings({ ...exportSettings, period: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">Cette semaine</SelectItem>
                            <SelectItem value="month">Ce mois</SelectItem>
                            <SelectItem value="quarter">Ce trimestre</SelectItem>
                            <SelectItem value="year">Cette année</SelectItem>
                            <SelectItem value="custom">Période personnalisée</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {exportSettings.period === "custom" && (
                        <div className="grid gap-2">
                          <div>
                            <Label htmlFor="startDate">Date de début</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={exportSettings.startDate}
                              onChange={(e) => setExportSettings({ ...exportSettings, startDate: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="endDate">Date de fin</Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={exportSettings.endDate}
                              onChange={(e) => setExportSettings({ ...exportSettings, endDate: e.target.value })}
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <Label>Notifications</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="emailNotification"
                            checked={exportSettings.emailNotification}
                            onCheckedChange={(checked) =>
                              setExportSettings({ ...exportSettings, emailNotification: checked })
                            }
                          />
                          <Label htmlFor="emailNotification" className="text-sm">
                            Recevoir par email
                          </Label>
                        </div>
                      </div>

                      <Button onClick={handleExport} className="w-full bg-droovo-gradient hover:opacity-90">
                        <Download className="mr-2 h-4 w-4" />
                        Exporter les données
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-sm">Exports récents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Commandes Mai 2023</span>
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex justify-between">
                          <span>Clients Avril 2023</span>
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="whatsapp" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* WhatsApp Templates */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      Modèles WhatsApp Business
                    </CardTitle>
                    <CardDescription>Envoyez des promotions à vos clients via WhatsApp</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {whatsappTemplates.map((template) => (
                      <div key={template.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{template.name}</h4>
                          <Button
                            size="sm"
                            onClick={() => sendWhatsAppCampaign(template)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Envoyer
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{template.message}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* WhatsApp Settings */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Configuration WhatsApp</CardTitle>
                    <CardDescription>Paramètres pour vos campagnes WhatsApp Business</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="whatsappNumber">Numéro WhatsApp Business</Label>
                      <Input id="whatsappNumber" placeholder="+212 6XX XXX XXX" />
                    </div>

                    <div>
                      <Label htmlFor="customerSegment">Segment de clients</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un segment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les clients</SelectItem>
                          <SelectItem value="regular">Clients réguliers</SelectItem>
                          <SelectItem value="new">Nouveaux clients</SelectItem>
                          <SelectItem value="vip">Clients VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="sendTime">Heure d'envoi</Label>
                      <Input id="sendTime" type="time" defaultValue="10:00" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="autoSend" />
                      <Label htmlFor="autoSend" className="text-sm">
                        Envoi automatique des promotions
                      </Label>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800 mb-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-semibold">Statistiques WhatsApp</span>
                      </div>
                      <div className="space-y-1 text-sm text-green-700">
                        <div className="flex justify-between">
                          <span>Messages envoyés ce mois:</span>
                          <span className="font-semibold">1,234</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taux d'ouverture:</span>
                          <span className="font-semibold">87%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taux de réponse:</span>
                          <span className="font-semibold">23%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Campaign History */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Historique des campagnes WhatsApp</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Promotion Ramadan", sent: 892, opened: 776, responded: 156, date: "2023-05-25" },
                      { name: "Nouveau menu", sent: 654, opened: 543, responded: 87, date: "2023-05-20" },
                      { name: "Offre weekend", sent: 1123, opened: 934, responded: 234, date: "2023-05-15" },
                    ].map((campaign, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <p className="text-sm text-gray-600">
                            {campaign.sent} envoyés • {campaign.opened} ouverts • {campaign.responded} réponses
                          </p>
                          <p className="text-xs text-gray-500">{new Date(campaign.date).toLocaleDateString("fr-FR")}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-600">
                            {Math.round((campaign.opened / campaign.sent) * 100)}% ouverture
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round((campaign.responded / campaign.sent) * 100)}% réponse
                          </div>
                        </div>
                      </div>
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
