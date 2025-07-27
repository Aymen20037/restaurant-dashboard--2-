"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Bar, Line } from "react-chartjs-2";
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
  Filler,
} from "chart.js";

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
  User,
  LogOut,
} from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { Sidebar } from "./components/sidebar";
import { ThemeToggle } from "./components/theme-toggle";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type Review = {
  id: string;
  client: string;
  restaurant: string;
  note: number;
  commentaire: string;
  date: string;
};

type Order = {
  id: string;
  client: string;
  plat: string;
  prix: string;
  date: string;
  status: string;
};

type KpiResponse = {
  commandesCeMois: number;
  nouveauxClients: number;
  platsCommandes: number;
  tauxSatisfaction: number;
};

type StatsRevenueDay = {
  day: string; 
  amount: number;
};

type StatsOrdersDay = {
  day: string;
  count: number;
};

export default function Dashboard() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<{ message: string; date: string }[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [userRestaurant, setUserRestaurant] = useState<{ name: string; type: string ;  }>({
    name: "Chargement...",
    type: "Restaurant",

  });

  const [customerReviews, setCustomerReviews] = useState<Review[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const [kpi, setKpi] = useState<KpiResponse | null>(null);
  const [revenueData, setRevenueData] = useState<{ labels: string[]; datasets: any[] }>({
    labels: [],
    datasets: [],
  });
  const [ordersData, setOrdersData] = useState<{ labels: string[]; datasets: any[] }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        const restaurantName = data.user?.restaurantName ?? "Mon Restaurant";
        const city = data.user?.city ?? "Ville inconnue";


        setUserRestaurant({
          name: restaurantName,
          type: "Restaurant",
        });
      } catch {
        router.push("/login");
      }
    }
    fetchUser();
  }, [router]);

  useEffect(() => {
    async function fetchKpi() {
      try {
        const res = await fetch("/api/kpi", { credentials: "include" });
        if (!res.ok) throw new Error("Erreur récupération KPI");
        const data: KpiResponse = await res.json();
        setKpi(data);
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchRevenue() {
      try {
        const res = await fetch("/api/stats/revenue", { credentials: "include" });
        if (!res.ok) throw new Error("Erreur récupération revenus");
        const data: StatsRevenueDay[] = await res.json();
        setRevenueData({
          labels: data.map((d) => d.day),
          datasets: [
            {
              label: "Cette semaine",
              data: data.map((d) => d.amount),
              borderColor: "#8B5CF6",
              backgroundColor: "rgba(139, 92, 246, 0.1)",
              fill: true,
              tension: 0.4,
            },
          ],
        });
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchOrdersStats() {
      try {
        const res = await fetch("/api/stats/orders", { credentials: "include" });
        if (!res.ok) throw new Error("Erreur récupération stats commandes");
        const data: StatsOrdersDay[] = await res.json();
        setOrdersData({
          labels: data.map((d) => d.day),
          datasets: [
            {
              label: "Commandes",
              data: data.map((d) => d.count),
              backgroundColor: "rgba(139, 92, 246, 0.8)",
              borderColor: "#8B5CF6",
              borderWidth: 2,
              borderRadius: 8,
            },
          ],
        });
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchRecentOrders() {
      try {
        const res = await fetch("/api/orders/recent", { credentials: "include" });
        if (!res.ok) throw new Error("Erreur récupération commandes récentes");
        const data: Order[] = await res.json();
        setRecentOrders(data);
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews/recent", { credentials: "include" });
        if (!res.ok) throw new Error("Erreur récupération avis");
        const data: Review[] = await res.json();
        setCustomerReviews(data);
      } catch (err) {
        console.error(err);
      }
    }
    async function fetchNotifications() {
      try {
        const [ordersRes, reviewsRes] = await Promise.all([
          fetch("/api/orders/recent", { credentials: "include" }),
          fetch("/api/reviews/recent", { credentials: "include" }),
        ]);
    
        const orders: Order[] = await ordersRes.json();
        const reviews: Review[] = await reviewsRes.json();
    
        const latestOrder = orders[0];
        const latestReview = reviews[0];
    
        const messages: { message: string; date: string }[] = [];
    
        if (latestOrder) {
          messages.push({
            message: `Nouvelle commande de ${latestOrder.client} pour ${latestOrder.plat}`,
            date: latestOrder.date,
          });
        }
    
        if (latestReview) {
          messages.push({
            message: `Nouvel avis de ${latestReview.client}: ${latestReview.commentaire}`,
            date: latestReview.date,
          });
        }
    
        setNotifications(messages);
      } catch (err) {
        console.error("Erreur récupération notifications", err);
      }
    }
    
    
    fetchNotifications();
    

    fetchKpi();
    fetchRevenue();
    fetchOrdersStats();
    fetchRecentOrders();
    fetchReviews();
  }, []);

  function renderStars(rating: number) {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-300"
        )}
      />
    ));
  }

  function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case "livré":
        return "bg-green-500 hover:bg-green-600";
      case "confirmé":
        return "bg-blue-500 hover:bg-blue-600";
      case "en attente":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
<Sidebar isOpen={isSidebarOpen} orderCount={recentOrders.length} />

      <div className="flex-1">
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/20"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Fermer menu" : "Ouvrir menu"}
            >
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
                <span className="text-sm font-bold text-white">D</span>
              </div>
              <h1 className="text-xl font-bold text-white">Droovo Dashboard</h1>
            </div>

            <div className="relative hidden md:flex flex-1 items-center max-w-md ml-8">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher par restaurant, plat ou localisation..."
                className="w-full pl-10 bg-white/90 backdrop-blur border-0 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                className="ml-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
                variant="outline"
              >
                Rechercher
              </Button>
            </div>

            <div className="flex items-center gap-3 ml-auto">
           


              <ThemeToggle />

              <Button
  variant="ghost"
  size="icon"
  className="relative text-white hover:bg-white/20"
  aria-label="Notifications"
>
  <Bell className="h-5 w-5" />
  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
    {notifications.length}
  </span>
</Button>


              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 pl-2 pr-1 text-white hover:bg-white/20"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-white/30">
                      <AvatarImage src="/placeholder.svg" alt={userRestaurant.name} />
                      <AvatarFallback className="bg-white text-purple-600 font-bold">
                        {userRestaurant.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{userRestaurant.name}</p>
                      <p className="text-xs text-white/70">{userRestaurant.type}</p>
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
                  <DropdownMenuItem>
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-red-600 w-full text-left"
                      type="button"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Commandes ce mois</CardTitle>
                <ShoppingBag className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpi?.commandesCeMois ?? "..."}</div>
                <p className="text-xs opacity-80">+12% par rapport au mois dernier</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Nouveaux clients</CardTitle>
                <Users className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpi?.nouveauxClients ?? "..."}</div>
                <p className="text-xs opacity-80">+18% par rapport au mois dernier</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Plats commandés</CardTitle>
                <Utensils className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpi?.platsCommandes ?? "..."}</div>
                <p className="text-xs opacity-80">+5% par rapport au mois dernier</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Taux de satisfaction</CardTitle>
                <Award className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpi ? `${kpi.tauxSatisfaction}%` : "..."}</div>
                <p className="text-xs opacity-80">+2% par rapport au mois dernier</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Montant total des commandes</CardTitle>
                <CardDescription>Montant des commandes en dirhams (DH) par jour</CardDescription>
              </CardHeader>
              <CardContent>
                <Line
                  data={revenueData}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "top" } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => value.toLocaleString() + " DH",
                        },
                      },
                    },
                  }}
                  className="aspect-[4/3]"
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Commandes par jour</CardTitle>
                <CardDescription>Nombre de commandes par jour sur la semaine</CardDescription>
              </CardHeader>
              <CardContent>
                <Bar
                  data={ordersData}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                      },
                    },
                  }}
                  className="aspect-[4/3]"
                />
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Dernières commandes</CardTitle>
              <CardDescription>Liste des commandes récentes avec leur statut</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commande</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Plat</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.client}</TableCell>
                      <TableCell>{order.plat}</TableCell>
                      <TableCell>{order.prix}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Badge className={cn("capitalize", getStatusColor(order.status))}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Avis clients récents</CardTitle>
              <CardDescription>Avis et notes de nos clients sur le restaurant</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Avis</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Commentaire</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{review.id}</TableCell>
                      <TableCell>{review.client}</TableCell>
                      <TableCell>{review.restaurant}</TableCell>
                      <TableCell>{renderStars(review.note)}</TableCell>
                      <TableCell>{review.commentaire}</TableCell>
                      <TableCell>{review.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
