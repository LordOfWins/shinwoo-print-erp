// prisma/seed.ts
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/client";

dotenv.config();

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "shinwoo_erp",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 시딩 시작...");

  // ===== 1. 회사정보 =====
  await prisma.companyInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyName: "신우씨링",
      representative: "남정숙",
      address: "부산광역시 대청동2가 19번지",
      phone: "051-469-6535",
      fax: "051-464-3555",
      businessNumber: "602-36-62290",
      businessType: "제조",
      businessItem: "렛델,인쇄",
    },
  });
  console.log("✅ 회사정보");

  // ===== 2. 은행계좌 =====
  const existingAccounts = await prisma.bankAccount.count();
  if (existingAccounts === 0) {
    await prisma.bankAccount.create({
      data: {
        bankName: "하나은행",
        accountNumber: "184-890174-32205",
        accountHolder: "남정숙",
        isDefault: true,
        sortOrder: 1,
      },
    });
  }
  console.log("✅ 은행계좌");

  // ===== 3. 시스템 옵션 =====
  const optionData: { category: string; items: string[] }[] = [
    {
      category: "PRINT_TYPE",
      items: [
        "로터리",
        "디지털",
        "평압",
        "플렉소",
        "외주",
        "Zebra인쇄",
        "리본",
      ],
    },
    { category: "UNIT", items: ["매", "롤", "장", "EA", "박스", "부", "기타"] },
    { category: "SHAPE", items: ["사각", "원형", "특수"] },
    { category: "LAMI", items: ["투명", "무광", "유광"] },
    { category: "FOIL", items: ["금박", "은박", "청박", "적박"] },
    { category: "CUTTING_TYPE", items: ["롤", "시트"] },
    { category: "PACKAGING", items: ["비닐", "박스", "팔렛트"] },
    { category: "COURIER", items: ["CJ", "경동", "우체국"] },
    { category: "ROLL_DIR", items: ["위", "아래", "좌", "우"] },
    { category: "DATA_TYPE", items: ["기존", "수정", "신규"] },
    { category: "DESIGN_STATUS", items: ["폐기", "보유"] },
    { category: "DIE_CUTTER", items: ["보유", "주문"] },
    { category: "RESIN_PLATE", items: ["보유", "주문"] },
    {
      category: "ESTIMATE_STAGE",
      items: ["1차제안", "2차제안", "LOST", "계약체결"],
    },
    { category: "DELIVERY_METHOD", items: ["직배송", "택배"] },
  ];

  for (const { category, items } of optionData) {
    for (let i = 0; i < items.length; i++) {
      await prisma.systemOption.upsert({
        where: { category_value: { category, value: items[i] } },
        update: { sortOrder: i + 1 },
        create: {
          category,
          label: items[i],
          value: items[i],
          sortOrder: i + 1,
        },
      });
    }
  }
  console.log("✅ 시스템 옵션");

  // ===== 4. 원단 55종 =====
  const existingMaterials = await prisma.material.count();
  if (existingMaterials === 0) {
    const materials = [
      {
        paperType: "아트지",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "90g",
        manufacturer: "부산인더스트리,제일하이텍,코스틱폼텍,드림컴퍼니,ALC",
      },
      {
        paperType: "아트지",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "80g",
        manufacturer: null,
      },
      {
        paperType: "아트지",
        backing: "아트지",
        adhesive: "일반(수성)",
        thickness: "90g",
        manufacturer: null,
      },
      {
        paperType: "모조지",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "80g",
        manufacturer: null,
      },
      {
        paperType: "모조지",
        backing: "모조지",
        adhesive: "일반(수성)",
        thickness: "80g",
        manufacturer: null,
      },
      {
        paperType: "감열지",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "60g",
        manufacturer: null,
      },
      {
        paperType: "감열지",
        backing: "그라싱지",
        adhesive: "냉동(수성)",
        thickness: "60g",
        manufacturer: null,
      },
      {
        paperType: "유포지",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "75μ",
        manufacturer: null,
      },
      {
        paperType: "유포지",
        backing: "그라싱지",
        adhesive: "강점(수성)",
        thickness: "75μ",
        manufacturer: null,
      },
      {
        paperType: "유포지",
        backing: "그라싱지",
        adhesive: "냉동(수성)",
        thickness: "75μ",
        manufacturer: null,
      },
      {
        paperType: "유포지(백색)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "75μ",
        manufacturer: null,
      },
      {
        paperType: "유포지(투명)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "50μ",
        manufacturer: null,
      },
      {
        paperType: "유포지(투명)",
        backing: "그라싱지",
        adhesive: "강점(수성)",
        thickness: "50μ",
        manufacturer: null,
      },
      {
        paperType: "은무늬지",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "50μ",
        manufacturer: null,
      },
      {
        paperType: "금무늬지",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "50μ",
        manufacturer: null,
      },
      {
        paperType: "은소광지",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "25μ",
        manufacturer: null,
      },
      {
        paperType: "금소광지",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "25μ",
        manufacturer: null,
      },
      {
        paperType: "백색PET",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "25μ",
        manufacturer: null,
      },
      {
        paperType: "투명PET",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "25μ",
        manufacturer: null,
      },
      {
        paperType: "투명PET",
        backing: "그라싱지",
        adhesive: "강점(수성)",
        thickness: "25μ",
        manufacturer: null,
      },
      {
        paperType: "크라프트지",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "80g",
        manufacturer: null,
      },
      {
        paperType: "크라프트지",
        backing: "크라프트지",
        adhesive: "일반(수성)",
        thickness: "80g",
        manufacturer: null,
      },
      {
        paperType: "홀로그램",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "25μ",
        manufacturer: null,
      },
      {
        paperType: "알루미늄",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "50μ",
        manufacturer: null,
      },
      {
        paperType: "PP(백색)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "60μ",
        manufacturer: null,
      },
      {
        paperType: "PP(투명)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "60μ",
        manufacturer: null,
      },
      {
        paperType: "PP(백색)",
        backing: "그라싱지",
        adhesive: "강점(수성)",
        thickness: "60μ",
        manufacturer: null,
      },
      {
        paperType: "PE(백색)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "80μ",
        manufacturer: null,
      },
      {
        paperType: "PE(투명)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "80μ",
        manufacturer: null,
      },
      {
        paperType: "파괴지",
        backing: "그라싱지",
        adhesive: "강점(수성)",
        thickness: "50μ",
        manufacturer: null,
      },
      {
        paperType: "보이드지",
        backing: "그라싱지",
        adhesive: "강점(수성)",
        thickness: "50μ",
        manufacturer: null,
      },
      {
        paperType: "로얄금지",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "80g",
        manufacturer: null,
      },
      {
        paperType: "로얄은지",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "80g",
        manufacturer: null,
      },
      {
        paperType: "OPP(투명)",
        backing: "없음",
        adhesive: "일반(수성)",
        thickness: "30μ",
        manufacturer: null,
      },
      {
        paperType: "타이벡",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "1056D",
        manufacturer: null,
      },
      {
        paperType: "면지",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "150g",
        manufacturer: null,
      },
      {
        paperType: "시찌",
        backing: "없음",
        adhesive: "없음",
        thickness: "100g",
        manufacturer: null,
      },
      {
        paperType: "재생지",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "80g",
        manufacturer: null,
      },
      {
        paperType: "열전사리본(왁스)",
        backing: null,
        adhesive: null,
        thickness: null,
        manufacturer: null,
      },
      {
        paperType: "열전사리본(레진)",
        backing: null,
        adhesive: null,
        thickness: null,
        manufacturer: null,
      },
      {
        paperType: "열전사리본(왁스레진)",
        backing: null,
        adhesive: null,
        thickness: null,
        manufacturer: null,
      },
      {
        paperType: "비닐(PE)",
        backing: null,
        adhesive: null,
        thickness: "50μ",
        manufacturer: null,
      },
      {
        paperType: "비닐(OPP)",
        backing: null,
        adhesive: null,
        thickness: "30μ",
        manufacturer: null,
      },
      {
        paperType: "무점착지",
        backing: "그라싱지",
        adhesive: "없음",
        thickness: "80g",
        manufacturer: null,
      },
      {
        paperType: "형광지(주황)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "75g",
        manufacturer: null,
      },
      {
        paperType: "형광지(녹색)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "75g",
        manufacturer: null,
      },
      {
        paperType: "형광지(노랑)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "75g",
        manufacturer: null,
      },
      {
        paperType: "형광지(분홍)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "75g",
        manufacturer: null,
      },
      {
        paperType: "빼빼로지(봉투형)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "80g",
        manufacturer: null,
      },
      {
        paperType: "코팅지(무광)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "80g",
        manufacturer: null,
      },
      {
        paperType: "코팅지(유광)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "80g",
        manufacturer: null,
      },
      {
        paperType: "합성지(유포)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "100μ",
        manufacturer: null,
      },
      {
        paperType: "합성지(PP)",
        backing: "그라싱지",
        adhesive: "일반(수성)",
        thickness: "100μ",
        manufacturer: null,
      },
      {
        paperType: "에그쉘지",
        backing: "그라싱지",
        adhesive: "강점(수성)",
        thickness: "80g",
        manufacturer: null,
      },
      {
        paperType: "기타",
        backing: null,
        adhesive: null,
        thickness: null,
        manufacturer: null,
      },
    ];

    // code 자동생성: MAT-001 ~ MAT-055
    for (let i = 0; i < materials.length; i++) {
      const mat = materials[i];
      const code = `MAT-${String(i + 1).padStart(3, "0")}`;
      await prisma.material.create({
        data: { ...mat, code },
      });
    }
  }
  console.log("✅ 원단 55종");

  // ===== 5. 거래처 270개사 시딩 =====
  // 실제 데이터는 고객사로부터 엑셀 수신 후 여기에 배열로 넣어야 합니다
  // 아래는 시딩 구조 예시 — 실제 270개 데이터로 교체 필요
  const existingClients = await prisma.client.count();
  if (existingClients === 0) {
    console.log("⚠️ 거래처 데이터 파일(clients-data.ts)을 확인하세요");
    // import { clientsData } from "./data/clients-data";
    // for (const c of clientsData) {
    //   await prisma.client.create({
    //     data: { companyName: c.companyName, contactName: c.contactName || null },
    //   });
    // }
  }

  // ===== 6. 품목 297개 시딩 =====
  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    console.log("⚠️ 품목 데이터 파일(products-data.ts)을 확인하세요");
    // import { productsData } from "./data/products-data";
    // for (const p of productsData) {
    //   await prisma.product.create({
    //     data: {
    //       productCode: p.productCode,
    //       productName: p.productName,
    //       spec: p.spec || null,
    //     },
    //   });
    // }
  }

  console.log("🌱 시딩 완료!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
