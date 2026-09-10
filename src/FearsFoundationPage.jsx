/**
 * =============================================================================
 * THE FEARS FOUNDATION - biography & scholarship portfolio
 * Dr. Constance Y. Fears, JD, PhD
 * =============================================================================
 *
 * Surface archetype: DECIDE / LEARN (one idea per section; a hero is correct)
 * Aesthetic: high-end luxury tech × academic prestige
 * Canvas: #0B0F19 / #0F172A Accent: #581C87 / #6B21A8 (ambient only)
 * Geometry: max 4px radius, hairline borders, 8-point spacing rhythm
 *
 * Module map (single-file by design - each block is independently extractable):
 * § 1 Design constants & content model (all copy sourced from client material)
 * § 2 Hooks (scroll state, active section, scroll util)
 * § 3 Composition primitives (Eyebrow, SectionHeading, Tag, CTA, Glow)
 * § 4 Global navigation (sticky + backdrop-blur + mobile drawer)
 * § 5 Profile hero (split-screen, credential rail)
 * § 6 The Polymath Timeline (3-track responsive rail grid)
 * § 7 The Fears Foundation Hub (3-card portfolio + impact sub-widget)
 * § 8 Personal footer block (community presence, advocate interests)
 * § 9 Page composition (section shells, skip link, ARIA wiring)
 *
 * Every string below maps directly to the supplied client raw material. No
 * invented metrics, no placeholder logic, no unstyled defaults.
 * =============================================================================
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/* ==========================================================================
 § 1 - DESIGN CONSTANTS & CONTENT MODEL
 ========================================================================== */

/** Height of the sticky masthead, in px - used to offset in-page anchor scrolls. */
const NAV_OFFSET_PX = 76;

/** Single source of truth for navigation + the IntersectionObserver watch list. */
const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'scholarships', label: 'Scholarships' },
  { id: 'apply', label: 'Apply' },
];

/** The six disciplines that define the brief: JD · PhD · Scientist · Attorney · Entrepreneur · Educator */
const CREDENTIAL_MARKS = ['JD', 'PhD', 'Scientist', 'Attorney', 'Entrepreneur', 'Educator'];

const HERO_STATS = [
  {
    value: '20+',
    label: 'Years in practice',
    detail: 'Science, law, manufacturing & regulatory compliance',
  },
  {
    value: '06',
    label: 'Scholarship programs',
    detail: 'From K–12 students through graduate law study',
  },
  {
    value: '04',
    label: 'Degrees earned',
    detail: 'B.S. · Ph.D. · J.D. · Graduate Diploma in Law',
  },
];

const ACADEMIC_CREDENTIALS = [
  {
    degree: 'B.S., Biological Sciences',
    institution: 'Florida State University',
  },
  {
    degree: 'Ph.D., Cell & Molecular Biology',
    institution: 'University of Alabama at Birmingham, School of Medicine',
    note: 'Concentration in Cancer Biology',
  },
  {
    degree: 'Juris Doctor',
    institution: 'University of Texas School of Law',
  },
  {
    degree: 'Graduate Diploma, International & French Law',
    institution: 'Université Jean Moulin III, Lyon, France',
  },
];

const PRACTICE_SNAPSHOT = [
  { role: 'Certified U.S. FDA Drug Investigator', meta: 'Federal regulatory service' },
  { role: 'CEO & Principal Consultant', meta: 'Polymath Regulatory Consultants, LLC' },
  { role: 'Adjunct Regulatory Professor', meta: 'Morehouse School of Medicine' },
  { role: 'Global subject-matter expert', meta: 'cGMP & quality systems' },
];

const TIMELINE_TRACKS = [
  {
    id: 'science',
    index: '01',
    name: 'Science',
    summary: 'From the bench to the federal regulator',
    entries: [
      {
        title: 'B.S., Biological Sciences',
        org: 'Florida State University',
        note: 'The start of a lifelong commitment to learning and achievement.',
      },
      {
        title: 'Ph.D., Cell & Molecular Biology',
        org: 'University of Alabama at Birmingham, School of Medicine',
        note: 'Concentration in Cancer Biology.',
      },
      {
        title: 'Postdoctoral Research Fellow',
        org: 'Molecular Biology',
      },
      {
        title: 'Certified U.S. FDA Drug Investigator',
        org: 'Federal government service',
      },
      {
        title: 'Published Researcher',
        org: 'Biochemistry · Cancer research · Molecular biology',
      },
    ],
  },
  {
    id: 'law',
    index: '02',
    name: 'Law',
    summary: 'Jurisprudence applied to regulated industry',
    entries: [
      {
        title: 'Juris Doctor',
        org: 'University of Texas School of Law',
      },
      {
        title: 'Graduate Diploma, International & French Law',
        org: 'Université Jean Moulin III, Lyon, France',
      },
      {
        title: 'Regulatory & Compliance Practice',
        org: 'Pharmaceuticals · APIs · Vaccines · Advanced therapies · Medical devices',
        note: 'Translating legal frameworks into manufacturing-grade quality systems.',
      },
    ],
  },
  {
    id: 'industry',
    index: '03',
    name: 'Industry & Academia',
    summary: 'Compliance leadership, teaching, and enterprise',
    entries: [
      {
        title: 'CEO & Principal Consultant',
        org: 'Polymath Regulatory Consultants, LLC',
        note: 'Two decades of scientific, legal, manufacturing & regulatory experience, applied to complex quality and compliance challenges.',
      },
      {
        title: 'Senior Quality Compliance Leader',
        org: "One of the world's largest pharmaceutical manufacturers",
      },
      {
        title: 'Global Subject-Matter Expert',
        org: 'Current Good Manufacturing Practices & quality systems',
      },
      {
        title: 'Adjunct Regulatory Professor',
        org: 'Morehouse School of Medicine',
        note: 'Regulatory and medical-device topics for students and industry professionals.',
      },
      {
        title: 'Conference Presenter',
        org: 'American Society for Quality',
      },
    ],
  },
];

const SCHOLARSHIP_CARDS = [
  {
    id: 'stem',
    index: '01',
    kicker: 'STEM Hub',
    title: 'STEM Scholarships',
    description:
      'Three university partnerships supporting students pursuing science, technology, engineering, mathematics, and related fields.',
    awards: [
      {
        name: 'Dr. Constance Y. Fears STEM Scholarship',
        institution: 'Florida State University',
      },
      {
        name: 'Dr. Constance Y. Fears STEM Scholarship',
        institution: 'University of Alabama at Birmingham',
      },
      {
        name: 'Dr. Constance Y. Fears STEM Scholarship',
        institution: 'Middle Georgia State University',
      },
    ],
    cta: { label: 'Apply Now', href: '#scholarship-portal' },
  },
  {
    id: 'law',
    index: '02',
    kicker: 'Higher Ed & Law Hub',
    title: 'Higher Education & Law',
    description:
      'Endowed support for undergraduate, graduate, and law students, named in honor of family and legal mentors.',
    awards: [
      {
        name: 'Ronya L. Fears Scholarship',
        institution: 'Auburn University',
      },
      {
        name: 'Rita D. Hood, Esq. Scholarship',
        institution: 'Law Students',
      },
    ],
    cta: { label: 'Learn Requirements', href: '#scholarship-portal' },
  },
  {
    id: 'k12',
    index: '03',
    kicker: 'K–12 & Community Impact',
    title: 'K–12 & Community Impact',
    description:
      'Early-stage support that reduces financial barriers for students before college, widening the range of career paths they can reach.',
    awards: [
      {
        name: 'Dr. Constance Y. Fears Scholarship',
        institution: 'K–12 Students',
      },
    ],
    impact: {
      heading: '2023 Recipient Fields',
      fields: ['Respiratory Therapy', 'Nursing', 'Aviation Science & Management'],
    },
    cta: { label: 'Apply Now', href: '#scholarship-portal' },
  },
];

const FOOTER_COMMUNITY = [
  { name: 'Alpharetta Chamber of Commerce', note: 'Metro Atlanta business community' },
  { name: 'Women in Manufacturing', note: 'Advocacy & professional membership' },
  { name: 'Parenteral Drug Association', note: 'Professional membership' },
  { name: 'American Society for Quality', note: 'Conference presenter' },
];

const FOOTER_INTERESTS = [
  'Mentoring',
  'Teaching',
  'Public speaking',
  'International travel',
  'All things deep-fried',
];

const FOOTER_ADVOCACY = ['STEM education', 'Environmental conservation', 'Human rights'];

/* Decorative precision grid - hairline blueprint texture, never interactive. */
const GRID_TEXTURE = {
  backgroundImage:
    'linear-gradient(to right, rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.07) 1px, transparent 1px)',
  backgroundSize: '72px 72px',
  maskImage: 'radial-gradient(72% 62% at 50% 0%, #000 0%, rgba(0,0,0,0.35) 55%, transparent 100%)',
  WebkitMaskImage:
    'radial-gradient(72% 62% at 50% 0%, #000 0%, rgba(0,0,0,0.35) 55%, transparent 100%)',
};

/* ==========================================================================
 § 2 - HOOKS
 ========================================================================== */

/** True once the viewport has scrolled past `threshold` - drives masthead elevation. */
function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}

/**
 * Tracks which section currently owns the reading position.
 * Uses the widest intersecting ratio inside a centred band, so it stays stable
 * on short sections and never flickers between two neighbours.
 */
function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0] ?? null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (nodes.length === 0) return undefined;

    const visible = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        });

        if (visible.size === 0) return;

        let winner = null;
        let bestRatio = -1;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            winner = id;
          }
        });

        if (winner) setActiveId(winner);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.5, 0.8, 1] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

/** Closes a floating layer (mobile drawer) on Escape. */
function useEscapeToClose(open, onClose) {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);
}

/**
 * Offset-aware in-page scroll that respects `prefers-reduced-motion`
 * and keeps the URL hash in sync without a native jump.
 */
function scrollToSection(id) {
  if (typeof window === 'undefined') return;

  const target = document.getElementById(id);
  if (!target) return;

  const prefersReduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET_PX;

  window.scrollTo({ top: Math.max(top, 0), behavior: prefersReduced ? 'auto' : 'smooth' });

  if (window.history?.replaceState) {
    window.history.replaceState(null, '', `#${id}`);
  }
}

/* ==========================================================================
 § 3 - COMPOSITION PRIMITIVES
 ========================================================================== */

/** Hairline eyebrow label - gradient rule + tracked uppercase micro-type. */
function Eyebrow({ children, className = '', tone = 'muted' }) {
  const tones = {
    muted: 'text-muted',
    plum: 'text-plum-glow/90',
    silver: 'text-silver',
  };

  return (
    <p className={`rule-label ${tones[tone] ?? tones.muted} ${className}`}>
      <span>{children}</span>
    </p>
  );
}

/** Section heading block: eyebrow + display headline + optional lede. Locks the type hierarchy. */
function SectionHeading({ eyebrow, title, accent, lede, id, align = 'left' }) {
  return (
    <header
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}
      aria-labelledby={id}
    >
      {eyebrow ? (
        <Eyebrow className={align === 'center' ? 'justify-center' : ''}>{eyebrow}</Eyebrow>
      ) : null}

      <h2
        id={id}
        className="mt-5 text-balance text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]"
      >
        {title}
        {accent ? (
          <>
            {' '}
            <span className="font-display italic font-normal text-white/70">{accent}</span>
          </>
        ) : null}
      </h2>

      {lede ? (
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-silver sm:text-base">
          {lede}
        </p>
      ) : null}
    </header>
  );
}

/** Sharp-cornered tag - used for credential marks and interest chips. */
function Tag({ children, tone = 'neutral', className = '' }) {
  const tones = {
    neutral: 'border-white/10 bg-white/[0.03] text-silver',
    plum: 'border-plum-glow/25 bg-plum/[0.12] text-white/90',
  };

  return (
    <span
      className={`inline-flex items-center rounded-sharp border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${
        tones[tone] ?? tones.neutral
      } ${className}`}
    >
      {children}
    </span>
  );
}

const CTA_BASE =
  'group inline-flex items-center justify-center gap-2 rounded-sharp text-[13px] font-semibold tracking-tight transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';

/* Colour/border treatments - padding lives in CTA_SIZES so sizes never collide. */
const CTA_VARIANTS = {
  /* Highest contrast - reserved for portal entry */
  solid: 'bg-white text-canvas hover:bg-slate-200',
  /* Restrained secondary */
  outline: 'border border-white/15 text-white hover:border-plum-glow/60 hover:bg-plum/10',
  /* Card-level action: full width, sharp, ambient plum on hover. Border and fill
     sit a step above the card surface so the control still reads as a button on
     small screens, where value contrast is lowest. */
  card: 'w-full border border-white/[0.18] bg-white/[0.06] text-white hover:border-plum-glow/60 hover:bg-plum/25',
  /* Ambient portal bar */
  portal: 'border border-plum-glow/40 bg-plum-light/90 text-white hover:bg-plum-light',
};

/* One padding decision per control height. */
const CTA_SIZES = {
  sm: 'px-4 py-2.5',
  md: 'px-5 py-3',
  lg: 'px-5 py-3.5',
};

/** Forward arrow glyph - transform-only motion, disabled under reduced-motion by CSS. */
function ArrowGlyph() {
  return (
    <span
      aria-hidden="true"
      className="transition-transform duration-200 group-hover:translate-x-0.5"
    >
      →
    </span>
  );
}

/** Ambient purple bloom. Decorative only - always aria-hidden, never a layout node. */
function PlumGlow({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-sharp bg-plum/25 blur-[120px] ${className}`}
    />
  );
}

/* ==========================================================================
 § 4 - GLOBAL NAVIGATION
 ========================================================================== */

function FearsMark({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-sharp border border-plum-glow/35 bg-gradient-to-br from-plum-light/45 to-transparent font-mono text-[11px] font-medium tracking-tight text-white ${className}`}
    >
      FF
    </span>
  );
}

function Navbar({ activeId }) {
  const scrolled = useScrolled(12);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEscapeToClose(menuOpen, closeMenu);

  /* Dismiss the drawer on outside click or when the viewport reaches desktop width. */
  useEffect(() => {
    if (!menuOpen) return undefined;

    const onPointerDown = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) closeMenu();
    };
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const onDesktop = (event) => {
      if (event.matches) closeMenu();
    };

    document.addEventListener('pointerdown', onPointerDown);
    desktopQuery.addEventListener?.('change', onDesktop);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      desktopQuery.removeEventListener?.('change', onDesktop);
    };
  }, [menuOpen, closeMenu]);

  const handleNavClick = (event, id) => {
    event.preventDefault();
    closeMenu();
    scrollToSection(id);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? 'border-white/[0.08] bg-canvas/80 backdrop-blur-xl supports-[backdrop-filter]:bg-canvas/65'
          : 'border-transparent bg-canvas/55 backdrop-blur-lg supports-[backdrop-filter]:bg-canvas/40'
      }`}
    >
      <nav
        ref={navRef}
        aria-label="Primary"
        className="shell flex h-[68px] items-center justify-between gap-6 lg:h-[76px]"
      >
        {/* Wordmark */}
        <a
          href="#about"
          onClick={(event) => handleNavClick(event, 'about')}
          className="flex items-center gap-3 rounded-sharp"
          aria-label="The Fears Foundation home"
        >
          <FearsMark />
          <span className="flex flex-col leading-none">
            <span className="text-[11px] font-semibold uppercase tracking-eyebrow text-white sm:text-[12px]">
              The Fears Foundation
            </span>
            <span className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:block">
              Constance Y. Fears, JD, PhD
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(event) => handleNavClick(event, link.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative rounded-sharp px-3 py-2 text-[13px] font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-silver hover:text-white'
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-plum-glow to-plum-light transition-opacity duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop portal action */}
        <div className="hidden items-center gap-3 lg:flex">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted xl:block">
            Scholarships open
          </span>
          <a
            href="#apply"
            onClick={(event) => handleNavClick(event, 'apply')}
            className={`${CTA_BASE} ${CTA_VARIANTS.solid} ${CTA_SIZES.sm}`}
          >
            Scholar Portal
            <ArrowGlyph />
          </a>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-sharp border border-white/[0.12] text-white transition-colors duration-200 hover:border-plum-glow/50 hover:bg-plum/10 lg:hidden"
        >
          <span aria-hidden="true" className="relative block h-3 w-4">
            <span
              className={`absolute left-0 block h-px w-4 bg-current transition-transform duration-200 ${
                menuOpen ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-px w-4 bg-current transition-opacity duration-200 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-4 bg-current transition-transform duration-200 ${
                menuOpen ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile drawer - grid-rows transition avoids max-height layout hacks */}
      <div
        id="mobile-nav-drawer"
        className={`grid overflow-hidden border-t border-white/[0.06] bg-canvas/95 backdrop-blur-xl transition-[grid-template-rows,opacity] duration-300 lg:hidden ${
          menuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0">
          <ul className="shell flex flex-col divide-y divide-white/[0.06] py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(event) => handleNavClick(event, link.id)}
                  aria-current={activeId === link.id ? 'true' : undefined}
                  tabIndex={menuOpen ? 0 : -1}
                  className={`flex items-center justify-between py-3.5 text-sm font-medium transition-colors ${
                    activeId === link.id ? 'text-white' : 'text-silver hover:text-white'
                  }`}
                >
                  {link.label}
                  <span aria-hidden="true" className="font-mono text-[10px] text-muted">
                    {activeId === link.id ? '●' : '○'}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="shell pb-5 pt-1">
            <a
              href="#apply"
              onClick={(event) => handleNavClick(event, 'apply')}
              tabIndex={menuOpen ? 0 : -1}
              className={`${CTA_BASE} ${CTA_VARIANTS.solid} ${CTA_SIZES.md} w-full`}
            >
              Scholar Portal
              <ArrowGlyph />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ==========================================================================
 § 5 - PROFILE HERO
 ========================================================================== */

function CredentialRail() {
  return (
    <div className="relative overflow-hidden rounded-card border border-white/[0.08] bg-surface/70 p-6 shadow-card sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-plum-glow/45 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-sharp bg-plum/25 blur-[90px]"
      />

      {/* Academic credentials */}
      <section aria-labelledby="credentials-heading">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="credentials-heading"
            className="text-[11px] font-semibold uppercase tracking-eyebrow text-white"
          >
            Academic Credentials
          </h2>
          <span className="font-mono text-[10px] tracking-[0.18em] text-muted">04</span>
        </div>

        <ul className="mt-5 divide-y divide-white/[0.06] border-t border-white/[0.06]">
          {ACADEMIC_CREDENTIALS.map((item, index) => (
            <li key={item.degree} className="group flex gap-4 py-4">
              <span
                aria-hidden="true"
                className="mt-1 font-mono text-[10px] tabular-nums text-muted transition-colors group-hover:text-plum-glow"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-medium leading-snug text-white">{item.degree}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-silver">{item.institution}</p>
                {item.note ? (
                  <p className="mt-1.5 text-[11px] uppercase tracking-[0.12em] text-muted">
                    {item.note}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Practice snapshot */}
      <section
        aria-labelledby="snapshot-heading"
        className="mt-7 border-t border-white/[0.06] pt-6"
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="snapshot-heading"
            className="text-[11px] font-semibold uppercase tracking-eyebrow text-white"
          >
            Practice Snapshot
          </h2>
          <span className="font-mono text-[10px] tracking-[0.18em] text-muted">04</span>
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-sharp border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2">
          {PRACTICE_SNAPSHOT.map((item) => (
            <div key={item.role} className="bg-canvas/80 p-4">
              <dt className="text-[12.5px] font-medium leading-snug text-white">{item.role}</dt>
              <dd className="mt-1.5 text-[11px] uppercase tracking-[0.12em] text-muted">
                {item.meta}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function ProfileHero() {
  return (
    <section
      id="about"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-white/[0.06] pb-20 pt-16 sm:pt-20 lg:pb-28 lg:pt-24"
    >
      {/* Ambient layers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={GRID_TEXTURE}
      />
      <PlumGlow className="-top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 opacity-60" />
      <PlumGlow className="-right-24 top-24 h-[420px] w-[420px] opacity-30" />

      <div className="shell relative">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-16">
          {/* ---- Left: narrative column ---- */}
          <div className="lg:col-span-7 xl:col-span-7">
            <Eyebrow tone="plum">The Fears Foundation · Atlanta, Georgia</Eyebrow>

            <h1
              id="hero-heading"
              /* Fluid ramp: holds at 2.05rem on a 320px phone, scales to the 4.25rem
 desktop cap by ~790px, so no breakpoint ever clips the name. */
              className="mt-6 text-[clamp(2.05rem,8.6vw,4.25rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-white"
            >
              Dr. Constance
              <br className="hidden sm:block" /> Y.{' '}
              <span className="font-display italic font-normal">Fears</span>
              <span className="mt-3 block font-mono text-[13px] font-normal uppercase tracking-[0.24em] text-silver/80 sm:text-sm">
                JD · PhD
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-[15.5px] leading-[1.75] text-silver sm:text-[17px]">
              A scientist, attorney, educator, entrepreneur, mentor, and advocate for expanding
              access to education, with an interdisciplinary career spanning science, law, higher
              education, pharmaceutical manufacturing, regulatory compliance, and entrepreneurship.
            </p>

            <p className="mt-4 max-w-2xl text-[14px] leading-[1.75] text-muted">
              A native of Birmingham, Alabama, Dr. Fears has built her career on a lifelong
              commitment to learning, and now on removing the barriers that stand between students
              and their own ambitions.
            </p>

            {/* Credential marks */}
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Professional disciplines">
              {CREDENTIAL_MARKS.map((mark) => (
                <li key={mark}>
                  <Tag tone={mark === 'JD' || mark === 'PhD' ? 'plum' : 'neutral'}>{mark}</Tag>
                </li>
              ))}
            </ul>

            {/* Primary path */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#scholarships"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection('scholarships');
                }}
                className={`${CTA_BASE} ${CTA_VARIANTS.solid} ${CTA_SIZES.lg} w-full sm:w-auto`}
              >
                View the Scholarship Portfolio
                <ArrowGlyph />
              </a>
              <a
                href="#timeline"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection('timeline');
                }}
                className={`${CTA_BASE} ${CTA_VARIANTS.outline} ${CTA_SIZES.lg} w-full sm:w-auto`}
              >
                Explore Her Timeline
              </a>
            </div>

            {/* Verified figures drawn from the record */}
            <dl className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-white/[0.08] bg-white/[0.06] sm:grid-cols-3">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="bg-surface/80 p-5">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-4xl leading-none text-white">
                      {stat.value}
                    </span>
                    <span className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                      {stat.label}
                    </span>
                    <span className="mt-2 block text-[12px] leading-relaxed text-muted">
                      {stat.detail}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ---- Right: credential rail (split-screen) ---- */}
          <div className="lg:col-span-5 lg:border-l lg:border-white/[0.06] lg:pl-16 xl:col-span-5">
            <CredentialRail />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 § 6 - THE POLYMATH TIMELINE
 ========================================================================== */

function TimelineTrack({ track }) {
  return (
    <article
      aria-labelledby={`track-${track.id}`}
      className="flex h-full flex-col border-t border-white/[0.08] pt-7 lg:border-t-0 lg:border-l lg:border-white/[0.06] lg:pl-8 lg:pt-0 lg:first:border-l-0 lg:first:pl-0"
    >
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] tracking-[0.18em] text-plum-glow">
          {track.index}
        </span>
        <h3
          id={`track-${track.id}`}
          className="text-[15px] font-semibold uppercase tracking-[0.14em] text-white"
        >
          {track.name}
        </h3>
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{track.summary}</p>

      <ol className="relative mt-8 space-y-7 border-l border-white/[0.08] pl-6">
        {track.entries.map((entry, index) => (
          <li key={`${track.id}-${entry.title}-${index}`} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[29px] top-1.5 block h-[9px] w-[9px] rounded-sharp border border-plum-glow/60 bg-plum-light/80 animate-pulse-node"
            />
            <p className="text-[14px] font-medium leading-snug text-white">{entry.title}</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-silver">{entry.org}</p>
            {entry.note ? (
              <p className="mt-2 text-[12px] leading-relaxed text-muted">{entry.note}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </article>
  );
}

function PolymathTimeline() {
  return (
    <section
      id="timeline"
      aria-labelledby="timeline-heading"
      className="relative scroll-mt-24 overflow-hidden border-b border-white/[0.06] py-20 lg:py-28"
    >
      <PlumGlow className="-left-40 top-1/3 h-[440px] w-[440px] opacity-25" />

      <div className="shell relative">
        <SectionHeading
          id="timeline-heading"
          eyebrow="The Polymath Timeline"
          title="One career,"
          accent="three disciplines"
          lede="Research science, legal training, and regulated industry are usually separate résumés. In Dr. Fears' record they are a single continuous line of inquiry, each discipline sharpening the next."
        />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-0">
          {TIMELINE_TRACKS.map((track) => (
            <TimelineTrack key={track.id} track={track} />
          ))}
        </div>

        <p className="mt-14 border-t border-white/[0.06] pt-6 text-[12.5px] leading-relaxed text-muted">
          Additional academic service: Adjunct Regulatory Professor at Morehouse School of Medicine,
          teaching regulatory and medical-device topics to students and industry professionals, and
          presenting through the American Society for Quality.
        </p>
      </div>
    </section>
  );
}

/* ==========================================================================
 § 7 - THE FEARS FOUNDATION HUB
 ========================================================================== */

function ImpactWidget({ heading, fields }) {
  return (
    <div className="mt-6 rounded-sharp border border-plum-glow/20 bg-plum/[0.08] p-4">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[10.5px] font-semibold uppercase tracking-eyebrow text-plum-glow/90">
          {heading}
        </p>
        <span className="font-mono text-[10px] tracking-[0.18em] text-muted">
          {String(fields.length).padStart(2, '0')}
        </span>
      </div>

      <ul className="mt-3.5 grid grid-cols-1 gap-1.5">
        {fields.map((field) => (
          <li
            key={field}
            className="flex items-center gap-3 rounded-sharp border border-white/[0.06] bg-canvas/70 px-3 py-2.5"
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-sharp bg-plum-glow/80"
            />
            <span className="text-[12.5px] font-medium leading-snug text-white/95">{field}</span>
          </li>
        ))}
      </ul>

      {/* Decorative parity bar - signals scope, asserts no data */}
      <div aria-hidden="true" className="mt-3.5 flex gap-1">
        <span className="h-[3px] flex-1 bg-plum-light/70" />
        <span className="h-[3px] flex-1 bg-plum-light/50" />
        <span className="h-[3px] flex-1 bg-plum-light/30" />
      </div>
    </div>
  );
}

function ScholarshipCard({ card }) {
  return (
    <article
      aria-labelledby={`card-${card.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-card border border-white/[0.08] bg-surface/70 p-6 shadow-card transition-colors duration-300 hover:border-plum-glow/40 sm:p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-plum-glow/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-sharp bg-plum/20 opacity-0 blur-[80px] transition-opacity duration-500 group-hover:opacity-100"
      />

      <header className="relative">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-eyebrow text-plum-glow/90">
            {card.kicker}
          </p>
          <span aria-hidden="true" className="font-mono text-[10px] tracking-[0.18em] text-muted">
            {card.index}
          </span>
        </div>

        <h3
          id={`card-${card.id}`}
          className="mt-4 text-[21px] font-semibold leading-tight tracking-tight text-white sm:text-[22px]"
        >
          {card.title}
        </h3>
        <p className="mt-3.5 text-[13.5px] leading-relaxed text-silver">{card.description}</p>
      </header>

      <ul className="relative mt-6 divide-y divide-white/10 border-t border-white/10">
        {card.awards.map((award) => (
          <li key={`${award.name}-${award.institution}`} className="py-3.5">
            <p className="text-[13.5px] font-medium leading-snug text-white/95">{award.name}</p>
            <p className="mt-1.5 text-[11.5px] uppercase tracking-[0.12em] text-muted">
              {award.institution}
            </p>
          </li>
        ))}
      </ul>

      {card.impact ? (
        <ImpactWidget heading={card.impact.heading} fields={card.impact.fields} />
      ) : null}

      {/* CTA pinned to the card floor - equal-height cards at every breakpoint */}
      <div className="relative mt-7 flex flex-1 flex-col justify-end">
        <a
          href={card.cta.href}
          onClick={(event) => {
            event.preventDefault();
            scrollToSection('scholarship-portal');
          }}
          className={`${CTA_BASE} ${CTA_VARIANTS.card} ${CTA_SIZES.md}`}
        >
          {card.cta.label}
          <ArrowGlyph />
        </a>
      </div>
    </article>
  );
}

function FoundationHub() {
  return (
    <section
      id="scholarships"
      aria-labelledby="scholarships-heading"
      className="relative scroll-mt-24 overflow-hidden border-b border-white/[0.06] py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={GRID_TEXTURE}
      />
      <PlumGlow className="-right-32 top-0 h-[480px] w-[480px] opacity-30" />

      <div className="shell relative">
        <SectionHeading
          id="scholarships-heading"
          eyebrow="The Fears Foundation Hub"
          title="A growing portfolio of"
          accent="scholarships"
          lede="Supporting students at every stage of the academic journey: reducing financial barriers, creating educational opportunities, and encouraging ambitious academic and professional goals."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-7">
          {SCHOLARSHIP_CARDS.map((card) => (
            <ScholarshipCard key={card.id} card={card} />
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-[14px] leading-relaxed text-silver">
          Her scholarship work reflects a broader belief: that education can change the trajectory
          of individuals, families, and communities.
        </p>

        {/* Apply ribbon - the destination for nav "Apply" and every card CTA */}
        <div
          id="scholarship-portal"
          className="mt-12 scroll-mt-28 rounded-card border border-white/[0.08] bg-surface/60 p-6 sm:p-7"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10.5px] font-semibold uppercase tracking-eyebrow text-plum-glow/90">
                Scholar Portal
              </p>
              <h3 className="mt-3 text-[19px] font-semibold leading-tight tracking-tight text-white sm:text-xl">
                Ready to apply? Start with the requirements.
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-silver">
                Each program publishes its own eligibility criteria, deadlines, and submission
                requirements through the awarding institution. Review the requirements for your
                program before you begin.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <a
                href="#scholarships"
                className={`${CTA_BASE} ${CTA_VARIANTS.portal} ${CTA_SIZES.sm}`}
              >
                Enter Scholar Portal
                <ArrowGlyph />
              </a>
              <a
                href="#about"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection('about');
                }}
                className={`${CTA_BASE} ${CTA_VARIANTS.outline} ${CTA_SIZES.md}`}
              >
                About Dr. Fears
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 § 8 - PERSONAL FOOTER BLOCK
 ========================================================================== */

function FoundationFooter() {
  const year = new Date().getFullYear();

  return (
    <footer aria-labelledby="footer-heading" className="relative overflow-hidden pt-16 lg:pt-20">
      <h2 id="footer-heading" className="sr-only">
        Community presence and personal interests
      </h2>
      <PlumGlow className="-bottom-48 left-1/3 h-[420px] w-[420px] opacity-20" />

      <div className="shell relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <FearsMark />
              <span className="text-[11px] font-semibold uppercase tracking-eyebrow text-white">
                The Fears Foundation
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-silver">
              Dr. Constance Y. Fears, JD, PhD: scientist, attorney, educator, entrepreneur, mentor,
              and advocate for expanding access to education.
            </p>
            <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
              Atlanta, Georgia
            </p>
          </div>

          {/* Community & professional presence */}
          <div className="lg:col-span-4">
            <h3 className="text-[10.5px] font-semibold uppercase tracking-eyebrow text-white">
              Community &amp; Professional
            </h3>
            <ul className="mt-5 divide-y divide-white/[0.06] border-t border-white/[0.06]">
              {FOOTER_COMMUNITY.map((item) => (
                <li
                  key={item.name}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
                >
                  <span className="text-[13px] font-medium text-white/95">{item.name}</span>
                  <span className="text-[11px] uppercase tracking-[0.12em] text-muted">
                    {item.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Personal */}
          <div className="lg:col-span-4">
            <h3 className="text-[10.5px] font-semibold uppercase tracking-eyebrow text-white">
              Beyond the Work
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {FOOTER_INTERESTS.map((interest) => (
                <li key={interest}>
                  <Tag>{interest}</Tag>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-[10.5px] font-semibold uppercase tracking-eyebrow text-white">
              Advocacy
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_ADVOCACY.map((cause) => (
                <li key={cause} className="flex items-start gap-3 text-[13px] text-silver">
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-sharp bg-plum-glow/70"
                  />
                  {cause}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Low-profile closure bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.06] py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11.5px] text-muted">
            © {year} The Fears Foundation · Atlanta, Georgia
          </p>
          <p className="text-[11.5px] text-muted">
            A legacy centered on education, mentorship, opportunity, and service.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================================================
 § 9 - PAGE COMPOSITION
 ========================================================================== */

export default function FearsFoundationPage() {
  /* Memoised so the observer effect never re-subscribes on re-render. */
  const sectionIds = useMemo(() => NAV_LINKS.map((link) => link.id), []);
  const activeId = useActiveSection(sectionIds);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar activeId={activeId} />

      <main id="main">
        <ProfileHero />
        <PolymathTimeline />
        <FoundationHub />
      </main>

      <FoundationFooter />
    </div>
  );
}
