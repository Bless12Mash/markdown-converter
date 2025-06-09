# Markdown Converter Library

A powerful library to convert markdown content to various formats including HTML, PDF, DOCX, and PNG.

## Features

- 📝 Convert markdown to HTML
- 📄 Convert markdown to DOCX with proper formatting
- 📑 Convert markdown to PDF with proper page breaks
- 🖼️ Convert markdown preview to PNG

## Installation

```bash
npm install markdown-converter-lib
```

## Usage

```typescript
import { MarkdownConverter } from "markdown-converter-lib";

const converter = new MarkdownConverter();

// Convert to HTML
const html = converter.toHTML("# Hello World");

// Convert to DOCX
const docxBlob = await converter.toDOCX("# Hello World");
const docxUrl = URL.createObjectURL(docxBlob);
// Use the URL to download the file

// Convert to PDF
const pdfBlob = await converter.toPDF("# Hello World");
const pdfUrl = URL.createObjectURL(pdfBlob);
// Use the URL to download the file

// Convert preview element to PNG
const previewElement = document.getElementById("markdown-preview");
const pngDataUrl = await converter.toPNG(previewElement);
// Use the data URL for the PNG image
```

## Supported Markdown Features

- Headers (H1-H6)
- Bold and italic text
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Blockquotes
- Horizontal rules
- Links
- Images

## Requirements

- Node.js >= 18.0.0
- Modern browser environment for PNG conversion

## License

MIT License - see LICENSE file for details
