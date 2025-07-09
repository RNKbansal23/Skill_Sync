import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { getPdfText } from "@/utils/pdf";
import { getGeminiScores } from "@/utils/gemini";
import { getUserIdFromRequest } from '@/utils/auth';

export async function POST(request: Request) {
  console.log('god is great');

  // 1. Auth
  const cookieStore = await cookies();
  const userId = await getUserIdFromRequest({ cookies: cookieStore });
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  console.log('1');

  const { name, bio, linkedin, leetcode } = await request.json();

  try {
    // 2. Update user and profile in the database
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
    console.log(0);

    // 3. Fetch the updated profile to get the resumeFile (as Buffer)
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { resumeFile: true },
    });

    let aiScores = null;
    console.log(1);
    if (profile?.resumeFile && profile.resumeFile.length > 0) {
      // Ensure we have a Buffer (Prisma may return a Uint8Array)
      const pdfBuffer = Buffer.isBuffer(profile.resumeFile)
        ? profile.resumeFile
        : Buffer.from(profile.resumeFile);
      try {
        const text = await getPdfText(pdfBuffer);
        // Optionally, check if text is not empty
        if (!text || text.trim().length === 0) {
          console.warn('Extracted PDF text is empty.');
        }
    //     } else {
    //       // Call Gemini API
    //       aiScores = await getGeminiScores(text); // { workEthic, creativity, skills }

    //       // Store scores in UserScore
    //       await prisma.userScore.upsert({
    //         where: { userId },
    //         update: {
    //           automatedWorkEthic: aiScores.workEthic,
    //           automatedCreativity: aiScores.creativity,
    //           automatedSkills: aiScores.skills,
    //         },
    //         create: {
    //           userId,
    //           automatedWorkEthic: aiScores.workEthic,
    //           automatedCreativity: aiScores.creativity,
    //           automatedSkills: aiScores.skills,
    //         },
    //       });
    //     }
      } catch (pdfError) {
        console.error('PDF parsing or Gemini scoring failed:', pdfError);
        // Optionally, return a partial success or continue
      }
    } else {
      console.log('No resume file found for user:', userId);
    }

    // 4. Return scores in response (or null if not updated)
    return NextResponse.json({ success: true, aiScores });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
