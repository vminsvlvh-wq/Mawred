export interface HandoverTask {
  id: string;
  title: string;
  category: 'توثيق فني' | 'محاكاة عملية' | 'تسليم الشيفرات والمخططات' | 'اعتماد وتوقيع';
  completed: boolean;
  notes?: string;
  completionDate?: string;
}

export interface HandoverSession {
  id: string;
  sessionNumber: number;
  date: string;
  topic: string;
  hoursSpent: number;
  practicalTaskAssigned: string;
  taskEvaluationScore: number; // 0-100
  traineeFeedback: string;
  expertFeedback: string;
  status: 'منفذة' | 'مجدولة' | 'قيد المراجعة';
}

export interface ExpertHandoverPlan {
  id: string;
  expertId: string;
  expertName: string;
  expertRole: string;
  expertTitle: string;
  departingDate: string; // ISO date format e.g. '2026-11-15'
  daysRemaining: number;
  project: string;
  urgency: 'حرجة ومستعجلة' | 'متقدمة' | 'جارية بانتظام' | 'مكتملة';
  
  // Receiving Saudi employee
  receivingEmployee: {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    avatarInitials: string;
  };
  
  // Knowledge handover scope
  knowledgeScope: {
    criticalAreas: string[];
    requiredAssetsCount: number;
    completedAssetsCount: number;
    description: string;
  };
  
  // Sessions
  totalPlannedSessions: number;
  completedSessions: number;
  remainingSessions: number;
  
  // Progress
  completionRate: number; // 0 to 100
  
  // Checklist tasks
  tasks: HandoverTask[];
  
  // Executed & scheduled sessions log
  sessionsLog: HandoverSession[];
  
  // Certification
  handoverCertificateStatus: 'قيد الإعداد' | 'جاهز للاعتماد' | 'معتمد وموقع';
  certifiedDate?: string;
  certifiedBy?: string;
}

export const INITIAL_HANDOVER_PLANS: ExpertHandoverPlan[] = [
  {
    id: 'hp-1',
    expertId: '2',
    expertName: 'د. يورغن شتراوس',
    expertRole: 'كبير خبراء الهيدروجين الأخضر وخلايا الوقود',
    expertTitle: 'مستشار كيميائي صناعي دولي • سيمنز وتيسين كروب سابقاً',
    departingDate: '2026-11-15',
    daysRemaining: 46,
    project: 'نيوم',
    urgency: 'حرجة ومستعجلة',
    receivingEmployee: {
      id: 'n3',
      name: 'م. ريان القحطاني',
      role: 'مهندس طاقة متجددة ونظم بيئية',
      department: 'تحالف الهيدروجين الأخضر والطاقة النظيفة بقطاع نيوم',
      email: 'rayan.q@neom.com',
      phone: '+966 50 491 2831',
      avatarInitials: 'رق'
    },
    knowledgeScope: {
      criticalAreas: [
        'معايير تصريف حرارة خلايا التحليل الكهربائي عند حرارة تفوق +50 مئوية',
        'خوارزميات الضبط التلقائي لصمامات تدفق الأمونيا الخضراء السائلة',
        'مخططات الاستجابة لحوادث تسرب الضغط الفائق في المفاعلات الحقلية',
        'كود المحاكاة الديناميكي للربط مع شبكة الطاقة الشمسية والرياح'
      ],
      requiredAssetsCount: 5,
      completedAssetsCount: 4,
      description: 'نقل كامل العهدة الفنية والمعرفية لمحطة إنتاج الهيدروجين الأخضر بقطاع أوكساجون/نيوم الصناعي، وضمان قدرة الكادر الوطني على الإدارة المستقلة بنسبة 100% قبل انتهاء العقد الاستشاري.'
    },
    totalPlannedSessions: 10,
    completedSessions: 7,
    remainingSessions: 3,
    completionRate: 78,
    tasks: [
      {
        id: 't-1',
        title: 'توثيق معادلات التبريد بالسوائل والمغنيسيوم في دليل هندسي معتمد',
        category: 'توثيق فني',
        completed: true,
        completionDate: '2026-09-15',
        notes: 'تم اعتماد الوثيقة برقم NEOM-H2-TECH-01'
      },
      {
        id: 't-2',
        title: 'تنفيذ سيناريو محاكاة ميداني مستقل لانقطاع التبريد المفاجئ دون تدخل الخبير',
        category: 'محاكاة عملية',
        completed: true,
        completionDate: '2026-09-22',
        notes: 'حقق م. ريان درجة تقييم 95% في التعامل مع ضغط الصمامات'
      },
      {
        id: 't-3',
        title: 'تسليم ومطابقة أكواد محاكاة المحطة الهيدروجينية وإيداعها في مستودع المنصة',
        category: 'تسليم الشيفرات والمخططات',
        completed: true,
        completionDate: '2026-09-28',
        notes: 'تم فحص الشفرات البرمجية وموافقتها لمعايير الأمان الوطنية'
      },
      {
        id: 't-4',
        title: 'إدارة تشغيل الوردية الكاملة لمدة 48 ساعة متواصلة تحت إشراف مراقب فقط',
        category: 'محاكاة عملية',
        completed: false,
        notes: 'مجدولة للأسبوع القادم ضمن الجلسة رقم 8'
      },
      {
        id: 't-5',
        title: 'توقيع المحضر النهائي لنقل العهدة المعرفية واعتماد الإدارة العليا',
        category: 'اعتماد وتوقيع',
        completed: false,
        notes: 'يتطلب إتمام الجلسات المتبقية واختبار الجاهزية النهائي'
      }
    ],
    sessionsLog: [
      {
        id: 's-1',
        sessionNumber: 1,
        date: '2026-08-10',
        topic: 'تحليل البنية الهندسية لمحطة التحليل الكهربائي وحسابات فقدان الضغط',
        hoursSpent: 4,
        practicalTaskAssigned: 'إعادة مراجعة حسابات التدفق لـ 12 صمام تبريد',
        taskEvaluationScore: 88,
        traineeFeedback: 'تم استيعاب معادلات ديناميكا الموائع والفرق بين النماذج النظرية والواقع الميداني.',
        expertFeedback: 'أظهر م. ريان دقة عالية في التعامل مع الحسابات الرياضية المتقدمة.',
        status: 'منفذة'
      },
      {
        id: 's-2',
        sessionNumber: 2,
        date: '2026-08-18',
        topic: 'بروتوكولات الأمان لمنع اختلاط الأكسجين والهيدروجين في غرف التحليل',
        hoursSpent: 4,
        practicalTaskAssigned: 'معايرة أجهزة الاستشعار الكهروكيميائية الحقلية',
        taskEvaluationScore: 92,
        traineeFeedback: 'تدريب عملي على أجهزة الكشف الحية واختبار سرعة الاستجابة.',
        expertFeedback: 'التزام متميز بمعايير السلامة الصناعية الصارمة.',
        status: 'منفذة'
      },
      {
        id: 's-3',
        sessionNumber: 3,
        date: '2026-08-27',
        topic: 'مخططات السيطرة عند هبوط التردد الكهربائي من محطات الرياح',
        hoursSpent: 3.5,
        practicalTaskAssigned: 'محاكاة هبوط مفاجئ بنسبة 30% في الحمل وموازنة الخلايا',
        taskEvaluationScore: 90,
        traineeFeedback: 'التطبيق العملي على لوحة التحكم المركزية أوضح أهمية خوارزميات الاستباق.',
        expertFeedback: 'استيعاب ممتاز لآليات التحكم التناسبي التكاملي التفاضلي (PID).',
        status: 'منفذة'
      },
      {
        id: 's-4',
        sessionNumber: 4,
        date: '2026-09-05',
        topic: 'نقل وتخزين الأمونيا الخضراء تحت ضغط منخفض والتبريد العميق (-33 مئوية)',
        hoursSpent: 4,
        practicalTaskAssigned: 'فحص عوازل الخزانات الكروية وقياس معدل التبخر',
        taskEvaluationScore: 94,
        traineeFeedback: 'توثيق كامل لكافة الإجراءات التشغيلية القياسية (SOPs).',
        expertFeedback: 'جاهزية عالية للتعامل مع أنظمة التخزين الكبرى.',
        status: 'منفذة'
      },
      {
        id: 's-5',
        sessionNumber: 5,
        date: '2026-09-14',
        topic: 'تسليم وثائق المواصفات الفنية لقطع الغيار الحساسة ومورديها المعتمدين',
        hoursSpent: 3,
        practicalTaskAssigned: 'بناء قاعدة بيانات القطع الحيوية وبدائل التصنيع الوطني في سابك ومعدنية',
        taskEvaluationScore: 96,
        traineeFeedback: 'تم ربط 14 قطعة حرجة بمصانع وطنية في الجبيل وينبع لتفادي انقطاع سلاسل الإمداد.',
        expertFeedback: 'خطوة استراتيجية ممتازة لتعزيز المحتوى المحلي والاستقلالية.',
        status: 'منفذة'
      },
      {
        id: 's-6',
        sessionNumber: 6,
        date: '2026-09-21',
        topic: 'التدريب على سيناريوهات الطوارئ من الدرجة الثالثة (انفصال الأنابيب)',
        hoursSpent: 4,
        practicalTaskAssigned: 'عزل الخط الثاني وتفريغ النيتروجين الخامل خلال 90 ثانية',
        taskEvaluationScore: 95,
        traineeFeedback: 'التنفيذ استغرق 78 ثانية فقط بنجاح تام وفق متطلبات الدفاع المدني الصناعي.',
        expertFeedback: 'كفاءة قيادية ميدانية هادئة ودقيقة.',
        status: 'منفذة'
      },
      {
        id: 's-7',
        sessionNumber: 7,
        date: '2026-09-28',
        topic: 'تسليم ومراجعة شفرات المصدر لبرنامج المحاكاة ومفاتيح التشفير',
        hoursSpent: 3.5,
        practicalTaskAssigned: 'تشغيل نسخة محاكاة محلية على خوادم نيوم والتأكد من تطابق المخرجات',
        taskEvaluationScore: 98,
        traineeFeedback: 'تمت المزامنة بنجاح وتم فك التبعية عن سيرفرات الشركة الألمانية بالكامل.',
        expertFeedback: 'المهندس ريان قادر تماماً على تعديل وتطوير الكود مستقبلاً دون مساعدة.',
        status: 'منفذة'
      }
    ],
    handoverCertificateStatus: 'قيد الإعداد'
  },
  {
    id: 'hp-2',
    expertId: '3',
    expertName: 'د. إيلينا روستوفا',
    expertRole: 'خبيرة استزراع الشعاب المرجانية والبيئة البحرية',
    expertTitle: 'كبير علماء الأحياء البحرية الساحلية • معهد ماكس بلانك',
    departingDate: '2026-10-20',
    daysRemaining: 20,
    project: 'البحر الأحمر',
    urgency: 'حرجة ومستعجلة',
    receivingEmployee: {
      id: 'n4',
      name: 'م. لمى الشهري',
      role: 'مهندسة هياكل بحرية واستدامة سواحل',
      department: 'قسم المنشآت العائمة وحماية الموائل البحرية',
      email: 'lama.s@redseaglobal.com',
      phone: '+966 55 812 9044',
      avatarInitials: 'لش'
    },
    knowledgeScope: {
      criticalAreas: [
        'معايير التكاثر الدقيق للشعاب المرجانية فائقة التحمل الحراري في مشاتل جزر شبي بارا',
        'مواصفات الخرسانة منخفضة الكربون والحيادية للمياه المالحة لمنع تسمم الكائنات الحية',
        'بروتوكول الفحص الجينومي الفصلي لرصد التنوع الحيوي حول الفنادق العائمة'
      ],
      requiredAssetsCount: 4,
      completedAssetsCount: 4,
      description: 'استكمال نقل أسرار مشتل المرجان الأكبر عالمياً وحماية 4,000 كيلومتر مربع من البيئة البحرية في وجهة البحر الأحمر، وتمكين المهندسة لمى من قيادة التقييمات البيئية والتوسع الميداني.'
    },
    totalPlannedSessions: 8,
    completedSessions: 7,
    remainingSessions: 1,
    completionRate: 90,
    tasks: [
      {
        id: 't-201',
        title: 'توثيق معايير تركيب الحاضنات المرجانية الخرسانية ثلاثية الأبعاد',
        category: 'توثيق فني',
        completed: true,
        completionDate: '2026-08-25',
        notes: 'اعتمدت كأصل معرفي معمم لكافة جزر الوجهة'
      },
      {
        id: 't-202',
        title: 'إجراء مسح ميداني غاطس وتحديد نقاط استقرار المرجان بدون توجيه الخبير',
        category: 'محاكاة عملية',
        completed: true,
        completionDate: '2026-09-12',
        notes: 'نفذت م. لمى غطسة الفحص ووثقت 48 عينة بنجاح'
      },
      {
        id: 't-203',
        title: 'تسليم بنك البيانات الجينومية والعينات الحيوية لمركز أبحاث كاوست الشريك',
        category: 'تسليم الشيفرات والمخططات',
        completed: true,
        completionDate: '2026-09-24',
        notes: 'تم الإيداع والأرشفة السحابية بنجاح'
      },
      {
        id: 't-204',
        title: 'الجلسة النهائية ومحاكاة مواجهة موجة ابيضاض مرجاني غير متوقعة',
        category: 'محاكاة عملية',
        completed: false,
        notes: 'مجدولة ليوم الأحد القادم'
      },
      {
        id: 't-205',
        title: 'توقيع شهادة اكتمال التسليم المعرفي المشتركة',
        category: 'اعتماد وتوقيع',
        completed: false,
        notes: 'جاهزة للطباعة والتوقيع فور إتمام الجلسة الأخيرة'
      }
    ],
    sessionsLog: [
      {
        id: 's-201',
        sessionNumber: 1,
        date: '2026-08-05',
        topic: 'فسيولوجيا المرجان المقاوم للحرارة في خليج العقبة والبحر الأحمر',
        hoursSpent: 4,
        practicalTaskAssigned: 'عزل 5 مستعمرات مرجانية سليمة من موقع شبي بارا',
        taskEvaluationScore: 94,
        traineeFeedback: 'فهم عميق لأسرار المقاومة الجينية وكيفية تهيئة بيئة المشاتل.',
        expertFeedback: 'شغف علمي وقدرة بحثية استثنائية.',
        status: 'منفذة'
      }
    ],
    handoverCertificateStatus: 'جاهز للاعتماد'
  },
  {
    id: 'hp-3',
    expertId: '1',
    expertName: 'د. ستيفن ووكر',
    expertRole: 'كبير مستشاري الهندسة المدنية والأنفاق الجبلية',
    expertTitle: 'خبير دولي بالأنفاق الصخرية العميقة وهيدرولوجيا السيول • بكتل وجاكوبس',
    departingDate: '2026-12-30',
    daysRemaining: 91,
    project: 'ذا لاين',
    urgency: 'جارية بانتظام',
    receivingEmployee: {
      id: 'n5',
      name: 'م. تركي الدوسري',
      role: 'مهندس أنظمة سكك حديدية وتحكم آلي بالأنفاق',
      department: 'إدارة النقل المستقل والأنفاق السفلية Spine',
      email: 'turki.d@neom.com',
      phone: '+966 50 332 1198',
      avatarInitials: 'تد'
    },
    knowledgeScope: {
      criticalAreas: [
        'نمذجة أحواض السيول الجبلية وحسابات الضغط الهيدروستاتيكي على أنفاق Spine',
        'مواصفات خرسانة الجليد والمناطق المرتفعة لمشروع تروجينا',
        'أنظمة تثبيت المنحدرات الصخرية ومراقبة التشققات الحقلية بالليزر'
      ],
      requiredAssetsCount: 6,
      completedAssetsCount: 3,
      description: 'نقل معرفة تصميم ومراقبة الأنفاق العميقة لمسار القطار فائق السرعة Spine وحماية المحطات السفلية من أي تدفق مائي محتمل على مدى 100 عام.'
    },
    totalPlannedSessions: 12,
    completedSessions: 7,
    remainingSessions: 5,
    completionRate: 64,
    tasks: [
      {
        id: 't-301',
        title: 'توثيق نماذج تدفق المياه الجوفية وحواجز الحماية الهيدروليكية',
        category: 'توثيق فني',
        completed: true,
        completionDate: '2026-08-30',
        notes: 'تم تسليم النموذج الهندسي 3D المعتمد'
      },
      {
        id: 't-302',
        title: 'اختبار محاكاة استشعار الضغط الصخري على بطانة النفق تحت حمولة القطار',
        category: 'محاكاة عملية',
        completed: true,
        completionDate: '2026-09-18',
        notes: 'أشرف م. تركي على قراءات الحساسات بالكامل'
      },
      {
        id: 't-303',
        title: 'توثيق مواصفات خرسانة تروجينا المقاومة للصدمات الحرارية تحت الصفر',
        category: 'توثيق فني',
        completed: false,
        notes: 'قيد المراجعة مع مختبرات المواد الوطنية'
      },
      {
        id: 't-304',
        title: 'تدريب تطبيقي على صيانة بوابات تصريف الطوارئ المغناطيسية',
        category: 'محاكاة عملية',
        completed: false,
        notes: 'مجدولة للشهر القادم'
      },
      {
        id: 't-305',
        title: 'التسليم الإداري والفني لمحضر إخلاء الطرف الاستشاري',
        category: 'اعتماد وتوقيع',
        completed: false,
        notes: 'معلق حتى استيفاء بقية المتطلبات'
      }
    ],
    sessionsLog: [],
    handoverCertificateStatus: 'قيد الإعداد'
  },
  {
    id: 'hp-4',
    expertId: '4',
    expertName: 'م. هيروشي تاناكا',
    expertRole: 'كبير مهندسي أتمتة الموانئ والتوأم الرقمي',
    expertTitle: 'خبير سلاسل الإمداد اللوجستية الذاتية والروبوتات • ميتسوبيشي وميناء يوكوهاما',
    departingDate: '2027-01-15',
    daysRemaining: 107,
    project: 'أوكساجون',
    urgency: 'جارية بانتظام',
    receivingEmployee: {
      id: 'n2',
      name: 'م. ناصر السبيعي',
      role: 'مهندس نظم أتمتة وتوأمة رقمية',
      department: 'إدارة الميناء الذكي والعمليات البحرية الذاتية بأوكساجون',
      email: 'nasser.s@oxagon.com',
      phone: '+966 54 220 8911',
      avatarInitials: 'نس'
    },
    knowledgeScope: {
      criticalAreas: [
        'خوارزميات برمجة الرافعات الذاتية وتنسيق حركة سفن الحاويات دون تدخل بشري',
        'مزامنة التوأم الرقمي الصناعي مع أجهزة إنترنت الأشياء الحقلية (IIoT)',
        'بروتوكولات الأمان السيبراني لمنع التشويش على المنصات العائمة'
      ],
      requiredAssetsCount: 5,
      completedAssetsCount: 2,
      description: 'تمكين فريق الميناء الوطني من التحكم الشامل بالتوأم الرقمي، وإجراء المعايرات البرمجية وخوارزميات الذكاء الاصطناعي دون الحاجة لفرق الدعم الخارجية.'
    },
    totalPlannedSessions: 10,
    completedSessions: 4,
    remainingSessions: 6,
    completionRate: 45,
    tasks: [
      {
        id: 't-401',
        title: 'توثيق بنية النظام البرمجي لشبكة SCADA والتوأم الرقمي',
        category: 'توثيق فني',
        completed: true,
        completionDate: '2026-08-15',
        notes: 'مكتمل بنسبة 100%'
      },
      {
        id: 't-402',
        title: 'إعادة برمجة مسار رافعة حاويات ذاتية خلال تجربة حية على الرصيف 4',
        category: 'محاكاة عملية',
        completed: true,
        completionDate: '2026-09-02',
        notes: 'تمت بنجاح وحققت دقة تموضع 2 ملم'
      },
      {
        id: 't-403',
        title: 'تسليم ومطابقة كود الربط السحابي مع منصة لوجستيات المملكة',
        category: 'تسليم الشيفرات والمخططات',
        completed: false,
        notes: 'قيد التطوير والاختبار'
      },
      {
        id: 't-404',
        title: 'إجراء محاكاة انقطاع شبكة 5G الخاصة والتحول إلى الاتصال الاحتياطي',
        category: 'محاكاة عملية',
        completed: false,
        notes: 'مجدول لشهر نوفمبر'
      }
    ],
    sessionsLog: [],
    handoverCertificateStatus: 'قيد الإعداد'
  }
];
