"use client"

import { useState } from "react"
import { Camera, Edit, Save, MapPin, Clock, Star, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "../components/sidebar"

export default function RestaurantPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [restaurantData, setRestaurantData] = useState({
    name: "Le Marrakchi",
    description: "Restaurant traditionnel marocain offrant une cuisine authentique dans une ambiance chaleureuse.",
    address: "123 Avenue Mohammed V, Casablanca",
    phone: "+212 522 123 456",
    email: "contact@lemarrakchi.ma",
    hours: "11h00 - 23h00",
    isOpen: true,
    deliveryRadius: "5 km",
    minimumOrder: "80 DH",
  })

  const stats = [
    { label: "Note moyenne", value: "4.8", icon: Star, color: "text-yellow-500" },
    { label: "Commandes totales", value: "2,847", icon: Users, color: "text-purple-500" },
    { label: "Clients fidèles", value: "456", icon: Award, color: "text-orange-500" },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Mon Restaurant</h1>
            <div className="ml-auto">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/20 hover:bg-white/30 text-white"
                variant="outline"
              >
                {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {isEditing ? "Sauvegarder" : "Modifier"}
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Restaurant Profile */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Informations du restaurant</CardTitle>
                  <CardDescription>Gérez les informations de votre restaurant</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Nom du restaurant</Label>
                      <Input
                        id="name"
                        value={restaurantData.name}
                        disabled={!isEditing}
                        onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={restaurantData.phone}
                        disabled={!isEditing}
                        onChange={(e) => setRestaurantData({ ...restaurantData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={restaurantData.description}
                      disabled={!isEditing}
                      onChange={(e) => setRestaurantData({ ...restaurantData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={restaurantData.address}
                      disabled={!isEditing}
                      onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={restaurantData.email}
                        disabled={!isEditing}
                        onChange={(e) => setRestaurantData({ ...restaurantData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hours">Horaires</Label>
                      <Input
                        id="hours"
                        value={restaurantData.hours}
                        disabled={!isEditing}
                        onChange={(e) => setRestaurantData({ ...restaurantData, hours: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Settings */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Paramètres de livraison</CardTitle>
                  <CardDescription>Configurez vos options de livraison</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isOpen">Restaurant ouvert</Label>
                      <p className="text-sm text-gray-600">Activez/désactivez les commandes</p>
                    </div>
                    <Switch
                      id="isOpen"
                      checked={restaurantData.isOpen}
                      onCheckedChange={(checked) => setRestaurantData({ ...restaurantData, isOpen: checked })}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="radius">Rayon de livraison</Label>
                      <Input
                        id="radius"
                        value={restaurantData.deliveryRadius}
                        disabled={!isEditing}
                        onChange={(e) => setRestaurantData({ ...restaurantData, deliveryRadius: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="minimum">Commande minimum</Label>
                      <Input
                        id="minimum"
                        value={restaurantData.minimumOrder}
                        disabled={!isEditing}
                        onChange={(e) => setRestaurantData({ ...restaurantData, minimumOrder: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Restaurant Image */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Photo du restaurant</CardTitle>
                  <CardDescription>Image principale de votre restaurant</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-100 to-orange-100 flex items-center justify-center">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src="/placeholder.svg" alt="Restaurant" />
                        <AvatarFallback className="text-2xl bg-droovo-gradient text-white">LM</AvatarFallback>
                      </Avatar>
                    </div>
                    {isEditing && (
                      <Button size="icon" className="absolute bottom-2 right-2 bg-droovo-gradient hover:opacity-90">
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Statut</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">État</span>
                      <Badge className={restaurantData.isOpen ? "bg-green-500" : "bg-red-500"}>
                        {restaurantData.isOpen ? "Ouvert" : "Fermé"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {restaurantData.hours}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      Livraison dans un rayon de {restaurantData.deliveryRadius}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
