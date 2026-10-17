/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

const faNum = (n: number | string) =>
  String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

const ICONS: Record<string, string> = {
  pin: '<circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9"/><path d="M12 3v2M12 19v2"/>',
  cylinder: '<rect x="3" y="9" width="14" height="6" rx="1"/><path d="M17 12h4M5 9V7M5 17v-2"/>',
  excavator: '<path d="M3 20h18M5 20v-4h8v4M9 16V9l6-4 4 4M15 5l3 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v3l2 2"/>',
  valve: '<circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6M8 8l1.5 1.5M16 8l-1.5 1.5"/>',
  pump: '<circle cx="12" cy="12" r="7"/><path d="M12 5v7l4 2M2 12h3M19 12h3"/>',
  hose: '<path d="M4 6c4 0 4 12 8 12s4-12 8-12"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/>',
  conveyor: '<rect x="2" y="10" width="20" height="4" rx="2"/><circle cx="6" cy="18" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  weld: '<path d="M4 20l6-6M10 14l4-4 4 4-4 4zM14 10l3-3"/><path d="M19 4l1 1M21 7l-1 0M17 3v-1"/>',
  cnc: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 9v12M15 9v12M12 3v6"/>',
  blueprint: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M7 8h6M7 12h10M7 16h4"/>',
  cast: '<path d="M6 3h12l-2 7H8zM8 10v10h8V10"/><path d="M11 14h2"/>',
  heat: '<path d="M12 3c2 4 6 5 6 10a6 6 0 0 1-12 0c0-3 2-4 3-6 0 2 1 3 3 3 0-3-1-5 0-7z"/>',
  quality: '<path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
  shield: '<path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z"/><path d="M12 8v4M12 16h0"/>',
  truck: '<path d="M2 7h11v9H2zM13 10h5l3 3v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  rare: '<path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5L5.5 21l2-7.5L2 9h7z"/>',
  ring: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/>',
  drum: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/>',
  hub: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M18.4 5.6l-4.2 4.2M9.8 14.2l-4.2 4.2"/>',
  brake: '<path d="M4 12a8 8 0 0 1 16 0"/><path d="M6 12a6 6 0 0 1 12 0"/><path d="M4 12v3h16v-3"/>',
  tire: '<path d="M12 3v4M8 7l-1.5 1.5M16 7l1.5 1.5"/><circle cx="12" cy="7" r="3"/><path d="M12 10v11"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>',
  crown: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4"/>',
  jack: '<rect x="9" y="3" width="6" height="8" rx="1"/><path d="M12 11v6M6 17h12M8 21h8"/>',
  breaker: '<rect x="8" y="2" width="8" height="10" rx="1"/><path d="M12 12v6M10 18h4v4h-4z"/>',
  mandrel: '<rect x="3" y="10" width="18" height="4" rx="2"/><path d="M6 10V7M18 10V7M6 14v3M18 14v3"/>',
};

interface ServiceItem {
  t: string;
  d?: string;
  i: string;
}

const SERVICES: ServiceItem[] = [
  { t: 'ساخت و تعمیر پین و بوش با آلیاژ سفارشی', i: 'pin' },
  { t: 'ساخت و تعمیر جک، مفصل، پیستون و سیلندر', i: 'cylinder' },
  { t: 'ساخت و تعمیر جک بیل مکانیکی', i: 'excavator' },
  { t: 'عیب‌یابی و مونتاژ', i: 'search' },
  { t: 'سرویس شیرهای کنترل', i: 'valve' },
  { t: 'تعمیر پمپ‌های گردان', i: 'pump' },
  { t: 'اورینگ و شیلنگ هیدرولیکی', i: 'hose' },
  { t: 'رولیک و نوار نقاله', i: 'conveyor' },
  { t: 'تعمیر قطعات سنگین', d: 'جوشکاری آهن، چدن، آلومینیوم و استیل', i: 'weld' },
  { t: 'برشکاری CNC ورق فولادی', d: 'ضخامت ۲ تا ۲۰ میلی‌متر', i: 'cnc' },
  { t: 'ساخت قطعه سفارشی از روی نقشه یا نمونه', i: 'blueprint' },
  { t: 'ریخته‌گری و تراشکاری', i: 'cast' },
  { t: 'سخت‌کاری و عملیات حرارتی', i: 'heat' },
  { t: 'ساخت قطعات مشابه وارداتی چینی با کیفیت بهتر', i: 'quality' },
  { t: 'ریخته‌گری قطعات سبک و نیمه‌سنگین', d: 'با ضمانت حداقل ۳ سال', i: 'shield' },
  { t: 'تأمین قطعات راه‌سازی و معدنی', i: 'truck' },
  { t: 'صادرات و واردات و ایجاد نمایندگی', i: 'globe' },
  { t: 'ساخت قطعات کمیاب با نقشه', i: 'rare' },
];

interface ProductItem {
  n: string;
  c: string;
  i: string;
  d: string;
}

const PRODUCTS: ProductItem[] = [
  { n: 'پین و بوش', c: 'اتصالات', i: 'pin', d: 'ساخت و تعمیر پین و بوش با آلیاژ سفارشی برای ماشین‌آلات راه‌سازی و معدنی.' },
  { n: 'رینگ چرخ', c: 'چرخ و ترمز', i: 'ring', d: 'رینگ چرخ ماشین‌آلات سنگین با متریال درجه یک.' },
  { n: 'کاسه چرخ جلو و عقب', c: 'چرخ و ترمز', i: 'drum', d: 'کاسه چرخ جلو و عقب با کیفیت مطلوب و قیمت مناسب.' },
  { n: 'توپی و پره جلو و عقب', c: 'چرخ و ترمز', i: 'hub', d: 'توپی و پره جلو و عقب ماشین‌آلات راه‌سازی.' },
  { n: 'کفشک لنت ترمز', c: 'چرخ و ترمز', i: 'brake', d: 'کفشک لنت ترمز با متریال درجه یک.' },
  { n: 'والف لاستیک', c: 'چرخ و ترمز', i: 'tire', d: 'والف لاستیک ماشین‌آلات سنگین.' },
  { n: 'تنبکی ترمز', c: 'چرخ و ترمز', i: 'drum', d: 'تنبکی ترمز با کیفیت مطلوب.' },
  { n: 'دنده دیشلی', c: 'انتقال قدرت', i: 'gear', d: 'دنده دیشلی با ساخت دقیق و سخت‌کاری.' },
  { n: 'کرانویل و پینیون', c: 'انتقال قدرت', i: 'crown', d: 'کرانویل و پینیون با متریال درجه یک.' },
  { n: 'جک هیدرولیکی و بالابر آنتنی', c: 'هیدرولیک', i: 'jack', d: 'ساخت و تعمیر جک هیدرولیکی و بالابر آنتنی.' },
  { n: 'چکش بیل ماشین (هیدرولیک بریکر)', c: 'هیدرولیک', i: 'breaker', d: 'چکش بیل ماشین (هیدرولیک بریکر) و قطعات آن.' },
  { n: 'دسته‌مندل', c: 'اتصالات', i: 'mandrel', d: 'ساخت و تعمیر دسته‌مندل ماشین‌آلات معدنی.' },
];

const CATEGORIES = ['همه', ...Array.from(new Set(PRODUCTS.map((p) => p.c)))];

function SvgIcon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICONS[name] || ICONS.gear }}
    />
  );
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('sk-theme');
    return saved === 'light' ? 'light' : 'dark';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('همه');
  const [modalProductIdx, setModalProductIdx] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [serviceType, setServiceType] = useState('ساخت قطعه از روی نقشه یا نمونه');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Support widget states
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportInput, setSupportInput] = useState('');
  const [supportTyping, setSupportTyping] = useState(false);
  const [supportMessages, setSupportMessages] = useState<
    Array<{
      id: number;
      sender: 'support' | 'user';
      text: string;
      actionLabel?: string;
      actionHref?: string;
    }>
  >([
    {
      id: 1,
      sender: 'support',
      text: 'سلام! به پشتیبانی فنی «صدرا فراز کریمان» خوش آمدید. یکی از موضوعات زیر را انتخاب کنید یا سوال خود را بنویسید:',
    },
  ]);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const supportBodyRef = useRef<HTMLDivElement>(null);

  // Sync theme with root dataset and localStorage
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('sk-theme', theme);
  }, [theme]);

  // Body scroll lock for mobile menu or modal
  useEffect(() => {
    if (mobileMenuOpen || modalProductIdx !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    if (modalProductIdx !== null) {
      setTimeout(() => modalCloseRef.current?.focus(), 50);
    }
  }, [mobileMenuOpen, modalProductIdx]);

  // Escape key listener for modal and support panel
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalProductIdx(null);
        setSupportOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Auto-scroll support chat when messages update
  useEffect(() => {
    if (supportBodyRef.current) {
      supportBodyRef.current.scrollTop = supportBodyRef.current.scrollHeight;
    }
  }, [supportMessages, supportTyping, supportOpen]);

  // Scroll, Parallax, and Gear rotation
  useEffect(() => {
    let lastY = window.scrollY;
    let velocity = 0;
    let angle = 0;
    let rafId: number;

    const gears = Array.from(document.querySelectorAll<HTMLElement>('.gear[data-speed]'));
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));

    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      setShowBackTop(y > 600);
      setScrollProgress(h > 0 ? (y / h) * 100 : 0);
      velocity = y - lastY;
      lastY = y;
      parallaxEls.forEach((el) => {
        const factor = Number(el.dataset.parallax || 0);
        el.style.transform = `translateY(${y * factor}px)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const spinGears = () => {
      angle += 0.15 + Math.min(Math.abs(velocity) * 0.08, 4);
      velocity *= 0.9;
      gears.forEach((g) => {
        const speed = Number(g.dataset.speed || 1);
        g.style.transform = `rotate(${angle * speed}deg)`;
      });
      rafId = requestAnimationFrame(spinGears);
    };
    rafId = requestAnimationFrame(spinGears);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // IntersectionObserver for reveal animations and counters
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    const counterIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target as HTMLElement;
          const target = Number(el.dataset.target || 0);
          const dur = 1600;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = faNum(Math.round(target * ease));
            if (p < 1) requestAnimationFrame(tick);
          };
          tick(t0);
          counterIO.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );

    document.querySelectorAll('.counter').forEach((el) => counterIO.observe(el));

    return () => {
      io.disconnect();
      counterIO.disconnect();
    };
  }, []);

  // Custom Cursor
  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const cur = cursorRef.current;
    const ring = cursorRingRef.current;
    if (!cur || !ring) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest('a,button,[data-tilt],.filter-btn');
      ring.classList.toggle('hover', isInteractive);
    };

    const follow = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      rafId = requestAnimationFrame(follow);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    rafId = requestAnimationFrame(follow);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // 3D Tilt handlers for product cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-6px)`;
  };

  const handleCardMouseOut = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = '';
  };

  // Form submit handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isNameEmpty = !name.trim();
    const isPhoneEmpty = !phone.trim();
    setNameError(isNameEmpty);
    setPhoneError(isPhoneEmpty);

    if (isNameEmpty || isPhoneEmpty) {
      if (isNameEmpty) {
        nameInputRef.current?.focus();
      } else if (isPhoneEmpty) {
        phoneInputRef.current?.focus();
      }
      return;
    }

    setFormSubmitted(true);
  };

  // Interactive Support Q&A handler
  const QUICK_QUESTIONS = [
    {
      q: 'سفارش ساخت قطعه از روی نقشه یا نمونه',
      a: 'ما تمامی قطعات صنعتی، راه‌سازی و معدنی را دقیقاً از روی نقشه فنی یا نمونه قطعه شما با آلیاژ درخواستی (فولاد، چدن، برنز، آلومینیوم و استیل) طراحی و تولید می‌کنیم.',
      actionLabel: 'مشاوره با مهندس جعفری (طراح و ناظر فنی)',
      actionHref: 'tel:09138404250',
    },
    {
      q: 'شرایط ضمانت ۳ ساله ریخته‌گری چیست؟',
      a: 'تمامی خدمات ریخته‌گری و ساخت قطعات در شرکت صدرا فراز کریمان با متریال درجه یک انجام شده و دارای حداقل ۳ سال ضمانت‌نامه معتبر کتبی می‌باشد.',
      actionLabel: 'تماس با مدیرعامل (خانم ابراهیمی)',
      actionHref: 'tel:09131970877',
    },
    {
      q: 'تعمیر جک هیدرولیک و قطعات معدنی',
      a: 'تعمیر تخصصی انواع جک‌های هیدرولیکی، بالابر آنتنی، چکش هیدرولیکی، دسته‌مندل، رینگ، کرانویل و پینیون ماشین‌آلات راه‌سازی و معدنی با ضمانت انجام می‌شود.',
      actionLabel: 'تماس با مهندس محمدی (کارشناس فنی)',
      actionHref: 'tel:09162919139',
    },
    {
      q: 'برشکاری CNC و سخت‌کاری فولاد',
      a: 'برشکاری CNC ورق‌های فولادی در ضخامت‌های مختلف، ساخت انواع فلنج‌ها، و همچنین سخت‌کاری و عملیات حرارتی تخصصی قطعات برای مقاومت سایشی بالا انجام می‌گیرد.',
      actionLabel: 'ثبت درخواست در فرم استعلام',
      actionHref: '#contact-section',
    },
    {
      q: 'نحوه استعلام قیمت و زمان تحویل',
      a: 'برای دریافت قیمت دقیق و زمان تحویل، کافیست تصویر یا مشخصات قطعه را اعلام فرمایید تا تیم فنی در سریع‌ترین زمان بررسی و اعلام قیمت نماید.',
      actionLabel: 'رفتن به فرم استعلام قیمت',
      actionHref: '#contact-section',
    },
  ];

  const handleAskSupport = (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || supportTyping) return;

    const userMsgId = Date.now();
    setSupportMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: trimmed },
    ]);
    setSupportInput('');
    setSupportTyping(true);

    setTimeout(() => {
      const matchedPreset = QUICK_QUESTIONS.find((item) => item.q === trimmed);
      let replyText =
        'سوال شما دریافت شد. کارشناسان فنی ما آماده بررسی نقشه، نمونه قطعه و اعلام دقیق‌ترین قیمت و زمان تحویل به شما هستند.';
      let actionLabel = 'تماس مستقیم با واحد فنی';
      let actionHref = 'tel:09138404250';

      if (matchedPreset) {
        replyText = matchedPreset.a;
        actionLabel = matchedPreset.actionLabel;
        actionHref = matchedPreset.actionHref;
      } else if (/قیمت|هزینه|تعرفه|استعلام|چند/.test(trimmed)) {
        replyText =
          'قیمت‌گذاری بر اساس نوع آلیاژ، ابعاد، وزن قطعه و تیراژ ساخت یا نوع تعمیر محاسبه می‌شود. می‌توانید مشخصات را در فرم استعلام وارد کنید یا با مدیرعامل و واحد فنی تماس بگیرید.';
        actionLabel = 'تکمیل فرم استعلام قیمت';
        actionHref = '#contact-section';
      } else if (/ضمانت|گارانتی|کیفیت/.test(trimmed)) {
        replyText =
          'تمامی خدمات ساخت و تعمیر با متریال معتبر و ضمانت‌نامه تحویل می‌گردند و خدمات ریخته‌گری دارای حداقل ۳ سال ضمانت است.';
        actionLabel = 'تماس با خانم ابراهیمی (مدیرعامل)';
        actionHref = 'tel:09131970877';
      } else if (/جک|هیدرولیک|پمپ|سیلندر|چکش/.test(trimmed)) {
        replyText =
          'ساخت و تعمیر تخصصی انواع جک‌های هیدرولیکی، بالابر آنتنی، شفت و بوش چکش‌های هیدرولیکی و تامین لوازم یدکی با تضمین کیفیت انجام می‌شود.';
        actionLabel = 'تماس با مهندس محمدی (کارشناس فنی)';
        actionHref = 'tel:09162919139';
      } else if (/چرخ|دنده|کرانویل|پینیون|تراش|نقشه|برش|cnc/i.test(trimmed)) {
        replyText =
          'طراحی و ساخت انواع چرخ‌دنده، کرانویل، پینیون، شفت‌های هزارخاری و برشکاری CNC از روی نقشه یا نمونه قطعه زیر نظر طراح و ناظر فنی انجام می‌شود.';
        actionLabel = 'تماس با مهندس جعفری (طراح و ناظر فنی)';
        actionHref = 'tel:09138404250';
      }

      setSupportTyping(false);
      setSupportMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'support',
          text: replyText,
          actionLabel,
          actionHref,
        },
      ]);
    }, 380);
  };

  const selectedProduct = modalProductIdx !== null ? PRODUCTS[modalProductIdx] : null;

  return (
    <>
      {/* مکان‌نما و نوار پیشرفت */}
      <div className="cursor" ref={cursorRef} aria-hidden="true" />
      <div className="cursor-ring" ref={cursorRingRef} aria-hidden="true" />
      <div
        id="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* تعریف SVG لوگو (قابل استفاده مجدد) */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <symbol id="sk-logo" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#111" />
            {/* حرف S هندسی */}
            <path
              d="M44 22 H22 V50 H40 V62 H18"
              fill="none"
              stroke="#FFD500"
              strokeWidth="9"
              strokeLinejoin="miter"
            />
            {/* حرف K هندسی */}
            <path
              d="M56 20 V70 M56 46 L82 20 M58 46 L84 72"
              fill="none"
              stroke="#FFD500"
              strokeWidth="9"
              strokeLinecap="square"
            />
            {/* مثلث زرد گوشه پایین */}
            <path d="M0 100 L26 100 L0 74 Z" fill="#FFD500" />
          </symbol>
          <symbol id="gear-shape" viewBox="0 0 200 200">
            <path
              d="M100 10 l12 0 4 18 c6 2 12 4 17 7 l16-10 9 9-10 16 c3 5 5 11 7 17 l18 4 0 12-18 4 c-2 6-4 12-7 17 l10 16-9 9-16-10 c-5 3-11 5-17 7 l-4 18-12 0-4-18 c-6-2-12-4-17-7 l-16 10-9-9 10-16 c-3-5-5-11-7-17 l-18-4 0-12 18-4 c2-6 4-12 7-17 l-10-16 9-9 16 10 c5-3 11-5 17-7 z M100 60 a40 40 0 1 0 0.1 0 z"
              fillRule="evenodd"
            />
          </symbol>
        </defs>
      </svg>

      {/* ============ هدر ============ */}
      <header id="site-header" className={scrolled ? 'scrolled' : ''}>
        <div className="container">
          <a href="#hero-section" className="brand" aria-label="صدرا فراز کریمان">
            <svg width="46" height="46" aria-hidden="true">
              <use href="#sk-logo" />
            </svg>
            <span className="brand-text">
              <span className="en">SADRA FARAZ</span>
              <span className="en2">K A R I M A N</span>
              <span className="fa">شرکت خدماتی و فنی صدرا فراز کریمان</span>
            </span>
          </a>
          <nav
            id="main-nav"
            className={mobileMenuOpen ? 'open' : ''}
            aria-label="منوی اصلی"
          >
            <ul>
              <li>
                <a href="#about-section" onClick={() => setMobileMenuOpen(false)}>
                  درباره ما
                </a>
              </li>
              <li>
                <a href="#services-section" onClick={() => setMobileMenuOpen(false)}>
                  خدمات
                </a>
              </li>
              <li>
                <a href="#products-section" onClick={() => setMobileMenuOpen(false)}>
                  محصولات
                </a>
              </li>
              <li>
                <a href="#why-section" onClick={() => setMobileMenuOpen(false)}>
                  چرا ما
                </a>
              </li>
              <li>
                <a href="#process-section" onClick={() => setMobileMenuOpen(false)}>
                  فرایند کار
                </a>
              </li>
              <li>
                <a href="#contact-section" onClick={() => setMobileMenuOpen(false)}>
                  تماس
                </a>
              </li>
            </ul>
          </nav>
          <div className="header-actions">
            <button
              className="icon-btn"
              id="theme-toggle"
              aria-label="تغییر حالت تیره/روشن"
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? (
                <svg
                  id="icon-sun"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg
                  id="icon-moon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
              )}
            </button>
            <button
              className="icon-btn"
              id="hamburger"
              aria-label="باز کردن منو"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ============ هیرو (روشن و لایت با موشن گرافیک کارخانه) ============ */}
        <section id="hero-section">
          {/* پرتوهای متحرک کالیبراسیون و شبکه مهندسی پس‌زمینه */}
          <div className="hero-light-ambient" aria-hidden="true">
            <div className="hero-sun-glow" />
            <div className="hero-blueprint-glow" />
            <div className="hero-scan-line hero-scan-line-h" />
            <div className="hero-scan-line hero-scan-line-v" />
          </div>
          <div className="grid-bg" aria-hidden="true" />
          <div className="dots-bg" aria-hidden="true" />

          {/* چرخ‌دنده‌های محیطی متحرک با اسکرول */}
          <svg className="gear gear-1" data-speed="1" aria-hidden="true">
            <use href="#gear-shape" />
          </svg>
          <svg className="gear gear-2" data-speed="-1.6" aria-hidden="true">
            <use href="#gear-shape" />
          </svg>
          <svg className="gear gear-3" data-speed="-0.8" aria-hidden="true">
            <use href="#gear-shape" />
          </svg>
          <svg className="gear gear-4" data-speed="2.2" aria-hidden="true">
            <use href="#gear-shape" />
          </svg>

          <div className="container hero-inner">
            {/* ستون راست: محتوای متنی */}
            <div className="hero-content">
              <div className="hero-kicker hero-anim">
                <span className="hero-kicker-dot" />
                خدمات فنی و مهندسی صنعتی
              </div>
              <h1 className="hero-title hero-anim">
                شرکت خدماتی و فنی
                <br />
                <span>صدرا فراز کریمان</span>
              </h1>
              <div className="hero-sub-en hero-anim">SADRA FARAZ KARIMAN</div>
              <p className="hero-desc hero-anim">
                جوشکاری، تراشکاری، قطعه‌سازی و تعمیر قطعات ماشین‌آلات راه‌سازی و
                معدنی با تیم مجرب، متریال معتبر و ضمانت‌نامه.
              </p>
              <div className="hero-actions hero-anim">
                <a href="#products-section" className="btn btn-primary">
                  مشاهده محصولات
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </a>
                <a href="#contact-section" className="btn btn-ghost">
                  درخواست استعلام
                </a>
              </div>
              <div className="ribbons hero-anim">
                <span className="ribbon">تعهد</span>
                <span className="ribbon">دقت</span>
                <span className="ribbon">فناوری پیشرفته</span>
                <span className="ribbon">سرعت در ارائه خدمات</span>
              </div>
            </div>

            {/* ستون چپ: موشن گرافیک اختصاصی و دل‌نشین مجموعه ساختمان کارخانه SADRA FARAZ */}
            <div className="hero-motion-stage" data-parallax="0.08">
              <svg
                className="hero-factory-svg"
                viewBox="0 0 620 500"
                role="img"
                aria-label="موشن گرافیک اختصاصی کارخانه صدرا فراز کریمان (SADRA FARAZ) با دودکش‌های در حال دود کردن"
              >
                <defs>
                  {/* گرادیان‌های ملایم، روشن و دل‌نشین کارخانه */}
                  <radialGradient id="sf-sky-circle" cx="50%" cy="48%" r="50%">
                    <stop offset="0%" stopColor="#FFFDF4" />
                    <stop offset="65%" stopColor="#FFF7D6" />
                    <stop offset="100%" stopColor="#F1F5F9" stopOpacity="0" />
                  </radialGradient>

                  <linearGradient id="sf-sun-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFE55C" />
                    <stop offset="100%" stopColor="#FFD500" />
                  </linearGradient>

                  <linearGradient id="sf-wall-main" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#F1F5F9" />
                  </linearGradient>

                  <linearGradient id="sf-wall-side" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F8FAFC" />
                    <stop offset="100%" stopColor="#E2E8F0" />
                  </linearGradient>

                  <linearGradient id="sf-charcoal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#263244" />
                    <stop offset="100%" stopColor="#111827" />
                  </linearGradient>

                  <linearGradient id="sf-yellow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFE033" />
                    <stop offset="100%" stopColor="#F5B800" />
                  </linearGradient>

                  <linearGradient id="sf-window-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFF3B0" />
                    <stop offset="100%" stopColor="#FFD500" />
                  </linearGradient>

                  <linearGradient id="sf-smoke-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.75" />
                  </linearGradient>

                  <filter id="sf-drop-shadow" x="-12%" y="-12%" width="124%" height="128%">
                    <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#0F172A" floodOpacity="0.1" />
                  </filter>

                  <filter id="sf-sign-shadow" x="-15%" y="-15%" width="130%" height="140%">
                    <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.18" />
                  </filter>
                </defs>

                {/* ۱. هاله خورشیدی و آسمان روشن پشت کارخانه */}
                <circle cx="310" cy="250" r="220" fill="url(#sf-sky-circle)" />

                {/* خورشید گرم و کیوت در بالای کارخانه */}
                <g className="sf-sun-group">
                  <circle cx="485" cy="96" r="44" fill="#FFD500" opacity="0.18" className="sf-sun-halo" />
                  <circle cx="485" cy="96" r="30" fill="url(#sf-sun-grad)" />
                </g>

                {/* ابرهای نرم و متحرک آسمان */}
                <g className="sf-cloud sf-cloud-1" opacity="0.9">
                  <path
                    d="M110 120 H168 A14 14 0 0 0 168 92 A18 18 0 0 0 135 82 A15 15 0 0 0 110 95 A12.5 12.5 0 0 0 110 120 Z"
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth="2"
                  />
                </g>
                <g className="sf-cloud sf-cloud-2" opacity="0.85">
                  <path
                    d="M495 162 H542 A12 12 0 0 0 542 138 A15 15 0 0 0 515 130 A12 12 0 0 0 495 140 A11 11 0 0 0 495 162 Z"
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth="2"
                  />
                </g>

                {/* ۲. دودهای پفکی و کیوت در حال خارج شدن از دو دودکش کارخانه */}
                {/* دودهای دودکش سمت چپ (x=176, y=126) */}
                <g className="sf-smoke-stream">
                  <g className="sf-puff sf-puff-1" style={{ transformOrigin: '176px 115px' }}>
                    <circle cx="176" cy="112" r="14" fill="url(#sf-smoke-grad)" />
                    <circle cx="165" cy="115" r="10" fill="url(#sf-smoke-grad)" />
                    <circle cx="187" cy="115" r="10" fill="url(#sf-smoke-grad)" />
                  </g>
                  <g className="sf-puff sf-puff-2" style={{ transformOrigin: '176px 115px' }}>
                    <circle cx="174" cy="110" r="16" fill="url(#sf-smoke-grad)" />
                    <circle cx="161" cy="114" r="11" fill="url(#sf-smoke-grad)" />
                    <circle cx="186" cy="113" r="12" fill="url(#sf-smoke-grad)" />
                  </g>
                  <g className="sf-puff sf-puff-3" style={{ transformOrigin: '176px 115px' }}>
                    <circle cx="178" cy="112" r="15" fill="url(#sf-smoke-grad)" />
                    <circle cx="166" cy="116" r="11" fill="url(#sf-smoke-grad)" />
                    <circle cx="189" cy="116" r="10" fill="url(#sf-smoke-grad)" />
                  </g>
                </g>

                {/* دودهای دودکش سمت راست (x=232, y=104) */}
                <g className="sf-smoke-stream">
                  <g className="sf-puff sf-puff-4" style={{ transformOrigin: '232px 92px' }}>
                    <circle cx="232" cy="90" r="16" fill="url(#sf-smoke-grad)" />
                    <circle cx="219" cy="94" r="12" fill="url(#sf-smoke-grad)" />
                    <circle cx="245" cy="94" r="12" fill="url(#sf-smoke-grad)" />
                  </g>
                  <g className="sf-puff sf-puff-5" style={{ transformOrigin: '232px 92px' }}>
                    <circle cx="230" cy="88" r="18" fill="url(#sf-smoke-grad)" />
                    <circle cx="216" cy="93" r="13" fill="url(#sf-smoke-grad)" />
                    <circle cx="244" cy="92" r="13" fill="url(#sf-smoke-grad)" />
                  </g>
                  <g className="sf-puff sf-puff-6" style={{ transformOrigin: '232px 92px' }}>
                    <circle cx="234" cy="90" r="15" fill="url(#sf-smoke-grad)" />
                    <circle cx="221" cy="94" r="11" fill="url(#sf-smoke-grad)" />
                    <circle cx="246" cy="94" r="11" fill="url(#sf-smoke-grad)" />
                  </g>
                </g>

                {/* ۳. مجموعه ساختمان‌های کارخانه صدرا فراز (با سایه نرم یکپارچه) */}
                <g filter="url(#sf-drop-shadow)" className="sf-factory-complex">
                  {/* دودکش ۱ (کوتاه‌تر - سمت چپ) */}
                  <g>
                    <path
                      d="M162 240 L166 130 H186 L190 240 Z"
                      fill="#334155"
                      stroke="#111827"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <rect x="164" y="144" width="24" height="8" fill="#FFD500" />
                    <rect x="165" y="160" width="22" height="6" fill="#FFD500" />
                    <rect
                      x="160"
                      y="122"
                      width="32"
                      height="10"
                      rx="4"
                      fill="#111827"
                    />
                  </g>

                  {/* دودکش ۲ (بلندتر - سمت راست) */}
                  <g>
                    <path
                      d="M216 240 L221 108 H243 L248 240 Z"
                      fill="#1E293B"
                      stroke="#111827"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <rect x="219" y="124" width="26" height="9" fill="#FFD500" />
                    <rect x="220" y="142" width="24" height="6" fill="#FFD500" />
                    <rect
                      x="214"
                      y="99"
                      width="36"
                      height="11"
                      rx="4"
                      fill="#111827"
                    />
                  </g>

                  {/* ساختمان سمت چپ: برج سیلو و واحد ریخته‌گری */}
                  <g>
                    {/* گنبد بالای سیلو */}
                    <path
                      d="M94 246 C94 212 154 212 154 246 Z"
                      fill="url(#sf-yellow)"
                      stroke="#111827"
                      strokeWidth="2.5"
                    />
                    {/* بدنه سیلو */}
                    <rect
                      x="94"
                      y="242"
                      width="60"
                      height="168"
                      rx="6"
                      fill="url(#sf-wall-side)"
                      stroke="#111827"
                      strokeWidth="2.5"
                    />
                    {/* نوارهای صنعتی و پنجره‌های سیلو */}
                    <rect x="96" y="256" width="56" height="8" fill="#1E293B" />
                    <rect x="116" y="280" width="16" height="36" rx="8" fill="#334155" stroke="#111827" strokeWidth="2" />
                    <rect x="116" y="330" width="16" height="36" rx="8" fill="#334155" stroke="#111827" strokeWidth="2" />
                    {/* لوله اتصال سیلو به سوله اصلی */}
                    <path
                      d="M154 295 H172 V315 H154 Z"
                      fill="#FFD500"
                      stroke="#111827"
                      strokeWidth="2.5"
                    />
                  </g>

                  {/* ساختمان سمت راست: سوله دندانه‌دار تراشکاری و برشکاری CNC */}
                  <g>
                    {/* سقف دندانه‌دار کارخانه (Sawtooth Roof) */}
                    <polygon
                      points="386,258 430,218 430,258 474,218 474,258 520,218 520,258"
                      fill="url(#sf-charcoal)"
                      stroke="#111827"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {/* نوار زرد لبه سقف دندانه‌دار */}
                    <rect
                      x="386"
                      y="254"
                      width="136"
                      height="10"
                      fill="url(#sf-yellow)"
                      stroke="#111827"
                      strokeWidth="2.5"
                    />
                    {/* بدنه سوله سمت راست */}
                    <rect
                      x="386"
                      y="264"
                      width="136"
                      height="146"
                      fill="url(#sf-wall-side)"
                      stroke="#111827"
                      strokeWidth="2.5"
                    />
                    {/* فن/چرخ‌دنده تهویه چرخان روی نمای سوله راست */}
                    <circle
                      cx="454"
                      cy="304"
                      r="22"
                      fill="#1E293B"
                      stroke="#111827"
                      strokeWidth="2.5"
                    />
                    <g className="sf-fan-spin" style={{ transformOrigin: '454px 304px' }}>
                      <use
                        href="#gear-shape"
                        x="434"
                        y="284"
                        width="40"
                        height="40"
                        fill="#FFD500"
                      />
                      <circle cx="454" cy="304" r="6" fill="#1E293B" />
                    </g>
                    {/* پنجره‌های روشن سوله سمت راست */}
                    <rect
                      x="404"
                      y="342"
                      width="28"
                      height="40"
                      rx="6"
                      fill="url(#sf-window-glow)"
                      stroke="#111827"
                      strokeWidth="2.2"
                      className="sf-win-pulse"
                    />
                    <rect
                      x="440"
                      y="342"
                      width="28"
                      height="40"
                      rx="6"
                      fill="url(#sf-window-glow)"
                      stroke="#111827"
                      strokeWidth="2.2"
                      className="sf-win-pulse"
                    />
                    <rect
                      x="476"
                      y="342"
                      width="28"
                      height="40"
                      rx="6"
                      fill="url(#sf-window-glow)"
                      stroke="#111827"
                      strokeWidth="2.2"
                      className="sf-win-pulse"
                    />
                  </g>

                  {/* ساختمان مرکزی: سوله اصلی کارخانه با تابلوی بزرگ SADRA FARAZ */}
                  <g>
                    {/* پایه‌های فلزی نگهدارنده تابلوی بالای بام */}
                    <line x1="205" y1="186" x2="205" y2="216" stroke="#111827" strokeWidth="4" />
                    <line x1="355" y1="186" x2="355" y2="216" stroke="#111827" strokeWidth="4" />
                    <line x1="220" y1="186" x2="205" y2="212" stroke="#F5B800" strokeWidth="2.5" />
                    <line x1="340" y1="186" x2="355" y2="212" stroke="#F5B800" strokeWidth="2.5" />

                    {/* تابلوی اختصاصی بالای کارخانه: SADRA FARAZ */}
                    <g filter="url(#sf-sign-shadow)" className="sf-rooftop-sign">
                      <rect
                        x="164"
                        y="136"
                        width="232"
                        height="54"
                        rx="12"
                        fill="url(#sf-charcoal)"
                        stroke="#FFD500"
                        strokeWidth="3.5"
                      />
                      {/* پیچ‌های تزیینی چهار گوشه تابلو */}
                      <circle cx="174" cy="146" r="2.5" fill="#FFD500" />
                      <circle cx="386" cy="146" r="2.5" fill="#FFD500" />
                      <circle cx="174" cy="180" r="2.5" fill="#FFD500" />
                      <circle cx="386" cy="180" r="2.5" fill="#FFD500" />

                      {/* چرخ‌دنده کوچک چرخان کنار نام SADRA FARAZ */}
                      <g className="sf-sign-gear" style={{ transformOrigin: '194px 163px' }}>
                        <use
                          href="#gear-shape"
                          x="180"
                          y="149"
                          width="28"
                          height="28"
                          fill="#FFD500"
                        />
                        <circle cx="194" cy="163" r="5" fill="#111827" />
                      </g>

                      {/* نوشته اختصاصی SADRA FARAZ */}
                      <text
                        x="294"
                        y="165"
                        fill="#FFD500"
                        fontSize="21"
                        fontWeight="900"
                        fontFamily="Vazirmatn, Arial, sans-serif"
                        letterSpacing="1.8"
                        textAnchor="middle"
                      >
                        SADRA FARAZ
                      </text>
                      <text
                        x="294"
                        y="181"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="700"
                        fontFamily="Vazirmatn, Tahoma, sans-serif"
                        letterSpacing="0.5"
                        textAnchor="middle"
                        opacity="0.92"
                      >
                        صدرا فراز کریمان • KARIMAN
                      </text>
                    </g>

                    {/* سقف شیروانی پله‌ای سوله اصلی */}
                    <polygon
                      points="152,240 280,198 408,240"
                      fill="url(#sf-charcoal)"
                      stroke="#111827"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <polygon
                      points="164,240 280,205 396,240"
                      fill="url(#sf-yellow)"
                    />

                    {/* بدنه اصلی سوله مرکزی */}
                    <rect
                      x="162"
                      y="240"
                      width="236"
                      height="170"
                      fill="url(#sf-wall-main)"
                      stroke="#111827"
                      strokeWidth="2.5"
                    />

                    {/* نوار زرد و مشکی زیر سقف سوله اصلی */}
                    <rect
                      x="162"
                      y="240"
                      width="236"
                      height="12"
                      fill="#1E293B"
                      stroke="#111827"
                      strokeWidth="2"
                    />

                    {/* ردیف پنجره‌های قوسی بالای سوله مرکزی با نور گرم کارگاه */}
                    {[184, 236, 288, 340].map((wx, i) => (
                      <g key={i}>
                        <rect
                          x={wx}
                          y="266"
                          width="36"
                          height="44"
                          rx="18"
                          fill="url(#sf-window-glow)"
                          stroke="#111827"
                          strokeWidth="2.2"
                          className="sf-win-pulse"
                        />
                        {/* چهارچوب داخلی پنجره */}
                        <line
                          x1={wx + 18}
                          y1="266"
                          x2={wx + 18}
                          y2="310"
                          stroke="#111827"
                          strokeWidth="1.8"
                        />
                        <line
                          x1={wx}
                          y1="288"
                          x2={wx + 36}
                          y2="288"
                          stroke="#111827"
                          strokeWidth="1.8"
                        />
                      </g>
                    ))}

                    {/* دروازه صنعتی کرکره‌ای سوله اصلی و خروجی قطعات */}
                    <rect
                      x="220"
                      y="328"
                      width="120"
                      height="82"
                      rx="8"
                      fill="#1E293B"
                      stroke="#111827"
                      strokeWidth="2.5"
                    />
                    {/* قاب ایمنی زرد دور درب سوله */}
                    <path
                      d="M220 410 V334 Q220 326 228 326 H332 Q340 326 340 334 V410"
                      fill="none"
                      stroke="#FFD500"
                      strokeWidth="5"
                    />
                    {/* کرکره بالای دروازه */}
                    <rect x="226" y="332" width="108" height="8" fill="#334155" />
                    <rect x="226" y="344" width="108" height="8" fill="#475569" />

                    {/* نور گرم داخل کارگاه و قطعات در حال ساخت */}
                    <rect x="226" y="356" width="108" height="52" fill="#0F172A" />
                    <circle cx="280" cy="382" r="24" fill="#FFD500" opacity="0.22" className="sf-win-pulse" />

                    {/* چرخ‌دنده‌های طلایی تولیدشده در داخل درگاه کارخانه */}
                    <g className="sf-door-gear-1" style={{ transformOrigin: '262px 384px' }}>
                      <use href="#gear-shape" x="244" y="366" width="36" height="36" fill="#FFD500" />
                      <circle cx="262" cy="384" r="7" fill="#0F172A" />
                    </g>
                    <g className="sf-door-gear-2" style={{ transformOrigin: '298px 388px' }}>
                      <use href="#gear-shape" x="283" y="373" width="30" height="30" fill="#E2E8F0" />
                      <circle cx="298" cy="388" r="6" fill="#0F172A" />
                    </g>

                    {/* چراغ‌های کوچک دو طرف درب سوله */}
                    <circle cx="192" cy="352" r="7" fill="#FFD500" stroke="#111827" strokeWidth="2" />
                    <circle cx="368" cy="352" r="7" fill="#FFD500" stroke="#111827" strokeWidth="2" />
                  </g>

                  {/* ۴. درختچه‌های کیوت و سرسبز محوطه کارخانه */}
                  {/* درخت سمت چپ */}
                  <g className="sf-tree-sway" style={{ transformOrigin: '66px 410px' }}>
                    <rect x="62" y="388" width="8" height="22" rx="2" fill="#78350F" />
                    <circle cx="66" cy="368" r="22" fill="#22C55E" stroke="#111827" strokeWidth="2.2" />
                    <circle cx="56" cy="378" r="14" fill="#16A34A" stroke="#111827" strokeWidth="2" />
                    <circle cx="77" cy="378" r="14" fill="#4ADE80" stroke="#111827" strokeWidth="2" />
                  </g>

                  {/* درخت سمت راست */}
                  <g className="sf-tree-sway" style={{ transformOrigin: '554px 410px' }}>
                    <rect x="550" y="386" width="8" height="24" rx="2" fill="#78350F" />
                    <circle cx="554" cy="364" r="24" fill="#22C55E" stroke="#111827" strokeWidth="2.2" />
                    <circle cx="542" cy="376" r="15" fill="#16A34A" stroke="#111827" strokeWidth="2" />
                    <circle cx="566" cy="376" r="15" fill="#4ADE80" stroke="#111827" strokeWidth="2" />
                  </g>

                  {/* ۵. کامیونت صنعتی زرد کیوت حامل قطعه در محوطه کارخانه */}
                  <g className="sf-yard-truck">
                    {/* چرخ‌دنده بارِ کامیونت */}
                    <g style={{ transformOrigin: '140px 388px' }}>
                      <use href="#gear-shape" x="122" y="370" width="36" height="36" fill="#94A3B8" stroke="#111827" strokeWidth="1.5" />
                      <circle cx="140" cy="388" r="7" fill="#FFD500" />
                    </g>
                    {/* کفی و کابین کامیونت */}
                    <rect x="114" y="394" width="52" height="12" rx="4" fill="#1E293B" stroke="#111827" strokeWidth="2" />
                    <path
                      d="M164 374 H186 Q196 374 198 386 L200 406 H164 Z"
                      fill="url(#sf-yellow)"
                      stroke="#111827"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                    />
                    {/* شیشه کابین */}
                    <path d="M170 379 H185 L191 390 H170 Z" fill="#E0F2FE" stroke="#111827" strokeWidth="1.8" />
                    {/* چرخ‌های کامیونت */}
                    <circle cx="130" cy="408" r="9" fill="#111827" />
                    <circle cx="130" cy="408" r="4" fill="#FFD500" />
                    <circle cx="182" cy="408" r="9" fill="#111827" />
                    <circle cx="182" cy="408" r="4" fill="#FFD500" />
                  </g>

                  {/* ۶. زمین و جاده محوطه کارخانه */}
                  <rect
                    x="38"
                    y="410"
                    width="544"
                    height="18"
                    rx="9"
                    fill="#1E293B"
                    stroke="#111827"
                    strokeWidth="2.5"
                  />
                  <line
                    x1="64"
                    y1="419"
                    x2="556"
                    y2="419"
                    stroke="#FFD500"
                    strokeWidth="2.5"
                    strokeDasharray="16 14"
                  />
                </g>

                {/* سایه نرم زیر کل مجموعه کارخانه */}
                <ellipse cx="310" cy="442" rx="250" ry="10" fill="#0F172A" opacity="0.08" />
              </svg>
            </div>
          </div>
          <div className="scroll-hint" aria-hidden="true">
            اسکرول کنید
            <span />
          </div>
        </section>

        {/* ============ آمار ============ */}
        <section id="stats-section" aria-label="آمار شرکت">
          <div className="container">
            <div className="stats-grid">
              <div className="stat">
                <div className="num">
                  <span className="counter" data-target="6">
                    ۰
                  </span>
                  <small>+</small>
                </div>
                <div className="label">سال تجربه</div>
              </div>
              <div className="stat">
                <div className="num">
                  <span className="counter" data-target="17">
                    ۰
                  </span>
                </div>
                <div className="label">خدمت تخصصی</div>
              </div>
              <div className="stat">
                <div className="num">
                  <span className="counter" data-target="12">
                    ۰
                  </span>
                </div>
                <div className="label">گروه محصول</div>
              </div>
              <div className="stat">
                <div className="num">
                  <span className="counter" data-target="3">
                    ۰
                  </span>
                </div>
                <div className="label">سال ضمانت ریخته‌گری</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ درباره ما ============ */}
        <section id="about-section">
          <div className="container">
            <div className="section-head reveal">
              <span className="tag">درباره ما</span>
              <h2>
                فعالیت <em>۶ ساله</em> در امور فنی و مهندسی
              </h2>
              <p>تعهد، دقت، فناوری پیشرفته و سرعت در ارائه خدمات</p>
            </div>
            <div className="about-grid">
              <div className="about-text reveal">
                <p>
                  شرکت خدماتی و فنی <strong>صدرا فراز کریمان</strong> با فعالیت ۶
                  ساله در امور فنی مهندسی، جوشکاری، قطعه‌سازی، تعمیر قطعات و
                  تراشکاری، با بهره‌گیری از{' '}
                  <strong>تیم مجرب و متخصص در جوشکاری و تراشکاری صنعتی</strong>{' '}
                  آماده ارائه خدمات به صنایع، معادن و کارخانجات است.
                </p>
                <p>
                  تمامی کارها با استفاده از <strong>مصالح و متریال معتبر</strong>{' '}
                  انجام شده و همراه با <strong>ضمانت‌نامه</strong> تحویل می‌گردد.
                  از جمله فعالیت‌های تخصصی این مجموعه، تعمیر لوازم یدکی ماشین‌آلات
                  راه‌سازی و معدنی شامل رینگ، دسته‌مندل، جک‌ها و… است.
                </p>
                <div className="timeline">
                  <div className="tl-item">
                    <h4>شکل‌گیری تیم فنی</h4>
                    <p>گردآوری متخصصان جوشکاری و تراشکاری صنعتی</p>
                  </div>
                  <div className="tl-item">
                    <h4>توسعه خدمات قطعه‌سازی</h4>
                    <p>ساخت و تعمیر قطعات از روی نقشه یا نمونه با آلیاژ سفارشی</p>
                  </div>
                  <div className="tl-item">
                    <h4>همکاری با صنایع و معادن بزرگ</h4>
                    <p>ارائه خدمات به مجتمع‌های معدنی و شرکت‌های صنعتی</p>
                  </div>
                  <div className="tl-item">
                    <h4>امروز؛ ۶ سال تجربه</h4>
                    <p>ریخته‌گری با ضمانت حداقل ۳ سال و برشکاری CNC</p>
                  </div>
                </div>
                <div className="partners">
                  <h3>افتخار همکاری با</h3>
                  <div className="partner-badges">
                    <span className="partner-badge">مجتمع مس سرچشمه</span>
                    <span className="partner-badge">شرکت معدنی اولنگ</span>
                    <span className="partner-badge">کیان فرادید پارس</span>
                    <span className="partner-badge">ره آورد</span>
                    <span className="partner-badge">مهراب کویر (اصفهان)</span>
                    <span className="partner-badge">عمران صنعت اردهال (کاشان)</span>
                    <span className="partner-badge">و …</span>
                  </div>
                </div>
              </div>
              <div className="about-side reveal" data-delay="2">
                <figure className="about-photo-frame">
                  <div className="about-photo-main">
                    <img
                      src="/images/about-workshop.jpg"
                      alt="کارگاه تخصصی جوشکاری، تراشکاری و قطعه‌سازی صنعتی صدرا فراز کریمان"
                      loading="lazy"
                    />
                    <div className="about-photo-overlay" />
                    <div className="about-photo-badge">
                      <span className="badge-num">۶+</span>
                      <span className="badge-txt">
                        سال تخصص در ساخت و تعمیر
                        <small>همراه با ضمانت‌نامه کتبی</small>
                      </span>
                    </div>
                  </div>
                  <div className="about-photo-sub">
                    <img
                      src="/images/hero-factory.jpg"
                      alt="ریخته‌گری، برشکاری CNC و عملیات حرارتی قطعات معدنی"
                      loading="lazy"
                    />
                    <span>ریخته‌گری و برشکاری CNC</span>
                  </div>
                </figure>

                <aside className="about-card">
                  <h3>زمینه‌های فعالیت</h3>
                  <ul>
                    <li>امور فنی و مهندسی</li>
                    <li>جوشکاری صنعتی (آهن، چدن، آلومینیوم، استیل)</li>
                    <li>قطعه‌سازی از روی نقشه یا نمونه</li>
                    <li>تعمیر قطعات سنگین و لوازم یدکی</li>
                    <li>تراشکاری و ریخته‌گری</li>
                    <li>سخت‌کاری و عملیات حرارتی</li>
                    <li>برشکاری CNC ورق فولادی</li>
                    <li>تأمین قطعات راه‌سازی و معدنی</li>
                  </ul>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" aria-hidden="true" />

        {/* ============ خدمات ============ */}
        <section id="services-section">
          <div className="container">
            <div className="section-head reveal">
              <span className="tag">خدمات</span>
              <h2>
                <em>۱۷</em> خدمت تخصصی برای صنایع و معادن
              </h2>
              <p>از ساخت و تعمیر قطعات تا تأمین، صادرات و واردات</p>
            </div>
            <div className="services-grid" id="services-grid">
              {SERVICES.map((s, idx) => (
                <article
                  key={idx}
                  className="service-card reveal"
                  data-delay={String((idx % 4) + 1)}
                >
                  <span className="num">
                    {faNum(String(idx + 1).padStart(2, '0'))}
                  </span>
                  <div className="service-icon">
                    <SvgIcon name={s.i} />
                  </div>
                  <h3>{s.t}</h3>
                  {s.d && <p>{s.d}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ محصولات ============ */}
        <section id="products-section">
          <div className="container">
            <div className="section-head reveal">
              <span className="tag">کاتالوگ محصولات</span>
              <h2>
                محصولات <em>صدرا فراز کریمان</em>
              </h2>
              <p>با متریال درجه یک، قیمت مناسب و کیفیت مطلوب</p>
            </div>
            <div className="filters reveal" id="filters" role="tablist">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`filter-btn${activeCategory === c ? ' active' : ''}`}
                  data-cat={c}
                  role="tab"
                  onClick={() => setActiveCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="products-grid" id="products-grid">
              {PRODUCTS.map((p, idx) => {
                const show =
                  activeCategory === 'همه' || p.c === activeCategory;
                return (
                  <article
                    key={idx}
                    className={`product-card reveal in${!show ? ' hide' : ''}`}
                    data-tilt
                    data-cat={p.c}
                    data-idx={idx}
                    data-delay={String((idx % 4) + 1)}
                    tabIndex={0}
                    aria-label={p.n}
                    onMouseMove={handleCardMouseMove}
                    onMouseOut={handleCardMouseOut}
                    onClick={() => setModalProductIdx(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setModalProductIdx(idx);
                    }}
                  >
                    <div className="product-img">
                      <span className="ph-label">SK · {p.c}</span>
                      <SvgIcon name={p.i} />
                    </div>
                    <div className="product-body">
                      <div className="cat">{p.c}</div>
                      <h3>{p.n}</h3>
                      <p>با متریال درجه یک، قیمت مناسب و کیفیت مطلوب</p>
                      <span className="zoom">
                        <svg viewBox="0 0 24 24">
                          <circle cx="11" cy="11" r="7" />
                          <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
                        </svg>{' '}
                        مشاهده جزئیات
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <div className="divider" aria-hidden="true" />

        {/* ============ چرا ما ============ */}
        <section id="why-section">
          <div className="container">
            <div className="section-head reveal">
              <span className="tag">چرا ما؟</span>
              <h2>
                چهار اصل <em>صدرا فراز کریمان</em>
              </h2>
            </div>
            <div className="why-grid">
              <div className="why-card reveal" data-delay="1">
                <div className="why-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <h3>تعهد</h3>
                <p>تحویل کار با ضمانت‌نامه و متریال معتبر</p>
              </div>
              <div className="why-card reveal" data-delay="2">
                <div className="why-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="12" cy="12" r="1" />
                    <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                  </svg>
                </div>
                <h3>دقت</h3>
                <p>ساخت دقیق از روی نقشه یا نمونه</p>
              </div>
              <div className="why-card reveal" data-delay="3">
                <div className="why-icon">
                  <svg viewBox="0 0 24 24">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <path d="M9 9h6v6H9zM4 10h-2M4 14h-2M22 10h-2M22 14h-2M10 4V2M14 4V2M10 22v-2M14 22v-2" />
                  </svg>
                </div>
                <h3>فناوری پیشرفته</h3>
                <p>برشکاری CNC، سخت‌کاری و عملیات حرارتی</p>
              </div>
              <div className="why-card reveal" data-delay="4">
                <div className="why-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
                  </svg>
                </div>
                <h3>سرعت در ارائه خدمات</h3>
                <p>پاسخ‌گویی و اجرای سریع پروژه‌ها</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ فرایند کار ============ */}
        <section id="process-section">
          <div className="container">
            <div className="section-head reveal">
              <span className="tag">فرایند کار</span>
              <h2>
                از <em>نقشه</em> تا <em>تحویل با ضمانت</em>
              </h2>
            </div>
            <div className="process">
              <div className="step reveal" data-delay="1">
                <div className="step-badge">۱</div>
                <h3>ارسال نقشه / نمونه</h3>
                <p>نقشه فنی یا نمونه قطعه را برای ما ارسال کنید</p>
              </div>
              <div className="step reveal" data-delay="2">
                <div className="step-badge">۲</div>
                <h3>بررسی فنی</h3>
                <p>تحلیل متریال، آلیاژ و روش ساخت توسط طراح و ناظر فنی</p>
              </div>
              <div className="step reveal" data-delay="3">
                <div className="step-badge">۳</div>
                <h3>ساخت</h3>
                <p>تراشکاری، جوشکاری، ریخته‌گری یا برشکاری CNC</p>
              </div>
              <div className="step reveal" data-delay="4">
                <div className="step-badge">۴</div>
                <h3>کنترل کیفیت</h3>
                <p>بازرسی ابعادی و کیفی پیش از تحویل</p>
              </div>
              <div className="step reveal" data-delay="4">
                <div className="step-badge">۵</div>
                <h3>تحویل با ضمانت</h3>
                <p>تحویل قطعه همراه با ضمانت‌نامه</p>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" aria-hidden="true" />

        {/* ============ تماس ============ */}
        <section id="contact-section">
          <div className="container">
            <div className="section-head reveal">
              <span className="tag">تماس با ما</span>
              <h2>
                آماده <em>همکاری</em> با شما هستیم
              </h2>
              <p>برای استعلام قیمت و مشاوره فنی با ما در تماس باشید</p>
            </div>
            <div className="contact-grid">
              <div className="people reveal">
                <article className="person">
                  <div className="avatar" aria-hidden="true" title="مدیرعامل">
                    {/* آیکون اختصاصی مدیرعامل: کیف مدیریتی و نشان ستاره مدیریت ارشد */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="7" width="18" height="13" rx="2.5" />
                      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <path d="M3 12h18" />
                      <polygon points="12 9.5 12.9 11.3 14.9 11.6 13.4 13 13.8 15 12 14 10.2 15 10.6 13 9.1 11.6 11.1 11.3 12 9.5" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <div className="person-info">
                    <div className="role">مدیرعامل</div>
                    <div className="name">خانم ابراهیمی</div>
                  </div>
                  <div className="tels">
                    <a className="tel-btn" href="tel:09131970877">
                      <svg viewBox="0 0 24 24">
                        <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z" />
                      </svg>
                      ۰۹۱۳۱۹۷۰۸۷۷
                    </a>
                    <a className="tel-btn" href="tel:09137350644">
                      <svg viewBox="0 0 24 24">
                        <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z" />
                      </svg>
                      ۰۹۱۳۷۳۵۰۶۴۴
                    </a>
                  </div>
                </article>
                <article className="person">
                  <div className="avatar" aria-hidden="true" title="طراح و ناظر فنی">
                    {/* آیکون اختصاصی طراح و ناظر فنی: پرگار مهندسی، گونیا و نقشه فنی */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 3v0" />
                      <path d="M10.5 6.7L5 20" />
                      <path d="M13.5 6.7L19 20" />
                      <path d="M7 15h10" />
                      <path d="M12 12v5" />
                      <path d="M3 20h18" />
                    </svg>
                  </div>
                  <div className="person-info">
                    <div className="role">طراح و ناظر فنی</div>
                    <div className="name">آقای مهندس جعفری</div>
                  </div>
                  <div className="tels">
                    <a className="tel-btn" href="tel:09138404250">
                      <svg viewBox="0 0 24 24">
                        <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z" />
                      </svg>
                      ۰۹۱۳۸۴۰۴۲۵۰
                    </a>
                  </div>
                </article>
                <article className="person">
                  <div className="avatar" aria-hidden="true" title="کارشناس فنی">
                    {/* آیکون اختصاصی کارشناس فنی: کلاه ایمنی مهندسی و چرخ‌دنده صنعتی */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 14a8 8 0 0 1 16 0" />
                      <path d="M10 6v4" />
                      <path d="M14 6v4" />
                      <rect x="2" y="14" width="20" height="3" rx="1.5" />
                      <circle cx="12" cy="19.5" r="2" />
                      <path d="M12 17v0.5M12 21.5v0.5M9.5 19.5H10M14 19.5h0.5" />
                    </svg>
                  </div>
                  <div className="person-info">
                    <div className="role">کارشناس فنی</div>
                    <div className="name">آقای مهندس محمدی</div>
                  </div>
                  <div className="tels">
                    <a className="tel-btn" href="tel:09162919139">
                      <svg viewBox="0 0 24 24">
                        <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z" />
                      </svg>
                      ۰۹۱۶۲۹۱۹۱۳۹
                    </a>
                  </div>
                </article>
              </div>

              <form
                className="quote-form reveal"
                data-delay="2"
                id="quote-form"
                noValidate
                onSubmit={handleFormSubmit}
              >
                <h3>فرم درخواست استعلام</h3>
                <p>
                  این فرم نمایشی است و اطلاعات شما ذخیره نمی‌شود. لطفاً برای
                  استعلام با شماره‌های اعلام‌شده تماس بگیرید.
                </p>
                {!formSubmitted ? (
                  <div id="form-fields">
                    <div className="form-row">
                      <div className="field">
                        <label htmlFor="f-name">نام و نام خانوادگی</label>
                        <input
                          ref={nameInputRef}
                          id="f-name"
                          type="text"
                          placeholder="نام شما"
                          required
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (e.target.value.trim()) setNameError(false);
                          }}
                          style={nameError ? { borderColor: '#ff6b6b' } : undefined}
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="f-phone">شماره تماس</label>
                        <input
                          ref={phoneInputRef}
                          id="f-phone"
                          type="tel"
                          placeholder="۰۹…"
                          required
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (e.target.value.trim()) setPhoneError(false);
                          }}
                          style={phoneError ? { borderColor: '#ff6b6b' } : undefined}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="f-company">نام شرکت / مجموعه</label>
                      <input
                        id="f-company"
                        type="text"
                        placeholder="اختیاری"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="f-service">نوع خدمت</label>
                      <select
                        id="f-service"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                      >
                        <option>ساخت قطعه از روی نقشه یا نمونه</option>
                        <option>تعمیر قطعات سنگین</option>
                        <option>برشکاری CNC ورق فولادی</option>
                        <option>ریخته‌گری و تراشکاری</option>
                        <option>سخت‌کاری و عملیات حرارتی</option>
                        <option>تأمین قطعات راه‌سازی و معدنی</option>
                        <option>سایر</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="f-msg">توضیحات</label>
                      <textarea
                        id="f-msg"
                        placeholder="شرح قطعه، تعداد، متریال…"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      ارسال درخواست
                    </button>
                  </div>
                ) : (
                  <div className="form-success show" id="form-success">
                    <div className="check">✓</div>
                    <h3>ارسال شد</h3>
                    <p>
                      درخواست شما ثبت شد. کارشناسان ما با شما تماس خواهند گرفت.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ============ فوتر ============ */}
      <footer id="site-footer">
        <svg
          className="gear"
          style={{ width: '300px', height: '300px', bottom: '-120px', left: '-80px' }}
          aria-hidden="true"
        >
          <use href="#gear-shape" />
        </svg>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#hero-section" className="brand">
                <svg width="56" height="56" aria-hidden="true">
                  <use href="#sk-logo" />
                </svg>
                <span className="brand-text" style={{ color: '#fff' }}>
                  <span className="en" style={{ color: '#fff' }}>
                    SADRA FARAZ
                  </span>
                  <span className="en2">K A R I M A N</span>
                  <span className="fa" style={{ display: 'block' }}>
                    شرکت خدماتی و فنی صدرا فراز کریمان
                  </span>
                </span>
              </a>
              <p>
                جوشکاری، تراشکاری، قطعه‌سازی و تعمیر قطعات ماشین‌آلات راه‌سازی و
                معدنی با متریال درجه یک، قیمت مناسب و کیفیت مطلوب.
              </p>
              <div className="footer-ribbons" style={{ marginTop: '16px' }}>
                <span>تعهد</span>
                <span>دقت</span>
                <span>فناوری پیشرفته</span>
                <span>سرعت در ارائه خدمات</span>
              </div>
            </div>
            <div className="footer-col">
              <h4>دسترسی سریع</h4>
              <ul>
                <li>
                  <a href="#about-section">درباره ما</a>
                </li>
                <li>
                  <a href="#services-section">خدمات</a>
                </li>
                <li>
                  <a href="#products-section">محصولات</a>
                </li>
                <li>
                  <a href="#process-section">فرایند کار</a>
                </li>
                <li>
                  <a href="#contact-section">تماس با ما</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>اطلاعات ثبتی</h4>
              <ul className="footer-ids">
                <li>
                  <span>شناسه ملی</span>
                  <b>۱۴۰۱۰۴۷۲۱۸۳</b>
                </li>
                <li>
                  <span>شماره ثبت</span>
                  <b>۱۸۰۰۹</b>
                </li>
                <li>
                  <span>مدیرعامل</span>
                  <b>خانم ابراهیمی</b>
                </li>
                <li>
                  <span>طراح و ناظر فنی</span>
                  <b>مهندس جعفری</b>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © شرکت خدماتی و فنی صدرا فراز کریمان – کلیه حقوق محفوظ است.
            </span>
            <span style={{ direction: 'ltr', letterSpacing: '.2em' }}>
              SADRA FARAZ KARIMAN
            </span>
          </div>
        </div>
      </footer>

      {/* دکمه‌های شناور: پشتیبانی تعاملی و تماس مستقیم */}
      <div className="floating-actions-left">
        {/* دکمه شناور پشتیبانی و پرسش سوال */}
        <button
          type="button"
          id="floating-support"
          className={supportOpen ? 'active' : ''}
          aria-label="پشتیبانی آنلاین و پرسش سوال"
          aria-expanded={supportOpen}
          onClick={() => setSupportOpen((prev) => !prev)}
        >
          <span className="support-online-badge" aria-hidden="true" />
          <span className="floating-tooltip">پشتیبانی • سوالی دارید؟</span>
          {supportOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              <path d="M9.5 9.5a2.5 2.5 0 0 1 4.6 1.3c0 1.7-2.1 2.2-2.1 3.2" />
              <circle cx="12" cy="17" r="0.8" fill="currentColor" />
            </svg>
          )}
        </button>

        {/* دکمه شناور تماس مستقیم */}
        <a
          id="floating-call"
          href="tel:09131970877"
          aria-label="تماس مستقیم"
        >
          <span className="floating-tooltip">تماس مستقیم با شرکت</span>
          <svg viewBox="0 0 24 24">
            <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z" />
          </svg>
        </a>
      </div>

      {/* پنل تعاملی پشتیبانی و پرسش و پاسخ سریع */}
      <aside
        id="support-panel"
        className={supportOpen ? 'open' : ''}
        aria-label="پنل پشتیبانی آنلاین و پرسش سوال"
        aria-hidden={!supportOpen}
      >
        <div className="support-header">
          <div className="support-header-info">
            <div className="support-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
            <div>
              <h4>پشتیبانی صدرا فراز کریمان</h4>
              <div className="support-status">
                <span className="dot" />
                پاسخ‌گویی به سوالات فنی و سفارشات
              </div>
            </div>
          </div>
          <button
            type="button"
            className="support-close-btn"
            aria-label="بستن پنل پشتیبانی"
            onClick={() => setSupportOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="support-body" ref={supportBodyRef}>
          {supportMessages.map((msg) => (
            <div key={msg.id} className={`support-msg ${msg.sender}`}>
              <p>{msg.text}</p>
              {msg.actionLabel && msg.actionHref && (
                <a
                  href={msg.actionHref}
                  className="support-msg-action"
                  onClick={() => {
                    if (msg.actionHref?.startsWith('#')) {
                      setSupportOpen(false);
                    }
                  }}
                >
                  <span>{msg.actionLabel}</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </a>
              )}
            </div>
          ))}

          {supportTyping && (
            <div className="support-msg support typing" aria-label="در حال نوشتن پاسخ">
              <span />
              <span />
              <span />
            </div>
          )}

          <div className="support-quick-list">
            <div className="support-quick-title">سوالات پرتکرار (کلیک کنید):</div>
            <div className="support-chips">
              {QUICK_QUESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="support-chip"
                  onClick={() => handleAskSupport(item.q)}
                >
                  {item.q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* نوار ارتباط مستقیم با کارشناسان */}
        <div className="support-direct-bar">
          <a href="tel:09131970877" title="خانم ابراهیمی - مدیرعامل">
            <span>مدیرعامل</span>
            <b>۰۹۱۳۱۹۷۰۸۷۷</b>
          </a>
          <a href="tel:09138404250" title="مهندس جعفری - طراح و ناظر فنی">
            <span>طراح و ناظر فنی</span>
            <b>۰۹۱۳۸۴۰۴۲۵۰</b>
          </a>
          <a href="tel:09162919139" title="مهندس محمدی - کارشناس فنی">
            <span>کارشناس فنی</span>
            <b>۰۹۱۶۲۹۱۹۱۳۹</b>
          </a>
        </div>

        {/* فرم ارسال سوال */}
        <form
          className="support-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleAskSupport(supportInput);
          }}
        >
          <input
            type="text"
            placeholder="سوال خود را بنویسید…"
            value={supportInput}
            onChange={(e) => setSupportInput(e.target.value)}
            aria-label="متن سوال شما"
          />
          <button type="submit" aria-label="ارسال سوال" disabled={!supportInput.trim()}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </aside>
      <a
        id="back-top"
        className={`icon-btn${showBackTop ? ' show' : ''}`}
        href="#hero-section"
        aria-label="بازگشت به بالا"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </a>

      {/* مودال محصول */}
      <div
        id="product-modal"
        className={selectedProduct ? 'open' : ''}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) setModalProductIdx(null);
        }}
      >
        {selectedProduct && (
          <div className="modal-box">
            <div className="product-img modal-img" id="modal-img">
              <span className="ph-label">SK · {selectedProduct.c}</span>
              <SvgIcon name={selectedProduct.i} />
            </div>
            <div className="modal-body">
              <button
                ref={modalCloseRef}
                className="icon-btn"
                id="modal-close"
                aria-label="بستن"
                onClick={() => setModalProductIdx(null)}
              >
                ✕
              </button>
              <div className="cat" id="modal-cat">
                {selectedProduct.c}
              </div>
              <h3 id="modal-title">{selectedProduct.n}</h3>
              <p id="modal-desc">{selectedProduct.d}</p>
              <ul>
                <li>متریال درجه یک</li>
                <li>قیمت مناسب</li>
                <li>کیفیت مطلوب</li>
                <li>ساخت از روی نقشه یا نمونه</li>
              </ul>
              <a
                href="#contact-section"
                className="btn btn-primary"
                style={{ marginTop: '22px' }}
                id="modal-cta"
                onClick={() => setModalProductIdx(null)}
              >
                درخواست استعلام
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

