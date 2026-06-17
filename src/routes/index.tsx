import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu, X, Check, Phone, Flame, Dumbbell, Leaf, Truck, ChevronRight, Star, Clock, MapPin, Send, Instagram,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FITERA — Доставка готовых рационов в Ростове-на-Дону" },
      { name: "description", content: "Готовые рационы с расчётом КБЖУ. Доставка ежедневно по Ростову. Линейки LIGHT, BALANCE, POWER, MOM, PRO." },
      { property: "og:title", content: "FITERA — Умное питание под твою цель" },
      { property: "og:description", content: "Готовые рационы FITERA с расчётом КБЖУ. Без готовки, без подсчётов." },
    ],
  }),
  component: Landing,
});

/* ────────── Data ────────── */

type Line = {
  id: "LIGHT" | "BALANCE" | "POWER" | "MOM" | "PRO";
  kcal: string;
  desc: string;
  price: string;
  popular?: boolean;
};

const LINES: Line[] = [
  { id: "LIGHT", kcal: "1200–1400 ккал", desc: "Для снижения веса", price: "от 750 ₽/день" },
  { id: "BALANCE", kcal: "1500–1800 ккал", desc: "Для поддержания формы", price: "от 850 ₽/день" },
  { id: "POWER", kcal: "2000–2500 ккал", desc: "Для набора мышечной массы", price: "от 950 ₽/день", popular: true },
  { id: "MOM", kcal: "1600–1900 ккал", desc: "Для молодых мам", price: "от 900 ₽/день" },
  { id: "PRO", kcal: "2200–2800 ккал", desc: "Для занятых людей", price: "от 1100 ₽/день" },
];

type Dish = {
  name: string;
  meal: "ЗАВТРАК" | "ПЕРЕКУС" | "ОБЕД" | "УЖИН";
  kcal: number;
  p: number; f: number; c: number;
  line: Line["id"];
  ingredients: string;
};

const MONDAY: Dish[] = [
  // LIGHT
  { name: "Овсянка с ягодами и миндалём", meal: "ЗАВТРАК", kcal: 320, p: 12, f: 8, c: 48, line: "LIGHT", ingredients: "Овсяные хлопья, миндаль, голубика, малина, мёд, корица" },
  { name: "Греческий йогурт с яблоком", meal: "ПЕРЕКУС", kcal: 180, p: 14, f: 4, c: 22, line: "LIGHT", ingredients: "Греческий йогурт 2%, яблоко, корица" },
  { name: "Курица гриль с овощами", meal: "ОБЕД", kcal: 420, p: 38, f: 12, c: 34, line: "LIGHT", ingredients: "Куриное филе, цукини, перец, томаты, оливковое масло, специи" },
  { name: "Треска с брокколи на пару", meal: "УЖИН", kcal: 280, p: 32, f: 6, c: 18, line: "LIGHT", ingredients: "Треска, брокколи, лимон, оливковое масло, тимьян" },
  // BALANCE
  { name: "Сырники со сметаной", meal: "ЗАВТРАК", kcal: 420, p: 24, f: 14, c: 48, line: "BALANCE", ingredients: "Творог 5%, яйцо, мука рисовая, сметана, ягодный соус" },
  { name: "Орехи и сухофрукты", meal: "ПЕРЕКУС", kcal: 240, p: 8, f: 14, c: 22, line: "BALANCE", ingredients: "Миндаль, грецкий орех, курага, чернослив" },
  { name: "Паста с курицей и песто", meal: "ОБЕД", kcal: 560, p: 34, f: 18, c: 64, line: "BALANCE", ingredients: "Паста дурум, куриное филе, песто, пармезан, томаты черри" },
  { name: "Лосось с киноа и шпинатом", meal: "УЖИН", kcal: 480, p: 36, f: 20, c: 38, line: "BALANCE", ingredients: "Лосось, киноа, шпинат, лимон, оливковое масло" },
  // POWER
  { name: "Омлет с индейкой и сыром", meal: "ЗАВТРАК", kcal: 540, p: 38, f: 28, c: 22, line: "POWER", ingredients: "3 яйца, индейка, сыр чеддер, шпинат, цельнозерновой хлеб" },
  { name: "Протеиновый шейк + банан", meal: "ПЕРЕКУС", kcal: 360, p: 32, f: 6, c: 48, line: "POWER", ingredients: "Whey-протеин, молоко, банан, арахисовая паста" },
  { name: "Говядина с гречкой и овощами", meal: "ОБЕД", kcal: 720, p: 52, f: 22, c: 68, line: "POWER", ingredients: "Говяжья вырезка, гречка, морковь, лук, чесночный соус" },
  { name: "Курица с рисом басмати", meal: "УЖИН", kcal: 620, p: 48, f: 18, c: 62, line: "POWER", ingredients: "Куриное филе, рис басмати, спаржа, оливковое масло" },
  // MOM
  { name: "Творожная запеканка с изюмом", meal: "ЗАВТРАК", kcal: 380, p: 26, f: 10, c: 42, line: "MOM", ingredients: "Творог 5%, яйцо, манная крупа, изюм, ваниль" },
  { name: "Печёное яблоко с орехами", meal: "ПЕРЕКУС", kcal: 200, p: 4, f: 8, c: 30, line: "MOM", ingredients: "Яблоко, грецкий орех, мёд, корица" },
  { name: "Куриные котлеты с пюре", meal: "ОБЕД", kcal: 520, p: 36, f: 16, c: 52, line: "MOM", ingredients: "Куриный фарш, картофель, молоко, сливочное масло, зелень" },
  { name: "Рыбные тефтели с овощами", meal: "УЖИН", kcal: 400, p: 30, f: 12, c: 38, line: "MOM", ingredients: "Хек, рис, морковь, лук, томатный соус" },
  // PRO
  { name: "Гранола с йогуртом и манго", meal: "ЗАВТРАК", kcal: 580, p: 22, f: 18, c: 78, line: "PRO", ingredients: "Гранола, греческий йогурт, манго, кокосовая стружка, мёд" },
  { name: "Сэндвич с индейкой и авокадо", meal: "ПЕРЕКУС", kcal: 380, p: 26, f: 16, c: 36, line: "PRO", ingredients: "Цельнозерновой хлеб, индейка, авокадо, салат, томат" },
  { name: "Стейк с печёным картофелем", meal: "ОБЕД", kcal: 780, p: 54, f: 28, c: 72, line: "PRO", ingredients: "Говяжий стейк, картофель, розмарин, чесночное масло, салат" },
  { name: "Утиная грудка с овощами", meal: "УЖИН", kcal: 660, p: 44, f: 32, c: 42, line: "PRO", ingredients: "Утиная грудка, батат, брюссельская капуста, бальзамик" },
];

const DAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

/* ────────── Helpers ────────── */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function PhotoPlaceholder({ className = "", label = "[Фото блюда]" }: { className?: string; label?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-[#1C2A1C] to-[#0E1A0E] text-sm text-[#3A4A3A] ${className}`}
    >
      {label}
    </div>
  );
}

/* ────────── Components ────────── */

function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const big = size === "md";
  return (
    <a href="#top" className="flex items-center gap-2.5 select-none">
      <div
        className="grid place-items-center rounded-md font-black"
        style={{
          background: "var(--accent-green)",
          width: big ? 36 : 30, height: big ? 36 : 30,
          fontSize: big ? 20 : 17, color: "#fff",
        }}
      >
        F
      </div>
      <div className="leading-none">
        <div className="font-black tracking-tight" style={{ fontWeight: 900, fontSize: big ? 20 : 17 }}>
          FITERA
        </div>
        <div className="text-[9px] mt-0.5 tracking-[0.18em] font-semibold" style={{ color: "var(--accent-gold)" }}>
          ЕШЬ ДЛЯ РЕЗУЛЬТАТА
        </div>
      </div>
    </a>
  );
}

function Navbar({ onOrder }: { onOrder: () => void }) {
  const [open, setOpen] = useState(false);
  const items = [
    { l: "Рационы", h: "#lines" }, { l: "Меню", h: "#menu" },
    { l: "Калькулятор", h: "#calc" }, { l: "Доставка", h: "#delivery" },
    { l: "Контакты", h: "#footer" },
  ];
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{ background: "color-mix(in oklab, var(--bg-primary) 78%, transparent)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Logo />
        <nav className="hidden lg:flex items-center gap-7">
          {items.map((i) => (
            <a key={i.h} href={i.h} className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
              {i.l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={onOrder}
            className="h-11 px-5 rounded-xl font-semibold text-[15px] active:scale-[0.97] transition-transform"
            style={{ background: "var(--accent-gold)", color: "#0E0F0E" }}
          >
            Заказать
          </button>
          <button
            className="lg:hidden h-11 w-11 grid place-items-center rounded-xl border"
            style={{ borderColor: "var(--border)" }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t animate-fade-in" style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}>
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col">
            {items.map((i) => (
              <a
                key={i.h} href={i.h} onClick={() => setOpen(false)}
                className="py-3 text-base border-b last:border-0"
                style={{ borderColor: "var(--border)" }}
              >
                {i.l}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ onOrder, onCalc }: { onOrder: () => void; onCalc: () => void }) {
  const features = [
    { Icon: Leaf, l: "Научный подход" },
    { Icon: Dumbbell, l: "Индивидуальный рацион" },
    { Icon: Star, l: "Премиум ингредиенты" },
    { Icon: Truck, l: "Доставка каждый день" },
  ];
  return (
    <section id="top" className="relative overflow-hidden" style={{ minHeight: "100svh" }}>
      <div className="noise-overlay" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-16 lg:py-24 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div className="reveal">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
            style={{ background: "color-mix(in oklab, var(--accent-green) 18%, transparent)", color: "#9FD89F" }}
          >
            <MapPin size={13} /> Доставка по Ростову-на-Дону
          </span>
          <h1 className="mt-5 text-[40px] sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.02]">
            Умное питание<br />
            <span style={{ color: "var(--accent-gold)" }}>под твою цель</span>
          </h1>
          <p className="mt-5 text-[17px] sm:text-lg text-[var(--text-secondary)] max-w-lg">
            Готовые рационы с расчётом КБЖУ. Без готовки, без подсчётов, без потерь времени.
          </p>

          <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {features.map(({ Icon, l }) => (
              <div key={l} className="flex flex-col gap-2">
                <div className="h-8 w-8 grid place-items-center rounded-lg" style={{ background: "color-mix(in oklab, var(--accent-green) 22%, transparent)" }}>
                  <Icon size={18} color="#9FD89F" />
                </div>
                <span className="text-xs text-[var(--text-secondary)] leading-tight">{l}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOrder}
              className="h-12 px-6 rounded-xl font-semibold active:scale-[0.97] transition-transform"
              style={{ background: "var(--accent-gold)", color: "#0E0F0E" }}
            >
              Выбрать рацион
            </button>
            <button
              onClick={onCalc}
              className="h-12 px-6 rounded-xl font-semibold border-2 active:scale-[0.97] transition-transform"
              style={{ borderColor: "var(--accent-green)", color: "#9FD89F" }}
            >
              Рассчитать калории
            </button>
          </div>
        </div>

        {/* Mockup */}
        <div className="reveal">
          <div
            className="relative aspect-[4/5] max-w-sm mx-auto rounded-3xl border p-6 flex flex-col justify-between overflow-hidden"
            style={{
              background: "linear-gradient(155deg, #1A1D1A 0%, #0E120E 100%)",
              borderColor: "var(--border)",
              boxShadow: "0 30px 80px -20px rgba(212,175,55,0.18)",
            }}
          >
            <div className="noise-overlay" />
            <div className="flex items-start justify-between relative">
              <Logo />
              <div className="h-14 w-14 rounded-lg bg-white grid place-items-center text-[8px] text-black font-mono">
                ░▓░▓<br/>▓░▓░<br/>░▓░▓
              </div>
            </div>
            <div className="relative">
              <div className="text-xs tracking-[0.2em] text-[var(--text-secondary)]">FITERA</div>
              <div className="text-5xl font-black mt-1" style={{ color: "var(--accent-gold)" }}>POWER</div>
              <div className="text-sm text-[var(--text-secondary)] mt-1 tabular">620 kcal · день</div>
            </div>
            <div
              className="relative rounded-xl px-4 py-3 font-mono text-xs tabular flex justify-between"
              style={{ background: "var(--bg-surface)", borderTop: "2px solid var(--accent-gold)" }}
            >
              <span>Б: 48г</span><span>Ж: 18г</span><span>У: 52г</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LinesSection({ onSelect }: { onSelect: (line: Line) => void }) {
  return (
    <section id="lines" className="py-16 lg:py-24 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Наши линейки</h2>
            <p className="text-[var(--text-secondary)] mt-2">5 готовых программ под любую цель</p>
          </div>
        </div>

        <div className="-mx-4 sm:mx-0">
          <div className="flex lg:grid lg:grid-cols-5 gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-0 snap-x snap-mandatory pb-2">
            {LINES.map((line, i) => (
              <button
                key={line.id}
                onClick={() => onSelect(line)}
                className="reveal group text-left shrink-0 snap-start w-[260px] lg:w-auto rounded-2xl border p-5 flex flex-col gap-3 transition-all hover:scale-[1.02] hover:border-[var(--accent-gold)] relative overflow-hidden"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)", transitionDelay: `${i * 80}ms` }}
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "var(--accent-green)" }} />
                {line.popular && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider px-2 py-1 rounded-md" style={{ background: "var(--accent-gold)", color: "#0E0F0E" }}>
                    POPULAR
                  </span>
                )}
                <PhotoPlaceholder className="aspect-[3/2] rounded-lg mt-2" />
                <div className="text-2xl font-black tracking-tight">{line.id}</div>
                <div className="text-xs font-mono text-[var(--text-secondary)] tabular">{line.kcal}</div>
                <div className="text-sm text-[var(--text-secondary)]">{line.desc}</div>
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <span className="font-bold" style={{ color: "var(--accent-gold)" }}>{line.price}</span>
                  <ChevronRight size={18} className="text-[var(--text-secondary)] group-hover:text-[var(--accent-gold)] transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuSection({ onOpenDish }: { onOpenDish: (d: Dish) => void }) {
  const [day, setDay] = useState(0);
  const [filter, setFilter] = useState<Line["id"] | "ALL">("ALL");

  const filtered = useMemo(() => {
    if (filter === "ALL") return MONDAY;
    return MONDAY.filter((d) => d.line === filter);
  }, [filter]);

  return (
    <section id="menu" className="py-16 lg:py-24 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal mb-8">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Меню на неделю</h2>
          <p className="text-[var(--text-secondary)] mt-2">Свежие блюда каждый день. Меняем еженедельно.</p>
        </div>

        <div className="reveal flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 mb-5">
          {DAYS.map((d, i) => {
            const active = i === day;
            return (
              <button
                key={d}
                onClick={() => setDay(i)}
                className="shrink-0 h-11 px-5 text-sm font-semibold transition-all relative"
                style={{ color: active ? "#fff" : "var(--text-secondary)" }}
              >
                {d}
                <span
                  className="absolute left-3 right-3 bottom-0 h-0.5 rounded-full transition-all"
                  style={{ background: active ? "var(--accent-gold)" : "transparent" }}
                />
              </button>
            );
          })}
        </div>

        <div className="reveal flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
          {(["ALL", ...LINES.map((l) => l.id)] as const).map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="shrink-0 h-9 px-4 rounded-full text-xs font-bold tracking-wide transition-all border"
                style={{
                  background: active ? "var(--accent-gold)" : "var(--bg-card)",
                  color: active ? "#0E0F0E" : "var(--text-secondary)",
                  borderColor: active ? "var(--accent-gold)" : "var(--border)",
                }}
              >
                {f === "ALL" ? "Все" : f}
              </button>
            );
          })}
        </div>

        {day === 0 ? (
          <div className="grid sm:grid-cols-2 gap-3 reveal">
            {filtered.map((d) => (
              <button
                key={d.name}
                onClick={() => onOpenDish(d)}
                className="text-left rounded-2xl border p-3 flex gap-3 hover:bg-[var(--hover)] transition-colors"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <PhotoPlaceholder className="h-20 w-20 shrink-0 rounded-xl" label="" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[15px] leading-snug truncate">{d.name}</div>
                  <div className="mt-1.5 flex gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "color-mix(in oklab, var(--accent-green) 24%, transparent)", color: "#9FD89F" }}>
                      {d.meal}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono tabular" style={{ background: "var(--bg-surface)", color: "var(--accent-gold)" }}>
                      {d.kcal} ккал
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--bg-surface)", color: "var(--text-secondary)" }}>
                      {d.line}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-mono tabular text-[var(--text-secondary)]">
                    Б {d.p}г · Ж {d.f}г · У {d.c}г
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border p-12 text-center text-[var(--text-secondary)]" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            [Меню обновляется]
          </div>
        )}
      </div>
    </section>
  );
}

function DishModal({ dish, onClose }: { dish: Dish; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-[480px] sm:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up border"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        <button onClick={onClose} className="absolute top-3 right-3 z-10 h-10 w-10 grid place-items-center rounded-full" style={{ background: "rgba(0,0,0,0.55)" }} aria-label="Закрыть">
          <X size={20} />
        </button>
        <div className="relative">
          <PhotoPlaceholder className="h-52 w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent" />
          <div className="absolute bottom-3 left-5 right-5">
            <span className="text-[10px] font-bold tracking-wider px-2 py-1 rounded" style={{ background: "var(--accent-gold)", color: "#0E0F0E" }}>
              {dish.line}
            </span>
            <h3 className="mt-2 text-2xl font-black tracking-tight">{dish.name}</h3>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-4 gap-2">
            {[
              { l: "ккал", v: dish.kcal },
              { l: "Белки, г", v: dish.p },
              { l: "Жиры, г", v: dish.f },
              { l: "Углев., г", v: dish.c },
            ].map((m) => (
              <div key={m.l} className="rounded-xl p-3 text-center" style={{ background: "var(--bg-surface)" }}>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">{m.l}</div>
                <div className="text-xl font-black font-mono tabular mt-1" style={{ color: "var(--accent-gold)" }}>{m.v}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs font-bold tracking-widest text-[var(--text-secondary)] mb-2">СОСТАВ</div>
            <ul className="space-y-1.5">
              {dish.ingredients.split(", ").map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ background: "var(--accent-green)" }} />
                  {i}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold tracking-widest text-[var(--text-secondary)] mb-2">ПИЩЕВАЯ ЦЕННОСТЬ НА 100 Г</div>
            <table className="w-full text-sm font-mono tabular">
              <tbody>
                {[
                  ["Калорийность", `${Math.round(dish.kcal / 3)} ккал`],
                  ["Белки", `${(dish.p / 3).toFixed(1)} г`],
                  ["Жиры", `${(dish.f / 3).toFixed(1)} г`],
                  ["Углеводы", `${(dish.c / 3).toFixed(1)} г`],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <td className="py-2 text-[var(--text-secondary)]">{k}</td>
                    <td className="py-2 text-right">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
            <div className="h-20 w-20 bg-[#2A2E2A] rounded-lg grid place-items-center text-[10px] text-[var(--text-secondary)] text-center">
              QR на<br/>упаковке
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Каждая упаковка маркирована QR-кодом с полным составом и сроком годности.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Calculator */

function Calculator({ onOrder }: { onOrder: (line: Line["id"]) => void }) {
  const [sex, setSex] = useState<"M" | "F">("M");
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(178);
  const [weight, setWeight] = useState(78);
  const [act, setAct] = useState(1.375);
  const [goal, setGoal] = useState<"loss" | "keep" | "gain">("keep");
  const [result, setResult] = useState<{ kcal: number; line: Line["id"] } | null>(null);
  const [animKcal, setAnimKcal] = useState(0);

  function compute() {
    const bmr = sex === "M"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
    let kcal = Math.round(bmr * act);
    if (goal === "loss") kcal -= 300;
    if (goal === "gain") kcal += 300;
    let line: Line["id"] = "PRO";
    if (kcal <= 1400) line = "LIGHT";
    else if (kcal <= 1800) line = "BALANCE";
    else if (kcal <= 2200) line = "POWER";
    setResult({ kcal, line });
  }

  useEffect(() => {
    if (!result) return;
    let v = 0;
    const target = result.kcal;
    const step = Math.max(20, Math.round(target / 40));
    const id = setInterval(() => {
      v += step;
      if (v >= target) { v = target; clearInterval(id); }
      setAnimKcal(v);
    }, 16);
    return () => clearInterval(id);
  }, [result]);

  const recommendedLine = result ? LINES.find((l) => l.id === result.line)! : null;

  return (
    <section id="calc" className="py-16 lg:py-24 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="reveal text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Рассчитай свою норму</h2>
          <p className="text-[var(--text-secondary)] mt-2">Подберём рацион под твои параметры</p>
        </div>

        <div className="reveal rounded-2xl border p-5 sm:p-7 space-y-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div>
            <Label>Пол</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["M", "F"] as const).map((s) => (
                <button key={s} onClick={() => setSex(s)}
                  className="h-12 rounded-xl font-semibold transition-all"
                  style={{
                    background: sex === s ? "var(--accent-gold)" : "var(--bg-surface)",
                    color: sex === s ? "#0E0F0E" : "var(--text-primary)",
                  }}
                >{s === "M" ? "Мужчина" : "Женщина"}</button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <NumField label="Возраст" value={age} setValue={setAge} min={18} max={80} />
            <NumField label="Рост, см" value={height} setValue={setHeight} min={120} max={220} />
            <NumField label="Вес, кг" value={weight} setValue={setWeight} min={35} max={200} />
          </div>

          <div>
            <Label>Активность</Label>
            <select value={act} onChange={(e) => setAct(parseFloat(e.target.value))}
              className="w-full h-12 px-4 rounded-xl border outline-none focus:border-[var(--accent-gold)] transition-colors"
              style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
            >
              <option value={1.2}>Сидячий образ жизни</option>
              <option value={1.375}>Лёгкая активность (1-3 раза в неделю)</option>
              <option value={1.55}>Умеренная активность (3-5 раз)</option>
              <option value={1.725}>Высокая активность (6-7 раз)</option>
            </select>
          </div>

          <div>
            <Label>Цель</Label>
            <div className="flex gap-2 flex-wrap">
              {([
                ["loss", "Снижение веса"], ["keep", "Поддержание"], ["gain", "Набор массы"],
              ] as const).map(([k, l]) => (
                <button key={k} onClick={() => setGoal(k)}
                  className="h-10 px-4 rounded-full text-sm font-semibold border transition-all"
                  style={{
                    background: goal === k ? "var(--accent-gold)" : "var(--bg-surface)",
                    color: goal === k ? "#0E0F0E" : "var(--text-primary)",
                    borderColor: goal === k ? "var(--accent-gold)" : "var(--border)",
                  }}
                >{l}</button>
              ))}
            </div>
          </div>

          <button onClick={compute}
            className="w-full h-13 mt-2 rounded-xl font-bold text-base active:scale-[0.98] transition-transform"
            style={{ background: "var(--accent-gold)", color: "#0E0F0E", height: 52 }}
          >Рассчитать</button>

          {result && recommendedLine && (
            <div className="rounded-2xl p-5 border animate-fade-in" style={{ background: "var(--bg-surface)", borderColor: "var(--accent-gold)" }}>
              <div className="text-sm text-[var(--text-secondary)]">Ваша норма</div>
              <div className="text-5xl font-black font-mono tabular mt-1" style={{ color: "var(--accent-gold)" }}>
                {animKcal} <span className="text-lg text-[var(--text-secondary)]">ккал/день</span>
              </div>
              <div className="mt-4 text-sm">Рекомендуем рацион</div>
              <div className="mt-2 rounded-xl border p-4 flex items-center gap-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                <div className="h-12 w-12 grid place-items-center rounded-lg font-black" style={{ background: "var(--accent-green)", color: "#fff" }}>
                  {recommendedLine.id[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-lg">{recommendedLine.id}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{recommendedLine.desc} · {recommendedLine.price}</div>
                </div>
              </div>
              <button onClick={() => onOrder(recommendedLine.id)}
                className="w-full h-12 mt-4 rounded-xl font-bold active:scale-[0.97] transition-transform"
                style={{ background: "var(--accent-gold)", color: "#0E0F0E" }}
              >Заказать {recommendedLine.id}</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-bold tracking-widest text-[var(--text-secondary)] mb-2">{children}</div>;
}

function NumField({ label, value, setValue, min, max }: { label: string; value: number; setValue: (n: number) => void; min: number; max: number }) {
  return (
    <div>
      <Label>{label}</Label>
      <input type="number" inputMode="numeric" min={min} max={max} value={value}
        onChange={(e) => setValue(parseInt(e.target.value) || 0)}
        className="w-full h-12 px-4 rounded-xl border outline-none focus:border-[var(--accent-gold)] transition-colors font-mono tabular"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
      />
    </div>
  );
}

/* Subscription */

function Subscription({ onSelect }: { onSelect: (period: string) => void }) {
  const plans = [
    { id: "1 день", title: "Попробовать", price: "от 750 ₽", old: null, badge: null, features: ["4 приёма пищи", "Доставка сегодня", "Выбор линейки"] },
    { id: "3 дня", title: "Стартовый", price: "от 2 100 ₽", old: "2 400 ₽", badge: "POPULAR", features: ["12 приёмов пищи", "Скидка 12%", "Выбор линейки"] },
    { id: "Месяц", title: "Подписка", price: "от 19 500 ₽", old: "24 000 ₽", badge: null, features: ["Скидка 20%", "Приоритетная доставка", "Бесплатная заморозка дней"] },
  ];

  return (
    <section className="py-16 lg:py-24 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Выбери формат</h2>
          <p className="text-[var(--text-secondary)] mt-2">Чем длиннее период — тем выгоднее</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {plans.map((p, i) => (
            <button key={p.id} onClick={() => onSelect(p.id)}
              className="reveal text-left rounded-2xl border p-6 flex flex-col gap-4 transition-all hover:scale-[1.02] hover:border-[var(--accent-gold)] relative"
              style={{ background: "var(--bg-card)", borderColor: p.badge ? "var(--accent-gold)" : "var(--border)", transitionDelay: `${i * 80}ms` }}
            >
              {p.badge && (
                <span className="absolute -top-3 left-6 text-[10px] font-bold tracking-wider px-2 py-1 rounded-md" style={{ background: "var(--accent-gold)", color: "#0E0F0E" }}>
                  {p.badge}
                </span>
              )}
              <div className="text-xs font-bold tracking-widest text-[var(--text-secondary)]">{p.id.toUpperCase()}</div>
              <div className="text-2xl font-black">{p.title}</div>
              <div>
                <div className="text-3xl font-black tabular" style={{ color: "var(--accent-gold)" }}>{p.price}</div>
                {p.old && <div className="text-sm text-[var(--text-secondary)] line-through tabular">{p.old}</div>}
              </div>
              <ul className="space-y-2 mt-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="mt-0.5 shrink-0" color="#9FD89F" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-3 flex items-center justify-between text-sm font-semibold" style={{ color: "var(--accent-gold)" }}>
                Выбрать <ChevronRight size={16} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Delivery({ onAsk }: { onAsk: () => void }) {
  return (
    <section id="delivery" className="py-16 lg:py-24 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal mb-8">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Доставка</h2>
          <p className="text-[var(--text-secondary)] mt-2">Привозим утром и вечером, удобный слот вы выбираете сами</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="reveal rounded-2xl border p-6" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="h-12 w-12 grid place-items-center rounded-xl mb-4" style={{ background: "color-mix(in oklab, var(--accent-green) 24%, transparent)" }}>
              <Check size={22} color="#9FD89F" />
            </div>
            <div className="text-xs font-bold tracking-widest text-[var(--text-secondary)]">РОСТОВ-НА-ДОНУ</div>
            <div className="text-2xl font-black mt-1">Бесплатная доставка</div>
            <p className="text-[var(--text-secondary)] mt-2 text-sm">Включена в стоимость рациона. Доставляем ежедневно.</p>
            <div className="mt-4 flex gap-2 flex-wrap">
              {["07:00–08:00", "09:00–10:00", "18:00–19:00"].map((s) => (
                <span key={s} className="text-xs font-mono tabular px-3 py-1.5 rounded-full" style={{ background: "var(--bg-surface)" }}>
                  <Clock size={11} className="inline -mt-0.5 mr-1" />{s}
                </span>
              ))}
            </div>
          </div>

          <div className="reveal rounded-2xl border p-6" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="h-12 w-12 grid place-items-center rounded-xl mb-4" style={{ background: "color-mix(in oklab, var(--accent-gold) 22%, transparent)" }}>
              <Phone size={20} color="#D4AF37" />
            </div>
            <div className="text-xs font-bold tracking-widest text-[var(--text-secondary)]">ЗА ПРЕДЕЛАМИ РОСТОВА</div>
            <div className="text-2xl font-black mt-1">Индивидуальный расчёт</div>
            <p className="text-[var(--text-secondary)] mt-2 text-sm">Батайск, Аксай и другие города — уточняем стоимость отдельно.</p>
            <button onClick={onAsk}
              className="mt-4 h-11 px-5 rounded-xl font-semibold border active:scale-[0.97] transition-transform"
              style={{ borderColor: "var(--accent-gold)", color: "var(--accent-gold)" }}
            >Уточнить стоимость</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Order */

type OrderState = {
  name: string; phone: string; messenger: string; line: string; period: string;
  address: string; slot: string; comment: string;
};

function OrderForm({ initial, onUpdate }: { initial: OrderState; onUpdate: (s: OrderState) => void }) {
  const [state, setState] = useState(initial);
  const [sent, setSent] = useState(false);
  useEffect(() => { setState(initial); }, [initial]);

  function set<K extends keyof OrderState>(k: K, v: OrderState[K]) {
    const next = { ...state, [k]: v }; setState(next); onUpdate(next);
  }

  function maskPhone(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (!d) return "";
    let out = "+7 ";
    if (d.length > 1) out += "(" + d.slice(1, 4);
    if (d.length >= 4) out += ") " + d.slice(4, 7);
    if (d.length >= 7) out += "-" + d.slice(7, 9);
    if (d.length >= 9) out += "-" + d.slice(9, 11);
    return out;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  const inputCls = "w-full h-12 px-4 rounded-xl border outline-none focus:border-[var(--accent-gold)] transition-colors";
  const inputStyle = { background: "var(--bg-surface)", borderColor: "var(--border)" };

  return (
    <section id="order-form" className="py-16 lg:py-24 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="reveal text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Оставь заявку</h2>
          <p className="text-[var(--text-secondary)] mt-2">Свяжемся в течение 30 минут и подтвердим заказ</p>
        </div>

        {sent ? (
          <div className="reveal in rounded-2xl border p-8 text-center animate-fade-in" style={{ background: "var(--bg-card)", borderColor: "var(--accent-green)" }}>
            <div className="text-5xl mb-3">🎉</div>
            <div className="text-2xl font-black">Заявка принята!</div>
            <p className="mt-2 text-[var(--text-secondary)]">Мы напишем вам в Telegram в течение 30 минут.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="reveal space-y-3 rounded-2xl border p-5 sm:p-7" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <input className={inputCls} style={inputStyle} placeholder="Ваше имя" value={state.name} onChange={(e) => set("name", e.target.value)} required />
            <input className={inputCls} style={inputStyle} type="tel" placeholder="+7 (000) 000-00-00" value={state.phone} onChange={(e) => set("phone", maskPhone(e.target.value))} required />
            <input className={inputCls} style={inputStyle} placeholder="Telegram / ВКонтакте: @username" value={state.messenger} onChange={(e) => set("messenger", e.target.value)} />

            <div className="grid sm:grid-cols-2 gap-3">
              <select className={inputCls} style={inputStyle} value={state.line} onChange={(e) => set("line", e.target.value)}>
                {LINES.map((l) => <option key={l.id} value={l.id}>{l.id}</option>)}
              </select>
              <select className={inputCls} style={inputStyle} value={state.period} onChange={(e) => set("period", e.target.value)}>
                <option>1 день</option><option>3 дня</option><option>Месяц</option>
              </select>
            </div>

            <input className={inputCls} style={inputStyle} placeholder="Улица, дом, квартира" value={state.address} onChange={(e) => set("address", e.target.value)} required />

            <select className={inputCls} style={inputStyle} value={state.slot} onChange={(e) => set("slot", e.target.value)}>
              <option>07:00–08:00</option><option>09:00–10:00</option><option>18:00–19:00</option>
            </select>

            <textarea className="w-full px-4 py-3 rounded-xl border outline-none focus:border-[var(--accent-gold)] transition-colors min-h-[88px]" style={inputStyle} placeholder="Комментарий (необязательно)" value={state.comment} onChange={(e) => set("comment", e.target.value)} />

            <button type="submit" className="w-full rounded-xl font-bold active:scale-[0.98] transition-transform mt-2" style={{ background: "var(--accent-gold)", color: "#0E0F0E", height: 52 }}>
              Отправить заявку
            </button>
            <p className="text-xs text-[var(--text-secondary)] text-center mt-2">
              Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="footer" className="border-t pt-12 pb-8" style={{ background: "#0A0B0A", borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-10">
          <div>
            <Logo />
            <p className="text-sm text-[var(--text-secondary)] mt-4 max-w-xs">Готовые рационы питания с расчётом КБЖУ. Доставка по Ростову-на-Дону.</p>
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest text-[var(--text-secondary)] mb-3">МЕНЮ</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#lines" className="hover:text-[var(--accent-gold)]">Рационы</a></li>
              <li><a href="#menu" className="hover:text-[var(--accent-gold)]">Меню</a></li>
              <li><a href="#calc" className="hover:text-[var(--accent-gold)]">Калькулятор</a></li>
              <li><a href="#delivery" className="hover:text-[var(--accent-gold)]">Доставка</a></li>
              <li><a href="#order-form" className="hover:text-[var(--accent-gold)]">Контакты</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest text-[var(--text-secondary)] mb-3">КОНТАКТЫ</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone size={14} color="#D4AF37" /> +7 (999) 123-45-67</li>
              <li className="flex items-center gap-2"><Send size={14} color="#D4AF37" /> @fitera_rstv</li>
              <li className="flex items-center gap-2"><Instagram size={14} color="#D4AF37" /> @fitera.food</li>
              <li className="flex items-center gap-2 text-[var(--text-secondary)]"><Clock size={14} color="#9FD89F" /> Ежедневно 07:00–21:00</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t text-xs text-[var(--text-secondary)]" style={{ borderColor: "var(--border)" }}>
          © 2026 FITERA. Доставка рационов питания по Ростову-на-Дону
        </div>
      </div>
    </footer>
  );
}

/* ────────── Root ────────── */

function Landing() {
  useReveal();
  const [dish, setDish] = useState<Dish | null>(null);
  const [order, setOrder] = useState<OrderState>({
    name: "", phone: "", messenger: "", line: "BALANCE", period: "1 день",
    address: "", slot: "09:00–10:00", comment: "",
  });

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function chooseLine(line: Line) {
    setOrder((s) => ({ ...s, line: line.id }));
    scrollTo("order-form");
  }

  function choosePeriod(period: string) {
    setOrder((s) => ({ ...s, period }));
    scrollTo("order-form");
  }

  function askOutOfCity() {
    setOrder((s) => ({ ...s, comment: "Доставка за пределы Ростова — уточнить стоимость. " + s.comment }));
    scrollTo("order-form");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Navbar onOrder={() => scrollTo("order-form")} />
      <main>
        <Hero onOrder={() => scrollTo("lines")} onCalc={() => scrollTo("calc")} />
        <LinesSection onSelect={chooseLine} />
        <MenuSection onOpenDish={setDish} />
        <Calculator onOrder={(line) => { setOrder((s) => ({ ...s, line })); scrollTo("order-form"); }} />
        <Subscription onSelect={choosePeriod} />
        <Delivery onAsk={askOutOfCity} />
        <OrderForm initial={order} onUpdate={setOrder} />
      </main>
      <Footer />
      {dish && <DishModal dish={dish} onClose={() => setDish(null)} />}
    </div>
  );
}
