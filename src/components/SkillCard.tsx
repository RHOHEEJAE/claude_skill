import Link from "next/link";
import type { SkillItem } from "@/lib/types";

export default function SkillCard({ skill }: { skill: SkillItem }) {
  const timeAgo = getTimeAgo(skill.createdAt);

  return (
    <Link
      href={`/skills/${skill.id}`}
      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl flex-shrink-0">🔧</span>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {skill.name}
          </h3>
        </div>
        <span className="flex-shrink-0 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full">
          {skill.category}
        </span>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
        {skill.description}
      </p>

      {skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skill.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-800">
        <span>by {skill.author}</span>
        <div className="flex items-center gap-3">
          <span>⬇ {skill.downloadCount}</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </Link>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}달 전`;
}
