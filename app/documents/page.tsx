"use client"

import { useEffect, useState } from "react"
import {
  Upload,
  FileText,
  Check,
  X,
  Eye,
  Download,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

type Document = {
  id: string
  name: string
  type?: string
  status: string
  uploadDate: string | null
  expiryDate?: string | null
  file: string | null
  required?: boolean
  rejectionReason?: string | null
}

const documentTypes = [
  { value: "registre_commerce", label: "Registre de commerce" },
  { value: "attestation_fiscale", label: "Attestation fiscale" },
  { value: "cin_gerant", label: "CIN du gérant" },
  { value: "licence_exploitation", label: "Licence d'exploitation" },
]

export default function DocumentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Upload formulaire (nouveau document)
  const [selectedType, setSelectedType] = useState(documentTypes[0].value)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadingNewDoc, setUploadingNewDoc] = useState(false)

  // Upload remplacement (par docId)
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>(
    {}
  )

  useEffect(() => {
    fetchDocuments()
  }, [])

  async function fetchDocuments() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/documents")
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      const data = await res.json()
      setDocuments(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function getStatusColor(status: string) {
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

  function getStatusIcon(status: string) {
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
  const completionRate =
    documents.length === 0 ? 0 : (approvedDocs / documents.length) * 100

  // Upload nouveau document
  async function handleUploadNewDocument() {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier avant de télécharger.")
      return
    }
    setUploadingNewDoc(true)

    try {
      const formData = new FormData()
      formData.append("name", selectedFile.name)
      formData.append("type", selectedType)
      formData.append("file", selectedFile)

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erreur lors de l'upload")
      }

      alert("Document téléchargé avec succès.")
      setSelectedFile(null)
      await fetchDocuments()
    } catch (error: any) {
      alert("Erreur : " + error.message)
    } finally {
      setUploadingNewDoc(false)
    }
  }

  // Remplacer document existant
  async function handleReplaceUpload(docId: string) {
    const file = selectedFiles[docId]
    if (!file) return alert("Veuillez sélectionner un fichier avant de télécharger.")
    setUploadingDocId(docId)

    try {
      const formData = new FormData()
      formData.append("id", docId)
      formData.append("file", file)

      const res = await fetch("/api/documents", {
        method: "PUT",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erreur lors de l'upload")
      }

      const updatedDoc = await res.json()
      setDocuments((docs) =>
        docs.map((d) => (d.id === updatedDoc.id ? { ...d, ...updatedDoc } : d))
      )
      setSelectedFiles((prev) => ({ ...prev, [docId]: null }))
      alert("Document téléchargé avec succès.")
    } catch (error: any) {
      alert("Erreur : " + error.message)
    } finally {
      setUploadingDocId(null)
    }
  }
  if (loading) 
    return (
      <div className="p-6 text-center flex justify-center items-center">
        <div className="h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  
  if (error) return <div className="p-6 text-center text-red-600">Erreur : {error}</div>
  

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
          {/* Formulaire Upload Nouveau Document */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Télécharger un nouveau document</CardTitle>
              <CardDescription>
                Choisissez le type de document et sélectionnez le fichier à uploader.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 items-center">
              <select
                className="border border-gray-300 rounded px-3 py-2"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {documentTypes.map((doc) => (
                  <option key={doc.value} value={doc.value}>
                    {doc.label}
                  </option>
                ))}
              </select>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setSelectedFile(e.target.files ? e.target.files[0] : null)
                }
              />

              <Button
                className="whitespace-nowrap"
                onClick={handleUploadNewDocument}
                disabled={uploadingNewDoc || !selectedFile}
              >
                {uploadingNewDoc ? "Téléchargement..." : "Télécharger"}
              </Button>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>État de vos documents</CardTitle>
              <CardDescription>
                Progression de la validation de vos documents légaux
              </CardDescription>
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
                            ? `Téléchargé le ${new Date(
                                doc.uploadDate
                              ).toLocaleDateString("fr-FR")}`
                            : "Non téléchargé"}
                        </p>
                        {doc.expiryDate && (
                          <p className="text-xs text-gray-500">
                            Expire le{" "}
                            {new Date(doc.expiryDate).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        className={cn(
                          "text-white flex items-center gap-1",
                          getStatusColor(doc.status)
                        )}
                      >
                        {getStatusIcon(doc.status)}
                        {doc.status}
                      </Badge>

                      {doc.file && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/uploads/${doc.file}`, "_blank")}
                          title={`Télécharger ${doc.name}`}
                        >
                          <Download className="mr-1 h-4 w-4" />
                          Télécharger
                        </Button>
                      )}

                      {/* Bouton Aperçu */}
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
                              Document téléchargé le{" "}
                              {doc.uploadDate
                                ? new Date(doc.uploadDate).toLocaleDateString("fr-FR")
                                : ""}
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

                            <div className="flex gap-2 items-center">
                              {doc.status === "Rejeté" && (
                                <>
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) =>
                                      setSelectedFiles((prev) => ({
                                        ...prev,
                                        [doc.id]: e.target.files ? e.target.files[0] : null,
                                      }))
                                    }
                                    disabled={uploadingDocId === doc.id}
                                  />
                                  <Button
                                    variant="outline"
                                    disabled={
                                      uploadingDocId === doc.id || !selectedFiles[doc.id]
                                    }
                                    onClick={() => handleReplaceUpload(doc.id)}
                                  >
                                    {uploadingDocId === doc.id
                                      ? "Téléchargement..."
                                      : "Remplacer"}
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {!doc.file && (
                        <>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) =>
                              setSelectedFiles((prev) => ({
                                ...prev,
                                [doc.id]: e.target.files ? e.target.files[0] : null,
                              }))
                            }
                            disabled={uploadingDocId === doc.id}
                          />
                          <Button
                            size="sm"
                            className="bg-droovo-gradient hover:opacity-90"
                            disabled={uploadingDocId === doc.id || !selectedFiles[doc.id]}
                            onClick={() => handleReplaceUpload(doc.id)}
                          >
                            {uploadingDocId === doc.id ? "Téléchargement..." : "Télécharger"}
                          </Button>
                        </>
                      )}
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
