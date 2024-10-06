"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Analytics {
  messageCount: number;
  fileUploadCount: number;
  subscription: {
    plan: string;
    endDate: string;
  } | null;
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchAnalytics();
    }
  }, [status, router]);

  const fetchAnalytics = async () => {
    const response = await fetch('/api/analytics');
    if (response.ok) {
      const data = await response.json();
      setAnalytics(data);
    }
  };

  if (status === 'loading' || !analytics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{analytics.messageCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>File Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{analytics.fileUploadCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{analytics.subscription?.plan || 'No active subscription'}</p>
            {analytics.subscription && (
              <p className="text-sm text-gray-500">Expires: {new Date(analytics.subscription.endDate).toLocaleDateString()}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}