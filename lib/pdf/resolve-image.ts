import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_BASE =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "public");

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function bufferToDataUri(buffer: Buffer, ext: string): string {
  const mime = MIME_MAP[ext] || "image/jpeg";
  const base64 = buffer.toString("base64");
  return `data:${mime};base64,${base64}`;
}

async function resolveFromDisk(urlOrPath: string): Promise<string | null> {
  let filePath: string;

  // ★ 새 형식: /api/uploads/designs?file=xxx.jpg
  if (urlOrPath.includes("/api/uploads/designs")) {
    const url = new URL(urlOrPath, "http://localhost");
    const fileName = url.searchParams.get("file");
    if (!fileName) {
      console.warn(`[resolve-image] 파일명 파라미터 없음: ${urlOrPath}`);
      return null;
    }
    const safeName = path.basename(fileName);

    // 여러 경로 후보 시도
    const candidates = [
      path.join(UPLOAD_BASE, "uploads", "designs", safeName),
      path.join(process.cwd(), "public", "uploads", "designs", safeName),
      path.join(process.cwd(), "uploads", "designs", safeName),
      path.join("/app/public", "uploads", "designs", safeName),  // Docker
    ];

    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        const buffer = await readFile(candidate);
        const ext = path.extname(candidate).toLowerCase();
        return bufferToDataUri(buffer, ext);
      }
    }

    console.warn(`[resolve-image] 파일 없음 (후보 ${candidates.length}개 모두 실패): ${urlOrPath}`);
    return null;
  }
  // 기존 형식: /uploads/designs/xxx.jpg
  else {
    const candidates = [
      path.join(UPLOAD_BASE, urlOrPath),
      path.join(process.cwd(), "public", urlOrPath),
      path.join("/app/public", urlOrPath),  // Docker
    ];

    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        const buffer = await readFile(candidate);
        const ext = path.extname(candidate).toLowerCase();
        return bufferToDataUri(buffer, ext);
      }
    }

    console.warn(`[resolve-image] 파일 없음: ${urlOrPath}`);
    return null;
  }
}

export async function resolveImageSrc(
  urlOrPath: string,
): Promise<string | null> {
  try {
    // 절대 URL(http/https)이면 fetch로 가져와서 base64 변환
    if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
      try {
        const res = await fetch(urlOrPath);
        if (!res.ok) return null;
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const ext = path.extname(new URL(urlOrPath).pathname).toLowerCase() || ".jpg";
        return bufferToDataUri(buffer, ext);
      } catch {
        console.warn(`[resolve-image] HTTP fetch 실패: ${urlOrPath}`);
        return null;
      }
    }

    // data URI면 그대로 반환
    if (urlOrPath.startsWith("data:")) {
      return urlOrPath;
    }

    // 디스크에서 resolve 시도
    return await resolveFromDisk(urlOrPath);
  } catch (error) {
    console.error(`[resolve-image] 이미지 변환 실패: ${urlOrPath}`, error);
    return null;
  }
}
