export type ItemType = "skill" | "mcp";

export interface SkillItem {
  id: string;
  type: "skill";
  name: string;
  description: string;
  author: string;
  category: string;
  fileUrl: string;       // Vercel Blob URL
  fileName: string;      // original filename
  installPath: string;   // e.g. ~/.claude/skills/my-skill/SKILL.md
  tags: string[];
  createdAt: string;
  downloadCount: number;
}

export interface McpItem {
  id: string;
  type: "mcp";
  name: string;
  description: string;
  author: string;
  category: string;
  config: string;        // JSON string for .mcp.json
  repoUrl?: string;
  docsUrl?: string;
  tags: string[];
  createdAt: string;
}

export type SharedItem = SkillItem | McpItem;

export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "DevOps",
  "Security",
  "Testing",
  "Documentation",
  "Design",
  "AI/ML",
  "Database",
  "기타",
] as const;

export const MCP_CATEGORIES = [
  "Search",
  "Database",
  "Communication",
  "Productivity",
  "DevTools",
  "Monitoring",
  "AI/ML",
  "File System",
  "기타",
] as const;
