# ⚡ 내부 스킬 & MCP 허브

팀 내부에서 Claude Code **스킬**과 **MCP 서버 설정**을 공유하는 내부 플랫폼입니다.

> 개발자가 만든 스킬/MCP를 등록하면, 팀원 누구나 한 번에 받아서 바로 사용할 수 있습니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 📋 **목록 브라우징** | 스킬 / MCP 탭 분리, 카테고리 필터, 키워드 검색 |
| 📥 **스킬 다운로드** | SKILL.md 파일 다운로드 + 설치 경로 안내 |
| 📋 **MCP 설정 복사** | `.mcp.json` 스니펫 원클릭 복사 |
| 🚀 **공유 등록** | 스킬(파일 업로드) / MCP(JSON 입력) 등록 폼 |

---

## 스킬(Skill) 공유 방법

### 1. SKILL.md 파일 준비

`SKILL.md` 파일은 Claude Code가 자동으로 읽는 프롬프트 파일입니다.
기본 형식은 다음과 같습니다:

```markdown
---
name: my-skill-name
description: 이 스킬이 언제 발동되는지 설명. "~할 때 사용", "~를 요청하면" 등의 트리거 조건 포함.
---

# 스킬 본문

Claude에게 전달할 지시사항을 여기에 작성합니다.

## 수행 방법
1. 첫 번째 단계...
2. 두 번째 단계...

## 주의사항
- 반드시 지켜야 할 규칙...
```

**핵심 규칙:**
- `description`은 트리거 조건을 명확하게 작성 (언제 이 스킬을 써야 하는지)
- 본문은 Claude가 수행할 행동을 구체적으로 기술
- 파일명은 반드시 `SKILL.md`

### 2. 허브에 업로드

1. 사이트 상단 **"+ 공유하기"** 클릭
2. **Skill** 탭 선택
3. 정보 입력 후 SKILL.md 파일 첨부
4. **"스킬 공유하기"** 제출

### 3. 팀원이 설치하는 방법

스킬 상세 페이지에서 **SKILL.md 다운로드** 버튼 클릭 후:

```bash
# 스킬 폴더 생성
mkdir -p ~/.claude/skills/<스킬이름>

# 다운로드한 파일 이동
mv ~/Downloads/SKILL.md ~/.claude/skills/<스킬이름>/SKILL.md
```

Claude Code를 재시작하면 자동으로 스킬이 로드됩니다.

---

## MCP 서버 공유 방법

### 1. MCP 서버 설정 JSON 준비

MCP 서버 하나의 설정 객체를 JSON으로 작성합니다.
(`mcpServers` 전체가 아닌, **서버 하나의 값** 부분만 입력)

```json
{
  "command": "npx",
  "args": ["-y", "@your-org/mcp-server-name"],
  "env": {
    "API_KEY": "여기에_실제_키를_입력"
  }
}
```

**서버 타입별 예시:**

```json
// npm 패키지 실행
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-..." }
}

// Python 실행
{
  "command": "python",
  "args": ["-m", "my_mcp_server"],
  "env": { "DATABASE_URL": "postgresql://..." }
}

// SSE (HTTP) 방식
{
  "type": "sse",
  "url": "https://internal-mcp.company.com/sse"
}
```

### 2. 허브에 등록

1. 사이트 상단 **"+ 공유하기"** 클릭
2. **MCP Server** 탭 선택
3. 이름, 설명, 카테고리, JSON 설정 입력
4. GitHub URL, 문서 URL (선택사항) 입력
5. **"MCP 공유하기"** 제출

### 3. 팀원이 적용하는 방법

MCP 상세 페이지에서 설정을 복사 후 프로젝트 루트의 `.mcp.json`에 추가:

```json
{
  "mcpServers": {
    "my-server": {
      // 복사한 설정 붙여넣기
    }
  }
}
```

또는 `~/.claude/settings.json`의 `mcpServers` 항목에 추가하면 전역 적용됩니다.

---

## 로컬 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- Vercel 계정 (KV, Blob 스토리지)

### 설치

```bash
git clone https://github.com/RHOHEEJAE/claude_skill
cd claude_skill
npm install
```

### 환경변수 설정

Vercel 대시보드에서 **Storage** 탭으로 이동:
1. **KV** 데이터베이스 생성 → 프로젝트 연결
2. **Blob** 스토리지 생성 → 프로젝트 연결

로컬 개발용 환경변수 가져오기:

```bash
npx vercel env pull .env.local
```

### 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000` 에서 확인

---

## 기술 스택

- **Next.js 16** — App Router, Server Components
- **Tailwind CSS** — 다크모드 지원
- **Vercel KV** — 스킬/MCP 메타데이터 저장 (Redis)
- **Vercel Blob** — SKILL.md 파일 저장
- **Vercel** — 호스팅 (GitHub 푸시 시 자동 배포)

---

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                  # 메인 목록 (Skills / MCP 탭)
│   ├── skills/[id]/page.tsx      # 스킬 상세 + 다운로드
│   ├── mcp/[id]/page.tsx         # MCP 상세 + 설정 복사
│   ├── submit/page.tsx           # 공유 등록 폼
│   └── api/
│       ├── skills/route.ts       # 스킬 CRUD API
│       └── mcp/route.ts          # MCP CRUD API
├── components/
│   ├── SkillCard.tsx
│   ├── McpCard.tsx
│   ├── SubmitForm.tsx
│   ├── SearchBar.tsx
│   ├── CopyButton.tsx
│   └── SkillDownloadButton.tsx
└── lib/
    ├── db.ts                     # Vercel KV 연산
    └── types.ts                  # TypeScript 타입 정의
```
