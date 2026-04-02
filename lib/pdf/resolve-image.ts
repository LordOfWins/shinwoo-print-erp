import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

/**
 * 상대 URL ("/uploads/designs/xxx.jpg")을
 * @react-pdf/renderer가 이해할 수 있는 형태로 변환
 *
 * 방식: 파일 시스템에서 직접 읽어 data URI로 반환
 * -> Docker 내부에서 HTTP self-fetch 없이 안정적으로 동작
 */

const UPLOAD_BASE =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "public");

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function resolveImageSrc(
  urlOrPath: string,
): Promise<string | null> {
  try {
    // 절대 URL(http/https)이면 그대로 반환 (외부 이미지)
    if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
      return urlOrPath;
    }

    // 상대 경로 -> 파일 시스템 절대 경로로 변환
    // DB값: "/uploads/designs/xxx.jpg"
    // 파일 위치: UPLOAD_BASE + "/uploads/designs/xxx.jpg"
    //   개발: public/uploads/designs/xxx.jpg
    //   Docker: /app/public/uploads/designs/xxx.jpg
    const filePath = path.join(UPLOAD_BASE, urlOrPath);

    if (!existsSync(filePath)) {
      console.warn(`[resolve-image] 파일 없음: ${filePath}`);
      return null;
    }

    const buffer = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_MAP[ext] || "image/jpeg";

    // data URI 형태로 변환
    const base64 = buffer.toString("base64");
    return `data:${mime};base64,${base64}`;
  } catch (error) {
    console.error(`[resolve-image] 이미지 변환 실패: ${urlOrPath}`, error);
    return null;
  }
}
