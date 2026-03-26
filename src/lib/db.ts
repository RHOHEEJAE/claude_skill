import { supabase } from "./supabase";
import type { SkillItem, McpItem, SharedItem } from "./types";

// ── Skills ──────────────────────────────────────────────
export async function getAllSkills(): Promise<SkillItem[]> {
  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToSkill);
  } catch {
    return [];
  }
}

export async function getSkillById(id: string): Promise<SkillItem | null> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return rowToSkill(data);
}

export async function addSkill(skill: SkillItem): Promise<void> {
  const { error } = await supabase.from("skills").insert({
    id: skill.id,
    name: skill.name,
    description: skill.description,
    author: skill.author,
    category: skill.category,
    file_url: skill.fileUrl,
    file_name: skill.fileName,
    install_path: skill.installPath,
    tags: skill.tags,
    download_count: 0,
  });
  if (error) throw error;
}

export async function incrementSkillDownload(id: string): Promise<void> {
  await supabase.rpc("increment_download", { skill_id: id });
}

// ── MCPs ────────────────────────────────────────────────
export async function getAllMcps(): Promise<McpItem[]> {
  try {
    const { data, error } = await supabase
      .from("mcps")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToMcp);
  } catch {
    return [];
  }
}

export async function getMcpById(id: string): Promise<McpItem | null> {
  const { data, error } = await supabase
    .from("mcps")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return rowToMcp(data);
}

export async function addMcp(mcp: McpItem): Promise<void> {
  const { error } = await supabase.from("mcps").insert({
    id: mcp.id,
    name: mcp.name,
    description: mcp.description,
    author: mcp.author,
    category: mcp.category,
    config: mcp.config,
    repo_url: mcp.repoUrl ?? null,
    docs_url: mcp.docsUrl ?? null,
    tags: mcp.tags,
  });
  if (error) throw error;
}

// ── Combined ─────────────────────────────────────────────
export async function getAllItems(): Promise<SharedItem[]> {
  const [skills, mcps] = await Promise.all([getAllSkills(), getAllMcps()]);
  return [...skills, ...mcps].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// ── Row mappers ───────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToSkill(row: any): SkillItem {
  return {
    id: row.id,
    type: "skill",
    name: row.name,
    description: row.description,
    author: row.author,
    category: row.category,
    fileUrl: row.file_url,
    fileName: row.file_name,
    installPath: row.install_path,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    downloadCount: row.download_count ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToMcp(row: any): McpItem {
  return {
    id: row.id,
    type: "mcp",
    name: row.name,
    description: row.description,
    author: row.author,
    category: row.category,
    config: row.config,
    repoUrl: row.repo_url ?? undefined,
    docsUrl: row.docs_url ?? undefined,
    tags: row.tags ?? [],
    createdAt: row.created_at,
  };
}
