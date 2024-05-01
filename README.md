# The Factory test task

## Description

Implement a simple interface for image search using the Unsplash API.

## Task Requirements

1. **Home page**: Show 9 random images.
2. **Search**: Text field for entering a key message for search. Below we show the output of photos.
3. **View photo**: Show available information about the photo.
4. **Favorites**: Each photo can be added to favorites.

## Setup Instructions

```bash
git clone https://github.com/hi9mi/thefactory_frontend_task.git
cd ./thefactory_frontend_task
npm install
```

## Available scripts

```bash
# Run development server
npm run dev

# Run linter
npm run lint

# Run linter with autofix
npm run lint:fix

# Build for production
npm run build

# Run preview server
npm run preview

# Setup git hooks
npm prepare

# Run linter on staged files
npm run lint-staged

# Generate PWA assets
npm run generate-pwa-assets

# Run Histoire
npm run story:dev

# Build Histoire
npm run story:build

# Preview Histoire
npm run story:preview

# Upgrade dependencies
npm run upgrade
```

## TODO

- [ ] tests
- [ ] i18n
- [ ] CI/CD
- [ ] a11y

## Project Structure Documentation

This document provides an organized overview of the project's directories and files, detailing the purpose and function of each.

### Source Code (`/src`)

The main directory containing the application's source code.

### Application Setup (`/app`)

Core files for initializing and configuring the application.

- **`create-app.ts`**: Sets up the Vue application instance.
- **`index.css`**: Defines global styles.
- **`/init-with`**: Contains initialization modules for libraries and plugins.
- **`main.ts`**: Entry point of the application.
- **`tf-app.vue`**: Root Vue component.

### Data Models (`/entities`)

Defines the structure and management of application data.

- **`/favorite-photos`**: Manages favorite photos.
- **`/gallery`**: Handles photo gallery operations.

### User Features (`/features`)

Components for user interactions aligned with business logic.

- **Interactive UI elements**: Enable user actions.
- **Internal state and API calls**: Support functionality.

### Pages (`/pages`)

Contains the components and configurations for the different pages of the application. Each page is a directory that includes the Vue component and a route configuration file.

#### Within each page directory, the structure is as follows:

- **`[any-page]`**: A directory for a specific page.
  - **`any-page.vue`**: The Vue component for the page.
  - **`index.ts`**: The route configuration file for the page.

#### Route Configuration (`index.ts`)

Each `index.ts` file within a page directory exports a `RouteRecordRaw` object that defines the route for that page.

#### Example of a Page's `index.ts`:

```typescript
// Inside `/pages/any-page/index.ts`

import type { RouteRecordRaw } from "vue-router";
import { routes } from "@tf-app/routing";
import TfHeader from "@tf-app/widgets/tf-header/tf-header.vue";

const AnyPageRoute: RouteRecordRaw = {
  path: routes.any.path,
  name: routes.any.name,
  components: {
    default: () => import("./any-page.vue"),
    header: TfHeader,
  },
};

export default AnyPageRoute;
```

#### Central Route Configuration `/pages/index.ts`

The central route configuration file dynamically imports all route configurations from the page directories and constructs a route map.

```typescript
// Inside `/pages/index.ts`

import type { RouteRecordRaw } from "vue-router";

const routes = import.meta.glob("./**/index.ts", {
  import: "default",
  eager: true,
});
export const routesMap = Object.values(routes) as RouteRecordRaw[];
```

### Routing (`/routing`)

Manages the application's navigational structure and includes route guards for secure and controlled navigation.

### Shared (`/shared`)

A collection of common utilities, components, and resources that are reused across the application.

- **`/api`**: Modules for interacting with the API.
- **`/assets`**: Static assets like images and icons.
- **`/libs`**: General libraries and utilities.
- **`/ui`**: Reusable user interface components organized by functionality.
  - **`/buttons`**: Interactive button elements.
  - **`/data-display`**: Components for displaying data.
  - **`/feedback`**: User feedback elements like loaders and notifications.
  - **`/navigation`**: Navigation aids like tabs and breadcrumbs.
  - **`/overlays`**: Overlay components like modals and popovers.
  - **story files (`*.story.vue`)**: Nested within each UI category for isolated development and demonstration of components.
- **`/workers`**: Web Workers for background tasks.

### Widgets (`/widgets`)

Complex UI blocks composed of entities and features.

- **Self-sufficient**: Can function independently within the UI.
- **Non-business logic**: May include interactions like gestures.
- **Business logic**: Included when necessary for rich interactivity.

### Root Directory Files

Configuration files and static assets for the application setup and deployment.

- **`.editorconfig`**: Standardizes coding styles.
- **`.env`**: Manages environment variables.
- **`.npmrc`**: Configures npm settings.
- **`.stylelintrc.json`**: Lints CSS styles.
- **`.vscode/`**: Personalizes VS Code editor settings.
- **`eslint.config.js`**: Lints JavaScript and Vue code.
- **`histoire.config.ts`**: Sets up component documentation tool.
- **`index.html`**: Main entry HTML file.
- **`meta.ts`**: Contains metadata information.
- **`package-lock.json` & `package.json`**: Manages dependencies.
- **`public/`**: Houses publicly accessible static files.
- **`pwa-assets.config.ts`**: Configures PWA assets.
- **`README.md`**: Provides project overview and instructions.
- **`tsconfig.json` & `tsconfig.node.json`**: Configures TypeScript.
- **`typings/`**: Contains TypeScript type definitions.
- **`vercel.json`**: Configures deployment on Vercel.
- **`vite.config.ts`**: Configures the Vite build tool.
