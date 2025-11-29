# Design Guidelines: Arabic E-Commerce Platform

## Design Approach

**Reference-Based Approach**: Drawing inspiration from leading e-commerce platforms (Shopify, Noon, Namshi) with Arabic-first design principles. Focus on product-centric visual hierarchy, trust-building elements, and seamless shopping experience optimized for RTL layout.

## RTL (Right-to-Left) Design Principles

**Critical Implementation**:
- All layouts mirror horizontally - navigation starts from right, content flows right-to-left
- Text alignment: right-aligned by default for all Arabic content
- Icons and arrows: flip directionally (chevron-left becomes chevron-right)
- Form labels: positioned to the right of inputs
- Shopping cart icon: top-right corner
- Product image galleries: navigate right-to-left
- Breadcrumbs: Home > Category > Product flows right-to-left with appropriate separators

## Typography System

**Arabic Font Stack**:
- Primary: Cairo or Tajawal (Google Fonts) for clean, modern Arabic readability
- Headings: Bold (700) for product names and section titles
- Body: Regular (400) for descriptions, Normal (500) for labels
- Sizes: h1 (2.5rem), h2 (2rem), h3 (1.5rem), body (1rem), small (0.875rem)

## Layout System

**Spacing**: Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-24
- Card gaps: gap-6 for desktop, gap-4 for mobile

## Storefront Components

### Home Page
**Hero Section**: Full-width banner (h-96 on desktop, h-64 mobile) with large lifestyle product image, overlay text with blurred-background button, seasonal promotion messaging

**Product Grid**: 
- Desktop: 4 columns (grid-cols-4)
- Tablet: 3 columns (md:grid-cols-3)
- Mobile: 2 columns (grid-cols-2)
- Product cards: Image (square aspect ratio), title, price, discount badge (if applicable), quick-add-to-cart button

**Category Navigation**: Horizontal scrollable category chips with icons, prominent placement below hero

**Featured Sections**: Best sellers, new arrivals, special offers - each with 4-column grid

### Product Details Page
**Layout**: Two-column desktop (lg:grid-cols-2), stacked mobile
- Right column: Image gallery with main image + thumbnail strip (4-5 thumbnails)
- Left column: Product title (h1), price (large, bold), rating stars, stock status, description, quantity selector, add-to-cart button (prominent, w-full), product specifications table

### Cart Page
**Layout**: Two-column desktop (2/3 and 1/3 split)
- Main area: Cart items list with product thumbnail, name, price, quantity controls, remove button
- Sidebar: Order summary card (sticky), subtotal, shipping, total, checkout button

### Checkout
**Multi-step**: Progress indicator at top, single-column form layout (max-w-2xl centered), sections for shipping info, payment method (placeholder), order review

## Admin Panel Components

### Admin Layout
**Sidebar Navigation**: Fixed right sidebar (RTL), width w-64, logo at top, menu items with icons, logout at bottom, active state highlighting

**Main Content Area**: Left-aligned content with mr-64 margin, breadcrumb navigation, page title with action button (e.g., "Add Product")

### Dashboard
**Stats Cards**: 4-column grid (grid-cols-4) showing total products, categories, orders, revenue - each card with icon, number (large), label, trend indicator

**Recent Orders Table**: Full-width table with columns: Order ID, Customer, Date, Total, Status badge, Actions

### Product Management
**Product List**: Table view with thumbnail, name, category, price, stock, status toggle, edit/delete actions

**Add/Edit Product Form**: Single-column layout (max-w-3xl), sections for basic info, pricing, images (drag-drop upload zone supporting multiple images), category dropdown, description textarea (h-32)

### Order Management
**Order List**: Table with order number, customer name, date, total, status dropdown, view details button

**Order Details**: Two-column layout - order items list with product details, customer info sidebar with shipping address

## Images

**Hero Image**: Large lifestyle banner (1920x800px) showing products in use, warm and inviting setting, professional photography style

**Product Images**: Square format (800x800px minimum), clean white backgrounds for main images, lifestyle shots for additional angles

**Category Images**: Rectangular banners (600x300px) representing each category visually

**Placeholder Strategy**: Use product-specific placeholders with subtle Arabic text indicating "صورة المنتج" (Product Image)

## Component Patterns

**Buttons**: Rounded corners (rounded-lg), padding px-6 py-3, medium weight text, primary actions full-width on mobile

**Cards**: Subtle border, rounded-xl, padding p-6, hover state with subtle shadow elevation

**Forms**: Input fields with right-aligned labels, rounded-md borders, focus states, helper text below inputs

**Navigation**: Clean horizontal menu for storefront, vertical sidebar for admin, hamburger menu for mobile

**Badges**: Small rounded pills for status (order status, stock status), discount percentages

**Tables**: Alternating row backgrounds for readability, sticky headers, action buttons right-aligned in RTL

## Responsive Breakpoints

- Mobile: < 768px (single column, stacked layouts)
- Tablet: 768px - 1024px (2-3 columns)
- Desktop: > 1024px (full multi-column layouts)

## Accessibility

- Clear focus states on all interactive elements
- Sufficient contrast for text readability
- Screen reader friendly Arabic labels
- Keyboard navigation support
- Touch targets minimum 44x44px for mobile