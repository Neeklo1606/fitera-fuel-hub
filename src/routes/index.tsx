import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Menu, X, Check, Phone, Leaf, Truck, Star, Sparkles, Send, Instagram, MapPin, Plus, Minus,
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

type LineId = "LIGHT" | "BALANCE" | "POWER" | "MOM" | "PRO";

type Line = {
  id: LineId;
  kcal: string;
  desc: string;
  price: string;
  popular?: boolean;
  bg: string;
  emoji: string;
};

const LINES: Line[] = [
  { id: "LIGHT",   kcal: "1200–1400 ккал", desc: "Для снижения веса",          price: "от 750 ₽/день", bg: "#E8F5E9", emoji: "🥗" },
  { id: "BALANCE", kcal: "1500–1800 ккал", desc: "Для поддержания формы",      price: "от 850 ₽/день", bg: "#E3F2FD", emoji: "🥙" },
  { id: "POWER",   kcal: "2000–2500 ккал", desc: "Для набора мышечной массы",  price: "от 950 ₽/день", popular: true, bg: "#FFF8E1", emoji: "🍖" },
  { id: "MOM",     kcal: "1600–1900 ккал", desc: "Для молодых мам",            price: "от 900 ₽/день", bg: "#FCE4EC", emoji: "🍲" },
  { id: "PRO",     kcal: "2200–2800 ккал", desc: "Для занятых людей",          price: "от 1100 ₽/день", bg: "#F3E5F5", emoji: "🥩" },
];

type Dish = {
  name: string;
  meal: "ЗАВТРАК" | "ПЕРЕКУС" | "ОБЕД" | "УЖИН";
  kcal: number;
  p: number; f: number; c: number;
  line: LineId;
  ingredients: string;
};

const MONDAY: Dish[] = [
  { name: "Овсянка с ягодами и миндалём", meal: "ЗАВТРАК", kcal: 320, p: 12, f: 8, c: 48, line: "LIGHT", ingredients: "Овсяные хлопья, миндаль, голубика, малина, мёд, корица" },
  { name: "Греческий йогурт с яблоком", meal: "ПЕРЕКУС", kcal: 180, p: 14, f: 4, c: 22, line: "LIGHT", ingredients: "Греческий йогурт 2%, яблоко, корица" },
  { name: "Курица гриль с овощами", meal: "ОБЕД", kcal: 420, p: 38, f: 12, c: 34, line: "LIGHT", ingredients: "Куриное филе, цукини, перец, томаты, оливковое масло, специи" },
  { name: "Треска с брокколи на пару", meal: "УЖИН", kcal: 280, p: 32, f: 6, c: 18, line: "LIGHT", ingredients: "Треска, брокколи, лимон, оливковое масло, тимьян" },
  { name: "Сырники со сметаной", meal: "ЗАВТРАК", kcal: 420, p: 24, f: 14, c: 48, line: "BALANCE", ingredients: "Творог 5%, яйцо, мука рисовая, сметана, ягодный соус" },
  { name: "Орехи и сухофрукты", meal: "ПЕРЕКУС", kcal: 240, p: 8, f: 14, c: 22, line: "BALANCE", ingredients: "Миндаль, грецкий орех, курага, чернослив" },
  { name: "Паста с курицей и песто", meal: "ОБЕД", kcal: 560, p: 34, f: 18, c: 64, line: "BALANCE", ingredients: "Паста дурум, куриное филе, песто, пармезан, томаты черри" },
  { name: "Лосось с киноа и шпинатом", meal: "УЖИН", kcal: 480, p: 36, f: 20, c: 38, line: "BALANCE", ingredients: "Лосось, киноа, шпинат, лимон, оливковое масло" },
  { name: "Омлет с индейкой и сыром", meal: "ЗАВТРАК", kcal: 540, p: 38, f: 28, c: 22, line: "POWER", ingredients: "3 яйца, индейка, сыр чеддер, шпинат, цельнозерновой хлеб" },
  { name: "Протеиновый шейк + банан", meal: "ПЕРЕКУС", kcal: 360, p: 32, f: 6, c: 48, line: "POWER", ingredients: "Whey-протеин, молоко, банан, арахисовая паста" },
  { name: "Говядина с гречкой и овощами", meal: "ОБЕД", kcal: 720, p: 52, f: 22, c: 68, line: "POWER", ingredients: "Говяжья вырезка, гречка, морковь, лук, чесночный соус" },
  { name: "Курица с рисом басмати", meal: "УЖИН", kcal: 620, p: 48, f: 18, c: 62, line: "POWER", ingredients: "Куриное филе, рис басмати, спаржа, оливковое масло" },
  { name: "Творожная запеканка с изюмом", meal: "ЗАВТРАК", kcal: 380, p: 26, f: 10, c: 42, line: "MOM", ingredients: "Творог 5%, яйцо, манная крупа, изюм, ваниль" },
  { name: "Печёное яблоко с орехами", meal: "ПЕРЕКУС", kcal: 200, p: 4, f: 8, c: 30, line: "MOM", ingredients: "Яблоко, грецкий орех, мёд, корица" },
  { name: "Куриные котлеты с пюре", meal: "ОБЕД", kcal: 520, p: 36, f: 16, c: 52, line: "MOM", ingredients: "Куриный фарш, картофель, молоко, сливочное масло, зелень" },
  { name: "Рыбные тефтели с овощами", meal: "УЖИН", kcal: 400, p: 30, f: 12, c: 38, line: "MOM", ingredients: "Хек, рис, морковь, лук, томатный соус" },
  { name: "Гранола с йогуртом и манго", meal: "ЗАВТРАК", kcal: 580, p: 22, f: 18, c: 78, line: "PRO", ingredients: "Гранола, греческий йогурт, манго, кокосовая стружка, мёд" },
  { name: "Сэндвич с индейкой и авокадо", meal: "ПЕРЕКУС", kcal: 380, p: 26, f: 16, c: 36, line: "PRO", ingredients: "Цельнозерновой хлеб, индейка, авокадо, салат, томат" },
  { name: "Стейк с печёным картофелем", meal: "ОБЕД", kcal: 780, p: 54, f: 28, c: 72, line: "PRO", ingredients: "Говяжий стейк, картофель, розмарин, чесночное масло, салат" },
  { name: "Утиная грудка с овощами", meal: "УЖИН", kcal: 660, p: 44, f: 32, c: 42, line: "PRO", ingredients: "Утиная грудка, батат, брюссельская капуста, бальзамик" },
];

const DAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

const FAQ = [
  { q: "Как происходит доставка?", a: "Доставляем ежедневно по Ростову-на-Дону бесплатно. Выбираете удобный временной слот при оформлении заявки. Менеджер подтверждает заказ в Telegram." },
  { q: "Сколько приёмов пищи в рационе?", a: "4 приёма пищи: завтрак, перекус, обед и ужин. Каждый день — разное меню без повторений." },
  { q: "Можно ли попробовать один день?", a: "Да, начать можно с одного дня. Выберите любую из 5 линеек, оставьте заявку — привезём." },
  { q: "Как считается калорийность?", a: "Меню разрабатывается с учётом КБЖУ каждой линейки. На упаковке и сайте — точный состав по белкам, жирам и углеводам." },
  { q: "Как оформить заказ?", a: "Оставьте заявку на сайте — укажите имя, телефон и Telegram. Менеджер напишет вам в течение 30 минут для подтверждения." },
];

/* ────────── Helpers ────────── */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ────────── Navbar ────────── */

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5 select-none">
      <div
        className="grid place-items-center rounded-[10px] text-white"
        style={{ background: "#2E7D32", width: 36, height: 36, fontFamily: "Unbounded", fontWeight: 900, fontSize: 18 }}
      >
        F
      </div>
      <span
        style={{ fontFamily: "Unbounded", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", color: dark ? "#0E0F0E" : "#FFFFFF" }}
      >
        FITERA
      </span>
    </a>
  );
}

function Navbar({ onOrder }: { onOrder: () => void }) {
  const [open, setOpen] = useState(false);
  const items = [
    { l: "Рационы", h: "#lines" }, { l: "Меню", h: "#menu" },
    { l: "Калькулятор", h: "#calc" }, { l: "Доставка", h: "#delivery" },
    { l: "FAQ", h: "#faq" },
  ];
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl"
      style={{ background: "rgba(14,15,14,0.85)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between" style={{ height: 64 }}>
        <Logo />
        <nav className="hidden lg:flex items-center gap-7">
          {items.map((i) => (
            <a key={i.h} href={i.h} className="text-sm text-[#A0A89A] hover:text-white transition-colors">{i.l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={onOrder}
            className="press rounded-full"
            style={{ background: "#D4AF37", color: "#0E0F0E", fontFamily: "Inter", fontWeight: 700, fontSize: 14, padding: "10px 20px", letterSpacing: "0.01em" }}
          >
            Заказать
          </button>
          <button
            className="lg:hidden grid place-items-center rounded-xl"
            style={{ width: 44, height: 44, color: "#FFFFFF" }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
          >
            {open ? <X size={22} /> : (
              <span className="flex flex-col" style={{ gap: 5 }}>
                <span style={{ width: 20, height: 2, background: "#fff", borderRadius: 2 }} />
                <span style={{ width: 20, height: 2, background: "#fff", borderRadius: 2 }} />
                <span style={{ width: 20, height: 2, background: "#fff", borderRadius: 2 }} />
              </span>
            )}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden animate-fade-in" style={{ borderTop: "1px solid #2A2E2A", background: "#0E0F0E" }}>
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col">
            {items.map((i) => (
              <a key={i.h} href={i.h} onClick={() => setOpen(false)} className="py-3 text-base"
                style={{ borderBottom: "1px solid #1A1E1A", color: "#FFFFFF" }}>
                {i.l}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

/* ────────── Hero ────────── */

function Hero({ onOrder, onCalc }: { onOrder: () => void; onCalc: () => void }) {
  const chips = [
    { Icon: Leaf, l: "Научный подход" },
    { Icon: Sparkles, l: "Под твою цель" },
    { Icon: Star, l: "Премиум" },
    { Icon: Truck, l: "Ежедневно" },
  ];
  return (
    <section id="top" className="relative overflow-hidden" style={{ background: "#0E0F0E", paddingTop: 20, paddingBottom: 40 }}>
      <div className="noise-overlay" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="reveal">
          <span
            className="inline-flex items-center gap-1.5 rounded-full"
            style={{
              padding: "6px 14px", border: "1px solid #2E7D32",
              background: "rgba(46,125,50,0.12)", color: "#9FD89F",
              fontFamily: "Inter", fontSize: 13, fontWeight: 500,
            }}
          >
            <MapPin size={13} /> Доставка по Ростову-на-Дону
          </span>

          <h1
            className="mt-5 font-display"
            style={{
              fontFamily: "Unbounded", fontWeight: 900,
              fontSize: 40, lineHeight: 1.1, letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "#FFFFFF" }}>Умное питание</span><br />
            <span style={{ color: "#D4AF37" }}>под твою цель</span>
          </h1>

          <p className="mt-5" style={{ color: "#A0A89A", fontFamily: "Inter", fontSize: 16, lineHeight: 1.6, maxWidth: 460 }}>
            Готовые рационы с точным расчётом КБЖУ. Без готовки и без лишнего.
          </p>

          <div className="mt-6 flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
            {chips.map(({ Icon, l }) => (
              <div key={l} className="shrink-0 inline-flex items-center rounded-full"
                style={{ background: "#1A1E1A", padding: "8px 14px", gap: 6 }}>
                <Icon size={16} color="#D4AF37" />
                <span style={{ color: "#FFFFFF", fontFamily: "Inter", fontSize: 13 }}>{l}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-2.5 max-w-md">
            <button onClick={onOrder} className="press rounded-full w-full"
              style={{ background: "#D4AF37", color: "#0E0F0E", height: 52, fontFamily: "Inter", fontWeight: 700, fontSize: 16, letterSpacing: "0.01em" }}>
              Выбрать рацион
            </button>
            <button onClick={onCalc} className="press rounded-full w-full"
              style={{ background: "transparent", border: "1.5px solid #2E7D32", color: "#FFFFFF", height: 52, fontFamily: "Inter", fontWeight: 600, fontSize: 16 }}>
              Рассчитать калории
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────── Lines ────────── */

function LinesSection({ onSelect }: { onSelect: (line: Line) => void }) {
  return (
    <section id="lines" style={{ background: "#FFFFFF", padding: "40px 16px" }}>
      <div className="mx-auto max-w-6xl">
        <h2 className="reveal" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 30, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#0E0F0E" }}>
          Наши линейки
        </h2>
        <p className="reveal mt-2" style={{ fontFamily: "Inter", fontSize: 15, color: "#555" }}>
          5 готовых программ под любую цель
        </p>

        <div className="mt-6 flex flex-col" style={{ gap: 12 }}>
          {LINES.map((line) => (
            <button
              key={line.id}
              onClick={() => onSelect(line)}
              className="reveal press text-left relative overflow-hidden w-full"
              style={{
                background: line.bg, borderRadius: 20, padding: 20, minHeight: 200,
                display: "flex", gap: 16, alignItems: "stretch",
              }}
            >
              {line.popular && (
                <span className="absolute" style={{
                  top: 14, right: 14, background: "#D4AF37", color: "#0E0F0E",
                  borderRadius: 50, padding: "4px 10px",
                  fontFamily: "Inter", fontWeight: 700, fontSize: 11, letterSpacing: "0.04em",
                }}>
                  ХИТ
                </span>
              )}

              <div className="flex flex-col" style={{ flex: "0 0 70%", minWidth: 0 }}>
                <div style={{
                  fontFamily: "Unbounded", fontWeight: 900, fontSize: 26,
                  letterSpacing: "-0.02em", color: "#0E0F0E", textTransform: "uppercase",
                }}>
                  {line.id}
                </div>
                <div className="mt-1.5 tabular" style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 14, color: "#555" }}>
                  {line.kcal}
                </div>
                <div className="mt-1" style={{ fontFamily: "Inter", fontSize: 14, color: "#555", lineHeight: 1.5 }}>
                  {line.desc}
                </div>
                <div className="tabular mt-2" style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 16, color: "#0E0F0E" }}>
                  {line.price}
                </div>
                <div className="mt-auto pt-3" style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 14, color: "#0E0F0E" }}>
                  Подробнее →
                </div>
              </div>

              <div className="rounded-xl flex items-center justify-center" style={{
                flex: "1 1 0", background: "rgba(0,0,0,0.08)", fontSize: 38,
              }}>
                {line.emoji}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── Menu ────────── */

function MenuSection({ onOpenDish }: { onOpenDish: (d: Dish) => void }) {
  const [day, setDay] = useState(0);
  const [filter, setFilter] = useState<LineId | "ALL">("ALL");
  const [fade, setFade] = useState(true);

  const filtered = useMemo(() => {
    if (filter === "ALL") return MONDAY;
    return MONDAY.filter((d) => d.line === filter);
  }, [filter]);

  function pickDay(i: number) {
    setFade(false);
    setTimeout(() => { setDay(i); setFade(true); }, 200);
  }

  return (
    <section id="menu" style={{ background: "#0E0F0E", padding: "40px 16px" }}>
      <div className="mx-auto max-w-6xl">
        <h2 className="reveal" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 30, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
          Меню на неделю
        </h2>
        <p className="reveal mt-2" style={{ fontFamily: "Inter", fontSize: 15, color: "#A0A89A" }}>
          Свежие блюда каждый день. Меняем еженедельно.
        </p>

        {/* Day circles */}
        <div className="reveal mt-6 flex overflow-x-auto hide-scrollbar -mx-4 px-4" style={{ gap: 8 }}>
          {DAYS.map((d, i) => {
            const active = i === day;
            return (
              <button
                key={d}
                onClick={() => pickDay(i)}
                className="press shrink-0 grid place-items-center rounded-full"
                style={{
                  width: 44, height: 44,
                  background: active ? "#D4AF37" : "#1A1E1A",
                  color: active ? "#0E0F0E" : "#A0A89A",
                  border: active ? "none" : "1px solid #2A2E2A",
                  fontFamily: "Inter", fontWeight: 700, fontSize: 12,
                }}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* Line filter */}
        <div className="reveal mt-3 flex overflow-x-auto hide-scrollbar -mx-4 px-4" style={{ gap: 8 }}>
          {(["ALL", ...LINES.map((l) => l.id)] as const).map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="press shrink-0 rounded-full"
                style={{
                  background: active ? "#2E7D32" : "#1A1E1A",
                  color: active ? "#FFFFFF" : "#A0A89A",
                  border: active ? "1px solid #2E7D32" : "1px solid #2A2E2A",
                  padding: "6px 14px",
                  fontFamily: "Inter", fontWeight: 600, fontSize: 13,
                }}
              >
                {f === "ALL" ? "Все" : f}
              </button>
            );
          })}
        </div>

        {/* Dishes */}
        {day === 0 ? (
          <div
            className="reveal mt-6 flex flex-col"
            style={{ gap: 1, opacity: fade ? 1 : 0, transition: "opacity 200ms ease" }}
          >
            {filtered.length === 0 && (
              <div style={{ background: "#161816", borderRadius: 20, padding: 32, textAlign: "center", color: "#A0A89A" }}>
                Нет блюд в этой линейке
              </div>
            )}
            {filtered.map((d, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === filtered.length - 1;
              const radius = `${isFirst ? 20 : 0}px ${isFirst ? 20 : 0}px ${isLast ? 20 : 0}px ${isLast ? 20 : 0}px`;
              return (
                <div key={d.name} style={{ background: "#161816", padding: 16, borderRadius: radius }}>
                  <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 11, color: "#A0A89A", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {d.meal}
                  </div>
                  <div className="mt-1" style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 16, color: "#FFFFFF", lineHeight: 1.3 }}>
                    {d.name}
                  </div>
                  <div className="mt-1 tabular" style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 13, color: "#A0A89A" }}>
                    {d.kcal} ккал · Б {d.p}г · Ж {d.f}г · У {d.c}г
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button onClick={() => onOpenDish(d)}
                      style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 12, color: "#D4AF37", padding: 0, background: "transparent" }}>
                      Состав →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="reveal mt-6" style={{ background: "#161816", borderRadius: 20, padding: 48, textAlign: "center", color: "#A0A89A" }}>
            [Меню обновляется]
          </div>
        )}
      </div>
    </section>
  );
}

/* ────────── Dish Modal ────────── */

function DishModal({ dish, onClose }: { dish: Dish; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-[480px] max-h-[92vh] overflow-y-auto animate-slide-up"
        style={{ background: "#161816", borderRadius: "24px 24px 0 0", border: "1px solid #2A2E2A" }}>
        <button onClick={onClose} className="absolute top-3 right-3 z-10 h-10 w-10 grid place-items-center rounded-full"
          style={{ background: "rgba(0,0,0,0.6)", color: "#FFFFFF" }} aria-label="Закрыть">
          <X size={20} />
        </button>
        <div className="dish-placeholder" style={{ height: 200, borderRadius: "24px 24px 0 0", fontSize: 56 }}>🥗</div>

        <div className="p-5 space-y-5">
          <div>
            <span style={{ background: "#D4AF37", color: "#0E0F0E", fontFamily: "Inter", fontWeight: 700, fontSize: 11, padding: "4px 10px", borderRadius: 50 }}>
              {dish.line}
            </span>
            <h3 className="mt-3" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 22, lineHeight: 1.2, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
              {dish.name}
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { l: "ккал", v: dish.kcal },
              { l: "Белки", v: dish.p },
              { l: "Жиры", v: dish.f },
              { l: "Углев.", v: dish.c },
            ].map((m) => (
              <div key={m.l} className="rounded-xl p-3 text-center" style={{ background: "#1C1E1C" }}>
                <div style={{ fontSize: 10, color: "#A0A89A", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.l}</div>
                <div className="tabular mt-1" style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 18, color: "#D4AF37" }}>{m.v}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 11, color: "#A0A89A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>СОСТАВ</div>
            <ul className="space-y-1.5">
              {dish.ingredients.split(", ").map((i) => (
                <li key={i} className="flex items-start gap-2" style={{ fontFamily: "Inter", fontSize: 14, color: "#FFFFFF" }}>
                  <span style={{ marginTop: 7, width: 4, height: 4, borderRadius: 9999, background: "#2E7D32", flexShrink: 0 }} />
                  {i}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 11, color: "#A0A89A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>На 100 г</div>
            <table className="w-full tabular" style={{ fontFamily: "Inter", fontSize: 14 }}>
              <tbody>
                {[
                  ["Калорийность", `${Math.round(dish.kcal / 3)} ккал`],
                  ["Белки", `${(dish.p / 3).toFixed(1)} г`],
                  ["Жиры", `${(dish.f / 3).toFixed(1)} г`],
                  ["Углеводы", `${(dish.c / 3).toFixed(1)} г`],
                ].map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: "1px solid #2A2E2A" }}>
                    <td className="py-2" style={{ color: "#A0A89A" }}>{k}</td>
                    <td className="py-2 text-right" style={{ color: "#FFFFFF", fontWeight: 600 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────── Calculator ────────── */

function Calculator({ onOrder }: { onOrder: (line: LineId) => void }) {
  const [sex, setSex] = useState<"M" | "F">("M");
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(178);
  const [weight, setWeight] = useState(78);
  const [act, setAct] = useState(1.375);
  const [goal, setGoal] = useState<"loss" | "keep" | "gain">("keep");
  const [result, setResult] = useState<{ kcal: number; line: LineId } | null>(null);

  function compute() {
    const bmr = sex === "M"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
    let kcal = Math.round(bmr * act);
    if (goal === "loss") kcal -= 300;
    if (goal === "gain") kcal += 300;
    let line: LineId = "PRO";
    if (kcal <= 1400) line = "LIGHT";
    else if (kcal <= 1800) line = "BALANCE";
    else if (kcal <= 2200) line = "POWER";
    setResult({ kcal, line });
  }

  const inputStyle: React.CSSProperties = {
    background: "#F5F5F5", border: "none", borderRadius: 12,
    padding: "14px 16px", fontFamily: "Inter", fontWeight: 500, fontSize: 16,
    color: "#0E0F0E", height: 52, width: "100%", outline: "none",
  };
  const lbl: React.CSSProperties = {
    fontFamily: "Inter", fontWeight: 600, fontSize: 12, color: "#555",
    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, display: "block",
  };

  return (
    <section id="calc" style={{ background: "#FFFFFF", padding: "40px 16px" }}>
      <div className="mx-auto max-w-2xl">
        <h2 className="reveal" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#0E0F0E" }}>
          Рассчитай норму
        </h2>
        <p className="reveal mt-2" style={{ fontFamily: "Inter", fontSize: 15, color: "#555" }}>
          Подберём рацион под твои параметры
        </p>

        <div className="reveal mt-6 space-y-5">
          <div>
            <label style={lbl}>Пол</label>
            <div className="flex" style={{ gap: 8 }}>
              {(["M", "F"] as const).map((s) => {
                const active = sex === s;
                return (
                  <button key={s} onClick={() => setSex(s)} className="press"
                    style={{
                      flex: 1, height: 52, borderRadius: 12,
                      background: active ? "#0E0F0E" : "#F5F5F5",
                      color: active ? "#FFFFFF" : "#555",
                      fontFamily: "Inter", fontWeight: 600, fontSize: 15,
                    }}>{s === "M" ? "Мужчина" : "Женщина"}</button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { l: "Возраст", v: age, set: setAge, min: 18, max: 80 },
              { l: "Рост, см", v: height, set: setHeight, min: 120, max: 220 },
              { l: "Вес, кг", v: weight, set: setWeight, min: 35, max: 200 },
            ].map((f) => (
              <div key={f.l}>
                <label style={lbl}>{f.l}</label>
                <input type="number" inputMode="numeric" min={f.min} max={f.max} value={f.v}
                  onChange={(e) => f.set(parseInt(e.target.value) || 0)}
                  className="tabular"
                  style={{ ...inputStyle, fontWeight: 700 }} />
              </div>
            ))}
          </div>

          <div>
            <label style={lbl}>Активность</label>
            <select value={act} onChange={(e) => setAct(parseFloat(e.target.value))} style={inputStyle}>
              <option value={1.2}>Сидячий образ жизни</option>
              <option value={1.375}>Лёгкая активность (1–3 раза)</option>
              <option value={1.55}>Умеренная (3–5 раз)</option>
              <option value={1.725}>Высокая (6–7 раз)</option>
            </select>
          </div>

          <div>
            <label style={lbl}>Цель</label>
            <div className="flex" style={{ gap: 8 }}>
              {([
                ["loss", "Снижение"], ["keep", "Поддержание"], ["gain", "Набор"],
              ] as const).map(([k, l]) => {
                const active = goal === k;
                return (
                  <button key={k} onClick={() => setGoal(k)} className="press"
                    style={{
                      flex: 1, height: 52, borderRadius: 12,
                      background: active ? "#0E0F0E" : "#F5F5F5",
                      color: active ? "#FFFFFF" : "#555",
                      fontFamily: "Inter", fontWeight: 600, fontSize: 13,
                    }}>{l}</button>
                );
              })}
            </div>
          </div>

          <button onClick={compute} className="press"
            style={{
              width: "100%", height: 56, borderRadius: 50,
              background: "#0E0F0E", color: "#D4AF37",
              fontFamily: "Unbounded", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em",
            }}>
            Рассчитать
          </button>

          {result && (
            <div className="animate-fade-in" style={{ background: "#0E0F0E", borderRadius: 20, padding: 24 }}>
              <div style={{ fontFamily: "Inter", fontSize: 14, color: "#A0A89A" }}>Ваша норма:</div>
              <div className="tabular mt-1" style={{ fontFamily: "Unbounded", fontWeight: 900, fontSize: 40, color: "#D4AF37", lineHeight: 1.1 }}>
                {result.kcal} <span style={{ fontFamily: "Inter", fontSize: 16, fontWeight: 500, color: "#A0A89A" }}>ккал/день</span>
              </div>
              <div className="mt-3" style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 16, color: "#FFFFFF" }}>
                Рекомендуем: {result.line}
              </div>
              <button onClick={() => onOrder(result.line)} className="press mt-4"
                style={{
                  width: "100%", height: 52, borderRadius: 50,
                  background: "#D4AF37", color: "#0E0F0E",
                  fontFamily: "Inter", fontWeight: 700, fontSize: 16,
                }}>
                Выбрать рацион {result.line}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ────────── Subscription ────────── */

function Subscription({ onSelect }: { onSelect: (period: string) => void }) {
  const plans = [
    { id: "1 день", price: "от 750 ₽", old: null as string | null, badge: null as string | null,
      features: ["4 приёма пищи", "Доставка сегодня", "Выбор линейки"], primary: false },
    { id: "3 дня", price: "от 2 100 ₽", old: "2 400 ₽", badge: "ПОПУЛЯРНО",
      features: ["12 приёмов пищи", "Скидка 12%", "Выбор линейки"], primary: true, discount: "Скидка 12%" },
    { id: "Месяц", price: "от 19 500 ₽", old: "24 000 ₽", badge: null,
      features: ["Скидка 20%", "Приоритетная доставка", "Заморозка дней"], primary: false },
  ];

  return (
    <section style={{ background: "#0E0F0E", padding: "40px 16px" }}>
      <div className="mx-auto max-w-6xl">
        <h2 className="reveal" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
          Выбери формат
        </h2>
        <p className="reveal mt-2" style={{ fontFamily: "Inter", fontSize: 15, color: "#A0A89A" }}>
          Чем длиннее период — тем выгоднее
        </p>

        <div className="mt-6 flex flex-col" style={{ gap: 12 }}>
          {plans.map((p) => (
            <div key={p.id} className="reveal relative"
              style={{
                background: p.primary ? "#1C2A1C" : "#161816",
                border: p.primary ? "1.5px solid #2E7D32" : "1px solid #2A2E2A",
                borderRadius: 20, padding: 20,
              }}>
              {p.badge && (
                <span className="absolute" style={{
                  top: 14, right: 14, background: "#D4AF37", color: "#0E0F0E",
                  borderRadius: 50, padding: "4px 10px",
                  fontFamily: "Inter", fontWeight: 700, fontSize: 11, letterSpacing: "0.04em",
                }}>
                  {p.badge}
                </span>
              )}
              <div style={{ fontFamily: "Unbounded", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", color: "#FFFFFF", textTransform: "uppercase" }}>
                {p.id}
              </div>

              <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                <span className="tabular" style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 28, color: "#D4AF37" }}>{p.price}</span>
                {p.old && (
                  <span className="tabular" style={{ fontFamily: "Inter", fontSize: 16, color: "#A0A89A", textDecoration: "line-through" }}>{p.old}</span>
                )}
              </div>

              {"discount" in p && p.discount && (
                <span className="inline-block mt-2" style={{
                  background: "#2E7D32", color: "#FFFFFF", borderRadius: 50,
                  padding: "3px 10px", fontFamily: "Inter", fontWeight: 600, fontSize: 12,
                }}>{p.discount}</span>
              )}

              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2" style={{ fontFamily: "Inter", fontSize: 14, color: "#A0A89A" }}>
                    <Check size={16} color="#9FD89F" style={{ marginTop: 2, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button onClick={() => onSelect(p.id)} className="press mt-5 w-full"
                style={{
                  height: p.primary ? 52 : 48, borderRadius: 50,
                  background: p.primary ? "#D4AF37" : "transparent",
                  border: p.primary ? "none" : "1.5px solid #2A2E2A",
                  color: p.primary ? "#0E0F0E" : "#FFFFFF",
                  fontFamily: "Inter", fontWeight: p.primary ? 700 : 600, fontSize: p.primary ? 15 : 14,
                }}>
                Выбрать
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── Delivery ────────── */

function Delivery({ onAsk }: { onAsk: () => void }) {
  return (
    <section id="delivery" style={{ background: "#FFFFFF", padding: "40px 16px" }}>
      <div className="mx-auto max-w-6xl">
        <h2 className="reveal" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 26, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#0E0F0E" }}>
          Доставка
        </h2>

        <div className="mt-5 grid grid-cols-2" style={{ gap: 12 }}>
          <div className="reveal" style={{ background: "#E8F5E9", borderRadius: 16, padding: 16 }}>
            <Check size={20} color="#2E7D32" />
            <div className="mt-2" style={{ fontFamily: "Unbounded", fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em", color: "#0E0F0E" }}>
              Бесплатно
            </div>
            <div className="mt-1" style={{ fontFamily: "Inter", fontSize: 13, color: "#555", lineHeight: 1.4 }}>
              По всему Ростову
            </div>
            <div className="mt-3 flex flex-wrap" style={{ gap: 4 }}>
              {["07:00–08:00", "09:00–10:00", "18:00–19:00"].map((s) => (
                <span key={s} className="tabular" style={{
                  background: "#2E7D32", color: "#FFFFFF", borderRadius: 50,
                  padding: "3px 8px", fontFamily: "Inter", fontSize: 11, fontWeight: 500,
                }}>{s}</span>
              ))}
            </div>
          </div>

          <div className="reveal" style={{ background: "#FFF8E1", borderRadius: 16, padding: 16 }}>
            <Phone size={20} color="#D4AF37" />
            <div className="mt-2" style={{ fontFamily: "Unbounded", fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em", color: "#0E0F0E" }}>
              Индивидуально
            </div>
            <div className="mt-1" style={{ fontFamily: "Inter", fontSize: 13, color: "#555", lineHeight: 1.4 }}>
              Батайск, Аксай и другие
            </div>
            <button onClick={onAsk} className="press mt-3"
              style={{
                background: "#D4AF37", color: "#0E0F0E", borderRadius: 50,
                padding: "8px 16px", fontFamily: "Inter", fontWeight: 600, fontSize: 13,
              }}>
              Уточнить
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────── FAQ ────────── */

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" style={{ background: "#0E0F0E", padding: "40px 16px" }}>
      <div className="mx-auto max-w-2xl">
        <h2 className="reveal" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
          Частые вопросы
        </h2>

        <div className="reveal mt-6">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} style={{ borderBottom: "1px solid #2A2E2A" }}>
                <button onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left"
                  style={{ padding: "18px 0", fontFamily: "Inter", fontWeight: 600, fontSize: 16, color: "#FFFFFF" }}>
                  <span style={{ paddingRight: 16 }}>{item.q}</span>
                  {isOpen
                    ? <Minus size={20} color="#D4AF37" style={{ flexShrink: 0 }} />
                    : <Plus size={20} color="#D4AF37" style={{ flexShrink: 0 }} />}
                </button>
                <div style={{
                  maxHeight: isOpen ? 320 : 0, overflow: "hidden",
                  transition: "max-height 250ms ease",
                }}>
                  <p style={{
                    fontFamily: "Inter", fontWeight: 400, fontSize: 15,
                    color: "#A0A89A", lineHeight: 1.7,
                    paddingTop: 2, paddingBottom: 18,
                  }}>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────── Order Form ────────── */

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

  const fieldStyle: React.CSSProperties = {
    background: "#161816", border: "1px solid #2A2E2A", borderRadius: 14,
    padding: "0 16px", fontFamily: "Inter", fontWeight: 500, fontSize: 16,
    color: "#FFFFFF", height: 56, width: "100%", outline: "none",
  };
  const textareaStyle: React.CSSProperties = {
    ...fieldStyle, height: "auto", padding: "16px",
    minHeight: 96, resize: "vertical",
  };

  return (
    <section id="order-form" style={{
      background: "linear-gradient(180deg, #0E0F0E 0%, #0F1A0F 100%)",
      padding: "40px 16px",
    }}>
      <div className="mx-auto max-w-2xl">
        <h2 className="reveal" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
          Оставь заявку
        </h2>
        <p className="reveal mt-2" style={{ fontFamily: "Inter", fontSize: 15, color: "#A0A89A" }}>
          Ответим в Telegram за 30 минут
        </p>

        {sent ? (
          <div className="reveal in mt-6 animate-fade-in text-center" style={{
            background: "#161816", border: "1px solid #2E7D32", borderRadius: 20, padding: 32,
          }}>
            <div className="mx-auto grid place-items-center rounded-full"
              style={{ width: 60, height: 60, background: "#2E7D32" }}>
              <Check size={30} color="#FFFFFF" strokeWidth={3} />
            </div>
            <div className="mt-4" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 24, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
              Заявка принята!
            </div>
            <p className="mt-2" style={{ fontFamily: "Inter", fontSize: 15, color: "#A0A89A", lineHeight: 1.6 }}>
              Мы напишем вам в Telegram в течение 30 минут.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="reveal mt-6 space-y-3">
            <input style={fieldStyle} placeholder="Ваше имя" value={state.name} onChange={(e) => set("name", e.target.value)} required
              onFocus={(e) => e.currentTarget.style.borderColor = "#D4AF37"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#2A2E2A"} />
            <input style={fieldStyle} type="tel" placeholder="+7 (000) 000-00-00" value={state.phone}
              onChange={(e) => set("phone", maskPhone(e.target.value))} required
              onFocus={(e) => e.currentTarget.style.borderColor = "#D4AF37"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#2A2E2A"} />
            <input style={fieldStyle} placeholder="Telegram: @username" value={state.messenger}
              onChange={(e) => set("messenger", e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = "#D4AF37"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#2A2E2A"} />

            <div className="grid grid-cols-2 gap-3">
              <select style={fieldStyle} value={state.line} onChange={(e) => set("line", e.target.value)}>
                {LINES.map((l) => <option key={l.id} value={l.id}>{l.id}</option>)}
              </select>
              <select style={fieldStyle} value={state.period} onChange={(e) => set("period", e.target.value)}>
                <option>1 день</option><option>3 дня</option><option>Месяц</option>
              </select>
            </div>

            <input style={fieldStyle} placeholder="Улица, дом, квартира" value={state.address}
              onChange={(e) => set("address", e.target.value)} required
              onFocus={(e) => e.currentTarget.style.borderColor = "#D4AF37"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#2A2E2A"} />

            <select style={fieldStyle} value={state.slot} onChange={(e) => set("slot", e.target.value)}>
              <option>07:00–08:00</option><option>09:00–10:00</option><option>18:00–19:00</option>
            </select>

            <textarea style={textareaStyle} placeholder="Комментарий (необязательно)"
              value={state.comment} onChange={(e) => set("comment", e.target.value)} />

            <button type="submit" className="press mt-2"
              style={{
                width: "100%", height: 56, borderRadius: 50,
                background: "#D4AF37", color: "#0E0F0E",
                fontFamily: "Unbounded", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em",
              }}>
              Отправить заявку
            </button>
            <p className="text-center mt-2" style={{ fontFamily: "Inter", fontSize: 12, color: "#A0A89A" }}>
              Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

/* ────────── Footer ────────── */

function Footer() {
  const links = [
    { l: "Рационы", h: "#lines" },
    { l: "Меню", h: "#menu" },
    { l: "Калькулятор", h: "#calc" },
    { l: "Доставка", h: "#delivery" },
    { l: "FAQ", h: "#faq" },
  ];
  return (
    <footer id="footer" style={{ background: "#0A0B0A", borderTop: "1px solid #1A1E1A", padding: "32px 16px 40px" }}>
      <div className="mx-auto max-w-6xl">
        <Logo />
        <p className="mt-3" style={{ fontFamily: "Inter", fontSize: 14, color: "#A0A89A", maxWidth: 320, lineHeight: 1.6 }}>
          Готовые рационы с расчётом КБЖУ. Доставка по Ростову-на-Дону.
        </p>

        <ul className="mt-6 flex flex-wrap" style={{ gap: 16 }}>
          {links.map((l) => (
            <li key={l.h}>
              <a href={l.h} style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 14, color: "#A0A89A" }}>
                {l.l}
              </a>
            </li>
          ))}
        </ul>

        <a href="tel:+79991234567" className="mt-5 inline-block"
          style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 16, color: "#D4AF37" }}>
          +7 (999) 123-45-67
        </a>

        <div className="mt-5 flex" style={{ gap: 10 }}>
          {[
            { Icon: Send, href: "https://t.me/fitera_rstv", label: "Telegram" },
            { Icon: Instagram, href: "https://instagram.com/fitera.food", label: "Instagram" },
          ].map(({ Icon, href, label }) => (
            <a key={label} href={href} aria-label={label}
              className="grid place-items-center rounded-full"
              style={{ width: 32, height: 32, background: "#1A1E1A", color: "#D4AF37" }}>
              <Icon size={16} />
            </a>
          ))}
        </div>

        <div className="mt-6" style={{ fontFamily: "Inter", fontSize: 12, color: "#555" }}>
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
    <div style={{ background: "#0E0F0E", minHeight: "100vh" }}>
      <Navbar onOrder={() => scrollTo("order-form")} />
      <main>
        <Hero onOrder={() => scrollTo("lines")} onCalc={() => scrollTo("calc")} />
        <LinesSection onSelect={chooseLine} />
        <MenuSection onOpenDish={setDish} />
        <Calculator onOrder={(line) => { setOrder((s) => ({ ...s, line })); scrollTo("order-form"); }} />
        <Subscription onSelect={choosePeriod} />
        <Delivery onAsk={askOutOfCity} />
        <FAQSection />
        <OrderForm initial={order} onUpdate={setOrder} />
      </main>
      <Footer />
      {dish && <DishModal dish={dish} onClose={() => setDish(null)} />}
    </div>
  );
}
