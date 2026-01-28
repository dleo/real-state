# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

You are building a scalable web application for managing real estate properties.
Each property:
    • Belongs to a user
    • Has an asset type
    • May be new or old
    • Has multiple features
    • Contains financial data
Focus on structure, clarity, and correctness, not polish.

Functional Requirements
1. Data Model & Database Structure
Design a database schema and corresponding models to support:
Property
    • Asset Type: one of three types (e.g. residential, commercial, land)
    • Condition: new or old
    • Features: array of strings (e.g. ["garage", "pool"])
    • Financial Data:
        ◦ price
        ◦ taxes
        ◦ income
        ◦ expenditure
    • Ownership:
        ◦ A property belongs to a user
You may normalize or denormalize as you see fit.
Explain your decisions briefly in video and/or comments or README.

2. Webhook (JSON Ingestion)
Implement a webhook endpoint that:
    • Accepts JSON payloads
    • Payload keys may be missing
    • Creates new properties in the database
    • Performs deduplication
Deduplication
You may choose a simple strategy, such as:
    • External ID (if present)
    • Combination of fields (e.g. address + owner)
    • Hashing relevant fields
Explain your approach.

3. Authentication
Implement rudimentary authentication, for example:
No advanced authorization rules required.

4. CRUD Functionality (Backend + Frontend)
Backend (Laravel)
    • Full CRUD API for properties
    • Validation where appropriate
    • Proper HTTP responses
Frontend (Next.js)
    • Login page
    • Property list
    • Create / edit / delete properties
    • Basic forms (no heavy styling required)

Technical Constraints
    • Backend: Laravel
    • Frontend: Next.js
    • Database: Any (SQLite recommended)
    • Styling: Optional / minimal

## Important Notes
    • Focus on:
        ◦ Architecture
        ◦ Code readability
        ◦ Practical decisions

## Project Structure

```
real-state/
├── backend/          # PHP backend application
├── frontend/         # Frontend application
└── README            # Project documentation
```
## Architecture
Monolithic with service-oriented features, API-first design.

## Tech Stack
- **Backend:** Laravel 12 (PHP 8.3+)
- **Frontend:** Next.JS SPA with Tailwind CSS
- **Database:** SQLite
- **Auth:** Laravel Sanctum

## Current Status

This project is in early development. The backend and frontend directories are set up but not yet initialized with frameworks or dependencies.

## Development Setup (To Be Configured)

Once the project is initialized, update this section with:
- Backend: composer.json commands (install, test, lint)
- Frontend: package.json commands (dev, build, test, lint)

