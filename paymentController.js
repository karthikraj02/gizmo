const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');

const products = [
  { name: 'Intel Core i9-14900K', description: 'Intel flagship 24-core processor for extreme performance', price: 54999, originalPrice: 62999, category: 'CPU', brand: 'Intel', stock: 15, rating: 4.9, numReviews: 234, featured: true, tags: ['gaming', 'workstation', 'flagship'], compatibility: { socket: 'LGA1700', memoryType: 'DDR5' }, specs: new Map([['Cores', '24 (8P+16E)'], ['Threads', '32'], ['Base Clock', '3.2 GHz'], ['Boost Clock', '6.0 GHz'], ['TDP', '125W'], ['Socket', 'LGA1700']]) },
  { name: 'AMD Ryzen 9 7950X', description: 'AMD flagship 16-core processor with Zen 4 architecture', price: 49999, originalPrice: 56999, category: 'CPU', brand: 'AMD', stock: 20, rating: 4.8, numReviews: 189, featured: true, tags: ['gaming', 'workstation', 'flagship'], compatibility: { socket: 'AM5', memoryType: 'DDR5' }, specs: new Map([['Cores', '16'], ['Threads', '32'], ['Base Clock', '4.5 GHz'], ['Boost Clock', '5.7 GHz'], ['TDP', '170W'], ['Socket', 'AM5']]) },
  { name: 'NVIDIA RTX 4090', description: 'World\'s fastest gaming GPU with DLSS 3 and Ada Lovelace architecture', price: 159999, originalPrice: 175000, category: 'GPU', brand: 'NVIDIA', stock: 8, rating: 5, numReviews: 412, featured: true, tags: ['gaming', '4K', 'flagship'], compatibility: { interface: 'PCIe 4.0 x16' }, specs: new Map([['VRAM', '24 GB GDDR6X'], ['CUDA Cores', '16384'], ['Boost Clock', '2520 MHz'], ['TDP', '450W'], ['Outputs', 'HDMI 2.1, 3x DP 1.4']]) },
  { name: 'AMD RX 7900 XTX', description: 'AMD flagship GPU with RDNA 3 and excellent rasterization performance', price: 89999, category: 'GPU', brand: 'AMD', stock: 12, rating: 4.7, numReviews: 156, featured: false, tags: ['gaming', '4K'], compatibility: { interface: 'PCIe 4.0 x16' }, specs: new Map([['VRAM', '24 GB GDDR6'], ['Compute Units', '96'], ['Boost Clock', '2500 MHz'], ['TDP', '355W']]) },
  { name: 'G.Skill Trident Z5 RGB DDR5 32GB', description: 'Premium DDR5 RAM with RGB lighting and extreme overclocking support', price: 14999, originalPrice: 16999, category: 'RAM', brand: 'G.Skill', stock: 50, rating: 4.8, numReviews: 89, tags: ['DDR5', 'RGB', 'overclocking'], compatibility: { memoryType: 'DDR5', formFactor: 'DIMM' }, specs: new Map([['Capacity', '32 GB (2x16GB)'], ['Speed', 'DDR5-6000'], ['CAS Latency', 'CL36'], ['Voltage', '1.35V']]) },
  { name: 'Corsair Vengeance DDR5 64GB', description: 'High-capacity DDR5 memory for workstations and content creators', price: 24999, category: 'RAM', brand: 'Corsair', stock: 30, rating: 4.7, numReviews: 67, tags: ['DDR5', 'workstation'], compatibility: { memoryType: 'DDR5', formFactor: 'DIMM' }, specs: new Map([['Capacity', '64 GB (2x32GB)'], ['Speed', 'DDR5-5600'], ['Voltage', '1.25V']]) },
  { name: 'Samsung 990 Pro 2TB NVMe', description: 'PCIe 4.0 NVMe SSD with blazing speeds up to 7450 MB/s read', price: 18999, originalPrice: 21999, category: 'Storage', brand: 'Samsung', stock: 45, rating: 4.9, numReviews: 534, featured: true, tags: ['NVMe', 'PCIe4', 'fast'], compatibility: { interface: 'PCIe 4.0 x4 NVMe' }, specs: new Map([['Capacity', '2 TB'], ['Read Speed', '7450 MB/s'], ['Write Speed', '6900 MB/s'], ['Interface', 'PCIe 4.0 x4 NVMe']]) },
  { name: 'ASUS ROG Strix Z790-E', description: 'Premium Intel Z790 motherboard for extreme overclocking and connectivity', price: 46999, category: 'Motherboard', brand: 'ASUS', stock: 18, rating: 4.8, numReviews: 78, tags: ['Intel', 'Z790', 'overclocking'], compatibility: { socket: 'LGA1700', memoryType: 'DDR5', formFactor: 'ATX' }, specs: new Map([['Chipset', 'Intel Z790'], ['Socket', 'LGA1700'], ['Memory', '4x DDR5 up to 128GB'], ['PCIe', '5.0 x16'], ['Form Factor', 'ATX']]) },
  { name: 'Corsair RM1000x 1000W PSU', description: '80+ Gold fully modular power supply for high-end builds', price: 16999, category: 'PSU', brand: 'Corsair', stock: 25, rating: 4.8, numReviews: 156, tags: ['modular', '80+ Gold', '1000W'], specs: new Map([['Wattage', '1000W'], ['Rating', '80+ Gold'], ['Type', 'Fully Modular'], ['Fan', '135mm']]) },
  { name: 'Noctua NH-D15 CPU Cooler', description: 'Award-winning dual tower air cooler with exceptional thermal performance', price: 8999, category: 'Cooling', brand: 'Noctua', stock: 35, rating: 4.9, numReviews: 892, tags: ['air cooling', 'quiet'], specs: new Map([['Type', 'Air Cooler'], ['TDP', '250W'], ['Fans', '2x 140mm NF-A15'], ['Height', '165mm']]) },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin
    const adminPass = await bcrypt.hash('admin123', 12);
    const userPass = await bcrypt.hash('user123', 12);
    await User.create([
      { name: 'Admin User', email: 'admin@nexustech.com', password: adminPass, role: 'admin' },
      { name: 'Test User', email: 'user@nexustech.com', password: userPass, role: 'user' },
    ]);

    await Product.insertMany(products);
    console.log('✅ Seed complete! Admin: admin@nexustech.com / admin123 | User: user@nexustech.com / user123');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    mongoose.disconnect();
  }
};

seed();
