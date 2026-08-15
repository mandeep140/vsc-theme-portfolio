'use client';

import dynamic from 'next/dynamic';

const VSCodeLayout = dynamic(
  () => import('@/components/vscode/VSCodeLayout'),
  { ssr: false }
);

export default function Home() {
  return <VSCodeLayout />;
}
