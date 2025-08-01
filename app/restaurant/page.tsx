"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, Edit, Save, MapPin, Clock, Star, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "../components/sidebar";

type RestaurantData = {
  restaurantName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  logo?: string; 

  isOpen: boolean;
  deliveryRadius: string;
  minimumOrder: string;
};

export default function RestaurantPage() {
  const [isSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [restaurantData, setRestaurantData] = useState<RestaurantData>({
    restaurantName: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    hours: "",
    isOpen: true,
    logo: "", 
    deliveryRadius: "",
    minimumOrder: "",
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await fetch("/api/restaurant", {
          method: "GET",
          credentials: "include",
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setRestaurantData(data);
        } else {
          setError(data.error || "Erreur de récupération des données.");
          router.push("/login");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Une erreur est survenue lors de la récupération des données.");
        router.push("/login");
      } finally {
        setIsInitialized(true);
      }
    };
  
    fetchRestaurantData();
  }, [router]);
  
  const handleSave = async () => {
    const requiredFields: (keyof RestaurantData)[] = [
      "restaurantName",
      "phone",
      "email",
      "address",
      "hours",
      "deliveryRadius",
      "minimumOrder",
      "logo"
    ];

    for (const field of requiredFields) {
      if (!restaurantData[field]) {
        setError(`Le champ "${field}" est obligatoire.`);
        return;
      }
    }

    try {
      const response = await fetch("/api/restaurant", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(restaurantData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Restaurant mis à jour avec succès !");
        setIsEditing(false);
      } else {
        setError(data.error || "Erreur lors de la mise à jour des données.");
      }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError("Une erreur est survenue lors de la sauvegarde des données.");
    }
  };

 

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Mon Restaurant</h1>
            <div className="ml-auto">
              <Button
                onClick={() => {
                  if (isEditing) handleSave();
                  setIsEditing(!isEditing);
                }}
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
     

          {error && <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Formulaire d'informations */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Informations du restaurant</CardTitle>
                  <CardDescription>Gérez les informations de votre restaurant</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="restaurantName">Nom du restaurant</Label>
                      <Input
                        id="restaurantName"
                        value={restaurantData.restaurantName}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setRestaurantData({ ...restaurantData, restaurantName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={restaurantData.phone}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setRestaurantData({ ...restaurantData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={restaurantData.description}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setRestaurantData({ ...restaurantData, description: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={restaurantData.address}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setRestaurantData({ ...restaurantData, address: e.target.value })
                      }
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
                        onChange={(e) =>
                          setRestaurantData({ ...restaurantData, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="hours">Horaires</Label>
                      <Input
                        id="hours"
                        value={restaurantData.hours}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setRestaurantData({ ...restaurantData, hours: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      onCheckedChange={(checked) =>
                        setRestaurantData({ ...restaurantData, isOpen: checked })
                      }
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="radius">Rayon de livraison</Label>
                      <Input
                        id="radius"
                        value={restaurantData.deliveryRadius}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setRestaurantData({ ...restaurantData, deliveryRadius: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="minimum">Commande minimum</Label>
                      <Input
                        id="minimum"
                        value={restaurantData.minimumOrder}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setRestaurantData({ ...restaurantData, minimumOrder: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statut + Image */}
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
                      <AvatarImage
  src={restaurantData.logo || "/placeholder.svg"}
  alt="Restaurant"
/>



                      <AvatarFallback className="text-2xl bg-droovo-gradient text-white">LM</AvatarFallback>
                      </Avatar>
                    </div>
                    {isEditing && (
  <>
   <input
  id="file-upload"
  type="file"
  accept="image/*"
  className="hidden"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setRestaurantData((prev) => ({
          ...prev,
          logo: data.url, // On stocke l'URL du fichier
        }));
      } else {
        alert(data.error || "Erreur lors de l'upload");
      }
    } catch (error) {
      console.error("Erreur upload :", error);
    }
  }}
/>

    <Button
      type="button"
      size="icon"
      className="absolute bottom-2 right-2 bg-droovo-gradient hover:opacity-90"
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <Camera className="h-4 w-4" />
    </Button>
  </>
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
  );
}
