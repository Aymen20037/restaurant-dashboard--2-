"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    cuisineIds: [] as string[],
    name: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (
      !formData.restaurantName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword ||
      formData.cuisineIds.length === 0 ||
      !formData.name.trim()
    ) {
      setError("Tous les champs obligatoires doivent être remplis.");
      return false;
    }
    if (!formData.acceptTerms) {
      setError("Vous devez accepter les conditions d'utilisation.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName: formData.restaurantName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          cuisineIds: formData.cuisineIds,
          name: formData.name,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        router.push("/login");
      } else {
        setError(data.error || "Une erreur est survenue lors de l'inscription.");
      }
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
      setError("Erreur serveur");
    } finally {
      setIsLoading(false);
    }
  };

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
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom restaurant */}
              <div className="space-y-2">
                <Label htmlFor="restaurantName">Nom du restaurant *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="restaurantName"
                    placeholder="Le Marrakchi"
                    className="pl-10"
                    value={formData.restaurantName}
                    onChange={(e) => onChange("restaurantName", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Nom gérant */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom du gérant *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Mohammed Alami"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="+212 6 12 34 56 78"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                  />
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="address"
                    placeholder="123 Rue de Casablanca"
                    className="pl-10"
                    value={formData.address}
                    onChange={(e) => onChange("address", e.target.value)}
                  />
                </div>
              </div>

              {/* Ville */}
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  placeholder="Casablanca"
                  value={formData.city}
                  onChange={(e) => onChange("city", e.target.value)}
                />
              </div>

              {/* Cuisine */}
<div className="space-y-2">
  <Label htmlFor="cuisine">Type de cuisine *</Label>
  <Select
     value={formData.cuisineIds[0] || ""}
     onValueChange={(value) =>
       setFormData((prev) => ({ ...prev, cuisineIds: [value] }))
     }
  >
    <SelectTrigger id="cuisine" className="w-full">
      <SelectValue placeholder="Sélectionnez une cuisine" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="843ec1d7-6a1e-11f0-aa0f-1c394712cdca">Marocain</SelectItem>
      <SelectItem value="843ec45e-6a1e-11f0-aa0f-1c394712cdca">Libanais</SelectItem>
      <SelectItem value="843ec4f3-6a1e-11f0-aa0f-1c394712cdca">Italien</SelectItem>
      <SelectItem value="843ec542-6a1e-11f0-aa0f-1c394712cdca">Indien</SelectItem>
      <SelectItem value="843ec592-6a1e-11f0-aa0f-1c394712cdca">Healthy</SelectItem>
      <SelectItem value="843ed053-6a1e-11f0-aa0f-1c394712cdca">Français</SelectItem>
      <SelectItem value="843ed0e7-6a1e-11f0-aa0f-1c394712cdca">Desserts</SelectItem>
    </SelectContent>
  </Select>
</div>


              {/* Mot de passe */}
              <div className="space-y-2 relative">
                <Label htmlFor="password">Mot de passe *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => onChange("password", e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Confirmer mot de passe */}
              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.confirmPassword}
                    onChange={(e) => onChange("confirmPassword", e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Accepter conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => onChange("acceptTerms", checked as boolean)}
                  required
                />
                <Label htmlFor="acceptTerms" className="text-sm">
                  J'accepte les{" "}
                  <Link href="/terms" className="text-purple-600 hover:text-purple-700 font-medium">
                    conditions d'utilisation
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-droovo-gradient hover:opacity-90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Création en cours..." : "Créer mon compte restaurant"}
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
  );
}
