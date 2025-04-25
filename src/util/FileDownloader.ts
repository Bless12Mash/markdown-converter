export class FileDownloader {
    public download(data: string | Blob | Uint8Array, filename: string, mimeType?: string) {
        const blob = this.createBlob(data, mimeType);
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
    }

    private createBlob(data: string | Blob | Uint8Array, mimeType?: string): Blob {
        console.log("Creating blob with data:", data);
        if (data instanceof Blob) {
            return data;
        }

        if (data instanceof Uint8Array) {
            return new Blob([data], { type: mimeType });
        }

        return new Blob([data], { type: mimeType });
    }
}