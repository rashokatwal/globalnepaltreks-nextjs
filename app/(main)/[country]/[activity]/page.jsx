// app/[country]/[activity]/page.jsx
import { notFound } from 'next/navigation';
import ActivityClient from './ActivityClient';

export async function generateMetadata({ params }) {
  const { country, activity } = await params;

  const activityName = activity?.split('-').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
  const countryName = country?.charAt(0).toUpperCase() + country?.slice(1);

  return {
    title: `${activityName} in ${countryName} | Global Nepal Treks`,
    description: `Discover the best ${activityName} packages in ${countryName}.`,
    alternates: {
      canonical: `https://globalnepaltreks.com/${country}/${activity}`,
    },
  };
}

export default async function ActivityPage({ params, searchParams }) {
  const { country, activity } = await params;
  const filters = await searchParams;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Validate country
  const countryRes = await fetch(`${baseUrl}/api/countries/${country}`, {
    next: { revalidate: 1000 },
    cache: 'no-store'
  });

  if (!countryRes.ok) notFound();

  const countryData = await countryRes.json();
  const countryId = countryData.data?.id;

  if (!countryId) notFound();

  // Validate activity
  const activityRes = await fetch(`${baseUrl}/api/activities`, {
    next: { revalidate: 0 },
    cache: 'no-store'
  });

  if (!activityRes.ok) notFound();

  const activityData = await activityRes.json();
  const foundActivity = activityData.data?.data?.find(a => a.slug === activity);
  const activityId = foundActivity?.id;

  if (!activityId) notFound();

  return (
    <ActivityClient
      country={country}
      activity={activity}
      countryId={countryId}
      activityId={activityId}
      filters={filters}
    />
  );
}