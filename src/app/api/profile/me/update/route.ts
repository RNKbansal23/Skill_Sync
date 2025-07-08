import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { getPdfText } from "@/utils/pdf";
import { getGeminiScores } from "@/utils/gemini";
import { getUserIdFromRequest } from '@/utils/auth';

export async function POST(request: Request) {
  // 1. Auth
  const cookieStore = await cookies();
  const userId = await getUserIdFromRequest({ cookies: cookieStore });

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { name, bio, linkedin, leetcode } = await request.json();

  try {
    await prisma.$transaction([
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

    // 4. Fetch the updated profile to get the resumeFile (as Buffer)
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { resumeFile: true },
    });

    let aiScores = null;

    if (profile?.resumeFile) {
      // resumeFile is a Buffer (or null if not present)
      const text = await getPdfText(profile.resumeFile as Buffer);

      // Call Gemini API
      aiScores = await getGeminiScores(text); // { workEthic, creativity, skills }

      // Store scores in UserScore
      await prisma.userScore.upsert({
        where: { userId },
        update: {
          automatedWorkEthic: aiScores.workEthic,
          automatedCreativity: aiScores.creativity,
          automatedSkills: aiScores.skills,
        },
        create: {
          userId,
          automatedWorkEthic: aiScores.workEthic,
          automatedCreativity: aiScores.creativity,
          automatedSkills: aiScores.skills,
        },
      });
    }

    // 5. Return scores in response (or null if not updated)
    return NextResponse.json({ success: true, aiScores });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
