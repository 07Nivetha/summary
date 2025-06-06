'use client';

import { useState } from 'react';
import { useEdgeStore } from '@/lib/edgestore';
import { DocumentIcon } from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from 'next/navigation';

interface EdgeFileUploadProps {
  onFileUploaded: (url: string) => void;
}

interface FileStatus {
  name: string;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  summary?: string;
}

export default function EdgeFileUpload({ onFileUploaded }: EdgeFileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileStatus[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { edgestore } =  useEdgeStore();
  const generateSummary = async (fileUrl: string) => {
    try {
      const response = await fetch('/api/generate_summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfUrl: fileUrl }),
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setError(null);
      setSelectedFile(selectedFiles[0]);
    }
  };

  const handleUpload = async () => {
    if (!files.length) return;

    try {
      // First upload all files
      const uploadPromises = files.map(async (file) => {
        const res = await edgestore.publicFiles.upload({
          file,
          options: {
            temporary: false,
          },
        });
        return { 
          name: file.name, 
          url: res.url || '',
          status: 'pending',
          summary: undefined
        } as FileStatus;
      });

      const uploaded = await Promise.all(uploadPromises);
      setUploadedFiles(uploaded);
      setFiles([]);
      setError(null);

      // Generate summaries for all files in parallel
      const summaryPromises = uploaded.map(async (file, index) => {
        try {
          const summary = await generateSummary(file.url);
          return { ...file, summary, status: 'completed' } as FileStatus;
        } catch (error) {
          return { ...file, status: 'error', summary: 'Failed to generate summary' } as FileStatus;
        }
      });

      const updatedFiles = await Promise.all(summaryPromises);
      setUploadedFiles(updatedFiles);

      // Update URL parameters with summaries
      const urlParams = new URLSearchParams();
      urlParams.append('files', JSON.stringify(updatedFiles));
      router.push(`/uploaded-files?${urlParams.toString()}`);
    } catch (err) {
      setError('Failed to upload files. Please try again.');
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <DocumentIcon className="h-6 w-6 text-gray-400" />
          <input
            type="file"
            multiple
            accept='.pdf,application/pdf'
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="w-full h-48 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer shadow-sm hover:shadow-md"
          >
            <DocumentIcon className="w-16 h-16 text-gray-400 mb-4" />
            <div className="text-center">
              <p className="text-base font-medium text-gray-700">
                {selectedFile ? selectedFile.name : 'Drag and drop a file here, or click to select'}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                PDF files only
              </p>
            </div>
          </label>
          <Button variant="secondary" className="cursor-pointer" onClick={handleUpload} disabled={!files.length}>
            Upload Selected Files
          </Button>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadedFiles.map((file) => (
                  <TableRow key={file.name}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>
                      {file.status === 'completed' && <span className="text-green-500">✓</span>}
                      {file.status === 'processing' && <span className="text-yellow-500">⏳</span>}
                      {file.status === 'pending' && <span className="text-gray-500">⌛</span>}
                      {file.status === 'error' && <span className="text-red-500">❌</span>}
                    </TableCell>
                    <TableCell>
                      {file.status === 'completed' && file.summary}
                      {file.status === 'error' && 'Failed to generate summary'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}