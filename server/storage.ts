import {
  users,
  products,
  cartItems,
  orders,
  reviews,
  donations,
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type Review,
  type InsertReview,
  type Donation,
  type InsertDonation,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(filters?: {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    search?: string;
  }): Promise<Product[]>;
  getProductsBySeller(sellerId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Cart operations
  getCartItems(userId: number): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;

  // Order operations
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Review operations
  getReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Donation operations
  getDonations(): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private reviews: Map<number, Review>;
  private donations: Map<number, Donation>;
  private currentUserId: number;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentOrderId: number;
  private currentReviewId: number;
  private currentDonationId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.reviews = new Map();
    this.donations = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;
    this.currentReviewId = 1;
    this.currentDonationId = 1;

    this.seedData();
  }

  private seedData() {
    // Seed some initial products
    const sampleProducts = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: "89.99",
        category: "Electronics",
        stock: 45,
        sellerId: 1,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e"],
        variants: ["Black", "White", "Blue"],
        shippingFee: "5.99",
        rating: "4.7",
        reviewCount: 523,
        salesCount: 1234,
        createdAt: new Date(),
      },
      {
        name: "Premium Cotton T-Shirt",
        description: "Soft, comfortable cotton t-shirt in various sizes",
        price: "24.99",
        category: "Fashion",
        stock: 120,
        sellerId: 1,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
        variants: ["S", "M", "L", "XL"],
        shippingFee: "3.99",
        rating: "4.2",
        reviewCount: 891,
        salesCount: 2156,
        createdAt: new Date(),
      },
      {
        name: "Latest Smartphone Pro",
        description: "Cutting-edge smartphone with advanced features",
        price: "699.99",
        category: "Electronics",
        stock: 25,
        sellerId: 1,
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"],
        variants: ["64GB", "128GB", "256GB"],
        shippingFee: "0",
        rating: "5.0",
        reviewCount: 1234,
        salesCount: 456,
        createdAt: new Date(),
      },
      {
        name: "Elegant Ceramic Vase",
        description: "Beautiful ceramic vase for home decoration",
        price: "39.99",
        category: "Home",
        stock: 30,
        sellerId: 1,
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7"],
        variants: ["White", "Blue", "Green"],
        shippingFee: "7.99",
        rating: "4.3",
        reviewCount: 267,
        salesCount: 789,
        createdAt: new Date(),
      },
    ];

    sampleProducts.forEach((product) => {
      const id = this.currentProductId++;
      this.products.set(id, { ...product, id } as Product);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProducts(filters?: {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    search?: string;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (filters) {
      if (filters.category && filters.category !== "All Categories") {
        products = products.filter(p => p.category === filters.category);
      }
      if (filters.priceMin !== undefined) {
        products = products.filter(p => parseFloat(p.price) >= filters.priceMin!);
      }
      if (filters.priceMax !== undefined) {
        products = products.filter(p => parseFloat(p.price) <= filters.priceMax!);
      }
      if (filters.rating !== undefined) {
        products = products.filter(p => parseFloat(p.rating || "0") >= filters.rating!);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }
    }

    return products;
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.sellerId === sellerId);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      ...insertProduct,
      id,
      rating: "0",
      reviewCount: 0,
      salesCount: 0,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Cart operations
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemId++;
    const item: CartItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
    };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const userItems = Array.from(this.cartItems.entries()).filter(([_, item]) => item.userId === userId);
    userItems.forEach(([id]) => this.cartItems.delete(id));
    return true;
  }

  // Order operations
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Review operations
  async getReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.productId === productId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    return review;
  }

  // Donation operations
  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values());
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = this.currentDonationId++;
    const donation: Donation = {
      ...insertDonation,
      id,
      createdAt: new Date(),
    };
    this.donations.set(id, donation);
    return donation;
  }
}

export const storage = new MemStorage();
