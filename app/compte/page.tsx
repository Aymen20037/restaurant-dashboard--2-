'use client'

import { useEffect, useState } from 'react'
import { Camera, Edit, Save, User, Mail, Phone, MapPin, Bell, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sidebar } from '../components/sidebar'

type UserData = {
  name: string
  email: string
  phone?: string
  address?: string
  notifications?: {
    email: boolean
    sms: boolean
    push: boolean
    marketing: boolean
  }
  security?: {
    twoFactor: boolean
    loginAlerts: boolean
  }
}

export default function ComptePage() {
  const [isSidebarOpen] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/account')
        if (!res.ok) throw new Error('Échec du chargement des données.')
        const data = await res.json()
        setUserData(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleSave = async () => {
    if (!userData) return
    try {
      const res = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde.')
      alert('Données mises à jour avec succès.')
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue.')
    }
  }

  if (loading) return <div className="p-6">Chargement...</div>
  if (!userData) return <div className="p-6 text-red-500">{error || 'Impossible de charger les données.'}</div>

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
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {isEditing ? 'Sauvegarder' : 'Modifier'}
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

            {/* Profil */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Photo de profil</CardTitle>
                    <CardDescription>Votre image d’identification</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-2xl bg-droovo-gradient text-white">U</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button size="icon" className="absolute bottom-0 right-0 bg-droovo-gradient hover:opacity-90">
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Informations personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <InputField
                          label="Nom complet"
                          icon={<User />}
                          value={userData.name}
                          onChange={(v) => setUserData({ ...userData, name: v })}
                          disabled={!isEditing}
                        />
                        <InputField
                          label="Email"
                          icon={<Mail />}
                          value={userData.email}
                          onChange={(v) => setUserData({ ...userData, email: v })}
                          disabled={!isEditing}
                        />
                        <InputField
                          label="Téléphone"
                          icon={<Phone />}
                          value={userData.phone || ''}
                          onChange={(v) => setUserData({ ...userData, phone: v })}
                          disabled={!isEditing}
                        />
                        <InputField
                          label="Adresse"
                          icon={<MapPin />}
                          value={userData.address || ''}
                          onChange={(v) => setUserData({ ...userData, address: v })}
                          disabled={!isEditing}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              {Object.entries(userData.notifications || {}).map(([key, val]) => (
                <NotificationSwitch
                  key={key}
                  label={key}
                  description={`Recevoir par ${key}`}
                  value={val}
                  onChange={(v: boolean) =>
                    setUserData({
                      ...userData,
                      notifications: {
                        email: userData.notifications?.email ?? false,
                        sms: userData.notifications?.sms ?? false,
                        push: userData.notifications?.push ?? false,
                        marketing: userData.notifications?.marketing ?? false,
                        [key]: v,
                      },
                    })
                  }
                />
              ))}
            </TabsContent>

            {/* Sécurité */}
            <TabsContent value="security" className="space-y-6">
              {Object.entries(userData.security || {}).map(([key, val]) => (
                <SecuritySwitch
                  key={key}
                  label={key}
                  description={`Activer ${key}`}
                  value={val}
                  onChange={(v: boolean) =>
                    setUserData({
                      ...userData,
                      security: {
                        twoFactor: userData.security?.twoFactor ?? false,
                        loginAlerts: userData.security?.loginAlerts ?? false,
                        [key]: v,
                      },
                    })
                  }
                />
              ))}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

// Utilitaires
function InputField({
  label,
  icon,
  value,
  onChange,
  disabled = false,
  type = 'text',
}: {
  label: string
  icon: React.ReactNode
  value: string
  onChange: (val: string) => void
  disabled?: boolean
  type?: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <Input
          type={type}
          value={value}
          disabled={disabled}
          className="pl-10"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}

function NotificationSwitch({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {label}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Switch checked={value} onCheckedChange={onChange} />
      </CardContent>
    </Card>
  )
}

function SecuritySwitch({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {label}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Switch checked={value} onCheckedChange={onChange} />
      </CardContent>
    </Card>
  )
}
