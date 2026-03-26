#!/usr/bin/env node

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const API_BASE = process.env.SKILLHUB_URL || "https://claudeskill-orpin.vercel.app";

// ── ANSI colors ──────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  orange: "\x1b[33m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  gray: "\x1b[90m",
  white: "\x1b[97m",
};

const log = {
  info: (msg) => console.log(`${c.blue}ℹ${c.reset} ${msg}`),
  success: (msg) => console.log(`${c.green}✓${c.reset} ${msg}`),
  error: (msg) => console.error(`${c.red}✗${c.reset} ${msg}`),
  warn: (msg) => console.warn(`${c.orange}⚠${c.reset} ${msg}`),
  title: (msg) => console.log(`\n${c.bold}${c.white}${msg}${c.reset}\n`),
  row: (label, value) => console.log(`  ${c.gray}${label.padEnd(14)}${c.reset} ${value}`),
};

// ── HTTP helper ──────────────────────────────────────────
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error("JSON 파싱 실패: " + data.slice(0, 100))); }
      });
    }).on("error", reject);
  });
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const request = (targetUrl) => {
      lib.get(targetUrl, (res) => {
        // follow redirect
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return request(res.headers.location);
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      }).on("error", reject);
    };
    request(url);
  });
}

// ── Commands ─────────────────────────────────────────────

async function cmdList(filter) {
  log.info("스킬 & MCP 목록을 불러오는 중...");
  const [skills, mcps] = await Promise.all([
    fetchJson(`${API_BASE}/api/skills`),
    fetchJson(`${API_BASE}/api/mcp`),
  ]);

  const filteredSkills = filter
    ? skills.filter((s) => s.name.includes(filter) || s.category.includes(filter))
    : skills;
  const filteredMcps = filter
    ? mcps.filter((m) => m.name.includes(filter) || m.category.includes(filter))
    : mcps;

  if (filteredSkills.length > 0) {
    log.title("🔧 Skills");
    filteredSkills.forEach((s) => {
      console.log(`  ${c.orange}${c.bold}${s.name}${c.reset}  ${c.gray}[${s.category}]${c.reset}`);
      console.log(`  ${c.gray}${s.description.slice(0, 70)}...${c.reset}`);
      console.log(`  ${c.gray}by ${s.author} · ⬇ ${s.downloadCount}${c.reset}\n`);
    });
  } else {
    console.log(`  ${c.gray}등록된 스킬이 없습니다.${c.reset}\n`);
  }

  if (filteredMcps.length > 0) {
    log.title("🔌 MCP Servers");
    filteredMcps.forEach((m) => {
      console.log(`  ${c.blue}${c.bold}${m.name}${c.reset}  ${c.gray}[${m.category}]${c.reset}`);
      console.log(`  ${c.gray}${m.description.slice(0, 70)}...${c.reset}`);
      console.log(`  ${c.gray}by ${m.author}${c.reset}\n`);
    });
  } else {
    console.log(`  ${c.gray}등록된 MCP가 없습니다.${c.reset}\n`);
  }
}

async function cmdAddSkill(name) {
  if (!name) {
    log.error("스킬 이름을 입력하세요.\n  예: skillhub add my-skill");
    process.exit(1);
  }

  log.info(`'${name}' 스킬을 찾는 중...`);
  const skills = await fetchJson(`${API_BASE}/api/skills`);
  const skill = skills.find(
    (s) => s.name === name || s.name.toLowerCase() === name.toLowerCase()
  );

  if (!skill) {
    log.error(`'${name}' 스킬을 찾을 수 없습니다.`);
    log.info("등록된 스킬 목록: skillhub list");
    process.exit(1);
  }

  console.log();
  log.row("이름", `${c.bold}${skill.name}${c.reset}`);
  log.row("설명", skill.description.slice(0, 60) + "...");
  log.row("작성자", skill.author);
  log.row("카테고리", skill.category);
  console.log();

  log.info("SKILL.md 다운로드 중...");
  const buffer = await fetchBuffer(skill.fileUrl);

  const skillDir = path.join(os.homedir(), ".claude", "skills", skill.name);
  const skillPath = path.join(skillDir, "SKILL.md");

  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(skillPath, buffer);

  // Increment download count (fire and forget)
  try {
    const body = JSON.stringify({ id: skill.id });
    const url = new URL(`${API_BASE}/api/skills`);
    const lib = url.protocol === "https:" ? https : http;
    const req = lib.request({ hostname: url.hostname, port: url.port, path: url.pathname, method: "PATCH", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } });
    req.write(body);
    req.end();
  } catch {}

  log.success(`설치 완료: ${c.bold}${skillPath}${c.reset}`);
  console.log();
  log.info("Claude Code를 재시작하면 스킬이 활성화됩니다.");
}

async function cmdMcp(name) {
  if (!name) {
    log.error("MCP 이름을 입력하세요.\n  예: skillhub mcp my-mcp");
    process.exit(1);
  }

  log.info(`'${name}' MCP를 찾는 중...`);
  const mcps = await fetchJson(`${API_BASE}/api/mcp`);
  const mcp = mcps.find(
    (m) => m.name === name || m.name.toLowerCase() === name.toLowerCase()
  );

  if (!mcp) {
    log.error(`'${name}' MCP를 찾을 수 없습니다.`);
    log.info("등록된 MCP 목록: skillhub list");
    process.exit(1);
  }

  console.log();
  log.row("이름", `${c.bold}${mcp.name}${c.reset}`);
  log.row("설명", mcp.description.slice(0, 60));
  log.row("작성자", mcp.author);
  if (mcp.repoUrl) log.row("GitHub", mcp.repoUrl);
  console.log();

  const serverKey = mcp.name.toLowerCase().replace(/\s+/g, "-");
  const snippet = JSON.stringify(
    { mcpServers: { [serverKey]: JSON.parse(mcp.config) } },
    null,
    2
  );

  console.log(`${c.gray}아래 설정을 .mcp.json 또는 ~/.claude/settings.json에 추가하세요:${c.reset}\n`);
  console.log(`${c.green}${snippet}${c.reset}\n`);
}

function cmdHelp() {
  console.log(`
${c.bold}${c.orange}⚡ skillhub${c.reset} — 팀 내부 스킬 & MCP 허브 CLI

${c.bold}사용법${c.reset}
  skillhub list [검색어]     스킬 & MCP 전체 목록
  skillhub add <이름>        스킬 설치 (~/.claude/skills/ 에 저장)
  skillhub mcp <이름>        MCP 설정 보기 (.mcp.json 에 추가)
  skillhub help              도움말

${c.bold}예시${c.reset}
  skillhub list
  skillhub list typescript
  skillhub add code-reviewer
  skillhub mcp slack-mcp

${c.bold}환경변수${c.reset}
  SKILLHUB_URL               허브 URL (기본값: ${API_BASE})
`);
}

// ── Entry ────────────────────────────────────────────────
const [,, cmd, arg] = process.argv;

(async () => {
  try {
    switch (cmd) {
      case "list":   await cmdList(arg); break;
      case "add":    await cmdAddSkill(arg); break;
      case "mcp":    await cmdMcp(arg); break;
      case "help":
      case undefined: cmdHelp(); break;
      default:
        log.error(`알 수 없는 명령어: ${cmd}`);
        cmdHelp();
        process.exit(1);
    }
  } catch (err) {
    log.error(err.message);
    process.exit(1);
  }
})();
