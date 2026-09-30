export interface LinkedProject {
  id: string;
  projectName: string;
  role: string;
  scope: string;
  status: 'نشط حالياً' | 'مرحلة الاعتماد' | 'مكتمل التوطين' | 'تحت التأسيس';
  localizationRate: number; // 0 to 100
  allocatedCadresCount: number;
  partnerEntity: string;
  keyAssetsCount: number;
  tags: string[];
}

export type TwinningReadinessLevel = 'high' | 'medium' | 'low';

export interface TwinningReadiness {
  level: TwinningReadinessLevel;
  score: number; // 0 to 100
  statusText: string;
  badgeText: string;
  availabilityStatus: 'متاح بالكامل' | 'مشغول جزئياً' | 'متاح قريباً';
  pluralStatus: 'متاحون بالكامل' | 'مشغولون جزئياً' | 'متاحون قريباً';
  projectsCount: number;
  availableHoursPerWeek: number;
  capacityDescription: string;
  badgeBg: string;
  badgeTextColor: string;
  badgeBorderColor: string;
  dotColor: string;
  pulseColor: string;
  progressColor: string;
  pillBg: string;
  explanation: string;
  allocationAdvice: string;
}

export function calculateTwinningReadiness(projectsCount: number): TwinningReadiness {
  if (projectsCount <= 1) {
    return {
      level: 'high',
      score: 94,
      statusText: 'جاهزية مرتفعة',
      badgeText: 'جاهزية مرتفعة',
      availabilityStatus: 'متاح بالكامل',
      pluralStatus: 'متاحون بالكامل',
      projectsCount,
      availableHoursPerWeek: 16,
      capacityDescription: 'تفرغ استشاري واسع لمرافقة الكوادر فورياً',
      badgeBg: 'bg-emerald-50',
      badgeTextColor: 'text-emerald-800',
      badgeBorderColor: 'border-emerald-300',
      dotColor: 'bg-emerald-500',
      pulseColor: 'bg-emerald-400',
      progressColor: 'bg-emerald-500',
      pillBg: 'bg-emerald-100 text-emerald-900',
      explanation: 'الخبير مرتبط بمشروع وطني واحد، مما يمنحه أعلى درجات التفرغ (16 ساعة أسبوعياً) لنقل المعرفة الضمنية والملازمة الميدانية للكوادر الوطنية.',
      allocationAdvice: 'الخيار الأسرع لمطابقة الاحتياجات العاجلة والبرامج المكثفة.'
    };
  } else if (projectsCount === 2) {
    return {
      level: 'medium',
      score: 68,
      statusText: 'جاهزية متوازنة',
      badgeText: 'جاهزية متوازنة',
      availabilityStatus: 'مشغول جزئياً',
      pluralStatus: 'مشغولون جزئياً',
      projectsCount,
      availableHoursPerWeek: 8,
      capacityDescription: 'تفرغ متوازن لجلسات أسبوعية منتظمة',
      badgeBg: 'bg-blue-50',
      badgeTextColor: 'text-blue-800',
      badgeBorderColor: 'border-blue-300',
      dotColor: 'bg-blue-500',
      pulseColor: 'bg-blue-400',
      progressColor: 'bg-blue-500',
      pillBg: 'bg-blue-100 text-blue-900',
      explanation: 'الخبير يوزع وقته الاستشاري بين مشروعين وطنيين، ولديه طاقة استيعابية معتمدة (8 ساعات أسبوعياً) لبرنامج توأمة إضافي.',
      allocationAdvice: 'مثالي للبرامج الميدانية المجدولة أسبوعياً ومراجعة الأصول المعرفية.'
    };
  } else {
    return {
      level: 'low',
      score: 38,
      statusText: 'جاهزية محدودة',
      badgeText: 'جاهزية محدودة',
      availabilityStatus: 'متاح قريباً',
      pluralStatus: 'متاحون قريباً',
      projectsCount,
      availableHoursPerWeek: 4,
      capacityDescription: 'تفرغ محدود - يتطلب تنسيقاً وجدولة مسبقة',
      badgeBg: 'bg-amber-50',
      badgeTextColor: 'text-amber-800',
      badgeBorderColor: 'border-amber-300',
      dotColor: 'bg-amber-500',
      pulseColor: 'bg-amber-400',
      progressColor: 'bg-amber-500',
      pillBg: 'bg-amber-100 text-amber-900',
      explanation: `الخبير منخرط في ${projectsCount} مشاريع وطنية كبرى متزامنة، مما يحد من ساعات التفرغ (4 ساعات أسبوعياً) ويستدعي التنسيق المسبق.`,
      allocationAdvice: 'يُفضّل للاستشارات التخصصية الدقيقة واعتماد الأصول المعرفية الكبرى.'
    };
  }
}

export function getExpertTwinningReadiness(expert: ExpertProfile): TwinningReadiness {
  const count = expert.currentProjects ? expert.currentProjects.length : 0;
  return calculateTwinningReadiness(count);
}

export interface ExpertProfile {
  id: string;
  name: string;
  title: string;
  role: string;
  organization: string;
  skills: string[];
  rating: number;
  sessions: number;
  image: string;
  avatarColor: string;
  experienceYears: number;
  currentProjects: LinkedProject[];
  totalLocalizedAssets: number;
  activeNationalTrainees: number;
  availability: 'متاح للتوأمة' | 'جلسات محجوزة جزئياً' | 'مشغول ميدانياً';
  bio: string;
}

export interface NoviceCadre {
  id: string;
  name: string;
  role: string;
  project: string;
  department: string;
  targetSkill: string;
  goal: string;
  skills: string[];
  image: string;
}

export const NATIONAL_PROJECTS_LIST = [
  'جميع المشاريع',
  'ذا لاين',
  'نيوم',
  'أوكساجون',
  'البحر الأحمر',
  'أمالا',
  'القدية',
  'تروجينا'
];

export const INITIAL_EXPERTS: ExpertProfile[] = [
  {
    id: '1',
    name: 'د. ستيفن ووكر',
    title: 'كبير مستشاري الهندسة المدنية والأنفاق الجبلية',
    role: 'خبير هندسة مدنية ومخاطر السيول',
    organization: 'استشاري عالمي معتمد • بكتل وجاكوبس الدولية سابقاً',
    skills: ['إدارة مخاطر السيول', 'تصميم إنشائي للأنفاق', 'هيدرولوجيا المناطق الجافة', 'الخرسانة فائقة المتانة'],
    rating: 4.9,
    sessions: 124,
    image: 'SW',
    avatarColor: 'from-amber-600 to-yellow-500',
    experienceYears: 22,
    availability: 'متاح للتوأمة',
    bio: 'خبير دولي متخصص في بناء الأنفاق الصخرية العميقة وتصريف السيول في البيئات التضاريسية المعقدة، يقود برامج تدريب مهندسي نيوم على النمذجة الهيدروليكية ثلاثية الأبعاد.',
    totalLocalizedAssets: 14,
    activeNationalTrainees: 12,
    currentProjects: [
      {
        id: 'p1-1',
        projectName: 'ذا لاين',
        role: 'كبير مستشاري تصريف السيول ومسارات الأنفاق السفلية',
        scope: 'الإشراف على نمذجة أحواض السيول الجبلية وحماية البنية التحتية متعددة الطبقات لمسار القطار السريع Spine.',
        status: 'نشط حالياً',
        localizationRate: 78,
        allocatedCadresCount: 5,
        partnerEntity: 'شركة نيوم • صندوق الاستثمارات العامة',
        keyAssetsCount: 6,
        tags: ['الأنفاق السفلية', 'مخاطر السيول', 'Spine Transport']
      },
      {
        id: 'p1-2',
        projectName: 'تروجينا',
        role: 'استشاري سدود المرتفعات واختبارات خرسانة الجليد',
        scope: 'تصميم بحيرة تروجينا التخزينية وتثبيت المنحدرات الصخرية ومقاومة الصدمات الحرارية عند درجات حرارة تحت الصفر.',
        status: 'مرحلة الاعتماد',
        localizationRate: 85,
        allocatedCadresCount: 4,
        partnerEntity: 'نيوم السياحة الجبلية • مقاولون وطنيون',
        keyAssetsCount: 5,
        tags: ['سدود المرتفعات', 'مقاومة التجمد', 'تثبيت المنحدرات']
      },
      {
        id: 'p1-3',
        projectName: 'أوكساجون',
        role: 'مستشار تثبيت القواعد البحرية والتربة الرخوة',
        scope: 'مراقبة هبوط التربة الساحلية واختبار أحمال الركائز العميقة لمنصات التصنيع المتقدمة.',
        status: 'نشط حالياً',
        localizationRate: 70,
        allocatedCadresCount: 3,
        partnerEntity: 'أوكساجون للموانئ والصناعات الذكية',
        keyAssetsCount: 3,
        tags: ['الأساسات البحرية', 'هبوط التربة', 'الركائز العميقة']
      }
    ]
  },
  {
    id: '2',
    name: 'م. سارة الغامدي',
    title: 'كبير مهندسي البرمجيات والمدن الذكية والذكاء الاصطناعي',
    role: 'كبير مهندسي الذكاء الاصطناعي والتوأم الرقمي',
    organization: 'خبير تقني وطني معتمد • الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)',
    skills: ['التوأم الرقمي (Digital Twin)', 'الأمن السيبراني الصناعي', 'أتمتة الموانئ', 'خوارزميات المسارات الذكية'],
    rating: 4.8,
    sessions: 96,
    image: 'SG',
    avatarColor: 'from-emerald-600 to-teal-500',
    experienceYears: 16,
    availability: 'متاح للتوأمة',
    bio: 'قائدة التحول التقني في الأنظمة الموزعة، متخصصة في حوسبة الحافة وأنظمة التوأمة الرقمية للموانئ اللوجستية والمباني الذكية فائقة الارتفاع.',
    totalLocalizedAssets: 18,
    activeNationalTrainees: 15,
    currentProjects: [
      {
        id: 'p2-1',
        projectName: 'أوكساجون',
        role: 'قائد فريق خوارزميات أتمتة الموانئ والرافعات الذاتية',
        scope: 'تطوير وتشغيل التوأم الرقمي لمحطة الحاويات الآلية المتكاملة وربطها بنظام الجمارك الموحد.',
        status: 'نشط حالياً',
        localizationRate: 88,
        allocatedCadresCount: 8,
        partnerEntity: 'شركة أوكساجون • الهيئة العامة للموانئ (موانئ)',
        keyAssetsCount: 7,
        tags: ['الموانئ الذكية', 'الرافعات الآلية', 'Digital Twin']
      },
      {
        id: 'p2-2',
        projectName: 'ذا لاين',
        role: 'مستشارة أنظمة الاستشعار اللحظي للمباني الشاهقة',
        scope: 'بناء شبكة إنترنت الأشياء الصناعية (IIoT) لمراقبة الأداء البيئي والطاقي للقطاعات السكنية والخدمية.',
        status: 'نشط حالياً',
        localizationRate: 82,
        allocatedCadresCount: 4,
        partnerEntity: 'نيوم للتقنية الرقمية • مركز التحكم الموحد',
        keyAssetsCount: 6,
        tags: ['إنترنت الأشياء IIoT', 'المدن الإدراكية', 'التحكم الذكي']
      }
    ]
  },
  {
    id: '3',
    name: 'د. يورغن شتراوس',
    title: 'خبير هندسة الهيدروجين الأخضر والتحول الطاقي',
    role: 'كبير خبراء كيميائية الهيدروجين وأنظمة التحليل الكهربائي',
    organization: 'معهد فراونهوفر الألماني لأنظمة الطاقة الشمسية والهيدروجين',
    skills: ['التحليل الكهربائي للماء', 'تخزين ونقل الأمونيا الخضراء', 'إدارة الحرارة الفائقة', 'بروتوكولات الأمان الهيدروجيني'],
    rating: 4.9,
    sessions: 142,
    image: 'JS',
    avatarColor: 'from-blue-600 to-indigo-500',
    experienceYears: 24,
    availability: 'جلسات محجوزة جزئياً',
    bio: 'أحد رواد تكنولوجيا الهيدروجين الأخضر على مستوى العالم، يشرف على أكبر مصنع لإنتاج الهيدروجين والأمونيا في العالم بنيوم وتوطين أسرار تشغيل المحللات الكهربائية.',
    totalLocalizedAssets: 16,
    activeNationalTrainees: 10,
    currentProjects: [
      {
        id: 'p3-1',
        projectName: 'نيوم',
        role: 'المدير الفني الاستشاري لتحالف مصنع الهيدروجين الأخضر',
        scope: 'إدارة أسرار تشغيل خلايا التحليل الكهربائي بقدرة 4 جيجاوات وتبريد غاز الهيدروجين وتحويله إلى أمونيا سائلة للتصدير.',
        status: 'نشط حالياً',
        localizationRate: 74,
        allocatedCadresCount: 7,
        partnerEntity: 'شركة نيوم للهيدروجين الأخضر • أكوا باور • إير برودكتس',
        keyAssetsCount: 8,
        tags: ['الهيدروجين الأخضر', 'التحليل الكهربائي', 'الأمونيا الخضراء']
      },
      {
        id: 'p3-2',
        projectName: 'أمالا',
        role: 'مستشار مزارع الطاقة المتجددة الهجينة ومحطات البطاريات',
        scope: 'تصميم الشبكة المصغرة (Microgrid) المستقلة التي تغذي مرافق أمالا بنسبة 100% طاقة نظيفة على مدار الساعة.',
        status: 'مرحلة الاعتماد',
        localizationRate: 86,
        allocatedCadresCount: 3,
        partnerEntity: 'شركة البحر الأحمر الدولية • كاوست',
        keyAssetsCount: 4,
        tags: ['الشبكات المصغرة', 'تخزين البطاريات', 'صفر انبعاثات']
      }
    ]
  },
  {
    id: '4',
    name: 'م. سليم الصغير',
    title: 'خبير المنشآت الخرسانية البحرية والهياكل العائمة',
    role: 'استشاري الهندسة الساحلية والمنشآت المائية',
    organization: 'رويال هاسكونينغ الهولندية • استشاري الموانئ والواجهات البحرية',
    skills: ['الخرسانة البحرية عالية المقاومة', 'حماية الشعاب المرجانية', 'المنشآت العائمة', 'النمذجة الهيدروديناميكية'],
    rating: 4.7,
    sessions: 110,
    image: 'SS',
    avatarColor: 'from-cyan-600 to-blue-500',
    experienceYears: 19,
    availability: 'متاح للتوأمة',
    bio: 'خبير رائد في بناء الأساسات الخرسانية الصديقة للبيئات البحرية الحساسة، يشرف على الفلل العائمة والجسور البحرية في جزر البحر الأحمر وتوطين هندسة الخرسانة المغمورة.',
    totalLocalizedAssets: 12,
    activeNationalTrainees: 9,
    currentProjects: [
      {
        id: 'p4-1',
        projectName: 'البحر الأحمر',
        role: 'رئيس استشاريي القواعد الخرسانية للفنادق والفلل العائمة',
        scope: 'حسابات مقاومة تآكل الكلوريدات للخرسانة المغمورة وتثبيت الفلل العائمة مع الحفاظ التام على الشعاب المرجانية الحية.',
        status: 'نشط حالياً',
        localizationRate: 91,
        allocatedCadresCount: 5,
        partnerEntity: 'شركة البحر الأحمر الدولية • جامعة الملك عبدالله (كاوست)',
        keyAssetsCount: 6,
        tags: ['الفلل العائمة', 'الخرسانة البحرية', 'الشعاب المرجانية']
      }
    ]
  },
  {
    id: '5',
    name: 'د. ليلى السالم',
    title: 'مستشارة أنظمة السكك الحديدية فائقة السرعة والتحكم الذاتي',
    role: 'كبير خبراء النقل المستقل وهندسة مسارات القطارات',
    organization: 'ألستوم وهيتاشي للسكك الحديدية سابقاً • باحثة زائرة في MIT',
    skills: ['أنظمة التحكم في القطارات CBTC', 'خوارزميات منع التصادم', 'السكك المعلقة والمغناطيسية', 'ديناميكا الحركة الهوائية'],
    rating: 4.9,
    sessions: 135,
    image: 'LS',
    avatarColor: 'from-purple-600 to-pink-500',
    experienceYears: 20,
    availability: 'متاح للتوأمة',
    bio: 'متخصصة في هندسة منظومات النقل عالي السرعة فائق الحداثة، تقود تصميم منظومة النقل المستقل تحت الأرض بمشروع ذا لاين وحلول النقل الترفيهي بالقدية.',
    totalLocalizedAssets: 15,
    activeNationalTrainees: 11,
    currentProjects: [
      {
        id: 'p5-1',
        projectName: 'ذا لاين',
        role: 'قائدة استشارات قطار النقل السريع العمودي والأفقي Spine',
        scope: 'معايرة أنظمة الاتصال اللاسلكي فائق السرعة LTE-R والتحكم الآلي للقطارات السريعة بسرعات تصل إلى 510 كم/س.',
        status: 'نشط حالياً',
        localizationRate: 86,
        allocatedCadresCount: 6,
        partnerEntity: 'نيوم لقطاع النقل • الخطوط الحديدية السعودية (سار)',
        keyAssetsCount: 5,
        tags: ['Spine Rail', 'LTE-R Communication', 'التحكم الذاتي']
      },
      {
        id: 'p5-2',
        projectName: 'القدية',
        role: 'مستشارة مسارات النقل المعلق الترفيهي وإدارة الحشود',
        scope: 'تكامل منظومات التلفريك السريع والقطارات الخفيفة الرابطة بين هضبة طويق ومناطق الألعاب العالمية.',
        status: 'تحت التأسيس',
        localizationRate: 64,
        allocatedCadresCount: 5,
        partnerEntity: 'شركة القدية للاستثمار • وزارة النقل والخدمات اللوجستية',
        keyAssetsCount: 3,
        tags: ['النقل الترفيهي', 'إدارة الحشود', 'قطارات القدية']
      }
    ]
  },
  {
    id: '6',
    name: 'م. كينجي ساتو (جون دو سابقاً)',
    title: 'كبير استشاريي سلاسل الإمداد والتصنيع النمطي المتقدم',
    role: 'خبير سلاسل الإمداد الإنشائي والتصنيع الرشيق',
    organization: 'تويوتا موتورز للتصنيع الرشيق واللوجستيات العالمية سابقاً',
    skills: ['التصنيع النمطي الجاهز (Modular)', 'سلاسل الكتل في التوريد', 'إدارة سلاسل الإمداد في الوقت المحدد JIT', 'تقليل الفاقد الإنشائي'],
    rating: 4.8,
    sessions: 210,
    image: 'KS',
    avatarColor: 'from-orange-600 to-amber-500',
    experienceYears: 23,
    availability: 'مشغول ميدانياً',
    bio: 'خبير رائد في تحويل مواقع الإنشاء الكبرى إلى ورش تجميع نمطية رقمية، يطور بروتوكولات توريد المواد فائقة الدقة لمشاريع القدية ونيوم الإنشائية.',
    totalLocalizedAssets: 21,
    activeNationalTrainees: 16,
    currentProjects: [
      {
        id: 'p6-1',
        projectName: 'القدية',
        role: 'مستشار توريد الهياكل الفولاذية والمواد الترفيهية المتقدمة',
        scope: 'برمجة خطوط الإمداد العابرة للقارات للألعاب الكبرى بمشروع Six Flags ومنتجع الألعاب المائية وضمان مطابقتها للمحتوى المحلي.',
        status: 'نشط حالياً',
        localizationRate: 79,
        allocatedCadresCount: 6,
        partnerEntity: 'شركة القدية للاستثمار • هيئة المحتوى المحلي والمشتريات الحكومية',
        keyAssetsCount: 5,
        tags: ['سلاسل الإمداد', 'المحتوى المحلي', 'التصنيع المتقدم']
      },
      {
        id: 'p6-2',
        projectName: 'نيوم',
        role: 'خبير لوجستيات المواد مسبقة الصنع والخرسانة النمطية',
        scope: 'تشغيل مراكز التصنيع النمطي اللوجستية الميدانية في تبوك ونيوم لتقليل البصمة الكربونية للنقل.',
        status: 'نشط حالياً',
        localizationRate: 83,
        allocatedCadresCount: 7,
        partnerEntity: 'نيوم للإنشاءات المتقدمة • مقاولو التحالف الوطني',
        keyAssetsCount: 6,
        tags: ['Modular Building', 'JIT Supply', 'الإنشاءات النمطية']
      }
    ]
  }
];

export const INITIAL_NOVICES: NoviceCadre[] = [
  {
    id: 'n1',
    name: 'م. فهد العتيبي',
    role: 'مهندس تصاميم مدنية وإنشائية (جونيور)',
    project: 'ذا لاين',
    department: 'إدارة الأنفاق والأعمال الترابية العميقة',
    targetSkill: 'النمذجة الهيدرولوجية وإدارة مخاطر السيول في الأنفاق الصخرية',
    goal: 'اكتساب المنهجيات الميدانية لنمذجة تدفقات السيول ومحاكاة الضغوط على بطانة أنفاق ذا لاين.',
    skills: ['أوتوكاد الإنشائي', 'ريتفا للخرسانة', 'تحليل هيدروليكي أساسي'],
    image: 'FA'
  },
  {
    id: 'n2',
    name: 'نورة السديري',
    role: 'مهندسة برمجيات وتحليل نظم المدن الذكية',
    project: 'أوكساجون',
    department: 'قطاع الموانئ واللوجستيات الرقمية',
    targetSkill: 'هندسة التوأم الرقمي وخوارزميات أتمتة الرافعات اللحظية',
    goal: 'إتقان برمجة التوأم الرقمي والتحكم الفوري في منصات الشحن الذاتي بميناء أوكساجون الذكي.',
    skills: ['بايثون', 'برمجة ROS للروبوتات', 'تحليل بيانات إنترنت الأشياء'],
    image: 'NS'
  },
  {
    id: 'n3',
    name: 'م. ريان القحطاني',
    role: 'مهندس طاقة متجددة ونظم بيئية',
    project: 'نيوم',
    department: 'تحالف الهيدروجين الأخضر والطاقة النظيفة',
    targetSkill: 'بروتوكولات الأمان وتشغيل خلايا التحليل الكهربائي للهيدروجين',
    goal: 'فهم أسرار تشغيل محطات التحليل الكهربائي الكبرى ومعايير تخزين الأمونيا الخضراء بدرجات حرارة منخفضة.',
    skills: ['ثيرموديناميكا', 'نمذجة محطات الطاقة', 'السلامة الصناعية'],
    image: 'RQ'
  },
  {
    id: 'n4',
    name: 'م. لمى الشهري',
    role: 'مهندسة هياكل بحرية وهندسة سواحل',
    project: 'البحر الأحمر',
    department: 'قسم المنشآت العائمة والفنادق البحرية',
    targetSkill: 'حسابات مقاومة تآكل الخرسانة البحرية وحماية الموائل البحرية',
    goal: 'توطين تقنيات خرسانة الكربون السلبية والتركيب الهيدروديناميكي للمنشآت الفندقية المغمورة.',
    skills: ['الهندسة الساحلية', 'ميكانيكا الموائع', 'فحص الخرسانة البحرية'],
    image: 'LS'
  },
  {
    id: 'n5',
    name: 'م. تركي الدوسري',
    role: 'مهندس أنظمة سكك حديدية وتحكم آلي',
    project: 'ذا لاين',
    department: 'إدارة النقل المستقل والقطارات السريعة',
    targetSkill: 'بروتوكولات التحكم الآلي والاتصال فائق السرعة LTE-R لقطارات النقل',
    goal: 'استيعاب خوارزميات السلامة ومنع التصادم لأنظمة النقل فائق السرعة في أنفاق Spine العميقة.',
    skills: ['نظم التحكم الآلي SCADA', 'هندسة الإشارات الحديدية', 'شبكات الاتصال'],
    image: 'TD'
  },
  {
    id: 'n6',
    name: 'م. عبدالمحسن الغامدي',
    role: 'أخصائي سلاسل إمداد ومحتوى محلي',
    project: 'القدية',
    department: 'المشتريات الاستراتيجية والهياكل الترفيهية',
    targetSkill: 'إدارة سلاسل الإمداد في الوقت المحدد JIT وزيادة المحتوى المحلي',
    goal: 'تطبيق أساليب التصنيع الرشيق في تجميع المرافق الترفيهية الكبرى ونقل المعرفة للموردين المحليين.',
    skills: ['تخطيط الموارد ERP', 'إدارة عقود فيديك', 'مؤشرات المحتوى المحلي'],
    image: 'AG'
  }
];

// Helper to compute match score between expert's linked projects/skills and novice's project/needs
export function computeMatchScore(expert: ExpertProfile, novice: NoviceCadre): {
  score: number;
  isProjectDirectMatch: boolean;
  matchingProjectName?: string;
  reasons: string[];
} {
  let score = 50;
  const reasons: string[] = [];

  // Check project alignment
  const matchedProject = expert.currentProjects.find(
    p => p.projectName.toLowerCase() === novice.project.toLowerCase()
  );

  const isProjectDirectMatch = !!matchedProject;

  if (matchedProject) {
    score += 35;
    reasons.push(`الخبير يعمل حالياً في نفس المشروع الوطني للموظف (${novice.project}) بدور "${matchedProject.role}".`);
    reasons.push(`نسبة توطين المعرفة الميدانية في هذا المشروع لدى الخبير بلغت ${matchedProject.localizationRate}%.`);
  } else {
    // Cross-project expertise match
    score += 15;
    reasons.push(`خبرة الخبير في مشاريع وطنية عملاقة (${expert.currentProjects.map(p => p.projectName).join('، ')}) قابلة للنقل المباشر لمشروع ${novice.project}.`);
  }

  // Skills overlap check
  const skillKeywords = novice.targetSkill.split(' ').filter(w => w.length > 3);
  let skillOverlap = 0;
  expert.skills.forEach(expertSkill => {
    if (skillKeywords.some(kw => expertSkill.includes(kw) || novice.targetSkill.includes(expertSkill))) {
      skillOverlap++;
    }
  });

  if (skillOverlap > 0) {
    score += Math.min(15, skillOverlap * 8);
    reasons.push(`توافق عالٍ في المهارة التخصصية المطلوبة (${novice.targetSkill}).`);
  } else {
    score += 5;
    reasons.push(`تكامل معرفي يغطي الفجوة التخصصية في ${novice.department}.`);
  }

  // Experience bonus
  if (expert.experienceYears > 18) {
    score += 5;
  }

  return {
    score: Math.min(99, score),
    isProjectDirectMatch,
    matchingProjectName: matchedProject?.projectName,
    reasons
  };
}
