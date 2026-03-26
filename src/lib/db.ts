import { kv } from "@vercel/kv";
import type { SkillItem, McpItem, SharedItem } from "./types";

const SKILLS_KEY = "skills:all";
const MCP_KEY = "mcp:all";

// ── Skills ──────────────────────────────────────────────
export async function getAllSkills(): Promise<SkillItem[]> {
  try {
    const items = await kv.lrange<SkillItem>(SKILLS_KEY, 0, -1);
    return items ?? [];
  } catch {
    return [];
  }
}

export async function getSkillById(id: string): Promise<SkillItem | null> {
  const skills = await getAllSkills();
  return skills.find((s) => s.id === id) ?? null;
}

export async function addSkill(skill: SkillItem): Promise<void> {
  await kv.lpush(SKILLS_KEY, skill);
}

export async function incrementSkillDownload(id: string): Promise<void> {
  const skills = await getAllSkills();
  const idx = skills.findIndex((s) => s.id === id);
  if (idx === -1) return;
  skills[idx].downloadCount += 1;
  await kv.del(SKILLS_KEY);
  if (skills.length > 0) {
    await kv.rpush(SKILLS_KEY, ...skills);
  }
}

// ── MCPs ────────────────────────────────────────────────
export async function getAllMcps(): Promise<McpItem[]> {
  try {
    const items = await kv.lrange<McpItem>(MCP_KEY, 0, -1);
    return items ?? [];
  } catch {
    return [];
  }
}

export async function getMcpById(id: string): Promise<McpItem | null> {
  const mcps = await getAllMcps();
  return mcps.find((m) => m.id === id) ?? null;
}

export async function addMcp(mcp: McpItem): Promise<void> {
  await kv.lpush(MCP_KEY, mcp);
}

// ── Combined ─────────────────────────────────────────────
export async function getAllItems(): Promise<SharedItem[]> {
  const [skills, mcps] = await Promise.all([getAllSkills(), getAllMcps()]);
  return [...skills, ...mcps].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
