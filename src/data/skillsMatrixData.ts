export interface SkillItem {
  id: string;
  name: string;
  category: 'فنية تخصصية' | 'تشغيلية وهندسية' | 'رقمية وأتمتة' | 'حوكمة وسلامة';
  currentLevel: number; // 1 to 5
  targetLevel: number; // 1 to 5
  gap: number; // target - current
  priority: 'حرجة وعاجلة' | 'متوسطة' | 'اعتيادية';
  linkedExpert: {
    name: string;
    role: string;
    avatarInitials: string;
    sessionsCompleted: number;
    nextSessionDate: string;
  };
  linkedAsset: {
    id: string;
    title: string;
    project: string;
  };
  learningPlan: {
    durationWeeks: number;
    completionPercentage: number;
    currentMilestone: string;
    practicalTasksCount: number;
    completedPracticalTasks: number;
    lastEvaluationScore?: number;
  };
}

export interface EmployeeSkillProfile {
  id: string;
  employeeName: string;
  role: string;
  department: string;
  project: string;
  avatarInitials: string;
  experienceYears: number;
  overallSkillReadiness: number; // 0 to 100
  skillsCount: number;
  criticalGapsCount: number;
  skills: SkillItem[];
}

export const INITIAL_EMPLOYEE_SKILLS_DATA: EmployeeSkillProfile[] = [
  {
    id: 'emp-1',
    employeeName: 'م. ريان القحطاني',
    role: 'مهندس طاقة متجددة ونظم هيدروجين',
    department: 'إدارة الهيدروجين النظيف والطاقة البديلة',
    project: 'نيوم',
    avatarInitials: 'رق',
    experienceYears: 4,
    overallSkillReadiness: 76,
    skillsCount: 4,
    criticalGapsCount: 1,
    skills: [
      {
        id: 'sk-1',
        name: 'إدارة وتبريد خلايا التحليل الكهربائي في بيئات الحرارة العالية',
        category: 'فنية تخصصية',
        currentLevel: 4,
        targetLevel: 5,
        gap: 1,
        priority: 'حرجة وعاجلة',
        linkedExpert: {
          name: 'د. يورغن شتراوس',
          role: 'كبير خبراء الهيدروجين الأخضر',
          avatarInitials: 'يش',
          sessionsCompleted: 7,
          nextSessionDate: '2026-10-06'
        },
        linkedAsset: {
          id: 'base-1',
          title: 'معايير تصريف حرارة خلايا الهيدروجين الأخضر',
          project: 'نيوم'
        },
        learningPlan: {
          durationWeeks: 8,
          completionPercentage: 85,
          currentMilestone: 'مهمة عملية مستقلة: إدارة وردية التبريد لمدة 24 ساعة',
          practicalTasksCount: 4,
          completedPracticalTasks: 3,
          lastEvaluationScore: 94
        }
      },
      {
        id: 'sk-2',
        name: 'بروتوكولات السلامة وتخزين الأمونيا الخضراء السائلة',
        category: 'حوكمة وسلامة',
        currentLevel: 4,
        targetLevel: 5,
        gap: 1,
        priority: 'حرجة وعاجلة',
        linkedExpert: {
          name: 'د. يورغن شتراوس',
          role: 'كبير خبراء الهيدروجين الأخضر',
          avatarInitials: 'يش',
          sessionsCompleted: 5,
          nextSessionDate: '2026-10-12'
        },
        linkedAsset: {
          id: 'base-1',
          title: 'مخططات صمامات الأمان ومنع تسرب الضغط الفائق',
          project: 'نيوم'
        },
        learningPlan: {
          durationWeeks: 6,
          completionPercentage: 75,
          currentMilestone: 'معايرة أجهزة رصد التسرب الكهروكيميائي الحقلية',
          practicalTasksCount: 3,
          completedPracticalTasks: 2,
          lastEvaluationScore: 91
        }
      },
      {
        id: 'sk-3',
        name: 'نمذجة ديناميكا التدفق والضغط في الأنابيب الفائقة',
        category: 'تشغيلية وهندسية',
        currentLevel: 3,
        targetLevel: 4,
        gap: 1,
        priority: 'متوسطة',
        linkedExpert: {
          name: 'د. ستيفن ووكر',
          role: 'مستشار ديناميكا الموائع والأنفاق',
          avatarInitials: 'سو',
          sessionsCompleted: 3,
          nextSessionDate: '2026-10-18'
        },
        linkedAsset: {
          id: 'base-neom-2',
          title: 'حوكمة شبكات الطاقة الذكية وتوزيع الأحمال اللحظية',
          project: 'نيوم'
        },
        learningPlan: {
          durationWeeks: 6,
          completionPercentage: 60,
          currentMilestone: 'اختبار برنامج المحاكاة على عينات الأنابيب الصخرية',
          practicalTasksCount: 3,
          completedPracticalTasks: 1,
          lastEvaluationScore: 86
        }
      },
      {
        id: 'sk-4',
        name: 'التكامل مع شبكة الكهرباء الذكية الوطنية',
        category: 'رقمية وأتمتة',
        currentLevel: 4,
        targetLevel: 4,
        gap: 0,
        priority: 'اعتيادية',
        linkedExpert: {
          name: 'م. أحمد القحطاني',
          role: 'مدير المعرفة الوطنية',
          avatarInitials: 'أق',
          sessionsCompleted: 4,
          nextSessionDate: '2026-10-25'
        },
        linkedAsset: {
          id: 'base-neom-3',
          title: 'حوكمة شبكات الطاقة الذكية وتوزيع الأحمال اللحظية بالذكاء الاصطناعي',
          project: 'نيوم'
        },
        learningPlan: {
          durationWeeks: 4,
          completionPercentage: 100,
          currentMilestone: 'اكتملت جميع المهام العملية والتقييم النهائي 98%',
          practicalTasksCount: 2,
          completedPracticalTasks: 2,
          lastEvaluationScore: 98
        }
      }
    ]
  },
  {
    id: 'emp-2',
    employeeName: 'م. لمى الشهري',
    role: 'مهندسة هياكل بحرية واستدامة بيئية',
    department: 'قسم المنشآت العائمة وحماية الموائل البحرية',
    project: 'البحر الأحمر',
    avatarInitials: 'لش',
    experienceYears: 5,
    overallSkillReadiness: 84,
    skillsCount: 3,
    criticalGapsCount: 1,
    skills: [
      {
        id: 'sk-201',
        name: 'حسابات مقاومة تآكل الخرسانة البحرية في البيئات الملحية الفائقة',
        category: 'فنية تخصصية',
        currentLevel: 4,
        targetLevel: 5,
        gap: 1,
        priority: 'حرجة وعاجلة',
        linkedExpert: {
          name: 'د. إيلينا روستوفا',
          role: 'خبيرة استزراع الشعاب المرجانية والبيئة البحرية',
          avatarInitials: 'إر',
          sessionsCompleted: 7,
          nextSessionDate: '2026-10-04'
        },
        linkedAsset: {
          id: 'base-rs-4',
          title: 'تطوير خرسانة بحرية ذاتية الشفاء مدعومة بالبكتيريا العضوية',
          project: 'البحر الأحمر'
        },
        learningPlan: {
          durationWeeks: 8,
          completionPercentage: 90,
          currentMilestone: 'اختبار صلابة عينات القواعد العائمة بعد 180 يوماً من الغمر',
          practicalTasksCount: 4,
          completedPracticalTasks: 4,
          lastEvaluationScore: 95
        }
      },
      {
        id: 'sk-202',
        name: 'تقنيات التكاثر الدقيق للمرجان وزراعته على ركائز صناعية صديقة',
        category: 'فنية تخصصية',
        currentLevel: 4,
        targetLevel: 5,
        gap: 1,
        priority: 'حرجة وعاجلة',
        linkedExpert: {
          name: 'د. إيلينا روستوفا',
          role: 'كبير علماء البيئة البحرية',
          avatarInitials: 'إر',
          sessionsCompleted: 8,
          nextSessionDate: '2026-10-10'
        },
        linkedAsset: {
          id: 'base-rs-4',
          title: 'بروتوكولات التكاثر الاصطناعي للمرجان المقاوم لدرجات الحرارة القصوى',
          project: 'البحر الأحمر'
        },
        learningPlan: {
          durationWeeks: 10,
          completionPercentage: 92,
          currentMilestone: 'تنفيذ فحص ميداني مستقل لـ 3 مشاتل عائمة في جزر شبي بارا',
          practicalTasksCount: 5,
          completedPracticalTasks: 5,
          lastEvaluationScore: 96
        }
      },
      {
        id: 'sk-203',
        name: 'التحليل الجينومي للتنوع البيولوجي المائي',
        category: 'رقمية وأتمتة',
        currentLevel: 3,
        targetLevel: 4,
        gap: 1,
        priority: 'متوسطة',
        linkedExpert: {
          name: 'د. إيلينا روستوفا',
          role: 'كبير علماء البيئة البحرية',
          avatarInitials: 'إر',
          sessionsCompleted: 4,
          nextSessionDate: '2026-10-15'
        },
        linkedAsset: {
          id: 'base-rs-4',
          title: 'مسوحات الحمض النووي البيئي eDNA للمياه الساحلية',
          project: 'البحر الأحمر'
        },
        learningPlan: {
          durationWeeks: 6,
          completionPercentage: 70,
          currentMilestone: 'معالجة 50 عينة مياه باستخدام خوارزميات التسلسل الحيوي',
          practicalTasksCount: 3,
          completedPracticalTasks: 2,
          lastEvaluationScore: 89
        }
      }
    ]
  },
  {
    id: 'emp-3',
    employeeName: 'م. ناصر السبيعي',
    role: 'مهندس نظم أتمتة وتوأمة رقمية',
    department: 'الميناء الذكي والعمليات البحرية الذاتية',
    project: 'أوكساجون',
    avatarInitials: 'نس',
    experienceYears: 6,
    overallSkillReadiness: 62,
    skillsCount: 3,
    criticalGapsCount: 2,
    skills: [
      {
        id: 'sk-301',
        name: 'برمجة خوارزميات التوأم الرقمي اللحظي للرافعات الذاتية',
        category: 'رقمية وأتمتة',
        currentLevel: 2,
        targetLevel: 5,
        gap: 3,
        priority: 'حرجة وعاجلة',
        linkedExpert: {
          name: 'م. هيروشي تاناكا',
          role: 'كبير مهندسي أتمتة الموانئ والروبوتات',
          avatarInitials: 'هت',
          sessionsCompleted: 4,
          nextSessionDate: '2026-10-08'
        },
        linkedAsset: {
          id: 'base-ox-3',
          title: 'خوارزميات الملاحة اللحظية للسفن ذاتية القيادة في الممرات الضيقة',
          project: 'أوكساجون'
        },
        learningPlan: {
          durationWeeks: 12,
          completionPercentage: 45,
          currentMilestone: 'تطبيق تجربة مواءمة المستشعرات في الرصيف 4',
          practicalTasksCount: 6,
          completedPracticalTasks: 2,
          lastEvaluationScore: 82
        }
      },
      {
        id: 'sk-302',
        name: 'تأمين شبكات إنترنت الأشياء الصناعية (IIoT) بالأنظمة العائمة',
        category: 'حوكمة وسلامة',
        currentLevel: 3,
        targetLevel: 4,
        gap: 1,
        priority: 'حرجة وعاجلة',
        linkedExpert: {
          name: 'م. هيروشي تاناكا',
          role: 'كبير مهندسي أتمتة الموانئ والروبوتات',
          avatarInitials: 'هت',
          sessionsCompleted: 3,
          nextSessionDate: '2026-10-14'
        },
        linkedAsset: {
          id: 'base-neom-4',
          title: 'بروتوكولات الأمان السيبراني للأنظمة التشغيلية الصناعية (OT)',
          project: 'أوكساجون'
        },
        learningPlan: {
          durationWeeks: 8,
          completionPercentage: 55,
          currentMilestone: 'إجراء اختبار اختراق أخلاقي لمنظومة الرافعات',
          practicalTasksCount: 4,
          completedPracticalTasks: 2,
          lastEvaluationScore: 88
        }
      },
      {
        id: 'sk-303',
        name: 'الصيانة التنبؤية بالاهتزازات للمنصات البحرية الهيدروليكية',
        category: 'تشغيلية وهندسية',
        currentLevel: 3,
        targetLevel: 4,
        gap: 1,
        priority: 'متوسطة',
        linkedExpert: {
          name: 'م. هيروشي تاناكا',
          role: 'كبير مهندسي أتمتة الموانئ والروبوتات',
          avatarInitials: 'هت',
          sessionsCompleted: 3,
          nextSessionDate: '2026-10-21'
        },
        linkedAsset: {
          id: 'base-ox-3',
          title: 'أنظمة الاستشعار الاهتزازي للمراسي والمحاور الحركية',
          project: 'أوكساجون'
        },
        learningPlan: {
          durationWeeks: 6,
          completionPercentage: 50,
          currentMilestone: 'معايرة 20 مستشعر اهتزاز بالليزر',
          practicalTasksCount: 3,
          completedPracticalTasks: 1,
          lastEvaluationScore: 85
        }
      }
    ]
  },
  {
    id: 'emp-4',
    employeeName: 'م. تركي الدوسري',
    role: 'مهندس أنظمة سكك حديدية وتحكم آلي بالأنفاق',
    department: 'إدارة النقل المستقل والأنفاق السفلية Spine',
    project: 'ذا لاين',
    avatarInitials: 'تد',
    experienceYears: 4,
    overallSkillReadiness: 70,
    skillsCount: 3,
    criticalGapsCount: 1,
    skills: [
      {
        id: 'sk-401',
        name: 'أنظمة استشعار ومحاكاة مخاطر السيول في الأنفاق متعددة الطبقات',
        category: 'تشغيلية وهندسية',
        currentLevel: 3,
        targetLevel: 5,
        gap: 2,
        priority: 'حرجة وعاجلة',
        linkedExpert: {
          name: 'د. ستيفن ووكر',
          role: 'كبير مستشاري الهندسة المدنية والأنفاق الجبلية',
          avatarInitials: 'سو',
          sessionsCompleted: 6,
          nextSessionDate: '2026-10-09'
        },
        linkedAsset: {
          id: 'base-line-3',
          title: 'بروتوكولات إدارة مخاطر السيول الجبلية وحماية البنية التحتية لمسار Spine',
          project: 'ذا لاين'
        },
        learningPlan: {
          durationWeeks: 10,
          completionPercentage: 65,
          currentMilestone: 'محاكاة تدفق 500 متر مكعب/ثانية في أحواض التهدئة السفلية',
          practicalTasksCount: 5,
          completedPracticalTasks: 3,
          lastEvaluationScore: 90
        }
      },
      {
        id: 'sk-402',
        name: 'بروتوكولات الاتصال فائق السرعة LTE-R للقطارات المغناطيسية',
        category: 'رقمية وأتمتة',
        currentLevel: 4,
        targetLevel: 4,
        gap: 0,
        priority: 'اعتيادية',
        linkedExpert: {
          name: 'د. ستيفن ووكر',
          role: 'كبير مستشاري الهندسة المدنية والأنفاق الجبلية',
          avatarInitials: 'سو',
          sessionsCompleted: 4,
          nextSessionDate: '2026-10-22'
        },
        linkedAsset: {
          id: 'base-line-3',
          title: 'إشارات التحكم المركزي لأنفاق النقل فائق السرعة',
          project: 'ذا لاين'
        },
        learningPlan: {
          durationWeeks: 4,
          completionPercentage: 100,
          currentMilestone: 'اكتملت جميع المهام العملية والتقييم 95%',
          practicalTasksCount: 3,
          completedPracticalTasks: 3,
          lastEvaluationScore: 95
        }
      },
      {
        id: 'sk-403',
        name: 'مقاومة الإجهاد الإنشائي لبطانات الأنفاق الخرسانية',
        category: 'فنية تخصصية',
        currentLevel: 3,
        targetLevel: 5,
        gap: 2,
        priority: 'حرجة وعاجلة',
        linkedExpert: {
          name: 'د. ستيفن ووكر',
          role: 'كبير مستشاري الهندسة المدنية والأنفاق الجبلية',
          avatarInitials: 'سو',
          sessionsCompleted: 5,
          nextSessionDate: '2026-10-16'
        },
        linkedAsset: {
          id: 'base-line-3',
          title: 'حسابات الإجهاد الصخري والضغط الجانبي لبطانات الأنفاق في الصخور الرسوبية',
          project: 'ذا لاين'
        },
        learningPlan: {
          durationWeeks: 8,
          completionPercentage: 60,
          currentMilestone: 'فحص ميكانيكي لعينات النفق رقم 3 بجهاز الضغط الهيدروليكي',
          practicalTasksCount: 4,
          completedPracticalTasks: 2,
          lastEvaluationScore: 87
        }
      }
    ]
  }
];
