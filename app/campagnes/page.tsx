"use client"

import { useState } from "react"
import { Plus, Search, Play, Pause, Eye, TrendingUp, Users, Target, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function CampagnesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const campaigns = [
    {
      id: 1,
      name: "Promotion Ramadan",
      type: "Quick Meal Platform",
      status: "Active",
      budget: 2000,
      spent: 1250,
      impressions: 45000,
      clicks: 1200,
      conversions: 89,
      startDate: "2023-05-01",
      endDate: "2023-05-31",
      targetAudience: "Familles, 25-45 ans, Casablanca",
    },
    {
      id: 2,
      name: "Menu Découverte",
      type: "WhatsApp Business",
      status: "Active",
      budget: 500,
      spent: 320,
      impressions: 12000,
      clicks: 450,
      conversions: 34,
      startDate: "2023-05-15",
      endDate: "2023-06-15",
      targetAudience: "Nouveaux clients, 20-35 ans",
    },
    {
      id: 3,
      name: "Livraison Gratuite",
      type: "Quick Meal Platform",
      status: "Terminée",
      budget: 1500,
      spent: 1500,
      impressions: 38000,
      clicks: 950,
      conversions: 67,
      startDate: "2023-04-01",
      endDate: "2023-04-30",
      targetAudience: "Tous les utilisateurs",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "En pause":
        return "bg-yellow-500"
      case "Terminée":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Quick Meal Platform":
        return "bg-purple-500"
      case "WhatsApp Business":
        return "bg-green-500"
      case "Facebook Ads":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
  const avgCTR = (campaigns.reduce((sum, c) => sum + c.clicks / c.impressions, 0) / campaigns.length) * 100

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Campagnes Publicitaires</h1>
            <Badge className="bg-white/20 text-white">{filteredCampaigns.length} campagnes</Badge>
            <div className="ml-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-white/20 hover:bg-white/30 text-white" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle campagne
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle campagne</DialogTitle>
                    <DialogDescription>
                      Lancez une campagne publicitaire pour promouvoir votre restaurant
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="campaignName">Nom de la campagne</Label>
                        <Input id="campaignName" placeholder="Ex: Promotion Été" />
                      </div>
                      <div>
                        <Label htmlFor="campaignType">Plateforme</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une plateforme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quickmeal">Quick Meal Platform</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                            <SelectItem value="facebook">Facebook Ads</SelectItem>
                            <SelectItem value="instagram">Instagram Ads</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description de la campagne</Label>
                      <Textarea id="description" placeholder="Décrivez votre campagne..." rows={3} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="budget">Budget (DH)</Label>
                        <Input id="budget" type="number" placeholder="1000" />
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

                    <div>
                      <Label htmlFor="audience">Audience cible</Label>
                      <Input id="audience" placeholder="Ex: Familles, 25-45 ans, Casablanca" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="autoStart" />
                      <Label htmlFor="autoStart">Démarrer automatiquement</Label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button className="bg-droovo-gradient hover:opacity-90">Créer la campagne</Button>
                      <Button variant="outline">Annuler</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Budget total</CardTitle>
                <Target className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBudget.toLocaleString()} DH</div>
                <p className="text-xs opacity-80">Dépensé: {totalSpent.toLocaleString()} DH</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Conversions</CardTitle>
                <TrendingUp className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalConversions}</div>
                <p className="text-xs opacity-80">Commandes générées</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Taux de clic</CardTitle>
                <Users className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgCTR.toFixed(1)}%</div>
                <p className="text-xs opacity-80">CTR moyen</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Campagnes actives</CardTitle>
                <MessageSquare className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaigns.filter((c) => c.status === "Active").length}</div>
                <p className="text-xs opacity-80">En cours</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher une campagne..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Campaigns List */}
          <div className="grid gap-6">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Campaign Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">{campaign.targetAudience}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={cn("text-white", getTypeColor(campaign.type))}>{campaign.type}</Badge>
                          <Badge className={cn("text-white", getStatusColor(campaign.status))}>{campaign.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {campaign.status === "Active" ? (
                          <Button size="sm" variant="outline">
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Détails de la campagne: {campaign.name}</DialogTitle>
                              <DialogDescription>
                                Campagne du {new Date(campaign.startDate).toLocaleDateString("fr-FR")} au{" "}
                                {new Date(campaign.endDate).toLocaleDateString("fr-FR")}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <h4 className="font-semibold mb-3">Performance</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm">Impressions:</span>
                                      <span className="font-semibold">{campaign.impressions.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">Clics:</span>
                                      <span className="font-semibold">{campaign.clicks.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">Conversions:</span>
                                      <span className="font-semibold">{campaign.conversions}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">CTR:</span>
                                      <span className="font-semibold">
                                        {((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-3">Budget</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm">Budget total:</span>
                                      <span className="font-semibold">{campaign.budget} DH</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">Dépensé:</span>
                                      <span className="font-semibold">{campaign.spent} DH</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">Restant:</span>
                                      <span className="font-semibold">{campaign.budget - campaign.spent} DH</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                      <div
                                        className="bg-purple-600 h-2 rounded-full"
                                        style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-3">Audience cible</h4>
                                <p className="text-sm text-gray-600">{campaign.targetAudience}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {/* Campaign Stats */}
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{campaign.impressions.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Impressions</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{campaign.clicks.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Clics</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{campaign.conversions}</div>
                        <div className="text-xs text-gray-600">Conversions</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">{campaign.spent} DH</div>
                        <div className="text-xs text-gray-600">Dépensé</div>
                      </div>
                    </div>

                    {/* Budget Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Budget utilisé</span>
                        <span>
                          {campaign.spent} / {campaign.budget} DH
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                        ></div>
                      </div>
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
