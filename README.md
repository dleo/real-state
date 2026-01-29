# Real Estate Property Management

A web application for managing real estate properties with full CRUD functionality, webhook ingestion, and user authentication.

## Tech Stack

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** Next.js 16 with React 19
- **Styling:** Tailwind CSS 4
- **Database:** SQLite
- **Authentication:** Laravel Sanctum

## Project Structure

```
real-state/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Enums/           # AssetType, PropertyCondition
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── PropertyController.php
│   │   │   └── WebhookController.php
│   │   └── Models/
│   │       ├── Property.php
│   │       └── User.php
│   ├── database/migrations/
│   └── routes/api.php
├── frontend/                # Next.js SPA
│   ├── app/
│   │   ├── components/
│   │   ├── properties/
│   │   └── page.tsx
│   └── lib/api.ts
└── README.md
```

## Database Schema

### Properties Table

| Column       | Type          | Description                          |
|--------------|---------------|--------------------------------------|
| id           | bigint        | Primary key                          |
| user_id      | foreignId     | Owner (references users)             |
| asset_type   | tinyInteger   | 1=Residential, 2=Commercial, 3=Land  |
| condition    | tinyInteger   | Property condition (new/old)         |
| features     | json          | Array of strings (e.g., ["garage"])  |
| price        | decimal(15,2) | Property price                       |
| taxes        | decimal(15,2) | Property taxes                       |
| income       | decimal(15,2) | Income generated                     |
| expenditure  | decimal(15,2) | Expenses                             |
| external_id  | string        | Unique external identifier (nullable)|
| timestamps   | datetime      | created_at, updated_at               |

## API Endpoints

### Authentication

| Method | Endpoint      | Description          | Auth Required |
|--------|---------------|----------------------|---------------|
| POST   | /api/login    | User login           | No            |
| POST   | /api/logout   | User logout          | Yes           |
| GET    | /api/user     | Get current user     | Yes           |

### Properties (CRUD)

| Method | Endpoint                | Description          | Auth Required |
|--------|-------------------------|----------------------|---------------|
| GET    | /api/properties         | List all properties  | Yes           |
| GET    | /api/properties/{id}    | Get single property  | Yes           |
| POST   | /api/properties         | Create property      | Yes           |
| PUT    | /api/properties/{id}    | Update property      | Yes           |
| DELETE | /api/properties/{id}    | Delete property      | Yes           |

### Webhook

| Method | Endpoint                  | Description                    | Auth Required |
|--------|---------------------------|--------------------------------|---------------|
| POST   | /api/webhook/properties   | Ingest property via webhook    | No            |

## Development Setup

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Start development server
php artisan serve
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Run Both (from backend directory)

```bash
composer dev
```

## Available Commands

### Backend

| Command              | Description                    |
|----------------------|--------------------------------|
| `composer install`   | Install PHP dependencies       |
| `composer dev`       | Run all dev servers            |
| `composer test`      | Run PHPUnit tests              |
| `php artisan serve`  | Start Laravel server           |
| `php artisan migrate`| Run database migrations        |

### Frontend

| Command          | Description              |
|------------------|--------------------------|
| `npm install`    | Install dependencies     |
| `npm run dev`    | Start dev server         |
| `npm run build`  | Build for production     |
| `npm run lint`   | Run ESLint               |

## Webhook Deduplication Strategy

The webhook endpoint uses a two-tier deduplication approach:

1. **Primary:** If `external_id` is provided, it serves as the unique identifier. Existing records with the same `external_id` are updated.

2. **Fallback:** If no `external_id` is present, deduplication falls back to matching by `address` + `user_id` combination.

This allows external systems to either provide their own identifiers or rely on property address for deduplication.

## Property Types

- **Residential** (1): Houses, apartments, condos
- **Commercial** (2): Office spaces, retail, industrial
- **Land** (3): Undeveloped land, plots

## License

MIT

## Author
David Lopez
