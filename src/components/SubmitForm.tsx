"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SKILL_CATEGORIES, MCP_CATEGORIES } from "@/lib/types";

type TabType = "skill" | "mcp";

const DEFAULT_MCP_CONFIG = `{
  "command": "npx",
  "args": ["-y", "@your-org/mcp-server-name"],
  "env": {
    "API_KEY": "your-api-key"
  }
}`;

export default function SubmitForm() {
  const router = useRouter();
  const [tab, setTab] = useState<TabType>("skill");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Skill fields
  const [skillName, setSkillName] = useState("");
  const [skillDesc, setSkillDesc] = useState("");
  const [skillAuthor, setSkillAuthor] = useState("");
  const [skillCategory, setSkillCategory] = useState<string>(SKILL_CATEGORIES[0]);
  const [skillTags, setSkillTags] = useState("");
  const [skillFile, setSkillFile] = useState<File | null>(null);

  // MCP fields
  const [mcpName, setMcpName] = useState("");
  const [mcpDesc, setMcpDesc] = useState("");
  const [mcpAuthor, setMcpAuthor] = useState("");
  const [mcpCategory, setMcpCategory] = useState<string>(MCP_CATEGORIES[0]);
  const [mcpConfig, setMcpConfig] = useState(DEFAULT_MCP_CONFIG);
  const [mcpTags, setMcpTags] = useState("");
  const [mcpRepo, setMcpRepo] = useState("");
  const [mcpDocs, setMcpDocs] = useState("");

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillFile) { setError("스킬 파일을 선택해주세요. (.md 또는 .skill)"); return; }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", skillName);
      formData.append("description", skillDesc);
      formData.append("author", skillAuthor);
      formData.append("category", skillCategory);
      formData.append("tags", skillTags);
      formData.append("file", skillFile);
      const res = await fetch("/api/skills", { method: "POST", body: formData });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "오류가 발생했습니다."); }
      const skill = await res.json();
      router.push(`/skills/${skill.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleMcpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: mcpName,
          description: mcpDesc,
          author: mcpAuthor,
          category: mcpCategory,
          config: mcpConfig,
          tags: mcpTags,
          repoUrl: mcpRepo,
          docsUrl: mcpDocs,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "오류가 발생했습니다."); }
      const mcp = await res.json();
      router.push(`/mcp/${mcp.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Tab */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-7 w-fit">
        {(["skill", "mcp"] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(""); }}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {t === "skill" ? "🔧 Skill" : "🔌 MCP Server"}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {tab === "skill" ? (
        <form onSubmit={handleSkillSubmit} className="space-y-5">
          <Field label="스킬 이름 *" htmlFor="skill-name">
            <input id="skill-name" required value={skillName} onChange={(e) => setSkillName(e.target.value)}
              placeholder="예: code-reviewer" className={inputCls} />
          </Field>
          <Field label="설명 *" htmlFor="skill-desc">
            <textarea id="skill-desc" required value={skillDesc} onChange={(e) => setSkillDesc(e.target.value)}
              placeholder="이 스킬이 하는 일을 간략하게 설명해주세요." rows={3} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="작성자 *" htmlFor="skill-author">
              <input id="skill-author" required value={skillAuthor} onChange={(e) => setSkillAuthor(e.target.value)}
                placeholder="홍길동" className={inputCls} />
            </Field>
            <Field label="카테고리 *" htmlFor="skill-cat">
              <select id="skill-cat" value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} className={inputCls}>
                {SKILL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="태그" htmlFor="skill-tags" hint="쉼표로 구분 (예: review, typescript, backend)">
            <input id="skill-tags" value={skillTags} onChange={(e) => setSkillTags(e.target.value)}
              placeholder="review, typescript" className={inputCls} />
          </Field>
          <Field label="스킬 파일 * (.md / .skill)" htmlFor="skill-file" hint="SKILL.md 또는 python-dev.skill 등">
            <div className={`${inputCls} p-0 overflow-hidden`}>
              <input
                id="skill-file"
                type="file"
                accept=".md,.skill,text/markdown,text/plain"
                required
                onChange={(e) => setSkillFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2.5 file:px-4 file:border-0 file:border-r file:border-gray-200 dark:file:border-gray-700 file:bg-gray-50 dark:file:bg-gray-800 file:text-sm file:font-medium file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-100 dark:hover:file:bg-gray-700 cursor-pointer"
              />
            </div>
          </Field>
          <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-medium transition-colors">
            {loading ? "업로드 중..." : "스킬 공유하기"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMcpSubmit} className="space-y-5">
          <Field label="MCP 이름 *" htmlFor="mcp-name">
            <input id="mcp-name" required value={mcpName} onChange={(e) => setMcpName(e.target.value)}
              placeholder="예: slack-mcp" className={inputCls} />
          </Field>
          <Field label="설명 *" htmlFor="mcp-desc">
            <textarea id="mcp-desc" required value={mcpDesc} onChange={(e) => setMcpDesc(e.target.value)}
              placeholder="이 MCP 서버가 제공하는 기능을 설명해주세요." rows={3} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="작성자 *" htmlFor="mcp-author">
              <input id="mcp-author" required value={mcpAuthor} onChange={(e) => setMcpAuthor(e.target.value)}
                placeholder="홍길동" className={inputCls} />
            </Field>
            <Field label="카테고리 *" htmlFor="mcp-cat">
              <select id="mcp-cat" value={mcpCategory} onChange={(e) => setMcpCategory(e.target.value)} className={inputCls}>
                {MCP_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="MCP 서버 설정 (JSON) *" htmlFor="mcp-config" hint='mcpServers의 값 부분만 입력하세요 (command, args, env 등)'>
            <textarea
              id="mcp-config"
              required
              value={mcpConfig}
              onChange={(e) => setMcpConfig(e.target.value)}
              rows={8}
              className={`${inputCls} font-mono text-xs`}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="GitHub URL" htmlFor="mcp-repo">
              <input id="mcp-repo" value={mcpRepo} onChange={(e) => setMcpRepo(e.target.value)}
                placeholder="https://github.com/..." className={inputCls} />
            </Field>
            <Field label="문서 URL" htmlFor="mcp-docs">
              <input id="mcp-docs" value={mcpDocs} onChange={(e) => setMcpDocs(e.target.value)}
                placeholder="https://..." className={inputCls} />
            </Field>
          </div>
          <Field label="태그" htmlFor="mcp-tags" hint="쉼표로 구분">
            <input id="mcp-tags" value={mcpTags} onChange={(e) => setMcpTags(e.target.value)}
              placeholder="slack, messaging, notification" className={inputCls} />
          </Field>
          <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-medium transition-colors">
            {loading ? "등록 중..." : "MCP 공유하기"}
          </button>
        </form>
      )}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent";

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
