'use client';

import React, { useState } from 'react';
import ExtractionPageClient from '@/app/(main)/extraction/page-client';
import EdgeFileUpload from '@/components/Edgefileupload';
import { EdgeStoreProvider } from '@/lib/edgestore';

export default function ExtractionPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Main Section */}
      <div className="w-full max-w-3xl">
          <ExtractionPageClient />
      
      </div>
    </main>
  );
}