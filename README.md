# Junno UI – Premium Nuxt UI Dashboard Template

Refactor this Nuxt UI dashboard into a static ThemeForest template.
Remove all dynamic data and backend logic.
Use hardcoded data and clear structure.
Add step-by-step documentation and branding as Junno UI.

## Overview

Junno UI is a premium, clean, and modern dashboard template built with **Vue.js**, **Nuxt 3**, and **Nuxt UI**. It is designed to be beginner-friendly, fully customizable, and production-ready for frontend projects.

**This is a static template.** No backend, API, or database is required. All data is managed via simple JSON/TypeScript files, making it incredibly easy to customize for your own needs.

## Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com) (Vue.js)
- **UI Component Library**: [Nuxt UI](https://ui.nuxt.com)
- **Styling**: Tailwind CSS
- **Icons**: Iconify / Heroicons

## Core Goals

- **100% Static Data**: No API calls, axios, or Pinia stores.
- **Easy Customization**: Change data in one place (`/src/data`) to update the UI.
- **Beginner Friendly**: Simple, readable code with no complex async logic.

## Project Structure

```bash
├── src/
│   ├── components/       # Reusable UI components
│   ├── data/             # Static mock data (JSON/TS)
│   ├── layouts/          # Main application layouts
│   ├── pages/            # Application routes/pages
│   └── app.vue           # Root component
├── nuxt.config.ts        # Nuxt configuration
└── package.json          # Dependencies
```

## Getting Started

Follow these steps to get your project running in minutes.

### 1. Install Dependencies

Ensure you have Node.js installed. Then run:

```bash
npm install
```

### 2. Run Development Server

Start the local development server at `http://localhost:5173`:

```bash
npm run dev
```

### 3. Customize Data

All data is stored in simple TypeScript files within `src/data/`. To customize the dashboard:

1.  Open any file in `src/data/` (e.g., `dashboard.ts`, `users.ts`).
2.  Replace the dummy data with your own values.
3.  Save the file. The UI will update automatically.

No backend or API knowledge is required.

### 4. Customize UI

The UI is built using Nuxt UI components. To change the look and feel:

1.  Navigate to `src/components/`.
2.  Edit the Vue components as needed.
3.  Utilize the [Nuxt UI Documentation](https://ui.nuxt.com) for component references.

### 5. Build for Production

When you are ready to deploy:

```bash
npm run build
```

This will create a production-ready `.output` directory.

## copyright

Junno UI – Premium Nuxt UI Dashboard Template
© 2026 Junno UI. All rights reserved.
