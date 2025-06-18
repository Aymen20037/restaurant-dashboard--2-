"use client"

import { useState } from "react"
import { Search, CreditCard, DollarSign, TrendingUp, Download, Eye, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

export default function PaiementsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("month")

  const payments = [
    {
      id: "PAY-7352",
      orderId: "ORD-7352",
      client: "Mohammed Alami",
      amount: 155,
      method: "Carte bancaire",
      status: "Payé",
      date: "2023-05-28",
      time: "14:30",
      commission: 7.75,
      net: 147.25,
    },
    {
      id: "PAY-7353",
      orderId: "ORD-7353",
      client: "Fatima Benali",
      amount: 320,
      method: "Espèces",
      status: "Payé",
      date: "2023-05-28",
      time: "14:45",
      commission: 0,
      net: 320,
    },
    {
      id: "PAY-7354",
      orderId: "ORD-7354",
      client: "Karim Idrissi",
      amount: 130,
      method: "PayPal",
      status: "En attente",
      date: "2023-05-28",
      time: "15:00",
      commission: 6.5,
      net: 123.5,
    },
    {
      id: "PAY-7355",
      orderId: "ORD-7355",
      client: "Leila Mansouri",
      amount: 170,
      method: "Carte bancaire",
      status: "Payé",
      date: "2023-05-27",
      time: "13:15",
      commission: 8.5,
      net: 161.5,
    },
    {
      id: "PAY-7356",
      orderId: "ORD-7356",
      client: "Youssef Tazi",
      amount: 110,
      method: "Virement",
      status: "Remboursé",
      date: "2023-05-27",
      time: "12:30",
      commission: 0,
      net: 0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Payé":
        return "bg-green-500 hover:bg-green-600"
      case "En attente":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Remboursé":
        return "bg-red-500 hover:bg-red-600"
      case "Échoué":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "Carte bancaire":
      case "PayPal":
        return <CreditCard className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculs des statistiques
  const totalRevenue = payments.filter((p) => p.status === "Payé").reduce((sum, p) => sum + p.amount, 0)
  const totalCommissions = payments.filter((p) => p.status === "Payé").reduce((sum, p) => sum + p.commission, 0)
  const netRevenue = payments.filter((p) => p.status === "Payé").reduce((sum, p) => sum + p.net, 0)
  const pendingAmount = payments.filter((p) => p.status === "En attente").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Gestion des Paiements</h1>
            <Badge className="bg-white/20 text-white">{filteredPayments.length} transactions</Badge>
            <div className="ml-auto">
              <Button className="bg-white/20 hover:bg-white/30 text-white" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Revenus totaux</CardTitle>
                <DollarSign className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} DH</div>
                <p className="text-xs opacity-80">Ce mois</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Revenus nets</CardTitle>
                <TrendingUp className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{netRevenue.toLocaleString()} DH</div>
                <p className="text-xs opacity-80">Après commissions</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">Commissions</CardTitle>
                <CreditCard className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCommissions.toLocaleString()} DH</div>
                <p className="text-xs opacity-80">Frais de transaction</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium opacity-90">En attente</CardTitle>
                <Filter className="h-5 w-5 opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingAmount.toLocaleString()} DH</div>
                <p className="text-xs opacity-80">À recevoir</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher par client, commande ou transaction..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="Payé">Payé</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Remboursé">Remboursé</SelectItem>
                    <SelectItem value="Échoué">Échoué</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Historique des paiements</CardTitle>
              <CardDescription>Liste de toutes les transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Transaction</TableHead>
                    <TableHead className="font-semibold">Commande</TableHead>
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold">Montant</TableHead>
                    <TableHead className="font-semibold">Méthode</TableHead>
                    <TableHead className="font-semibold">Commission</TableHead>
                    <TableHead className="font-semibold">Net</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-purple-50">
                      <TableCell className="font-medium text-purple-600">{payment.id}</TableCell>
                      <TableCell className="font-medium">{payment.orderId}</TableCell>
                      <TableCell>{payment.client}</TableCell>
                      <TableCell className="font-semibold">{payment.amount} DH</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMethodIcon(payment.method)}
                          <span className="text-sm">{payment.method}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-red-600">
                        {payment.commission > 0 ? `-${payment.commission} DH` : "-"}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">{payment.net} DH</TableCell>
                      <TableCell>
                        <Badge className={cn("text-white", getStatusColor(payment.status))}>{payment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{new Date(payment.date).toLocaleDateString("fr-FR")}</p>
                          <p className="text-xs text-gray-500">{payment.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Détails de la transaction {payment.id}</DialogTitle>
                              <DialogDescription>
                                Transaction effectuée le {new Date(payment.date).toLocaleDateString("fr-FR")} à{" "}
                                {payment.time}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <h4 className="font-semibold mb-2">Informations de paiement</h4>
                                  <div className="space-y-1 text-sm">
                                    <p>
                                      <strong>ID Transaction:</strong> {payment.id}
                                    </p>
                                    <p>
                                      <strong>Commande:</strong> {payment.orderId}
                                    </p>
                                    <p>
                                      <strong>Client:</strong> {payment.client}
                                    </p>
                                    <p>
                                      <strong>Méthode:</strong> {payment.method}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Montants</h4>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span>Montant brut:</span>
                                      <span className="font-semibold">{payment.amount} DH</span>
                                    </div>
                                    <div className="flex justify-between text-red-600">
                                      <span>Commission:</span>
                                      <span>-{payment.commission} DH</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-green-600 border-t pt-1">
                                      <span>Montant net:</span>
                                      <span>{payment.net} DH</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold">Statut de la transaction:</span>
                                  <Badge className={cn("text-white", getStatusColor(payment.status))}>
                                    {payment.status}
                                  </Badge>
                                </div>
                              </div>

                              {payment.status === "En attente" && (
                                <div className="flex gap-2 pt-4">
                                  <Button className="bg-green-500 hover:bg-green-600">Marquer comme payé</Button>
                                  <Button variant="destructive">Annuler la transaction</Button>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
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
