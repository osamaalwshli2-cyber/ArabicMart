import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { setupAdminAuth, isAdminAuthenticated } from "./adminAuth";
import { insertCategorySchema, insertProductSchema, insertOrderSchema, insertOrderItemSchema, customerLoginSchema, customerRegisterSchema } from "@shared/schema";
import { z } from "zod";
import crypto from "crypto";

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "salt").digest("hex");
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Admin auth setup
  setupAdminAuth(app);

  // ==================== CATEGORY ROUTES ====================
  
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get single category
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Create category (admin only)
  app.post("/api/categories", isAdminAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Update category (admin only)
  app.patch("/api/categories/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, validatedData);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  // Delete category (admin only)
  app.delete("/api/categories/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // ==================== PRODUCT ROUTES ====================

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create product (admin only)
  app.post("/api/products", isAdminAuthenticated, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Update product (admin only)
  app.patch("/api/products/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Delete product (admin only)
  app.delete("/api/products/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // ==================== CUSTOMER ROUTES ====================

  // Get all customers (admin only)
  app.get("/api/customers", isAdminAuthenticated, async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  // Get customer by email (for customers)
  app.get("/api/customers/by-email", async (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const customer = await storage.getCustomerByEmail(email);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  // Customer login
  app.post("/api/customers/login", async (req, res) => {
    try {
      const { email, password } = customerLoginSchema.parse(req.body);
      const customer = await storage.getCustomerByEmail(email);

      if (!customer || !customer.password || customer.password !== hashPassword(password)) {
        return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      }

      const token = generateToken();
      res.json({
        token,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error logging in customer:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Customer register
  app.post("/api/customers/register", async (req, res) => {
    try {
      const { name, email, password } = customerRegisterSchema.parse(req.body);

      // Check if customer already exists
      const existingCustomer = await storage.getCustomerByEmail(email);
      if (existingCustomer) {
        return res.status(409).json({ message: "هذا البريد الإلكتروني مسجل بالفعل" });
      }

      // Create new customer
      const customer = await storage.createCustomer({
        name,
        email,
        password: hashPassword(password),
      });

      const token = generateToken();
      res.status(201).json({
        token,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error registering customer:", error);
      res.status(500).json({ message: "Failed to register" });
    }
  });

  // ==================== ORDER ROUTES ====================

  // Get all orders (admin only)
  app.get("/api/orders", isAdminAuthenticated, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get single order by ID (admin only)
  app.get("/api/orders/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Get order by order number (for customers)
  app.get("/api/orders/number/:orderNumber", async (req, res) => {
    try {
      const order = await storage.getOrderByNumber(req.params.orderNumber);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Get orders by customer email (for customers)
  app.get("/api/orders/by-email", async (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const orders = await storage.getOrdersByEmail(email);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders by email:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Create order (public - for checkout)
  app.post("/api/orders", async (req, res) => {
    try {
      const { items, customerId, ...orderData } = req.body;

      // Use provided customerId or lookup by email
      let customer;
      if (customerId) {
        customer = await storage.getCustomer(customerId);
      } else {
        customer = await storage.getCustomerByEmail(orderData.customerEmail);
      }

      // If customer still doesn't exist, create one
      if (!customer) {
        customer = await storage.createCustomer({
          name: orderData.customerName,
          email: orderData.customerEmail,
          phone: orderData.customerPhone || null,
          address: orderData.shippingAddress,
          city: orderData.shippingCity || null,
        });
      }

      // Create order
      const orderNumber = generateOrderNumber();
      const newOrder = await storage.createOrder(
        {
          orderNumber,
          customerId: customer.id,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone || null,
          shippingAddress: orderData.shippingAddress,
          shippingCity: orderData.shippingCity || null,
          subtotal: orderData.subtotal,
          shippingCost: orderData.shippingCost || "0",
          total: orderData.total,
          status: "pending",
          paymentMethod: orderData.paymentMethod || "cod",
          notes: orderData.notes || null,
        },
        items.map((item: any) => ({
          productId: item.productId,
          productNameAr: item.productNameAr,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        }))
      );

      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Update order status (admin only)
  app.patch("/api/orders/:id/status", isAdminAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  return httpServer;
}
