"use client"

import { useState, useEffect } from "react"
import { Bar, Line, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { TrendingUp, Users, ShoppingBag, Star, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChartContainer } from "@/components/ui/chart"
import { Sidebar } from "../components/sidebar"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface StatsDashboard {
  revenus: {
    total: number
    evolution: string 
  }
  commandes: {
    total: number
    evolution: string
  }
  clients: {
    actifs: number
    evolution: string
  }
  noteMoyenne: {
    valeur: string 
    evolution: string
  }
  ventesParMois: number[] 
  topPlats: {
    labels: string[]
    data: number[]
  }
  segmentationClients: {
    nouveaux: number
    regulier: number
    vip: number
  }
  commandesParHeure: number[] 
  performance: {
    tempsPreparationMoyen: number
    tauxLivraison: string 
    panierMoyen: number
  }
}

export default function StatistiquesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [periodFilter, setPeriodFilter] = useState("month")

  const [stats, setStats] = useState<StatsDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch("/api/stats/dashboard")
        if (!res.ok) throw new Error("Erreur lors du chargement des statistiques")
        const data: StatsDashboard = await res.json()
        setStats(data)
      } catch (err: any) {
        setError(err.message || "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div className="p-6 text-center">Chargement...</div>
  if (error) return <div className="p-6 text-center text-red-600">Erreur : {error}</div>
  if (!stats) return null


  const salesTrendData = {
    labels: [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ],
    datasets: [
      {
        label: `Ventes ${new Date().getFullYear()}`,
        data: stats.ventesParMois ?? new Array(12).fill(0),
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const topDishesData = {
    labels: stats.topPlats.labels ?? [],
    datasets: [
      {
        label: "Commandes",
        data: stats.topPlats.data ?? [],
        backgroundColor: [
          "#8B5CF6",
          "#F59E0B",
          "#10B981",
          "#EF4444",
          "#3B82F6",
          "#F97316",
        ],
        borderWidth: 0,
      },
    ],
  }

  const customerSegmentData = {
    labels: ["Nouveaux clients", "Clients réguliers", "Clients VIP"],
    datasets: [
      {
        data: [
          stats.segmentationClients.nouveaux,
          stats.segmentationClients.regulier,
          stats.segmentationClients.vip,
        ],
        backgroundColor: ["#8B5CF6", "#F59E0B", "#10B981"],
        borderWidth: 0,
      },
    ],
  }

  const hourlyLabels = [
    "8h",
    "9h",
    "10h",
    "11h",
    "12h",
    "13h",
    "14h",
    "15h",
    "16h",
    "17h",
    "18h",
    "19h",
    "20h",
    "21h",
    "22h",
  ]
  const hourlyOrdersData = {
    labels: hourlyLabels,
    datasets: [
      {
        label: "Commandes par heure",
        data: stats.commandesParHeure ?? new Array(15).fill(0),
        backgroundColor: "rgba(139, 92, 246, 0.8)",
        borderColor: "#8B5CF6",
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Statistiques Avancées</h1>
            <div className="ml-auto flex items-center gap-3">
              <Select
                value={periodFilter}
                onValueChange={setPeriodFilter}
              >
                <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="bg-white/20 hover:bg-white/30 text-white"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* KPI Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">
                  Revenus totaux
                </CardTitle>
                <TrendingUp className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.revenus.total.toLocaleString()} DH
                </div>
                <p className="text-xs opacity-80">
                  {Number(stats.revenus.evolution) > 0 ? "+" : ""}
                  {stats.revenus.evolution}% vs mois dernier
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">
                  Commandes totales
                </CardTitle>
                <ShoppingBag className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.commandes.total.toLocaleString()}
                </div>
                <p className="text-xs opacity-80">
                  {Number(stats.commandes.evolution) > 0 ? "+" : ""}
                  {stats.commandes.evolution}% vs mois dernier
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">
                  Clients actifs
                </CardTitle>
                <Users className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.clients.actifs.toLocaleString()}
                </div>
                <p className="text-xs opacity-80">
                  {Number(stats.clients.evolution) > 0 ? "+" : ""}
                  {stats.clients.evolution}% vs mois dernier
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">
                  Note moyenne
                </CardTitle>
                <Star className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.noteMoyenne.valeur}/5
                </div>
                <p className="text-xs opacity-80">
                  {Number(stats.noteMoyenne.evolution) > 0 ? "+" : ""}
                  {stats.noteMoyenne.evolution} vs mois dernier
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Sales Trend */}
            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle>Évolution des ventes</CardTitle>
                <CardDescription>
                  Comparaison des ventes sur 12 mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    "Ventes 2023": {
                      label: "Ventes 2023",
                      color: "#8B5CF6",
                    },
                  }}
                  className="aspect-[2/1]"
                >
                  <Line
                    data={salesTrendData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (value) =>
                              value.toLocaleString() + " DH",
                          },
                        },
                      },
                    }}
                  />
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Top Dishes */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Plats les plus commandés</CardTitle>
                <CardDescription>Top 6 des plats populaires</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    Commandes: {
                      label: "Commandes",
                      color: "#8B5CF6",
                    },
                  }}
                  className="aspect-square"
                >
                  <Bar
                    data={topDishesData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        x: {
                          ticks: {
                            maxRotation: 45,
                          },
                        },
                      },
                    }}
                  />
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Customer Segments */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Segmentation clients</CardTitle>
                <CardDescription>
                  Répartition par type de client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    "Nouveaux clients": {
                      label: "Nouveaux clients",
                      color: "#8B5CF6",
                    },
                    "Clients réguliers": {
                      label: "Clients réguliers",
                      color: "#F59E0B",
                    },
                    "Clients VIP": {
                      label: "Clients VIP",
                      color: "#10B981",
                    },
                  }}
                  className="aspect-square"
                >
                  <Doughnut
                    data={customerSegmentData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Hourly Orders */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Commandes par heure</CardTitle>
              <CardDescription>
                Distribution des commandes selon l'heure de la journée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  "Commandes par heure": {
                    label: "Commandes par heure",
                    color: "#8B5CF6",
                  },
                }}
                className="aspect-[3/1]"
              >
                <Bar
                  data={hourlyOrdersData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Temps de préparation moyen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round(stats.performance.tempsPreparationMoyen)} min
                </div>
                <p className="text-sm text-gray-600">-3 min vs mois dernier</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Taux de livraison à temps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(Number(stats.performance.tauxLivraison))}%
                </div>
                <p className="text-sm text-gray-600">+2% vs mois dernier</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${stats.performance.tauxLivraison}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Panier moyen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {Math.round(stats.performance.panierMoyen)} DH
                </div>
                <p className="text-sm text-gray-600">+8 DH vs mois dernier</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: "68%" }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
