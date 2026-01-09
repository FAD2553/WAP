const products = [
    // --- iPhones ---
    {
        id: 101,
        name: "iPhone 15 Pro Max",
        price: 950000,
        category: "Téléphones",
        image: "images/1.jpeg",
        images: [
             "images/2.jpeg",
             "images/3.jpeg",
             "images/4.jpeg"
        ],
        description: "Le nec plus ultra d'Apple. Titane, puce A17 Pro.",
        variants: ["256Go", "512Go", "1To"],
        occasions: ["noel", "anniversaire", "luxe"]
    },
    {
        id: 104,
        name: "iPhone 13",
        price: 450000,
        category: "Téléphones",
        image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=600&auto=format&fit=crop",
        description: "Le rapport qualité/prix idéal.",
        variants: ["128Go", "256Go"],
        occasions: ["cadeau"]
    },
    {
        id: 107,
        name: "iPhone X",
        price: 180000,
        category: "Téléphones",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format&fit=crop",
        description: "Le classique qui a tout changé.",
        variants: ["64Go", "256Go"]
    },

    // --- Samsungs ---
    {
        id: 204,
        name: "Samsung Galaxy S21",
        price: 300000,
        category: "Téléphones",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=600&auto=format&fit=crop",
        description: "Un écran exceptionnel.",
        variants: ["128Go", "256Go"]
    },

    // --- Luxury Clothing ---
    {
        id: 301,
        name: "Robe Soirée Gucci",
        price: 1200000,
        category: "Vêtements",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600&auto=format&fit=crop"
        ],
        description: "Robe longue élégante pour les grandes occasions.",
        variants: ["S", "M", "L", "XL"],
        occasions: ["saint-valentin", "luxe", "mariage"]
    },
    {
        id: 302,
        name: "T-Shirt Balenciaga",
        price: 250000,
        category: "Vêtements",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop",
        description: "Cotton premium, coupe oversize.",
        variants: ["S", "M", "L", "XL"],
        occasions: ["cadeau", "anniversaire"]
    },
    {
        id: 303,
        name: "Veste Christian Dior",
        price: 1500000,
        category: "Vêtements",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop",
        description: "L'élégance à la française.",
        variants: ["48", "50", "52", "54"],
        occasions: ["luxe", "anniversaire"]
    },
        {
        id: 304,
        name: "Chemise Lin Premium",
        price: 45000,
        category: "Vêtements",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop",
        description: "Légère et respirante, idéale pour l'été.",
        variants: ["M", "L", "XL"],
        occasions: ["fete-peres"]
    },

    // --- Accessories & Jewelry ---
    {
        id: 401,
        name: "Sac à Main Luxe",
        price: 450000,
        category: "Accessoires",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=600&auto=format&fit=crop"
        ],
        description: "Cuir véritable, finition dorée.",
        variants: ["Noir", "Beige", "Rouge"],
        occasions: ["saint-valentin", "fete-meres", "luxe"]
    },
    {
        id: 402,
        name: "Montre Suisse Or",
        price: 850000,
        category: "Accessoires",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop",
        description: "Mécanisme automatique de précision.",
        variants: ["Or", "Argent/Or"],
        occasions: ["anniversaire", "luxe", "fete-peres"]
    },
    {
        id: 404,
        name: "Bague Solitaire",
        price: 650000,
        category: "Bijoux",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
        description: "Un symbole d'amour éternel.",
        variants: ["52", "54", "56"],
        occasions: ["mariage", "saint-valentin"]
    },
    {
        id: 405,
        name: "Parfum Essence Rare",
        price: 85000,
        category: "Beauté",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop",
        description: "Fragrance envoûtante.",
        variants: ["50ml", "100ml"],
        occasions: ["saint-valentin", "fete-meres"]
    },
    {
        id: 406,
        name: "Lunettes de Soleil Star",
        price: 65000,
        category: "Accessoires",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop",
        description: "Protection UV maximale, look star.",
        variants: ["Noir", "Écaille"],
        occasions: ["cadeau"]
    }
];
