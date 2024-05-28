# The Factory test task

## Description

Implement a simple interface for image search using the [Unsplash API](https://unsplash.com/documentation).

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

# Run tests
npm run test

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

# Visualize bundle
npm run visualize
```

## TODO

- [ ] tests
- [ ] i18n
- [ ] CI/CD
- [ ] a11y

## Project Structure Documentation

Overview of the project's directories and files, detailing the purpose and function of each.

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

- **`[foo-page]`**: A directory for a specific page.
  - **`foo-page.vue`**: The Vue component for the page.
  - **`index.ts`**: The route configuration file for the page.

#### Route Configuration (`index.ts`)

Each `index.ts` file within a page directory exports a `RouteRecordRaw` object that defines the route for that page.

#### Example of a Page's `index.ts`:

```typescript
// Inside `/pages/foo-page/index.ts`

import type { RouteRecordRaw } from 'vue-router'

import { routes } from '@tf-app/routing'
import TfHeader from '@tf-app/widgets/tf-header/tf-header.vue'

const FooPageRoute: RouteRecordRaw = {
  path: routes.foo.path,
  name: routes.foo.name,
  components: {
    default: () => import('./foo-page.vue'),
    header: TfHeader,
  },
}

export default FooPageRoute
```

#### Central Route Configuration `/pages/index.ts`

The central route configuration file dynamically imports all route configurations from the page directories and constructs a route map.

```typescript
// Inside `/pages/index.ts`

import type { RouteRecordRaw } from 'vue-router'

const routes = import.meta.glob('./**/index.ts', {
  import: 'default',
  eager: true,
})
export const routesMap = Object.values(routes) as RouteRecordRaw[]
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
- **`/__mocks__`**: Mocks for unit tests.

### Widgets (`/widgets`)

Complex UI blocks composed of entities and features.

- **Self-sufficient**: Can function independently within the UI.
- **Non-business logic**: May include interactions like gestures.
- **Business logic**: Included when necessary for rich interactivity.

## Naming Directories and Files

Kebab-case is used for naming all directories and files in this project. This approach is based on several considerations:

- **Consistency**: A uniform naming convention is provided across the project, simplifying navigation and maintenance.
- **Case Sensitivity**: To avoid potential bugs and issues with case sensitivity and to ensure better cross-platform compatibility, kebab-case is utilized. Further information can be found [here](https://en.wikipedia.org/wiki/Case_sensitivity) and [here](https://www.hanselman.com/blog/git-is-casesensitive-and-your-filesystem-may-not-be-weird-folder-merging-on-windows).
- **Clarity**: The use of kebab-case prevents the merging of words, enhancing readability (e.g., `CuteIDKOKReader` becomes `cute-id-kok-reader.ts`).
- **Uniformity Across File Types**: Kebab-case is applied to all files and folders, resulting in consistent naming regardless of file type (e.g., `get-price.ts`, `price.vue`, `price.test.ts`, and `app/app.vue`).
