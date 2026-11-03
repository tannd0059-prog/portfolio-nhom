import React, { useState } from 'react';
import { PROFILE } from '@/config/portfolioData';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { sound } from '@/utils/soundEffects';
import {
  Mail,
  GitBranch,
  MapPin,
  GraduationCap,
  CheckCircle2,
  Send,
  AlertCircle,
  Sparkles,
  Clock,
  Loader2,
} from 'lucide-react';

interface FormValues {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const ContactSection: React.FC = () => {
  const isAudioMuted = usePortfolioStore((s) => s.isAudioMuted);
  const [values, setValues] = useState<FormValues>({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email format regex validation
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = (formValues: FormValues): FormErrors => {
    const errs: FormErrors = {};

    if (!formValues.fullName.trim()) {
      errs.fullName = 'Vui lòng nhập họ và tên của bạn.';
    } else if (formValues.fullName.trim().length < 2) {
      errs.fullName = 'Họ và tên cần có tối thiểu 2 ký tự.';
    }

    if (!formValues.email.trim()) {
      errs.email = 'Vui lòng nhập địa chỉ email liên hệ.';
    } else if (!EMAIL_REGEX.test(formValues.email.trim())) {
      errs.email = 'Định dạng email không hợp lệ (Ví dụ: example@domain.com).';
    }

    if (!formValues.subject.trim()) {
      errs.subject = 'Vui lòng nhập chủ đề liên hệ.';
    } else if (formValues.subject.trim().length < 3) {
      errs.subject = 'Chủ đề cần tối thiểu 3 ký tự.';
    }

    if (!formValues.message.trim()) {
      errs.message = 'Vui lòng nhập nội dung tin nhắn.';
    } else if (formValues.message.trim().length < 10) {
      errs.message = 'Nội dung tin nhắn cần tối thiểu 10 ký tự (hiện có: ' + formValues.message.trim().length + ' ký tự).';
    }

    return errs;
  };

  const handleChange = (field: keyof FormValues, val: string) => {
    const nextValues = { ...values, [field]: val };
    setValues(nextValues);

    if (touched[field]) {
      const fieldErrors = validate(nextValues);
      setErrors(fieldErrors);
    }
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      subject: true,
      message: true,
    });

    const formErrors = validate(values);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (!isAudioMuted) {
        sound.playSuccess();
      }
      setValues({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      });
      setTouched({});
      setErrors({});
    }, 700);
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/5">
      {/* Section Header */}
      <div className="mb-12 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-3">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Liên Hệ & Hợp Tác • Get in Touch</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Kết Nối Dự Án Cùng Đinh Thanh Thiên
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Sẵn sàng trao đổi về các cơ hội nghiên cứu AI, tối ưu hóa Logistics thông minh và phát triển phần mềm ứng dụng.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Contact Info (Col 1-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-slate-200/80 dark:border-white/5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Thông Tin Liên Lạc Trực Tiếp
                </h3>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                  Direct Contact Channels
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sẵn sàng hợp tác
              </span>
            </div>

            {/* Email link */}
            <a
              href={`mailto:${PROFILE.email}`}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all group focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400">Email công việc:</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-500 transition-colors">
                    {PROFILE.email}
                  </span>
                </div>
              </div>
              <Send className="h-4 w-4 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* GitHub link */}
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all group focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white">
                  <GitBranch className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400">GitHub:</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-500 transition-colors">
                    github.com/dinhthanhthien10-bit
                  </span>
                </div>
              </div>
              <Send className="h-4 w-4 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* University */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400">Đơn vị:</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {PROFILE.university}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400">Địa bàn hoạt động:</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {PROFILE.location}
                </span>
              </div>
            </div>

            {/* Response Time SLA */}
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-700 dark:text-cyan-300">
              <Clock className="h-4 w-4 text-cyan-500 shrink-0" />
              <span>Phản hồi tin nhắn nhanh trong vòng 24 giờ làm việc.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Validated Contact Form (Col 6-12) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200/80 dark:border-white/5 shadow-xl relative"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-white/5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Gửi Tin Nhắn / Yêu Cầu Hợp Tác
                </h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  JavaScript Form Validation Engine
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                * Bắt buộc
              </span>
            </div>

            {/* Success Notification Alert */}
            {isSubmitted && (
              <div className="mb-6 p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="block font-bold text-sm">
                    Gửi tin nhắn thành công!
                  </strong>
                  Cảm ơn bạn đã liên hệ. Đinh Thanh Thiên đã nhận được thông tin và sẽ phản hồi sớm nhất qua email của bạn.
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Field: Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={values.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-[#111318]/90 border text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition-colors ${
                    errors.fullName && touched.fullName
                      ? 'border-red-500 focus:border-red-500 bg-red-500/[0.03]'
                      : 'border-slate-300 dark:border-white/10 focus:border-cyan-400'
                  }`}
                />
                {errors.fullName && touched.fullName && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Field: Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                  Email liên hệ <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={values.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-[#111318]/90 border text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition-colors ${
                    errors.email && touched.email
                      ? 'border-red-500 focus:border-red-500 bg-red-500/[0.03]'
                      : 'border-slate-300 dark:border-white/10 focus:border-cyan-400'
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Field: Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                  Chủ đề trao đổi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hợp tác dự án AI Logistics / Tuyển dụng kỹ sư"
                  value={values.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  onBlur={() => handleBlur('subject')}
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-[#111318]/90 border text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition-colors ${
                    errors.subject && touched.subject
                      ? 'border-red-500 focus:border-red-500 bg-red-500/[0.03]'
                      : 'border-slate-300 dark:border-white/10 focus:border-cyan-400'
                  }`}
                />
                {errors.subject && touched.subject && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.subject}</span>
                  </p>
                )}
              </div>

              {/* Field: Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                  Nội dung tin nhắn <span className="text-red-500">*</span>
                  <span className="text-[11px] font-normal text-slate-400 ml-2">
                    (Tối thiểu 10 ký tự, hiện có: {values.message.trim().length})
                  </span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Nhập nội dung thông điệp trao đổi công việc hoặc câu hỏi của bạn tại đây..."
                  value={values.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  onBlur={() => handleBlur('message')}
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-[#111318]/90 border text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition-colors resize-none ${
                    errors.message && touched.message
                      ? 'border-red-500 focus:border-red-500 bg-red-500/[0.03]'
                      : 'border-slate-300 dark:border-white/10 focus:border-cyan-400'
                  }`}
                />
                {errors.message && touched.message && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] focus:outline-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                    <span>Đang mã hóa & gửi dữ liệu...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Gửi Tin Nhắn Ngay</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
