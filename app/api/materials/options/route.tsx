import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      where: { isActive: true },
      select: {
        paperType: true,
        backing: true,
        adhesive: true,
        thickness: true,
        manufacturer: true,
      },
    });

    const paperType = new Set<string>();
    const backing = new Set<string>();
    const adhesive = new Set<string>();
    const thickness = new Set<string>();
    const manufacturer = new Set<string>();

    for (const m of materials) {
      if (m.paperType) paperType.add(m.paperType);
      if (m.backing) backing.add(m.backing);
      if (m.adhesive) adhesive.add(m.adhesive);
      if (m.thickness) thickness.add(m.thickness);
      if (m.manufacturer) manufacturer.add(m.manufacturer);
    }

    return NextResponse.json({
      paperType: Array.from(paperType).sort(),
      backing: Array.from(backing).sort(),
      adhesive: Array.from(adhesive).sort(),
      thickness: Array.from(thickness).sort(),
      manufacturer: Array.from(manufacturer).sort(),
    });
  } catch (error) {
    console.error("materials/options 오류:", error);
    return NextResponse.json(
      {
        paperType: [],
        backing: [],
        adhesive: [],
        thickness: [],
        manufacturer: [],
      },
      { status: 500 },
    );
  }
}

