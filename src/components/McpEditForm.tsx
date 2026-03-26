"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MCP_CATEGORIES } from "@/lib/types";
import type { McpItem } from "@/lib/types";

const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent";

export default function McpEditForm({ mcp }: { mcp: McpItem }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(mcp.name);
  const [desc, setDesc] = useState(mcp.description);
  const [author, setAuthor] = useState(mcp.author);
  const [category, setCategory] = useState(mcp.category);
  const [config, setConfig] = useState(mcp.config);
  const [repoUrl, setRepoUrl] = useState(mcp.repoUrl ?? "");
  const [docsUrl, setDocsUrl] = useState(mcp.docsUrl ?? "");
  const [tags, setTags] = useState(mcp.tags.join(", "));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mcp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: mcp.id, name, description: desc, author, category, config, repoUrl, docsUrl, tags }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "오류가 발생했습니다.");
      }
      router.push(`/mcp/${mcp.id}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`'${mcp.name}' MCP를 정말 삭제하시겠습니까?`)) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/mcp", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: mcp.id }),
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

      <Field label="MCP 이름 *" htmlFor="name">
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
            {MCP_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <Field label="MCP 서버 설정 (JSON) *" htmlFor="config" hint="command, args, env 등">
        <textarea
          id="config"
          required
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          rows={8}
          className={`${inputCls} font-mono text-xs`}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="GitHub URL" htmlFor="repoUrl">
          <input id="repoUrl" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/..." className={inputCls} />
        </Field>
        <Field label="문서 URL" htmlFor="docsUrl">
          <input id="docsUrl" value={docsUrl} onChange={(e) => setDocsUrl(e.target.value)} placeholder="https://..." className={inputCls} />
        </Field>
      </div>

      <Field label="태그" htmlFor="tags" hint="쉼표로 구분">
        <input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="docker, gateway" className={inputCls} />
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
