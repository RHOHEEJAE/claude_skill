import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { addMcp, getAllMcps, updateMcp, deleteMcp } from "@/lib/db";
import type { McpItem } from "@/lib/types";

export async function GET() {
  const mcps = await getAllMcps();
  return NextResponse.json(mcps);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, author, category, config, repoUrl, docsUrl, tags } = body;

    if (!name || !description || !author || !category || !config) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    // Validate JSON config
    try {
      JSON.parse(config);
    } catch {
      return NextResponse.json({ error: "MCP 설정이 올바른 JSON 형식이 아닙니다." }, { status: 400 });
    }

    const mcp: McpItem = {
      id: uuidv4(),
      type: "mcp",
      name,
      description,
      author,
      category,
      config,
      repoUrl: repoUrl || undefined,
      docsUrl: docsUrl || undefined,
      tags: (tags ?? "").split(",").map((t: string) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };

    await addMcp(mcp);
    return NextResponse.json(mcp, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "등록 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, description, author, category, config, repoUrl, docsUrl, tags } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    try { JSON.parse(config); } catch {
      return NextResponse.json({ error: "MCP 설정이 올바른 JSON 형식이 아닙니다." }, { status: 400 });
    }
    await updateMcp(id, {
      name, description, author, category, config,
      repoUrl: repoUrl || undefined,
      docsUrl: docsUrl || undefined,
      tags: (tags ?? "").split(",").map((t: string) => t.trim()).filter(Boolean),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "수정 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await deleteMcp(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
