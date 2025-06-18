"use client"

import { useState } from "react"
import { Upload, FileText, Check, X, Eye, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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

export default function DocumentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const documents = [
    {
      id: 1,
      name: "Registre de Commerce",
      type: "Obligatoire",
      status: "Approuvé",
      uploadDate: "2023-05-15",
      expiryDate: "2024-05-15",
      file: "registre-commerce.pdf",
      required: true,
    },
    {
      id: 2,
      name: "Attestation Fiscale",
      type: "Obligatoire",
      status: "En attente",
      uploadDate: "2023-05-20",
      expiryDate: "2024-05-20",
      file: "attestation-fiscale.pdf",
      required: true,
    },
    {
      id: 3,
      name: "CIN du Gérant",
      type: "Obligatoire",
      status: "Approuvé",
      uploadDate: "2023-05-10",
      expiryDate: "2028-05-10",
      file: "cin-gerant.pdf",
      required: true,
    },
    {
      id: 4,
      name: "Licence d'Exploitation",
      type: "Obligatoire",
      status: "Rejeté",
      uploadDate: "2023-05-18",
      expiryDate: "2024-05-18",
      file: "licence-exploitation.pdf",
      required: true,
      rejectionReason: "Document illisible, veuillez télécharger une version plus claire",
    },
    {
      id: 5,
      name: "Certificat d'Hygiène",
      type: "Recommandé",
      status: "Non fourni",
      uploadDate: null,
      expiryDate: null,
      file: null,
      required: false,
    },
    {
      id: 6,
      name: "Assurance Responsabilité",
      type: "Recommandé",
      status: "Approuvé",
      uploadDate: "2023-05-12",
      expiryDate: "2024-05-12",
      file: "assurance.pdf",
      required: false,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approuvé":
        return "bg-green-500"
      case "En attente":
        return "bg-yellow-500"
      case "Rejeté":
        return "bg-red-500"
      case "Non fourni":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approuvé":
        return <Check className="h-4 w-4" />
      case "En attente":
        return <AlertCircle className="h-4 w-4" />
      case "Rejeté":
        return <X className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const approvedDocs = documents.filter((doc) => doc.status === "Approuvé").length
  const totalRequired = documents.filter((doc) => doc.required).length
  const completionRate = (approvedDocs / documents.length) * 100

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-droovo-gradient shadow-lg">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <h1 className="text-xl font-bold text-white">Documents Légaux</h1>
            <Badge className="bg-white/20 text-white">
              {approvedDocs}/{documents.length} approuvés
            </Badge>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Progress Overview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>État de vos documents</CardTitle>
              <CardDescription>Progression de la validation de vos documents légaux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression globale</span>
                  <span>{Math.round(completionRate)}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {documents.filter((d) => d.status === "Approuvé").length}
                  </div>
                  <div className="text-sm text-gray-600">Approuvés</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {documents.filter((d) => d.status === "En attente").length}
                  </div>
                  <div className="text-sm text-gray-600">En attente</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {documents.filter((d) => d.status === "Rejeté").length}
                  </div>
                  <div className="text-sm text-gray-600">Rejetés</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {documents.filter((d) => d.status === "Non fourni").length}
                  </div>
                  <div className="text-sm text-gray-600">Manquants</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {doc.name}
                          {doc.required && (
                            <Badge variant="outline" className="text-xs">
                              Obligatoire
                            </Badge>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {doc.uploadDate
                            ? `Téléchargé le ${new Date(doc.uploadDate).toLocaleDateString("fr-FR")}`
                            : "Non téléchargé"}
                        </p>
                        {doc.expiryDate && (
                          <p className="text-xs text-gray-500">
                            Expire le {new Date(doc.expiryDate).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={cn("text-white flex items-center gap-1", getStatusColor(doc.status))}>
                        {getStatusIcon(doc.status)}
                        {doc.status}
                      </Badge>

                      <div className="flex gap-2">
                        {doc.file ? (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>{doc.name}</DialogTitle>
                                  <DialogDescription>
                                    Document téléchargé le {new Date(doc.uploadDate).toLocaleDateString("fr-FR")}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                                      <p className="text-gray-600">Aperçu du document</p>
                                      <p className="text-sm text-gray-500">{doc.file}</p>
                                    </div>
                                  </div>

                                  {doc.status === "Rejeté" && doc.rejectionReason && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                      <div className="flex items-center gap-2 text-red-800 mb-2">
                                        <X className="h-4 w-4" />
                                        <span className="font-semibold">Raison du rejet</span>
                                      </div>
                                      <p className="text-red-700 text-sm">{doc.rejectionReason}</p>
                                    </div>
                                  )}

                                  <div className="flex gap-2">
                                    <Button className="bg-droovo-gradient hover:opacity-90">
                                      <Download className="mr-2 h-4 w-4" />
                                      Télécharger
                                    </Button>
                                    {doc.status === "Rejeté" && (
                                      <Button variant="outline">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Remplacer
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" className="bg-droovo-gradient hover:opacity-90">
                                <Upload className="mr-2 h-4 w-4" />
                                Télécharger
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Télécharger {doc.name}</DialogTitle>
                                <DialogDescription>
                                  Sélectionnez le fichier à télécharger (PDF, JPG, PNG acceptés)
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="file">Fichier</Label>
                                  <Input id="file" type="file" accept=".pdf,.jpg,.jpeg,.png" />
                                </div>
                                <div className="flex gap-2">
                                  <Button className="bg-droovo-gradient hover:opacity-90">
                                    Télécharger le document
                                  </Button>
                                  <Button variant="outline">Annuler</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Help Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Aide et informations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Documents obligatoires</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Registre de commerce en cours de validité</li>
                    <li>• Attestation fiscale récente</li>
                    <li>• CIN du gérant (recto-verso)</li>
                    <li>• Licence d'exploitation du restaurant</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Formats acceptés</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• PDF (recommandé)</li>
                    <li>• JPG/JPEG</li>
                    <li>• PNG</li>
                    <li>• Taille maximum : 10 MB</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
