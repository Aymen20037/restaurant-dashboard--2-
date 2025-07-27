"use client"

import { useEffect, useState } from "react"
import {
  Plus,
  Search,
  TrendingUp,
  Users,
  Target,
  MessageSquare,
  Pause,
  Play,
  Edit,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Sidebar } from "../components/sidebar"
import { cn } from "@/lib/utils"
import axios from "axios"

interface Campaign {
  id: string
  name: string
  type: string
  status: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  startDate: string | Date;
  endDate: string | Date;
  targetAudience?: string
}

export default function CampagnesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "Quick Meal Platform", 
    budget: "",
    startDate: "",
    endDate: "",
    targetAudience: "",
    autoStart: false,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  // Pour l'édition
  const [editingId, setEditingId] = useState<string | null>(null)

  const userId = "utilisateur-connecte-id"

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get("/api/compagnes")
      setCampaigns(response.data)
    } catch (error) {
      console.error("Erreur lors du chargement des campagnes:", error)
    }
  }

  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        name: "",
        type: "", 
        budget: "",
        startDate: "",
        endDate: "",
        targetAudience: "",
        autoStart: false,
      })
      setEditingId(null)
    }
  }, [isModalOpen])

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

  const getTypeColor = (type: string) => "bg-purple-500"

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
  const avgCTR =
    campaigns.length > 0
      ? (campaigns.reduce((sum, c) => sum + (c.clicks / (c.impressions || 1)), 0) /
          campaigns.length) *
        100
      : 0

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type, checked } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  // Création ou modification campagne
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.type ||
      !formData.budget ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert("Veuillez remplir les champs obligatoires.")
      return
    }

    try {
      const campaignPayload = {
        name: formData.name,
        type: formData.type, 
        status: formData.autoStart ? "Active" : "En pause",
        budget: Number(formData.budget),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        targetAudience: formData.targetAudience || null,
        userId, 
      }

      if (editingId) {
        await axios.put(`/api/compagnes?id=${editingId}`, campaignPayload)
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === editingId
              ? { ...c, ...campaignPayload, targetAudience: campaignPayload.targetAudience ?? undefined }
              : c
          )
                  )
      } else {
        await axios.post("/api/compagnes", campaignPayload)
        fetchCampaigns()
      }

      setIsModalOpen(false)
      setEditingId(null)
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error)
      alert(
        error.response?.data?.errors
          ? error.response.data.errors.map((e: any) => e.message).join("\n")
          : "Erreur lors de la sauvegarde"
      )
    }
  }

const toggleStatus = async (id: string, currentStatus: string) => {
  try {
    const newStatus = currentStatus === "Active" ? "En pause" : "Active";

    const campaign = campaigns.find((c) => c.id === id);
    if (!campaign) throw new Error("Campagne non trouvée");

    const updatedPayload = {
      ...campaign,
      status: newStatus,
      startDate:
        typeof campaign.startDate === "string"
          ? campaign.startDate
          : campaign.startDate.toISOString(),
      endDate:
        typeof campaign.endDate === "string"
          ? campaign.endDate
          : campaign.endDate.toISOString(),
      targetAudience: campaign.targetAudience ?? null,
      userId, 
    };

    await axios.put(`/api/compagnes?id=${id}`, updatedPayload);

    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    alert("Erreur lors du changement de statut");
  }
};

  // Supprimer une campagne
  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette campagne ?")) return
    try {
      await axios.delete(`/api/compagnes?id=${id}`)
      setCampaigns((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Erreur lors de la suppression")
    }
  }

  const handleEdit = (campaign: Campaign) => {
    setFormData({
      name: campaign.name,
      budget: campaign.budget.toString(),
      type: campaign.type,
      startDate: typeof campaign.startDate === "string" ? campaign.startDate.slice(0, 10) : campaign.startDate.toISOString().slice(0, 10), // ISO date sans heure
      endDate: typeof campaign.endDate === "string" ? campaign.endDate.slice(0, 10) : campaign.endDate.toISOString().slice(0, 10),
      targetAudience: campaign.targetAudience || "",
      autoStart: campaign.status === "Active",
    })
    setEditingId(campaign.id)
    setIsModalOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1">
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">
              Campagnes Publicitaires
            </h1>
            <Badge className="bg-white/20 text-white">
              {filteredCampaigns.length} campagnes
            </Badge>
            <div className="ml-auto">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-white/20 hover:bg-white/30 text-white"
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {editingId ? "Modifier la campagne" : "Nouvelle campagne"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? "Modifier la campagne" : "Créer une nouvelle campagne"}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      Lancez une campagne publicitaire pour promouvoir votre restaurant
                    </p>
                  </DialogHeader>

                  <div className="space-y-4 mt-2">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Nom de la campagne *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Ex: Promotion Été"
                          required
                        />
                      </div>
                      <div>
                           <Label htmlFor="type">Plateforme</Label>
                          <select
                          id="type"
                        value={formData.type}
                      onChange={(e) =>
                         setFormData((prev) => ({ ...prev, type: e.target.value }))
                         }
                         className="w-full rounded border border-gray-300 px-3 py-2"
                     >
                     <option value="Quick Meal Platform">Quick Meal Platform</option>
                           <option value="Whatsapp Business">Whatsapp Business</option>
                        </select>
                        </div>

                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="budget">Budget (DH) *</Label>
                        <Input
                          id="budget"
                          type="number"
                          min={0}
                          value={formData.budget}
                          onChange={handleChange}
                          placeholder="1000"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="startDate">Date de début *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Date de fin *</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="targetAudience">Audience cible</Label>
                      <Input
                        id="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleChange}
                        placeholder="Ex: Familles, 25-45 ans, Casablanca"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autoStart"
                        checked={formData.autoStart}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, autoStart: checked }))
                        }
                      />
                      <Label htmlFor="autoStart">Démarrer automatiquement</Label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        className="bg-droovo-gradient hover:opacity-90"
                        onClick={handleSubmit}
                      >
                        {editingId ? "Enregistrer les modifications" : "Créer la campagne"}
                      </Button>
                      <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                      </DialogClose>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Budget total</CardTitle>
                <Target className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBudget.toLocaleString()} DH</div>
                <p className="text-xs">Dépensé: {totalSpent.toLocaleString()} DH</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Conversions</CardTitle>
                <TrendingUp className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalConversions}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Taux de clic</CardTitle>
                <Users className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgCTR.toFixed(1)}%</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Campagnes actives</CardTitle>
                <MessageSquare className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns.filter((c) => c.status === "Active").length}
                </div>
              </CardContent>
            </Card>
          </div>

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

          <div className="grid gap-6">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-gray-600">{campaign.targetAudience}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge
                          className={cn("text-white", getTypeColor(campaign.type))}
                        >
                          {campaign.type}
                        </Badge>
                        <Badge
                          className={cn("text-white", getStatusColor(campaign.status))}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Boutons action */}
                    <div className="flex gap-2">
                      {/* Bouton Activer/Désactiver */}
                      <button
                        className="p-2 rounded bg-gray-200 hover:bg-gray-300"
                        title={campaign.status === "Active" ? "Mettre en pause" : "Réactiver"}
                        onClick={() => toggleStatus(campaign.id, campaign.status)}
                      >
                        {campaign.status === "Active" ? (
                          <Pause className="w-5 h-5 text-red-600" />
                        ) : (
                          <Play className="w-5 h-5 text-green-600" />
                        )}
                      </button>

                      {/* Bouton Modifier */}
                      <button
                        className="p-2 rounded bg-blue-200 hover:bg-blue-300"
                        title="Modifier la campagne"
                        onClick={() => handleEdit(campaign)}
                      >
                        <Edit className="w-5 h-5 text-blue-700" />
                      </button>

                      {/* Bouton Supprimer */}
                      <button
                        className="p-2 rounded bg-red-200 hover:bg-red-300"
                        title="Supprimer la campagne"
                        onClick={() => handleDelete(campaign.id)}
                      >
                        <Trash2 className="w-5 h-5 text-red-700" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4 mt-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {campaign.impressions}
                      </div>
                      <div className="text-xs text-gray-600">Impressions</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {campaign.clicks}
                      </div>
                      <div className="text-xs text-gray-600">Clics</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {campaign.conversions}
                      </div>
                      <div className="text-xs text-gray-600">Conversions</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">
                        {campaign.spent} DH
                      </div>
                      <div className="text-xs text-gray-600">Dépensé</div>
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
