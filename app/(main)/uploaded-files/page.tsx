'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function UploadedFilesPage() {
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string; summary: string; status: string }[]>([]);
  const router = useRouter();

  const handleDelete = (fileName: string) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  useEffect(() => {
    // Get uploaded files from query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const filesParam = urlParams.get('files');
    if (filesParam) {
      try {
        const files = JSON.parse(filesParam);
        setUploadedFiles(files);
      } catch (error) {
        console.error('Error parsing files:', error);
      }
    }
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Uploaded Files</h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Back
        </button>
      </div>

      {uploadedFiles.length > 0 ? (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] font-bold">File Name</TableHead>
                  <TableHead className="w-[200px] font-bold">URL</TableHead>
                  <TableHead className="w-[300px] font-bold">Summary</TableHead>
                  <TableHead className="w-[100px] font-bold">Status</TableHead>
                  <TableHead className="w-[100px] font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadedFiles.map((file) => (
                  <TableRow key={file.name}>
                    <TableCell className="font-medium cursor-pointer">
                      <div className="max-w-[200px]">
                        <span 
                          className="block truncate text-blue-600 hover:text-blue-800" 
                          title={file.name}
                          onClick={() => router.push(`/file-summary?fileId=${encodeURIComponent(file.name)}&files=${encodeURIComponent(JSON.stringify(uploadedFiles))}`)}
                        >
                          {file.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View File
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[400px]">
                        <span className="block truncate" title={file.summary}>
                            {file.summary}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {file.status}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(file.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No files have been uploaded yet.</p>
          <Button
            onClick={handleBack}
            className="mt-4"
          >
            Upload Files
          </Button>
        </div>
      )}
    </div>
  );
}