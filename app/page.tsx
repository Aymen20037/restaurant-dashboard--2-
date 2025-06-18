"use client"

import { useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import {
  Search,
  ChevronDown,
  Bell,
  MenuIcon,
  Star,
  ShoppingBag,
  Users,
  Utensils,
  TrendingUp,
  MapPin,
  Award,
} from "lucide-react"
import Link from "next/link"
import { User, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChartContainer } from "@/components/ui/chart"
import { Sidebar } from "./components/sidebar"
import { cn } from "@/lib/utils"

// Importons le composant ThemeToggle
import { ThemeToggle } from "./components/theme-toggle"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilter, setSearchFilter] = useState("all")

  // Données pour les graphiques avec couleurs Droovo
  const revenueData = {
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [
      {
        label: "Cette semaine",
        data: [18500, 22400, 19800, 27500, 32100, 35800, 28900],
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Semaine précédente",
        data: [15200, 19800, 17500, 21900, 28400, 31200, 25800],
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const ordersData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    datasets: [
      {
        label: "Commandes",
        data: [65, 78, 90, 105, 112, 120, 135, 142, 150, 162, 170, 180],
        backgroundColor: "rgba(139, 92, 246, 0.8)",
        borderColor: "#8B5CF6",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  // Données pour les tableaux
  const recentOrders = [
    {
      id: "ORD-7352",
      client: "Mohammed Alami",
      plat: "Tajine Poulet",
      prix: "120 DH",
      date: "2023-05-28",
      status: "livré",
    },
    {
      id: "ORD-7353",
      client: "Fatima Benali",
      plat: "Couscous Royal",
      prix: "150 DH",
      date: "2023-05-28",
      status: "confirmé",
    },
    {
      id: "ORD-7354",
      client: "Karim Idrissi",
      plat: "Pastilla au Poulet",
      prix: "130 DH",
      date: "2023-05-28",
      status: "en attente",
    },
    {
      id: "ORD-7355",
      client: "Leila Mansouri",
      plat: "Rfissa",
      prix: "140 DH",
      date: "2023-05-27",
      status: "livré",
    },
    {
      id: "ORD-7356",
      client: "Youssef Tazi",
      plat: "Tajine Kefta",
      prix: "110 DH",
      date: "2023-05-27",
      status: "confirmé",
    },
  ]

  const customerReviews = [
    {
      id: "REV-2451",
      client: "Mohammed Alami",
      restaurant: "Le Marrakchi",
      note: 5,
      commentaire: "Excellent service et nourriture délicieuse!",
      date: "2023-05-28",
    },
    {
      id: "REV-2452",
      client: "Fatima Benali",
      restaurant: "Le Marrakchi",
      note: 4,
      commentaire: "Très bon, mais service un peu lent",
      date: "2023-05-27",
    },
    {
      id: "REV-2453",
      client: "Karim Idrissi",
      restaurant: "Le Marrakchi",
      note: 5,
      commentaire: "Meilleur tajine de la ville!",
      date: "2023-05-26",
    },
    {
      id: "REV-2454",
      client: "Leila Mansouri",
      restaurant: "Le Marrakchi",
      note: 3,
      commentaire: "Nourriture bonne mais prix élevés",
      date: "2023-05-25",
    },
    {
      id: "REV-2455",
      client: "Youssef Tazi",
      restaurant: "Le Marrakchi",
      note: 5,
      commentaire: "Ambiance exceptionnelle et plats savoureux",
      date: "2023-05-24",
    },
  ]

  // Fonction pour afficher les étoiles selon la note
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={cn("h-4 w-4", i < rating ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-300")}
        />
      ))
  }

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusColor = (status) => {
    switch (status) {
      case "livré":
        return "bg-green-500 hover:bg-green-600"
      case "confirmé":
        return "bg-blue-500 hover:bg-blue-600"
      case "en attente":
        return "bg-yellow-500 hover:bg-yellow-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header avec gradient Droovo */}
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/20"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>

            {/* Logo et titre */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
                <span className="text-sm font-bold text-white">D</span>
              </div>
              <h1 className="text-xl font-bold text-white">Droovo Dashboard</h1>
            </div>

            {/* Barre de recherche avancée */}
            <div className="relative hidden md:flex flex-1 items-center max-w-md ml-8">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher par restaurant, plat ou localisation..."
                className="w-full pl-10 bg-white/90 backdrop-blur border-0 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="ml-2 bg-white/20 hover:bg-white/30 text-white border-white/30" variant="outline">
                Rechercher
              </Button>
            </div>

            {/* Ajoutons le bouton de basculement de thème dans le header, juste avant le bouton de notifications */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Localisation */}
              <div className="hidden md:flex items-center gap-1 text-white/90">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Casablanca, Maroc</span>
              </div>

              {/* Bouton de basculement de thème */}
              <ThemeToggle />

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  3
                </span>
                <span className="sr-only">Notifications</span>
              </Button>

              {/* Profil utilisateur */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1 text-white hover:bg-white/20">
                    <Avatar className="h-8 w-8 ring-2 ring-white/30">
                      <AvatarImage src="/placeholder.svg" alt="Le Marrakchi" />
                      <AvatarFallback className="bg-white text-purple-600 font-bold">LM</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">Le Marrakchi</p>
                      <p className="text-xs text-white/70">Restaurant</p>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/restaurant" className="flex items-center">
                      <Utensils className="mr-2 h-4 w-4" />
                      Mon restaurant
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/plats" className="flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Mes plats
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/commandes" className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Commandes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/compte" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Mon compte
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="flex items-center text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 space-y-6 p-4 md:p-6">
          {/* KPI Cards avec style Droovo */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Commandes ce mois</CardTitle>
                <ShoppingBag className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">245</div>
                <p className="text-xs opacity-80">+12% par rapport au mois dernier</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Nouveaux clients</CardTitle>
                <Users className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">+78</div>
                <p className="text-xs opacity-80">+18% par rapport au mois dernier</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Plats commandés</CardTitle>
                <Utensils className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">352</div>
                <p className="text-xs opacity-80">+5% par rapport au mois dernier</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Taux de satisfaction</CardTitle>
                <Award className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">92%</div>
                <p className="text-xs opacity-80">+2% par rapport au mois dernier</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts avec style Droovo */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Montant total des commandes</CardTitle>
                <CardDescription>Montant des commandes en dirhams (DH) par jour</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    "Cette semaine": {
                      label: "Cette semaine",
                      color: "#8B5CF6",
                    },
                    "Semaine précédente": {
                      label: "Semaine précédente",
                      color: "#F59E0B",
                    },
                  }}
                  className="aspect-[4/3]"
                >
                  <Line
                    data={revenueData}
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
                            callback: (value) => value.toLocaleString() + " DH",
                          },
                        },
                      },
                    }}
                  />
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Commandes par mois</CardTitle>
                <CardDescription>Nombre total de commandes par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    Commandes: {
                      label: "Commandes",
                      color: "#8B5CF6",
                    },
                  }}
                  className="aspect-[4/3]"
                >
                  <Bar
                    data={ordersData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                    }}
                  />
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders Table avec style Droovo */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-800">Dernières commandes</CardTitle>
              <CardDescription>Liste des commandes récentes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold">Plat</TableHead>
                    <TableHead className="font-semibold">Prix</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-purple-50">
                      <TableCell className="font-medium text-purple-600">{order.id}</TableCell>
                      <TableCell>{order.client}</TableCell>
                      <TableCell>{order.plat}</TableCell>
                      <TableCell className="font-semibold">{order.prix}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-white", getStatusColor(order.status))}>{order.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Customer Reviews Table avec style Droovo */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-800">Évaluations clients</CardTitle>
              <CardDescription>Avis et commentaires des clients</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold">Restaurant</TableHead>
                    <TableHead className="font-semibold">Note</TableHead>
                    <TableHead className="hidden md:table-cell font-semibold">Commentaire</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerReviews.map((review) => (
                    <TableRow key={review.id} className="hover:bg-orange-50">
                      <TableCell className="font-medium">{review.client}</TableCell>
                      <TableCell>{review.restaurant}</TableCell>
                      <TableCell>
                        <div className="flex">{renderStars(review.note)}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">{review.commentaire}</TableCell>
                      <TableCell>{new Date(review.date).toLocaleDateString("fr-FR")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
