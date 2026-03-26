import Link from "next/link";
import { skills, categories } from "@/lib/skills";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Claude Skills</span>
          </div>
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Anthropic Official Skills
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Supercharge Claude Code with official skills — download and install them to unlock powerful new capabilities.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span>✅ {skills.length} skills available</span>
            <span>📦 Free to download</span>
            <span>🔧 Easy installation</span>
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-5 flex items-center gap-2">
              <span className="inline-block w-1 h-5 bg-orange-400 rounded-full" />
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills
                .filter((s) => s.category === category)
                .map((skill) => (
                  <Link
                    key={skill.id}
                    href={`/skills/${skill.id}`}
                    className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl flex-shrink-0">{skill.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {skill.name}
                          </h3>
                          <span className="flex-shrink-0 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full">
                            {skill.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                          {skill.description}
                        </p>
                        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                          from {skill.plugin}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Official Claude Code skills from Anthropic</p>
        </div>
      </footer>
    </div>
  );
}
