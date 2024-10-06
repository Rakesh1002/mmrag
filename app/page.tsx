import { getServerSession } from 'next-auth/next';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  const session = await getServerSession();

  return <HomeClient session={session} />;
}