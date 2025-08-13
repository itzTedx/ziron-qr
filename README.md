# Ziron QR - Digital Business Card Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.4.1+-orange.svg)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Turbo](https://img.shields.io/badge/Turbo-2.4.2+-purple.svg)](https://turbo.build/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-0.44+-green.svg)](https://orm.drizzle.team/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.2+-blue.svg)](https://better-auth.com/)

A modern, full-stack platform for creating and managing digital business cards with QR code functionality. Built with Next.js, TypeScript, and a monorepo architecture.

## 🚀 Features

### Core Functionality
- **Digital Business Cards**: Create personalized digital business cards with rich content
- **QR Code Generation**: Automatically generate QR codes for each card
- **Multi-Company Support**: Manage multiple companies and their associated cards
- **Customizable Templates**: Multiple card templates (Default, Modern, Card)
- **Real-time Preview**: Live preview of card designs during creation
- **Contact Management**: Add multiple phone numbers, emails, and social links
- **File Attachments**: Support for profile images, cover photos, and document attachments

### Technical Features
- **Authentication**: Secure user authentication with Better Auth
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Caching**: Redis for session management and caching
- **UI Components**: Modern UI built with shadcn/ui and Tailwind CSS
- **Responsive Design**: Mobile-first responsive design
- **Dark Mode**: Full dark/light theme support
- **Real-time Updates**: Live form validation and updates

## 🏗️ Architecture

This project uses a monorepo structure with the following components:

### Apps
- **`apps/portal`** - Main admin dashboard (Next.js 15, port 3000)
- **`apps/client`** - Public-facing card viewer (Next.js 15, port 3001)

### Packages
- **`@ziron/ui`** - Shared UI components and design system
- **`@ziron/db`** - Database schema and client (Drizzle ORM)
- **`@ziron/auth`** - Authentication system (Better Auth)
- **`@ziron/redis`** - Redis client and utilities
- **`@ziron/utils`** - Shared utility functions
- **`@ziron/validators`** - Zod validation schemas
- **`@ziron/docker`** - Docker configuration for local development

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react&logoColor=black&style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)

### Backend & Database
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17+-336791?logo=postgresql&logoColor=white&style=for-the-badge)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.44+-green?logo=drizzle&logoColor=white&style=for-the-badge)
![Redis](https://img.shields.io/badge/Redis-7.2+-DC382D?logo=redis&logoColor=white&style=for-the-badge)
![Better Auth](https://img.shields.io/badge/Better_Auth-1.2+-blue?logo=better-auth&logoColor=white&style=for-the-badge)

### Development Tools
![Turbo](https://img.shields.io/badge/Turbo-2.4.2+-purple?logo=turbo&logoColor=white&style=for-the-badge)
![pnpm](https://img.shields.io/badge/pnpm-10.4.1+-orange?logo=pnpm&logoColor=white&style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED?logo=docker&logoColor=white&style=for-the-badge)
![ESLint](https://img.shields.io/badge/ESLint-✓-4B32C3?logo=eslint&logoColor=white&style=for-the-badge)

### UI & Components
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-✓-000000?logo=shadcn&logoColor=white&style=for-the-badge)
![Radix UI](https://img.shields.io/badge/Radix_UI-✓-161618?logo=radix-ui&logoColor=white&style=for-the-badge)
![Lucide React](https://img.shields.io/badge/Lucide_React-✓-000000?logo=lucide&logoColor=white&style=for-the-badge)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-✓-EC5990?logo=react-hook-form&logoColor=white&style=for-the-badge)

### Key Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.7
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with 2FA support
- **Caching**: Redis for session management
- **UI Library**: shadcn/ui with Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks, nuqs for URL state
- **Build Tool**: Turbo for monorepo management
- **Package Manager**: pnpm
- **Deployment**: Docker support included

## 📦 Installation

### Prerequisites
- Node.js >= 20
- pnpm >= 10.4.1
- PostgreSQL
- Redis

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

   # Auth
   AUTH_SECRET=your_auth_secret_here
   AUTH_BASE_URL=http://localhost:3000
   AUTH_PRODUCTION_URL=https://your-domain.com

   # App URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_CLIENT_URL=http://localhost:3001
   ```

4. **Database Setup**
   ```bash
   # Start PostgreSQL and Redis (using Docker)
   pnpm -F @ziron/docker up -d

   # Generate database migrations
   pnpm db:generate

   # Run migrations
   pnpm db:migrate
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
pnpm ui-add
```

This will add components to the `packages/ui/src/components` directory.

### Database Operations
```bash
# Generate new migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm -F @ziron/db studio
```

### Development Commands
```bash
# Build all packages
pnpm build

# Run linting
pnpm lint

# Format code
pnpm format:fix

# Type checking
pnpm typecheck
```

## 📁 Project Structure

```
ziron-qr/
├── apps/
│   ├── portal/          # Admin dashboard
│   │   ├── src/
│   │   │   ├── app/     # Next.js app router
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   └── lib/
│   │   └── package.json
│   └── client/          # Public card viewer
│       ├── src/
│       └── package.json
├── packages/
│   ├── ui/              # Shared UI components
│   ├── db/              # Database schema & client
│   ├── auth/            # Authentication
│   ├── redis/           # Redis utilities
│   ├── utils/           # Shared utilities
│   ├── validators/      # Zod schemas
│   └── docker/          # Docker configuration
├── tooling/             # Development tools
├── turbo.json           # Turbo configuration
├── package.json         # Root package.json
└── README.md
```

## 🔧 Configuration

### Database Schema
The application uses the following main entities:
- **Users**: Authentication and user management
- **Companies**: Organization management
- **Cards**: Digital business cards
- **Card Styles**: Customization and theming
- **Contacts**: Phone numbers, emails, and social links

### Authentication
The platform uses Better Auth with:
- Email/password authentication
- Two-factor authentication
- Email OTP verification
- Role-based access control (user, admin, dev)

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
cd packages/docker
docker-compose up -d
```

### Environment Variables
Ensure all required environment variables are set for production:
- Database connection strings
- Redis configuration
- Authentication secrets
- App URLs and domains

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
