"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({
  defaultValue,
  tab,
  category,
}: {
  defaultValue: string;
  tab: string;
  category: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("tab", tab);
    if (value) params.set("q", value);
    if (category) params.set("category", category);
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="스킬, MCP 검색..."
        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
      />
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    </form>
  );
}
