import Link from "next/link";
import { notFound } from "next/navigation";
import { getSkillById, getAllSkills } from "@/lib/db";
import CopyButton from "@/components/CopyButton";
import SkillDownloadButton from "@/components/SkillDownloadButton";

export const dynamic = "force-dynamic";

export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [skill, allSkills] = await Promise.all([getSkillById(id), getAllSkills()]);
  if (!skill) notFound();

  const related = allSkills.filter((s) => s.id !== id && s.category === skill.category).slice(0, 3);
  const manualPath = skill.installPath;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span>⚡</span>
            <span className="font-bold text-gray-900 dark:text-white">내부 스킬 허브</span>
          </Link>
          <Link href="/submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
            + 공유하기
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-orange-600">홈</Link>
          <span>›</span>
          <Link href="/?tab=skills" className="hover:text-orange-600">Skills</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">{skill.name}</span>
        </nav>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-7">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-5xl">🔧</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{skill.name}</h1>
                  <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded-full font-medium">
                    {skill.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">by {skill.author}</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{skill.description}</p>
            {skill.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Install methods */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-7">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">설치 방법</h2>

            {/* Method 1: Download */}
            <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">1</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">파일 다운로드</span>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">추천</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                SKILL.md를 다운로드하고 아래 경로에 저장하세요:
              </p>
              <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-2 mb-3">
                <code className="flex-1 text-xs text-blue-400 font-mono overflow-x-auto">{manualPath}</code>
                <CopyButton text={manualPath} />
              </div>
              <SkillDownloadButton skillId={skill.id} fileUrl={skill.fileUrl} skillName={skill.name} />
            </div>

            {/* Method 2: Manual mkdir */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center font-bold">2</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">터미널에서 설치</span>
              </div>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-xl px-4 py-3 space-y-1">
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-green-400 font-mono">{`mkdir -p ~/.claude/skills/${skill.name}`}</code>
                  <CopyButton text={`mkdir -p ~/.claude/skills/${skill.name}`} />
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-green-400 font-mono">{`# 다운로드한 SKILL.md를 이동`}</code>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-green-400 font-mono">{`mv ~/Downloads/SKILL.md ${manualPath}`}</code>
                  <CopyButton text={`mv ~/Downloads/SKILL.md ${manualPath}`} />
                </div>
              </div>
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
                <dd className="font-medium text-gray-900 dark:text-white">{skill.author}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">카테고리</dt>
                <dd>
                  <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full">
                    {skill.category}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">다운로드</dt>
                <dd className="font-medium text-gray-900 dark:text-white">{skill.downloadCount}회</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">등록일</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {new Date(skill.createdAt).toLocaleDateString("ko-KR")}
                </dd>
              </div>
            </dl>
          </div>

          {related.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">관련 스킬</h3>
              <div className="space-y-2">
                {related.map((s) => (
                  <Link
                    key={s.id}
                    href={`/skills/${s.id}`}
                    className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <span>🔧</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 truncate">
                        {s.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{s.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link href="/?tab=skills" className="block text-center text-sm text-gray-500 hover:text-orange-600 transition-colors py-2">
            ← 스킬 목록으로
          </Link>
        </div>
      </main>
    </div>
  );
}
