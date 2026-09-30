import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ProjectKnowledgeAsset } from '../data/knowledgeAssets';

export interface ExportMeetingPDFOptions {
  project: string;
  assets: ProjectKnowledgeAsset[];
  meetingTitle?: string;
  meetingType?: string;
  chairperson?: string;
  attendees?: string;
  includeRecommendations?: boolean;
  preparedBy?: string;
  singleAssetMode?: boolean;
  onProgress?: (status: string) => void;
}

export async function exportKnowledgeAssetsPDF({
  project,
  assets,
  meetingTitle = 'اجتماع اللجنة التوجيهية لنقل وتوطين المعرفة ومواءمة المحتوى المحلي',
  meetingType = 'اجتماع رسمي للجنة التوجيهية العليا',
  chairperson = 'مدير عام إدارة المعرفة والتميز التشغيلي',
  attendees = 'صندوق الاستثمارات العامة، هيئة المحتوى المحلي، المقاول الرئيسي، الشركاء الوطنيين المعتمدين',
  includeRecommendations = true,
  preparedBy = 'مكتب إدارة وتوطين المعرفة - منصة مورد',
  singleAssetMode = false,
  onProgress
}: ExportMeetingPDFOptions): Promise<void> {
  onProgress?.('جاري تحضير وثيقة الاجتماع وتنسيق الهوية الرسمية...');

  const reportId = `MWR-MEET-${project.replace(/\s+/g, '-').toUpperCase()}-${Date.now().toString().slice(-4)}`;
  const dateStr = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const technicalCount = assets.filter(a => a.classification === 'فنية').length;
  const adminCount = assets.filter(a => a.classification === 'إدارية').length;
  const strategicCount = assets.filter(a => a.classification === 'استراتيجية').length;
  const categoriesList = Array.from(new Set(assets.map(a => a.category))).join(' • ');

  // Create temporary container for high-res rendering
  const container = document.createElement('div');
  container.id = 'knowledge-assets-meeting-pdf';
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

  container.innerHTML = `
    <div style="padding: 34px 38px; background: #ffffff; width: 100%; box-sizing: border-box;">
      
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
              وثيقة اجتماع رسمي معتمدة
            </span>
          </div>

          <h1 style="font-size: 22px; font-weight: 900; color: #1A252C; margin: 0 0 6px 0; line-height: 1.35;">
            ${singleAssetMode ? 'مذكرة إحاطة تنفيذية للأصل المعرفي للاجتماع الرسمي' : 'حقيبة ومذكرة عرض الأصول المعرفية للاجتماعات الرسمية'}
          </h1>
          
          <div style="display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; color: #4B5563;">
            <span style="color: #006C35; font-weight: 800;">المشروع الاستراتيجي:</span>
            <span style="background: #006C35; color: #ffffff; padding: 2px 12px; border-radius: 6px; font-size: 12px; font-weight: 800;">
              ${project}
            </span>
            <span style="color: #9CA3AF;">•</span>
            <span style="color: #6B7280; font-size: 12px;">منصة مورد لإدارة وتوطين المعرفة الضمنية</span>
          </div>
        </div>

        <div style="text-align: left; direction: ltr;">
          <div style="background: #F8F9FA; border: 1px solid #E5E7EB; padding: 10px 14px; border-radius: 12px; text-align: right; direction: rtl; min-width: 170px;">
            <div style="font-size: 9px; color: #6B7280; font-weight: 700;">رمز المستند المرجعي:</div>
            <div style="font-size: 11px; font-weight: 900; color: #1A252C; font-family: monospace;">${reportId}</div>
            <div style="font-size: 9px; color: #6B7280; font-weight: 700; margin-top: 4px;">تاريخ انعقاد الاجتماع:</div>
            <div style="font-size: 11px; font-weight: 800; color: #006C35;">${dateStr}</div>
          </div>
        </div>
      </div>

      <!-- Meeting Metadata & Confidentiality Banner -->
      <div style="background: linear-gradient(135deg, #1A252C 0%, #253641 100%); color: #ffffff; padding: 16px 20px; border-radius: 14px; margin-bottom: 20px; border: 1px solid rgba(197, 160, 89, 0.35); box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 10px; margin-bottom: 10px;">
          <div>
            <div style="font-size: 10px; color: #C5A059; font-weight: 800; text-transform: uppercase;">جدول أعمال الاجتماع الرسمي:</div>
            <div style="font-size: 14px; font-weight: 900; color: #FFFFFF; margin-top: 2px;">
              ${meetingTitle}
            </div>
          </div>
          <div style="text-align: left; background: rgba(0, 108, 53, 0.4); border: 1px solid rgba(197, 160, 89, 0.4); padding: 4px 12px; border-radius: 8px; font-size: 10px; font-weight: 800; color: #C5A059;">
            درجة السرية: سري ومحمي للاجتماعات
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 11px;">
          <div>
            <span style="color: #9CA3AF;">المستوى الإداري / نوع الجلسة:</span>
            <strong style="color: #F3F4F6; margin-right: 6px;">${meetingType}</strong>
          </div>
          <div>
            <span style="color: #9CA3AF;">رئيس الجلسة / مقدم العرض:</span>
            <strong style="color: #F3F4F6; margin-right: 6px;">${chairperson}</strong>
          </div>
          <div style="grid-column: span 2; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 8px;">
            <span style="color: #9CA3AF;">الجهات المشاركة والحضور المستهدف:</span>
            <strong style="color: #F3F4F6; margin-right: 6px;">${attendees}</strong>
          </div>
        </div>
      </div>

      <!-- Executive Overview KPI Cards -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 12px 14px; border-right: 4px solid #006C35;">
          <div style="font-size: 10px; font-weight: 700; color: #6B7280; margin-bottom: 2px;">الأصول المعروضة للنقاش</div>
          <div style="font-size: 20px; font-weight: 900; color: #006C35;">${assets.length} <span style="font-size: 11px; font-weight: 700; color: #6B7280;">أصل معرفي</span></div>
        </div>

        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 12px 14px; border-right: 4px solid #2563EB;">
          <div style="font-size: 10px; font-weight: 700; color: #6B7280; margin-bottom: 2px;">أصول فنية وتقنية</div>
          <div style="font-size: 20px; font-weight: 900; color: #2563EB;">${technicalCount} <span style="font-size: 11px; font-weight: 700; color: #6B7280;">حل تطبيقي</span></div>
        </div>

        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 12px 14px; border-right: 4px solid #D97706;">
          <div style="font-size: 10px; font-weight: 700; color: #6B7280; margin-bottom: 2px;">أصول تنظيمية وإدارية</div>
          <div style="font-size: 20px; font-weight: 900; color: #D97706;">${adminCount} <span style="font-size: 11px; font-weight: 700; color: #6B7280;">حوكمة وتشغيل</span></div>
        </div>

        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 12px 14px; border-right: 4px solid #7C3AED;">
          <div style="font-size: 10px; font-weight: 700; color: #6B7280; margin-bottom: 2px;">أصول توطين استراتيجية</div>
          <div style="font-size: 20px; font-weight: 900; color: #7C3AED;">${strategicCount} <span style="font-size: 11px; font-weight: 700; color: #6B7280;">سيادية طويلة الأجل</span></div>
        </div>
      </div>

      <!-- Scope & Domain Summary -->
      <div style="background: #F8F9FA; border: 1px solid #E5E7EB; padding: 10px 16px; border-radius: 10px; margin-bottom: 22px; font-size: 11px; color: #4B5563; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <strong style="color: #1A252C;">القطاعات والمجالات المعرفية:</strong> ${categoriesList || 'متعدد التخصصات الهندسية والتقنية'}
        </div>
        <div style="color: #006C35; font-weight: 800;">
          نسبة المواءمة مع مستهدفات التوطين: 94.2%
        </div>
      </div>

      <!-- Assets Detailed Dossier -->
      <div style="margin-bottom: 22px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h2 style="font-size: 15px; font-weight: 900; color: #1A252C; margin: 0;">
            بنود ومحتوى الأصول المعرفية المرفوعة للعرض والاعتماد
          </h2>
          <span style="font-size: 10px; font-weight: 800; color: #006C35; background: rgba(0,108,53,0.1); padding: 2px 10px; border-radius: 6px;">
            نسخة الاجتماع الرسمية
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${assets.map((asset, index) => {
            const classColor = asset.classification === 'فنية' 
              ? { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' }
              : asset.classification === 'إدارية'
              ? { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' }
              : { bg: '#FAF5FF', text: '#6D28D9', border: '#E9D5FF' };

            return `
              <div style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 14px 16px; position: relative;">
                <!-- Asset Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span style="background: #1A252C; color: #ffffff; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 4px;">
                      بند #${index + 1}
                    </span>
                    <span style="font-size: 13px; font-weight: 800; color: #1A252C;">
                      ${asset.title}
                    </span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="background: ${classColor.bg}; color: ${classColor.text}; border: 1px solid ${classColor.border}; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px;">
                      ${asset.classification || 'أصل معرفي'}
                    </span>
                    ${asset.subCategory ? `
                    <span style="background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px;">
                      ${asset.subCategory}
                    </span>` : ''}
                    <span style="background: #F3F4F6; color: #4B5563; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px;">
                      ${asset.category}
                    </span>
                  </div>
                </div>

                <!-- Asset Knowledge Content -->
                <p style="font-size: 11px; line-height: 1.6; color: #374151; margin: 0 0 10px 0; font-weight: 500;">
                  ${asset.content}
                </p>

                <!-- Strategic Impact & Localization Note for Meeting -->
                <div style="background: #F9FAFB; border: 1px dashed #D1D5DB; border-radius: 8px; padding: 8px 12px; margin-bottom: 8px; font-size: 10px; color: #4B5563;">
                  <strong style="color: #006C35;">الأثر والتوصية التنفيذية للاجتماع:</strong>
                  نقل المعرفة المباشر للشركات السعودية الشريكة وتوثيق الإجراء كمرجعية قياسية لمنع تكرار تكاليف الاستشارات الخارجية.
                </div>

                <!-- Asset Footer Details -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #F3F4F6; padding-top: 8px; font-size: 10px; color: #6B7280;">
                  <div style="display: flex; align-items: center; gap: 14px;">
                    <span><strong>الخبير / الموثق:</strong> ${asset.author || 'كوادر المشروع'}</span>
                    <span><strong>تاريخ التوثيق:</strong> ${asset.date || dateStr}</span>
                    ${asset.dueDate ? `<span style="color: #B45309; font-weight: 700;"><strong>استحقاق النقل:</strong> ${asset.dueDate}</span>` : ''}
                  </div>
                  <div style="display: flex; gap: 4px;">
                    ${(asset.tags || []).slice(0, 4).map(tag => `
                      <span style="background: #F9FAFB; border: 1px solid #E5E7EB; padding: 1px 6px; border-radius: 4px; font-size: 9px; color: #6B7280;">
                        #${tag}
                      </span>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Action Items & Decisions Matrix (Essential for Official Meetings) -->
      ${includeRecommendations ? `
        <div style="background: #FFFFFF; border: 1px solid #D1D5DB; border-radius: 12px; padding: 14px 18px; margin-bottom: 22px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="font-size: 13px; font-weight: 900; color: #1A252C;">
              مصفوفة القرارات والتوصيات المقترحة للاجتماع الرسمي
            </div>
            <span style="font-size: 10px; font-weight: 800; color: #C5A059; background: rgba(197, 160, 89, 0.15); padding: 2px 8px; border-radius: 4px;">
              إجراءات واجبة المتابعة
            </span>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 10px; text-align: right;">
            <thead>
              <tr style="background: #F8F9FA; border-bottom: 2px solid #E5E7EB;">
                <th style="padding: 6px 10px; font-weight: 800; color: #374151;">#</th>
                <th style="padding: 6px 10px; font-weight: 800; color: #374151;">القرار / التوصية المقترحة</th>
                <th style="padding: 6px 10px; font-weight: 800; color: #374151;">الجهة المسؤولة</th>
                <th style="padding: 6px 10px; font-weight: 800; color: #374151;">حالة التوجيه</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #F3F4F6;">
                <td style="padding: 8px 10px; font-weight: 700;">1</td>
                <td style="padding: 8px 10px; color: #1F2937;">اعتماد توثيق الأصول المعرفية المعروضة وإدراجها في السجل السيادي الوطني لمنصة مورد.</td>
                <td style="padding: 8px 10px; color: #006C35; font-weight: 700;">أمانة اللجنة ومكتب إدارة المعرفة</td>
                <td style="padding: 8px 10px;"><span style="color: #006C35; font-weight: 800; background: #ECFDF5; padding: 2px 6px; border-radius: 4px;">جاهز للاعتماد</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #F3F4F6;">
                <td style="padding: 8px 10px; font-weight: 700;">2</td>
                <td style="padding: 8px 10px; color: #1F2937;">تعيين وتكليف مهندسين وكفاءات سعودية ككوادر ظل (Shadowing) لملازمة الخبراء وتطبيق الإجراءات.</td>
                <td style="padding: 8px 10px; color: #006C35; font-weight: 700;">إدارة رأس المال البشري والمقاول الرئيسي</td>
                <td style="padding: 8px 10px;"><span style="color: #D97706; font-weight: 800; background: #FFFBEB; padding: 2px 6px; border-radius: 4px;">يتطلب قرار</span></td>
              </tr>
              <tr>
                <td style="padding: 8px 10px; font-weight: 700;">3</td>
                <td style="padding: 8px 10px; color: #1F2937;">ربط الأصول الفنية مع الشركات السعودية المتخصصة المؤهلة عبر نافذة الشركاء لتسريع التوطين.</td>
                <td style="padding: 8px 10px; color: #006C35; font-weight: 700;">هيئة المحتوى المحلي والمشتريات الحكومية</td>
                <td style="padding: 8px 10px;"><span style="color: #2563EB; font-weight: 800; background: #EFF6FF; padding: 2px 6px; border-radius: 4px;">تنسيق مشترك</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- Official Signatures & Digital Authentication Seal -->
      <div style="background: #FBFDFB; border: 1px solid rgba(0, 108, 53, 0.25); border-radius: 14px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div style="max-width: 460px;">
          <div style="font-size: 12px; font-weight: 900; color: #006C35; margin-bottom: 4px;">
            اعتماد محضر الجلسة والتوثيق السيادي
          </div>
          <div style="font-size: 10px; color: #4B5563; line-height: 1.5;">
            تم إعداد وتدقيق هذه الوثيقة وفق اشتراطات حوكمة البيانات الوطنية (NDMO) والأمن السيبراني (NCA)، وتعتبر مرجعاً رسمياً لأعمال اللجنة التوجيهية لمشروع ${project}.
          </div>
          <div style="display: flex; gap: 20px; margin-top: 10px; font-size: 10px; color: #374151;">
            <div><strong>توقيع رئيس الجلسة:</strong> __________________</div>
            <div><strong>أمين سر اللجنة:</strong> __________________</div>
          </div>
        </div>

        <div style="text-align: center; border: 2px dashed #006C35; border-radius: 12px; padding: 10px 18px; background: rgba(0,108,53,0.03);">
          <div style="font-size: 11px; font-weight: 900; color: #006C35;">ختم الاعتماد الرسمي</div>
          <div style="font-size: 9px; font-weight: 800; color: #C5A059; margin: 2px 0;">منصة مورد • رؤية المملكة 2030</div>
          <div style="font-size: 8px; color: #6B7280; font-family: monospace;">OFFICIAL MEETING DOSSIER</div>
        </div>
      </div>

      <!-- Report Footer -->
      <div style="border-top: 1px solid #E5E7EB; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #9CA3AF;">
        <div>
          <span>تم إعداد وثيقة الاجتماع عبر: ${preparedBy}</span>
        </div>
        <div>
          <span>نظام مورد لإدارة وتوطين المعرفة • المملكة العربية السعودية 2026</span>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(container);
  onProgress?.('جاري معالجة المستند بجودة طباعية عالية وتضمين الهوية...');

  try {
    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    onProgress?.('جاري إنشاء ملف PDF وتجهيز النسخة للمشاركة...');

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

    const safeFilename = singleAssetMode && assets[0]
      ? `Mawred-Meeting-Brief-${assets[0].title.slice(0, 20).replace(/\s+/g, '-')}-2026.pdf`
      : `Mawred-Official-Meeting-${project.replace(/\s+/g, '-')}-2026.pdf`;

    pdf.save(safeFilename);
    onProgress?.('تم تصدير ملف PDF بنجاح للاجتماع الرسمي!');
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Quick export for an individual knowledge asset as an official meeting briefing note
 */
export async function exportSingleAssetMeetingBrief(
  asset: ProjectKnowledgeAsset,
  onProgress?: (status: string) => void
): Promise<void> {
  return exportKnowledgeAssetsPDF({
    project: asset.project,
    assets: [asset],
    meetingTitle: `مذكرة إحاطة تنفيذية: ${asset.title}`,
    meetingType: 'مذكرة عرض موجزة للاجتماعات واللجان الرسمية',
    singleAssetMode: true,
    onProgress
  });
}
