"use client"

import { useState } from "react"
import { Camera, Edit, Save, User, Mail, Phone, MapPin, Lock, Bell, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "../components/sidebar"

export default function ComptePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: "Mohammed Alami",
    email: "mohammed@lemarrakchi.ma",
    phone: "+212 661 234 567",
    address: "123 Avenue Mohammed V, Casablanca",
    notifications: {
      email: true,
      sms: true,
      push: true,
      marketing: false,
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
    },
  })

  const handleSave = () => {
    setIsEditing(false)
    console.log("Saving user data:", userData)
    // Ici vous ajouteriez la logique de sauvegarde
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Mon Compte</h1>
            <div className="ml-auto">
              <Button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="bg-white/20 hover:bg-white/30 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
                variant="outline"
              >
                {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {isEditing ? "Sauvegarder" : "Modifier"}
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Photo de profil */}
                <Card className="border-0 shadow-lg dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Photo de profil</CardTitle>
                    <CardDescription>Votre photo d'identification</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src="/placeholder.svg" alt="Photo de profil" />
                        <AvatarFallback className="text-2xl bg-droovo-gradient text-white">MA</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button size="icon" className="absolute bottom-0 right-0 bg-droovo-gradient hover:opacity-90">
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold">{userData.name}</h3>
                      <p className="text-sm text-gray-600">Gérant - Le Marrakchi</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Informations personnelles */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-0 shadow-lg dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle>Informations personnelles</CardTitle>
                      <CardDescription>Gérez vos informations de contact</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nom complet</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                              id="name"
                              value={userData.name}
                              disabled={!isEditing}
                              className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              value={userData.email}
                              disabled={!isEditing}
                              className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                              id="phone"
                              value={userData.phone}
                              disabled={!isEditing}
                              className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Adresse</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                              id="address"
                              value={userData.address}
                              disabled={!isEditing}
                              className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                              onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-0 shadow-lg dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Préférences de notifications
                  </CardTitle>
                  <CardDescription>Choisissez comment vous souhaitez être notifié</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotif">Notifications par email</Label>
                        <p className="text-sm text-gray-600">Recevez les notifications importantes par email</p>
                      </div>
                      <Switch
                        id="emailNotif"
                        checked={userData.notifications.email}
                        onCheckedChange={(checked) =>
                          setUserData({
                            ...userData,
                            notifications: { ...userData.notifications, email: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsNotif">Notifications SMS</Label>
                        <p className="text-sm text-gray-600">Recevez les alertes urgentes par SMS</p>
                      </div>
                      <Switch
                        id="smsNotif"
                        checked={userData.notifications.sms}
                        onCheckedChange={(checked) =>
                          setUserData({
                            ...userData,
                            notifications: { ...userData.notifications, sms: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotif">Notifications push</Label>
                        <p className="text-sm text-gray-600">Notifications dans le navigateur</p>
                      </div>
                      <Switch
                        id="pushNotif"
                        checked={userData.notifications.push}
                        onCheckedChange={(checked) =>
                          setUserData({
                            ...userData,
                            notifications: { ...userData.notifications, push: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketingNotif">Communications marketing</Label>
                        <p className="text-sm text-gray-600">Offres spéciales et nouveautés Droovo</p>
                      </div>
                      <Switch
                        id="marketingNotif"
                        checked={userData.notifications.marketing}
                        onCheckedChange={(checked) =>
                          setUserData({
                            ...userData,
                            notifications: { ...userData.notifications, marketing: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-lg dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Sécurité du compte
                    </CardTitle>
                    <CardDescription>Paramètres de sécurité et authentification</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="twoFactor">Authentification à deux facteurs</Label>
                        <p className="text-sm text-gray-600">Sécurité renforcée avec un code SMS</p>
                      </div>
                      <Switch
                        id="twoFactor"
                        checked={userData.security.twoFactor}
                        onCheckedChange={(checked) =>
                          setUserData({
                            ...userData,
                            security: { ...userData.security, twoFactor: checked },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="loginAlerts">Alertes de connexion</Label>
                        <p className="text-sm text-gray-600">Notification lors de nouvelles connexions</p>
                      </div>
                      <Switch
                        id="loginAlerts"
                        checked={userData.security.loginAlerts}
                        onCheckedChange={(checked) =>
                          setUserData({
                            ...userData,
                            security: { ...userData.security, loginAlerts: checked },
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Mot de passe
                    </CardTitle>
                    <CardDescription>Modifiez votre mot de passe</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword">Confirmer le nouveau mot de passe</Label>
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <Button className="w-full bg-droovo-gradient hover:opacity-90 text-white dark:text-white">
                      Changer le mot de passe
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
