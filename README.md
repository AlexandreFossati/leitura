# Leitura

A web application to track and manage your reading journey. Available at [leitura.app](https://leitura.app).

This project was entirely developed using [Cursor](https://cursor.sh), leveraging AI assistance throughout the development process. Every line of code was carefully crafted with proper software engineering practices, not just experimental AI-generated code.

## Tech Stack
- SvelteKit 5.0
- PostgreSQL
- Node.js

---

# Technical Context for AI Assistance

This section provides detailed context for AI tools to better understand and assist with the project.

## Application Architecture

### Frontend (SvelteKit)
- Using Svelte 5 with runes for state management
- Server-side rendering (SSR) enabled
- Progressive enhancement approach
- No additional UI libraries - pure CSS for styling
- Mobile-first responsive design

### Backend (Node.js)
- SvelteKit endpoints for API routes
- PostgreSQL for data persistence
- Direct SQL queries (no ORM)

### Database Schema
- Books table: Stores book metadata

## Key Features
- Book tracking (read, want to read, currently reading)
- Reading progress tracking
- Book reviews ratings

## Development Patterns
- Feature-based directory structure
- Server-side form validation
- Progressive enhancement
- Error boundaries implementation
- Type safety with JSDoc comments

## Important Conventions
- Route structure follows SvelteKit conventions
- Components are in PascalCase
- Utilities are in camelCase
- Database queries are in separate files
- Error handling is consistent across the application

## Common Development Tasks
- Frontend state management uses Svelte's built-in stores
- API endpoints follow REST conventions
- Error handling includes both client and server-side validation

## Deployment
- Hosted on a Node.js server
- PostgreSQL database on managed service
- HTTPS enabled

This technical context helps AI tools understand the project's structure, patterns, and conventions, enabling more accurate and contextual assistance.
