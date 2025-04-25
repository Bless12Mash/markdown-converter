import ReactMarkdown from 'react-markdown';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';

type Props = {
    content: string;
    onChange: (value: string) => void;
};

function MarkdownPreview({ content, onChange }: Props) {
    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
                <p className="font-bold">Edit your markdown here</p>
                <textarea
                    className="min-h-screen w-5/6 p-4 border border-gray-300 rounded-lg shadow-md"
                    value={content}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Edit your markdown here..."
                />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel>
                <p className="font-bold">Review your markdown here</p>
                <div id="markdown-preview" className="min-h-screen p-4 border border-gray-300 rounded-lg shadow-md">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div></ResizablePanel>
        </ResizablePanelGroup>
    );
}

export default MarkdownPreview;
