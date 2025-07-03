import { getUserIdFromRequest } from '@/utils/auth' // implement this for your auth system
import prisma from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const userId = getUserIdFromRequest(req)
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })
  const { bio, linkedin, leetcode } = req.body
  try {
    await prisma.profile.upsert({
      where: { userId },
      update: { bio, linkedin, leetcode },
      create: { userId, bio, linkedin, leetcode },
    })
    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(500).json({ error: 'Failed to create profile' })
  }
}
