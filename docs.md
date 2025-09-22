# Yellow AI Chat Documentation

## Overview

Yellow AI Chat is a web application that provides AI-powered conversations with project management capabilities. Users can create accounts, organize chats by projects, and interact with Gemini AI models in a responsive interface.

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js App Router API routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js with credentials provider
- **AI Integration**: Google Gemini AI models via AI SDK
- **Deployment**: Vercel-optimized

## Data Flow Architecture

![Architecture Diagram](/public/images/architecture.png)

## Database Design

![Database Design](/public/images/db.png)

## API Endpoints

| Endpoint            | Method | Description                    | Authentication |
| ------------------- | ------ | ------------------------------ | -------------- |
| `/api/chat`         | POST   | Process chat messages with AI  | Required       |
| `/api/chat`         | DELETE | Delete a chat by ID            | Required       |
| `/api/chat`         | PATCH  | Update chat project assignment | Required       |
| `/api/history`      | GET    | Retrieve chat history          | Required       |
| `/api/projects`     | GET    | List all projects              | Required       |
| `/api/projects`     | POST   | Create a new project           | Required       |
| `/api/projects/:id` | GET    | Get project by ID              | Required       |
| `/api/projects/:id` | DELETE | Delete project by ID           | Required       |
| `/api/projects/:id` | PATCH  | Update project by ID           | Required       |
| `/api/files/upload` | POST   | Upload file attachments        | Required       |
| `/api/reservation`  | POST   | Create a flight reservation    | Required       |
| `/auth/login`       | POST   | User login                     | Not Required   |
| `/auth/register`    | POST   | User registration              | Not Required   |
