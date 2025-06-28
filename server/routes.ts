import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import cors from "cors";
import { storage } from "./storage";
import { insertUserSchema, insertProductSchema, insertCartItemSchema, insertOrderSchema, insertReviewSchema, insertDonationSchema } from "@shared/schema";
import { 
  setupSecurity, 
  sessionConfig, 
  requireAuth, 
  requireSeller,
  hashPassword,
  verifyPassword,
  loginSchema,
  registerSchema,
  sanitizeInput
} from "./auth";
import { errorHandler, validateBody, corsOptions } from "./middleware";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Security setup
  setupSecurity(app);
  app.use(cors(corsOptions));
  app.use(session(sessionConfig));
  
  // Auth routes
  app.post("/api/auth/register", validateBody(registerSchema), async (req, res, next) => {
    try {
      const userData = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        fullName: sanitizeInput(userData.fullName),
        username: sanitizeInput(userData.username),
      });
      
      // Set session
      (req as any).session.userId = user.id;
      (req as any).session.isSeller = user.isSeller;
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/login", validateBody(loginSchema), async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      (req as any).session.userId = user.id;
      (req as any).session.isSeller = user.isSeller;
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    (req as any).session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie('sessionId');
      res.json({ message: "Logged out successfully" });
    });
  });

  // Product routes
  app.get("/api/products", async (req, res, next) => {
    try {
      const { category, priceMin, priceMax, rating, search } = req.query;
      
      const filters = {
        category: category ? sanitizeInput(category as string) : undefined,
        priceMin: priceMin ? parseFloat(priceMin as string) : undefined,
        priceMax: priceMax ? parseFloat(priceMax as string) : undefined,
        rating: rating ? parseFloat(rating as string) : undefined,
        search: search ? sanitizeInput(search as string) : undefined,
      };

      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/products", requireAuth, requireSeller, validateBody(insertProductSchema), async (req, res, next) => {
    try {
      const productData = {
        ...req.body,
        sellerId: (req as any).session.userId,
        name: sanitizeInput(req.body.name),
        description: sanitizeInput(req.body.description),
      };
      
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/products/:id", requireAuth, requireSeller, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      // Verify ownership
      const existingProduct = await storage.getProduct(id);
      if (!existingProduct || existingProduct.sellerId !== (req as any).session.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updates = {
        ...req.body,
        name: req.body.name ? sanitizeInput(req.body.name) : undefined,
        description: req.body.description ? sanitizeInput(req.body.description) : undefined,
      };
      
      const product = await storage.updateProduct(id, updates);
      res.json(product);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/products/:id", requireAuth, requireSeller, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      // Verify ownership
      const existingProduct = await storage.getProduct(id);
      if (!existingProduct || existingProduct.sellerId !== (req as any).session.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/seller/:sellerId/products", requireAuth, async (req, res, next) => {
    try {
      const sellerId = parseInt(req.params.sellerId);
      if (isNaN(sellerId)) {
        return res.status(400).json({ message: "Invalid seller ID" });
      }
      
      // Users can only access their own products
      if (sellerId !== (req as any).session.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const products = await storage.getProductsBySeller(sellerId);
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  // Cart routes
  app.get("/api/cart/:userId", requireAuth, async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Users can only access their own cart
      if (userId !== (req as any).session.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/cart", requireAuth, validateBody(insertCartItemSchema), async (req, res, next) => {
    try {
      const cartItemData = {
        ...req.body,
        userId: (req as any).session.userId, // Force user ID from session
      };
      
      const cartItem = await storage.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error) {
      next(error);
    }
  });

  // Add similar security fixes for other routes...
  // (cart update/delete, orders, reviews, donations)

  // Error handling middleware (must be last)
  app.use(errorHandler);

  const httpServer = createServer(app);
  return httpServer;
}