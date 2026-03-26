import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
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

    // 업로드 파일 확장자 그대로 유지 (.md 또는 .skill)
    const ext = file.name.endsWith(".skill") ? ".skill" : ".md";
    const safeName = name.toLowerCase().replace(/\s+/g, "-");
    const storedFileName = ext === ".skill" ? `${safeName}${ext}` : "SKILL.md";
    const storagePath = `skills/${safeName}/${storedFileName}`;

    // Supabase Storage에 업로드
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("skill-files")
      .upload(storagePath, arrayBuffer, {
        contentType: "text/plain",
        upsert: true,
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json({ error: "파일 업로드 중 오류가 발생했습니다." }, { status: 500 });
    }

    // Public URL 생성
    const { data: urlData } = supabase.storage
      .from("skill-files")
      .getPublicUrl(storagePath);

    const skillId = uuidv4();
    const installPath = `~/.claude/skills/${safeName}/${storedFileName}`;

    const skill: SkillItem = {
      id: skillId,
      type: "skill",
      name,
      description,
      author,
      category,
      fileUrl: urlData.publicUrl,
      fileName: storedFileName,
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
