import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  Camera, Map, AlertTriangle, Shield, Zap, Phone, Navigation, Check,
  Mic, Award, Eye, ChevronLeft, Aperture, Truck, Clock,
  TrendingUp, CloudRain, Wind, Play, Pause, MapPin,
  ArrowUp, ArrowDown, Grid, Home, Globe, Cpu,
  Download, Wifi, Radio, MonitorPlay, Siren, Settings,
  Bell, Search, User, ChevronDown, Sun, Moon, Activity,
  BarChart2, AlertCircle, CheckCircle2, RefreshCcw,
  Layers, Signal, Satellite, ScanSearch,
  MessageSquare, Users, Smartphone, Send,
} from 'lucide-react';

/* ─── Theme context ─────────────────────────────────────────────────────── */
type Theme = 'dark' | 'light';
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'dark', toggle: () => {} });
const useTheme = () => useContext(ThemeCtx);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggle = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

/* ─── CSS-var helper ────────────────────────────────────────────────────── */
const v = (name: string) => `var(${name})`;

/* ─── Color maps ────────────────────────────────────────────────────────── */
type BV = 'em' | 'red' | 'amb' | 'blue' | 'dim' | 'veh';

const chipStyle: Record<BV, { text: string; bg: string; border: string }> = {
  em:  { text: 'color-mix(in srgb, var(--em) 100%, transparent)',  bg: 'color-mix(in srgb, var(--em) 10%, transparent)',  border: 'var(--border-em)'  },
  red: { text: 'color-mix(in srgb, var(--red) 100%, transparent)', bg: 'color-mix(in srgb, var(--red) 10%, transparent)', border: 'var(--border-red)' },
  amb: { text: 'color-mix(in srgb, var(--amber) 100%, transparent)',bg: 'color-mix(in srgb, var(--amber) 9%, transparent)',border: 'var(--border-amb)' },
  blue:{ text: 'var(--blue)',  bg: 'color-mix(in srgb, var(--blue) 9%, transparent)',   border: 'color-mix(in srgb, var(--blue) 35%, transparent)' },
  veh: { text: 'var(--veh-col)', bg: 'color-mix(in srgb, var(--veh-col) 10%, transparent)', border: 'color-mix(in srgb, var(--veh-col) 30%, transparent)' },
  dim: { text: 'var(--text-2)', bg: 'color-mix(in srgb, var(--text-1) 6%, transparent)', border: 'var(--border)' },
};

const riskVariant = (r: string): BV => r === 'CRITICAL' ? 'red' : r === 'HIGH' ? 'amb' : r === 'VEHICLE' ? 'veh' : 'em';
const riskCSS     = (r: string) => r === 'CRITICAL' ? 'var(--red)' : r === 'HIGH' ? 'var(--amber)' : r === 'VEHICLE' ? 'var(--veh-col)' : 'var(--em)';

/* ═══════════════════════════════════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════════════════════════════════ */
function LivePill({ color = 'em' }: { color?: 'em' | 'red' | 'amb' }) {
  const map = { em: 'var(--em)', red: 'var(--red)', amb: 'var(--amber)' };
  const a   = { em: 'a-pulse-em', red: 'a-pulse-red', amb: 'a-pulse-amb' };
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold tracking-widest uppercase" style={{ color: map[color] }}>
      <span className={`w-1.5 h-1.5 rounded-full a-blink ${a[color]}`} style={{ background: map[color] }} />
      LIVE
    </span>
  );
}

function Chip({ label, v: variant = 'dim', dot, sm }: { label: string; v?: BV; dot?: boolean; sm?: boolean }) {
  const s = chipStyle[variant];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wide border ${sm ? 'px-1.5 py-px text-[8px]' : 'px-2 py-0.5 text-[9px]'}`}
      style={{ color: s.text, background: s.bg, borderColor: s.border }}
    >
      {dot && <span className="w-1 h-1 rounded-full a-blink" style={{ background: s.text }} />}
      {label}
    </span>
  );
}

function Btn({ children, variant = 'em', sm, lg, onClick, className = '', disabled }: {
  children: React.ReactNode; variant?: 'em' | 'ghost' | 'red' | 'amb' | 'surface';
  sm?: boolean; lg?: boolean; onClick?: () => void; className?: string; disabled?: boolean;
}) {
  const sz = lg ? 'px-7 py-3.5 text-sm' : sm ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm';
  const vs: Record<string, React.CSSProperties> = {
    em:      { background: 'var(--em)',    color: '#000',         boxShadow: 'var(--sh-glow-em)' },
    ghost:   { background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border)' },
    red:     { background: 'var(--red)',   color: '#fff',         boxShadow: 'var(--sh-glow-red)' },
    amb:     { background: 'var(--amber)', color: '#000',         boxShadow: 'var(--sh-glow-amb)' },
    surface: { background: 'var(--surface)', color: 'var(--text-1)', border: '1px solid var(--border)' },
  };
  return (
    <button
      onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 active:scale-95 hover:opacity-90 disabled:opacity-40 ${sz} ${className}`}
      style={vs[variant]}
    >
      {children}
    </button>
  );
}

function Card({ children, className = '', style = {}, onClick }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl ${onClick ? 'lift cursor-pointer' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[9px] uppercase tracking-widest mb-3" style={{ color: v('--text-3') }}>{children}</p>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI CARD
═══════════════════════════════════════════════════════════════════════════ */
function KPICard({ icon, label, value, unit = '', delta, accent, sub }: {
  icon: React.ReactNode; label: string; value: string; unit?: string;
  delta?: { val: string; up: boolean }; accent: string; sub?: string;
}) {
  return (
    <Card className="p-4 flex flex-col gap-3 lift">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)`, color: accent }}>
          {icon}
        </div>
        {delta && (
          <span className={`flex items-center gap-0.5 font-mono text-[10px] font-semibold ${delta.up ? '' : ''}`}
            style={{ color: delta.up ? v('--em') : v('--red') }}>
            {delta.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}{delta.val}
          </span>
        )}
      </div>
      <div>
        <p className="font-mono font-black leading-none" style={{ fontSize: 22, color: accent, fontFamily: 'JetBrains Mono, monospace' }}>
          {value}<span className="text-xs font-normal ml-1" style={{ color: v('--text-3') }}>{unit}</span>
        </p>
        <p className="text-[10px] font-medium mt-1.5 uppercase tracking-wider" style={{ color: v('--text-3') }}>{label}</p>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: v('--text-3') }}>{sub}</p>}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RISK GAUGE
═══════════════════════════════════════════════════════════════════════════ */
function RiskGauge({ score, level }: { score: number; level: string }) {
  const accent = riskCSS(level === 'CRITICAL' ? 'CRITICAL' : level === 'HIGH' ? 'HIGH' : level === 'MODERATE' ? 'MODERATE' : 'SAFE');
  const r = 42, circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ * 0.72;
  const offset = circ * 0.14;
  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ position: 'relative', width: 108, height: 108 }}>
        <svg width="108" height="108" viewBox="0 0 108 108">
          <circle cx="54" cy="54" r={r} fill="none" stroke="var(--border)" strokeWidth="8"
            strokeDasharray={`${circ * .72} ${circ}`} strokeDashoffset={-offset}
            strokeLinecap="round" transform="rotate(126 54 54)" />
          <circle cx="54" cy="54" r={r} fill="none" stroke={accent} strokeWidth="8"
            strokeDasharray={`${filled} ${circ}`} strokeDashoffset={-offset}
            strokeLinecap="round" transform="rotate(126 54 54)"
            style={{ filter: `drop-shadow(0 0 6px ${accent})`, transition: 'stroke-dasharray 1.2s cubic-bezier(.23,1,.32,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-black" style={{ fontSize: 26, color: accent, lineHeight: 1, fontFamily: 'JetBrains Mono, monospace' }}>{score}</span>
          <span className="font-mono text-[9px] uppercase tracking-widest mt-0.5" style={{ color: v('--text-3') }}>RISK</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1 w-full">
        {(['SAFE', 'MOD', 'HIGH', 'CRIT'] as const).map((l, i) => {
          const cols = ['var(--em)', 'var(--blue)', 'var(--amber)', 'var(--red)'];
          const active = (i === 0 && level === 'SAFE') || (i === 1 && level === 'MODERATE') || (i === 2 && level === 'HIGH') || (i === 3 && level === 'CRITICAL');
          return (
            <div key={l} className="flex flex-col items-center gap-1">
              <div className="h-0.5 w-full rounded-full transition-all" style={{ background: active ? cols[i] : 'var(--border)' }} />
              <span className="font-mono text-[8px] uppercase tracking-wide" style={{ color: active ? cols[i] : 'var(--text-3)' }}>{l}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HIGHWAY CCTV — REALISTIC DETECTION OVERLAY
═══════════════════════════════════════════════════════════════════════════ */

type DetTarget = {
  id: string; type: 'vehicle' | 'animal' | 'pedestrian';
  label: string; sub?: string; conf?: number; speed?: number;
  x: string; y: string; w: string; h: string;
  risk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'VEHICLE';
  trackX?: number[]; trackY?: number[];
};

const CAMERA_FEEDS = [
  {
    id: 'CAM-007', label: 'NH-44 KM 312', zone: 'Jabalpur Corridor', fps: 30, mode: 'NIGHT-IR',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=506&fit=crop&auto=format',
    targets: [
      { id:'VEH-001', type:'vehicle', label:'Car · Lane 1',     speed:72,  x:'2%',   y:'57%', w:'22%', h:'32%', risk:'VEHICLE' },
      { id:'VEH-002', type:'vehicle', label:'Truck · Lane 2',   speed:58,  x:'30%',  y:'43%', w:'17%', h:'22%', risk:'VEHICLE' },
      { id:'VEH-003', type:'vehicle', label:'Car · Lane 3',     speed:89,  x:'60%',  y:'37%', w:'12%', h:'14%', risk:'VEHICLE' },
      { id:'DEER-01', type:'animal',  label:'Indian Deer × 2',  conf:97.3, x:'34%',  y:'48%', w:'11%', h:'19%', risk:'HIGH',    trackX:[34,33,32], trackY:[52,50,48] },
    ] as DetTarget[],
  },
  {
    id: 'CAM-023', label: 'NH-8 KM 88',  zone: 'Ranthambhore Gate', fps: 25, mode: 'THERMAL',
    img: 'https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=900&h=506&fit=crop&auto=format',
    targets: [
      { id:'VEH-011', type:'vehicle', label:'SUV · Lane 2',     speed:94,  x:'5%',   y:'55%', w:'20%', h:'30%', risk:'VEHICLE' },
      { id:'VEH-012', type:'vehicle', label:'Car · Lane 1',     speed:81,  x:'60%',  y:'42%', w:'14%', h:'17%', risk:'VEHICLE' },
      { id:'LEO-01',  type:'animal',  label:'Leopard',           conf:94.1, x:'42%',  y:'38%', w:'12%', h:'22%', risk:'CRITICAL', trackX:[44,43,42], trackY:[42,40,38] },
    ] as DetTarget[],
  },
  {
    id: 'CAM-041', label: 'NH-27 KM 174', zone: 'Kanha Buffer Zone', fps: 30, mode: 'DAY',
    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900&h=506&fit=crop&auto=format',
    targets: [
      { id:'VEH-021', type:'vehicle', label:'Car · Lane 1',     speed:67,  x:'3%',   y:'56%', w:'21%', h:'31%', risk:'VEHICLE' },
      { id:'VEH-022', type:'vehicle', label:'Bus · Lane 3',     speed:49,  x:'58%',  y:'40%', w:'16%', h:'18%', risk:'VEHICLE' },
      { id:'BOAR-01', type:'animal',  label:'Wild Boar',         conf:88.6, x:'28%',  y:'50%', w:'9%',  h:'15%', risk:'MODERATE' },
    ] as DetTarget[],
  },
  {
    id: 'CAM-015', label: 'NH-67 KM 56',  zone: 'Mudumalai NP', fps: 30, mode: 'NIGHT-IR',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&h=506&fit=crop&auto=format',
    targets: [
      { id:'VEH-031', type:'vehicle', label:'Car · Lane 1',     speed:55,  x:'4%',   y:'58%', w:'19%', h:'28%', risk:'VEHICLE' },
      { id:'ELPH-01', type:'animal',  label:'Elephant',          conf:99.2, x:'36%',  y:'30%', w:'22%', h:'46%', risk:'CRITICAL', trackX:[38,37,36], trackY:[34,32,30] },
    ] as DetTarget[],
  },
];

function DetectionBox({ t, playing }: { t: DetTarget; playing: boolean }) {
  const isAnimal = t.type === 'animal';
  const isVeh    = t.type === 'vehicle';
  const col = isVeh ? 'var(--veh-col)' : riskCSS(t.risk);
  const boxClass = isVeh ? 'det-box-veh' : t.risk === 'CRITICAL' ? 'det-box-animal-critical' : 'det-box-animal-high';

  return (
    <div className={`absolute a-corner ${boxClass}`} style={{ left: t.x, top: t.y, width: t.w, height: t.h }}>
      {/* Corner markers */}
      {[
        { pos: 'top-0 left-0',   bdr: `border-t-2 border-l-2 rounded-tl` },
        { pos: 'top-0 right-0',  bdr: `border-t-2 border-r-2 rounded-tr` },
        { pos: 'bottom-0 left-0',bdr: `border-b-2 border-l-2 rounded-bl` },
        { pos: 'bottom-0 right-0',bdr:`border-b-2 border-r-2 rounded-br` },
      ].map(({ pos, bdr }, i) => (
        <span key={i} className={`absolute w-2.5 h-2.5 ${pos} ${bdr}`} style={{ borderColor: col }} />
      ))}

      {/* Label (top) */}
      <div
        className="absolute flex items-center gap-1.5 px-1.5 py-0.5 rounded-md z-10"
        style={{
          bottom: '100%', marginBottom: '4px', left: 0,
          background: isVeh ? 'rgba(37,99,235,0.2)' : `color-mix(in srgb, ${col} 18%, rgba(0,0,0,.7))`,
          border: `1px solid color-mix(in srgb, ${col} 40%, transparent)`,
          backdropFilter: 'blur(8px)', whiteSpace: 'nowrap',
        }}
      >
        {isVeh
          ? <Signal size={8} style={{ color: col }} />
          : <AlertTriangle size={8} style={{ color: col }} />
        }
        <span className="font-mono font-bold text-[9px]" style={{ color: col }}>{t.label}</span>
        {t.speed && <span className="font-mono text-[9px]" style={{ color: v('--text-2') }}>{t.speed} km/h</span>}
        {t.conf  && <span className="font-mono text-[9px]" style={{ color: col }}>{t.conf}%</span>}
      </div>

      {/* Bottom risk tag (animals only) */}
      {isAnimal && (
        <div
          className="absolute flex items-center gap-1 px-1.5 py-0.5 rounded"
          style={{
            bottom: '-20px', left: 0,
            background: `color-mix(in srgb, ${col} 15%, rgba(0,0,0,.65))`,
            border: `1px solid color-mix(in srgb, ${col} 30%, transparent)`,
            backdropFilter: 'blur(8px)', whiteSpace: 'nowrap',
          }}
        >
          <span className="font-mono text-[8px] font-bold" style={{ color: col }}>{t.risk}</span>
        </div>
      )}

      {/* Tracking dots (animal movement trail) */}
      {isAnimal && t.trackX && t.trackY && t.trackX.map((tx, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            left: `${(tx - parseFloat(t.x)) * 2}px`,
            top:  `${(t.trackY![i] - parseFloat(t.y)) * 2}px`,
            background: col,
            opacity: 0.15 + i * 0.25,
            boxShadow: `0 0 4px ${col}`,
          }}
        />
      ))}

      {/* Vehicle direction arrow */}
      {isVeh && (
        <div className="absolute inset-0 flex items-center justify-end pr-1">
          <span className="font-mono text-[10px] font-bold" style={{ color: col, opacity: .7 }}>→</span>
        </div>
      )}
    </div>
  );
}

function HighwayCCTV({ feedIdx, playing }: { feedIdx: number; playing: boolean }) {
  const feed = CAMERA_FEEDS[feedIdx];
  const hasCritical = feed.targets.some(t => t.risk === 'CRITICAL');
  const modeColors: Record<string, string> = { 'NIGHT-IR': '#22C55E', 'THERMAL': '#F59E0B', 'DAY': '#60A5FA' };
  const modeCol = modeColors[feed.mode] ?? '#60A5FA';

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#050810' }}>
      {/* Base image */}
      <img
        key={feedIdx}
        src={feed.img}
        alt={`Highway CCTV ${feed.id}`}
        className="absolute inset-0 w-full h-full object-cover a-fade"
        style={{ opacity: v('--img-op') as unknown as number }}
      />

      {/* Night-IR green tint for night cameras */}
      {feed.mode === 'NIGHT-IR' && (
        <div className="absolute inset-0" style={{ background: 'rgba(34,197,94,0.04)', mixBlendMode: 'screen' }} />
      )}
      {feed.mode === 'THERMAL' && (
        <div className="absolute inset-0" style={{ background: 'rgba(245,158,11,0.04)', mixBlendMode: 'screen' }} />
      )}

      {/* Vignette */}
      <div className="absolute inset-0 cctv-vignette pointer-events-none" />

      {/* SVG — lane lines + distance markers + tracking */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 900 506" preserveAspectRatio="none">
        <defs>
          <linearGradient id="laneGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(255,220,50,0.55)" />
            <stop offset="100%" stopColor="rgba(255,220,50,0)" />
          </linearGradient>
          <linearGradient id="laneGradW" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Left curb */}
        <line x1="40"  y1="506" x2="330" y2="155" stroke="url(#laneGradW)" strokeWidth="2.5" />
        {/* Right curb */}
        <line x1="860" y1="506" x2="570" y2="155" stroke="url(#laneGradW)" strokeWidth="2.5" />
        {/* Lane 1|2 divider */}
        <line x1="300" y1="506" x2="420" y2="155" stroke="url(#laneGrad)" strokeWidth="1.5" strokeDasharray="20 12" className="lane-line" />
        {/* Lane 2|3 divider */}
        <line x1="560" y1="506" x2="480" y2="155" stroke="url(#laneGrad)" strokeWidth="1.5" strokeDasharray="20 12" className="lane-line" />

        {/* Distance rings — horizontal arcs labeled */}
        {[
          { y: 400, label: '30m',  opacity: .5 },
          { y: 320, label: '60m',  opacity: .4 },
          { y: 255, label: '100m', opacity: .3 },
          { y: 210, label: '150m', opacity: .22 },
        ].map(({ y, label, opacity }) => (
          <g key={label} opacity={opacity}>
            <line x1="50" y1={y} x2="850" y2={y} stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeDasharray="4 6" />
            <text x="14" y={y + 3} fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="JetBrains Mono, monospace">{label}</text>
            <text x="852" y={y + 3} fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="JetBrains Mono, monospace">{label}</text>
          </g>
        ))}

        {/* Grid overlay — subtle */}
        <rect x="0" y="0" width="900" height="506"
          fill="none" stroke="rgba(255,255,255,0.02)"
          style={{ strokeDasharray: '1 44', strokeWidth: 0.5 }} />
      </svg>

      {/* Detection boxes */}
      <div className="absolute inset-0">
        {feed.targets.map(t => (
          <DetectionBox key={t.id} t={t} playing={playing} />
        ))}
      </div>

      {/* Scan line */}
      {playing && <div className="cctv-scan-line" />}

      {/* HUD — top left */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
        {/* REC indicator */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
          style={{ background: 'rgba(0,0,0,.62)', border: '1px solid rgba(255,255,255,.08)', backdropFilter: 'blur(8px)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 a-blink" />
          <span className="font-mono text-[9px] text-white/80">REC</span>
          <span className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,.4)' }}>{feed.fps}fps</span>
        </div>
        {/* Camera ID */}
        <div className="px-2 py-1 rounded-lg"
          style={{ background: 'rgba(0,0,0,.55)', border: '1px solid rgba(255,255,255,.06)', backdropFilter: 'blur(8px)' }}>
          <span className="font-mono text-[9px] text-white/60">{feed.id} · {feed.zone}</span>
        </div>
      </div>

      {/* HUD — top right */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-20">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
          style={{ background: 'rgba(0,0,0,.62)', border: `1px solid color-mix(in srgb, ${modeCol} 30%, transparent)`, backdropFilter: 'blur(8px)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: modeCol }} />
          <span className="font-mono text-[9px] font-bold" style={{ color: modeCol }}>{feed.mode}</span>
        </div>
        {/* Detection count */}
        <div className="px-2 py-1 rounded-lg"
          style={{ background: 'rgba(0,0,0,.55)', border: '1px solid rgba(255,255,255,.06)', backdropFilter: 'blur(8px)' }}>
          <span className="font-mono text-[9px] text-white/60">
            {feed.targets.filter(t => t.type === 'vehicle').length} VEH · {feed.targets.filter(t => t.type === 'animal').length} ANIMAL
          </span>
        </div>
        {/* Timestamp */}
        <div className="px-2 py-1 rounded-lg"
          style={{ background: 'rgba(0,0,0,.55)', border: '1px solid rgba(255,255,255,.06)', backdropFilter: 'blur(8px)' }}>
          <span className="font-mono text-[9px] text-white/50">2026-09-20 09:41:32</span>
        </div>
      </div>

      {/* CRITICAL alert banner */}
      {hasCritical && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-xl a-detect"
          style={{ background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.45)', backdropFilter: 'blur(12px)', whiteSpace: 'nowrap' }}>
          <AlertTriangle size={13} style={{ color: v('--red') }} />
          <span className="font-mono text-[10px] font-bold" style={{ color: v('--red') }}>CRITICAL — ANIMAL ON CARRIAGEWAY — ALERT ACTIVE</span>
        </div>
      )}

      {/* Bottom telemetry ribbon */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-end justify-between"
        style={{ background: 'linear-gradient(transparent, rgba(5,10,20,.92))' }}>
        <div className="flex gap-5">
          {[
            { k: 'DETECTIONS', v: feed.targets.length.toString() },
            { k: 'VEHICLES',   v: feed.targets.filter(t => t.type === 'vehicle').length.toString() },
            { k: 'ANIMALS',    v: feed.targets.filter(t => t.type === 'animal').length.toString() },
            { k: 'RISK',       v: hasCritical ? 'CRITICAL' : 'HIGH', col: hasCritical ? 'var(--red)' : 'var(--amber)' },
          ].map(({ k, v: val, col }, i) => (
            <div key={i}>
              <p className="font-mono text-[8px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,.35)' }}>{k}</p>
              <p className="font-mono text-xs font-bold mt-0.5" style={{ color: col ?? 'rgba(255,255,255,.9)', fontFamily: 'JetBrains Mono, monospace' }}>{val}</p>
            </div>
          ))}
        </div>
        {/* Waveform */}
        {playing && (
          <div className="flex items-center gap-0.5">
            {[3,6,10,15,11,8,14,5,9,16,7].map((h, i) => (
              <div key={i} className="waveform-bar" style={{ height: h, animationDelay: `${i * .07}s` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SATELLITE HEATMAP PANEL
═══════════════════════════════════════════════════════════════════════════ */
const MAP_MARKERS = [
  { x: 24, y: 32, type: 'hot',    label: 'High Activity Zone',  sub: '47 detections · Deer, Leopard' },
  { x: 52, y: 22, type: 'cam',    label: 'CAM-023 · CRITICAL',  sub: 'Leopard on road' },
  { x: 70, y: 52, type: 'acc',    label: 'Incident Site',       sub: '3 accidents this week' },
  { x: 38, y: 62, type: 'rescue', label: 'Active Rescue',       sub: 'Elephant · Officer en route' },
  { x: 62, y: 35, type: 'cam',    label: 'CAM-041 · MODERATE',  sub: 'Wild Boar detected' },
  { x: 17, y: 51, type: 'hot',    label: 'Tiger Corridor',      sub: 'Migration route' },
  { x: 80, y: 70, type: 'cam',    label: 'CAM-088 · CLEAR',     sub: 'All clear' },
];

function SatMap() {
  const [sel, setSel] = useState<number | null>(null);
  const markerInfo: Record<string, { bg: string; border: string; icon: string }> = {
    hot:    { bg: 'rgba(239,68,68,.2)',  border: 'var(--red)',     icon: '⚠' },
    cam:    { bg: 'rgba(34,197,94,.18)', border: 'var(--em)',      icon: '◉' },
    acc:    { bg: 'rgba(245,158,11,.2)', border: 'var(--amber)',   icon: '✕' },
    rescue: { bg: 'rgba(96,165,250,.2)', border: 'var(--blue)',    icon: '✦' },
  };

  return (
    <div className="relative flex-1 overflow-hidden" style={{ background: '#040C14', minHeight: 0 }}>
      <img
        src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=480&fit=crop&auto=format"
        alt="Forest satellite"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: .22 }}
      />
      <div className="absolute inset-0 sat-grid" />

      {/* Heatmap blobs */}
      {[
        { x: 22, y: 30, r: 80,  c: 'rgba(239,68,68,.22)' },
        { x: 40, y: 61, r: 60,  c: 'rgba(239,68,68,.17)' },
        { x: 17, y: 50, r: 65,  c: 'rgba(245,158,11,.14)' },
        { x: 68, y: 51, r: 50,  c: 'rgba(239,68,68,.12)' },
        { x: 53, y: 35, r: 44,  c: 'rgba(245,158,11,.10)' },
      ].map((b, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none" style={{
          left: `${b.x}%`, top: `${b.y}%`,
          width: b.r * 2, height: b.r * 2,
          transform: 'translate(-50%,-50%)',
          background: `radial-gradient(circle, ${b.c} 0%, transparent 70%)`,
          filter: 'blur(14px)',
        }} />
      ))}

      {/* Road + corridor SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: .5 }}>
        <line x1="0" y1="47%" x2="100%" y2="45%" stroke="rgba(240,246,255,.22)" strokeWidth="2" strokeDasharray="12 7" />
        <line x1="29%" y1="0" x2="31%" y2="100%" stroke="rgba(240,246,255,.15)" strokeWidth="1.5" strokeDasharray="10 5" />
        <path d="M 17% 53% Q 30% 46% 24% 32%" stroke="var(--forest)" strokeWidth="1.5" fill="none" strokeDasharray="5 4" opacity=".6" />
      </svg>

      {/* Markers */}
      {MAP_MARKERS.map((m, i) => {
        const mc = markerInfo[m.type];
        return (
          <div key={i} className="absolute" style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%,-50%)' }}>
            <div className="absolute inset-0 rounded-full a-map-pulse pointer-events-none"
              style={{ width: 24, height: 24, transform: 'translate(-25%,-25%)', background: mc.border, opacity: .25 }} />
            <button
              className="relative w-6 h-6 rounded-full flex items-center justify-center border z-10 transition-transform hover:scale-125"
              style={{ background: mc.bg, borderColor: mc.border, boxShadow: `0 0 8px color-mix(in srgb, ${mc.border} 50%, transparent)` }}
              onClick={() => setSel(sel === i ? null : i)}
            >
              <span className="text-[9px] font-bold" style={{ color: mc.border }}>{mc.icon}</span>
            </button>
            {sel === i && (
              <div className="absolute z-20 rounded-xl p-2.5 w-36 a-fade"
                style={{ top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: v('--surface'), border: `1px solid color-mix(in srgb, ${mc.border} 35%, transparent)`, boxShadow: v('--sh-card') }}>
                <p className="text-[10px] font-semibold" style={{ color: v('--text-1') }}>{m.label}</p>
                <p className="text-[9px] mt-0.5" style={{ color: v('--text-3') }}>{m.sub}</p>
              </div>
            )}
          </div>
        );
      })}

      {/* Radar */}
      <div className="absolute top-2.5 right-2.5 rounded-xl p-2.5 flex flex-col items-center gap-1.5"
        style={{ background: 'var(--card)', border: 'var(--border-em) 1px solid', backdropFilter: 'blur(16px)' }}>
        <div style={{ position: 'relative', width: 54, height: 54 }}>
          <svg viewBox="0 0 60 60" width="54" height="54">
            {[1,2,3].map(r => <circle key={r} cx="30" cy="30" r={r*9} fill="none" stroke="var(--border-em)" strokeWidth=".8" />)}
            {[0,90,180,270].map(a => {
              const rad = a * Math.PI / 180;
              return <line key={a} x1="30" y1="30" x2={30+27*Math.cos(rad)} y2={30+27*Math.sin(rad)} stroke="var(--border-em)" strokeWidth=".6" />;
            })}
            <line x1="30" y1="30" x2="30" y2="3" stroke="var(--em)" strokeWidth="1.5" className="a-radar"
              style={{ filter: 'drop-shadow(0 0 3px var(--em))' }} />
            <circle cx="18" cy="18" r="2.5" fill="var(--red)"   opacity=".9" />
            <circle cx="42" cy="24" r="2"   fill="var(--amber)" opacity=".9" />
            <circle cx="36" cy="40" r="1.8" fill="var(--em)"    opacity=".9" />
          </svg>
        </div>
        <span className="font-mono text-[8px]" style={{ color: v('--text-3') }}>5 km</span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2.5 left-2.5 rounded-xl p-2"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}>
        {Object.entries(markerInfo).map(([k, mc]) => (
          <div key={k} className="flex items-center gap-1.5 mb-1 last:mb-0">
            <span className="w-2 h-2 rounded-full border" style={{ borderColor: mc.border, background: mc.bg }} />
            <span className="font-mono text-[9px] capitalize" style={{ color: v('--text-3') }}>{k}</span>
          </div>
        ))}
      </div>

      {/* Zone stats footer */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around py-2 border-t" style={{ background: 'var(--card)', borderColor: 'var(--border)', backdropFilter: 'blur(16px)' }}>
        {[
          { v: '14', l: 'Hotspots', c: 'var(--red)'   },
          { v: '340',l: 'Cameras',  c: 'var(--em)'    },
          { v: '92', l: 'Tracked',  c: 'var(--amber)'  },
          { v: '7',  l: 'Corridors',c: 'var(--forest)' },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="font-mono font-black text-sm" style={{ color: s.c, fontFamily: 'JetBrains Mono, monospace' }}>{s.v}</span>
            <span className="font-mono text-[8px]" style={{ color: v('--text-3') }}>{s.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════════════════════ */
const NAV = [
  { id: 'command',  icon: <Grid size={17} />,     label: 'Command Center' },
  { id: 'landing',  icon: <Home size={17} />,     label: 'Landing Page' },
  { id: 'heatmap',  icon: <Map size={17} />,      label: 'Heatmap' },
  { id: 'mobile',   icon: <Phone size={17} />,    label: 'Mobile App' },
  { id: 'alert',    icon: <Siren size={17} />,    label: 'Wildlife Alert' },
  { id: 'officer',  icon: <Shield size={17} />,   label: 'Field Officer' },
  { id: 'highway',  icon: <Truck size={17} />,    label: 'Highway System' },
  { id: 'analytics',icon: <BarChart2 size={17} />,label: 'Analytics' },
];

function Sidebar({ active, onNav }: { active: string; onNav: (s: string) => void }) {
  const [hov, setHov] = useState<string | null>(null);
  return (
    <aside className="flex flex-col items-center py-4 gap-0.5 relative"
      style={{ width: 58, background: v('--bg2'), borderRight: '1px solid var(--border)', flexShrink: 0 }}>
      {/* Logo */}
      <div className="relative w-8 h-8 rounded-xl flex items-center justify-center mb-4"
        style={{ background: 'color-mix(in srgb, var(--text-1) 2%, transparent)', border: '1px solid var(--border-em)', boxShadow: 'var(--sh-glow-em)', backdropFilter: 'blur(8px)' }}>
        <div className="absolute inset-0 rounded-xl" style={{ background: 'radial-gradient(circle at top left, var(--em-glow), transparent 70%)' }} />
        <Aperture size={16} className="relative z-10" style={{ color: 'var(--em)', filter: 'drop-shadow(0 0 4px var(--em))' }} />
      </div>

      {NAV.map(n => (
        <div key={n.id} className="relative w-full flex justify-center py-0.5"
          onMouseEnter={() => setHov(n.id)} onMouseLeave={() => setHov(null)}>
          <button
            onClick={() => onNav(n.id)}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150"
            style={{
              background: active === n.id ? 'var(--em-glow)' : 'transparent',
              color: active === n.id ? 'var(--em)' : 'var(--text-3)',
            }}
          >
            {n.icon}
          </button>
          {active === n.id && <div className="sidebar-active-bar" />}
          {hov === n.id && (
            <div className="absolute left-full ml-2.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap z-50 a-fade pointer-events-none"
              style={{ background: v('--surface'), color: v('--text-1'), border: '1px solid var(--border)', boxShadow: v('--sh-card'), top: '50%', transform: 'translateY(-50%)' }}>
              {n.label}
            </div>
          )}
        </div>
      ))}

      {/* Bottom */}
      <div className="mt-auto flex flex-col items-center gap-2 pt-2 border-t w-full" style={{ borderColor: 'var(--border)' }}>
        <div className="w-1.5 h-1.5 rounded-full a-pulse-em" style={{ background: 'var(--em)' }} />
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════════════════════════════════════ */
function TopBar({ screen, onNav }: { screen: string; onNav: (s: string) => void }) {
  const { theme, toggle } = useTheme();
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const label = NAV.find(n => n.id === screen)?.label ?? 'ANIMUS';
  const sysOk = [
    { label: 'AI Engine',  ok: true  },
    { label: 'Cameras',    ok: true  },
    { label: 'Satellite',  ok: true  },
    { label: 'RF Link',    ok: false },
  ];

  return (
    <header className="flex items-center gap-3 px-5"
      style={{ height: 54, background: v('--bg2'), borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mr-1">
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: v('--text-3') }}>ANIMUS</span>
        <span style={{ color: v('--text-3') }}>/</span>
        <span className="text-xs font-semibold" style={{ color: v('--text-1') }}>{label}</span>
      </div>

      {/* System status */}
      <div className="hidden lg:flex items-center gap-3">
        {sysOk.map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`w-1 h-1 rounded-full ${s.ok ? 'a-pulse-em' : 'a-blink'}`}
              style={{ background: s.ok ? 'var(--em)' : 'var(--red)' }} />
            <span className="font-mono text-[9px] uppercase tracking-wide"
              style={{ color: s.ok ? v('--text-3') : v('--red') }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
        style={{ background: 'color-mix(in srgb, var(--text-1) 4%, transparent)', border: '1px solid var(--border)', width: 200 }}>
        <Search size={12} style={{ color: v('--text-3') }} />
        <input placeholder="Search incidents, species…"
          className="bg-transparent text-xs outline-none flex-1 min-w-0"
          style={{ color: v('--text-2'), fontFamily: 'Inter, sans-serif' }} />
        <kbd className="font-mono text-[9px] px-1 rounded flex-shrink-0" style={{ color: v('--text-3'), border: '1px solid var(--border)' }}>⌘K</kbd>
      </div>

      {/* Weather */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-[10px]"
        style={{ background: 'color-mix(in srgb, var(--text-1) 3%, transparent)', border: '1px solid var(--border)' }}>
        <CloudRain size={11} style={{ color: 'var(--blue)' }} />
        <span style={{ color: v('--text-2') }}>24°C</span>
        <span style={{ color: v('--border') }}>|</span>
        <Wind size={11} style={{ color: v('--text-3') }} />
        <span style={{ color: v('--text-3') }}>12 km/h</span>
      </div>

      {/* Clock */}
      <div className="font-mono text-sm font-semibold tabular-nums"
        style={{ color: v('--text-2'), fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.04em' }}>
        {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
        style={{ background: 'color-mix(in srgb, var(--text-1) 6%, transparent)', border: '1px solid var(--border)', color: v('--text-2') }}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      {/* Notifications */}
      <div className="relative w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
        style={{ color: v('--text-2') }}>
        <Bell size={14} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full a-blink" style={{ background: 'var(--red)' }} />
      </div>

      {/* Profile */}
      <div className="flex items-center gap-2 px-2 py-1 rounded-xl"
        style={{ border: '1px solid var(--border)' }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: 'color-mix(in srgb, var(--em) 15%, transparent)' }}>
          <User size={12} style={{ color: 'var(--em)' }} />
        </div>
        <div className="hidden md:block">
          <p className="text-[11px] font-semibold leading-none" style={{ color: v('--text-1') }}>Rajiv Menon</p>
          <p className="font-mono text-[8px] leading-none mt-0.5" style={{ color: v('--text-3') }}>ZONE CMDR</p>
        </div>
        <ChevronDown size={11} style={{ color: v('--text-3') }} />
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIVE CHART HOOK
═══════════════════════════════════════════════════════════════════════════ */
function useLiveChart(seed: number[]) {
  const [data, setData] = useState(seed.map((v, i) => ({ t: i, v })));
  useEffect(() => {
    const iv = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1].v;
        const next = Math.max(10, Math.min(300, last + (Math.random() - 0.45) * 22));
        return [...prev.slice(1), { t: prev[prev.length - 1].t + 1, v: Math.round(next) }];
      });
    }, 1400);
    return () => clearInterval(iv);
  }, []);
  return data;
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMMAND CENTER
═══════════════════════════════════════════════════════════════════════════ */
const DETECTIONS = [
  { id:'DET-8291', animal:'Indian Deer',    cam:'CAM-007', zone:'NH-44 KM 312', risk:'HIGH',     conf:97.3, ago:'0:32' },
  { id:'DET-8290', animal:'Leopard',        cam:'CAM-023', zone:'NH-8 KM 88',   risk:'CRITICAL', conf:94.1, ago:'1:14' },
  { id:'DET-8289', animal:'Wild Boar × 2', cam:'CAM-041', zone:'NH-27 KM 174', risk:'MODERATE', conf:88.6, ago:'2:47' },
  { id:'DET-8288', animal:'Elephant',       cam:'CAM-015', zone:'NH-67 KM 56',  risk:'CRITICAL', conf:99.2, ago:'3:02' },
  { id:'DET-8287', animal:'Nilgai',         cam:'CAM-088', zone:'NH-52 KM 221', risk:'HIGH',     conf:91.4, ago:'4:30' },
  { id:'DET-8286', animal:'Tiger',          cam:'CAM-061', zone:'NH-30 KM 89',  risk:'CRITICAL', conf:96.8, ago:'6:11' },
];

const SPECIES_PIE = [
  { name:'Deer',    pct:38, col:'var(--em)'    },
  { name:'Boar',    pct:22, col:'var(--amber)' },
  { name:'Nilgai',  pct:18, col:'var(--blue)'  },
  { name:'Leopard', pct:11, col:'var(--red)'   },
  { name:'Elephant',pct: 7, col:'#A78BFA'      },
  { name:'Other',   pct: 4, col:'var(--text-3)'},
];

function CommandCenter() {
  const [camIdx, setCamIdx]   = useState(0);
  const [playing, setPlaying] = useState(true);
  const chartData = useLiveChart([78,110,92,140,108,165,130,185,152,198,175,220,186,242,208,260]);

  const kpis = [
    { icon:<Eye size={16}/>,           label:'Detections',     value:'1,284', delta:{val:'+18%',up:true},  accent:'var(--em)'    },
    { icon:<AlertTriangle size={16}/>, label:'Critical Events', value:'12',    delta:{val:'+3',up:false},   accent:'var(--red)'   },
    { icon:<Shield size={16}/>,        label:'Rescues',         value:'18',    delta:{val:'+2',up:true},    accent:'var(--blue)'  },
    { icon:<Truck size={16}/>,         label:'Vehicles Alerted',value:'8,920', delta:{val:'+28%',up:true},  accent:'var(--em)'    },
    { icon:<Camera size={16}/>,        label:'Cameras Active',  value:'340',   delta:{val:'100%',up:true},  accent:'var(--forest)'},
    { icon:<Clock size={16}/>,         label:'Avg Response',    value:'18.4',  unit:'s', delta:{val:'-2s',up:true},accent:'var(--amber)'},
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden a-slide-up" style={{ padding: '12px 14px', gap: 10, background: v('--bg') }}>

      {/* KPI strip */}
      <div className="grid grid-cols-6 gap-2.5" style={{ flexShrink: 0 }}>
        {kpis.map((k, i) => <KPICard key={i} {...k} sub={undefined} />)}
      </div>

      {/* Main panels */}
      <div className="flex gap-2.5 flex-1 min-h-0">

        {/* ── CCTV panel */}
        <Card className="overflow-hidden flex flex-col" style={{ flex: '0 0 50%', padding: 0 }}>
          {/* Feed header */}
          <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)', background: 'color-mix(in srgb, var(--text-1) 2%, transparent)', flexShrink: 0 }}>
            <div className="flex items-center gap-2.5">
              <MonitorPlay size={14} style={{ color: 'var(--em)' }} />
              <span className="text-xs font-semibold" style={{ color: v('--text-1') }}>{CAMERA_FEEDS[camIdx].label}</span>
              <span className="font-mono text-[9px]" style={{ color: v('--text-3') }}>{CAMERA_FEEDS[camIdx].zone}</span>
              <Chip label={CAMERA_FEEDS[camIdx].targets.some(t=>t.risk==='CRITICAL') ? 'CRITICAL' : 'HIGH'} v={CAMERA_FEEDS[camIdx].targets.some(t=>t.risk==='CRITICAL') ? 'red' : 'amb'} dot />
            </div>
            <div className="flex items-center gap-2.5">
              <LivePill color={CAMERA_FEEDS[camIdx].targets.some(t=>t.risk==='CRITICAL') ? 'red' : 'em'} />
              <button onClick={() => setPlaying(!playing)}
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ background: 'color-mix(in srgb, var(--text-1) 6%, transparent)', color: v('--text-2') }}>
                {playing ? <Pause size={11}/> : <Play size={11}/>}
              </button>
            </div>
          </div>

          {/* Main video + YOLO */}
          <div className="flex-1 relative overflow-hidden" style={{ minHeight: 0 }}>
            <HighwayCCTV feedIdx={camIdx} playing={playing} />
          </div>

          {/* Camera selector strip */}
          <div className="flex gap-2 px-3 py-2.5 overflow-x-auto" style={{ borderTop: '1px solid var(--border)', background: 'color-mix(in srgb, var(--bg) 60%, transparent)', flexShrink: 0 }}>
            {CAMERA_FEEDS.map((f, i) => {
              const hasCrit = f.targets.some(t => t.risk === 'CRITICAL');
              const acol = hasCrit ? 'var(--red)' : 'var(--amber)';
              return (
                <button key={i} onClick={() => setCamIdx(i)}
                  className="flex-shrink-0 rounded-xl overflow-hidden transition-all"
                  style={{ width: 82, height: 52, border: `1.5px solid ${camIdx === i ? acol : 'var(--border)'}`, boxShadow: camIdx === i ? `0 0 10px color-mix(in srgb, ${acol} 40%, transparent)` : 'none', position: 'relative' }}>
                  <img src={f.img} alt={f.id} className="w-full h-full object-cover"
                    style={{ opacity: camIdx === i ? .85 : .42 }} />
                  <div className="absolute inset-0 flex flex-col justify-end p-1.5"
                    style={{ background: 'linear-gradient(transparent, rgba(5,10,20,.88))' }}>
                    <span className="font-mono text-[8px]" style={{ color: 'rgba(255,255,255,.7)' }}>{f.id}</span>
                    <span className="font-mono text-[7px] font-bold" style={{ color: acol }}>{hasCrit ? 'CRITICAL' : 'HIGH'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* ── Heatmap panel */}
        <Card className="overflow-hidden flex flex-col" style={{ flex: '0 0 28%', padding: 0 }}>
          <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div className="flex items-center gap-2">
              <Satellite size={13} style={{ color: 'var(--em)' }} />
              <span className="text-xs font-semibold" style={{ color: v('--text-1') }}>Wildlife Heatmap</span>
            </div>
            <LivePill />
          </div>
          <SatMap />
        </Card>

        {/* ── Right rail */}
        <div className="flex flex-col gap-2.5 flex-1 min-h-0 overflow-y-auto">

          {/* Risk gauge */}
          <Card className="p-4 flex flex-col items-center gap-3">
            <div className="flex items-center justify-between w-full">
              <SectionLabel>AI Risk Engine</SectionLabel>
              <Chip label="ACTIVE" v="em" dot />
            </div>
            <RiskGauge score={73} level="HIGH" />
          </Card>

          {/* Species ring */}
          <Card className="p-4">
            <SectionLabel>Species Distribution</SectionLabel>
            <div className="flex items-center gap-3">
              <div style={{ width: 76, height: 76, flexShrink: 0 }}>
                <ResponsiveContainer width={76} height={76}>
                  <PieChart>
                    <Pie data={SPECIES_PIE} dataKey="pct" cx="50%" cy="50%" innerRadius={22} outerRadius={35} startAngle={90} endAngle={-270}>
                      {SPECIES_PIE.map((s, i) => <Cell key={i} fill={s.col} stroke="transparent" />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                {SPECIES_PIE.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.col }} />
                    <span className="text-[9px] flex-1" style={{ color: v('--text-2') }}>{s.name}</span>
                    <span className="font-mono text-[9px] font-semibold" style={{ color: s.col }}>{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* AI pipeline */}
          <Card className="p-4 flex-1">
            <SectionLabel>System Pipeline</SectionLabel>
            <div className="space-y-2.5">
              {[
                { label:'Detection Model', val:'v3.2.1',  ok:true  },
                { label:'GPU Utilization', val:'94%',     ok:true  },
                { label:'Inference Speed', val:'18 ms',   ok:true  },
                { label:'Queue Depth',     val:'3 jobs',  ok:true  },
                { label:'RF Uplink',       val:'FAULT',   ok:false },
                { label:'Alerts Sent',     val:'8,920',   ok:true  },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[10px]" style={{ color: v('--text-2') }}>{r.label}</span>
                  <div className="flex items-center gap-1.5">
                    {!r.ok && <span className="w-1 h-1 rounded-full bg-red-500 a-blink" />}
                    <span className="font-mono text-[10px] font-semibold"
                      style={{ color: r.ok ? v('--em') : v('--red') }}>{r.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="flex gap-2.5" style={{ height: 162, flexShrink: 0 }}>

        {/* Live chart */}
        <Card className="px-4 pt-3 pb-2 flex flex-col gap-1.5" style={{ flex: '0 0 42%' }}>
          <div className="flex items-center justify-between" style={{ flexShrink: 0 }}>
            <SectionLabel>Detection Timeline · Live</SectionLabel>
            <LivePill />
          </div>
          <ResponsiveContainer width="100%" height={118}>
            <AreaChart data={chartData} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
              <defs>
                <linearGradient id="gEm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--em)" stopOpacity={.3} />
                  <stop offset="100%" stopColor="var(--em)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 'auto']} hide />
              <Tooltip
                contentStyle={{ background: v('--surface'), border: '1px solid var(--border)', borderRadius: 10, fontSize: 11, color: v('--text-1'), fontFamily: 'JetBrains Mono, monospace' }}
                labelStyle={{ display: 'none' }}
                formatter={(val: unknown) => [`${val} detections`, '']}
              />
              <Area type="monotone" dataKey="v" stroke="var(--em)" strokeWidth={1.5} fill="url(#gEm)" dot={false} animationDuration={600} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Detection feed */}
        <Card className="flex flex-col overflow-hidden" style={{ flex: '0 0 32%', padding: 0 }}>
          <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <SectionLabel>Detection Feed</SectionLabel>
            <LivePill />
          </div>
          <div className="overflow-y-auto flex-1">
            {DETECTIONS.map((d, i) => (
              <button key={i}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors"
                style={{ borderBottom: '1px solid var(--border)', background: i === 0 ? 'color-mix(in srgb, var(--text-1) 2%, transparent)' : 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--text-1) 3%, transparent)')}
                onMouseLeave={e => (e.currentTarget.style.background = i === 0 ? 'color-mix(in srgb, var(--text-1) 2%, transparent)' : 'transparent')}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 a-blink" style={{ background: riskCSS(d.risk) }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold truncate" style={{ color: v('--text-1') }}>{d.animal}</p>
                  <p className="font-mono text-[9px] truncate" style={{ color: v('--text-3') }}>{d.cam} · {d.zone}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <Chip label={d.risk} v={riskVariant(d.risk)} />
                  <span className="font-mono text-[8px]" style={{ color: v('--text-3') }}>{d.ago}s ago</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Alert queue */}
        <Card className="flex flex-col overflow-hidden flex-1" style={{ padding: 0 }}>
          <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <SectionLabel>Alert Queue</SectionLabel>
            <Chip label="4 ACTIVE" v="red" dot />
          </div>
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
            {[
              { title:'Elephant on carriageway',   sub:'NH-67 · Officer dispatched', risk:'CRITICAL', t:'2m' },
              { title:'Leopard crossing detected',  sub:'NH-8 · LED boards active',   risk:'CRITICAL', t:'5m' },
              { title:'Deer group — 3 animals',     sub:'NH-44 · App alert sent',     risk:'HIGH',     t:'8m' },
              { title:'Wild Boar near shoulder',    sub:'NH-27 · Monitoring',         risk:'MODERATE', t:'11m' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 px-2.5 py-2 rounded-xl transition-colors cursor-pointer"
                style={{ background: 'color-mix(in srgb, var(--text-1) 2.5%, transparent)', border: '1px solid var(--border)' }}>
                <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `color-mix(in srgb, ${riskCSS(a.risk)} 12%, transparent)` }}>
                  <AlertTriangle size={10} style={{ color: riskCSS(a.risk) }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold truncate" style={{ color: v('--text-1') }}>{a.title}</p>
                  <p className="text-[9px] truncate mt-0.5" style={{ color: v('--text-3') }}>{a.sub}</p>
                </div>
                <span className="font-mono text-[8px] flex-shrink-0 mt-0.5" style={{ color: v('--text-3') }}>{a.t}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════════════════════════════ */
function LandingPage({ onNav }: { onNav: (s: string) => void }) {
  const features = [
    { icon:<Eye size={20} style={{color:'var(--em)'}}/>,    title:'Computer Vision AI',    desc:'47-species recognition at 98.7% accuracy, 24/7, across 340+ cameras.' },
    { icon:<Zap size={20} style={{color:'var(--amber)'}}/>, title:'Predictive Risk Engine', desc:'ML scores collision probability from weather, season & historical data.' },
    { icon:<Radio size={20} style={{color:'var(--blue)'}}/>,title:'Instant Driver Alerts',  desc:'Multi-channel: LED boards, app push, and V2I in under 2 seconds.' },
    { icon:<Shield size={20} style={{color:'var(--em)'}}/>, title:'Auto Rescue Dispatch',   desc:'AI creates rescue tickets and routes nearest forest officers.' },
    { icon:<Globe size={20} style={{color:'#A78BFA'}}/>,    title:'Corridor Mapping',       desc:'Satellite + ground data maps safe wildlife migration routes.' },
    { icon:<Cpu size={20} style={{color:'var(--text-2)'}}/>,title:'National Dashboard',     desc:'Unified command for NHAI, Forest Departments & Wildlife Boards.' },
  ];
  return (
    <div className="overflow-y-auto h-full" style={{ background: v('--bg') }}>
      {/* Hero */}
      <div className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=1800&h=900&fit=crop&auto=format" alt="Night highway" className="w-full h-full object-cover" style={{ opacity: .2 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, transparent 30%, transparent 65%, var(--bg) 100%)' }} />
        </div>
        <nav className="relative z-10 flex items-center justify-between px-10 py-5" style={{ borderBottom: '1px solid var(--border)', background: 'color-mix(in srgb, var(--bg) 80%, transparent)', backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--text-1) 2%, transparent)', border: '1px solid var(--border-em)', boxShadow: 'var(--sh-glow-em)' }}>
              <div className="absolute inset-0 rounded-xl" style={{ background: 'radial-gradient(circle at top left, var(--em-glow), transparent 70%)' }} />
              <Aperture size={16} className="relative z-10" style={{ color: 'var(--em)', filter: 'drop-shadow(0 0 4px var(--em))' }} />
            </div>
            <span className="font-dis font-bold text-xl grad-em tracking-tight">ANIMUS</span>
          </div>
          <div className="flex gap-4">
            <Btn sm onClick={() => onNav('command')}>Command Center</Btn>
          </div>
        </nav>
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8 py-24 a-slide-up">
          <Chip label="AI-Powered Wildlife Safety · India" v="em" dot />
          <h1 className="font-dis font-black mt-8 leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)', color: v('--text-1') }}>
            Protecting Every Life<br /><span className="grad-em">on the Road.</span>
          </h1>
          <p className="mt-6 max-w-xl leading-relaxed" style={{ color: v('--text-2'), fontSize: '1.05rem' }}>
            ANIMUS uses AI to detect animals, predict collision risks, alert drivers, and connect rescue teams instantly across India's national highways.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Btn lg onClick={() => onNav('command')}><Activity size={17} /> Live Monitoring</Btn>
            <Btn variant="ghost" lg onClick={() => onNav('mobile')}><Phone size={17} /> Report Animal</Btn>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-4" style={{ borderTop: '1px solid var(--border)', background: 'color-mix(in srgb, var(--bg) 85%, transparent)', backdropFilter: 'blur(20px)' }}>
          {[
            {n:'2.4M+',l:'Animals Protected'},{n:'98.7%',l:'Detection Accuracy'},
            {n:'340+', l:'Highways Monitored'},{n:'18 s', l:'Avg Response Time'},
          ].map((s,i)=>(
            <div key={i} className={`flex items-center gap-4 px-8 py-6 ${i<3?'border-r':''}`} style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="font-dis font-black text-2xl grad-em">{s.n}</p>
                <p className="text-xs mt-0.5" style={{ color: v('--text-3') }}>{s.l}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Features */}
      <section className="px-10 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <Chip label="Platform Capabilities" v="em" dot />
          <h2 className="font-dis mt-5 font-black text-3xl tracking-tight" style={{ color: v('--text-1') }}>Built for Zero Animal Fatalities</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f,i)=>(
            <Card key={i} className="p-6 lift" onClick={undefined}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'color-mix(in srgb, var(--text-1) 5%, transparent)' }}>{f.icon}</div>
              <h3 className="font-semibold mb-2" style={{ color: v('--text-1') }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: v('--text-2') }}>{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>
      <footer className="px-10 py-6 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="relative w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--text-1) 2%, transparent)', border: '1px solid var(--border-em)' }}>
            <div className="absolute inset-0 rounded-lg" style={{ background: 'radial-gradient(circle at top left, var(--em-glow), transparent 70%)' }} />
            <Aperture size={13} className="relative z-10" style={{ color: 'var(--em)' }} />
          </div>
          <span className="font-dis font-bold grad-em">ANIMUS</span>
        </div>
        <p className="text-xs" style={{ color: v('--text-3') }}>© 2026 ANIMUS · Protecting every life on the road.</p>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   WILDLIFE ALERT SCREEN
═══════════════════════════════════════════════════════════════════════════ */
function WildlifeAlert() {
  const [ack, setAck] = useState(false);
  if (ack) return (
    <div className="flex flex-col items-center justify-center h-full gap-5" style={{ background: v('--bg') }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--em) 12%, transparent)', boxShadow: 'var(--sh-glow-em)' }}>
        <CheckCircle2 size={32} style={{ color: 'var(--em)' }} />
      </div>
      <p className="font-dis font-bold text-xl" style={{ color: v('--text-1') }}>Alert Acknowledged</p>
      <p className="text-sm" style={{ color: v('--text-3') }}>Rescue team notified · Response time: 18 s</p>
      <Btn onClick={() => setAck(false)}>Reset Demo</Btn>
    </div>
  );
  return (
    <div className="flex flex-col items-center justify-center h-full overflow-y-auto py-12 px-6 relative" style={{ background: v('--bg') }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 rounded-full a-detect" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--red) 8%, transparent) 0%, transparent 70%)' }} />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center max-w-md gap-6 a-slide-up">
        <Chip label="EMERGENCY ALERT · ACTIVE" v="red" dot />
        <div className="relative w-28 h-28">
          <div className="absolute inset-0 rounded-full a-pulse-red" style={{ background: 'color-mix(in srgb, var(--red) 12%, transparent)', border: '2px solid var(--border-red)' }} />
          <div className="absolute inset-4 rounded-full flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--red) 18%, transparent)' }}>
            <AlertCircle size={44} style={{ color: 'var(--red)' }} />
          </div>
        </div>
        <h1 className="font-dis font-black leading-tight" style={{ fontSize: 56, color: 'var(--red)', letterSpacing: '-0.03em' }}>Wildlife<br />Ahead</h1>
        <Card className="w-full p-5 glass-red">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label:'Detected', val:'Deer', icon:<Eye size={18} style={{color:'var(--red)'}}/>},
              { label:'Distance', val:'120 m', icon:<Navigation size={18} style={{color:'var(--amber)'}}/>},
              { label:'Action',   val:'SLOW',  icon:<Truck size={18} style={{color:'var(--text-1)'}}/>},
            ].map((s,i)=>(
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--text-1) 6%, transparent)' }}>{s.icon}</div>
                <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: v('--text-3') }}>{s.label}</span>
                <span className="font-mono font-bold text-sm" style={{ color: v('--text-1') }}>{s.val}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'color-mix(in srgb, var(--amber) 8%, transparent)', border: '1px solid var(--border-amb)' }}>
            <TrendingUp size={16} style={{ color: 'var(--amber)' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: v('--text-1') }}>Reduce Speed to 30 km/h</p>
              <p className="text-xs mt-0.5" style={{ color: v('--text-2') }}>Move to inner lane · Forest Officer dispatched</p>
            </div>
          </div>
        </Card>
        <div className="flex gap-4 w-full">
          <Btn variant="ghost" className="flex-1" onClick={() => setAck(true)}>Dismiss</Btn>
          <Btn variant="red" className="flex-1" onClick={() => setAck(true)}><Check size={15} /> Acknowledged</Btn>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYTICS SCREEN
═══════════════════════════════════════════════════════════════════════════ */
const DET_CHART_DATA = [
  {date:'Sep 13',detections:145,rescued:102},{date:'Sep 14',detections:98,rescued:79},
  {date:'Sep 15',detections:167,rescued:134},{date:'Sep 16',detections:201,rescued:178},
  {date:'Sep 17',detections:183,rescued:160},{date:'Sep 18',detections:224,rescued:201},
  {date:'Sep 19',detections:189,rescued:168},{date:'Sep 20',detections:242,rescued:218},
];
const MONTHLY = [
  {month:'Apr',accidents:24,prevented:48},{month:'May',accidents:19,prevented:56},
  {month:'Jun',accidents:22,prevented:62},{month:'Jul',accidents:17,prevented:74},
  {month:'Aug',accidents:12,prevented:88},{month:'Sep',accidents:8,prevented:96},
];

function Analytics() {
  const tooltipStyle = {
    contentStyle: { background: v('--surface'), border: '1px solid var(--border)', borderRadius: 12, color: v('--text-1'), fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
    labelStyle: { color: v('--text-3') },
  };
  return (
    <div className="p-5 overflow-y-auto h-full flex flex-col gap-4 a-slide-up" style={{ background: v('--bg') }}>
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon:<Eye size={16}/>, label:'Total Detections', value:'1,327', delta:{val:'+18%',up:true}, accent:'var(--em)' },
          { icon:<Shield size={16}/>, label:'Animals Rescued', value:'1,190', delta:{val:'+22%',up:true}, accent:'var(--blue)' },
          { icon:<AlertTriangle size={16}/>, label:'Accidents This Month', value:'8', delta:{val:'-67%',up:true}, accent:'var(--amber)' },
          { icon:<TrendingUp size={16}/>, label:'Prevention Rate', value:'96%', delta:{val:'+4%',up:true}, accent:'var(--forest)' },
        ].map((k,i) => <KPICard key={i} {...k} sub={undefined} />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <SectionLabel>Detections Over Time</SectionLabel>
            <Chip label="LIVE" v="em" dot />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={DET_CHART_DATA}>
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--em)" stopOpacity={.3}/><stop offset="100%" stopColor="var(--em)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--blue)" stopOpacity={.25}/><stop offset="100%" stopColor="var(--blue)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="detections" stroke="var(--em)"   strokeWidth={1.5} fill="url(#gA)" name="Detections" dot={false} />
              <Area type="monotone" dataKey="rescued"    stroke="var(--blue)" strokeWidth={1.5} fill="url(#gB)" name="Rescued"    dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <SectionLabel>Accident vs Prevention Trend</SectionLabel>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY} barGap={4}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="accidents" fill="var(--red)"   radius={[4,4,0,0]} name="Accidents"  opacity={.85} />
              <Bar dataKey="prevented" fill="var(--em)"    radius={[4,4,0,0]} name="Prevented"  opacity={.85} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <SectionLabel>Species Distribution</SectionLabel>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={SPECIES_PIE} dataKey="pct" cx="50%" cy="50%" innerRadius={42} outerRadius={62} startAngle={90} endAngle={-270}>
                  {SPECIES_PIE.map((s,i) => <Cell key={i} fill={s.col} stroke="transparent"/>)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 flex-1">
              {SPECIES_PIE.map((s,i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:s.col}}/>
                  <span className="text-xs flex-1" style={{color:v('--text-2')}}>{s.name}</span>
                  <span className="font-mono text-xs font-semibold" style={{color:s.col}}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <SectionLabel>Response Time by Zone</SectionLabel>
          <div className="space-y-3 mt-2">
            {[
              {zone:'Zone A · Jabalpur',   t:14},{zone:'Zone B · Ranthambhore',t:18},
              {zone:'Zone C · Kanha',      t:22},{zone:'Zone D · Mudumalai',   t:16},
              {zone:'Zone E · Corbett',    t:28},{zone:'Zone F · Kaziranga',   t:12},
            ].map((z,i) => {
              const col = z.t < 16 ? 'var(--em)' : z.t < 22 ? 'var(--amber)' : 'var(--red)';
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs w-36 truncate" style={{color:v('--text-2')}}>{z.zone}</span>
                  <div className="flex-1 h-1.5 rounded-full" style={{background:'var(--border)'}}>
                    <div className="h-full rounded-full transition-all" style={{width:`${(z.t/30)*100}%`,background:col}}/>
                  </div>
                  <span className="font-mono text-xs font-semibold w-10 text-right" style={{color:col}}>{z.t}s</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   WILDLIFE HEATMAP SCREEN (Full)
═══════════════════════════════════════════════════════════════════════════ */
function HeatmapScreen() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'cameras' | 'corridors'>('all');
  const corridors = [
    { name: 'Jabalpur Corridor', animals: 'Deer, Tiger', risk: 'HIGH',     length: '42 km', cameras: 18 },
    { name: 'Ranthambhore Gate', animals: 'Leopard',     risk: 'CRITICAL', length: '28 km', cameras: 12 },
    { name: 'Kanha Buffer Zone', animals: 'Wild Boar',   risk: 'MODERATE', length: '35 km', cameras: 15 },
    { name: 'Mudumalai NP',      animals: 'Elephant',    risk: 'CRITICAL', length: '51 km', cameras: 22 },
    { name: 'Corbett Reserve',   animals: 'Tiger, Bear', risk: 'HIGH',     length: '38 km', cameras: 16 },
    { name: 'Kaziranga NP',      animals: 'Rhino',       risk: 'MODERATE', length: '29 km', cameras: 11 },
  ];
  return (
    <div className="flex h-full overflow-hidden a-slide-up" style={{ background: v('--bg') }}>
      <div className="flex flex-col gap-3 p-4 overflow-y-auto" style={{ width: 300, flexShrink: 0, borderRight: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm" style={{ color: v('--text-1') }}>Wildlife Corridors</p>
          <Chip label="6 ACTIVE" v="em" dot />
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'color-mix(in srgb, var(--text-1) 4%, transparent)' }}>
          {(['all', 'critical', 'cameras', 'corridors'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex-1 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide transition-all"
              style={{ background: filter === f ? 'var(--surface)' : 'transparent', color: filter === f ? v('--em') : v('--text-3'), boxShadow: filter === f ? v('--sh-card') : 'none' }}>
              {f}
            </button>
          ))}
        </div>
        {corridors.map((c, i) => (
          <div key={i} className="p-3 rounded-xl cursor-pointer transition-all lift"
            style={{ background: 'color-mix(in srgb, var(--text-1) 3%, transparent)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs font-semibold" style={{ color: v('--text-1') }}>{c.name}</p>
              <Chip label={c.risk} v={riskVariant(c.risk)} sm />
            </div>
            <p className="text-[10px] mb-2" style={{ color: v('--text-3') }}>{c.animals}</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Truck size={9} style={{ color: v('--text-3') }} />
                <span className="font-mono text-[9px]" style={{ color: v('--text-3') }}>{c.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Camera size={9} style={{ color: 'var(--em)' }} />
                <span className="font-mono text-[9px]" style={{ color: 'var(--em)' }}>{c.cameras} cams</span>
              </div>
            </div>
          </div>
        ))}
        <Card className="p-3 mt-1">
          <SectionLabel>Network Stats</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {[{ v: '340', l: 'Cameras', c: 'var(--em)' }, { v: '6', l: 'Zones', c: 'var(--blue)' }, { v: '223', l: 'km Roads', c: 'var(--amber)' }, { v: '47', l: 'Species', c: 'var(--forest)' }].map((s, i) => (
              <div key={i} className="flex flex-col items-center py-2 rounded-lg" style={{ background: 'color-mix(in srgb, var(--text-1) 3%, transparent)' }}>
                <span className="font-mono font-black text-lg" style={{ color: s.c }}>{s.v}</span>
                <span className="font-mono text-[8px]" style={{ color: v('--text-3') }}>{s.l}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1200&h=800&fit=crop&auto=format" alt="Forest map" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.18 }} />
        <div className="absolute inset-0 sat-grid" />
        {[{ x: 20, y: 35, r: 120, c: 'rgba(239,68,68,.18)' }, { x: 50, y: 25, r: 90, c: 'rgba(239,68,68,.22)' }, { x: 70, y: 55, r: 80, c: 'rgba(245,158,11,.15)' }, { x: 35, y: 65, r: 70, c: 'rgba(239,68,68,.14)' }, { x: 15, y: 52, r: 100, c: 'rgba(245,158,11,.12)' }].map((b, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.r * 2, height: b.r * 2, transform: 'translate(-50%,-50%)', background: `radial-gradient(circle, ${b.c} 0%, transparent 70%)`, filter: 'blur(20px)' }} />
        ))}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: .45 }}>
          <line x1="0" y1="46%" x2="100%" y2="44%" stroke="rgba(240,246,255,.18)" strokeWidth="2" strokeDasharray="14 8" />
          <line x1="28%" y1="0" x2="32%" y2="100%" stroke="rgba(240,246,255,.14)" strokeWidth="1.5" strokeDasharray="10 5" />
        </svg>
        {MAP_MARKERS.map((m, i) => {
          const mc = { hot: { bg: 'rgba(239,68,68,.2)', border: 'var(--red)', icon: '⚠' }, cam: { bg: 'rgba(34,197,94,.18)', border: 'var(--em)', icon: '◉' }, acc: { bg: 'rgba(245,158,11,.2)', border: 'var(--amber)', icon: '✕' }, rescue: { bg: 'rgba(96,165,250,.2)', border: 'var(--blue)', icon: '✦' } }[m.type];
          if (!mc) return null;
          return (
            <div key={i} className="absolute" style={{ left: `${m.x + 10}%`, top: `${m.y + 5}%`, transform: 'translate(-50%,-50%)' }}>
              <div className="absolute rounded-full a-map-pulse pointer-events-none" style={{ width: 28, height: 28, top: -2, left: -2, background: mc.border, opacity: .2 }} />
              <div className="relative w-6 h-6 rounded-full flex items-center justify-center border" style={{ background: mc.bg, borderColor: mc.border, boxShadow: `0 0 10px color-mix(in srgb, ${mc.border} 50%, transparent)` }}>
                <span className="text-[9px] font-bold" style={{ color: mc.border }}>{mc.icon}</span>
              </div>
            </div>
          );
        })}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}>
            <Map size={14} style={{ color: 'var(--em)' }} />
            <span className="text-xs font-semibold" style={{ color: v('--text-1') }}>Wildlife Activity Heatmap</span>
            <LivePill />
          </div>
          <div className="flex items-center gap-2">
            {[{ c: 'var(--red)', l: 'Critical' }, { c: 'var(--amber)', l: 'High' }, { c: 'var(--em)', l: 'Camera' }, { c: 'var(--blue)', l: 'Rescue' }].map((leg, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: leg.c }} />
                <span className="text-[10px] font-medium" style={{ color: v('--text-2') }}>{leg.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex gap-3">
          {[{ icon: <Camera size={14} />, v: '340', l: 'Active Cameras', c: 'var(--em)' }, { icon: <AlertTriangle size={14} />, v: '14', l: 'Active Hotspots', c: 'var(--red)' }, { icon: <Navigation size={14} />, v: '92', l: 'Animals Tracked', c: 'var(--amber)' }, { icon: <MapPin size={14} />, v: '7', l: 'Corridors Mapped', c: 'var(--forest)' }].map((s, i) => (
            <div key={i} className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in srgb, ${s.c} 12%, transparent)`, color: s.c }}>{s.icon}</div>
              <div>
                <p className="font-mono font-black text-lg" style={{ color: s.c, fontFamily: 'JetBrains Mono, monospace' }}>{s.v}</p>
                <p className="text-[9px] font-medium" style={{ color: v('--text-3') }}>{s.l}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE APP SCREEN
═══════════════════════════════════════════════════════════════════════════ */
function MobileAppScreen() {
  const [reported, setReported] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const animals = ['Deer', 'Elephant', 'Leopard', 'Tiger', 'Wild Boar', 'Nilgai', 'Bear', 'Other'];
  if (reported) return (
    <div className="flex flex-col items-center justify-center h-full gap-6 a-slide-up" style={{ background: v('--bg') }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center a-pulse-em" style={{ background: 'color-mix(in srgb, var(--em) 12%, transparent)', border: '2px solid var(--border-em)' }}>
        <CheckCircle2 size={40} style={{ color: 'var(--em)' }} />
      </div>
      <div className="text-center">
        <p className="font-dis font-black text-2xl" style={{ color: v('--text-1') }}>Report Submitted!</p>
        <p className="text-sm mt-2" style={{ color: v('--text-3') }}>Forest officers have been notified.</p>
        <p className="font-mono text-xs mt-1" style={{ color: 'var(--em)' }}>Expected response: ~18 seconds</p>
      </div>
      <div className="flex flex-col gap-2 w-72">
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'color-mix(in srgb, var(--em) 8%, transparent)', border: '1px solid var(--border-em)' }}>
          <Shield size={16} style={{ color: 'var(--em)' }} /><div><p className="text-xs font-semibold" style={{ color: v('--text-1') }}>Officer En Route</p><p className="text-[10px]" style={{ color: v('--text-3') }}>Unit F-07 · 2.3 km away</p></div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'color-mix(in srgb, var(--amber) 8%, transparent)', border: '1px solid var(--border-amb)' }}>
          <Truck size={16} style={{ color: 'var(--amber)' }} /><div><p className="text-xs font-semibold" style={{ color: v('--text-1') }}>VMS Boards Activated</p><p className="text-[10px]" style={{ color: v('--text-3') }}>3 LED boards alerting traffic</p></div>
        </div>
      </div>
      <Btn onClick={() => { setReported(false); setSelectedAnimal(null); }}>Report Another</Btn>
    </div>
  );
  return (
    <div className="flex h-full overflow-hidden a-slide-up" style={{ background: v('--bg') }}>
      <div className="flex-1 flex items-center justify-center p-8" style={{ borderRight: '1px solid var(--border)' }}>
        <div className="relative" style={{ width: 320, height: 580 }}>
          <div className="w-full h-full rounded-[40px] overflow-hidden flex flex-col" style={{ background: 'var(--bg2)', border: '2px solid var(--border)', boxShadow: '0 30px 80px rgba(0,0,0,0.6), var(--sh-glow-em)' }}>
            <div className="flex items-center justify-between px-6 pt-4 pb-2">
              <span className="font-mono text-[10px]" style={{ color: v('--text-3') }}>9:41</span>
              <div className="w-20 h-4 rounded-full" style={{ background: 'var(--surface)' }} />
              <div className="flex items-center gap-1"><Signal size={10} style={{ color: v('--text-3') }} /><Bell size={10} style={{ color: v('--text-3') }} /></div>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 pt-2 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="relative w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--text-1) 2%, transparent)', border: '1px solid var(--border-em)' }}>
                    <div className="absolute inset-0 rounded-lg" style={{ background: 'radial-gradient(circle at top left, var(--em-glow), transparent 70%)' }} />
                    <Aperture size={12} className="relative z-10" style={{ color: 'var(--em)' }} />
                  </div>
                  <span className="font-dis font-bold text-sm grad-em">ANIMUS</span>
                </div>
                <p className="text-[11px] font-semibold" style={{ color: v('--text-1') }}>Citizen Wildlife Reporter</p>
                <p className="text-[9px]" style={{ color: v('--text-3') }}>NH-44 KM 312 · Jabalpur</p>
              </div>
              <div className="mx-3 mt-3 p-2.5 rounded-xl flex items-center gap-2 a-detect" style={{ background: 'color-mix(in srgb, var(--red) 10%, transparent)', border: '1px solid var(--border-red)' }}>
                <span className="w-1.5 h-1.5 rounded-full a-blink" style={{ background: 'var(--red)' }} />
                <span className="text-[9px] font-semibold" style={{ color: 'var(--red)' }}>⚠ Wildlife Detected 500m ahead</span>
              </div>
              <div className="flex-1 overflow-y-auto px-3 pt-3 pb-2">
                <p className="text-[10px] font-semibold mb-2" style={{ color: v('--text-2') }}>SELECT ANIMAL TYPE</p>
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {animals.map(a => (
                    <button key={a} onClick={() => setSelectedAnimal(a)} className="py-2 rounded-xl text-[10px] font-semibold transition-all"
                      style={{ background: selectedAnimal === a ? 'color-mix(in srgb, var(--em) 12%, transparent)' : 'color-mix(in srgb, var(--text-1) 3%, transparent)', border: `1px solid ${selectedAnimal === a ? 'var(--border-em)' : 'var(--border)'}`, color: selectedAnimal === a ? 'var(--em)' : v('--text-2') }}>
                      {a}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] font-semibold mb-1.5" style={{ color: v('--text-2') }}>LOCATION</p>
                <div className="flex items-center gap-2 p-2 rounded-xl mb-3" style={{ background: 'color-mix(in srgb, var(--em) 6%, transparent)', border: '1px solid var(--border-em)' }}>
                  <MapPin size={10} style={{ color: 'var(--em)' }} /><span className="text-[9px] font-mono" style={{ color: v('--text-2') }}>23.1627° N, 79.9347° E · Auto</span>
                </div>
                <button onClick={() => selectedAnimal && setReported(true)} disabled={!selectedAnimal}
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-40"
                  style={{ background: 'var(--em)', color: '#000', boxShadow: selectedAnimal ? 'var(--sh-glow-em)' : 'none' }}>
                  🚨 Report Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5 overflow-y-auto" style={{ width: 360 }}>
        <div>
          <Chip label="Citizen App" v="em" dot />
          <h2 className="font-dis font-black text-2xl mt-3" style={{ color: v('--text-1') }}>Report Wildlife Sightings</h2>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: v('--text-2') }}>Help protect animals and drivers by reporting wildlife near highways. Your report triggers instant alerts to forest officers and roadside VMS boards.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[{ icon: <Smartphone size={18} />, title: 'App Reports', val: '12,847', c: 'var(--em)' }, { icon: <Users size={18} />, title: 'Citizens Active', val: '4,291', c: 'var(--blue)' }, { icon: <Clock size={18} />, title: 'Avg Response', val: '18 s', c: 'var(--amber)' }, { icon: <Award size={18} />, title: 'Lives Saved', val: '892', c: 'var(--forest)' }].map((s, i) => (
            <div key={i} className="p-3 rounded-xl" style={{ background: 'color-mix(in srgb, var(--text-1) 3%, transparent)', border: '1px solid var(--border)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `color-mix(in srgb, ${s.c} 12%, transparent)`, color: s.c }}>{s.icon}</div>
              <p className="font-mono font-black text-xl" style={{ color: s.c }}>{s.val}</p>
              <p className="text-[10px] mt-0.5" style={{ color: v('--text-3') }}>{s.title}</p>
            </div>
          ))}
        </div>
        <Card className="p-4">
          <SectionLabel>How It Works</SectionLabel>
          <div className="space-y-3">
            {[{ n: '01', t: 'Spot & Report', d: 'Select animal type and submit with auto-detected location.' }, { n: '02', t: 'AI Verification', d: 'ANIMUS cross-checks with nearby camera feeds instantly.' }, { n: '03', t: 'Alerts Dispatched', d: 'LED boards, driver apps, and forest officers notified in <2s.' }, { n: '04', t: 'Rescue Coordinated', d: 'Nearest officer routed with real-time navigation.' }].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="font-mono text-[10px] font-black w-6 mt-0.5" style={{ color: 'var(--em)' }}>{step.n}</span>
                <div><p className="text-xs font-semibold" style={{ color: v('--text-1') }}>{step.t}</p><p className="text-[10px] mt-0.5" style={{ color: v('--text-3') }}>{step.d}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FIELD OFFICER SCREEN
═══════════════════════════════════════════════════════════════════════════ */
function FieldOfficerScreen() {
  const [activeTab, setActiveTab] = useState<'missions' | 'patrol' | 'comms'>('missions');
  const [missionStatus, setMissionStatus] = useState<Record<number, string>>({});
  const missions = [
    { id: 'M-0821', type: 'RESCUE', priority: 'CRITICAL', animal: 'Elephant', loc: 'NH-67 KM 56 · Mudumalai', dist: '1.2 km', eta: '4 min', officer: 'Ravi K.' },
    { id: 'M-0820', type: 'MONITOR', priority: 'HIGH', animal: 'Leopard', loc: 'NH-8 KM 88 · Ranthambhore', dist: '3.8 km', eta: '11 min', officer: 'Priya S.' },
    { id: 'M-0819', type: 'PATROL', priority: 'MODERATE', animal: 'Wild Boar', loc: 'NH-27 KM 174 · Kanha', dist: '6.1 km', eta: '18 min', officer: 'Arun M.' },
    { id: 'M-0818', type: 'RESCUE', priority: 'HIGH', animal: 'Deer × 2', loc: 'NH-44 KM 312 · Jabalpur', dist: '2.5 km', eta: '8 min', officer: 'Sunita R.' },
  ];
  const officers = [
    { name: 'Ravi K.', id: 'F-07', zone: 'Mudumalai', status: 'ON MISSION', bat: 78 },
    { name: 'Priya S.', id: 'F-12', zone: 'Ranthambhore', status: 'EN ROUTE', bat: 91 },
    { name: 'Arun M.', id: 'F-03', zone: 'Kanha', status: 'STANDBY', bat: 65 },
    { name: 'Sunita R.', id: 'F-09', zone: 'Jabalpur', status: 'ON MISSION', bat: 55 },
    { name: 'Dev P.', id: 'F-15', zone: 'Corbett', status: 'STANDBY', bat: 82 },
  ];
  const [commsInput, setCommsInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'Ravi K. (F-07)', msg: 'Elephant secured. Moving off road. Requesting additional support.', t: '09:41', type: 'incoming', risk: 'CRITICAL' },
    { from: 'Command', msg: 'Unit F-12 dispatched to assist. ETA 6 minutes.', t: '09:42', type: 'outgoing', risk: '' },
    { from: 'Priya S. (F-12)', msg: 'En route to NH-67. Traffic cleared on both sides.', t: '09:43', type: 'incoming', risk: 'HIGH' },
    { from: 'AI System', msg: '⚡ New detection: Leopard · CAM-023 · NH-8 KM 88 · Confidence 94.1%', t: '09:44', type: 'system', risk: 'CRITICAL' },
    { from: 'Arun M. (F-03)', msg: 'Patrol complete on NH-27 segment. All clear.', t: '09:45', type: 'incoming', risk: '' }
  ]);

  const handleSend = () => {
    if (!commsInput.trim()) return;
    const t = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    setMessages([...messages, { from: 'Command', msg: commsInput, t, type: 'outgoing', risk: '' }]);
    setCommsInput('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden a-slide-up" style={{ background: v('--bg') }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--blue) 12%, transparent)', color: 'var(--blue)' }}><Shield size={18} /></div>
          <div><p className="font-semibold text-sm" style={{ color: v('--text-1') }}>Field Officer Command</p><p className="font-mono text-[9px]" style={{ color: v('--text-3') }}>Zone Operations Centre · 5 Officers Active</p></div>
        </div>
        <div className="flex items-center gap-2">
          <Chip label="5 ONLINE" v="em" dot />
          <Chip label="2 ON MISSION" v="amb" />
        </div>
      </div>
      <div className="flex gap-1 px-5 pt-3 pb-0" style={{ flexShrink: 0 }}>
        {(['missions', 'patrol', 'comms'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className="px-4 py-2 rounded-t-xl text-xs font-semibold uppercase tracking-wide transition-all"
            style={{ background: activeTab === tab ? 'var(--card)' : 'transparent', color: activeTab === tab ? v('--text-1') : v('--text-3'), border: activeTab === tab ? '1px solid var(--border)' : '1px solid transparent', borderBottom: activeTab === tab ? '1px solid var(--card)' : '1px solid var(--border)' }}>
            {tab === 'missions' ? '🎯 Missions' : tab === 'patrol' ? '🛡 Officers' : '📡 Comms'}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden" style={{ borderTop: '1px solid var(--border)', marginTop: -1 }}>
        {activeTab === 'missions' && (
          <div className="flex gap-4 p-5 h-full overflow-hidden">
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
              <SectionLabel>Active Missions ({missions.length})</SectionLabel>
              {missions.map((m, i) => {
                const status = missionStatus[i];
                return (
                  <Card key={i} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px]" style={{ color: v('--text-3') }}>{m.id}</span>
                        <Chip label={m.type} v={m.type === 'RESCUE' ? 'red' : m.type === 'MONITOR' ? 'amb' : 'dim'} sm />
                        <Chip label={m.priority} v={riskVariant(m.priority)} sm />
                      </div>
                      {status && <Chip label={status} v="em" sm />}
                    </div>
                    <div className="flex items-center gap-2 mb-1"><AlertTriangle size={12} style={{ color: riskCSS(m.priority) }} /><p className="text-sm font-semibold" style={{ color: v('--text-1') }}>{m.animal}</p></div>
                    <p className="text-[10px] mb-3" style={{ color: v('--text-3') }}>{m.loc}</p>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1"><Navigation size={9} style={{ color: v('--text-3') }} /><span className="font-mono text-[9px]" style={{ color: v('--text-2') }}>{m.dist}</span></div>
                      <div className="flex items-center gap-1"><Clock size={9} style={{ color: v('--text-3') }} /><span className="font-mono text-[9px]" style={{ color: v('--text-2') }}>ETA {m.eta}</span></div>
                      <div className="flex items-center gap-1"><User size={9} style={{ color: 'var(--em)' }} /><span className="font-mono text-[9px]" style={{ color: 'var(--em)' }}>{m.officer}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <Btn sm variant="surface" className="flex-1" onClick={() => setMissionStatus(p => ({ ...p, [i]: 'ACCEPTED' }))}><Check size={10} /> Accept</Btn>
                      <Btn sm variant="em" className="flex-1" onClick={() => setMissionStatus(p => ({ ...p, [i]: 'DISPATCHED' }))}><Navigation size={10} /> Dispatch</Btn>
                    </div>
                  </Card>
                );
              })}
            </div>
            <div className="flex flex-col gap-3" style={{ width: 260, flexShrink: 0 }}>
              <SectionLabel>Today's Summary</SectionLabel>
              <div className="grid grid-cols-2 gap-2">
                {[{ v: '12', l: 'Missions', c: 'var(--blue)' }, { v: '8', l: 'Completed', c: 'var(--em)' }, { v: '2', l: 'Active', c: 'var(--amber)' }, { v: '18s', l: 'Avg Time', c: 'var(--forest)' }].map((s, i) => (
                  <Card key={i} className="p-3 text-center"><p className="font-mono font-black text-xl" style={{ color: s.c }}>{s.v}</p><p className="text-[9px] mt-0.5" style={{ color: v('--text-3') }}>{s.l}</p></Card>
                ))}
              </div>
              <Card className="p-4">
                <SectionLabel>Officer Status</SectionLabel>
                <div className="space-y-2">
                  {officers.map((o, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'color-mix(in srgb, var(--em) 12%, transparent)' }}><User size={10} style={{ color: 'var(--em)' }} /></div>
                      <div className="flex-1 min-w-0"><p className="text-[10px] font-semibold truncate" style={{ color: v('--text-1') }}>{o.name} <span className="font-mono" style={{ color: v('--text-3') }}>({o.id})</span></p><p className="text-[8px]" style={{ color: o.status === 'ON MISSION' ? 'var(--red)' : o.status === 'EN ROUTE' ? 'var(--amber)' : 'var(--em)' }}>{o.status}</p></div>
                      <div className="flex items-center gap-0.5"><Bell size={8} style={{ color: o.bat < 60 ? 'var(--red)' : 'var(--em)' }} /><span className="font-mono text-[8px]" style={{ color: o.bat < 60 ? 'var(--red)' : v('--text-3') }}>{o.bat}%</span></div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
        {activeTab === 'patrol' && (
          <div className="p-5 overflow-y-auto h-full">
            <SectionLabel>Officer Deployment</SectionLabel>
            <div className="grid grid-cols-1 gap-3">
              {officers.map((o, i) => (
                <Card key={i} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'color-mix(in srgb, var(--blue) 12%, transparent)', color: 'var(--blue)' }}><Shield size={18} /></div>
                  <div className="flex-1"><div className="flex items-center gap-2 mb-1"><p className="font-semibold text-sm" style={{ color: v('--text-1') }}>{o.name}</p><span className="font-mono text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--text-1) 6%, transparent)', color: v('--text-3') }}>{o.id}</span></div><p className="text-[10px]" style={{ color: v('--text-3') }}>{o.zone} Zone</p></div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1"><Bell size={12} style={{ color: o.bat < 60 ? 'var(--red)' : 'var(--em)' }} /><span className="font-mono text-xs" style={{ color: o.bat < 60 ? 'var(--red)' : v('--text-2') }}>{o.bat}%</span></div>
                    <Chip label={o.status} v={o.status === 'ON MISSION' ? 'red' : o.status === 'EN ROUTE' ? 'amb' : 'em'} sm />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'comms' && (
          <div className="flex flex-col h-full p-5 gap-3">
            <div className="flex-1 overflow-y-auto space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-sm p-3 rounded-2xl ${msg.type === 'outgoing' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                    style={{ background: msg.type === 'system' ? 'color-mix(in srgb, var(--amber) 8%, transparent)' : msg.type === 'outgoing' ? 'color-mix(in srgb, var(--em) 12%, transparent)' : 'color-mix(in srgb, var(--text-1) 6%, transparent)', border: msg.type === 'system' ? '1px solid var(--border-amb)' : '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 mb-1"><span className="text-[9px] font-semibold" style={{ color: msg.type === 'system' ? 'var(--amber)' : 'var(--em)' }}>{msg.from}</span>{msg.risk && <Chip label={msg.risk} v={riskVariant(msg.risk)} sm />}</div>
                    <p className="text-[11px]" style={{ color: v('--text-1') }}>{msg.msg}</p>
                    <p className="text-[8px] mt-1 text-right" style={{ color: v('--text-3') }}>{msg.t}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'color-mix(in srgb, var(--text-1) 4%, transparent)', border: '1px solid var(--border)' }}>
              <input
                value={commsInput}
                onChange={(e) => setCommsInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Broadcast message to all units…"
                className="flex-1 bg-transparent text-sm outline-none" style={{ color: v('--text-1'), fontFamily: 'Inter, sans-serif' }}
              />
              <Btn sm onClick={handleSend}><Send size={11} /> Send</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SMART HIGHWAY SYSTEM
═══════════════════════════════════════════════════════════════════════════ */
function HighwaySystemScreen() {
  const [selectedCam, setSelectedCam] = useState(0);
  const [vmsActive, setVmsActive] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true, 3: false, 4: false });
  const vmsBoards = [
    { id: 'VMS-001', loc: 'NH-67 KM 54', msg: '⚠ ELEPHANT AHEAD · SLOW DOWN', type: 'CRITICAL' },
    { id: 'VMS-002', loc: 'NH-67 KM 58', msg: '⚠ WILDLIFE ZONE · 30 KM/H', type: 'HIGH' },
    { id: 'VMS-003', loc: 'NH-8 KM 86', msg: 'CAUTION: LEOPARD DETECTED', type: 'CRITICAL' },
    { id: 'VMS-004', loc: 'NH-44 KM 310', msg: 'DEER CROSSING · REDUCE SPEED', type: 'HIGH' },
    { id: 'VMS-005', loc: 'NH-27 KM 172', msg: 'ALL CLEAR · NORMAL SPEED', type: 'SAFE' },
  ];
  const sensors = [
    { id: 'SEN-01', type: 'Motion', loc: 'NH-67 KM 55', val: '3 detections', ok: true },
    { id: 'SEN-02', type: 'Thermal', loc: 'NH-8 KM 87', val: '1 signature', ok: true },
    { id: 'SEN-03', type: 'Acoustic', loc: 'NH-44 KM 311', val: 'Elephant call', ok: true },
    { id: 'SEN-04', type: 'Vibration', loc: 'NH-27 KM 173', val: 'OFFLINE', ok: false },
  ];
  return (
    <div className="flex flex-col h-full overflow-hidden a-slide-up" style={{ background: v('--bg') }}>
      <div className="grid grid-cols-5 gap-3 p-4" style={{ flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
        {[{ icon: <Truck size={15} />, l: 'VMS Boards Active', v: '3/5', c: 'var(--amber)' }, { icon: <Camera size={15} />, l: 'Cameras Online', v: '340', c: 'var(--em)' }, { icon: <Activity size={15} />, l: 'Sensors Active', v: '3/4', c: 'var(--blue)' }, { icon: <Zap size={15} />, l: 'V2I Messages/min', v: '1,284', c: 'var(--forest)' }, { icon: <AlertTriangle size={15} />, l: 'Active Alerts', v: '3', c: 'var(--red)' }].map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'color-mix(in srgb, var(--text-1) 3%, transparent)', border: '1px solid var(--border)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `color-mix(in srgb, ${s.c} 12%, transparent)`, color: s.c }}>{s.icon}</div>
            <div><p className="font-mono font-black text-lg leading-none" style={{ color: s.c }}>{s.v}</p><p className="text-[9px] mt-0.5 leading-tight" style={{ color: v('--text-3') }}>{s.l}</p></div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 flex-1 min-h-0 p-4">
        <div className="flex flex-col gap-3" style={{ flex: '0 0 45%' }}>
          <Card className="overflow-hidden flex-1 flex flex-col" style={{ padding: 0 }}>
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <div className="flex items-center gap-2"><MonitorPlay size={13} style={{ color: 'var(--em)' }} /><span className="text-xs font-semibold" style={{ color: v('--text-1') }}>Live Camera Feed</span></div>
              <LivePill />
            </div>
            <div className="flex-1 relative overflow-hidden" style={{ minHeight: 0 }}><HighwayCCTV feedIdx={selectedCam} playing={true} /></div>
            <div className="flex gap-2 p-3 overflow-x-auto" style={{ borderTop: '1px solid var(--border)', flexShrink: 0 }}>
              {CAMERA_FEEDS.map((f, i) => {
                const hasCrit = f.targets.some(t => t.risk === 'CRITICAL');
                const acol = hasCrit ? 'var(--red)' : 'var(--amber)';
                return (
                  <button key={i} onClick={() => setSelectedCam(i)} className="flex-shrink-0 rounded-lg overflow-hidden transition-all" style={{ width: 68, height: 44, border: `1.5px solid ${selectedCam === i ? acol : 'var(--border)'}`, position: 'relative' }}>
                    <img src={f.img} alt={f.id} className="w-full h-full object-cover" style={{ opacity: selectedCam === i ? .85 : .45 }} />
                    <div className="absolute inset-0 flex flex-col justify-end p-1" style={{ background: 'linear-gradient(transparent, rgba(5,10,20,.9))' }}>
                      <span className="font-mono text-[7px]" style={{ color: 'rgba(255,255,255,.7)' }}>{f.id}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>Variable Message Sign Boards</SectionLabel>
              <Chip label={`${Object.values(vmsActive).filter(Boolean).length} ACTIVE`} v="amb" dot />
            </div>
            <div className="space-y-2">
              {vmsBoards.map((b, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'color-mix(in srgb, var(--text-1) 2%, transparent)', border: '1px solid var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `color-mix(in srgb, ${riskCSS(b.type)} 12%, transparent)`, color: riskCSS(b.type) }}><Truck size={13} /></div>
                  <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-0.5"><span className="font-mono text-[9px]" style={{ color: v('--text-3') }}>{b.id}</span><span className="text-[9px]" style={{ color: v('--text-3') }}>{b.loc}</span></div><p className="text-[11px] font-bold truncate" style={{ color: riskCSS(b.type) }}>{b.msg}</p></div>
                  <button onClick={() => setVmsActive(prev => ({ ...prev, [i]: !prev[i] }))}
                    className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all"
                    style={{ background: vmsActive[i] ? 'color-mix(in srgb, var(--em) 12%, transparent)' : 'color-mix(in srgb, var(--text-1) 6%, transparent)', color: vmsActive[i] ? 'var(--em)' : v('--text-3'), border: `1px solid ${vmsActive[i] ? 'var(--border-em)' : 'var(--border)'}` }}>
                    {vmsActive[i] ? 'ON' : 'OFF'}
                  </button>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>IoT Sensor Network</SectionLabel>
              <Chip label="3/4 ONLINE" v="em" dot />
            </div>
            <div className="space-y-2">
              {sensors.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'color-mix(in srgb, var(--text-1) 2%, transparent)', border: '1px solid var(--border)' }}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.ok ? 'a-pulse-em' : 'a-blink'}`} style={{ background: s.ok ? 'var(--em)' : 'var(--red)' }} />
                  <div className="flex-1"><div className="flex items-center gap-2"><span className="font-mono text-[9px]" style={{ color: v('--text-3') }}>{s.id}</span><span className="text-[10px] font-semibold" style={{ color: v('--text-1') }}>{s.type} Sensor</span></div><p className="text-[9px]" style={{ color: v('--text-3') }}>{s.loc}</p></div>
                  <span className="font-mono text-[10px] font-semibold" style={{ color: s.ok ? 'var(--em)' : 'var(--red)' }}>{s.val}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════════════════════ */
function AppShell() {
  const [screen, setScreen] = useState('command');

  const render = () => {
    switch (screen) {
      case 'command':   return <CommandCenter />;
      case 'landing':   return <LandingPage onNav={setScreen} />;
      case 'alert':     return <WildlifeAlert />;
      case 'analytics': return <Analytics />;
      case 'heatmap':   return <HeatmapScreen />;
      case 'mobile':    return <MobileAppScreen />;
      case 'officer':   return <FieldOfficerScreen />;
      case 'highway':   return <HighwaySystemScreen />;
      default:          return <CommandCenter />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: v('--bg') }}>
      <Sidebar active={screen} onNav={setScreen} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar screen={screen} onNav={setScreen} />
        <main className="flex-1 min-h-0 overflow-hidden">
          {render()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
