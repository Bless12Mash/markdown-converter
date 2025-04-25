# Markdown Converter

A modern React application that allows you to convert Markdown files to various formats including HTML, PDF, DOCX, and PNG.

## Features

- 📝 Live Markdown preview with split-screen editing
- 🖼️ Drag and drop support for .md files
- 🔄 Multiple export formats:
  - HTML
  - PDF
  - DOCX
  - PNG
- 📱 Responsive resizable panels
- 🎨 Modern UI with Tailwind CSS
- 🌓 Light/Dark mode support

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

## Technology Stack

- React 19
- TypeScript
- Vite
- TailwindCSS
- Docx.js
- html2canvas
- jsPDF
- Marked
- React Markdown
- React Resizable Panels

## Development

### Project Structure

```
src/
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/            # Utility functions
└── util/           # Core conversion logic
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## License

[MIT License](LICENSE)
