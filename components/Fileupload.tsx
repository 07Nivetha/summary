'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentIcon, ArrowUpTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFileSize?: number;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
}

interface FileSummary {
  name: string;
  summary: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

function FileUpload({ onFilesSelected, maxFileSize = 5 * 1024 * 1024 }: FileUploadProps): React.JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileSummaries, setFileSummaries] = useState<FileSummary[]>([]);

  const generateSummary = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/generate_summary', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      return data.summary;
    } catch (err) {
      console.error('Error generating summary:', err);
      throw err;
    }
  };

  const handleFiles = async (acceptedFiles: File[]) => {
    setError(null);
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);

    // Create initial summaries state
    const newSummaries: FileSummary[] = [...fileSummaries, ...acceptedFiles.map(file => ({
      name: file.name,
      summary: '',
      status: 'pending' as const
    }))];
    setFileSummaries(newSummaries);

    // Process each file
    for (const file of acceptedFiles) {
      const index = newFiles.indexOf(file);
      const summaryState = newSummaries[index];

      if (summaryState) {
        try {
          summaryState.status = 'processing' as const;
          setFileSummaries([...newSummaries]);

          const summary = await generateSummary(file);
          summaryState.summary = summary;
          summaryState.status = 'completed' as const;

          setFileSummaries([...newSummaries]);
          toast.success(`Summary generated for ${file.name}`);
        } catch (error) {
          summaryState.status = 'error' as const;
          summaryState.error = error instanceof Error ? error.message : 'Unknown error';
          setFileSummaries([...newSummaries]);
          toast.error(`Failed to generate summary for ${file.name}`);
        }
      }
    }

    onFilesSelected(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: maxFileSize,
    onDrop: handleFiles,
    onDropRejected: () => {
      setError('File is too large or not a PDF');
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors">
        <div {...getRootProps()} className="w-full h-full flex flex-col items-center justify-center p-4">
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <DocumentIcon className="w-6 h-6 text-gray-400" />
              <p className="text-sm text-gray-500">Drag and drop PDF files here</p>
            </div>
            <p className="text-xs text-gray-400">or</p>
            <button
              type="button"
              onClick={open}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              <ArrowUpTrayIcon className="w-4 h-4 inline-block mr-1" />
              Select PDF
            </button>
          </div>
        </div>
      </div>

      {fileSummaries.length > 0 && (
        <div className="space-y-4">
          {fileSummaries.map((summary, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{summary.name}</h3>
                <div className={`p-2 rounded-full ${
                  summary.status === 'completed' ? 'bg-green-100' :
                  summary.status === 'processing' ? 'bg-yellow-100' :
                  summary.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  {summary.status === 'completed' && <CheckCircleIcon className="w-4 h-4 text-green-600" />}
                </div>
              </div>
              {summary.status === 'completed' && (
                <div className="mt-2 text-sm">
                  <p className="text-gray-600">Summary:</p>
                  <p className="mt-1 whitespace-pre-wrap">{summary.summary}</p>
                </div>
              )}
              {summary.error && (
                <p className="mt-2 text-sm text-red-600">Error: {summary.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export default FileUpload;