import Link from "next/link";
import { getAllSkills } from "@/lib/db";
import { getAllMcps } from "@/lib/db";
import SkillCard from "@/components/SkillCard";
import McpCard from "@/components/McpCard";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string; category?: string }>;
}) {
  const { tab = "skills", q = "", category = "" } = await searchParams;

  const [skills, mcps] = await Promise.all([getAllSkills(), getAllMcps()]);

  const filteredSkills = skills.filter((s) => {
    const matchQ = !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.description.toLowerCase().includes(q.toLowerCase());
    const matchCat = !category || s.category === category;
    return matchQ && matchCat;
  });

  const filteredMcps = mcps.filter((m) => {
    const matchQ = !q || m.name.toLowerCase().includes(q.toLowerCase()) || m.description.toLowerCase().includes(q.toLowerCase());
    const matchCat = !category || m.category === category;
    return matchQ && matchCat;
  });

  const skillCategories = Array.from(new Set(skills.map((s) => s.category)));
  const mcpCategories = Array.from(new Set(mcps.map((m) => m.category)));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-gray-900 dark:text-white hidden sm:block">내부 스킬 허브</span>
          </Link>
          <div className="flex-1 max-w-md">
            <SearchBar defaultValue={q} tab={tab} category={category} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/guide"
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block"
            >
              가이드
            </Link>
            <Link
              href="/submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <span>+</span>
              <span className="hidden sm:block">공유하기</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-800 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            팀 내부 스킬 & MCP 허브
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            팀원이 만든 Claude Code 스킬과 MCP 서버를 공유하고 바로 설치하세요.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span>🔧 스킬 {skills.length}개</span>
            <span>🔌 MCP {mcps.length}개</span>
            <span>👥 팀 내부 전용</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit mb-6">
          <Link
            href={`/?tab=skills${q ? `&q=${q}` : ""}`}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "skills"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            🔧 Skills ({skills.length})
          </Link>
          <Link
            href={`/?tab=mcp${q ? `&q=${q}` : ""}`}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "mcp"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            🔌 MCP Servers ({mcps.length})
          </Link>
        </div>

        {tab === "skills" && (
          <div className="flex gap-8">
            {/* Category Filter */}
            {skillCategories.length > 0 && (
              <aside className="hidden lg:block w-44 flex-shrink-0">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">카테고리</p>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={`/?tab=skills${q ? `&q=${q}` : ""}`}
                      className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        !category ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      전체
                    </Link>
                  </li>
                  {skillCategories.map((cat) => (
                    <li key={cat}>
                      <Link
                        href={`/?tab=skills&category=${encodeURIComponent(cat)}${q ? `&q=${q}` : ""}`}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          category === cat ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            {/* Skills Grid */}
            <div className="flex-1 pb-12">
              {filteredSkills.length === 0 ? (
                <EmptyState type="skill" q={q} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredSkills.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "mcp" && (
          <div className="flex gap-8">
            {mcpCategories.length > 0 && (
              <aside className="hidden lg:block w-44 flex-shrink-0">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">카테고리</p>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={`/?tab=mcp${q ? `&q=${q}` : ""}`}
                      className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        !category ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      전체
                    </Link>
                  </li>
                  {mcpCategories.map((cat) => (
                    <li key={cat}>
                      <Link
                        href={`/?tab=mcp&category=${encodeURIComponent(cat)}${q ? `&q=${q}` : ""}`}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          category === cat ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <div className="flex-1 pb-12">
              {filteredMcps.length === 0 ? (
                <EmptyState type="mcp" q={q} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredMcps.map((mcp) => (
                    <McpCard key={mcp.id} mcp={mcp} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ type, q }: { type: "skill" | "mcp"; q: string }) {
  return (
    <div className="text-center py-20">
      <p className="text-4xl mb-4">{type === "skill" ? "🔧" : "🔌"}</p>
      {q ? (
        <p className="text-gray-500 dark:text-gray-400">
          &apos;{q}&apos;에 대한 검색 결과가 없습니다.
        </p>
      ) : (
        <>
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            아직 등록된 {type === "skill" ? "스킬" : "MCP"}이 없습니다.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            팀의 첫 번째 {type === "skill" ? "스킬" : "MCP 서버"}를 공유해보세요!
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + 지금 공유하기
          </Link>
        </>
      )}
    </div>
  );
}
