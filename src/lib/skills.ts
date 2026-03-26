export interface Skill {
  id: string;
  plugin: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  icon: string;
  installPath: string;
}

export const skills: Skill[] = [
  {
    id: "frontend-design",
    plugin: "frontend-design",
    name: "frontend-design",
    description: "Create distinctive, production-grade frontend interfaces with high design quality.",
    longDescription: "This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic 'AI slop' aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices. Use when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.",
    category: "Design",
    icon: "🎨",
    installPath: "frontend-design/frontend-design",
  },
  {
    id: "skill-creator",
    plugin: "skill-creator",
    name: "skill-creator",
    description: "Create new skills, modify and improve existing skills, and measure skill performance.",
    longDescription: "Use when users want to create a skill from scratch, update or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy.",
    category: "Development",
    icon: "⚡",
    installPath: "skill-creator/skill-creator",
  },
  {
    id: "claude-automation-recommender",
    plugin: "claude-code-setup",
    name: "claude-automation-recommender",
    description: "Analyze a codebase and recommend Claude Code automations.",
    longDescription: "Analyze a codebase and recommend Claude Code automations (hooks, subagents, skills, plugins, MCP servers). Use when user asks for automation recommendations, wants to optimize their Claude Code setup, mentions improving Claude Code workflows, asks how to first set up Claude Code for a project, or wants to know what Claude Code features they should use.",
    category: "Setup",
    icon: "🤖",
    installPath: "claude-code-setup/claude-automation-recommender",
  },
  {
    id: "claude-md-improver",
    plugin: "claude-md-management",
    name: "claude-md-improver",
    description: "Audit and improve CLAUDE.md files in repositories.",
    longDescription: "Audit and improve CLAUDE.md files in repositories. Use when user asks to check, audit, update, improve, or fix CLAUDE.md files. Scans for all CLAUDE.md files, evaluates quality against templates, outputs quality report, then makes targeted updates. Also use when the user mentions 'CLAUDE.md maintenance' or 'project memory optimization'.",
    category: "Management",
    icon: "📝",
    installPath: "claude-md-management/claude-md-improver",
  },
  {
    id: "plugin-structure",
    plugin: "plugin-dev",
    name: "plugin-structure",
    description: "Scaffold and organize Claude Code plugins with best-practice directory layouts.",
    longDescription: "Use when the user asks to 'create a plugin', 'scaffold a plugin', 'understand plugin structure', 'organize plugin components', 'set up plugin.json', 'use ${CLAUDE_PLUGIN_ROOT}', or needs guidance on plugin directory layout, manifest configuration, component organization, file naming conventions, or Claude Code plugin architecture best practices.",
    category: "Development",
    icon: "🏗️",
    installPath: "plugin-dev/plugin-structure",
  },
  {
    id: "skill-development",
    plugin: "plugin-dev",
    name: "skill-development",
    description: "Create and organize skills with progressive disclosure best practices.",
    longDescription: "Use when the user wants to 'create a skill', 'add a skill to plugin', 'write a new skill', 'improve skill description', 'organize skill content', or needs guidance on skill structure, progressive disclosure, or skill development best practices for Claude Code plugins.",
    category: "Development",
    icon: "🎯",
    installPath: "plugin-dev/skill-development",
  },
  {
    id: "hook-development",
    plugin: "plugin-dev",
    name: "hook-development",
    description: "Create advanced hooks with event-driven automation for Claude Code plugins.",
    longDescription: "Use when the user asks to 'create a hook', 'add a PreToolUse/PostToolUse/Stop hook', 'validate tool use', 'implement prompt-based hooks', or mentions hook events (PreToolUse, PostToolUse, Stop, SubagentStop, SessionStart, SessionEnd, UserPromptSubmit, PreCompact, Notification). Provides comprehensive guidance for creating and implementing Claude Code plugin hooks.",
    category: "Development",
    icon: "🪝",
    installPath: "plugin-dev/hook-development",
  },
  {
    id: "mcp-integration",
    plugin: "plugin-dev",
    name: "mcp-integration",
    description: "Integrate Model Context Protocol servers into Claude Code plugins.",
    longDescription: "Use when the user asks to 'add MCP server', 'integrate MCP', 'configure MCP in plugin', 'use .mcp.json', 'set up Model Context Protocol', or discusses MCP server types (SSE, stdio, HTTP, WebSocket). Provides comprehensive guidance for integrating Model Context Protocol servers into Claude Code plugins for external tool and service integration.",
    category: "Integration",
    icon: "🔌",
    installPath: "plugin-dev/mcp-integration",
  },
  {
    id: "command-development",
    plugin: "plugin-dev",
    name: "command-development",
    description: "Create slash commands with YAML frontmatter and dynamic arguments.",
    longDescription: "Use when the user asks to 'create a slash command', 'add a command', 'write a custom command', 'define command arguments', or needs guidance on slash command structure, YAML frontmatter fields, dynamic arguments, bash execution in commands, user interaction patterns, or command development best practices for Claude Code.",
    category: "Development",
    icon: "⌨️",
    installPath: "plugin-dev/command-development",
  },
  {
    id: "agent-development",
    plugin: "plugin-dev",
    name: "agent-development",
    description: "Create and configure autonomous subagents for Claude Code plugins.",
    longDescription: "Use when the user asks to 'create an agent', 'add an agent', 'write a subagent', or needs guidance on agent structure, system prompts, triggering conditions, or agent development best practices for Claude Code plugins.",
    category: "Development",
    icon: "🤖",
    installPath: "plugin-dev/agent-development",
  },
  {
    id: "writing-rules",
    plugin: "hookify",
    name: "writing-rules",
    description: "Create hookify rules to prevent unwanted behaviors with pattern matching.",
    longDescription: "Use when the user asks to 'create a hookify rule', 'write a hook rule', 'configure hookify', 'add a hookify rule', or needs guidance on hookify rule syntax and patterns.",
    category: "Automation",
    icon: "📏",
    installPath: "hookify/writing-rules",
  },
  {
    id: "playground",
    plugin: "playground",
    name: "playground",
    description: "Create interactive HTML playgrounds with live controls and preview.",
    longDescription: "Creates interactive HTML playgrounds — self-contained single-file explorers that let users configure something visually through controls, see a live preview, and copy out a prompt. Use when the user asks to make a playground, explorer, or interactive tool for a topic.",
    category: "Design",
    icon: "🎮",
    installPath: "playground/playground",
  },
];

export const categories = Array.from(new Set(skills.map((s) => s.category)));

export function getSkillById(id: string): Skill | undefined {
  return skills.find((s) => s.id === id);
}
