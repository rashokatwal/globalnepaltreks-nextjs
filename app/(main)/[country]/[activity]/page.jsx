// app/[country]/[activity]/page.jsx
import { notFound } from 'next/navigation';
import ActivityClient from './ActivityClient';

export default async function ActivityPage({ params, searchParams }) {
  const { country, activity } = await params;
  const filters = await searchParams;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Validate country
  const countryRes = await fetch(`${baseUrl}/api/countries/${country}`, {
    cache: 'no-store'
  });

  if (!countryRes.ok) notFound();

  const countryData = await countryRes.json();
  const countryId = countryData.data?.id;

  if (!countryId) notFound();

  // Validate activity
  const activityRes = await fetch(`${baseUrl}/api/activities`, {
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