type PageProps = {
  params: Promise<{
    siteSlug: string;
  }>;
};

const sampleFrames = [
  'bg-champagne',
  'bg-sage',
  'bg-rosewood',
  'bg-neutral-900',
  'bg-white',
  'bg-neutral-300',
];

export default async function PublicSitePage({ params }: PageProps) {
  const { siteSlug } = await params;

  return (
    <main className="min-h-screen bg-pearl">
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase text-sage">{siteSlug}</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">Wedding Gallery</h1>
          <p className="mt-3 max-w-2xl text-neutral-600">
            Public site rendering will connect to `/api/v1/public/sites/:slug` in Phase 3.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
            {sampleFrames.map((frame, index) => (
              <div
                key={frame}
                className={`aspect-[4/3] rounded-md border border-white/70 shadow-sm ${frame}`}
                aria-label={`Gallery frame ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
