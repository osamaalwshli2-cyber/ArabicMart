# Overview

This is an Arabic-first e-commerce platform built with a modern full-stack architecture. The application provides a complete online shopping experience with both customer-facing storefront and admin dashboard capabilities. The platform is designed specifically for right-to-left (RTL) Arabic language support, featuring product browsing, shopping cart, checkout, and order management functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR (Hot Module Replacement)
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom theme configuration
- RTL (Right-to-Left) layout support configured at the HTML level (`dir="rtl"`)
- Cairo font family from Google Fonts for Arabic typography
- Custom design system with HSL-based color tokens for light/dark mode support

**State Management**
- React Context API for cart state management (CartContext)
- Local storage persistence for shopping cart data
- Query client for cached API responses with infinite stale time

**Routing Structure**
- Customer routes: Home (`/`), Product Details (`/product/:id`), Cart (`/cart`), Checkout (`/checkout`), Order Confirmation (`/order-confirmation/:orderNumber`)
- Admin routes: Dashboard (`/admin`), Products, Categories, Orders, Order Details, Customers
- Protected admin routes with authentication checks

## Backend Architecture

**Runtime & Framework**
- Node.js with Express.js REST API server
- TypeScript with ESNext modules for type safety
- HTTP server wrapper for potential WebSocket support

**API Design**
- RESTful API endpoints under `/api` prefix
- JSON request/response format
- Session-based authentication with Replit Auth
- Request logging middleware with timestamp and duration tracking

**Authentication & Authorization**
- OpenID Connect (OIDC) integration with Replit Auth
- Passport.js for authentication strategy management
- Express session middleware with PostgreSQL session store
- Session cookie configuration (HTTP-only, secure, 1-week TTL)
- Admin-only protected routes using `isAuthenticated` middleware

**Data Layer**
- Drizzle ORM for type-safe database queries
- Neon serverless PostgreSQL with WebSocket connections
- Schema-first approach with TypeScript types generated from Drizzle schemas
- Centralized storage interface pattern for data operations

## Database Schema

**Core Tables**
- `users`: Admin users with Replit Auth integration (UUID primary key, email, name, role)
- `categories`: Product categories with hierarchical support (parent_id), Arabic names/descriptions
- `products`: Products with Arabic metadata, pricing (decimal), images (JSONB array), stock tracking, featured flag
- `customers`: Customer records with contact information and addresses
- `orders`: Orders with customer references, status tracking, totals, shipping details
- `order_items`: Order line items linking orders to products with quantities and prices
- `sessions`: Express session storage for authentication persistence

**Data Relationships**
- Categories: Self-referential for parent-child hierarchy
- Products: Many-to-one with categories
- Orders: Many-to-one with customers
- Order Items: Many-to-one with both orders and products

**Key Fields**
- Timestamps: `createdAt`, `updatedAt` on most tables
- Soft deletes: `isActive` flags on categories
- Order tracking: Status enum (pending, processing, shipped, delivered, cancelled)
- Order numbers: Generated with timestamp + random suffix pattern (`ORD-{timestamp}-{random}`)

## External Dependencies

**Database**
- Neon Serverless PostgreSQL (required via `DATABASE_URL` environment variable)
- Connection pooling with `@neondatabase/serverless`
- WebSocket protocol for serverless connections

**Authentication**
- Replit Auth via OpenID Connect
- Session management with `connect-pg-simple` (PostgreSQL session store)
- Requires `ISSUER_URL`, `REPL_ID`, and `SESSION_SECRET` environment variables

**UI Libraries**
- Radix UI primitives (30+ headless components)
- Lucide React for iconography
- Tailwind CSS with PostCSS and Autoprefixer

**Development Tools**
- Replit-specific plugins: Cartographer, Dev Banner, Runtime Error Overlay
- ESBuild for production server bundling with allowlist for bundled dependencies
- TypeScript compiler for type checking

**Validation & Schema**
- Zod for runtime type validation
- `drizzle-zod` for generating Zod schemas from Drizzle tables
- Form validation with `@hookform/resolvers`

**Utilities**
- `date-fns` for date formatting
- `class-variance-authority` and `clsx` for conditional styling
- `nanoid` for unique ID generation