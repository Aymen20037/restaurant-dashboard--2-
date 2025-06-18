"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    restaurantName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    cuisine: "",
    name: ""// Assurez-vous que le champ `name` est présent dans l'état
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Fonction pour valider les données du formulaire
  const validateForm = () => {
    // Log de débogage pour vérifier les valeurs de formData avant validation
    console.log("Form Data avant validation:", formData);

    if (
      !formData.restaurantName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.cuisine ||
      !formData.name // Assurez-vous que `name` est bien défini
    ) {
      setError("Tous les champs sont obligatoires")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return false
    }

    return true
  }

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Log de débogage pour vérifier avant la soumission
    console.log("Form Data envoyé à l'API:", formData);

    // Valider le formulaire
    if (!validateForm()) return

    setError(null) // Réinitialiser l'erreur avant la soumission

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST", // Méthode POST
        headers: {
          "Content-Type": "application/json", // En-tête JSON
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          restaurantName: formData.restaurantName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          cuisine: formData.cuisine,   // Assurez-vous que ce champ est envoyé
          name: formData.name,         // Assurez-vous que ce champ est envoyé
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Inscription réussie ! Vous pouvez maintenant vous connecter.")
        router.push("/login")
      } else {
        setError(data.error || "Une erreur est survenue lors de l'inscription.")
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      setError("Erreur serveur")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-droovo-gradient mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">D</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Rejoignez Droovo</h1>
          <p className="text-gray-600 mt-2">Créez votre compte restaurant et commencez à vendre</p>
        </div>

        <Card className="border-0 shadow-xl dark:bg-gray-800">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Inscription Restaurant</CardTitle>
            <CardDescription className="text-center">
              Remplissez les informations pour créer votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Afficher l'erreur si elle existe */}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Informations du restaurant</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="restaurantName">Nom du restaurant *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="restaurantName"
                        placeholder="Le Marrakchi"
                        className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        value={formData.restaurantName}
                        onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Nom du gérant *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="ownerName"
                        placeholder="Mohammed Alami"
                        className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuisine">Type de cuisine *</Label>
                  <div className="relative">
                    <Input
                      id="cuisine"
                      placeholder="Italienne"
                      className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      value={formData.cuisine}
                      onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse complète *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="address"
                      placeholder="123 Avenue Mohammed V"
                      className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre ville" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casablanca">Casablanca</SelectItem>
                      <SelectItem value="rabat">Rabat</SelectItem>
                      <SelectItem value="marrakech">Marrakech</SelectItem>
                      <SelectItem value="fes">Fès</SelectItem>
                      <SelectItem value="tanger">Tanger</SelectItem>
                      <SelectItem value="agadir">Agadir</SelectItem>
                      <SelectItem value="meknes">Meknès</SelectItem>
                      <SelectItem value="oujda">Oujda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Informations de contact</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@restaurant.ma"
                        className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="phone"
                        placeholder="+212 6XX XXX XXX"
                        className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                  required
                />
                <Label htmlFor="terms" className="text-sm">
                  J'accepte les{" "}
                  <Link href="/terms" className="text-purple-600 hover:text-purple-700">
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link href="/privacy" className="text-purple-600 hover:text-purple-700">
                    politique de confidentialité
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full bg-droovo-gradient hover:opacity-90 text-white dark:text-white">
                Créer mon compte restaurant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte ?{" "}
                <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2023 Droovo. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  )
}
