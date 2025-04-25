import { FileDownloader } from './FileDownloader';
import { ImageProcessor } from './ImageProcessor';
import { MarkdownProcessor } from './MarkdownProcessor';

const markdownProcessor = new MarkdownProcessor();
const imageProcessor = new ImageProcessor();
const fileDownloader = new FileDownloader();

export const downloadHTML = (content: string) => {
    fileDownloader.download(content, "converted.html", "text/html");
};

export const downloadDOCX = async (content: string) => {
    const docBlob = await markdownProcessor.createDocument(content);
    fileDownloader.download(docBlob, "converted.docx");
};

export const downloadPDF = async () => {
    const element = document.getElementById("markdown-preview");
    if (!element) return;

    await imageProcessor.convertToPDF(element);
};

export const downloadPNG = async () => {
    const element = document.getElementById("markdown-preview");
    if (!element) return;

    await imageProcessor.convertToPNG(element);
};
