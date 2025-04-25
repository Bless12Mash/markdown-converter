import { useState } from 'react';

export type Format = 'html' | 'pdf' | 'docx' | 'png';

export function useFormatSelection() {
    const [selectedFormats, setSelectedFormats] = useState<Format[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFormatChange = (format: Format) => {
        setSelectedFormats((prev) =>
            prev.includes(format)
                ? prev.filter((f) => f !== format)
                : [...prev, format]
        );
    };

    const validateSelection = () => {
        if (selectedFormats.length === 0) {
            setError('Please select at least one format to download.');
            return false;
        }
        setError(null);
        return true;
    };

    return {
        selectedFormats,
        error,
        handleFormatChange,
        validateSelection,
    };
}