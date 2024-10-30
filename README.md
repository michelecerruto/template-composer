
# Template Composer

Template Composer is a React application for building customizable, grid-based layouts. Leveraging the power of [GridStack.js](https://gridstackjs.com/), it offers an intuitive drag-and-drop interface, perfect for creating interactive templates, dashboards, and visual layouts.

## Features

- **Drag-and-Drop Interface**: Effortlessly move and position widgets within a flexible grid.
- **Resizable Widgets**: Customize the size of each widget to create unique layouts.
- **Dynamic Grid Layout**: Add, remove, and rearrange widgets on the fly.
- **Integrated with Ant Design**: Beautiful and responsive UI components from [Ant Design](https://ant.design/).
- **React and TypeScript**: Built using modern technologies for a maintainable and type-safe codebase.

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (>= 14.x) and [npm](https://www.npmjs.com/) installed.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/template-composer.git
   cd template-composer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

### Building for Production

To create a production build, run:

```bash
npm run build
```

This will generate optimized static files in the `dist` folder.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Scripts

- **`npm run dev`**: Starts the development server using Vite.
- **`npm run build`**: Builds the project for production.
- **`npm run preview`**: Previews the production build.
- **`npm run lint`**: Runs ESLint to check for code quality and style issues.

## Dependencies

- **GridStack.js**: For flexible, responsive grid layouts.
- **Ant Design**: For UI components and design.
- **@octostar/platform-api, platform-react, platform-types**: Integrations with Octostar's platform.

## Development

This project uses [TypeScript](https://www.typescriptlang.org/) and [ESLint](https://eslint.org/) for a robust development experience. TypeScript provides type safety, and ESLint ensures code quality.

## License

This project is private and not licensed for distribution. Contact the repository owner for more information.
