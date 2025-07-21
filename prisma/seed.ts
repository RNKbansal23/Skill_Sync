import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create two sample hackathons
  await prisma.hackathon.create({
    data: {
      name: 'AI for Good Challenge',
      description: 'Join us for a 48-hour virtual hackathon focused on developing AI-powered solutions for social and environmental problems. All skill levels are welcome!',
      startDate: new Date('2024-09-20T09:00:00Z'),
      endDate: new Date('2024-09-22T17:00:00Z'),
      website: 'https://example.com/ai-for-good',
      imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020', // Placeholder image
    },
  });

  await prisma.hackathon.create({
    data: {
      name: 'Web3 & DeFi Revolution',
      description: 'A week-long hackathon to build the next generation of decentralized applications. Explore smart contracts, DAOs, and innovative DeFi protocols.',
      startDate: new Date('2024-10-05T10:00:00Z'),
      endDate: new Date('2024-10-12T18:00:00Z'),
      website: 'https://example.com/web3-hack',
      imageUrl: 'https://images.unsplash.com/photo-1642104704074-af5842245a5f?q=80&w=2070', // Placeholder image
    },
  });
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });