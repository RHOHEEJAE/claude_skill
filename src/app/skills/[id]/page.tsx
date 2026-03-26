import Link from "next/link";
import { notFound } from "next/navigation";
import { skills, getSkillById } from "@/lib/skills";
import CopyButton from "@/components/CopyButton";
import DownloadButton from "@/components/DownloadButton";

export async function generateStaticParams() {
  return skills.map((skill) => ({ id: skill.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = getSkillById(id);
  if (!skill) return { title: "Skill Not Found" };
  return {
    title: `${skill.name} — Claude Skills`,
    description: skill.description,
  };
}

export default async function SkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = getSkillById(id);
  if (!skill) notFound();

  const manualInstallPath = `~/.claude/skills/${skill.id}/SKILL.md`;
  const npxCommand = `npx skills add anthropics/skills --skill ${skill.id}`;
  const pluginInstallCmd = `npx skills add ${skill.plugin}`;

  const relatedSkills = skills.filter((s) => s.id !== skill.id && s.category === skill.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Claude Skills</span>
          </Link>
          <a
            href="https://github.com/anthropics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            from anthropics
          </a>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            Skills
          </Link>
          <span>›</span>
          <span className="text-gray-400">{skill.plugin}</span>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">{skill.name}</span>
        </nav>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skill Header */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{skill.icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{skill.name}</h1>
                  <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded-full font-medium">
                    {skill.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">from anthropics/{skill.plugin}</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{skill.longDescription}</p>
          </div>

          {/* Installation Methods */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Installation Methods</h2>

            {/* Method 1: npx */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">1</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Skills CLI Install</span>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">Recommended</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-900 dark:bg-gray-950 rounded-xl px-4 py-3">
                <code className="flex-1 text-sm text-green-400 font-mono overflow-x-auto">{npxCommand}</code>
                <CopyButton text={npxCommand} />
              </div>
            </div>

            {/* Method 2: Manual */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center font-bold">2</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Manual Install</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Download the SKILL.md file below and copy it to:
              </p>
              <div className="flex items-center gap-2 bg-gray-900 dark:bg-gray-950 rounded-xl px-4 py-3 mb-3">
                <code className="flex-1 text-sm text-blue-400 font-mono overflow-x-auto">{manualInstallPath}</code>
                <CopyButton text={manualInstallPath} />
              </div>
              <DownloadButton skillId={skill.id} skillName={skill.name} />
            </div>

            {/* Method 3: Plugin install */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center font-bold">3</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Install Full Plugin</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Install the entire {skill.plugin} plugin (includes all related skills):
              </p>
              <div className="flex items-center gap-2 bg-gray-900 dark:bg-gray-950 rounded-xl px-4 py-3">
                <code className="flex-1 text-sm text-green-400 font-mono overflow-x-auto">{pluginInstallCmd}</code>
                <CopyButton text={pluginInstallCmd} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Info</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Plugin</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{skill.plugin}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Skill Name</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{skill.name}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Category</dt>
                <dd>
                  <span className="inline-block text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full">
                    {skill.category}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Source</dt>
                <dd className="font-medium text-gray-900 dark:text-white">anthropics/skills</dd>
              </div>
            </dl>
          </div>

          {/* Related Skills */}
          {relatedSkills.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Related Skills</h3>
              <div className="space-y-3">
                {relatedSkills.map((related) => (
                  <Link
                    key={related.id}
                    href={`/skills/${related.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <span className="text-xl">{related.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                        {related.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{related.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back Link */}
          <Link
            href="/"
            className="block text-center text-sm text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-2"
          >
            ← View all skills
          </Link>
        </div>
      </main>
    </div>
  );
}
