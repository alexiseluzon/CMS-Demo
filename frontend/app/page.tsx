import { getProjects, getImageUrl } from "@/lib/directus";

export const revalidate = 60;

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Projects
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Content managed in Directus, rendered with Next.js.
          </p>
        </header>

        {projects.length === 0 ? (
          <p className="text-zinc-500">No projects found. Add some in Directus.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const imageUrl = getImageUrl(project.image);
              return (
                <article
                  key={project.id}
                  className="flex flex-col rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={project.title}
                      className="mb-4 h-40 w-full rounded-md object-cover"
                    />
                  )}
                  <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
                    {project.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {project.description}
                  </p>
                  {project.tech_stack?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-3 text-sm font-medium">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Live site
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-600 hover:underline dark:text-zinc-400"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}