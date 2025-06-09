import { Document, Packer, Paragraph, TextRun, BorderStyle } from "docx";
import { marked } from "marked";

type TokenType = {
	type: string;
	text?: string;
	depth?: number;
	items?: TokenType[];
	tokens?: TokenType[];
	raw?: string;
};

export class MarkdownProcessor {
	private static readonly headingLevelMap = {
		1: "Heading1",
		2: "Heading2",
		3: "Heading3",
		4: "Heading4",
		5: "Heading5",
		6: "Heading6",
	} as const;

	private processInlineTokens(text: string): TextRun[] {
		const inlineTokens = marked.lexer(text) as TokenType[];
		return inlineTokens.map((token) => {
			switch (token.type) {
				case "strong":
					return new TextRun({ text: token.text || "", bold: true });
				case "em":
					return new TextRun({ text: token.text || "", italics: true });
				case "codespan":
					return new TextRun({ text: token.text || "", font: "Courier New" });
				default:
					return new TextRun({ text: token.text || token.raw || "" });
			}
		});
	}

	private createHeadingParagraph(token: TokenType): Paragraph {
		return new Paragraph({
			children: this.processInlineTokens(token.text || ""),
			heading:
				MarkdownProcessor.headingLevelMap[
					token.depth as keyof typeof MarkdownProcessor.headingLevelMap
				],
			spacing: { before: 240, after: 120 },
		});
	}

	private createListItemParagraph(text: string): Paragraph {
		return new Paragraph({
			children: [
				new TextRun({ text: "• " }),
				...this.processInlineTokens(text),
			],
			indent: { left: 720 },
			spacing: { before: 60, after: 60 },
		});
	}

	private createCodeBlockParagraph(text: string): Paragraph {
		return new Paragraph({
			children: [
				new TextRun({
					text: text,
					font: "Courier New",
					size: 20,
				}),
			],
			spacing: { before: 120, after: 120 },
			indent: { left: 360 },
			shading: { fill: "F2F2F2" },
		});
	}

	private createBlockQuoteParagraph(text: string): Paragraph {
		return new Paragraph({
			children: this.processInlineTokens(text),
			indent: { left: 360 },
			spacing: { before: 120, after: 120 },
			border: {
				left: {
					size: 4,
					color: "#70B5F9",
					space: 8,
					style: BorderStyle.SINGLE,
				},
			},
		});
	}

	private createHorizontalRuleParagraph(): Paragraph {
		return new Paragraph({
			text: "",
			border: {
				bottom: {
					size: 1,
					color: "#CCCCCC",
					space: 8,
					style: BorderStyle.SINGLE,
				},
			},
			spacing: { before: 240, after: 240 },
		});
	}

	public convertToDocxParagraphs(content: string): Paragraph[] {
		const tokens = marked.lexer(content) as TokenType[];
		const paragraphs: Paragraph[] = [];

		for (const token of tokens) {
			switch (token.type) {
				case "heading":
					paragraphs.push(this.createHeadingParagraph(token));
					break;

				case "paragraph":
					paragraphs.push(
						new Paragraph({
							children: this.processInlineTokens(token.text || ""),
							spacing: { before: 120, after: 120 },
						})
					);
					break;

				case "list":
					(token.items || []).forEach((item) => {
						paragraphs.push(this.createListItemParagraph(item.text || ""));
					});
					break;

				case "code":
					paragraphs.push(this.createCodeBlockParagraph(token.text || ""));
					break;

				case "blockquote":
					if (token.tokens) {
						token.tokens.forEach((quoteToken) => {
							paragraphs.push(
								this.createBlockQuoteParagraph(quoteToken.text || "")
							);
						});
					}
					break;

				case "hr":
					paragraphs.push(this.createHorizontalRuleParagraph());
					break;
			}
		}

		return paragraphs;
	}

	public async createDocument(content: string): Promise<Blob> {
		const doc = new Document({
			sections: [
				{
					properties: {},
					children: this.convertToDocxParagraphs(content),
				},
			],
		});

		return await Packer.toBlob(doc);
	}
}
