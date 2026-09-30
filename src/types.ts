export interface KnowledgeAsset {
  id: string;
  title: string;
  category: string;
  expertName: string;
  summary: string;
  confidence: number;
  date: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  role: 'expert' | 'novice';
  specialization: string;
  skills: string[];
  bio: string;
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
}

export interface SaudiCompany {
  id: string;
  nameAr: string;
  nameEn: string;
  sectorAr: string;
  sectorEn: string;
  subsectorAr: string;
  subsectorEn: string;
  descriptionAr: string;
  descriptionEn: string;
  focusAreas: string[];
  keyTags: string[];
  knowledgeGapsAddressed: string[];
  strategicImportance: string;
}

export interface SaudiFilteredCompany {
  id: string;
  name: string;
  sector: string;
  region: string;
  companySize: string;
  serviceType: string;
  techLevel: string;
  description: string;
  logo: string;
  tags: string[];
}


