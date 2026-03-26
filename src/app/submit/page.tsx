import Link from "next/link";
import SubmitForm from "@/components/SubmitForm";

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span>⚡</span>
            <span className="font-bold text-gray-900 dark:text-white">내부 스킬 허브</span>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">스킬 / MCP 공유하기</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            팀원들과 공유할 스킬이나 MCP 서버를 등록하세요.
          </p>
        </div>
        <SubmitForm />
      </div>
    </div>
  );
}
