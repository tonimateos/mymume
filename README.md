# MyMuMe 👾

MyMuMe (My Musical Me) is a social platform that transforms your musical taste into a unique digital identity—your **Mume**. Connect your Spotify playlists, analyze your "sonic soul" using Gemini AI, and connect with other users in the MuMe Collective.

## Current Status

The application is currently in active development with the following features implemented:
- **Identity Creation**: Randomize and name your Mume avatar.
- **Musical Injection**: Import tracks via public Spotify Playlist URLs or raw text.
- **Identity Analysis**: Gemini AI-powered analysis of your musical tastes, categorizing them into distinct "sonic personas".
- **MuMe Collective**: A public feed where you can see other Mumes and test your compatibility with them.
- **Soulmate Connections**: Establish "positive" connections to unlock and explore the actual song lists of compatible Mumes.
- **Profile Management**: Reset and delete functionality for a fresh start.

## Getting Started

### Prerequisites
- Node.js >= 22.0.0
- A Spotify Developer account (for Client ID/Secret)
- A Google Generative AI API Key (Gemini)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tonimateos/mymume.git
   cd mymume
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local` and fill in your credentials:
   - `DATABASE_URL` (SQLite by default)
   - `NEXTAUTH_SECRET`
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `GOOGLE_GENERATIVE_AI_API_KEY`

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Testing Strategy

We maintain project robustness through a tiered testing approach, ensuring both internal logic and external integrations work as expected.

### 1. Unit & Integration Tests (Vitest)
Used for testing individual React components and utility functions in isolation.
- **Tool**: [Vitest](https://vitest.dev/) + React Testing Library.
- **Run**: `npm run test:unit`

### 2. End-to-End Tests (Playwright)
Used for verifying full user journeys. To ensure reliability and speed, we use a **Hybrid Mocking Strategy** for Spotify:
- **Scraper Mocking**: We test the Playwright-based Spotify scraper against local HTML fixtures (`tests/fixtures/`) to verify selector logic without hitting live Spotify servers.
- **Tool**: [Playwright](https://playwright.dev/).
- **Run**: `npm run test:e2e`

### 3. Coverage
Monitor how much of the codebase is covered by tests:
- **Run**: `npm run test:coverage`

## Linting

Keep the codebase clean:
- **Run**: `npm run lint`