import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ExpertProfile, getExpertTwinningReadiness } from '../data/expertsData';

export interface ExportExpertProjectsPDFOptions {
  experts: ExpertProfile[];
  projectFilter?: string;
  readinessFilter?: string;
  reportTitle?: string;
  preparedBy?: string;
  onProgress?: (status: string) => void;
}

export async function exportExpertProjectsPDF({
  experts,
  projectFilter = 'جميع المشاريع',
  readinessFilter = 'كافة مستويات الجاهزية',
  reportTitle = 'تقرير المشاريع الوطنية المرتبطة بالخبراء ومؤشرات جاهزية التوأمة المعرفية',
  preparedBy = 'مكتب إدارة وتوطين المعرفة الضمنية - منصة مورد',
  onProgress
}: ExportExpertProjectsPDFOptions): Promise<void> {
  onProgress?.('جاري إعداد وثيقة حصر المشاريع وتنسيق الهوية الرسمية...');

  const reportId = `MWR-TWIN-EXP-${Date.now().toString().slice(-4)}`;
  const dateStr = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate aggregates
  const totalExperts = experts.length;
  const totalProjectLinks = experts.reduce((acc, exp) => acc + exp.currentProjects.length, 0);
  const totalCadres = experts.reduce((acc, exp) => {
    return acc + exp.currentProjects.reduce((sum, p) => sum + p.allocatedCadresCount, 0);
  }, 0);
  const allLocalizationRates = experts.flatMap(e => e.currentProjects.map(p => p.localizationRate));
  const avgLocalization = allLocalizationRates.length > 0
    ? Math.round(allLocalizationRates.reduce((a, b) => a + b, 0) / allLocalizationRates.length)
    : 85;

  const fullyAvailableCount = experts.filter(e => getExpertTwinningReadiness(e).availabilityStatus === 'متاح بالكامل').length;
  const partiallyBusyCount = experts.filter(e => getExpertTwinningReadiness(e).availabilityStatus === 'مشغول جزئياً').length;
  const soonAvailableCount = experts.filter(e => getExpertTwinningReadiness(e).availabilityStatus === 'متاح قريباً').length;

  // Create temporary container for high-res rendering
  const container = document.createElement('div');
  container.id = 'expert-projects-pdf-container';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // Standard A4 width at 96 DPI
  container.style.minHeight = '1123px';
  container.style.backgroundColor = '#FFFFFF';
  container.style.color = '#1A252C';
  container.style.fontFamily = 'Cairo, Tajawal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.direction = 'rtl';
  container.style.textAlign = 'right';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '99999';

  // Build HTML for experts & their linked projects
  const expertsHtml = experts.map((expert, idx) => {
    const readiness = getExpertTwinningReadiness(expert);
    const avgExpertLoc = Math.round(
      expert.currentProjects.reduce((acc, p) => acc + p.localizationRate, 0) / (expert.currentProjects.length || 1)
    );

    const readinessColor = readiness.level === 'high' 
      ? { bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46', dot: '#10B981', tag: '#047857' }
      : readiness.level === 'medium'
      ? { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', dot: '#3B82F6', tag: '#1D4ED8' }
      : { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', dot: '#F59E0B', tag: '#B45309' };

    const projectsRowsHtml = expert.currentProjects.map(project => `
      <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 900; font-size: 13px; color: #111827;">${project.projectName}</span>
            <span style="background: rgba(0, 108, 53, 0.1); color: #006C35; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px;">
              ${project.status}
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 11px;">
            <span style="color: #6B7280; font-weight: 700;">نسبة التوطين:</span>
            <span style="background: #006C35; color: #ffffff; font-weight: 900; padding: 1px 7px; border-radius: 5px; font-size: 11px;">
              %${project.localizationRate}
            </span>
          </div>
        </div>

        <div style="font-size: 11px; font-weight: 800; color: #006C35; margin-bottom: 4px;">
          الدور الميداني: ${project.role}
        </div>

        <div style="font-size: 10.5px; color: #4B5563; line-height: 1.5; margin-bottom: 8px; background: #ffffff; padding: 6px 10px; border-radius: 6px; border: 1px solid #F3F4F6;">
          ${project.scope}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #6B7280; border-top: 1px dashed #E5E7EB; pt: 6px; padding-top: 6px;">
          <span>الجهة الشريكة: <strong style="color: #1F2937;">${project.partnerEntity}</strong></span>
          <span>الكوادر المرافقة: <strong style="color: #006C35;">${project.allocatedCadresCount} مهندساً</strong> • الأصول الموثقة: <strong style="color: #8A6D3B;">${project.keyAssetsCount}</strong></span>
        </div>
      </div>
    `).join('');

    return `
      <div style="background: #ffffff; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 18px 20px; margin-bottom: 16px; page-break-inside: avoid;">
        <!-- Expert Header & Readiness Ribbon -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; border-bottom: 1px solid #F3F4F6; padding-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #006C35; color: #ffffff; font-weight: 900; font-size: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              ${expert.image}
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 3px;">
                <h3 style="font-size: 15px; font-weight: 900; color: #111827; margin: 0;">${expert.name}</h3>
                <span style="font-size: 10px; color: #6B7280; font-weight: 700;">(خبرة ${expert.experienceYears} عاماً)</span>
              </div>
              <div style="font-size: 11px; color: #4B5563; font-weight: 600;">${expert.title}</div>
              <div style="font-size: 10px; color: #006C35; font-weight: 700;">${expert.organization}</div>
            </div>
          </div>

          <!-- Twinning Readiness Badge in PDF -->
          <div style="background: ${readinessColor.bg}; border: 1.5px solid ${readinessColor.border}; border-radius: 12px; padding: 8px 12px; text-align: left; min-width: 170px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 3px;">
              <span style="font-size: 9px; font-weight: 800; color: ${readinessColor.text};">حالة جاهزية التوأمة:</span>
              <span style="background: #ffffff; color: ${readinessColor.tag}; font-weight: 900; font-size: 10px; padding: 1px 6px; border-radius: 4px; border: 1px solid ${readinessColor.border};">
                %${readiness.score}
              </span>
            </div>
            <div style="font-size: 12px; font-weight: 900; color: ${readinessColor.text};">
              ${readiness.availabilityStatus} (${readiness.statusText})
            </div>
            <div style="font-size: 9.5px; color: #4B5563; margin-top: 3px;">
              تفرغ أسبوعي: <strong>${readiness.availableHoursPerWeek} ساعة</strong> • مشاريع: <strong>${expert.currentProjects.length}</strong>
            </div>
          </div>
        </div>

        <!-- Readiness Evaluation Note -->
        <div style="background: #F9FAFB; border-right: 3px solid #006C35; padding: 6px 12px; font-size: 10px; color: #4B5563; border-radius: 4px; margin-bottom: 12px; line-height: 1.4;">
          <strong>تقييم الطاقة الاستيعابية:</strong> ${readiness.explanation} (${readiness.capacityDescription}).
        </div>

        <!-- Section Title for Projects -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 11px; font-weight: 800; color: #1F2937;">
            المشاريع الوطنية الكبرى المرتبطة بالخبير (${expert.currentProjects.length} مشاريع):
          </span>
          <span style="font-size: 10px; color: #6B7280; font-weight: 700;">
            متوسط توطين المعرفة: <strong style="color: #006C35;">%${avgExpertLoc}</strong>
          </span>
        </div>

        <!-- Linked Projects Details -->
        <div>
          ${projectsRowsHtml}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div style="padding: 36px 40px; background: #ffffff; width: 100%; box-sizing: border-box;">
      
      <!-- Top Decorative Saudi National Gradient Ribbon -->
      <div style="height: 6px; background: linear-gradient(90deg, #006C35 0%, #008744 45%, #C5A059 75%, #006C35 100%); border-radius: 4px; margin-bottom: 20px;"></div>

      <!-- Official Header with Mawred & Vision 2030 Identity -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #F0F2F5; padding-bottom: 18px; margin-bottom: 20px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="background: rgba(0, 108, 53, 0.1); border: 1px solid rgba(0, 108, 53, 0.25); color: #006C35; padding: 3px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800;">
              المملكة العربية السعودية • رؤية 2030
            </span>
            <span style="background: rgba(197, 160, 89, 0.15); border: 1px solid rgba(197, 160, 89, 0.4); color: #8A6D3B; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 800;">
              وثيقة توأمة ومواءمة مشاريع معتمدة
            </span>
          </div>

          <h1 style="font-size: 21px; font-weight: 900; color: #1A252C; margin: 0 0 6px 0; line-height: 1.35;">
            ${reportTitle}
          </h1>
          
          <div style="display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 700; color: #4B5563;">
            <span style="color: #006C35; font-weight: 800;">نطاق التصفية:</span>
            <span style="background: #006C35; color: #ffffff; padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 800;">
              ${projectFilter}
            </span>
            <span style="color: #9CA3AF;">•</span>
            <span style="background: #F3F4F6; color: #374151; padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 800;">
              ${readinessFilter}
            </span>
            <span style="color: #9CA3AF;">•</span>
            <span style="color: #6B7280;">منصة مورد لتوطين المعرفة الضمنية</span>
          </div>
        </div>

        <div style="text-align: left; direction: ltr;">
          <div style="background: #F8F9FA; border: 1px solid #E5E7EB; padding: 10px 14px; border-radius: 12px; text-align: right; direction: rtl; min-width: 170px;">
            <div style="font-size: 9px; color: #6B7280; font-weight: 700;">رمز الوثيقة المرجعي:</div>
            <div style="font-size: 11px; font-weight: 900; color: #1A252C; font-family: monospace;">${reportId}</div>
            <div style="font-size: 9px; color: #6B7280; font-weight: 700; margin-top: 4px;">تاريخ الاعتماد والتصدير:</div>
            <div style="font-size: 11px; font-weight: 800; color: #006C35;">${dateStr}</div>
          </div>
        </div>
      </div>

      <!-- Executive KPI Cards Strip -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 22px;">
        <div style="background: #F8FAF9; border: 1px solid #E2E8F0; padding: 12px 14px; border-radius: 12px; text-align: center;">
          <div style="font-size: 10px; color: #64748B; font-weight: 700; margin-bottom: 2px;">الخبراء المعتمدون</div>
          <div style="font-size: 20px; font-weight: 900; color: #006C35;">${totalExperts} خبير</div>
          <div style="font-size: 9px; color: #10B981; font-weight: 800; margin-top: 2px;">تغطية تخصصية دولية</div>
        </div>

        <div style="background: #F8FAF9; border: 1px solid #E2E8F0; padding: 12px 14px; border-radius: 12px; text-align: center;">
          <div style="font-size: 10px; color: #64748B; font-weight: 700; margin-bottom: 2px;">المشاريع الوطنية المرتبطة</div>
          <div style="font-size: 20px; font-weight: 900; color: #8A6D3B;">${totalProjectLinks} ارتباطاً</div>
          <div style="font-size: 9px; color: #64748B; font-weight: 700; margin-top: 2px;">نيوم، البحر الأحمر، القدية...</div>
        </div>

        <div style="background: #F8FAF9; border: 1px solid #E2E8F0; padding: 12px 14px; border-radius: 12px; text-align: center;">
          <div style="font-size: 10px; color: #64748B; font-weight: 700; margin-bottom: 2px;">توزيع جاهزية التوأمة</div>
          <div style="font-size: 13px; font-weight: 900; color: #1F2937; margin-top: 4px;">
            <span style="color: #047857;">${fullyAvailableCount} متاح</span> • 
            <span style="color: #1D4ED8;">${partiallyBusyCount} جزئي</span> • 
            <span style="color: #B45309;">${soonAvailableCount} قريباً</span>
          </div>
          <div style="font-size: 9px; color: #006C35; font-weight: 800; margin-top: 2px;">وفق عبء المشاريع الحالية</div>
        </div>

        <div style="background: #F8FAF9; border: 1px solid #E2E8F0; padding: 12px 14px; border-radius: 12px; text-align: center;">
          <div style="font-size: 10px; color: #64748B; font-weight: 700; margin-bottom: 2px;">متوسط التوطين والكوادر</div>
          <div style="font-size: 20px; font-weight: 900; color: #006C35;">%${avgLocalization}</div>
          <div style="font-size: 9px; color: #475569; font-weight: 700; margin-top: 2px;">${totalCadres} كفاءة سعودية مرافقة</div>
        </div>
      </div>

      <!-- Information Callout Box -->
      <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 12px 16px; margin-bottom: 24px; font-size: 11px; color: #166534; line-height: 1.5;">
        <strong>معيار احتساب مؤشر جاهزية التوأمة:</strong> يُقاس مؤشر جاهزية التوأمة تلقائياً بناءً على عدد المشاريع الوطنية الحالية المرتبطة بكل خبير، لضمان تخصيص ساعات ملازمة كافية لنقل أسرار المهن الهندسية والتقنية:
        <span style="font-weight: 800; color: #047857;">[متاح بالكامل = مشروع واحد (تفرغ 16 ساعة)]</span>،
        <span style="font-weight: 800; color: #1D4ED8;">[مشغول جزئياً = مشروعان (تفرغ 8 ساعات)]</span>،
        <span style="font-weight: 800; color: #B45309;">[متاح قريباً = 3 مشاريع فأكثر (تفرغ 4 ساعات بجدولة مسبقة)]</span>.
      </div>

      <!-- Experts & Projects List Section -->
      <div>
        <h2 style="font-size: 14px; font-weight: 900; color: #111827; margin: 0 0 14px 0; border-bottom: 2px solid #E5E7EB; padding-bottom: 8px;">
          سجل الخبراء والمشاريع الوطنية المعتمدة وحالة جاهزية التوأمة:
        </h2>
        
        ${expertsHtml}
      </div>

      <!-- Official Sign-off & Verification Footer -->
      <div style="margin-top: 30px; pt: 20px; border-top: 2px solid #E5E7EB; padding-top: 20px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #1F2937; margin-bottom: 4px;">
              إعداد واعتماد: ${preparedBy}
            </div>
            <div style="font-size: 10px; color: #6B7280;">
              منصة مورد • مبادرة وطنية لتوطين المعرفة الضمنية بمشاريع رؤية المملكة 2030
            </div>
            <div style="font-size: 9px; color: #9CA3AF; margin-top: 4px;">
              هذه الوثيقة رسمية ومحمية بموجب بروتوكولات الحوكمة وحفظ الملكية الفكرية الوطنية.
            </div>
          </div>

          <div style="text-align: center;">
            <div style="display: inline-block; border: 2px dashed #006C35; border-radius: 10px; padding: 8px 18px; background: rgba(0, 108, 53, 0.03);">
              <div style="font-size: 11px; font-weight: 900; color: #006C35;">منصة مورد • توطين المعرفة</div>
              <div style="font-size: 9px; color: #8A6D3B; font-weight: 800; margin-top: 2px;">ختم التحقق والاعتماد الرسمي</div>
              <div style="font-size: 8px; color: #6B7280; font-family: monospace; margin-top: 2px;">VERIFIED-KNOWLEDGE-2026</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(container);

  try {
    await new Promise(resolve => setTimeout(resolve, 350));

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    onProgress?.('جاري تحويل الوثيقة إلى ملف PDF وتجهيز التنزيل...');

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 5) {
      position = position - pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    const safeFilename = `Mawred-Experts-Projects-Readiness-${Date.now().toString().slice(-4)}.pdf`;
    pdf.save(safeFilename);
    onProgress?.('تم تصدير ملف PDF بنجاح!');
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
