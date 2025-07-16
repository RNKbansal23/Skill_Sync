import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromSession } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const userId = await getUserFromSession(request);
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized: No valid token" },
      { status: 401 }
    );
  }

  // 2. Parse the uploaded file from formData
  const formData = await request.formData();
  const file = formData.get("resume") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // 3. Validate file type (PDF)
  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Invalid file type. Only PDF allowed." },
      { status: 400 }
    );
  }

  // 4. Read file as buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 5. Update the profile with the resume file
  try {
    await prisma.profile.update({
      where: { userId },
      data: { resumeFile: buffer },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { resumeFile: true },
  });

  if (!profile || !profile.resumeFile) {
    return new NextResponse("Resume not found", { status: 404 });
  }
  return new Response(profile.resumeFile, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="resume.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
