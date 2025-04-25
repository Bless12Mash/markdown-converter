import { useState } from 'react';
import './App.css';
import DragAndDrop from './components/DragAndDrop';
import MarkdownPreview from './components/MarkdownPreview';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable';
import { FormatSelector } from './components/FormatSelector';
import { useFormatSelection } from './hooks/useFormatSelection';
import { downloadDOCX, downloadHTML, downloadPDF, downloadPNG } from './util/convert';

function App() {
  const [markdownContent, setMarkdownContent] = useState('');
  const { selectedFormats, error, handleFormatChange, validateSelection } = useFormatSelection();

  const handleDownload = () => {
    if (!validateSelection()) return;

    if (selectedFormats.includes('html')) downloadHTML(markdownContent);
    if (selectedFormats.includes('pdf')) downloadPDF(markdownContent);
    if (selectedFormats.includes('docx')) downloadDOCX(markdownContent);
    if (selectedFormats.includes('png')) downloadPNG();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-6">Markdown Converter</h1>

      <ResizablePanelGroup direction="horizontal" className="flex">
        <ResizablePanel defaultSize={30}>
          <div className="max-w-md">
            <DragAndDrop onFileRead={setMarkdownContent} />

            {markdownContent && (
              <FormatSelector
                selectedFormats={selectedFormats}
                error={error}
                onFormatChange={handleFormatChange}
                onDownload={handleDownload}
              />
            )}
          </div>
        </ResizablePanel>

        {markdownContent && <ResizableHandle withHandle className="bg-stone-950" />}

        <ResizablePanel defaultSize={70}>
          {markdownContent && (
            <div className="rounded-lg shadow-md p-4">
              <h2 className="text-2xl font-semibold mb-4">Preview</h2>
              <MarkdownPreview content={markdownContent} onChange={setMarkdownContent} />
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;