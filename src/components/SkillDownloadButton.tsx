"use client";

export default function SkillDownloadButton({
  skillId,
  fileUrl,
  skillName,
}: {
  skillId: string;
  fileUrl: string;
  skillName: string;
}) {
  const handleDownload = async () => {
    // Increment download count
    await fetch("/api/skills", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: skillId }),
    });

    // Trigger download from Blob URL
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = "SKILL.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      SKILL.md 다운로드
    </button>
  );
}
