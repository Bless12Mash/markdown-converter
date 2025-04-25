import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export class ImageProcessor {
    private createCaptureElement(sourceElement: HTMLElement): HTMLElement {
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        tempDiv.innerHTML = sourceElement.innerHTML;
        tempDiv.style.backgroundColor = '#ffffff';
        tempDiv.style.color = '#000000';
        tempDiv.style.padding = '20px';
        tempDiv.style.width = sourceElement.offsetWidth + 'px';

        document.body.appendChild(tempDiv);

        return tempDiv;
    }

    private async captureToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
        const captureElement = this.createCaptureElement(element);
        try {
            return await html2canvas(captureElement, {
                useCORS: true,
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
            });
        } finally {
            if (document.body.contains(captureElement)) {
                document.body.removeChild(captureElement);
            }
        }
    }

    public async convertToPNG(element: HTMLElement): Promise<void> {
        const canvas = await this.captureToCanvas(element);
        const imgData = canvas.toDataURL("image/png");
        this.triggerDownload(imgData, "converted.png");
    }

    public async convertToPDF(element: HTMLElement): Promise<void> {
        const canvas = await this.captureToCanvas(element);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("converted.pdf");
    }

    public triggerDownload = (url: string, filename: string) => {
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
};
}