import { Document, Packer } from "docx";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import mammoth from "mammoth";

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

export const downloadPDF = async (content: string) => {
    const paragraphs = markdownProcessor.convertToDocxParagraphs(content);
    const doc = new Document({
        sections: [{
            properties: {},
            children: paragraphs,
        }],
    });

    const docBlob = await Packer.toBlob(doc);
    const pdfBlob = await convertDocxToPdf(docBlob);

    fileDownloader.download(pdfBlob, "converted.pdf", "application/pdf");
};

async function convertDocxToPdf(docBlob: Blob): Promise<Blob> {
    const arrayBuffer = await docBlob.arrayBuffer();
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

    const pdfDoc = await PDFDocument.create();
    let currentPage = pdfDoc.addPage([612, 792]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const cleanText = html
        .replace(/<[^>]+>/g, '\n')
        .replace(/&[^;]+;/g, '')
        .trim();

    const lines = cleanText.split('\n').filter(line => line.trim());

    let y = 750;
    const fontSize = 12;
    const lineHeight = fontSize * 1.2;

    for (const line of lines) {
        if (y < 50) {
            y = 750;
            currentPage = pdfDoc.addPage([612, 792]);
        }

        currentPage.drawText(line, {
            x: 50,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
        });

        y -= lineHeight;
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: "application/pdf" });
}

export const downloadPNG = async () => {
    const element = document.getElementById("markdown-preview");
    if (!element) return;

    await imageProcessor.convertToPNG(element);
};
