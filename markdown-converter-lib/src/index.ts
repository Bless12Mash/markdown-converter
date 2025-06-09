import { Document, Packer } from "docx";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import mammoth from "mammoth";
import { marked } from "marked";
import { MarkdownProcessor } from "./MarkdownProcessor";
import { ImageProcessor } from "./ImageProcessor";

export class MarkdownConverter {
	private markdownProcessor: MarkdownProcessor;
	private imageProcessor: ImageProcessor;

	constructor() {
		this.markdownProcessor = new MarkdownProcessor();
		this.imageProcessor = new ImageProcessor();
	}

	/**
	 * Convert markdown to HTML
	 */
	public async toHTML(content: string): Promise<string> {
		return await marked(content);
	}

	/**
	 * Convert markdown to DOCX
	 */
	public async toDOCX(content: string): Promise<Blob> {
		return await this.markdownProcessor.createDocument(content);
	}

	/**
	 * Convert markdown to PDF
	 */
	public async toPDF(content: string): Promise<Blob> {
		const doc = new Document({
			sections: [
				{
					properties: {},
					children: this.markdownProcessor.convertToDocxParagraphs(content),
				},
			],
		});

		const docBlob = await Packer.toBlob(doc);
		return await this.convertDocxToPdf(docBlob);
	}

	/**
	 * Convert markdown preview element to PNG
	 */
	public async toPNG(element: HTMLElement): Promise<string> {
		return await this.imageProcessor.convertToPNG(element);
	}

	private async convertDocxToPdf(docBlob: Blob): Promise<Blob> {
		const arrayBuffer = await docBlob.arrayBuffer();
		const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

		const pdfDoc = await PDFDocument.create();
		let currentPage = pdfDoc.addPage([612, 792]);
		const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

		const cleanText = html
			.replace(/<[^>]+>/g, "\n")
			.replace(/&[^;]+;/g, "")
			.trim();

		const lines = cleanText.split("\n").filter((line) => line.trim());

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
}
