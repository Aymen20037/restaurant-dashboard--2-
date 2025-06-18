# Documentation API - Restaurant Dashboard

## Authentification

### POST /api/auth/login
Connexion utilisateur

**Body:**
\`\`\`json
{
  "email": "admin@droovo.com",
  "password": "admin123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "admin@droovo.com",
    "name": "Admin Droovo",
    "role": "ADMIN"
  }
}
\`\`\`

### POST /api/auth/register
Inscription utilisateur

**Body:**
\`\`\`json
{
  "email": "restaurant@example.com",
  "password": "password123",
  "name": "Nom du propriétaire",
  "restaurantName": "Mon Restaurant",
  "cuisine": "Française",
  "phone": "+33123456789",
  "address": "123 Rue Example",
  "city": "Paris",
  "postalCode": "75001"
}
\`\`\`

### GET /api/auth/me
Récupérer le profil utilisateur (authentifié)

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

## Plats

### GET /api/dishes
Récupérer la liste des plats

**Query Parameters:**
- `page`: Numéro de page (défaut: 1)
- `limit`: Nombre d'éléments par page (défaut: 10)
- `category`: ID de catégorie
- `search`: Recherche par nom/description
- `available`: true/false pour filtrer par disponibilité

### POST /api/dishes
Créer un nouveau plat

**Body:**
\`\`\`json
{
  "name": "Nom du plat",
  "description": "Description du plat",
  "price": 15.99,
  "categoryId": "category_id",
  "preparationTime": 20,
  "isVegetarian": true,
  "calories": 350
}
\`\`\`

### GET /api/dishes/[id]
Récupérer un plat spécifique

### PUT /api/dishes/[id]
Mettre à jour un plat

### DELETE /api/dishes/[id]
Supprimer un plat

## Statistiques

### GET /api/stats/dashboard
Récupérer les statistiques du tableau de bord

**Response:**
\`\`\`json
{
  "ordersThisMonth": {
    "value": 45,
    "change": 12.5
  },
  "newCustomers": {
    "value": 23,
    "change": -5.2
  },
  "dishesOrdered": {
    "value": 156,
    "change": 8.7
  },
  "satisfaction": {
    "value": 4.2,
    "change": 0.3,
    "count": 18
  }
}
\`\`\`

### GET /api/stats/revenue
Récupérer les données de revenus

**Query Parameters:**
- `period`: Nombre de jours (défaut: 30)

## Codes d'erreur

- `400`: Données invalides
- `401`: Non autorisé
- `403`: Accès refusé
- `404`: Ressource non trouvée
- `405`: Méthode non autorisée
- `500`: Erreur serveur

## Authentification

Toutes les routes protégées nécessitent un token JWT dans l'en-tête:
\`\`\`
Authorization: Bearer <your_jwt_token>
