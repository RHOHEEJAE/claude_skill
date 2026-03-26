import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";
import { addSkill, getAllSkills, incrementSkillDownload } from "@/lib/db";
import type { SkillItem } from "@/lib/types";

export async function GET() {
  const skills = await getAllSkills();
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const tags = (formData.get("tags") as string ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const file = formData.get("file") as File;

    if (!name || !description || !author || !category || !file) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    // Upload SKILL.md to Vercel Blob
    const blob = await put(`skills/${name.toLowerCase().replace(/\s+/g, "-")}/SKILL.md`, file, {
      access: "public",
    });

    const skillId = uuidv4();
    const installPath = `~/.claude/skills/${name.toLowerCase().replace(/\s+/g, "-")}/SKILL.md`;

    const skill: SkillItem = {
      id: skillId,
      type: "skill",
      name,
      description,
      author,
      category,
      fileUrl: blob.url,
      fileName: file.name,
      installPath,
      tags,
      createdAt: new Date().toISOString(),
      downloadCount: 0,
    };

    await addSkill(skill);
    return NextResponse.json(skill, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "업로드 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await incrementSkillDownload(id);
  return NextResponse.json({ ok: true });
}
