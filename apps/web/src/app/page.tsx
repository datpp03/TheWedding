import type { ApiResponse } from '@the-wedding/shared';
import Link from 'next/link';
import { PublicAlbumCard } from '@/features/public-albums/public-album-card';
import type { PublicHome } from '@/features/public-albums/public-album-api';

export default async function HomePage() {
  const home = await fetchPublicHome();

  return (
    <main className="min-h-screen bg-pearl">
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link className="text-lg font-semibold text-ink" href="/">
            The Wedding
          </Link>
          <div className="flex gap-2">
            <Link
              className="rounded-md px-3 py-2 text-sm font-semibold text-neutral-700"
              href="/login"
            >
              Sign in
            </Link>
            <Link
              className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white"
              href="/register"
            >
              Create site
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-rose-700">Public albums</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink sm:text-6xl">
              Browse real wedding moments before you sign in.
            </h1>
            <p className="mt-4 text-base leading-7 text-neutral-600">
              Featured albums only include public albums. Private and unlisted memories stay out of
              discovery.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-md bg-rose-600 px-5 py-3 text-sm font-semibold text-white"
              href="#today"
            >
              Today
            </Link>
            <Link
              className="rounded-md border border-teal-200 bg-white px-5 py-3 text-sm font-semibold text-teal-800"
              href="#week"
            >
              This week
            </Link>
          </div>
        </div>
      </section>

      <FeaturedSection id="today" title="Featured today" albums={home?.featuredToday ?? []} />
      <FeaturedSection id="week" title="Featured this week" albums={home?.featuredWeek ?? []} />
    </main>
  );
}

function FeaturedSection({
  albums,
  id,
  title,
}: {
  albums: PublicHome['featuredToday'];
  id: string;
  title: string;
}) {
  return (
    <section id={id} className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">Safe discovery</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">{title}</h2>
          </div>
        </div>
        {albums.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <PublicAlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-rose-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-ink">No public albums yet</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Public albums will appear here after couples publish them.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

async function fetchPublicHome() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
  const response = await fetch(`${apiUrl}/api/v1/public/home`, { cache: 'no-store' }).catch(
    () => null,
  );
  if (!response?.ok) {
    return null;
  }
  const payload = (await response.json()) as ApiResponse<PublicHome>;
  return payload.success ? payload.data : null;
}
