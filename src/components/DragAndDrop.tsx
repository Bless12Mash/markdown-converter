import React from 'react';

type DragAndDropProps = {
    onFileRead: (content: string) => void;
};

function DragAndDrop({ onFileRead }: DragAndDropProps) {
    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            onFileRead(reader.result as string);
        };
        reader.readAsText(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.md')) {
            handleFile(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.name.endsWith('.md')) {
            handleFile(file);
        }
    };

    return (
        <div
            className="bg-white border-2 border-dashed rounded-lg p-6 text-center shadow-md"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <p className="text-gray-700 mb-2 font-semibold">Drag & drop a .md file here</p>
            <p className="text-gray-500 text-sm mb-4">or use the file picker below</p>
            <input
                type="file"
                accept=".md"
                onChange={handleInputChange}
                className="mx-auto block text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-fuchsia-800"
            />
        </div>
    );
}

export default DragAndDrop;
