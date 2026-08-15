import { ResumeData } from '@/types/resume';

export interface AtsScoreResult {
  totalScore: number; // 0-100
  keywordScore: number;
  completenessScore: number;
  hasJobDescription: boolean;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export function analyzeAtsScore(data: ResumeData, jobDescription: string): AtsScoreResult {
  const suggestions: string[] = [];

  // Extract candidate keywords from resume
  const resumeText = [
    data.personalInfo.fullName,
    data.personalInfo.title,
    data.summary,
    ...data.experience.flatMap((e) => [e.company, e.role, ...(e.bullets || [])]),
    ...data.skills.flatMap((s) => [s.category, ...s.skills]),
    ...data.projects.flatMap((p) => [p.name, p.description, ...(p.techStack || [])]),
  ]
    .join(' ')
    .toLowerCase();

  // Extract job description keywords (words with 4+ chars)
  const jobWords = jobDescription
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length >= 4);

  const uniqueJobWords = Array.from(new Set(jobWords));

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  uniqueJobWords.forEach((word) => {
    if (resumeText.includes(word)) {
      matchedKeywords.push(word);
    } else {
      missingKeywords.push(word);
    }
  });

  const hasJobDescription = uniqueJobWords.length > 0;

  // No JD pasted → keyword score is N/A (0), not a fake "80%"
  const keywordMatchRatio = hasJobDescription
    ? matchedKeywords.length / uniqueJobWords.length
    : 0;
  const keywordScore = hasJobDescription
    ? Math.min(100, Math.round(keywordMatchRatio * 100))
    : 0;

  // Completeness check
  let completenessPoints = 0;
  if (data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.phone) completenessPoints += 25;
  if (data.summary && data.summary.length > 30) completenessPoints += 25;
  if (data.experience.length >= 1) completenessPoints += 25;
  if (data.skills.length >= 1) completenessPoints += 25;

  // With a JD: weight keywords + completeness. Without: completeness-only score.
  const totalScore = hasJobDescription
    ? Math.round(keywordScore * 0.6 + completenessPoints * 0.4)
    : completenessPoints;

  // Generate suggestions
  if (!hasJobDescription) {
    suggestions.push(
      'Paste a target job description above to calculate a real keyword match score against that role.'
    );
  }
  if (data.summary.length < 50) {
    suggestions.push('Expand your Professional Summary to include 2-3 impact-oriented sentences.');
  }
  if (data.experience.some((e) => !e.bullets || e.bullets.length === 0)) {
    suggestions.push('Add achievement bullet points to all work experience positions.');
  }
  if (missingKeywords.length > 0) {
    suggestions.push(`Consider incorporating keywords from the job description like: ${missingKeywords.slice(0, 5).join(', ')}.`);
  }
  if (!data.personalInfo.linkedin) {
    suggestions.push('Include your LinkedIn profile link in Personal Info.');
  }

  return {
    totalScore,
    keywordScore,
    completenessScore: completenessPoints,
    hasJobDescription,
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 10),
    suggestions,
  };
}
