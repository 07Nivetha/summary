'use client';

import React, { useState } from 'react';
import EdgeFileUpload from '@/components/Edgefileupload';

export default function ExtractionPageClient() {
  const [fileUrl, setFileUrl] = useState<string>('');

  const handleFileUploaded = (url: string) => {
    setFileUrl(url);
  };

  return (
    <div>
      <EdgeFileUpload onFileUploaded={handleFileUploaded} />
      {fileUrl && (
        <div>
          <h2>File uploaded successfully</h2>
          <p>File URL: {fileUrl}</p>
        </div>
      )}
    </div>
  );
}