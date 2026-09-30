import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Language = 'ar' | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'hi';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  dir: 'rtl' | 'ltr';
  locale: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', locale: 'ar-SA' },
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', locale: 'en-US' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', locale: 'fr-FR' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', locale: 'es-ES' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr', locale: 'de-DE' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', dir: 'ltr', locale: 'zh-CN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', locale: 'hi-IN' },
];

type TranslationMap = Record<string, Record<Language, string>>;

export const DICTIONARY: TranslationMap = {
  // App Branding & Navigation
  'app.name': {
    ar: 'مورد | MAWRED',
    en: 'MAWRED | مورد',
    fr: 'MAWRED | Plateforme',
    es: 'MAWRED | Plataforma',
    de: 'MAWRED | Plattform',
    zh: 'MAWRED | 知识汇聚',
    hi: 'मौरिद | MAWRED'
  },
  'app.tagline': {
    ar: 'منصة السيادة وتوطين المعرفة الضمنية',
    en: 'Platform for Knowledge Sovereignty & Localization',
    fr: 'Plateforme pour la souveraineté et la localisation du savoir',
    es: 'Plataforma para la soberanía y localización del conocimiento',
    de: 'Plattform für Wissenssouveränität und -lokalisierung',
    zh: '隐性知识主权与本地化平台',
    hi: 'ज्ञान संप्रभुता और स्थानीयकरण मंच'
  },
  'nav.dashboard': {
    ar: 'لوحة التحكم',
    en: 'Dashboard',
    fr: 'Tableau de bord',
    es: 'Panel principal',
    de: 'Dashboard',
    zh: '仪表板',
    hi: 'डैशबोर्ड'
  },
  'nav.extraction': {
    ar: 'استخلاص المعرفة',
    en: 'Knowledge Extraction',
    fr: 'Extraction de connaissances',
    es: 'Extracción de conocimiento',
    de: 'Wissensextraktion',
    zh: '知识提取',
    hi: 'ज्ञान निष्कर्षण'
  },
  'nav.twinning': {
    ar: 'التوأمة المعرفية',
    en: 'Knowledge Twinning',
    fr: 'Jumelage de connaissances',
    es: 'Emparejamiento de conocimiento',
    de: 'Wissens-Twinning',
    zh: '知识结对',
    hi: 'ज्ञान युग्मन'
  },
  'nav.handover': {
    ar: 'خطط تسليم الخبراء',
    en: 'Expert Handover Plans',
    fr: 'Plans de passation d’experts',
    es: 'Planes de traspaso de expertos',
    de: 'Experten-Übergabepläne',
    zh: '专家交接计划',
    hi: 'विशेषज्ञ हैंडओवर योजनाएं'
  },
  'nav.lessons': {
    ar: 'الدروس المستفادة',
    en: 'Lessons Learned',
    fr: 'Leçons apprises',
    es: 'Lecciones aprendidas',
    de: 'Erkenntnisse & Lessons Learned',
    zh: '经验教训',
    hi: 'सीखे गए सबक'
  },
  'nav.analytics': {
    ar: 'التحليلات والمؤشرات',
    en: 'Analytics & KPIs',
    fr: 'Analyses & Indicateurs',
    es: 'Analíticas e Indicadores',
    de: 'Analysen & Kennzahlen',
    zh: '分析与指标',
    hi: 'विश्लेषण और संकेतक'
  },
  'nav.partners': {
    ar: 'المنشآت الوطنية',
    en: 'National Entities',
    fr: 'Entités nationales',
    es: 'Entidades nacionales',
    de: 'Nationale Einrichtungen',
    zh: '国家实体',
    hi: 'राष्ट्रीय संस्थाएं'
  },
  'nav.security': {
    ar: 'أمن البيانات والسيادة',
    en: 'Data Security & Sovereignty',
    fr: 'Sécurité & Souveraineté des données',
    es: 'Seguridad y Soberanía de datos',
    de: 'Datensicherheit & Souveränität',
    zh: '数据安全与主权',
    hi: 'डेटा सुरक्षा और संप्रभुता'
  },
  'nav.fieldMode': {
    ar: 'الوضع الميداني للموبايل',
    en: 'Mobile Field Mode',
    fr: 'Mode terrain mobile',
    es: 'Modo de campo móvil',
    de: 'Mobiler Feldmodus',
    zh: '移动实地模式',
    hi: 'मोबाइल फील्ड मोड'
  },
  'nav.logout': {
    ar: 'تسجيل الخروج',
    en: 'Log Out',
    fr: 'Déconnexion',
    es: 'Cerrar sesión',
    de: 'Abmelden',
    zh: '退出登录',
    hi: 'लॉग आउट'
  },

  // Projects
  'project.current': {
    ar: 'المشروع الحالي',
    en: 'Current Project',
    fr: 'Projet actuel',
    es: 'Proyecto actual',
    de: 'Aktuelles Projekt',
    zh: '当前项目',
    hi: 'वर्तमान परियोजना'
  },
  'project.all': {
    ar: 'جميع المشاريع',
    en: 'All Projects',
    fr: 'Tous les projets',
    es: 'Todos los proyectos',
    de: 'Alle Projekte',
    zh: '所有项目',
    hi: 'सभी परियोजनाएं'
  },
  'project.neom': { ar: 'نيوم', en: 'NEOM', fr: 'NEOM', es: 'NEOM', de: 'NEOM', zh: 'NEOM', hi: 'NEOM' },
  'project.redSea': { ar: 'البحر الأحمر', en: 'Red Sea', fr: 'Mer Rouge', es: 'Mar Rojo', de: 'Rotes Meer', zh: '红海项目', hi: 'रेड सी' },
  'project.aramco': { ar: 'أرامكو', en: 'Aramco', fr: 'Aramco', es: 'Aramco', de: 'Aramco', zh: '阿美石油', hi: 'अराम्को' },
  'project.theLine': { ar: 'ذا لاين', en: 'The Line', fr: 'The Line', es: 'The Line', de: 'The Line', zh: 'The Line', hi: 'द लाइन' },
  'project.oxagon': { ar: 'أوكساجون', en: 'Oxagon', fr: 'Oxagon', es: 'Oxagon', de: 'Oxagon', zh: '奥克萨贡', hi: 'ऑक्सागोन' },
  'project.qiddiya': { ar: 'القدية', en: 'Qiddiya', fr: 'Qiddiya', es: 'Qiddiya', de: 'Qiddiya', zh: '奇迪亚', hi: 'किद्दिया' },
  'project.trojena': { ar: 'تروجينا', en: 'Trojena', fr: 'Trojena', es: 'Trojena', de: 'Trojena', zh: '特罗杰纳', hi: 'त्रोजेना' },
  'project.amaala': { ar: 'أمالا', en: 'Amaala', fr: 'Amaala', es: 'Amaala', de: 'Amaala', zh: '阿玛拉', hi: 'अमाला' },

  // Header & Status
  'header.secure': {
    ar: 'نظام سيادي آمن',
    en: 'Secure Sovereign System',
    fr: 'Système souverain sécurisé',
    es: 'Sistema soberano seguro',
    de: 'Sicheres souveränes System',
    zh: '主权安全系统',
    hi: 'सुरक्षित संप्रभु प्रणाली'
  },
  'header.search': {
    ar: 'البحث الموثق في قاعدة المعرفة...',
    en: 'Verified search in knowledge base...',
    fr: 'Recherche vérifiée dans la base de connaissances...',
    es: 'Búsqueda verificada en la base de conocimiento...',
    de: 'Geprüfte Suche in der Wissensbasis...',
    zh: '在知识库中进行验证搜索...',
    hi: 'ज्ञानकोष में सत्यापित खोज...'
  },
  'header.admin': {
    ar: 'المسؤول العام',
    en: 'Super Admin',
    fr: 'Super Administrateur',
    es: 'Super Administrador',
    de: 'Hauptadministrator',
    zh: '超级管理员',
    hi: 'सुपर एडमिन'
  },
  'header.notifications': {
    ar: 'التنبيهات والمهام العاجلة',
    en: 'Alerts & Urgent Tasks',
    fr: 'Alertes & Tâches urgentes',
    es: 'Alertas y Tareas urgentes',
    de: 'Benachrichtigungen & Dringende Aufgaben',
    zh: '警报与紧急任务',
    hi: 'अलर्ट और जरूरी कार्य'
  },
  'header.theme': {
    ar: 'المظهر',
    en: 'Theme',
    fr: 'Thème',
    es: 'Tema',
    de: 'Design',
    zh: '外观主题',
    hi: 'थीम'
  },
  'header.quickActions': {
    ar: 'إجراءات سريعة',
    en: 'Quick Actions',
    fr: 'Actions rapides',
    es: 'Acciones rápidas',
    de: 'Schnellaktionen',
    zh: '快捷操作',
    hi: 'त्वरित कार्रवाई'
  },

  // Themes
  'theme.light': { ar: 'فاتح', en: 'Light', fr: 'Clair', es: 'Claro', de: 'Hell', zh: '浅色', hi: 'हल्का' },
  'theme.dark': { ar: 'داكن', en: 'Dark', fr: 'Sombre', es: 'Oscuro', de: 'Dunkel', zh: '深色', hi: 'गहरा' },
  'theme.system': { ar: 'حسب النظام', en: 'System', fr: 'Système', es: 'Sistema', de: 'System', zh: '跟随系统', hi: 'सिस्टम' },

  // Dashboard Core Elements
  'dash.title': {
    ar: 'لوحة قيادة توطين المعرفة',
    en: 'Knowledge Localization Dashboard',
    fr: 'Tableau de bord de localisation du savoir',
    es: 'Panel de localización del conocimiento',
    de: 'Dashboard für Wissenslokalisierung',
    zh: '知识本地化仪表板',
    hi: 'ज्ञान स्थानीयकरण डैशबोर्ड'
  },
  'dash.subtitle': {
    ar: 'المؤشرات الأساسية والمهام اليومية لنقل الخبرات والسيادة المعرفية',
    en: 'Core KPIs and daily tasks for expertise transfer and knowledge sovereignty',
    fr: 'Indicateurs clés et tâches quotidiennes de transfert d’expertise',
    es: 'KPIs clave y tareas diarias para la transferencia de experiencia',
    de: 'Kern-KPIs und tägliche Aufgaben für den Wissenstransfer',
    zh: '经验转移和知识主权的核心指标与日常任务',
    hi: 'विशेषज्ञता हस्तांतरण और ज्ञान संप्रभुता के लिए मुख्य संकेतक और दैनिक कार्य'
  },
  'dash.welcome': {
    ar: 'مرحباً بك في منصة مورد',
    en: 'Welcome to Mawred Platform',
    fr: 'Bienvenue sur la plateforme Mawred',
    es: 'Bienvenido a la plataforma Mawred',
    de: 'Willkommen auf der Mawred-Plattform',
    zh: '欢迎使用 Mawred 平台',
    hi: 'मौरिद मंच में आपका स्वागत है'
  },
  'dash.overview': {
    ar: 'نظرة عامة على حالة توطين المعرفة في مشروع',
    en: 'Overview of knowledge localization in',
    fr: 'Aperçu de la localisation des connaissances pour',
    es: 'Resumen de la localización del conocimiento en',
    de: 'Überblick über die Wissenslokalisierung im Projekt',
    zh: '项目知识本地化概览：',
    hi: 'में ज्ञान स्थानीयकरण की स्थिति का अवलोकन'
  },
  'dash.reportBtn': {
    ar: 'توليد التقرير الدوري الآلي',
    en: 'Generate Automated Report',
    fr: 'Générer le rapport automatisé',
    es: 'Generar reporte automatizado',
    de: 'Automatisierten Bericht erstellen',
    zh: '生成自动化定期报告',
    hi: 'स्वचालित रिपोर्ट जनरेट करें'
  },
  'dash.reportCurrent': {
    ar: 'عرض التقرير الحالي',
    en: 'View Current Report',
    fr: 'Voir le rapport actuel',
    es: 'Ver reporte actual',
    de: 'Aktuellen Bericht anzeigen',
    zh: '查看当前报告',
    hi: 'वर्तमान रिपोर्ट देखें'
  },
  'dash.generating': {
    ar: 'جاري إعداد التقرير بالذكاء الاصطناعي...',
    en: 'Generating AI report...',
    fr: 'Génération du rapport IA...',
    es: 'Generando informe con IA...',
    de: 'KI-Bericht wird erstellt...',
    zh: '正在通过人工智能生成报告...',
    hi: 'AI रिपोर्ट तैयार की जा रही है...'
  },

  // 4 Primary KPIs
  'dash.kpi.totalAssets': {
    ar: 'إجمالي المعارف الموثقة',
    en: 'Documented Knowledge Assets',
    fr: 'Actifs de connaissances documentés',
    es: 'Activos de conocimiento documentados',
    de: 'Dokumentierte Wissenswerte',
    zh: '已归档知识资产总量',
    hi: 'कुल प्रलेखित ज्ञान संपत्तियां'
  },
  'dash.kpi.activeExperts': {
    ar: 'الخبراء النشطون',
    en: 'Active Experts',
    fr: 'Experts actifs',
    es: 'Expertos activos',
    de: 'Aktive Experten',
    zh: '活跃专家数',
    hi: 'सक्रिय विशेषज्ञ'
  },
  'dash.kpi.twinningSessions': {
    ar: 'جلسات التوأمة المنجزة',
    en: 'Completed Twinning Sessions',
    fr: 'Sessions de jumelage réalisées',
    es: 'Sesiones de emparejamiento completadas',
    de: 'Abgeschlossene Twinning-Sitzungen',
    zh: '已完成结对研讨',
    hi: 'पूर्ण किए गए युग्मन सत्र'
  },
  'dash.kpi.localizationRate': {
    ar: 'نسبة التوطين المعرفي',
    en: 'Knowledge Localization Rate',
    fr: 'Taux de localisation du savoir',
    es: 'Tasa de localización de conocimiento',
    de: 'Wissenslokalisierungsrate',
    zh: '知识本地化达标率',
    hi: 'ज्ञान स्थानीयकरण दर'
  },
  'dash.kpi.targetRemaining': {
    ar: 'المتبقي للمستهدف',
    en: 'remaining to target',
    fr: 'restant pour atteindre la cible',
    es: 'restante para la meta',
    de: 'bis zum Ziel verbleibend',
    zh: '距目标尚缺',
    hi: 'लक्ष्य तक शेष'
  },
  'dash.kpi.growthRate': {
    ar: 'معدل النمو الشهري',
    en: 'Monthly Growth Rate',
    fr: 'Taux de croissance mensuel',
    es: 'Tasa de crecimiento mensual',
    de: 'Monatliche Wachstumsrate',
    zh: '月度增长率',
    hi: 'मासिक वृद्धि दर'
  },

  // Attention Section ("شنو محتاج انتباهك اليوم؟")
  'dash.attention.title': {
    ar: 'ما يتطلب انتباهك اليوم',
    en: 'What Needs Your Attention Today',
    fr: 'Ce qui requiert votre attention aujourd’hui',
    es: 'Lo que requiere tu atención hoy',
    de: 'Was heute Ihre Aufmerksamkeit erfordert',
    zh: '今日待办与紧急事项',
    hi: 'आज आपका क्या ध्यान आकर्षित करता है'
  },
  'dash.attention.subtitle': {
    ar: 'المهام العاجلة، الفجوات الحرجة، وخطط تسليم المعرفة المقتربة',
    en: 'Urgent tasks, critical knowledge gaps, and approaching expert handovers',
    fr: 'Tâches urgentes, lacunes critiques et passations imminentes',
    es: 'Tareas urgentes, brechas críticas y traspasos inminentes',
    de: 'Dringende Aufgaben, kritische Wissenslücken und bevorstehende Übergaben',
    zh: '紧急任务、高危知识缺口以及即将到期的专家交接',
    hi: 'अत्यावश्यक कार्य, गंभीर ज्ञान अंतराल और निकटवर्ती विशेषज्ञ हैंडओवर'
  },
  'dash.attention.tasks': {
    ar: 'المهام المعرفية العاجلة',
    en: 'Urgent Knowledge Tasks',
    fr: 'Tâches cognitives urgentes',
    es: 'Tareas urgentes de conocimiento',
    de: 'Dringende Wissensaufgaben',
    zh: '紧急知识任务',
    hi: 'अत्यावश्यक ज्ञान कार्य'
  },
  'dash.attention.gaps': {
    ar: 'الفجوات المعرفية الحرجة',
    en: 'Critical Knowledge Gaps',
    fr: 'Lacunes de savoir critiques',
    es: 'Brechas críticas de conocimiento',
    de: 'Kritische Wissenslücken',
    zh: '关键知识缺口警报',
    hi: 'गंभीर ज्ञान अंतराल'
  },
  'dash.attention.handovers': {
    ar: 'خطط تسليم الخبراء المقتربة',
    en: 'Approaching Expert Handovers',
    fr: 'Passations d’experts imminentes',
    es: 'Traspasos de expertos próximos',
    de: 'Bevorstehende Expertenübergaben',
    zh: '临近离开的专家交接计划',
    hi: 'निकटवर्ती विशेषज्ञ हैंडओवर'
  },
  'dash.attention.reviews': {
    ar: 'أصول تتطلب مراجعة الصلاحية',
    en: 'Assets Requiring Review',
    fr: 'Actifs nécessitant une révision',
    es: 'Activos que requieren revisión',
    de: 'Überprüfungsbedürftige Wissenswerte',
    zh: '待核查与更新有效期的知识资产',
    hi: 'समीक्षा आवश्यक ज्ञान संपत्तियां'
  },

  // Collapsible Sections
  'dash.section.handover': {
    ar: 'خطط تسليم المعرفة قبل مغادرة الخبير',
    en: 'Expert Knowledge Handover Plans Before Departure',
    fr: 'Plans de passation des connaissances avant départ de l’expert',
    es: 'Planes de traspaso de conocimiento antes de la salida del experto',
    de: 'Experten-Wissensübergabepläne vor dem Ausscheiden',
    zh: '专家离职前知识移交与接班计划',
    hi: 'विशेषज्ञ के जाने से पहले ज्ञान हैंडओवर योजना'
  },
  'dash.section.handoverDesc': {
    ar: 'تحديد المعارف الواجب توثيقها، الموظف المستلم، الجلسات المتبقية ونسبة الإنجاز الفعلية',
    en: 'Defining target knowledge to document, assigned successor, remaining sessions, and measured progress',
    fr: 'Définition des connaissances cibles, successeur désigné, sessions restantes et progression',
    es: 'Definir el conocimiento a documentar, sucesor asignado, sesiones restantes y progreso',
    de: 'Zielwissen, Nachfolger, verbleibende Sitzungen und gemessenen Fortschritt festhalten',
    zh: '明确移交知识清单、对接接班人员、剩余辅导研讨及量化完成进度',
    hi: 'दस्तावेजीकरण के लिए लक्ष्य ज्ञान, प्राप्तकर्ता कर्मचारी, शेष सत्र और प्रगति प्रतिशत'
  },
  'dash.section.map': {
    ar: 'خريطة التوزيع الجغرافي للخبرات الدولية',
    en: 'Global Expertise & Saudi Giga-Projects Map',
    fr: 'Carte de l’expertise mondiale et des méga-projets saoudiens',
    es: 'Mapa de experiencia global y mega-proyectos saudíes',
    de: 'Globale Expertise & Saudi-Großprojekte-Karte',
    zh: '国际专家分布与沙特超级工程联动地图',
    hi: 'वैश्विक विशेषज्ञता और सऊदी मेगा-परियोजनाएं मानचित्र'
  },
  'dash.section.mapDesc': {
    ar: 'ربط مباشر وتفاعلي بين مراكز الخبرة العالمية والمشاريع الوطنية الكبرى',
    en: 'Direct interactive links between global expertise hubs and Saudi giga-projects',
    fr: 'Liaison directe et interactive entre centres mondiaux et projets nationaux',
    es: 'Enlaces interactivos directos entre centros mundiales y proyectos nacionales',
    de: 'Direkte Verknüpfung zwischen globalen Expertenzentren und Großprojekten',
    zh: '全球领先技术策源地与沙特国家级工程之间的实时知识走廊',
    hi: 'वैश्विक विशेषज्ञता केंद्रों और राष्ट्रीय परियोजनाओं के बीच सीधा लिंक'
  },
  'dash.section.analytics': {
    ar: 'التحليلات المتقدمة وتوقعات النمو المعرفي',
    en: 'Advanced Analytics & Knowledge Growth Forecasts',
    fr: 'Analyses avancées et prévisions de croissance des connaissances',
    es: 'Analíticas avanzadas y pronósticos de crecimiento del conocimiento',
    de: 'Erweiterte Analysen & Prognosen zum Wissenswachstum',
    zh: '深度分析与知识增长前瞻预测',
    hi: 'उन्नत विश्लेषण और ज्ञान वृद्धि पूर्वानुमान'
  },
  'dash.section.analyticsDesc': {
    ar: 'منحنيات النمو، قياس الفجوات، والمقارنة القياسية بين المشاريع الكبرى',
    en: 'Growth curves, gap measurements, and benchmark comparisons across giga-projects',
    fr: 'Courbes de croissance, mesures des lacunes et comparaisons de référence',
    es: 'Curvas de crecimiento, medición de brechas y comparación de proyectos',
    de: 'Wachstumskurven, Lückenmessung und Benchmark-Vergleiche',
    zh: '增长轨迹曲线、知识缺口收敛与各大重点项目对标',
    hi: 'विकास वक्र, अंतराल माप, और परियोजनाओं के बीच तुलना'
  },
  'dash.section.vision': {
    ar: 'رؤية المنصة وركائز التوطين والسيادة',
    en: 'Platform Vision & Pillars of Knowledge Sovereignty',
    fr: 'Vision de la plateforme et piliers de souveraineté',
    es: 'Visión de la plataforma y pilares de soberanía',
    de: 'Plattformvision & Säulen der Wissenssouveränität',
    zh: '平台愿景与知识主权支柱',
    hi: 'मंच का दृष्टिकोण और ज्ञान संप्रभुता के स्तंभ'
  },
  'dash.section.visionDesc': {
    ar: 'الأهداف الاستراتيجية، إطار العمل الوطني، ومواءمة رؤية السعودية ٢٠٣٠',
    en: 'Strategic objectives, national framework, and alignment with Saudi Vision 2030',
    fr: 'Objectifs stratégiques, cadre national et alignement sur Vision 2030',
    es: 'Objetivos estratégicos, marco nacional y alineación con Visión 2030',
    de: 'Strategische Ziele, nationaler Rahmen und Ausrichtung auf Vision 2030',
    zh: '战略目标、国家知识转移框架与沙特 2030 愿景契合度',
    hi: 'रणनीतिक उद्देश्य, राष्ट्रीय ढांचा, और विज़न 2030 के साथ संरेखण'
  },

  // Handover Plan Keys
  'handover.expert': { ar: 'الخبير المغادر', en: 'Departing Expert', fr: 'Expert sortant', es: 'Experto saliente', de: 'Ausscheidender Experte', zh: '即将离任专家', hi: 'जाने वाले विशेषज्ञ' },
  'handover.successor': { ar: 'الموظف المستلم (الرديف)', en: 'Successor (Receiving Staff)', fr: 'Successeur (Personnel récepteur)', es: 'Sucesor (Personal receptor)', de: 'Nachfolger (Empfangender Mitarbeiter)', zh: '对口接收人员（副手）', hi: 'प्राप्तकर्ता कर्मचारी' },
  'handover.daysLeft': { ar: 'الأيام المتبقية للمغادرة', en: 'Days Left to Departure', fr: 'Jours restants avant départ', es: 'Días restantes para salida', de: 'Verbleibende Tage bis Abreise', zh: '距离期剩余天数', hi: 'प्रस्थान के शेष दिन' },
  'handover.sessionsLeft': { ar: 'الجلسات المتبقية', en: 'Remaining Sessions', fr: 'Sessions restantes', es: 'Sesiones restantes', de: 'Verbleibende Sitzungen', zh: '剩余辅导研讨', hi: 'शेष सत्र' },
  'handover.progress': { ar: 'نسبة إنجاز التسليم', en: 'Handover Progress', fr: 'Progression de passation', es: 'Progreso del traspaso', de: 'Übergabefortschritt', zh: '交接完成率', hi: 'हैंडओवर प्रगति' },
  'handover.targetKnowledge': { ar: 'المعارف المطلوب توثيقها واعتمادها', en: 'Knowledge to Document & Approve', fr: 'Connaissances à documenter et valider', es: 'Conocimiento a documentar y aprobar', de: 'Zu dokumentierendes & freizugebendes Wissen', zh: '必须完成归档与验收的核心知识点', hi: 'दस्तावेजीकरण और अनुमोदन के लिए ज्ञान' },
  'handover.status': { ar: 'حالة التسليم', en: 'Handover Status', fr: 'Statut de passation', es: 'Estado del traspaso', de: 'Übergabestatus', zh: '移交状态', hi: 'हैंडओवर स्थिति' },
  'handover.addBtn': { ar: 'إنشاء خطة تسليم جديدة', en: 'Create New Handover Plan', fr: 'Nouveau plan de passation', es: 'Crear nuevo plan de traspaso', de: 'Neuen Übergabeplan erstellen', zh: '创建新的移交接班计划', hi: 'नई हैंडओवर योजना बनाएं' },
  'handover.clearanceBtn': { ar: 'إصدار شهادة مخالصة معرفية', en: 'Issue Knowledge Clearance Certificate', fr: 'Délivrer certificat de décharge cognitive', es: 'Emitir certificado de solvencia de conocimiento', de: 'Wissensentlastungszertifikat ausstellen', zh: '签发知识移交清讫证书', hi: 'ज्ञान क्लीयरेंस प्रमाणपत्र जारी करें' },
  'handover.markDone': { ar: 'تأكيد اكتمال البند', en: 'Mark Item Completed', fr: 'Marquer l’élément terminé', es: 'Marcar elemento completado', de: 'Punkt als erledigt markieren', zh: '确认该项已完成移交', hi: 'पूर्ण चिह्नित करें' },

  // Lessons Learned Form & Card
  'lesson.title': { ar: 'بطاقة «درس مستفاد»', en: '“Lessons Learned” Card', fr: 'Fiche « Leçons apprises »', es: 'Ficha de «Lecciones aprendidas»', de: '„Lessons Learned“-Karte', zh: '“经验教训”记录卡', hi: '“सीखे गए सबक” कार्ड' },
  'lesson.subtitle': {
    ar: 'نموذج موحد لتوثيق المشكلة، سببها الجذري، الحل المجرّب، ومتى يمكن تكرار الاستخدام',
    en: 'Standard card recording problem, root cause, tested solution, and reapplication context',
    fr: 'Modèle consignant problème, cause profonde, solution testée et conditions de réemploi',
    es: 'Formulario para registrar problema, causa raíz, solución probada y cuándo reutilizar',
    de: 'Standardformular für Problem, Ursache, erprobte Lösung und Wiedereinsatz-Bedingungen',
    zh: '用于记录现场问题、根本诱因、实测解决方案及复用适用边界的标准模板',
    hi: 'समस्या, मूल कारण, परीक्षित समाधान और पुन: उपयोग की शर्तों को रिकॉर्ड करने वाला कार्ड'
  },
  'lesson.problem': { ar: 'المشكلة أو التحدي الميداني', en: 'Problem or Field Challenge', fr: 'Problème ou défi de terrain', es: 'Problema o desafío de campo', de: 'Problem oder Feldherausforderung', zh: '现场问题或技术挑战', hi: 'समस्या या क्षेत्रीय चुनौती' },
  'lesson.problemPlaceholder': {
    ar: 'صف التحدي الفعلي الذي واجه المشروع وكاد يتسبب في تعطل أو زيادة التكلفة...',
    en: 'Describe the actual challenge that arose on site and risked delays or cost overruns...',
    fr: 'Décrivez le défi concret qui risquait de provoquer des retards ou des surcoûts...',
    es: 'Describa el desafío real en el sitio que amenazaba retrasos o sobrecostes...',
    de: 'Beschreiben Sie die aufgetretene Herausforderung, die Verzögerungen oder Mehrkosten verursachte...',
    zh: '请描述项目现场实际发生的、可能导致工期延误或成本增加的突出技术瓶颈...',
    hi: 'परियोजना में सामने आई वास्तविक समस्या का वर्णन करें...'
  },
  'lesson.rootCause': { ar: 'السبب الجذري الكامن', en: 'Root Cause', fr: 'Cause fondamentale', es: 'Causa raíz', de: 'Grundursache', zh: '深层诱因与根因分析', hi: 'मूल कारण' },
  'lesson.rootCausePlaceholder': {
    ar: 'ما السبب الفعلي وراء المشكلة؟ (مثال: تذبذب نسبة رطوبة الخلطات الخرسانية في الطقس الحار)',
    en: 'What was the true underlying cause? (e.g., concrete mix humidity shifts in hot weather)',
    fr: 'Quelle était la véritable cause profonde ? (ex. variation d’humidité par forte chaleur)',
    es: '¿Cuál fue la causa real? (ej. fluctuaciones de humedad en el hormigón con calor)',
    de: 'Was war die eigentliche Ursache? (z.B. Feuchtigkeitsschwankungen bei Hitze)',
    zh: '诱发该问题的核心本质机理是什么？（例如：高温环境下混凝土混合料水分蒸发过快）',
    hi: 'समस्या के पीछे वास्तविक कारण क्या था?'
  },
  'lesson.solution': { ar: 'الحل المجرّب والنتائج المحققة', en: 'Tested Solution & Outcome', fr: 'Solution testée et résultats', es: 'Solución probada y resultados', de: 'Erprobte Lösung & Ergebnisse', zh: '经实测验证的解决方案及成效', hi: 'परीक्षित समाधान और परिणाम' },
  'lesson.solutionPlaceholder': {
    ar: 'كيف تم التغلب على المشكلة عملياً؟ وما الإجراء الذي أثبت فاعليته؟',
    en: 'How was the issue practically solved? What proven procedure worked?',
    fr: 'Comment le problème a-t-il été résolu ? Quelle méthode s’est montrée efficace ?',
    es: '¿Cómo se resolvió en la práctica? ¿Qué procedimiento probado funcionó?',
    de: 'Wie wurde das Problem praktisch gelöst? Welche Maßnahme hat sich bewährt?',
    zh: '具体采取了何种实操应对措施？哪种操作工法最终经受住了检验？',
    hi: 'व्यावहारिक रूप से समस्या को कैसे हल किया गया?'
  },
  'lesson.whenToReapply': { ar: 'متى وأين ينفع نستخدم هذا الحل ثانية؟', en: 'When & Where Can This Be Reapplied?', fr: 'Quand et où réappliquer cette solution ?', es: '¿Cuándo y dónde se puede reutilizar esta solución?', de: 'Wann und wo kann diese Lösung wiederverwendet werden?', zh: '适用边界：何时以及在哪些项目中可以复用该方案？', hi: 'इस समाधान का दोबारा उपयोग कब और कहाँ किया जा सकता है?' },
  'lesson.whenToReapplyPlaceholder': {
    ar: 'حدد الشروط الميدانية أو نوعية المشاريع التي تنطبق عليها هذه التجربة...',
    en: 'Specify site conditions or project categories where this experience applies...',
    fr: 'Précisez les conditions de terrain ou projets où cette expérience est pertinente...',
    es: 'Especifique las condiciones de obra o proyectos donde esto aplica...',
    de: 'Bestimmen Sie Standortbedingungen oder Projekttypen, auf die dies zutrifft...',
    zh: '请注明适用的施工气候、地质条件或类似工程类型...',
    hi: 'उन परिस्थितियों को स्पष्ट करें जहाँ यह समाधान लागू होता है...'
  },
  'lesson.saveBtn': { ar: 'اعتماد ونشر الدرس المستفاد', en: 'Approve & Publish Lesson', fr: 'Valider & publier la leçon', es: 'Aprobar y publicar lección', de: 'Lesson Learned freigeben & veröffentlichen', zh: '审核发布该经验教训', hi: 'सबक अनुमोदित और प्रकाशित करें' },
  'lesson.shareBetweenProjects': { ar: 'تعميم الدرس على المشاريع المتقاطعة', en: 'Disseminate Across Related Projects', fr: 'Diffuser sur les projets connexes', es: 'Difundir en proyectos relacionados', de: 'Auf verwandte Projekte übertragen', zh: '向具备相似工况的关联项目协同推广', hi: 'संबंधित परियोजनाओं में प्रसारित करें' },

  // Knowledge Validity & Review Notice
  'validity.title': { ar: 'صلاحية ومراجعة الأصول المعرفية', en: 'Knowledge Validity & Periodic Review', fr: 'Validité et révision périodique des connaissances', es: 'Validez y revisión periódica del conocimiento', de: 'Gültigkeit & periodische Überprüfung des Wissens', zh: '知识有效性与定期复核预警', hi: 'ज्ञान वैधता और आवधिक समीक्षा' },
  'validity.alertNeedsReview': { ar: 'يحتاج تحديثاً لمواكبة تعديل الإجراءات أو المعدات', en: 'Requires update due to updated procedures or equipment', fr: 'Mise à jour requise suite au changement de procédures ou d’équipements', es: 'Requiere actualización por cambio en procedimientos o equipos', de: 'Aktualisierung wegen geänderter Verfahren oder Geräte erforderlich', zh: '因施工规程或新型装备升级，该资产急需复审与更新', hi: 'प्रक्रियाओं या उपकरणों में बदलाव के कारण समीक्षा की आवश्यकता है' },
  'validity.reviewDate': { ar: 'موعد المراجعة القادمة:', en: 'Next Review Date:', fr: 'Date de prochaine révision :', es: 'Próxima fecha de revisión:', de: 'Nächstes Überprüfungsdatum:', zh: '下次复核期限：', hi: 'अगली समीक्षा तिथि:' },

  // Mobile Field Mode
  'field.title': { ar: 'الوضع الميداني للموبايل (بدون إنترنت)', en: 'Mobile Field Mode (Offline Ready)', fr: 'Mode terrain mobile (compatible hors-ligne)', es: 'Modo de campo móvil (offline)', de: 'Mobiler Feldmodus (offline-fähig)', zh: '移动实地快速采集模式（支持离线）', hi: 'मोबाइल फील्ड मोड (ऑफ़लाइन सक्षम)' },
  'field.subtitle': {
    ar: 'تسجيل سريع لملاحظة فنية، صورة، وصوت بخطوات بسيطة وحفظ مسودة للمزامنة لاحقاً',
    en: 'Quick field capture for notes, voice, and photos with offline draft storage',
    fr: 'Capture rapide sur site avec notes, voix et photos, sauvegarde hors-ligne',
    es: 'Captura rápida en campo de notas, voz y fotos con borrador offline',
    de: 'Schnelle Erfassung von Notizen, Sprache und Fotos mit Offline-Speicherung',
    zh: '以极简步骤快速记录现场工艺、语音备忘录及关键照片，断网状态自动暂存',
    hi: 'ऑफ़लाइन ड्राफ्ट स्टोरेज के साथ नोट्स, वॉयस और तस्वीरों के लिए त्वरित फील्ड कैप्चर'
  },
  'field.notePlaceholder': {
    ar: 'اكتب الملاحظة الميدانية السريعة هنا...',
    en: 'Enter quick field observation here...',
    fr: 'Saisissez la remarque de terrain ici...',
    es: 'Escriba la observación de campo aquí...',
    de: 'Schnelle Feldbeobachtung hier eingeben...',
    zh: '在此输入快速现场工程发现或工艺提示...',
    hi: 'त्वरित फील्ड अवलोकन यहाँ दर्ज करें...'
  },
  'field.saveOfflineBtn': { ar: 'حفظ مسودة في الجهاز', en: 'Save Draft Locally', fr: 'Enregistrer le brouillon localement', es: 'Guardar borrador local', de: 'Entwurf lokal speichern', zh: '在设备本地暂存草稿', hi: 'डिवाइस में ड्राफ्ट सहेजें' },
  'field.syncNowBtn': { ar: 'مزامنة المسودات مع الخادم', en: 'Sync Drafts to Cloud', fr: 'Synchroniser avec le cloud', es: 'Sincronizar borradores', de: 'Entwürfe synchronisieren', zh: '立即将暂存草稿同步到云端', hi: 'ड्राफ्ट को क्लाउड से सिंक करें' },
  'field.draftsCount': { ar: 'مسودات محفوظة محلياً:', en: 'Locally saved drafts:', fr: 'Brouillons locaux :', es: 'Borradores guardados:', de: 'Lokal gespeicherte Entwürfe:', zh: '本地待同步草稿：', hi: 'स्थानीय रूप से सहेजे गए ड्राफ्ट:' },

  // Duplicate Content Detection
  'duplicate.title': { ar: 'كشف تكرار المحتوى الذكي', en: 'Smart Content Duplicate Detection', fr: 'Détection intelligente des doublons', es: 'Detección inteligente de duplicados', de: 'Intelligente Duplikaterkennung', zh: '智能内容查重与相似度检测', hi: 'स्मार्ट डुप्लिकेट पहचान' },
  'duplicate.found': {
    ar: 'تم رصد أصول معرفية مشابهة موثقة مسبقاً! يُقترح الإضافة عليها أو ربطها:',
    en: 'Similar documented knowledge assets found! We recommend linking or enhancing:',
    fr: 'Actifs similaires détectés ! Il est recommandé d’enrichir ou de lier l’existant :',
    es: '¡Se encontraron activos similares! Sugerimos vincular o enriquecer el existente:',
    de: 'Ähnliche dokumentierte Wissenswerte gefunden! Es wird empfohlen, sie zu verknüpfen oder zu ergänzen:',
    zh: '系统检测到高度相似的既有知识资产！建议进行关联或在现有基础上升华补充：',
    hi: 'समान प्रलेखित ज्ञान संपत्तियां मिलीं! लिंक करने या बढ़ाने की सिफारिश की जाती है:'
  },
  'duplicate.linkBtn': { ar: 'ربط بالأصل المشابه', en: 'Link with Existing Asset', fr: 'Lier à l’actif existant', es: 'Vincular al activo', de: 'Mit bestehendem Wissen verknüpfen', zh: '与既有资产关联并合并', hi: 'मौजूदा संपत्ति से लिंक करें' },

  // Common UI Elements & Demo Data
  'common.demoDataBadge': { ar: 'بيانات تجريبية', en: 'Demo Data', fr: 'Données de démonstration', es: 'Datos de prueba', de: 'Demodaten', zh: '演示数据', hi: 'डेमो डेटा' },
  'common.demoDataNotice': {
    ar: 'المؤشرات وأسماء الخبراء معروضة لأغراض المحاكاة والعرض التوضيحي، والمصدر معتمد بموجب بروتوكول التوطين.',
    en: 'Indicators and expert names are displayed for simulation purposes; source verified per localization protocol.',
    fr: 'Indicateurs et noms présentés à des fins de démonstration ; source certifiée selon protocole.',
    es: 'Indicadores y nombres mostrados para demostración; fuente verificada bajo protocolo.',
    de: 'Kennzahlen und Namen dienen Demonstrationszwecken; Quelle nach Protokoll zertifiziert.',
    zh: '所示指标与专家姓名均用于模拟演示，相关来源经本地化技术规程认证。',
    hi: 'संकेतक और नाम प्रदर्शन उद्देश्यों के लिए प्रदर्शित किए जाते हैं।'
  },
  'common.close': { ar: 'إغلاق', en: 'Close', fr: 'Fermer', es: 'Cerrar', de: 'Schließen', zh: '关闭', hi: 'बंद करें' },
  'common.expand': { ar: 'توسيع القسم', en: 'Expand', fr: 'Développer', es: 'Expandir', de: 'Erweitern', zh: '展开', hi: 'विस्तार करें' },
  'common.collapse': { ar: 'طي القسم', en: 'Collapse', fr: 'Réduire', es: 'Contraer', de: 'Einklappen', zh: '折叠', hi: 'संक्षिप्त करें' },
  'common.save': { ar: 'حفظ', en: 'Save', fr: 'Enregistrer', es: 'Guardar', de: 'Speichern', zh: '保存', hi: 'सहेजें' },
  'common.cancel': { ar: 'إلغاء', en: 'Cancel', fr: 'Annuler', es: 'Cancelar', de: 'Abbrechen', zh: '取消', hi: 'रद्द करें' },
  'common.exportPDF': { ar: 'تصدير PDF', en: 'Export PDF', fr: 'Exporter PDF', es: 'Exportar PDF', de: 'PDF exportieren', zh: '导出 PDF', hi: 'PDF निर्यात करें' },
  'common.viewDetails': { ar: 'عرض التفاصيل', en: 'View Details', fr: 'Voir les détails', es: 'Ver detalles', de: 'Details anzeigen', zh: '查看详情', hi: 'विवरण देखें' },
  'common.status': { ar: 'الحالة', en: 'Status', fr: 'Statut', es: 'Estado', de: 'Status', zh: '状态', hi: 'स्थिति' },
  'common.all': { ar: 'الكل', en: 'All', fr: 'Tous', es: 'Todos', de: 'Alle', zh: '全部', hi: 'सभी' },
  'common.verified': { ar: 'معتمد', en: 'Verified', fr: 'Vérifié', es: 'Verificado', de: 'Verifiziert', zh: '已认证', hi: 'सत्यापित' },
  'common.inReview': { ar: 'مراجعة خبير', en: 'Expert Review', fr: 'Revue d’expert', es: 'Revisión de experto', de: 'Expertenprüfung', zh: '专家评审中', hi: 'विशेषज्ञ समीक्षा' },
  'common.draft': { ar: 'مسودة', en: 'Draft', fr: 'Brouillon', es: 'Borrador', de: 'Entwurf', zh: '草稿', hi: 'ड्राफ्ट' },
  'common.lastUpdated': { ar: 'آخر تحديث:', en: 'Last Updated:', fr: 'Dernière mise à jour :', es: 'Última actualización:', de: 'Zuletzt aktualisiert:', zh: '最后更新：', hi: 'अंतिम अद्यतन:' }
};

interface LanguageContextType {
  language: Language;
  direction: 'rtl' | 'ltr';
  languageInfo: LanguageInfo;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatPercent: (value: number) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  direction: 'rtl',
  languageInfo: SUPPORTED_LANGUAGES[0],
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  formatNumber: (v) => String(v),
  formatDate: (d) => String(d),
  formatPercent: (v) => `${v}%`,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('mawred_language') as Language | null;
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'ar';
  });

  const languageInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const direction = languageInfo.dir;

  useEffect(() => {
    try {
      localStorage.setItem('mawred_language', language);
    } catch {
      // ignore
    }
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = useCallback((key: string, fallback?: string): string => {
    const entry = DICTIONARY[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    // Fallback to English if translation is missing in the chosen language, or fallback argument
    if (entry && entry.en) {
      return entry.en;
    }
    return fallback || key;
  }, [language]);

  const formatNumber = useCallback((value: number, options?: Intl.NumberFormatOptions): string => {
    try {
      return new Intl.NumberFormat(languageInfo.locale, options).format(value);
    } catch {
      return String(value);
    }
  }, [languageInfo.locale]);

  const formatDate = useCallback((date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(d.getTime())) return String(date);
      return new Intl.DateTimeFormat(languageInfo.locale, options || {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(d);
    } catch {
      return String(date);
    }
  }, [languageInfo.locale]);

  const formatPercent = useCallback((value: number): string => {
    try {
      return new Intl.NumberFormat(languageInfo.locale, {
        style: 'percent',
        maximumFractionDigits: 1
      }).format(value / 100);
    } catch {
      return `${value}%`;
    }
  }, [languageInfo.locale]);

  return (
    <LanguageContext.Provider value={{
      language,
      direction,
      languageInfo,
      setLanguage,
      t,
      formatNumber,
      formatDate,
      formatPercent
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
