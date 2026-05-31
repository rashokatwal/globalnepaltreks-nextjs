// app/components/ui/ShareButtonsWrapper.jsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ShareButtons = dynamic(() => import('@/app/components/ui/ShareButtons'), {
  ssr: false,
  loading: () => (
    <div className="flex gap-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      ))}
    </div>
  )
});

export default function ShareButtonsWrapper({ shareUrl }) {
  return (
    <Suspense fallback={
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
    }>
      <ShareButtons shareUrl={shareUrl} />
    </Suspense>
  );
}