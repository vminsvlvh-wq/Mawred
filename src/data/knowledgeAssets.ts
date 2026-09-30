export type KnowledgeClassification = 'فنية' | 'إدارية' | 'استراتيجية';
export type AssetLifecycleStatus = 'مسودة' | 'مراجعة خبير' | 'معتمد';

export const SUBCATEGORIES_BY_CLASSIFICATION: Record<KnowledgeClassification, string[]> = {
  'فنية': ['معدات', 'استدامة', 'لوجستيات', 'هندسة وبناء', 'طاقة متجددة', 'أنظمة وتقنية'],
  'إدارية': ['لوجستيات', 'إجراءات وتشغيل', 'معدات ومرافق', 'إدارة مشاريع', 'استدامة وجودة', 'موارد وتدريب'],
  'استراتيجية': ['استدامة', 'لوجستيات استثمارية', 'حوكمة وسياسات', 'توطين معرفي', 'إدارة مخاطر', 'معدات وبنية تحتية']
};

export interface PracticalImpact {
  appliedAt: string;
  achievement: string;
  type: 'تقليل وقت' | 'خفض تكلفة' | 'تجنب خطأ';
  evidence: string;
  metricValue?: string;
}

export interface LessonLearnedCard {
  problem: string;
  rootCause: string;
  testedSolution: string;
  whenToReuse: string;
  outcomeMetric: string;
  author: string;
  reviewer: string;
}

export interface CrossProjectAdaptation {
  targetProject: string;
  suitabilityScore: number; // 0-100
  contextDifferences: {
    climate: string;
    geologyOrEnvironment: string;
    supplyChainOrRegulations: string;
  };
  adaptationGuidelines: string[];
  status: 'جاهز للتطبيق' | 'تم التكييف والاعتماد' | 'مقترح';
}

export interface ProjectKnowledgeAsset {
  id: string;
  title: string;
  content: string;
  category: string;
  classification: KnowledgeClassification;
  subCategory?: string;
  lifecycleStatus?: AssetLifecycleStatus;
  reviewerName?: string;
  approvalDate?: string;
  sourceReference?: string;
  practicalImpact?: PracticalImpact;
  isDemoData?: boolean;
  tags: string[];
  project: string;
  author: string;
  date: string;
  dueDate?: string;
  linkedAssets?: string[];
  confidence?: number;
  circulation?: number;

  // Knowledge validity and review expiry
  reviewDueDate?: string;
  lastReviewedDate?: string;
  reviewStatus?: 'صالح ومحدث' | 'قريب المراجعة' | 'يحتاج تحديث عاجل';
  reviewChangeTrigger?: string;

  // Lesson Learned structured card
  lessonLearnedCard?: LessonLearnedCard;

  // Cross-project lessons generalization
  crossProjectAdaptations?: CrossProjectAdaptation[];
}

export const INITIAL_KNOWLEDGE_ASSETS: ProjectKnowledgeAsset[] = [
  // نيوم
  {
    id: 'base-1',
    title: 'معايير تصريف حرارة خلايا الهيدروجين الأخضر',
    content: 'بروتوكولات التبريد بالسوائل والمغنيسيوم عند درجات الحرارة المرتفعة لمشاريع الهيدروجين في نيوم لتفادي فقدان الضغط وتحسين إنتاج الطاقة المستدامة بنسبة 18%.',
    category: 'طاقة متجددة',
    classification: 'فنية',
    subCategory: 'معدات',
    lifecycleStatus: 'معتمد',
    reviewerName: 'د. يورغن شتراوس (كبير خبراء الهيدروجين)',
    approvalDate: '٢٩ يونيو ٢٠٢٦',
    sourceReference: 'محضر اختبار الأداء الهيدروجيني الميداني #NEOM-H2-88',
    reviewDueDate: '2026-10-15',
    lastReviewedDate: '2026-06-29',
    reviewStatus: 'قريب المراجعة',
    reviewChangeTrigger: 'تحديث كود تصنيع صمامات الهيدروجين وتوريد دفعة جديدة من المبادلات الحرارية',
    lessonLearnedCard: {
      problem: 'هبوط مفاجئ في كفاءة التبريد لخلايا التحليل الكهربائي عند تجاوز الحرارة المحيطة 48 درجة مئوية في صيف نيوم، مما أدى لتوقف المحطة اضطرارياً.',
      rootCause: 'الاعتماد على سوائل تبريد مائية قياسية مصممة للمناخ الأوروبي، دون احتساب لزوجة السائل وانخفاض التوصيل الحراري في البيئة الصحراوية الشديدة.',
      testedSolution: 'إضافة جسيمات نانوية من هيدروكسيد المغنيسيوم إلى سائل التبريد وإعادة ضبط خوارزمية ضخ الصمامات تلقائياً عند 45 درجة مئوية.',
      whenToReuse: 'يُطبق فوراً في كافة محطات الهيدروجين الأخضر والأمونيا في المناطق الحارة (أوكساجون، الجبيل، ينبع، محطات شمسية نائية) عند تخطي درجات الحرارة 42 مئوية.',
      outcomeMetric: 'منع توقف المحطة بالكامل وزيادة كفاءة إنتاج الهيدروجين بنسبة 18% وتوفير 4.2 مليون ريال سنوياً.',
      author: 'د. يورغن شتراوس',
      reviewer: 'م. ريان القحطاني'
    },
    crossProjectAdaptations: [
      {
        targetProject: 'أوكساجون',
        suitabilityScore: 95,
        contextDifferences: {
          climate: 'رطوبة ساحلية أعلى بنسبة 40% مقارنة بوادي نيوم الجاف.',
          geologyOrEnvironment: 'بيئة منصات بحرية عائمة ومحدودية المساحة الأرضية للمبادلات.',
          supplyChainOrRegulations: 'تطبيق لوائح الملاحة البحرية لمنع أي تسرب للمياه المفتوحة.'
        },
        adaptationGuidelines: [
          'استخدام مضخات تيتانيوم مقاومة لرذاذ الملح البحري في منظومة التبريد.',
          'تقليص حجم المبادلات الحرارية باستخدام تقنية الألواح المدمجة Micro-channel.',
          'إضافة حساسات رصد رطوبة إضافية في غرف التحكم المغلقة.'
        ],
        status: 'جاهز للتطبيق'
      },
      {
        targetProject: 'البحر الأحمر',
        suitabilityScore: 82,
        contextDifferences: {
          climate: 'درجات حرارة ورطوبة بحرية مرتفعة صيفاً.',
          geologyOrEnvironment: 'محميات بيئية حساسة جداً تحظر استخدام أي سوائل كيميائية قد تتسرب للتربة.',
          supplyChainOrRegulations: 'معايير صارمة جداً من الهيئة الإقليمية لحماية البحر الأحمر (PERSGA).'
        },
        adaptationGuidelines: [
          'استبدال سائل التبريد بمستحلب حيوي متحلل عضوياً معتمد من الهيئة البيئية.',
          'إلزامية وجود خزانات احتواء مزدوجة بسعة 150% من حجم السائل كإجراء احترازي.'
        ],
        status: 'مقترح'
      }
    ],
    practicalImpact: {
      appliedAt: 'محطة إنتاج الهيدروجين الأخضر بقطاع نيوم الصناعي',
      achievement: 'تحسين كفاءة إنتاج الطاقة بنسبة 18% وتفادي هبوط ضغط التبريد المفاجئ',
      type: 'خفض تكلفة',
      evidence: 'تقرير القياس اللحظي للضغط وسجلات الاستشعار الحقلية الحية',
      metricValue: 'توفير ٤.٢ مليون ريال سنوياً'
    },
    isDemoData: true,
    tags: ['هيدروجين', 'نيوم', 'تبريد', 'طاقة'],
    project: 'نيوم',
    author: 'د. يورغن شتراوس',
    date: '٢٩ يونيو ٢٠٢٦',
    confidence: 0.96,
    circulation: 1850
  },
  {
    id: 'base-neom-2',
    title: 'توظيف تقنيات التناضح العكسي المدعوم بالطاقة المتجددة لتحلية المياه',
    content: 'تصميم منظومة تحلية المياه الصديقة للبيئة الخالية من تصريف المحلول الملحي المركز، مع توطين تصنيع أغشية الترشيح النانوية محلياً في المملكة.',
    category: 'استدامة ومياه',
    classification: 'فنية',
    subCategory: 'استدامة',
    lifecycleStatus: 'معتمد',
    reviewerName: 'م. أحمد القحطاني (مدير المعرفة الوطنية)',
    approvalDate: '٢٦ يونيو ٢٠٢٦',
    sourceReference: 'دراسة جدوى تحلية المياه بالأغشية النانوية المعتمدة من كاوست',
    reviewDueDate: '2026-11-20',
    lastReviewedDate: '2026-06-26',
    reviewStatus: 'صالح ومحدث',
    reviewChangeTrigger: 'سريان الاتفاقية الصناعية مع سابك لإنتاج الأغشية النانوية بالجبيل',
    lessonLearnedCard: {
      problem: 'تلف مبكر لأغشية التناضح العكسي بعد 6 أشهر فقط من التشغيل بسبب ترسب السيليكا والأملاح الكلسية في مياه خليج العقبة العميقة.',
      rootCause: 'الاعتماد على المعالجة الكيميائية المسبقة دون ترشيح ميكانيكي دقيق للمواد الصلبة العالقة قبل مرحلة الضغط العالي.',
      testedSolution: 'إضافة مرحلة ترشيح فائق نانوي (Ultrafiltration) ذاتية الغسيل العكسي مع تخفيض معامل تركيز الملح عبر مرحلتين متتاليتين.',
      whenToReuse: 'في جميع محطات تحلية مياه البحر التي تغذي المنتجعات والمجمعات الحضرية في المشاريع الساحلية ذات الملوحة العالية.',
      outcomeMetric: 'مضاعفة العمر الافتراضي للأغشية من 12 إلى 36 شهراً وتوفير 3.8 مليون ريال في تكاليف قطع الغيار.',
      author: 'م. أحمد القحطاني',
      reviewer: 'د. يورغن شتراوس'
    },
    crossProjectAdaptations: [
      {
        targetProject: 'البحر الأحمر',
        suitabilityScore: 92,
        contextDifferences: {
          climate: 'مماثل لساحل نيوم ولكن مع تيارات بحرية أضعف في المياه الضحلة للجزر.',
          geologyOrEnvironment: 'قرب المحطات من الشعاب المرجانية يستلزم تصريف المحلول الملحي المركز بطريقة التشتيت العميق.',
          supplyChainOrRegulations: 'التزام كامل بمبدأ Zero Liquid Discharge (ZLD).'
        },
        adaptationGuidelines: [
          'ربط مخرج المحلول الملحي بمرافق استخراج الملح الصناعي لإنتاج ملح عالي النقاوة.',
          'استخدام مضخات استرجاع الطاقة ذات الكفاءة 97% لتقليل استهلاك بطاريات الطاقة الشمسية.'
        ],
        status: 'تم التكييف والاعتماد'
      }
    ],
    practicalImpact: {
      appliedAt: 'محطة تحلية مياه البحر بالطاقة الشمسية في نيوم',
      achievement: 'الاستغناء الكامل عن استيراد الأغشية وتصنيعها محلياً في المملكة بنسبة 100%',
      type: 'تقليل وقت',
      evidence: 'محضر استلام وفحص وتوريد الأغشية النانوية الوطنية المعتمدة',
      metricValue: 'تقليص زمن سلاسل الإمداد من ٩٠ يوماً إلى ٧ أيام'
    },
    isDemoData: true,
    tags: ['تحلية_مياه', 'نيوم', 'استدامة', 'طاقة_شمسية'],
    project: 'نيوم',
    author: 'م. أحمد القحطاني',
    date: '٢٥ يونيو ٢٠٢٦',
    dueDate: '2026-10-15',
    confidence: 0.94,
    circulation: 1420
  },
  {
    id: 'base-neom-3',
    title: 'حوكمة شبكات الطاقة الذكية وتوزيع الأحمال اللحظية بالذكاء الاصطناعي',
    content: 'استراتيجية ربط مصادر الرياح والطاقة الكهروضوئية في شبكة موحدة ذاتية الموازنة تعتمد على خوارزميات التنبؤ بالأرصاد الجوية لضمان ثبات الإمداد بنسبة 99.99%.',
    category: 'طاقة متجددة',
    classification: 'استراتيجية',
    subCategory: 'استدامة',
    lifecycleStatus: 'مراجعة خبير',
    reviewerName: 'د. ليلى السالم (قيد التدقيق الفني الميداني)',
    sourceReference: 'مسودة خوارزميات التنبؤ بالأحمال - مركز التحكم الموحد بنيوم #TR-904',
    practicalImpact: {
      appliedAt: 'شبكة الطاقة الذكية الموحدة في قطاع ذا لاين',
      achievement: 'توقع تقلبات الرياح والطاقة الشمسية ومنع انقطاع التيار الكهربائي في المرافق الحيوية',
      type: 'تجنب خطأ',
      evidence: 'سجل محاكاة الاستقرار الطاقي على مدار ٦ أشهر متواصلة',
      metricValue: 'تفادي ٣ حوادث انقطاع محتملة'
    },
    isDemoData: true,
    tags: ['طاقة_ذكية', 'نيوم', 'ذكاء_اصطناعي', 'حوكمة'],
    project: 'نيوم',
    author: 'د. ليلى السالم',
    date: '٢٠ يونيو ٢٠٢٦',
    confidence: 0.95,
    circulation: 1680
  },
  {
    id: 'base-neom-4',
    title: 'بروتوكولات الأمان السيبراني للأنظمة التشغيلية الصناعية (OT)',
    content: 'دليل شامل لربط المنشآت الحيوية في نيوم بأنظمة الدفاع السيبراني المتوافقة مع متطلبات الهيئة الوطنية للأمن السيبراني، ومنع التسلل للأجهزة الحقلية.',
    category: 'أمن سيبراني',
    classification: 'إدارية',
    subCategory: 'لوجستيات',
    lifecycleStatus: 'مسودة',
    sourceReference: 'مسودة أولية قيد المراجعة الفنية - الفريق الأمني السيبراني بنيوم',
    isDemoData: true,
    tags: ['أمن_سيبراني', 'نيوم', 'بنية_تحتية', 'حوكمة'],
    project: 'نيوم',
    author: 'م. راشد العتيبي',
    date: '١٥ يونيو ٢٠٢٦',
    confidence: 0.98,
    circulation: 1150
  },

  // البحر الأحمر
  {
    id: 'base-2',
    title: 'مقاومة التيارات المائية وتصميم القواعد الخرسانية العائمة',
    content: 'دليل حساب التيارات والرياح العاتية في ساحل البحر الأحمر وتأثيرها على توازن القواعد الهيكلية للفنادق العائمة مع حلول ميكانيكية للحد من الاهتزاز.',
    category: 'هندسة بحرية',
    classification: 'فنية',
    subCategory: 'معدات',
    lifecycleStatus: 'معتمد',
    reviewerName: 'د. ستيفن ووكر (خبير منشآت بحرية)',
    approvalDate: '٢٨ يونيو ٢٠٢٦',
    sourceReference: 'تقرير اختبارات حوض المحاكاة المائي المعتمد #RS-MAR-402',
    practicalImpact: {
      appliedAt: 'منتجع أمهات الشيخ - الفنادق العائمة',
      achievement: 'خفض اهتزازات القواعد الخرسانية بنسبة 45% وتحقيق ثبات إنشائي فائق',
      type: 'تجنب خطأ',
      evidence: 'بيانات أجهزة قياس التذبذب الجيروسكوبية وسجلات الأمان الإنشائي',
      metricValue: 'منع هدر إنشائي بقيمة ٨ ملايين ريال'
    },
    isDemoData: true,
    tags: ['البحر_الأحمر', 'خرسانة', 'هندسة', 'ملاحة'],
    project: 'البحر الأحمر',
    author: 'م. سليم الصغير',
    date: '٢٨ يونيو ٢٠٢٦',
    confidence: 0.93,
    circulation: 1240
  },
  {
    id: 'base-3',
    title: 'تصاميم الهياكل العائمة المقاومة للملوحة البحرية العالية بالجزر',
    content: 'دراسة حماية حديد التسليح واستخدام إضافات السيليكا النشطة لرفع مقاومة الخرسانة للامتصاص في الملوحة الشديدة لمشاريع البحر الأحمر الساحلية.',
    category: 'هندسة بحرية',
    classification: 'فنية',
    subCategory: 'معدات',
    lifecycleStatus: 'مراجعة خبير',
    reviewerName: 'م. طارق الزهراني (قيد المراجعة الميدانية)',
    sourceReference: 'نتائج الاختبارات الكيميائية لعينات الخرسانة المغمورة #RS-CHEM-119',
    practicalImpact: {
      appliedAt: 'أرصفة مارينا جزيرة شبيبارة',
      achievement: 'زيادة العمر الافتراضي لحديد التسليح من 25 سنة إلى 60 سنة في البيئة الملحية',
      type: 'خفض تكلفة',
      evidence: 'شهادة الاعتماد الكيميائي وفحوصات النفاذية المعملية',
      metricValue: 'توفير ٦.٥ مليون ريال في تكاليف الصيانة الدورية'
    },
    isDemoData: true,
    tags: ['هندسة', 'البحر_الأحمر', 'ملوحة', 'خرسانة'],
    project: 'البحر الأحمر',
    author: 'م. سليم الصغير',
    date: '٢٢ يونيو ٢٠٢٦',
    confidence: 0.92,
    circulation: 980
  },
  {
    id: 'base-5',
    title: 'تقييم نظم الطاقة الشمسية وتخزين البطاريات للجزر المنعزلة',
    content: 'منهجية دمج مصفوفات الألواح الكهروضوئية مع بطاريات الليثيوم وتصميم أنظمة الحماية للشبكات الدقيقة في المنتجعات السياحية الفاخرة التي تعتمد بنسبة 100% على الطاقة المتجددة.',
    category: 'طاقة متجددة',
    classification: 'فنية',
    subCategory: 'استدامة',
    lifecycleStatus: 'معتمد',
    reviewerName: 'د. يورغن شتراوس (مستشار أنظمة الطاقة)',
    approvalDate: '٢٠ يونيو ٢٠٢٦',
    sourceReference: 'مواصفة الشبكات المعزولة الكهروضوئية المعتمدة #RS-SOLAR-09',
    practicalImpact: {
      appliedAt: 'الشبكة الدقيقة لمنتجع جزيرة شريرة',
      achievement: 'تشغيل المنتجع بالكامل 24/7 بطاقة نظيفة بنسبة 100% دون انقطاع',
      type: 'خفض تكلفة',
      evidence: 'سجلات التشغيل الفعلي وسجلات نظام إدارة البطاريات (BMS)',
      metricValue: 'توفير استهلاك ٥٠٠ ألف لتر ديزل شهرياً'
    },
    isDemoData: true,
    tags: ['طاقة', 'البحر_الأحمر', 'شمسية', 'بطاريات'],
    project: 'البحر الأحمر',
    author: 'م. فهد الجابري',
    date: '١٨ يونيو ٢٠٢٦',
    dueDate: '2026-11-01',
    confidence: 0.95,
    circulation: 1530
  },
  {
    id: 'base-rs-4',
    title: 'استراتيجية الحياد الكربوني وإدارة المخلفات الصفرية في الجزر البكر',
    content: 'إطار تنفيذي لتطبيق الاقتصاد الدائري بنسبة 100% داخل مرافق الضيافة والمطارات التابعة لمشروع البحر الأحمر لضمان حماية الموائل الطبيعية.',
    category: 'استدامة وبيئة',
    classification: 'استراتيجية',
    subCategory: 'استدامة',
    lifecycleStatus: 'مسودة',
    sourceReference: 'مسودة السياسة البيئية الاستراتيجية - قيد التدقيق لدى هيئة البيئة',
    practicalImpact: {
      appliedAt: 'مطار البحر الأحمر الدولي والمنتجعات الرئيسية',
      achievement: 'تحويل 100% من المخلفات الصلبة عن المرادم وإعادة تدوير المياه الرمادية',
      type: 'تجنب خطأ',
      evidence: 'مؤشرات الأداء البيئي للربع الثاني من 2026',
      metricValue: 'صفر مخلفات مرادم (Zero-Waste to Landfill)'
    },
    isDemoData: true,
    tags: ['استدامة', 'البحر_الأحمر', 'حياد_كربوني', 'بيئة'],
    project: 'البحر الأحمر',
    author: 'د. منى الشريف',
    date: '١٠ يونيو ٢٠٢٦',
    confidence: 0.97,
    circulation: 1390
  },

  // ذا لاين
  {
    id: 'base-8',
    title: 'نظم الحوسبة المتطورة والتحكم الذاتي لقطار الهيدروجين فائق السرعة',
    content: 'بنية الربط اللاسلكي للقطارات السريعة وتنسيق الاتصالات اللحظية مع غرف التحكم الآلي لتجنب الاصطدام وزيادة الكفاءة الزمنية للنقل السفلي في ذا لاين.',
    category: 'تقنية معلومات',
    classification: 'فنية',
    subCategory: 'لوجستيات',
    lifecycleStatus: 'معتمد',
    reviewerName: 'د. ليلى السالم (رئيسة قسم الأنظمة الذكية)',
    approvalDate: '٢٥ يونيو ٢٠٢٦',
    sourceReference: 'بروتوكول أنظمة التحكم الذاتي بقطارات الأنفاق #LINE-RAIL-88',
    practicalImpact: {
      appliedAt: 'النفق الحركي السفلي (Spine) بمشروع ذا لاين',
      achievement: 'تقليص زمن الرحلة بين المحطات والوصول إلى أمان مطلق بنظام تفادي الاصطدام الذاتي',
      type: 'تقليل وقت',
      evidence: 'بيانات الرحلات التجريبية واختبارات الاستجابة في زمن أجزاء من الثانية',
      metricValue: 'خفض زمن التوقف بين القطارات إلى ٩٠ ثانية فقط'
    },
    isDemoData: true,
    tags: ['هيدروجين', 'قطار', 'تحكم_ذاتي', 'ذا_لاين'],
    project: 'ذا لاين',
    author: 'د. ليلى السالم',
    date: '٢٤ يونيو ٢٠٢٦',
    confidence: 0.96,
    circulation: 1720
  },
  {
    id: 'base-9',
    title: 'إدارة مخاطر السيول والرياح في التجاويف الجبلية بمشروع ذا لاين',
    content: 'تصميم قنوات تصريف ومصائد السيول الطبيعية بناءً على النمذجة الهيدرولوجية ثلاثية الأبعاد لحماية المنشآت والأنفاق الجبلية وتأمين الأساسات العميقة.',
    category: 'هندسة مدنية',
    classification: 'إدارية',
    subCategory: 'استدامة',
    lifecycleStatus: 'معتمد',
    reviewerName: 'د. ستيفن ووكر (استشاري المخاطر الجيوتقنية)',
    approvalDate: '٢٢ يونيو ٢٠٢٦',
    sourceReference: 'النموذج الهيدرولوجي الميداني لسفوح جبال مدين #LINE-HYDRO-301',
    practicalImpact: {
      appliedAt: 'القطاع الجبلي الشرقي من ذا لاين',
      achievement: 'حماية مسار الأنفاق الإنشائية وتصريف كامل لمياه الأمطار الغزيرة دون تأخير أعمال البناء',
      type: 'تجنب خطأ',
      evidence: 'سجلات الأمطار الموسمية واختبارات الجريان السطحي الحقيقية',
      metricValue: 'تفادي أضرار متوقعة بقيمة ١٢ مليون ريال'
    },
    isDemoData: true,
    tags: ['سيول', 'مخاطر', 'جبال', 'ذا_لاين', 'هندسة'],
    project: 'ذا لاين',
    author: 'د. ستيفن ووكر',
    date: '١٩ يونيو ٢٠٢٦',
    dueDate: '2026-09-30',
    confidence: 0.94,
    circulation: 1100
  },
  {
    id: 'base-line-3',
    title: 'المحاكاة الديناميكية لتيارات الهواء الطبيعية في الأبراج العمودية المتصلة',
    content: 'معايير تهوية الواجهات الزجاجية المزدوجة لخفض استهلاك أنظمة التكييف الميكانيكي بنسبة 40%، وتوفير بيئة حرارية مثالية على مدار العام.',
    category: 'هندسة معمارية',
    classification: 'فنية',
    subCategory: 'استدامة',
    lifecycleStatus: 'مراجعة خبير',
    reviewerName: 'م. كريم الخالدي (قيد التحقق الهندسي)',
    sourceReference: 'محاكاة ديناميكا الموائع الحسابية (CFD) لكتل الأبراج #LINE-CFD-77',
    practicalImpact: {
      appliedAt: 'الوحدات السكنية العمودية التجريبية (Module 1)',
      achievement: 'خفض الحمل الحراري بنسبة 40% وتوفير تدفق هواء نقي طبيعي مستمر',
      type: 'خفض تكلفة',
      evidence: 'قراءات مجسات الضغط والحرارة الداخلية على مدار 90 يوماً',
      metricValue: 'توفير ٣.٨ جيجاوات/ساعة سنوياً من الكهرباء'
    },
    isDemoData: true,
    tags: ['تهوية', 'طاقة', 'ذا_لاين', 'عمارة_بيئية'],
    project: 'ذا لاين',
    author: 'م. كريم الخالدي',
    date: '١٢ يونيو ٢٠٢٦',
    confidence: 0.95,
    circulation: 1310
  },

  // أوكساجون
  {
    id: 'base-6',
    title: 'بروتوكولات التفريغ الأوتوماتيكي بالذكاء الاصطناعي في الموانئ الرقمية',
    content: 'أتمتة الرافعات ورسم الخوارزميات الجغرافية لتنظيم حركة الشاحنات وسفن الحاويات الضخمة لرفع الكفاءة التشغيلية بنسبة 35% في ميناء أوكساجون.',
    category: 'لوجستيات',
    classification: 'إدارية',
    subCategory: 'لوجستيات',
    lifecycleStatus: 'معتمد',
    reviewerName: 'م. سارة الغامدي (كبير مهندسي الموانئ الذكية)',
    approvalDate: '٢٤ يونيو ٢٠٢٦',
    sourceReference: 'دليل تشغيل المحطة الآلية للحاويات بميناء أوكساجون #OX-PORT-01',
    practicalImpact: {
      appliedAt: 'محطة الحاويات الرئيسية بميناء أوكساجون المتطور',
      achievement: 'رفع سرعة تفريغ السفن بنسبة 35% والقضاء على طوابير الانتظار في المرسى',
      type: 'تقليل وقت',
      evidence: 'سجلات نظام إدارة المحطة الذكي (TOS) وتقارير تفريغ الحاويات اليومية',
      metricValue: 'تقليص زمن انتظار السفن من ٢٤ ساعة إلى ٤ ساعات فقط'
    },
    isDemoData: true,
    tags: ['ذكاء_اصطناعي', 'لوجستيات', 'موانئ', 'أتمتة'],
    project: 'أوكساجون',
    author: 'م. سارة الغامدي',
    date: '٢١ يونيو ٢٠٢٦',
    confidence: 0.95,
    circulation: 1450
  },
  {
    id: 'base-7',
    title: 'أتمتة الفرز في مستودعات التوزيع اللوجستية فائقة الضخامة',
    content: 'استخدام الروبوتات الذكية لجدولة وفرز المنتجات بناءً على الوجهات الجغرافية والسرعة المطلوبة باستخدام إنترنت الأشياء والذكاء الاصطناعي الصناعي.',
    category: 'أتمتة صناعية',
    classification: 'فنية',
    subCategory: 'لوجستيات',
    lifecycleStatus: 'معتمد',
    reviewerName: 'م. أحمد القحطاني (مدير المعرفة الوطنية)',
    approvalDate: '١٨ يونيو ٢٠٢٦',
    sourceReference: 'سجل تجارب الروبوتات الذاتية AMR بمستودع أوكساجون اللوجستي',
    practicalImpact: {
      appliedAt: 'مركز الفرز والتوزيع المركزي بمنطقة الصناعات المتقدمة',
      achievement: 'فرز 50,000 طرد يومياً بنسبة خطأ تعادل صفر تقريباً',
      type: 'تجنب خطأ',
      evidence: 'سجلات الماسحات الضوئية الباركودية ومطابقة الشحنات بالوجهات',
      metricValue: 'انخفاض معدل أخطاء التوجيه بنسبة ٩٩.٧%'
    },
    isDemoData: true,
    tags: ['أتمتة', 'لوجستيات', 'مستودعات', 'روبوتات'],
    project: 'أوكساجون',
    author: 'د. ستيفن ووكر',
    date: '١٦ يونيو ٢٠٢٦',
    confidence: 0.91,
    circulation: 990
  },
  {
    id: 'base-ox-3',
    title: 'توطين تصنيع توربينات الرياح البحرية والمولدات المغناطيسية الدائمة',
    content: 'دراسة نقل المعرفة الهندسية لتجميع التوربينات البحرية بالتعاون مع كبرى الشركات العالمية وتدريب الكوادر السعودية في المجمع الصناعي لأوكساجون.',
    category: 'تصنيع متقدم',
    classification: 'استراتيجية',
    subCategory: 'معدات',
    lifecycleStatus: 'مراجعة خبير',
    reviewerName: 'م. طارق الزهراني (مستشار التوطين الصناعي)',
    sourceReference: 'اتفاقية نقل التكنولوجيا وتأهيل المصانع الوطنية #OX-TECH-22',
    practicalImpact: {
      appliedAt: 'مجمع الصناعات النظيفة والمعدات الثقيلة بأوكساجون',
      achievement: 'تدريب 140 مهندساً سعودياً على تقنيات تجميع التوربينات المغناطيسية المتطورة',
      type: 'تقليل وقت',
      evidence: 'سجلات اجتياز برامج الاعتماد الهندسي وشهادات التصنيع المعتمدة',
      metricValue: 'تسريع خطة التوطين بنسبة ٣٠% متقدمة عن الجدول'
    },
    isDemoData: true,
    tags: ['تصنيع', 'طاقة_رياح', 'توطين', 'أوكساجون'],
    project: 'أوكساجون',
    author: 'م. طارق الزهراني',
    date: '٠٨ يونيو ٢٠٢٦',
    dueDate: '2026-12-20',
    confidence: 0.97,
    circulation: 1620
  },

  // القدية
  {
    id: 'base-qid-1',
    title: 'معايير السلامة الهندسية المتقدمة لقطارات الملاهي العملاقة على حافة المنحدرات',
    content: 'دليل التصميم الجيوتقني وتثبيت المسارات الفولاذية على جروف طويق الصخرية، مع أنظمة كبح مغناطيسي حاسوبية ثلاثية الحماية.',
    category: 'هندسة ترفيهية',
    classification: 'فنية',
    subCategory: 'معدات',
    lifecycleStatus: 'معتمد',
    reviewerName: 'د. حسام العمري (كبير خبراء السلامة الميكانيكية)',
    approvalDate: '٢٤ يونيو ٢٠٢٦',
    sourceReference: 'شهادة الاعتماد الدولية للمطابقة الإنشائية TUV #QID-SAFE-99',
    practicalImpact: {
      appliedAt: 'قطار الصقر الأفعواني (Falcon\'s Flight) بمتنزه 6 فلاجز القدية',
      achievement: 'تثبيت آمن لمسارات القطار على المنحدر الصخري بزاوية 90 درجة مع أعلى معايير أمان عالمية',
      type: 'تجنب خطأ',
      evidence: 'فحوصات الأشعة فوق الصوتية ومجسات الإجهاد الصخري المستمرة',
      metricValue: 'تحقيق أعلى تصنيف أمان دولي للقطارات السريعة'
    },
    isDemoData: true,
    tags: ['سلامة_هندسية', 'القدية', 'جبال_طويق', 'ميكانيكا'],
    project: 'القدية',
    author: 'د. حسام العمري',
    date: '٢٣ يونيو ٢٠٢٦',
    confidence: 0.96,
    circulation: 1350
  },
  {
    id: 'base-qid-2',
    title: 'أنظمة التبريد الخارجي المبتكرة ومكافحة الإجهاد الحراري بالمرافق المفتوحة',
    content: 'استخدام التغشية الدقيقة (Micro-mist) والستائر الهوائية الذكية لتخفيض درجة الحرارة المحسوسة بمقدار 8 درجات مئوية في الممرات الرياضية والترفيهية.',
    category: 'هندسة بيئية',
    classification: 'فنية',
    subCategory: 'استدامة',
    lifecycleStatus: 'معتمد',
    reviewerName: 'م. نورة الدوسري (استشارية المناخ الموضعي)',
    approvalDate: '١٩ يونيو ٢٠٢٦',
    sourceReference: 'تقرير قياس الإجهاد الحراري والمناخ الموضعي بساحات القدية #QID-CLIM-14',
    practicalImpact: {
      appliedAt: 'الممشى الرئيسي ومنطقة الألعاب المفتوحة بالقدية',
      achievement: 'خفض الحرارة المحسوسة بمقدار 8 درجات وإطالة ساعات التشغيل الصيفية',
      type: 'خفض تكلفة',
      evidence: 'قراءات مجسات WBGT الحرارية وسجلات راحة الزوار',
      metricValue: 'زيادة الإقبال الصيفي بنسبة ٤٥% وتوفير الطاقة بنسبة ٢٥%'
    },
    isDemoData: true,
    tags: ['تبريد_خارجي', 'القدية', 'مناخ', 'استدامة'],
    project: 'القدية',
    author: 'م. نورة الدوسري',
    date: '١٧ يونيو ٢٠٢٦',
    dueDate: '2026-10-30',
    confidence: 0.93,
    circulation: 1220
  },
  {
    id: 'base-qid-3',
    title: 'إدارة الحشود الذكية والتوجيه اللحظي بالرؤية الحاسوبية في الملاعب',
    content: 'منظومة إدارة تدفق الزوار والمشجعين في استاد القدية باستخدام كاميرات الذكاء الاصطناعي لمنع التكدس وتسهيل الإخلاء الآمن خلال دقائق معدودة.',
    category: 'ذكاء اصطناعي',
    classification: 'إدارية',
    subCategory: 'لوجستيات',
    lifecycleStatus: 'مراجعة خبير',
    reviewerName: 'م. فيصل المطيري (خبير إدارة الحشود والعمليات)',
    sourceReference: 'نموذج محاكاة الإخلاء الآلي لاستاد القدية الدولي #QID-STAD-03',
    practicalImpact: {
      appliedAt: 'بوابات ومدرجات استاد الأمير محمد بن سلمان بالقدية',
      achievement: 'تقليص وقت دخول 45,000 متفرج إلى نصف الوقت المعتاد دون أي اختناقات',
      type: 'تقليل وقت',
      evidence: 'سجلات بوابات العبور الإلكترونية وتحليلات الرؤية الحاسوبية الحية',
      metricValue: 'إخلاء كامل وسلس في أقل من ٦ دقائق عند الطوارئ'
    },
    isDemoData: true,
    tags: ['إدارة_حشود', 'القدية', 'رؤية_حاسوبية', 'ملاعب'],
    project: 'القدية',
    author: 'م. فيصل المطيري',
    date: '٠٥ يونيو ٢٠٢٦',
    confidence: 0.97,
    circulation: 1480
  },

  // أمالا
  {
    id: 'base-4',
    title: 'اعتماد بروتوكولات حماية وتكاثر الشعب المرجانية فائقة التكيف',
    content: 'توطين تقنيات الهندسة الوراثية للشعب المرجانية المقاومة لدرجات الحرارة المرتفعة بالتعاون مع كاوست لحماية البيئة البحرية وتنميتها بجزر أمالا.',
    category: 'بيئة مائية',
    classification: 'استراتيجية',
    subCategory: 'استدامة',
    lifecycleStatus: 'معتمد',
    reviewerName: 'د. يورغن شتراوس (كبير علماء البحار)',
    approvalDate: '٢٨ يونيو ٢٠٢٦',
    sourceReference: 'مشروع المشتل المرجاني الساحلي المشترك مع كاوست #AMA-CORAL-01',
    practicalImpact: {
      appliedAt: 'محمية الشعب المرجانية في خليج تريبل باي - أمالا',
      achievement: 'استزراع 100,000 مستعمرة مرجانية بمعدل بقاء يتجاوز 94%',
      type: 'تجنب خطأ',
      evidence: 'المسح الضوئي تحت المائي ثلاثي الأبعاد وتقارير صحة الشعاب الدورية',
      metricValue: 'حماية التنوع الحيوي البحري بنسبة ١٠٠%'
    },
    isDemoData: true,
    tags: ['بيئة', 'مرجان', 'البحر_الأحمر', 'استدامة', 'أمالا'],
    project: 'أمالا',
    author: 'د. يورغن شتراوس',
    date: '٢٧ يونيو ٢٠٢٦',
    confidence: 0.98,
    circulation: 1750
  },
  {
    id: 'base-amaala-2',
    title: 'معايير الإضاءة الليلية المظلمة (Dark Sky) لحماية مسارات السلاحف البحرية',
    content: 'دليل مواصفات الإنارة الخارجية الموجهة ذات الأطوال الموجية الدافئة لمنع تضليل صغار السلاحف البحرية والحفاظ على الشهادة الدولية لمحميات السماء المظلمة.',
    category: 'استدامة وبيئة',
    classification: 'إدارية',
    subCategory: 'استدامة',
    lifecycleStatus: 'معتمد',
    reviewerName: 'د. منى الشريف (مديرة الاستدامة والحياة الفطرية)',
    approvalDate: '١٧ يونيو ٢٠٢٦',
    sourceReference: 'الاعتماد الدولي لمنظمة السماء المظلمة (IDA) لمشروع أمالا',
    practicalImpact: {
      appliedAt: 'شواطئ تعشيش السلاحف بمحمية جزيرة الخالدية',
      achievement: 'صفر حوادث تضليل لصغار السلاحف صقرية المنقار بفضل الإنارة الذكية المحجوبة',
      type: 'تجنب خطأ',
      evidence: 'سجلات تتبع أعشاش السلاحف وشهادة السماء المظلمة السنوية',
      metricValue: 'نجاح تفقيس ووصول ٩٨% من صغار السلاحف للبحر بأمان'
    },
    isDemoData: true,
    tags: ['سماء_مظلمة', 'أمالا', 'سلاحف_بحرية', 'استدامة'],
    project: 'أمالا',
    author: 'د. منى الشريف',
    date: '١٤ يونيو ٢٠٢٦',
    dueDate: '2026-11-15',
    confidence: 0.94,
    circulation: 1180
  }
];

export function getProjectKnowledgeAssets(project?: string): ProjectKnowledgeAsset[] {
  let extraAssets: ProjectKnowledgeAsset[] = [];
  try {
    const saved = localStorage.getItem('mawred_extra_assets');
    if (saved) {
      extraAssets = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse extra assets', e);
  }

  const all = [...INITIAL_KNOWLEDGE_ASSETS, ...extraAssets];

  if (!project || project === 'جميع المشاريع') {
    return all;
  }

  return all.filter(a => a.project === project || (project === 'البحر الأحمر' && a.project === 'أمالا'));
}
