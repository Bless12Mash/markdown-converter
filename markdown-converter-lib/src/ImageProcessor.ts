import jsPDF from "jspdf";

// @ts-ignore
const html2canvas = require("html2canvas").default;

export class ImageProcessor {
	private createCaptureElement(sourceElement: HTMLElement): HTMLElement {
		const tempDiv = document.createElement("div");
		tempDiv.style.position = "absolute";
		tempDiv.style.left = "-9999px";
		tempDiv.style.top = "0";
		tempDiv.innerHTML = sourceElement.innerHTML;
		tempDiv.style.backgroundColor = "#ffffff";
		tempDiv.style.color = "#000000";
		tempDiv.style.padding = "20px";
		tempDiv.style.width = sourceElement.offsetWidth + "px";

		document.body.appendChild(tempDiv);

		return tempDiv;
	}

	private async captureToCanvas(
		element: HTMLElement
	): Promise<HTMLCanvasElement> {
		const captureElement = this.createCaptureElement(element);
		try {
			return await html2canvas(captureElement, {
				useCORS: true,
				backgroundColor: "#ffffff",
				scale: 2,
				logging: false,
			});
		} finally {
			if (document.body.contains(captureElement)) {
				document.body.removeChild(captureElement);
			}
		}
	}

	public async convertToPNG(element: HTMLElement): Promise<string> {
		const canvas = await this.captureToCanvas(element);
		return canvas.toDataURL("image/png");
	}

	public async convertToPDF(element: HTMLElement): Promise<Blob> {
		const canvas = await this.captureToCanvas(element);
		const imgData = canvas.toDataURL("image/png");

		const pdf = new jsPDF();
		const imgProps = pdf.getImageProperties(imgData);
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

		pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
		const pdfBlob = pdf.output("blob");
		return pdfBlob;
	}
}
