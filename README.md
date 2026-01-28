# ErasTracker

A historical events explorer application allowing users to discover events across different eras, view detailed articles, and search with advanced filtering.

## Technologies

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express, Prisma, SQLite (Dev), PostgreSQL (Prod)
- **Tools:** ESLint, Prettier

## getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1.  **Frontend**
    ```bash
    npm install
    ```

2.  **Backend**
    ```bash
    cd server
    npm install
    # Setup database
    npm run db:generate
    npm run db:push
    npm run db:seed
    ```

### Running the Application

1.  **Start Backend**
    ```bash
    cd server
    npm run dev
    ```
    Server runs at `http://localhost:3001`

2.  **Start Frontend**
    ```bash
    # In a new terminal
    npm run dev
    ```
    Frontend runs at `http://localhost:8080` (or as configured)

## Deployment

Build the frontend for production:
```bash
npm run build
```

Verify backend production build:
```bash
cd server
npm run build
npm start
```

## License

MIT
