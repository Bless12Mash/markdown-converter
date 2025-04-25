import { Format } from "@/hooks/useFormatSelection";

type Props = {
    selectedFormats: Format[];
    error: string | null;
    onFormatChange: (format: Format) => void;
    onDownload: () => void;
};

const FORMATS: Format[] = ['html', 'pdf', 'docx', 'png'];

export function FormatSelector({ selectedFormats, error, onFormatChange, onDownload }: Props) {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-300 rounded-lg p-4 mt-4">
            <h2 className="text-lg font-semibold mb-2">Choose formats</h2>
            <div className="space-y-2 mb-4">
                {FORMATS.map((format) => (
                    <label key={format} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedFormats.includes(format)}
                            onChange={() => onFormatChange(format)}
                        />
                        <span className="uppercase">{format}</span>
                    </label>
                ))}
            </div>
            <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-800"
                onClick={onDownload}
            >
                Download Selected Formats
            </button>
            {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        </div>
    );
}