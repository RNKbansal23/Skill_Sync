import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { getPdfText } from "@/utils/pdf"; // Your PDF extraction util
import { getGeminiScores } from "@/utils/gemini"; // Your Gemini API util
import { getUserIdFromRequest } from '@/utils/auth';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = await getUserIdFromRequest({cookies: cookieStore})

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // 2. Parse request body
  const { name, bio, linkedin, leetcode } = await request.json();

  try {
    // 3. Update data in the database
    const [updatedUser, updatedProfile] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { name },
      }),
      prisma.profile.upsert({
        where: { userId },
        update: { bio, linkedin, leetcode },
        create: { userId, bio, linkedin, leetcode },
      }),
    ]);

    let aiScores = null;
    if (resumeUrl) {
    // 2. Download and extract PDF text
    const pdfBuffer = await fetch(resumeUrl).then(r => r.arrayBuffer());
    const text = await getPdfText(Buffer.from(pdfBuffer));

    // 3. Call Gemini API
    aiScores = await getGeminiScores(text); // { workEthic, creativity, skills }

    // 4. Store scores in UserScore
    await prisma.userScore.upsert({
      where: { userId },
      update: { automatedWorkEthic: aiScores.workEthic, automatedCreativity: aiScores.creativity, automatedSkills: aiScores.skills },
      create: { userId, automatedWorkEthic: aiScores.workEthic, automatedCreativity: aiScores.creativity, automatedSkills: aiScores.skills },
    });
  }

  // 5. Return scores in response
  return NextResponse.json({ success: true, aiScores });

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
