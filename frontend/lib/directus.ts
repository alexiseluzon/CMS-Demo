const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  image: string | null;
  sort_order: number;
}

export async function getProjects(): Promise<Project[]> {
  if (!DIRECTUS_URL) {
    throw new Error("NEXT_PUBLIC_DIRECTUS_URL is not set");
  }

  const res = await fetch(
    `${DIRECTUS_URL}/items/projects?sort=sort_order`,
    { next: { revalidate: 60 } } // ISR: refetch at most once per minute
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch projects: ${res.status}`);
  }

  const json = await res.json();
  const rawProjects = json.data as Project[];

  // Directus Tags field can return an array, a JSON string, or null
  // depending on how the data was entered. Normalize it here.
  return rawProjects.map((p) => ({
    ...p,
    tech_stack: normalizeTechStack(p.tech_stack),
  }));
}

function normalizeTechStack(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // not JSON, treat as comma-separated string
      return value.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

export function getImageUrl(imageId: string | null): string | null {
  if (!imageId || !DIRECTUS_URL) return null;
  return `${DIRECTUS_URL}/assets/${imageId}`;
}