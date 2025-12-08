# Ziron QR - Digital Business Card Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.23.0-orange.svg)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB.svg)](https://react.dev/)
[![Turbo](https://img.shields.io/badge/Turbo-2.6.1-purple.svg)](https://turbo.build/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-0.44.2-green.svg)](https://orm.drizzle.team/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.4.4-blue.svg)](https://better-auth.com/)

A modern, full-stack platform for creating and managing digital business cards with QR code functionality. Built with Next.js 16, React 19, TypeScript, and a monorepo architecture.

## 📖 About

Ziron QR is a comprehensive digital business card platform that transforms how professionals share their contact information. Instead of traditional paper cards that get lost or forgotten, users can create beautiful, interactive digital cards that are always accessible and shareable.

**What makes it special:**
- **Always Up-to-Date**: Update your contact information instantly without reprinting cards
- **Rich & Interactive**: Include photos, social media links, documents, and more than just basic contact details
- **Easy Sharing**: Generate unique QR codes for each card, making it effortless to share your information
- **Track Engagement**: See who viewed your card and how they interacted with it
- **Multiple Organizations**: Manage cards for different companies or roles from one account
- **Professional Appearance**: Customize your card's look with themes, colors, and layouts that match your brand

Whether you're networking at events, sharing contact details online, or building your professional presence, Ziron QR makes it simple to create, manage, and share digital business cards that leave a lasting impression.

## 🚀 Features

### Core Functionality
- **Digital Business Cards**: Create personalized digital business cards with rich content
- **QR Code Generation**: Automatically generate QR codes for each card
- **Organization Management**: Manage multiple organizations and their associated cards
- **Customizable Appearance**: Customize card templates with themes, colors, and dark mode
- **Real-time Preview**: Live preview of card designs during creation
- **Contact Management**: Add multiple phone numbers, emails, and social links
- **File Attachments**: Support for profile images, cover photos, and document attachments
- **Card Analytics**: Track page visits, events, and user interactions
- **Card Export**: Export cards to CSV format
- **Card Duplication**: Clone existing cards for quick creation

### Technical Features
- **Authentication**: Secure user authentication with Better Auth (email/password, 2FA, email OTP)
- **API Layer**: Type-safe API routes using ORPC with OpenAPI documentation
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Caching**: Redis for session management and caching
- **UI Components**: Modern UI built with shadcn/ui and Tailwind CSS 4.0
- **Responsive Design**: Mobile-first responsive design
- **Dark Mode**: Full dark/light theme support with next-themes
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Query (TanStack Query) for server state, Jotai for client state
- **Workspace Preferences**: User workspace settings for view modes and sorting
- **Avatar Generation**: Dynamic avatar generation with gradients
- **File Upload**: Better Upload integration for S3 storage

## 🏗️ Architecture

This project uses a monorepo structure with the following components:

### Apps
- **`apps/portal`** - Main admin dashboard (Next.js 16, port 3000)
  - Card management and creation
  - Organization management
  - Analytics dashboard
  - Workspace settings
- **`apps/client`** - Public-facing card viewer (Next.js 16, port 3001)
  - Public card display
  - QR code scanning and viewing

### Packages
- **`@ziron/api`** - Type-safe API layer using ORPC
  - Card router (CRUD operations, export, duplication)
  - Organization router
  - Analytics router (events, page visits)
  - QR code generation
  - Avatar generation
  - Metrics endpoint
  - Workspace preferences
- **`@ziron/ui`** - Shared UI components and design system
  - shadcn/ui components
  - Card templates
  - Form components
  - Layout components
- **`@ziron/db`** - Database schema and client (Drizzle ORM)
  - Schema definitions (users, organizations, cards, analytics, workspace)
  - Database migrations
  - Type-safe queries
- **`@ziron/auth`** - Authentication system (Better Auth)
  - Email/password authentication
  - Two-factor authentication
  - Email OTP verification
  - Session management with Redis
- **`@ziron/redis`** - Redis client and utilities
- **`@ziron/utils`** - Shared utility functions
  - Date formatting
  - Text utilities (slugify, truncate, etc.)
  - Image utilities
- **`@ziron/validators`** - Zod validation schemas
  - Auth validators
  - Card validators
  - Organization validators
  - Workspace validators
- **`@ziron/docker`** - Docker configuration for local development

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=black&style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?logo=next.js&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.8-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)

### Backend & Database
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17+-336791?logo=postgresql&logoColor=white&style=for-the-badge)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.44.2-green?logo=drizzle&logoColor=white&style=for-the-badge)
![Redis](https://img.shields.io/badge/Redis-7.2+-DC382D?logo=redis&logoColor=white&style=for-the-badge)
![Better Auth](https://img.shields.io/badge/Better_Auth-1.4.4-blue?logo=better-auth&logoColor=white&style=for-the-badge)
![ORPC](https://img.shields.io/badge/ORPC-1.12.0-purple?logo=typescript&logoColor=white&style=for-the-badge)

### Development Tools
![Turbo](https://img.shields.io/badge/Turbo-2.6.1-purple?logo=turbo&logoColor=white&style=for-the-badge)
![pnpm](https://img.shields.io/badge/pnpm-10.23.0-orange?logo=pnpm&logoColor=white&style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED?logo=docker&logoColor=white&style=for-the-badge)
![Biome](https://img.shields.io/badge/Biome-2.3.6-FF6B6B?logo=biome&logoColor=white&style=for-the-badge)

### UI & Components
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-✓-000000?logo=shadcn&logoColor=white&style=for-the-badge)
![Radix UI](https://img.shields.io/badge/Radix_UI-✓-161618?logo=radix-ui&logoColor=white&style=for-the-badge)
![Lucide React](https://img.shields.io/badge/Lucide_React-✓-000000?logo=lucide&logoColor=white&style=for-the-badge)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.60.0-EC5990?logo=react-hook-form&logoColor=white&style=for-the-badge)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.90.11-FF4154?logo=react-query&logoColor=white&style=for-the-badge)

### Key Technologies
- **Framework**: Next.js 16 with App Router, React Compiler enabled
- **Language**: TypeScript 5.7.3
- **Database**: PostgreSQL with Drizzle ORM 0.44.2
- **API**: ORPC for type-safe RPC with OpenAPI documentation
- **Authentication**: Better Auth 1.4.4 with 2FA, email OTP, and role-based access
- **Caching**: Redis for session management and secondary storage
- **UI Library**: shadcn/ui with Tailwind CSS 4.0.8
- **Forms**: React Hook Form 7.60.0 with Zod 4.1.12 validation
- **State Management**: TanStack Query 5.90.11 for server state, Jotai for client state, nuqs for URL state
- **Build Tool**: Turbo 2.6.1 for monorepo management
- **Package Manager**: pnpm 10.23.0 with workspace protocol
- **Code Quality**: Biome 2.3.6 for linting and formatting
- **File Upload**: Better Upload 3.0.4 with S3 integration
- **Deployment**: Docker support included

## 📦 Installation

### Prerequisites
- Node.js >= 20
- pnpm >= 10.23.0
- PostgreSQL (17+ recommended)
- Redis (7.2+ recommended)
- AWS S3 bucket (for file storage) - optional for local development

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ziron-qr
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=ziron_qr
   DATABASE_URL=postgresql://user:password@localhost:5432/ziron_qr

   # Redis
   REDIS_URL=redis://localhost:6379
   REDIS_PORT=6379
   REDIS_HOST=localhost
   REDIS_PASSWORD=

   # Auth
   BETTER_AUTH_SECRET=your_auth_secret_here
   BETTER_AUTH_URL=http://localhost:3000
   PRODUCTION_URL=https://your-domain.com

   # App URLs
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_CLIENT_URL=http://localhost:3001

   # AWS S3 (for file uploads)
   AWS_BUCKET_NAME=your-bucket-name
   AWS_BUCKET_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key

   # Optional: Unsplash (for image search)
   UNSPLASH_ACCESS_KEY=your-unsplash-key
   ```

4. **Database Setup**
   ```bash
   # Start PostgreSQL and Redis (using Docker)
   cd packages/docker
   docker-compose up -d

   # Generate database migrations (after schema changes)
   pnpm db:generate

   # Run migrations
   pnpm db:migrate

   # Or use push for development (not recommended for production)
   pnpm -F @ziron/db push
   ```

5. **Start Development Servers**
   ```bash
   # Start all services
   pnpm dev

   # Or start individual services
   pnpm -F portal dev    # Admin dashboard (port 3000)
   pnpm -F client dev    # Public viewer (port 3001)
   ```

## 🎯 Usage

### Adding UI Components
To add new shadcn/ui components to the project:

```bash
pnpm ui:add [component-name]
```

This will add components to the `packages/ui/src/components` directory using the shadcn CLI.

### Database Operations
```bash
# Generate new migrations (after schema changes)
pnpm db:generate

# Run migrations
pnpm db:migrate

# Push schema changes directly (development only)
pnpm -F @ziron/db push

# Open Drizzle Studio (database GUI)
pnpm -F @ziron/db studio
```

### Development Commands
```bash
# Build all packages
pnpm build

# Run linting (Biome)
pnpm lint

# Format code (Biome)
pnpm format:fix

# Type checking
pnpm typecheck

# Start individual apps
pnpm dev:portal    # Portal app (port 3000)
pnpm dev:client    # Client app (port 3001)
```

## 📁 Project Structure

```
ziron-qr/
├── apps/
│   ├── portal/                    # Admin dashboard (port 3000)
│   │   ├── src/
│   │   │   ├── app/               # Next.js app router
│   │   │   │   ├── (root)/        # Main routes
│   │   │   │   │   ├── (digital-card)/  # Card management routes
│   │   │   │   │   ├── organization/    # Organization routes
│   │   │   │   │   └── analytics/        # Analytics routes
│   │   │   │   └── api/           # API routes (auth, rpc)
│   │   │   ├── components/        # Portal-specific components
│   │   │   ├── features/          # Feature modules (auth, card, organization)
│   │   │   └── lib/               # Utilities and configs
│   │   ├── next.config.ts
│   │   └── package.json
│   └── client/                     # Public card viewer (port 3001)
│       ├── src/
│       │   ├── app/               # Next.js app router
│       │   └── lib/
│       ├── next.config.ts
│       └── package.json
├── packages/
│   ├── api/                       # Type-safe API layer (ORPC)
│   │   ├── src/
│   │   │   ├── routers/           # API route handlers
│   │   │   └── middleware/        # Auth, DB providers
│   │   └── package.json
│   ├── ui/                        # Shared UI components
│   │   ├── src/
│   │   │   ├── components/        # shadcn/ui components
│   │   │   ├── templates/         # Card templates
│   │   │   └── assets/            # Icons and assets
│   │   └── package.json
│   ├── db/                        # Database schema & client
│   │   ├── src/
│   │   │   ├── schema/            # Drizzle schema definitions
│   │   │   ├── migrations/        # Database migrations
│   │   │   └── client.ts          # Database client
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   ├── auth/                      # Authentication (Better Auth)
│   │   ├── src/
│   │   │   └── index.ts           # Auth configuration
│   │   └── package.json
│   ├── redis/                     # Redis client
│   ├── utils/                     # Shared utilities
│   ├── validators/                # Zod validation schemas
│   └── docker/                    # Docker configuration
├── tooling/                       # Development tools
│   ├── biome/                     # Biome configuration
│   └── typescript-config/         # TypeScript configs
├── turbo.json                     # Turbo configuration
├── pnpm-workspace.yaml            # pnpm workspace config
├── package.json                   # Root package.json
└── README.md
```

## 🔧 Configuration

### Database Schema
The application uses the following main entities:
- **Users**: Authentication and user management with roles (user, admin, dev)
- **Organizations**: Organization/company management (renamed from companies)
- **Cards**: Digital business cards with soft delete and archive support
- **Card Appearance**: Customization and theming (template, colors, dark mode)
- **Contacts**: Phone numbers, emails, and social links (linked to cards)
- **Analytics**: Events and page visits tracking
- **Workspace**: User workspace preferences (view mode, sorting, filters)
- **Sessions**: User session management
- **Accounts**: OAuth and password accounts
- **Two Factors**: 2FA secrets and backup codes

### Authentication
The platform uses Better Auth 1.4.4 with:
- Email/password authentication
- Two-factor authentication (2FA)
- Email OTP verification
- Role-based access control (user, admin, dev)
- Session management with Redis secondary storage
- Rate limiting (100 requests per 60 seconds)
- Cookie-based session caching (5 minutes)

### API Architecture
The application uses ORPC (Object RPC) for type-safe API routes:
- **Type-safe RPC**: End-to-end type safety from client to server
- **OpenAPI Documentation**: Auto-generated API docs at `/api/rpc/docs`
- **Zod Validation**: Request/response validation with Zod schemas
- **Error Handling**: Structured error responses with proper HTTP status codes

Available API endpoints:
- `/api/rpc/card/*` - Card CRUD operations, export, duplication
- `/api/rpc/organization/*` - Organization management
- `/api/rpc/analytics/*` - Analytics and tracking
- `/api/rpc/qr/*` - QR code generation
- `/api/rpc/avatar/*` - Avatar generation
- `/api/rpc/metrics` - System metrics
- `/api/rpc/workspace/*` - Workspace preferences

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
cd packages/docker
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379

### Environment Variables
Ensure all required environment variables are set for production:
- **Database**: `DATABASE_URL`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- **Redis**: `REDIS_URL`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- **Authentication**: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `PRODUCTION_URL`
- **App URLs**: `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_CLIENT_URL`
- **AWS S3**: `AWS_BUCKET_NAME`, `AWS_BUCKET_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- **Optional**: `UNSPLASH_ACCESS_KEY` for image search

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is private and proprietary.

## 🆘 Support

For support and questions, please contact the development team.

---

**Built with ❤️ by Ziron Media**
