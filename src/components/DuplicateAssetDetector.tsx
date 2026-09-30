import React, { useMemo } from 'react';
import { Layers, Link2, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ProjectKnowledgeAsset, INITIAL_KNOWLEDGE_ASSETS } from '../data/knowledgeAssets';
import { cn } from '../lib/utils';

export interface SimilarAssetMatch {
  asset: ProjectKnowledgeAsset;
  similarityScore: number;
  matchedKeywords: string[];
}

export default function DuplicateAssetDetector({
  inputText,
  onSelectAsset,
  className
}: {
  inputText: string;
  onSelectAsset?: (asset: ProjectKnowledgeAsset) => void;
  className?: string;
}) {
  const { t } = useLanguage();

  const similarAssets = useMemo<SimilarAssetMatch[]>(() => {
    if (!inputText || inputText.trim().length < 6) return [];

    let extraList: ProjectKnowledgeAsset[] = [];
    try {
      const saved = localStorage.getItem('mawred_extra_assets');
      if (saved) extraList = JSON.parse(saved);
    } catch {
      // ignore
    }

    const allAssets = [...INITIAL_KNOWLEDGE_ASSETS, ...extraList];
    const cleanTokens = inputText
      .toLowerCase()
      .replace(/[^\u0621-\u064Aa-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);

    if (cleanTokens.length === 0) return [];

    const matches: SimilarAssetMatch[] = [];

    for (const asset of allAssets) {
      const assetKeywords = [
        ...asset.title.toLowerCase().split(/\s+/),
        ...asset.category.toLowerCase().split(/\s+/),
        ...(asset.tags || []).map(t => t.toLowerCase())
      ];

      const foundKeywords: string[] = [];
      for (const token of cleanTokens) {
        if (assetKeywords.some(ak => ak.includes(token) || token.includes(ak))) {
          foundKeywords.push(token);
        }
      }

      if (foundKeywords.length > 0) {
        const score = Math.min(Math.round((foundKeywords.length / Math.max(cleanTokens.length, 3)) * 100), 98);
        if (score >= 25) {
          matches.push({
            asset,
            similarityScore: score,
            matchedKeywords: Array.from(new Set(foundKeywords))
          });
        }
      }
    }

    return matches.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, 3);
  }, [inputText]);

  if (similarAssets.length === 0) return null;

  return (
    <div className={cn("p-3 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/60 dark:bg-amber-950/20 text-xs space-y-2", className)}>
      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
        <span>{t('duplicate.title', 'كشف تكرار المحتوى الذكي')}</span>
      </div>

      <p className="text-[11px] text-slate-600 dark:text-slate-400">
        {t('duplicate.found', 'تم رصد أصول معرفية مشابهة موثقة مسبقاً! يُقترح الإضافة عليها أو ربطها:')}
      </p>

      <div className="space-y-1.5 pt-1">
        {similarAssets.map(({ asset, similarityScore, matchedKeywords }) => (
          <div
            key={asset.id}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                  {asset.title}
                </span>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.2 rounded font-mono shrink-0">
                  تشابه {similarityScore}%
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                المشروع: {asset.project} · الموثق: {asset.author} · كلمات متطابقة: {matchedKeywords.slice(0, 3).join(', ')}
              </div>
            </div>

            {onSelectAsset && (
              <button
                type="button"
                onClick={() => onSelectAsset(asset)}
                className="px-2 py-1 text-[11px] font-semibold rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 shrink-0 flex items-center gap-1"
              >
                <Link2 className="w-3 h-3" />
                <span>ربط</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
