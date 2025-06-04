# Car Rental Service

A full-stack web application for car rental services with customer and admin interfaces.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Design](#database-design)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## Overview

This Car Rental Service is a comprehensive web application that allows customers to browse, search, and book cars for rent. The application includes both customer-facing features and an admin dashboard for managing cars, bookings, and users.

## Features

### Customer Features
- User authentication (sign up, sign in)
- Browse and search cars with filtering options
- View detailed car information with images
- Add cars to favorites
- Make bookings with date selection
- Online payment processing
- View booking history and status
- Write reviews for rented cars

### Admin Features
- Dashboard with analytics and statistics
- Car management (add, edit, delete)
- Booking management
- User management
- Category management
- Activity monitoring
- Transaction history

## Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Material UI
- **Routing**: React Router DOM v7
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: Material UI, React Icons, Framer Motion

### Backend
- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database ORM**: Prisma 6
- **Database**: PostgreSQL
- **Authentication**: JWT, Passport
- **API Documentation**: Swagger
- **Caching**: Redis
- **Job Queue**: BullMQ
- **Logging**: Winston
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer

### DevOps
- **Containerization**: Docker, Docker Compose
- **Version Control**: Git

## Architecture

### Frontend Architecture
The client application follows a component-based architecture with:
- Context providers for state management
- Route-based code organization
- Reusable UI components
- API service layer for backend communication
- Custom hooks for shared logic

### Backend Architecture
The server follows a modular architecture based on NestJS principles:
- Module-based organization (Auth, User, Car, Booking, etc.)
- Controller-Service-Repository pattern
- Guards for authentication and authorization
- Interceptors for response transformation
- Filters for exception handling
- Middleware for request processing
- DTOs for data validation and transformation

## Database Design

The application uses a PostgreSQL database with the following main entities:
- Users (customers and admins)
- Cars with images and categories
- Bookings
- Transactions
- Reviews
- Activities (system events)

The database schema is managed through Prisma and includes relationships such as:
- One-to-many: User to Bookings, Car to Bookings
- Many-to-many: Cars to Categories
- One-to-one: Booking to Review, User to DrivingLicense

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for development environment)

### Clone the Repository
```bash
git clone <repository-url>
cd WEB-APP-Car-Rental-Service
```

### Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

## Running the Application

### Development Mode

#### Start the Backend Services (PostgreSQL and Redis)
```bash
cd server
npm run docker:compose
```

#### Setup the Database
```bash
cd server
npm run db:migrate
npm run db:seed
```

#### Start the Backend Server
```bash
cd server
npm run start:dev
```

#### Start the Frontend Development Server
```bash
cd client
npm run dev
```

### Production Mode

#### Build and Start the Backend
```bash
cd server
npm run build
npm run start:prod
```

#### Build and Start the Frontend
```bash
cd client
npm run build
npm run preview
```

## Environment Variables

### Backend (.env)
```
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
DATABASE_USERNAME=username
DATABASE_PASSWORD=password
DATABASE_NAME=database_name
DATABASE_PORT=5432
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRATION=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

## API Documentation

The API documentation is available at `http://localhost:3000/api-docs` when the backend server is running. It provides detailed information about all available endpoints, request/response formats, and authentication requirements.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 