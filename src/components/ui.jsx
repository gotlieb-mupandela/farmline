import { useEffect, useId, useState } from 'react';
import { CROPS } from '../data/seed.js';
import { cx, initials } from '../lib/format.js';

/** Material Symbols icon (filled, rounded per the design system). */
export function Icon({ name, size = 22, className = '', label }) {
  return (
    <span
      className={cx('material-symbols-outlined', className)}
      style={{ fontSize: size }}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    >
      {name}
    </span>
  );
}

/** Image with a warm clay placeholder if the remote asset fails to load. */
export function Img({ src, alt, className = '', fallbackIcon = 'image' }) {
  const [failed, setFailed] = useState(!src);
  useEffect(() => {
    setFailed(!src);
  }, [src]);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cx(
          'bg-gradient-to-br from-accent-container to-primary-container text-primary flex items-center justify-center overflow-hidden',
          className,
        )}
      >
        {fallbackIcon === 'person' && alt ? (
          <span className="font-headline text-primary tabular-nums" style={{ fontSize: '0.9em' }}>
            {initials(alt)}
          </span>
        ) : (
          <Icon name={fallbackIcon} size={28} className="opacity-70" />
        )}
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}

const TONES = {
  primary: 'bg-primary text-on-primary',
  'primary-soft': 'bg-primary-container text-on-primary-container',
  accent: 'bg-accent text-on-accent',
  'accent-soft': 'bg-accent-container text-on-accent-container',
  ghost: 'bg-surface-elevated text-on-surface-variant border border-outline-variant',
  error: 'bg-error text-on-error',
};

export function Badge({ tone = 'primary-soft', className = '', children }) {
  return <span className={cx('badge', TONES[tone], className)}>{children}</span>;
}

/** Icon disc / tile used for crops, notifications and list rows. */
export function IconTile({ icon, tone = 'primary-soft', size = 'md', round = false, className = '' }) {
  const tones = {
    primary: 'bg-primary text-on-primary',
    'primary-soft': 'bg-primary-container text-primary',
    accent: 'bg-accent text-on-accent',
    'accent-soft': 'bg-accent-container text-accent-text',
  };
  const sizes = { sm: 'w-10 h-10', md: 'w-11 h-11', lg: 'w-12 h-12' };
  const iconSize = { sm: 20, md: 22, lg: 26 }[size];
  return (
    <div
      className={cx(
        sizes[size],
        round ? 'rounded-full' : 'rounded',
        tones[tone],
        'flex items-center justify-center shrink-0',
        className,
      )}
    >
      <Icon name={icon} size={iconSize} />
    </div>
  );
}

export function CropTile({ crop, size = 'lg', round, className }) {
  const c = CROPS[crop] ?? { icon: 'eco', tone: 'primary' };
  return (
    <IconTile
      icon={c.icon}
      tone={c.tone === 'accent' ? 'accent-soft' : 'primary-soft'}
      size={size}
      round={round}
      className={className}
    />
  );
}

/** Pill switch. Rendered as a real switch for keyboard + screen reader users. */
export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        'w-12 h-7 rounded-full p-1 flex shrink-0 transition-colors duration-state-change',
        checked ? 'bg-primary justify-end' : 'bg-outline-variant justify-start',
      )}
    >
      <span className="w-5 h-5 rounded-full bg-on-primary shadow-sm" />
    </button>
  );
}

export function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-gutter-md">
      <div>
        <p className="font-body text-body-md">{label}</p>
        {hint && <p className="font-label text-label-sm text-on-surface-variant">{hint}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

/** Segmented tabs (clay pill track). */
export function Segmented({ options, value, onChange, className = '', size = 'md', label }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cx('clay-card bg-surface-card rounded-full p-1.5 grid gap-gutter-xs', className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value;
        const l = typeof o === 'string' ? o : o.label;
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(v)}
            className={cx(
              'rounded-full font-label transition-colors duration-state-change whitespace-nowrap',
              size === 'sm' ? 'px-4 py-1.5 text-label-md' : 'py-2 text-label-md',
              active ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-primary',
            )}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

/** Smooth line chart with the gold "now" marker, matching the design sparklines. */
export function Sparkline({ values, width = 300, height = 80, pad = 12, strokeWidth = 5, label, className = 'w-full h-20' }) {
  const gid = useId().replace(/:/g, '');
  if (!values?.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [
    pad + (i * (width - pad * 2)) / Math.max(values.length - 1, 1),
    height - pad - ((v - min) / span) * (height - pad * 2),
  ]);
  // Catmull-Rom → cubic Bézier for a soft clay-like curve.
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-label={label}>
      <defs>
        <linearGradient id={`fill${gid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1F5C3A" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#1F5C3A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${last[0]},${height} L${pts[0][0]},${height} Z`} fill={`url(#fill${gid})`} />
      <path d={d} fill="none" stroke="#1F5C3A" strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r={strokeWidth + 1.5} fill="#F2B33D" stroke="#1F5C3A" strokeWidth="3" />
    </svg>
  );
}

/** Ring gauge used for local-sourcing share. */
export function Donut({ value, size = 56, stroke = 6, className = '' }) {
  const r = 24 - stroke / 2 - 2;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={cx('shrink-0', className)} aria-hidden="true">
      <circle cx="24" cy="24" r={r} fill="none" stroke="#D6C4AF" strokeWidth={stroke} />
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="#F2B33D"
        strokeWidth={stroke}
        strokeDasharray={`${(c * value) / 100} ${c}`}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
      />
    </svg>
  );
}

/** Horizontal step dots used on the farmer order list. */
export function StepDots({ total = 5, filled = 0, label }) {
  const items = [];
  for (let i = 0; i < total; i++) {
    if (i > 0) items.push(<span key={`b${i}`} className={cx('flex-1 h-1 rounded-full', i < filled ? 'bg-primary' : 'bg-outline-variant')} />);
    items.push(<span key={`d${i}`} className={cx('w-3 h-3 rounded-full shrink-0', i < filled ? 'bg-primary' : 'bg-outline-variant')} />);
  }
  return (
    <div className="flex items-center gap-gutter-xs" role="img" aria-label={label ?? `Stage ${filled} of ${total}`}>
      {items}
    </div>
  );
}

/** Accessible modal dialog on a soft clay scrim. */
export function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close" className="absolute inset-0 bg-clay-shadow/30 backdrop-blur-[2px] cursor-default" onClick={onClose} />
      <div className={cx('relative clay-card bg-surface-card rounded-2xl p-6 w-full flex flex-col gap-4 animate-surface-enter max-h-[90vh] overflow-y-auto', wide ? 'max-w-2xl' : 'max-w-md')}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-headline text-headline-md text-primary">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="w-10 h-10 rounded-full bg-surface-elevated text-primary flex items-center justify-center press">
            <Icon name="close" size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ icon = 'inbox', title, body, action }) {
  return (
    <div className="clay-card bg-surface-card rounded-2xl p-8 flex flex-col items-center text-center gap-gutter-sm">
      <IconTile icon={icon} tone="accent-soft" size="lg" round />
      <p className="font-title text-title-md text-on-surface">{title}</p>
      {body && <p className="font-body text-body-md text-on-surface-variant">{body}</p>}
      {action}
    </div>
  );
}

/** Pill chip that toggles selection. */
export function Chip({ active, onClick, icon, children, className = '', size = 'md' }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        'chip',
        size === 'sm' ? 'px-3.5 py-1.5 text-label-sm' : 'px-3.5 py-2',
        active ? 'chip-on' : 'chip-off',
        className,
      )}
    >
      {icon && <Icon name={icon} size={18} className={active ? '' : 'text-primary'} />}
      <span>{children}</span>
    </button>
  );
}
