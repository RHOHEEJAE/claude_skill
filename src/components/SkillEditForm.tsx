"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SKILL_CATEGORIES } from "@/lib/types";
import type { SkillItem } from "@/lib/types";

const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent";

export default function SkillEditForm({ skill }: { skill: SkillItem }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(skill.name);
  const [desc, setDesc] = useState(skill.description);
  const [author, setAuthor] = useState(skill.author);
  const [category, setCategory] = useState(skill.category);
  const [tags, setTags] = useState(skill.tags.join(", "));
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("id", skill.id);
      formData.append("name", name);
      formData.append("description", desc);
      formData.append("author", author);
      formData.append("category", category);
      formData.append("tags", tags);
      if (file) formData.append("file", file);

      const res = await fetch("/api/skills", { method: "PUT", body: formData });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "오류가 발생했습니다.");
      }
      router.push(`/skills/${skill.id}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`'${skill.name}' 스킬을 정말 삭제하시겠습니까?`)) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/skills", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: skill.id }),
      });
      if (!res.ok) throw new Error("삭제 실패");
      router.push("/");
      router.refresh();
    } catch {
      setError("삭제 중 오류가 발생했습니다.");
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <Field label="스킬 이름 *" htmlFor="name">
        <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
      </Field>

      <Field label="설명 *" htmlFor="desc">
        <textarea id="desc" required value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className={inputCls} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="작성자 *" htmlFor="author">
          <input id="author" required value={author} onChange={(e) => setAuthor(e.target.value)} className={inputCls} />
        </Field>
        <Field label="카테고리 *" htmlFor="category">
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {SKILL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <Field label="태그" htmlFor="tags" hint="쉼표로 구분">
        <input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="review, typescript" className={inputCls} />
      </Field>

      <Field label="스킬 파일 교체 (.md / .skill)" htmlFor="file" hint="선택하지 않으면 기존 파일 유지">
        <div className={`${inputCls} p-0 overflow-hidden`}>
          <input
            id="file"
            type="file"
            accept=".md,.skill,text/markdown,text/plain"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2.5 file:px-4 file:border-0 file:border-r file:border-gray-200 dark:file:border-gray-700 file:bg-gray-50 dark:file:bg-gray-800 file:text-sm file:font-medium file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-100 dark:hover:file:bg-gray-700 cursor-pointer"
          />
        </div>
        {!file && (
          <p className="text-xs text-gray-400 mt-1">현재 파일: {skill.fileName}</p>
        )}
      </Field>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-medium transition-colors"
        >
          {loading ? "저장 중..." : "저장하기"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="px-5 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl font-medium transition-colors"
        >
          {deleting ? "삭제 중..." : "삭제"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
        {hint && <span className="ml-2 text-xs text-gray-400 font-normal">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
