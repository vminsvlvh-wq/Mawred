import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function extractKnowledge(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `تحليل النص التالي لاستخلاص المعرفة الضمنية (الأسرار المهنية، الدروس المستفادة، الخبرات المتراكمة).
    النص: ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "عنوان موجز للمعرفة المستخلصة" },
          summary: { type: Type.STRING, description: "ملخص شامل للخبرة" },
          category: { type: Type.STRING, description: "التصنيف المهني (مثلاً: هندسة، إدارة مشاريع، سلاسل إمداد)" },
          tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "كلمات مفتاحية" },
          confidence: { type: Type.NUMBER, description: "مستوى الثقة في الاستخلاص (0-1)" }
        },
        required: ["title", "summary", "category", "tags", "confidence"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function analyzeSkillGaps(expertSkills: string[], noviceSkills: string[]) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: `قارن بين مهارات الخبير ومهارات الموظف الجديد لتحديد الفجوات المعرفية.
    مهارات الخبير: ${expertSkills.join(', ')}
    مهارات الموظف: ${noviceSkills.join(', ')}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            skill: { type: Type.STRING },
            currentLevel: { type: Type.NUMBER },
            targetLevel: { type: Type.NUMBER },
            recommendation: { type: Type.STRING }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
}

export async function generateWeeklyReport(stats: {
  totalAssets: number;
  activeExperts: number;
  twinningSessions: number;
  localizationRate: number;
}, projectName: string = 'نيوم') {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: `توليد تقرير أسبوعي تنفيذي ومفصل حول حالة توطين المعرفة الضمنية في مشروع "${projectName}" العملاق بالمملكة العربية السعودية.
    استخدم الإحصائيات التالية كقاعدة رقمية للتقرير:
    - إجمالي الأصول المعرفية: ${stats.totalAssets}
    - الخبراء النشطون: ${stats.activeExperts}
    - جلسات التوأمة المعرفية: ${stats.twinningSessions}
    - معدل توطين المعرفة الحالي: ${stats.localizationRate}%
    
    قم بملء تفاصيل التقرير بشكل كامل ودقيق وصغ من الإنجازات والمهارات الحساسة والفجوات ما يتناسب تماماً مع طبيعة وتفاصيل قطاعات مشروع "${projectName}".
    صياغة التقرير يجب أن تكون بأسلوب مهني فاخر ومناسب للإدارة العليا في المملكة العربية السعودية.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reportTitle: { type: Type.STRING, description: "عنوان التقرير الأسبوعي الفاخر" },
          executiveSummary: { type: Type.STRING, description: "ملخص تنفيذي شامل ومفصل للتقرير بالكامل بأسلوب إداري متميز (يحتوي على فقرات واضحة)" },
          achievements: {
            type: Type.ARRAY,
            description: "قائمة بأبرز 3 إنجازات معرفية وتوطينية تمت هذا الأسبوع",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "عنوان الإنجاز" },
                description: { type: Type.STRING, description: "وصف مفصل لكيفية توطين هذه المعرفة الضمنية" },
                impact: { type: Type.STRING, description: "الأثر المتوقع على المشروع" }
              },
              required: ["title", "description", "impact"]
            }
          },
          skillsLocalized: {
            type: Type.ARRAY,
            description: "المهارات والمعارف الحساسة التي تم نقلها للكوادر السعودية هذا الأسبوع",
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING, description: "اسم المهارة الحساسة" },
                percentage: { type: Type.NUMBER, description: "معدل تقدم التوطين فيها (0-100)" },
                expertName: { type: Type.STRING, description: "الخبير المسؤول عن نقلها" }
              },
              required: ["skill", "percentage", "expertName"]
            }
          },
          criticalGaps: {
            type: Type.ARRAY,
            description: "الفجوات المعرفية الحرجة التي تم رصدها هذا الأسبوع وتتطلب تدخلاً",
            items: {
              type: Type.OBJECT,
              properties: {
                gapName: { type: Type.STRING, description: "اسم الفجوة المعرفية" },
                severity: { type: Type.STRING, description: "مستوى الخطورة (حرجة جداً، عالية، متوسطة)" },
                remediationAction: { type: Type.STRING, description: "الإجراء التصحيحي الموصى به" }
              },
              required: ["gapName", "severity", "remediationAction"]
            }
          }
        },
        required: ["reportTitle", "executiveSummary", "achievements", "skillsLocalized", "criticalGaps"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function generateGapMitigationPlan(gapName: string, department: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: `أنت مستشار توطين معرفة خبير في المشاريع السعودية العملاقة (مثل نيوم، البحر الأحمر، أرامكو).
    تم رصد فجوة معرفية حرجة للغاية وتتطلب تدخلاً عاجلاً:
    - الفجوة المعرفية: ${gapName}
    - القسم/القطاع: ${department}
    
    قم بوضع خطة عمل متكاملة وفورية لمعالجة وتوطين هذه المعرفة الضمنية قبل فوات الأوان.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedExperts: {
            type: Type.ARRAY,
            description: "قائمة بأسماء ومهام خبراء عالميين مقترحين للإشراف على توطين هذه المهارة",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                focusArea: { type: Type.STRING }
              },
              required: ["name", "role", "focusArea"]
            }
          },
          remediationPlanSteps: {
            type: Type.ARRAY,
            description: "خطوات المعالجة والتوطين الفورية خطوة بخطوة",
            items: { type: Type.STRING }
          },
          targetSaudiRoles: {
            type: Type.ARRAY,
            description: "الأدوار والوظائف السعودية المستهدفة لاستلام هذه المعرفة",
            items: { type: Type.STRING }
          },
          estimatedTimelineWeeks: { type: Type.NUMBER, description: "المدة الزمنية التقديرية بالأسابيع لإكمال التوطين بنجاح" }
        },
        required: ["recommendedExperts", "remediationPlanSteps", "targetSaudiRoles", "estimatedTimelineWeeks"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function polishQuickInsight(roughNote: string, classification?: string, subCategory?: string) {
  const classificationPrompt = classification 
    ? `\nالتصنيف المحدد للأصل المعرفي هو: "${classification}"${subCategory ? ` والتصنيف الفرعي هو: "${subCategory}"` : ''} (يرجى جعل الصياغة والدروس والخبرات المذكورة في العنوان والمحتوى والوسوم تصب وتخدم هذا التصنيف بوضوح تام، سواء كان فنية أو إدارية أو استراتيجية).`
    : '';
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: `قم بتحويل الفكرة أو الملاحظة الفنية الخام التالية إلى "أصل معرفي ضمني" مصقول ومنظم بشكل احترافي للغاية ومناسب للمشاريع السعودية الكبرى.${classificationPrompt}
    الفكرة الخام: "${roughNote}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          polishedTitle: { type: Type.STRING, description: "عنوان مهني ومبهر للأصل المعرفي" },
          polishedContent: { type: Type.STRING, description: "صياغة فخمة ومنظمة بالتفصيل للفكرة مع الدروس والخبرات الضمنية" },
          category: { type: Type.STRING, description: "التصنيف المهني المناسب" },
          tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "وسوم تصنيفية ثلاثية كحد أقصى" }
        },
        required: ["polishedTitle", "polishedContent", "category", "tags"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
}

export async function matchExpertForQuery(query: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: `بناءً على طلب المساعدة المعرفية الفنية التالي من أحد المهندسين السعوديين الجدد، قم بتحليل الطلب واقتراح الملف المهني الأمثل لخبير عالمي يمكنه المساعدة فوراً:
    طلب المساعدة: "${query}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedExpertProfile: { type: Type.STRING, description: "اسم ومؤهلات خبير عالمي افتراضي مناسب جداً (مثال: د. كوجي تاناكا - كبير خبراء السكك الحديدية السريعة)" },
          matchingReason: { type: Type.STRING, description: "لماذا هذا الخبير هو الأنسب لحل هذه المشكلة ونقل المعرفة" },
          quickTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 نصائح سريعة ومبدئية يقدمها الخبير لحل المشكلة فوراً" }
        },
        required: ["recommendedExpertProfile", "matchingReason", "quickTips"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
}


