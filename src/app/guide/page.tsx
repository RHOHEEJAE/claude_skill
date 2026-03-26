import Link from "next/link";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span>⚡</span>
            <span className="font-bold text-gray-900 dark:text-white">내부 스킬 허브</span>
          </Link>
          <Link href="/submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
            + 공유하기
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">사용 가이드</h1>
          <p className="text-gray-600 dark:text-gray-400">
            스킬과 MCP 서버를 등록하고 설치하는 방법을 안내합니다.
          </p>
        </div>

        {/* TOC */}
        <nav className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-8">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">목차</p>
          <ol className="space-y-1.5 text-sm">
            <li><a href="#what-is-skill" className="text-orange-600 dark:text-orange-400 hover:underline">1. Skill이란?</a></li>
            <li><a href="#skill-share" className="text-orange-600 dark:text-orange-400 hover:underline">2. 스킬 공유하는 법</a></li>
            <li><a href="#skill-install" className="text-orange-600 dark:text-orange-400 hover:underline">3. 스킬 설치하는 법</a></li>
            <li><a href="#what-is-mcp" className="text-orange-600 dark:text-orange-400 hover:underline">4. MCP 서버란?</a></li>
            <li><a href="#mcp-share" className="text-orange-600 dark:text-orange-400 hover:underline">5. MCP 공유하는 법</a></li>
            <li><a href="#mcp-install" className="text-orange-600 dark:text-orange-400 hover:underline">6. MCP 적용하는 법</a></li>
          </ol>
        </nav>

        <div className="space-y-10">
          {/* Section 1 */}
          <section id="what-is-skill">
            <SectionTitle number="1" icon="🔧" title="Skill이란?" color="orange" />
            <div className="prose-custom">
              <p>
                <strong>Skill</strong>은 Claude Code에게 특정 작업 방식을 미리 가르쳐두는 <strong>SKILL.md 마크다운 파일</strong>입니다.<br />
                한번 설치하면 Claude가 관련 요청을 받을 때 자동으로 해당 방식으로 동작합니다.
              </p>
              <InfoBox color="orange">
                <p className="font-medium mb-1">예시</p>
                <ul>
                  <li>코드 리뷰 스킬 → "이 PR 리뷰해줘" 라고 하면 팀 컨벤션에 맞게 리뷰</li>
                  <li>문서 작성 스킬 → "API 문서 써줘" 라고 하면 사내 양식으로 자동 작성</li>
                  <li>테스트 스킬 → "테스트 추가해줘" 라고 하면 팀의 테스트 패턴대로 작성</li>
                </ul>
              </InfoBox>

              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-5 mb-2">SKILL.md 파일 구조</p>
              <CodeBlock>
{`---
name: skill-name
description: 이 스킬을 언제 사용하는지 트리거 조건 설명.
             "~요청을 받으면", "~를 할 때" 형태로 작성.
---

# 스킬 제목

Claude에게 전달할 지시사항...

## 수행 절차
1. 첫 번째 단계
2. 두 번째 단계

## 규칙
- 반드시 지켜야 할 규칙들`}
              </CodeBlock>

              <InfoBox color="blue">
                <strong>description</strong>이 가장 중요합니다. Claude가 이 텍스트를 보고 "지금 이 스킬을 써야 하는 상황인지" 판단합니다. 트리거 조건을 명확하고 구체적으로 작성하세요.
              </InfoBox>
            </div>
          </section>

          {/* Section 2 */}
          <section id="skill-share">
            <SectionTitle number="2" icon="📤" title="스킬 공유하는 법" color="orange" />
            <div className="prose-custom">
              <StepList steps={[
                {
                  title: "SKILL.md 파일 준비",
                  content: (
                    <p>위 형식에 맞게 SKILL.md를 작성합니다. 파일명은 반드시 <Code>SKILL.md</Code> 이어야 합니다.</p>
                  ),
                },
                {
                  title: "공유하기 폼 열기",
                  content: (
                    <p>상단의 <strong className="text-orange-600">&quot;+ 공유하기&quot;</strong> 버튼을 클릭하고 <strong>Skill</strong> 탭을 선택합니다.</p>
                  ),
                },
                {
                  title: "정보 입력 및 파일 첨부",
                  content: (
                    <ul>
                      <li><strong>스킬 이름</strong> — 소문자, 하이픈 사용 권장 (예: <Code>code-reviewer</Code>)</li>
                      <li><strong>설명</strong> — 어떤 상황에 유용한지 한두 문장으로</li>
                      <li><strong>작성자</strong> — 본인 이름 또는 팀명</li>
                      <li><strong>카테고리</strong> — 가장 적합한 카테고리 선택</li>
                      <li><strong>태그</strong> — 쉼표로 구분 (예: <Code>typescript, review, backend</Code>)</li>
                      <li><strong>SKILL.md 파일</strong> — 파일 첨부</li>
                    </ul>
                  ),
                },
                {
                  title: "제출",
                  content: <p>&quot;스킬 공유하기&quot; 버튼을 누르면 즉시 목록에 반영됩니다.</p>,
                },
              ]} />
            </div>
          </section>

          {/* Section 3 */}
          <section id="skill-install">
            <SectionTitle number="3" icon="📥" title="스킬 설치하는 법" color="orange" />
            <div className="prose-custom">
              <p>스킬 상세 페이지에서 <strong>SKILL.md 다운로드</strong> 버튼을 클릭한 후:</p>

              <StepList steps={[
                {
                  title: "스킬 폴더 생성",
                  content: <CodeBlock>{`mkdir -p ~/.claude/skills/<스킬이름>`}</CodeBlock>,
                },
                {
                  title: "파일 이동",
                  content: <CodeBlock>{`mv ~/Downloads/SKILL.md ~/.claude/skills/<스킬이름>/SKILL.md`}</CodeBlock>,
                },
                {
                  title: "Claude Code 재시작",
                  content: <p>터미널에서 <Code>claude</Code>를 재시작하면 스킬이 자동으로 로드됩니다.</p>,
                },
              ]} />

              <InfoBox color="green">
                설치 확인: Claude에게 <Code>/skills</Code> 라고 입력하면 현재 로드된 스킬 목록을 볼 수 있습니다.
              </InfoBox>
            </div>
          </section>

          {/* Section 4 */}
          <section id="what-is-mcp">
            <SectionTitle number="4" icon="🔌" title="MCP 서버란?" color="blue" />
            <div className="prose-custom">
              <p>
                <strong>MCP (Model Context Protocol)</strong>는 Claude에게 외부 도구와 데이터에 접근할 수 있는 능력을 부여하는 프로토콜입니다.<br />
                MCP 서버를 연결하면 Claude가 데이터베이스 조회, Slack 메시지 발송, API 호출 등을 직접 수행할 수 있게 됩니다.
              </p>
              <InfoBox color="blue">
                <p className="font-medium mb-1">예시</p>
                <ul>
                  <li>Slack MCP → "어제 #dev 채널 요약해줘"</li>
                  <li>DB MCP → "users 테이블에서 오늘 가입한 사람 조회해줘"</li>
                  <li>Jira MCP → "이번 스프린트 이슈 목록 보여줘"</li>
                </ul>
              </InfoBox>
            </div>
          </section>

          {/* Section 5 */}
          <section id="mcp-share">
            <SectionTitle number="5" icon="📤" title="MCP 공유하는 법" color="blue" />
            <div className="prose-custom">
              <p>MCP는 파일이 아니라 <strong>JSON 설정값</strong>을 공유합니다. 아래 형식으로 서버 하나의 설정 객체를 준비하세요.</p>

              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-2">입력 형식 (mcpServers의 값 부분)</p>
              <CodeBlock>
{`{
  "command": "npx",
  "args": ["-y", "@your-org/mcp-server"],
  "env": {
    "API_KEY": "실제_키_입력"
  }
}`}
              </CodeBlock>

              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-5 mb-2">서버 타입별 예시</p>
              <CodeBlock>
{`// npm 패키지 방식
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-..." }
}

// Python 방식
{
  "command": "python",
  "args": ["-m", "my_mcp_server"],
  "env": { "DATABASE_URL": "postgresql://..." }
}

// HTTP/SSE 방식 (내부 서버)
{
  "type": "sse",
  "url": "https://internal-mcp.company.com/sse"
}`}
              </CodeBlock>

              <InfoBox color="orange">
                <strong>env의 실제 키값은 공유하지 마세요.</strong> 플레이스홀더 (예: <Code>YOUR_API_KEY</Code>) 로 대체하고, 팀원이 직접 발급받아 입력하도록 설명을 추가하세요.
              </InfoBox>

              <StepList steps={[
                { title: "공유하기 클릭 → MCP Server 탭 선택", content: null },
                { title: "이름, 설명, 카테고리, JSON 설정 입력", content: null },
                { title: "필요시 GitHub URL과 문서 링크 추가", content: null },
                { title: "\"MCP 공유하기\" 제출", content: null },
              ]} />
            </div>
          </section>

          {/* Section 6 */}
          <section id="mcp-install">
            <SectionTitle number="6" icon="📥" title="MCP 적용하는 법" color="blue" />
            <div className="prose-custom">
              <p>MCP 상세 페이지에서 <strong>설정 복사</strong> 버튼을 클릭한 후:</p>

              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-1">방법 A — 프로젝트 전용 적용</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">프로젝트 루트에 <Code>.mcp.json</Code> 파일을 만들고 붙여넣기:</p>
              <CodeBlock>
{`{
  "mcpServers": {
    "server-name": {
      복사한 설정 붙여넣기
    }
  }
}`}
              </CodeBlock>

              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-5 mb-1">방법 B — 전역 적용 (모든 프로젝트에서 사용)</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2"><Code>~/.claude/settings.json</Code>의 <Code>mcpServers</Code> 항목에 추가:</p>
              <CodeBlock>
{`{
  "mcpServers": {
    "server-name": {
      복사한 설정 붙여넣기
    }
  }
}`}
              </CodeBlock>

              <InfoBox color="green">
                적용 후 Claude Code를 재시작하면 MCP 서버가 연결됩니다. 연결 확인은 <Code>/mcp</Code> 명령어로 확인할 수 있습니다.
              </InfoBox>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">이제 바로 시작해보세요!</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
            팀의 노하우를 스킬과 MCP로 만들어 공유하면, 모두가 더 똑똑한 Claude를 쓸 수 있습니다.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/" className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors">
              목록 보기
            </Link>
            <Link href="/submit" className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
              + 공유하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper Components ─────────────────────────────────────

function SectionTitle({ number, icon, title, color }: { number: string; icon: string; title: string; color: "orange" | "blue" }) {
  const border = color === "orange" ? "border-orange-400" : "border-blue-400";
  return (
    <div className={`flex items-center gap-3 mb-5 pb-3 border-b-2 ${border}`}>
      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white ${color === "orange" ? "bg-orange-500" : "bg-blue-500"}`}>
        {number}
      </span>
      <span className="text-xl">{icon}</span>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
    </div>
  );
}

function InfoBox({ color, children }: { color: "orange" | "blue" | "green"; children: React.ReactNode }) {
  const styles = {
    orange: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300",
    blue: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
    green: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300",
  };
  return (
    <div className={`my-4 p-4 rounded-xl border text-sm leading-relaxed ${styles[color]}`}>
      {children}
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 text-xs text-green-400 font-mono overflow-x-auto my-3 leading-relaxed whitespace-pre-wrap">
      {children}
    </pre>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-xs font-mono">
      {children}
    </code>
  );
}

interface Step {
  title: string;
  content: React.ReactNode;
}

function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="my-4 space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">{step.title}</p>
            {step.content && (
              <div className="text-sm text-gray-600 dark:text-gray-400">{step.content}</div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
