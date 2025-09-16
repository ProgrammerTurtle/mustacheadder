# Overview

Stache Stash is a photo editing web application that allows users to add various mustache styles to photos using automated face detection. The app provides a vintage-themed interface where users can upload photos, select from different mustache styles (Classic, Handlebar, Victorian, Walrus), and automatically position mustaches on detected faces. Users can then download their edited photos with the applied mustaches.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Vite Build System**: Fast development server and optimized production builds
- **shadcn/ui Components**: Comprehensive UI component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system and theming
- **Wouter**: Lightweight client-side routing solution
- **TanStack Query**: Data fetching and state management for API interactions

## Design System
- **Vintage Theme**: Golden yellow primary color (#D4AF37) with neutral grays
- **Typography**: Mix of Playfair Display (serif) and Inter (sans-serif) fonts
- **Component Architecture**: Modular UI components with consistent styling patterns
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts

## Photo Processing Features
- **File Upload**: Drag-and-drop interface with image validation (JPG/PNG only)
- **Face Detection**: Integration with face-api.js for automatic face recognition
- **Canvas Manipulation**: HTML5 Canvas for image editing and mustache overlay
- **SVG Mustache Assets**: Vector graphics for scalable mustache styles
- **Image Export**: Download functionality with optimized file sizes

## Backend Architecture
- **Express.js Server**: RESTful API server with middleware for logging and error handling
- **TypeScript**: Full-stack type safety with shared schema definitions
- **Modular Storage Interface**: Abstracted storage layer supporting both in-memory and database implementations
- **Development Tools**: Hot reload with Vite integration in development mode

## Database Design
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect
- **User Schema**: Simple user table with username/password fields and UUID primary keys
- **Migration System**: Structured database schema management
- **Environment Configuration**: DATABASE_URL-based connection management

# External Dependencies

## Core Frameworks
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Express.js**: Backend web framework for API routes and middleware
- **Vite**: Build tool and development server with hot module replacement

## UI and Styling
- **Radix UI**: Headless component primitives for accessibility and behavior
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library with consistent styling
- **shadcn/ui**: Pre-built component library with customizable themes

## Image Processing
- **face-api.js**: Machine learning library for face detection and landmark recognition
- **HTML5 Canvas**: Native browser API for image manipulation and rendering
- **React Dropzone**: File upload component with drag-and-drop support

## Database and Storage
- **Drizzle ORM**: Type-safe ORM with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL client for database connections
- **Zod**: Runtime type validation for data schemas

## Development Tools
- **TypeScript**: Static type checking across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins
- **Replit Plugins**: Development environment integration and error handling