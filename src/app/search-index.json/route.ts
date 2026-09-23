import { buildIndex } from "@/lib/search-index";

/**
 * Static search index, fetched by the dialog on first open.
 *
 * Kept as a separate route instead of inlined into the page bundle so it stays
 * out of the critical path — the header (and therefore the search trigger)
 * renders without it, and the JSON only loads if someone actually searches.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(buildIndex()), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control":
        "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
