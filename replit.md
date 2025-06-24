# E-Commerce Platform - Gujrati Dhandha

## Overview

This is a full-stack e-commerce platform built with a modern web architecture. The application provides a marketplace where users can browse products, manage shopping carts, place orders, and sellers can manage their inventory. The platform features a React frontend with Express.js backend, PostgreSQL database, and comprehensive UI components.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: express-session with PostgreSQL store
- **API Design**: RESTful endpoints with structured error handling

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend server
├── shared/          # Shared types and schemas
├── migrations/      # Database migration files
└── dist/           # Production build output
```

## Key Components

### Database Schema
The application uses a relational database with the following main entities:
- **Users**: User accounts with authentication and seller status
- **Products**: Product catalog with pricing, inventory, and metadata
- **Cart Items**: Shopping cart management
- **Orders**: Order processing and tracking
- **Reviews**: Product review system (referenced but not fully implemented)
- **Donations**: Charitable donation feature (referenced but not fully implemented)

### Authentication System
- Session-based authentication with secure cookie management
- User registration and login endpoints
- Role-based access (buyers vs sellers)
- Protected routes and API endpoints

### Product Management
- Product CRUD operations for sellers
- Category-based filtering and search
- Inventory tracking with stock management
- Product variants and pricing options
- Rating and review system integration

### Shopping Cart & Orders
- Persistent cart storage in database
- Real-time cart updates with optimistic UI
- Order creation and status tracking
- Address and payment method collection

### UI/UX Features
- Responsive design with mobile-first approach
- Dark/light/cool theme switching
- Toast notifications for user feedback
- Loading states and error handling
- Accessible components using Radix UI

## Data Flow

1. **User Authentication**: Users register/login through the auth system, establishing a session
2. **Product Discovery**: Users browse products with filtering and search capabilities
3. **Cart Management**: Items are added to persistent cart with real-time updates
4. **Order Processing**: Cart items are converted to orders with shipping/payment details
5. **Seller Dashboard**: Sellers manage their product inventory and view sales data

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Hook Form)
- UI components (Radix UI primitives, Lucide icons)
- Styling (Tailwind CSS, class-variance-authority)
- State management (TanStack Query)
- Utilities (date-fns, clsx, cmdk)

### Backend Dependencies
- Express.js with middleware
- Drizzle ORM with PostgreSQL adapter
- Session management (express-session, connect-pg-simple)
- Development tools (tsx, esbuild)

### Database
- PostgreSQL (Neon serverless in production)
- Connection pooling for performance
- Migration system for schema management

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- tsx for TypeScript execution in development
- Concurrent frontend/backend development

### Production Build
- Vite builds optimized frontend bundle
- esbuild compiles backend TypeScript to JavaScript
- Static assets served from Express server
- Database migrations applied via Drizzle

### Hosting Configuration
- Configured for Replit deployment platform
- Auto-scaling deployment target
- Environment variable configuration for database
- Port 5000 for application server

## Changelog

- June 23, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.