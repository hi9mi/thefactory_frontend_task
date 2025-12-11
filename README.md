# The Factory test task

## Description

Implement a simple interface for image search using the [Unsplash API](https://unsplash.com/documentation) and [Vue](https://vuejs.org).

## Technologies stack

- [Vue](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [Unplugin Vue Router](https://uvr.esm.is/)

## Task Requirements

1. **Feed**: Show 30 random images.
2. **Search**: Text field for entering a key message for search. Below we show the output of photos.
3. **View photo**: Show available information about the photo.
4. **Favorites**: Each photo can be added to favorites.

## Setup Instructions

### Clone the repository

```bash
git clone https://github.com/hi9mi/thefactory_frontend_task.git
cd ./thefactory_frontend_task
npm install
```

### Setup environment variables

```bash
# .env
VITE_UNSPLASH_CLIENT_ID=client_id
VITE_UNSPLASH_API_URL=https://api.unsplash.com
VITE_BASE_URL=/
VITE_STORAGE_KIND="localStorage"
PW_BASE_URL=http://localhost:3000
CI=0
VERCEL_PROJECT_ID=project_id
VERCEL_ORG_ID=org_id
VERCEL_TOKEN=token
VERCEL_TEAM=team
```

### Run the application

```bash
npm run dev
```

And then navigate to [http://localhost:3000](http://localhost:3000)

## Naming Directories and Files

Kebab-case is used for naming all directories and files in this project. This approach is based on several considerations:

- **Consistency**: A uniform naming convention is provided across the project, simplifying navigation and maintenance.
- **Case Sensitivity**: To avoid potential bugs and issues with case sensitivity and to ensure better cross-platform compatibility, kebab-case is utilized. Further information can be found [here](https://en.wikipedia.org/wiki/Case_sensitivity) and [here](https://www.hanselman.com/blog/git-is-casesensitive-and-your-filesystem-may-not-be-weird-folder-merging-on-windows).
- **Clarity**: The use of kebab-case prevents the merging of words, enhancing readability (e.g., `CuteIDKOKReader` becomes `cute-id-kok-reader.ts`).
- **Uniformity Across File Types**: Kebab-case is applied to all files and folders, resulting in consistent naming regardless of file type (e.g., `get-price.ts`, `price.vue`, `price.test.ts`, and `app/app.vue`).

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

# Run unit tests
npm run test:unit

# Run end-to-end tests
npm run test:e2e

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
