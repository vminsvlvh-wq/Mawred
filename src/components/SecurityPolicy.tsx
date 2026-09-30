import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Fingerprint, Database, Key, CheckCircle2, AlertTriangle, Eye, Server } from 'lucide-react';

export default function SecurityPolicy() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-saudi-dark mb-2">أمن البيانات والخصوصية</h1>
          <p className="text-gray-500 font-medium">سياسات حماية الأصول المعرفية السيادية للمملكة العربية السعودية</p>
        </div>
        <div className="p-4 bg-saudi-green/10 rounded-2xl border border-saudi-green/20 flex items-center gap-3">
          <div className="w-12 h-12 bg-saudi-green rounded-xl flex items-center justify-center shadow-lg shadow-saudi-green/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold mb-0.5">مستوى الحماية النشط</div>
            <div className="text-saudi-green font-black text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-saudi-green animate-pulse"></span>
              أقصى درجات التأمين السيادي
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 1: Encryption */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 border border-blue-100">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-saudi-dark mb-3">تشفير البيانات</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">
            تطبق المنصة أحدث معايير التشفير العسكري لحماية جميع المعارف والمخرجات الفنية لضمان عدم تسريب أي أصل فكري.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <span className="font-semibold">التشفير أثناء النقل (In-Transit):</span>
              <span className="text-gray-500">استخدام بروتوكول TLS 1.3 مع شهادات 256-bit لجميع الاتصالات.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <span className="font-semibold">التشفير أثناء الحفظ (At-Rest):</span>
              <span className="text-gray-500">اعتماد معيار AES-256 لتشفير قواعد البيانات والمستودعات السحابية محلياً داخل المملكة.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <span className="font-semibold">إدارة المفاتيح (KMS):</span>
              <span className="text-gray-500">تدوير آلي لمفاتيح التشفير كل 30 يوماً مع فصل الصلاحيات الإدارية.</span>
            </li>
          </ul>
        </motion.div>

        {/* Section 2: Access Control */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-saudi-gold to-yellow-600"></div>
          <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-saudi-gold mb-5 border border-yellow-100">
            <Fingerprint className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-saudi-dark mb-3">التحكم في الوصول</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">
            تطبيق مبدأ "أقل الصلاحيات" (Principle of Least Privilege) و"المعرفة بالقدر الحاجة" لجميع الأصول المعرفية.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-saudi-gold mt-0.5 shrink-0" />
              <span className="font-semibold">المصادقة المتعددة العوامل (MFA):</span>
              <span className="text-gray-500">إلزامية لجميع الكوادر الاستشارية والموظفين الحكوميين.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-saudi-gold mt-0.5 shrink-0" />
              <span className="font-semibold">التحكم المبني على الأدوار (RBAC):</span>
              <span className="text-gray-500">تخصيص الصلاحيات بدقة بناءً على المسمى الوظيفي والمشروع المعين (نيوم، البحر الأحمر، الخ).</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-saudi-gold mt-0.5 shrink-0" />
              <span className="font-semibold">مراقبة الجلسات (Session Management):</span>
              <span className="text-gray-500">إنهاء الجلسات غير النشطة بعد 15 دقيقة مع تسجيل تفاصيل الدخول.</span>
            </li>
          </ul>
        </motion.div>

        {/* Section 3: Data Retention */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-saudi-green to-emerald-600"></div>
          <div className="w-12 h-12 rounded-2xl bg-saudi-green/10 flex items-center justify-center text-saudi-green mb-5 border border-saudi-green/20">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-saudi-dark mb-3">سياسات الاحتفاظ بالبيانات</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">
            الامتثال للأنظمة الوطنية (NCA) فيما يخص حفظ وتخزين البيانات وحوكمة إتلافها بشكل آمن عند انتهاء دورتها.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-saudi-green mt-0.5 shrink-0" />
              <span className="font-semibold">السيادة الجغرافية (Data Sovereignty):</span>
              <span className="text-gray-500">الاحتفاظ بـ 100% من البيانات والمعارف الاستراتيجية داخل خوادم سيادية محلية.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-saudi-green mt-0.5 shrink-0" />
              <span className="font-semibold">أرشفة سجلات التدقيق (Audit Logs):</span>
              <span className="text-gray-500">الاحتفاظ بسجلات العمليات والنفاذ لمدة 10 سنوات كمرجع قانوني وتاريخي.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-saudi-green mt-0.5 shrink-0" />
              <span className="font-semibold">الإتلاف الآمن (Secure Erase):</span>
              <span className="text-gray-500">تطبيق معايير DoD 5220.22-M عند مسح البيانات المؤقتة لتجاوز إمكانية الاسترجاع.</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Compliance Notice */}
      <div className="bg-saudi-dark rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-5">
          <ShieldCheck className="w-64 h-64 -mt-16 -mr-16" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <Server className="w-6 h-6 text-saudi-gold" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-2">امتثال تنظيمي صارم</h4>
            <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-2xl">
              تمثل هذه السياسات الحد الأدنى لمعايير الأمان המطبقة. تتوافق بنية المنصة بالكامل مع تشريعات الهيئة الوطنية للأمن السيبراني (NCA) ومكتب إدارة البيانات الوطنية (NDMO) لضمان حماية المعرفة التراكمية للمملكة من أي استهداف سيبراني.
            </p>
          </div>
        </div>
        <div className="shrink-0 relative z-10">
          <button className="px-6 py-3 bg-saudi-gold hover:bg-yellow-500 text-saudi-dark font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-saudi-gold/20 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            تحميل وثيقة الامتثال التفصيلية
          </button>
        </div>
      </div>
    </div>
  );
}
