import Link from "next/link";
import { notFound } from "next/navigation";
import { getSkillById } from "@/lib/db";
import SkillEditForm from "@/components/SkillEditForm";

export const dynamic = "force-dynamic";

export default async function SkillEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = await getSkillById(id);
  if (!skill) notFound();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span>⚡</span>
            <span className="font-bold text-gray-900 dark:text-white">헥토 스킬 허브</span>
          </Link>
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <Link href={`/skills/${id}`} className="text-gray-400 hover:text-gray-600 transition-colors">
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">스킬 수정</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{skill.name}</p>
          </div>
        </div>
        <SkillEditForm skill={skill} />
      </div>
    </div>
  );
}
