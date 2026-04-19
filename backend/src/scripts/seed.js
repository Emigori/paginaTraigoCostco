import "dotenv/config";
import { connectDB } from "../config/db.js";
import { Product } from "../models/Product.js";

const products = [
  // Ropa
  { productId: "ropa-001", name: "Calcetines Kirkland paquete 6 pares", price: 399, category: "ropa", imageUrl: "https://placehold.co/400x400/dbeafe/1e40af?text=Calcetines" },
  { productId: "ropa-002", name: "Playera Kirkland cuello V hombre", price: 299, category: "ropa", imageUrl: "https://placehold.co/400x400/dbeafe/1e40af?text=Playera" },
  { productId: "ropa-003", name: "Pants deportivo mujer", price: 499, category: "ropa", imageUrl: "https://placehold.co/400x400/dbeafe/1e40af?text=Pants" },

  // Farmacia
  { productId: "farm-001", name: "Vitamina C 1000mg 500 tabletas", price: 480, category: "farmacia", imageUrl: "https://placehold.co/400x400/dcfce7/166534?text=Vitamina+C" },
  { productId: "farm-002", name: "Omega 3 Fish Oil 400 cápsulas", price: 550, category: "farmacia", imageUrl: "https://placehold.co/400x400/dcfce7/166534?text=Omega+3" },
  { productId: "farm-003", name: "Multivitamínico Kirkland 500 tabletas", price: 620, category: "farmacia", imageUrl: "https://placehold.co/400x400/dcfce7/166534?text=Multivitamínico" },

  // Despensa
  { productId: "desp-001", name: "Aceite de oliva extra virgen 3L", price: 580, category: "despensa", imageUrl: "https://placehold.co/400x400/fef9c3/854d0e?text=Aceite+Oliva" },
  { productId: "desp-002", name: "Mantequilla Kirkland sin sal 4 piezas", price: 320, category: "despensa", imageUrl: "https://placehold.co/400x400/fef9c3/854d0e?text=Mantequilla" },
  { productId: "desp-003", name: "Avena Kirkland 4.5 kg", price: 290, category: "despensa", imageUrl: "https://placehold.co/400x400/fef9c3/854d0e?text=Avena" },
  { productId: "desp-004", name: "Miel de abeja pura 1.36 kg", price: 350, category: "despensa", imageUrl: "https://placehold.co/400x400/fef9c3/854d0e?text=Miel" },

  // Carnes, quesos y salchichas
  { productId: "carne-001", name: "Salchichas Polish paquete 6", price: 280, category: "carnes_quesos_salchichas", imageUrl: "https://placehold.co/400x400/fee2e2/991b1b?text=Salchichas" },
  { productId: "carne-002", name: "Queso Manchego rebanado 1 kg", price: 420, category: "carnes_quesos_salchichas", imageUrl: "https://placehold.co/400x400/fee2e2/991b1b?text=Manchego" },
  { productId: "carne-003", name: "Jamón de pavo Kirkland 1 kg", price: 360, category: "carnes_quesos_salchichas", imageUrl: "https://placehold.co/400x400/fee2e2/991b1b?text=Jamón" },

  // Limpieza
  { productId: "limp-001", name: "Detergente Tide Pods 85 cápsulas", price: 480, category: "limpieza", imageUrl: "https://placehold.co/400x400/ede9fe/4c1d95?text=Tide+Pods" },
  { productId: "limp-002", name: "Papel de baño Kirkland 30 rollos", price: 320, category: "limpieza", imageUrl: "https://placehold.co/400x400/ede9fe/4c1d95?text=Papel+Baño" },
  { productId: "limp-003", name: "Toallas de cocina Kirkland 12 rollos", price: 280, category: "limpieza", imageUrl: "https://placehold.co/400x400/ede9fe/4c1d95?text=Toallas" },

  // Casa
  { productId: "casa-001", name: "Focos LED Feit 12 pack", price: 420, category: "casa", imageUrl: "https://placehold.co/400x400/ffedd5/9a3412?text=Focos+LED" },
  { productId: "casa-002", name: "Bolsas de basura grandes 200 piezas", price: 260, category: "casa", imageUrl: "https://placehold.co/400x400/ffedd5/9a3412?text=Bolsas" },
  { productId: "casa-003", name: "Stretch film para emplayar 4 rollos", price: 310, category: "casa", imageUrl: "https://placehold.co/400x400/ffedd5/9a3412?text=Stretch" },

  // Bebidas y Té
  { productId: "beb-001", name: "Agua Kirkland 40 botellas 500ml", price: 220, category: "bebidas_te", imageUrl: "https://placehold.co/400x400/cffafe/164e63?text=Agua" },
  { productId: "beb-002", name: "Té verde Kirkland 100 bolsas", price: 180, category: "bebidas_te", imageUrl: "https://placehold.co/400x400/cffafe/164e63?text=Té+Verde" },
  { productId: "beb-003", name: "Jugo de naranja Kirkland 2.83L", price: 260, category: "bebidas_te", imageUrl: "https://placehold.co/400x400/cffafe/164e63?text=Jugo" },

  // Dulces
  { productId: "dulc-001", name: "Chocolates Ferrero Rocher 48 piezas", price: 520, category: "dulces", imageUrl: "https://placehold.co/400x400/fce7f3/831843?text=Ferrero" },
  { productId: "dulc-002", name: "Gomitas Kirkland 1.36 kg", price: 290, category: "dulces", imageUrl: "https://placehold.co/400x400/fce7f3/831843?text=Gomitas" },
  { productId: "dulc-003", name: "Granola con chocolate 1.5 kg", price: 340, category: "dulces", imageUrl: "https://placehold.co/400x400/fce7f3/831843?text=Granola" },
];

await connectDB();
await Product.deleteMany({});
await Product.insertMany(products);
console.log(`✓ ${products.length} productos insertados`);
process.exit(0);
