"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';


export default function FileSummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');
  const [fileData, setFileData] = useState<any>(null);

  useEffect(() => {
    if (fileId) {
      // Get file data from query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const filesParam = urlParams.get('files');
      if (filesParam) {
        try {
          const files = JSON.parse(filesParam);
          const file = files.find((f: any) => f.name === fileId);
          if (file) {
            setFileData(file);
          }
        } catch (error) {
          console.error('Error parsing files:', error);
        }
      }
    }
  }, [fileId]);

  if (!fileData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading file data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{fileData.name}</h1>
          <p className="text-gray-500">File Summary and Preview</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      <div className="my-6">
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Viewer Section */}
        <div className="bg-white rounded-lg shadow-md h-[600px]">
          <div className="p-4">
            <iframe
              src={fileData.url}
              className="w-full h-[600px]"
              title="PDF Preview"
            />
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-lg shadow-md h-[600px]">
          <div className="p-4">
            <div className="prose max-w-none">
              <ReactMarkdown>
                {fileData.summary}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
