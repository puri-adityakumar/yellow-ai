# Yellow AI Chat

An AI-powered chat application with project management capabilities.

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google AI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd yellow-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.sample .env.local
   ```

   Fill in the required environment variables:

   - `POSTGRES_URL`: Your PostgreSQL connection string
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google AI API key
   - `AUTH_SECRET`: Random string for NextAuth.js session encryption

4. **Database Setup**

   ```bash
   npm run build
   ```

   This will run migrations and set up the database schema.

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

See `.env.sample` for required environment variables.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes DB migration)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
