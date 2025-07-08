const C = 5; // prior weight, tune as needed

// 1. Compute global averages
const globalAverages = await prisma.peerRating.aggregate({
  _avg: {
    workEthic: true,
    creativity: true,
    skills: true,
  }
});
const mWorkEthic = globalAverages._avg.workEthic ?? 0;
const mCreativity = globalAverages._avg.creativity ?? 0;
const mSkills = globalAverages._avg.skills ?? 0;

// 2. For each user, compute Bayesian average for each parameter
const userRatings = await prisma.peerRating.findMany({
  where: { ratedUserId: userId },
  select: { workEthic: true, creativity: true, skills: true },
});
const n = userRatings.length;
const sWorkEthic = n > 0 ? userRatings.reduce((sum, r) => sum + r.workEthic, 0) / n : 0;
const sCreativity = n > 0 ? userRatings.reduce((sum, r) => sum + r.creativity, 0) / n : 0;
const sSkills = n > 0 ? userRatings.reduce((sum, r) => sum + r.skills, 0) / n : 0;

const bayesianWorkEthic = (C * mWorkEthic + n * sWorkEthic) / (C + n);
const bayesianCreativity = (C * mCreativity + n * sCreativity) / (C + n);
const bayesianSkills = (C * mSkills + n * sSkills) / (C + n);

// 3. Store in UserScore
await prisma.userScore.upsert({
  where: { userId },
  update: {
    peerWorkEthic: bayesianWorkEthic,
    peerCreativity: bayesianCreativity,
    peerSkills: bayesianSkills,
  },
  create: {
    userId,
    peerWorkEthic: bayesianWorkEthic,
    peerCreativity: bayesianCreativity,
    peerSkills: bayesianSkills,
  },
});
