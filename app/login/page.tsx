"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Nettoyer l'erreur quand l'utilisateur tape
  const onChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.password) {
      setError("Tous les champs sont obligatoires");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
        credentials: "include",
      });
  
      const data = await response.json();
      console.log("Response status:", response.status);
      console.log("Response data:", data);
  
      if (response.ok) {
        console.log("Connexion réussie !");
        router.push("/");
      } else {
        setError(data.error || "Une erreur est survenue lors de la connexion.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setError("Erreur serveur");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-droovo-gradient mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">D</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Droovo Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Connectez-vous à votre espace restaurant</p>
        </div>

        <Card className="border-0 shadow-xl dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center dark:text-white">Connexion</CardTitle>
            <CardDescription className="text-center dark:text-gray-300">
              Entrez vos identifiants pour accéder à votre dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                    value={formData.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-white">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                    value={formData.password}
                    onChange={(e) => onChange("password", e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent dark:text-gray-400 dark:hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => onChange("rememberMe", checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm dark:text-gray-300">
                    Se souvenir de moi
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-droovo-gradient hover:opacity-90 text-white dark:text-white"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Pas encore de compte ?{" "}
                <Link
                  href="/register"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2023 Droovo. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}
