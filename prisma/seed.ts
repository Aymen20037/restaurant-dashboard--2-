import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log(" Début du seeding...")

  const hashedPassword = await bcrypt.hash("admin123", 12)

  const admin = await prisma.users.upsert({
    where: { email: "admin@droovo.com" },
    update: {},
    create: {
      email: "admin@droovo.com",
      password: hashedPassword,
      name: "Admin Droovo",
      role: "ADMIN",
      restaurantName: "Restaurant Demo",
      description: "Restaurant de démonstration pour Droovo",
      phone: "+33123456789",
      address: "123 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
    },
  })

  const categories = await Promise.all([
    prisma.categories.upsert({
      where: { id: "cat-1" },
      update: {},
      create: {
        id: "cat-1",
        name: "Entrées",
        description: "Entrées fraîches et savoureuses",
      },
    }),
    prisma.categories.upsert({
      where: { id: "cat-2" },
      update: {},
      create: {
        id: "cat-2",
        name: "Plats principaux",
        description: "Nos spécialités principales",
      },
    }),
    prisma.categories.upsert({
      where: { id: "cat-3" },
      update: {},
      create: {
        id: "cat-3",
        name: "Desserts",
        description: "Desserts maison délicieux",
      },
    }),
  ])

  // Créer des plats
  const dishes = await Promise.all([
    prisma.dishes.create({
      data: {
        name: "Salade César",
        description: "Salade fraîche avec croûtons et parmesan",
        price: 12.5,
        categoryId: categories[0].id,
        userId: admin.id,
        preparationTime: 10,
        isVegetarian: true,
        calories: 250,
      },
    }),
    prisma.dishes.create({
      data: {
        name: "Burger Classique",
        description: "Burger avec steak, salade, tomate et frites",
        price: 16.9,
        categoryId: categories[1].id,
        userId: admin.id,
        preparationTime: 20,
        calories: 650,
      },
    }),
    prisma.dishes.create({
      data: {
        name: "Tiramisu",
        description: "Tiramisu traditionnel italien",
        price: 7.5,
        categoryId: categories[2].id,
        userId: admin.id,
        preparationTime: 5,
        isVegetarian: true,
        calories: 320,
      },
    }),
  ])

  // Créer des clients
  const customers = await Promise.all([
    prisma.customers.create({
      data: {
        email: "client1@example.com",
        name: "Marie Dupont",
        phone: "+33123456789",
        address: "456 Avenue des Champs",
        city: "Paris",
      },
    }),
    prisma.customers.create({
      data: {
        email: "client2@example.com",
        name: "Pierre Martin",
        phone: "+33987654321",
        address: "789 Boulevard Saint-Germain",
        city: "Paris",
      },
    }),
  ])

  // Créer des commandes
  const orders = await Promise.all([
    prisma.orders.create({
      data: {
        orderNumber: "ORD-001",
        status: "DELIVERED",
        totalAmount: 29.4,
        customerId: customers[0].id,
        userId: admin.id,
        paymentMethod: "CARD",
        paymentStatus: "COMPLETED",
        order_items: {
          create: [
            {
              dishId: dishes[0].id,
              quantity: 1,
              price: 12.5,
            },
            {
              dishId: dishes[1].id,
              quantity: 1,
              price: 16.9,
            },
          ],
        },
      },
    }),
    prisma.orders.create({
      data: {
        orderNumber: "ORD-002",
        status: "PREPARING",
        totalAmount: 24.4,
        customerId: customers[1].id,
        userId: admin.id,
        paymentMethod: "CASH",
        paymentStatus: "PENDING",
        order_items: {
          create: [
            {
              dishId: dishes[1].id,
              quantity: 1,
              price: 16.9,
            },
            {
              dishId: dishes[2].id,
              quantity: 1,
              price: 7.5,
            },
          ],
        },
      },
    }),
  ])

  // Créer des avis
  await Promise.all([
    prisma.reviews.create({
      data: {
        rating: 5,
        comment: "Excellent restaurant, je recommande vivement !",
        customerId: customers[0].id,
        userId: admin.id,
      },
    }),
    prisma.reviews.create({
      data: {
        rating: 4,
        comment: "Très bon, service rapide et plats délicieux.",
        customerId: customers[1].id,
        userId: admin.id,
      },
    }),
  ])

  console.log("✅ Seeding terminé avec succès!")
  console.log(`👤 Admin créé: ${admin.email}`)
  console.log(`📦 ${categories.length} catégories créées`)
  console.log(`🍽️ ${dishes.length} plats créés`)
  console.log(`👥 ${customers.length} clients créés`)
  console.log(`📋 ${orders.length} commandes créées`)
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
