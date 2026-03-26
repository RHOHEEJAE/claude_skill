import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import { addSkill, getAllSkills, incrementSkillDownload, updateSkill, deleteSkill } from "@/lib/db";
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

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const updates: Record<string, unknown> = {
      name: formData.get("name"),
      description: formData.get("description"),
      author: formData.get("author"),
      category: formData.get("category"),
      tags: (formData.get("tags") as string ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    };

    // 새 파일이 있으면 교체
    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      const ext = file.name.endsWith(".skill") ? ".skill" : ".md";
      const safeName = (updates.name as string).toLowerCase().replace(/\s+/g, "-");
      const storedFileName = ext === ".skill" ? `${safeName}${ext}` : "SKILL.md";
      const storagePath = `skills/${safeName}/${storedFileName}`;
      const arrayBuffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from("skill-files")
        .upload(storagePath, arrayBuffer, { contentType: "text/plain", upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("skill-files").getPublicUrl(storagePath);
      updates.fileUrl = urlData.publicUrl;
      updates.fileName = storedFileName;
      updates.installPath = `~/.claude/skills/${safeName}/${storedFileName}`;
    }

    await updateSkill(id, updates as Parameters<typeof updateSkill>[1]);
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
    await deleteSkill(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
