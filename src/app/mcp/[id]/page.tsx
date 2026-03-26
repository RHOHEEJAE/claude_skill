import Link from "next/link";
import { notFound } from "next/navigation";
import { getMcpById, getAllMcps } from "@/lib/db";
import CopyButton from "@/components/CopyButton";

export const dynamic = "force-dynamic";

export default async function McpDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [mcp, allMcps] = await Promise.all([getMcpById(id), getAllMcps()]);
  if (!mcp) notFound();

  const related = allMcps.filter((m) => m.id !== id && m.category === mcp.category).slice(0, 3);

  // Build the .mcp.json snippet
  let configObj: Record<string, unknown> = {};
  try {
    configObj = JSON.parse(mcp.config);
  } catch {
    configObj = {};
  }

  const mcpJsonSnippet = JSON.stringify(
    { mcpServers: { [mcp.name.toLowerCase().replace(/\s+/g, "-")]: configObj } },
    null,
    2
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span>⚡</span>
            <span className="font-bold text-gray-900 dark:text-white">헥토 스킬 허브</span>
          </Link>
          <div className="flex gap-2">
            <Link href={`/mcp/${id}/edit`} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
              ✏️ 수정
            </Link>
            <Link href="/submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
              + 공유하기
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-blue-600">홈</Link>
          <span>›</span>
          <Link href="/?tab=mcp" className="hover:text-blue-600">MCP Servers</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">{mcp.name}</span>
        </nav>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-7">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-5xl">🔌</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{mcp.name}</h1>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full font-medium">
                    {mcp.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">by {mcp.author}</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{mcp.description}</p>
            <div className="flex gap-3 flex-wrap">
              {mcp.repoUrl && (
                <a href={mcp.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </a>
              )}
              {mcp.docsUrl && (
                <a href={mcp.docsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  📄 문서
                </a>
              )}
            </div>
            {mcp.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {mcp.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Config */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-7">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">설치 방법</h2>

            {/* CLI */}
            <div className="mb-5 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">1</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">CLI로 설정 확인</span>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">추천</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-2">
                <code className="flex-1 text-xs text-green-400 font-mono overflow-x-auto">{`npx skillhub mcp ${mcp.name}`}</code>
                <CopyButton text={`npx skillhub mcp ${mcp.name}`} />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">직접 복사해서 적용</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              아래 설정을 복사하여 프로젝트의 <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">.mcp.json</code> 또는{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">~/.claude/settings.json</code>의 mcpServers에 추가하세요.
            </p>

            {/* .mcp.json snippet */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">.mcp.json</span>
                <CopyButton text={mcpJsonSnippet} />
              </div>
              <pre className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 text-xs text-green-400 font-mono overflow-x-auto">
                {mcpJsonSnippet}
              </pre>
            </div>

            {/* Raw server config */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">서버 설정만 (mcpServers 값)</span>
                <CopyButton text={mcp.config} />
              </div>
              <pre className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 text-xs text-blue-400 font-mono overflow-x-auto">
                {mcp.config}
              </pre>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">정보</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">작성자</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{mcp.author}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">카테고리</dt>
                <dd>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                    {mcp.category}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">등록일</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {new Date(mcp.createdAt).toLocaleDateString("ko-KR")}
                </dd>
              </div>
            </dl>
          </div>

          {related.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">관련 MCP</h3>
              <div className="space-y-2">
                {related.map((m) => (
                  <Link
                    key={m.id}
                    href={`/mcp/${m.id}`}
                    className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <span>🔌</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                        {m.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{m.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link href="/?tab=mcp" className="block text-center text-sm text-gray-500 hover:text-blue-600 transition-colors py-2">
            ← MCP 목록으로
          </Link>
        </div>
      </main>
    </div>
  );
}
