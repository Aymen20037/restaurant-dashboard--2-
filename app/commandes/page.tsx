"use client"

import { useEffect, useState } from "react"
import { Search, Eye, Check, X, Clock, MapPin, Phone } from "lucide-react"
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
import { OrderStatus } from "@prisma/client"


export type Order = {
  id: string
  orderNumber: string
  client: string
  phone: string | null
  address: string | null
  totalAmount: number
  createdAt: string
  deliveryTime: string | null
  status: OrderStatus
  items: { name: string; price: number; quantity: number }[]
}

export default function CommandesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orders, setOrders] = useState<Order[] | null>(null)

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders)
      .catch(console.error)
  }, [])

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const updated = await res.json()
      setOrders((prev) =>
        prev ? prev.map((order) => (order.id === id ? { ...order, status: updated.status } : order)) : null
      )
    } catch (err) {
      console.error("Erreur de mise à jour:", err)
    }
  }

  function getStatusLabel(status: OrderStatus) {
    switch (status) {
      case OrderStatus.PENDING:
        return "en attente"
      case OrderStatus.CONFIRMED:
        return "confirmé"
      case OrderStatus.PREPARING:
        return "en préparation"
      case OrderStatus.DELIVERED:
        return "livré"
      case OrderStatus.CANCELLED:
        return "annulé"
      default:
        return status
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "en attente":
        return <Clock className="h-4 w-4" />
      case "confirmé":
        return <Check className="h-4 w-4" />
      case "en préparation":
        return <Clock className="h-4 w-4" />
      case "livré":
        return <Check className="h-4 w-4" />
      case "annulé":
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  }) ?? []
  

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Gestion des Commandes</h1>
            <Badge className="bg-white/20 text-white">{filteredOrders.length} commandes</Badge>
          </div>
        </header>
        <main className="p-6 space-y-6">
          {/* Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher par client ou numéro de commande..."
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
  <SelectItem value={OrderStatus.PENDING}>En attente</SelectItem>
  <SelectItem value={OrderStatus.CONFIRMED}>Confirmé</SelectItem>
  <SelectItem value={OrderStatus.PREPARING}>En préparation</SelectItem>
  <SelectItem value={OrderStatus.DELIVERED}>Livré</SelectItem>
  <SelectItem value={OrderStatus.CANCELLED}>Annulé</SelectItem>
</SelectContent>

                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Liste des commandes</CardTitle>
              <CardDescription>Gérez toutes vos commandes en temps réel</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Commande</TableHead>
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold">Total</TableHead>
                    <TableHead className="font-semibold">Heure</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {orders && filteredOrders.map((order) => (

                    <TableRow key={order.id} className="hover:bg-purple-50">
                      <TableCell className="font-medium text-purple-600">{order.orderNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.client}</p>
                          <p className="text-sm text-gray-500">{order.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{order.totalAmount} DH</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-white flex items-center gap-1 w-fit", getStatusIcon(order.status))}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Détails de la commande {order.orderNumber}</DialogTitle>
                                <DialogDescription>
                                  Commande passée le {new Date(order.createdAt).toLocaleDateString("fr-FR")} à {new Date(order.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <h4 className="font-semibold mb-2">Informations client</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Nom:</strong> {order.client}</p>
                                      <p className="flex items-center gap-1"><Phone className="h-3 w-3" />{order.phone}</p>
                                      <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{order.address}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Livraison</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Heure estimée:</strong> {order.deliveryTime}</p>
                                      <p><strong>Statut:</strong> <Badge className={cn("ml-2 text-white", getStatusIcon(order.status))}>{order.status}</Badge></p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Articles commandés</h4>
                                  <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span className="font-semibold">{item.price} DH</span>
                                      </div>
                                    ))}
                                    <div className="flex justify-between items-center p-2 bg-purple-100 rounded font-semibold">
                                      <span>Total</span>
                                      <span>{order.totalAmount} DH</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-4">
  {order.status === OrderStatus.PENDING && (
    <>
      <Button
        className="bg-green-500 hover:bg-green-600"
        onClick={() => updateOrderStatus(order.id, OrderStatus.CONFIRMED)}
      >
        <Check className="mr-2 h-4 w-4" />
        Confirmer
      </Button>
      <Button
        variant="destructive"
        onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
      >
        <X className="mr-2 h-4 w-4" />
        Refuser
      </Button>
    </>
  )}

  {order.status === OrderStatus.CONFIRMED && (
    <Button
      className="bg-orange-500 hover:bg-orange-600"
      onClick={() => updateOrderStatus(order.id, OrderStatus.PREPARING)}
    >
      <Clock className="mr-2 h-4 w-4" />
      Marquer en préparation
    </Button>
  )}

  {order.status === OrderStatus.PREPARING && (
    <Button
      className="bg-blue-500 hover:bg-blue-600"
      onClick={() => updateOrderStatus(order.id, OrderStatus.DELIVERED)}
    >
      <Check className="mr-2 h-4 w-4" />
      Marquer comme livré
    </Button>
  )}
</div>

                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
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
