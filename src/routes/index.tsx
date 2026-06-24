import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  X, Check, Phone, Leaf, Truck, Star, Sparkles, Send, Instagram, MapPin, Plus, Minus, ChevronRight, ArrowRight,
  Flame, Heart, Crown, type LucideIcon,
} from "lucide-react";


import heroFood from "../assets/hero-food.jpg";
import lineLight from "../assets/line-light.jpg";
import lineBalance from "../assets/line-balance.jpg";
import linePower from "../assets/line-power.jpg";
import lineMom from "../assets/line-mom.jpg";
import linePro from "../assets/line-pro.jpg";

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
  title: string;
  kcal: string;
  desc: string;
  priceFrom: string;
  popular?: boolean;
  accent: string;
  tint: string;
  image: string;
  Icon: LucideIcon;
};

const LINES: Line[] = [
  { id: "LIGHT",   title: "Лёгкий",  kcal: "1200–1400", desc: "Снижение веса",        priceFrom: "от 750 ₽",  accent: "#7CB342", tint: "#EEF7E4", image: lineLight,   Icon: Leaf },
  { id: "BALANCE", title: "Баланс",  kcal: "1500–1800", desc: "Поддержание формы",    priceFrom: "от 850 ₽",  accent: "#42A5F5", tint: "#E5F1FB", image: lineBalance, Icon: Sparkles },
  { id: "POWER",   title: "Сила",    kcal: "2000–2500", desc: "Набор массы",          priceFrom: "от 950 ₽",  popular: true, accent: "#D4AF37", tint: "#FBF3DC", image: linePower, Icon: Flame },
  { id: "MOM",     title: "Мама",    kcal: "1600–1900", desc: "Для молодых мам",      priceFrom: "от 900 ₽",  accent: "#EC8DA5", tint: "#FBEAF0", image: lineMom,     Icon: Heart },
  { id: "PRO",     title: "Премиум", kcal: "2200–2800", desc: "Для занятых людей",    priceFrom: "от 1 100 ₽", accent: "#8E7CC3", tint: "#EFEAF8", image: linePro,    Icon: Crown },
];


type Dish = {
  name: string;
  meal: "ЗАВТРАК" | "ПЕРЕКУС" | "ОБЕД" | "УЖИН";
  kcal: number;
  p: number; f: number; c: number;
  line: LineId;
  ingredients: string;
};

// 7 завтраков × 5 линеек и т.д. (компактно — варианты по линейке × дню)
const WEEK_MENU: Record<LineId, Dish[][]> = {
  LIGHT: [
    [
      { name: "Овсянка с ягодами и миндалём", meal: "ЗАВТРАК", kcal: 320, p: 12, f: 8, c: 48, line: "LIGHT", ingredients: "Овсяные хлопья, миндаль, голубика, малина, мёд, корица" },
      { name: "Греческий йогурт с яблоком", meal: "ПЕРЕКУС", kcal: 180, p: 14, f: 4, c: 22, line: "LIGHT", ingredients: "Греческий йогурт 2%, яблоко, корица" },
      { name: "Курица гриль с овощами", meal: "ОБЕД", kcal: 420, p: 38, f: 12, c: 34, line: "LIGHT", ingredients: "Куриное филе, цукини, перец, томаты, оливковое масло, специи" },
      { name: "Треска с брокколи на пару", meal: "УЖИН", kcal: 280, p: 32, f: 6, c: 18, line: "LIGHT", ingredients: "Треска, брокколи, лимон, оливковое масло, тимьян" },
    ],
    [
      { name: "Творожный мусс с малиной", meal: "ЗАВТРАК", kcal: 290, p: 22, f: 6, c: 32, line: "LIGHT", ingredients: "Творог 2%, малина, мёд, ванильный экстракт" },
      { name: "Хумус с овощами", meal: "ПЕРЕКУС", kcal: 170, p: 7, f: 8, c: 18, line: "LIGHT", ingredients: "Нут, тахини, морковь, сельдерей, перец" },
      { name: "Индейка с гречкой и шпинатом", meal: "ОБЕД", kcal: 410, p: 34, f: 10, c: 38, line: "LIGHT", ingredients: "Филе индейки, гречка, шпинат, лук, оливковое масло" },
      { name: "Салат с тунцом и фасолью", meal: "УЖИН", kcal: 300, p: 30, f: 8, c: 22, line: "LIGHT", ingredients: "Тунец, фасоль, томаты, оливки, листья салата" },
    ],
    [
      { name: "Гречневая каша с черникой", meal: "ЗАВТРАК", kcal: 310, p: 11, f: 6, c: 52, line: "LIGHT", ingredients: "Гречневые хлопья, черника, миндальное молоко, мёд" },
      { name: "Творог с грушей", meal: "ПЕРЕКУС", kcal: 160, p: 16, f: 3, c: 18, line: "LIGHT", ingredients: "Творог 2%, груша, корица" },
      { name: "Курица в йогурте с овощами", meal: "ОБЕД", kcal: 400, p: 36, f: 10, c: 30, line: "LIGHT", ingredients: "Куриное филе, йогурт, овощи гриль, специи" },
      { name: "Хек с овощным рагу", meal: "УЖИН", kcal: 290, p: 28, f: 8, c: 22, line: "LIGHT", ingredients: "Хек, томаты, кабачок, перец, лук" },
    ],
    [
      { name: "Омлет со шпинатом", meal: "ЗАВТРАК", kcal: 280, p: 22, f: 14, c: 8, line: "LIGHT", ingredients: "Яйца, шпинат, томаты черри, специи" },
      { name: "Яблоко с миндалём", meal: "ПЕРЕКУС", kcal: 160, p: 4, f: 8, c: 18, line: "LIGHT", ingredients: "Яблоко, миндаль" },
      { name: "Тёплый салат с курицей", meal: "ОБЕД", kcal: 410, p: 36, f: 12, c: 28, line: "LIGHT", ingredients: "Куриное филе, киноа, шпинат, томаты, оливковое масло" },
      { name: "Минтай с овощами", meal: "УЖИН", kcal: 270, p: 30, f: 6, c: 18, line: "LIGHT", ingredients: "Минтай, цветная капуста, морковь, лук" },
    ],
    [
      { name: "Сырники запечённые", meal: "ЗАВТРАК", kcal: 330, p: 24, f: 10, c: 30, line: "LIGHT", ingredients: "Творог 2%, яйцо, рисовая мука, ягоды" },
      { name: "Огуречный смузи", meal: "ПЕРЕКУС", kcal: 120, p: 4, f: 2, c: 22, line: "LIGHT", ingredients: "Огурец, мята, лимон, яблоко" },
      { name: "Запечённая индейка с овощами", meal: "ОБЕД", kcal: 420, p: 40, f: 10, c: 32, line: "LIGHT", ingredients: "Индейка, баклажан, перец, специи" },
      { name: "Креветки с салатом", meal: "УЖИН", kcal: 280, p: 28, f: 8, c: 18, line: "LIGHT", ingredients: "Креветки, листья салата, авокадо, лимон" },
    ],
    [
      { name: "Овсянка с грушей и корицей", meal: "ЗАВТРАК", kcal: 310, p: 11, f: 7, c: 48, line: "LIGHT", ingredients: "Овсяные хлопья, груша, корица, мёд" },
      { name: "Кефир с ягодами", meal: "ПЕРЕКУС", kcal: 150, p: 10, f: 3, c: 18, line: "LIGHT", ingredients: "Кефир 1%, малина, голубика" },
      { name: "Куриные шашлычки с булгуром", meal: "ОБЕД", kcal: 430, p: 38, f: 10, c: 38, line: "LIGHT", ingredients: "Куриное филе, булгур, лук, специи" },
      { name: "Лосось с овощами на пару", meal: "УЖИН", kcal: 320, p: 32, f: 14, c: 14, line: "LIGHT", ingredients: "Лосось, брокколи, цветная капуста, лимон" },
    ],
    [
      { name: "Каша киноа с ягодами", meal: "ЗАВТРАК", kcal: 300, p: 10, f: 6, c: 50, line: "LIGHT", ingredients: "Киноа, миндальное молоко, малина, мёд" },
      { name: "Греческий йогурт с орехами", meal: "ПЕРЕКУС", kcal: 170, p: 13, f: 8, c: 14, line: "LIGHT", ingredients: "Греческий йогурт 2%, грецкий орех, мёд" },
      { name: "Курица с овощным микс", meal: "ОБЕД", kcal: 400, p: 36, f: 10, c: 30, line: "LIGHT", ingredients: "Куриное филе, перец, лук, цукини" },
      { name: "Тилапия с зелёной фасолью", meal: "УЖИН", kcal: 270, p: 30, f: 6, c: 16, line: "LIGHT", ingredients: "Тилапия, зелёная фасоль, лимон, чеснок" },
    ],
  ],
  BALANCE: makeWeekFromBase([
    { name: "Сырники со сметаной", meal: "ЗАВТРАК", kcal: 420, p: 24, f: 14, c: 48, line: "BALANCE", ingredients: "Творог 5%, яйцо, мука рисовая, сметана, ягодный соус" },
    { name: "Орехи и сухофрукты", meal: "ПЕРЕКУС", kcal: 240, p: 8, f: 14, c: 22, line: "BALANCE", ingredients: "Миндаль, грецкий орех, курага, чернослив" },
    { name: "Паста с курицей и песто", meal: "ОБЕД", kcal: 560, p: 34, f: 18, c: 64, line: "BALANCE", ingredients: "Паста дурум, куриное филе, песто, пармезан, томаты черри" },
    { name: "Лосось с киноа и шпинатом", meal: "УЖИН", kcal: 480, p: 36, f: 20, c: 38, line: "BALANCE", ingredients: "Лосось, киноа, шпинат, лимон, оливковое масло" },
  ]),
  POWER: makeWeekFromBase([
    { name: "Омлет с индейкой и сыром", meal: "ЗАВТРАК", kcal: 540, p: 38, f: 28, c: 22, line: "POWER", ingredients: "3 яйца, индейка, сыр чеддер, шпинат, цельнозерновой хлеб" },
    { name: "Протеиновый шейк + банан", meal: "ПЕРЕКУС", kcal: 360, p: 32, f: 6, c: 48, line: "POWER", ingredients: "Whey-протеин, молоко, банан, арахисовая паста" },
    { name: "Говядина с гречкой и овощами", meal: "ОБЕД", kcal: 720, p: 52, f: 22, c: 68, line: "POWER", ingredients: "Говяжья вырезка, гречка, морковь, лук, чесночный соус" },
    { name: "Курица с рисом басмати", meal: "УЖИН", kcal: 620, p: 48, f: 18, c: 62, line: "POWER", ingredients: "Куриное филе, рис басмати, спаржа, оливковое масло" },
  ]),
  MOM: makeWeekFromBase([
    { name: "Творожная запеканка с изюмом", meal: "ЗАВТРАК", kcal: 380, p: 26, f: 10, c: 42, line: "MOM", ingredients: "Творог 5%, яйцо, манная крупа, изюм, ваниль" },
    { name: "Печёное яблоко с орехами", meal: "ПЕРЕКУС", kcal: 200, p: 4, f: 8, c: 30, line: "MOM", ingredients: "Яблоко, грецкий орех, мёд, корица" },
    { name: "Куриные котлеты с пюре", meal: "ОБЕД", kcal: 520, p: 36, f: 16, c: 52, line: "MOM", ingredients: "Куриный фарш, картофель, молоко, сливочное масло, зелень" },
    { name: "Рыбные тефтели с овощами", meal: "УЖИН", kcal: 400, p: 30, f: 12, c: 38, line: "MOM", ingredients: "Хек, рис, морковь, лук, томатный соус" },
  ]),
  PRO: makeWeekFromBase([
    { name: "Гранола с йогуртом и манго", meal: "ЗАВТРАК", kcal: 580, p: 22, f: 18, c: 78, line: "PRO", ingredients: "Гранола, греческий йогурт, манго, кокосовая стружка, мёд" },
    { name: "Сэндвич с индейкой и авокадо", meal: "ПЕРЕКУС", kcal: 380, p: 26, f: 16, c: 36, line: "PRO", ingredients: "Цельнозерновой хлеб, индейка, авокадо, салат, томат" },
    { name: "Стейк с печёным картофелем", meal: "ОБЕД", kcal: 780, p: 54, f: 28, c: 72, line: "PRO", ingredients: "Говяжий стейк, картофель, розмарин, чесночное масло, салат" },
    { name: "Утиная грудка с овощами", meal: "УЖИН", kcal: 660, p: 44, f: 32, c: 42, line: "PRO", ingredients: "Утиная грудка, батат, брюссельская капуста, бальзамик" },
  ]),
};

// Generates 7 days of menus by lightly rotating/permuting the base 4-meal day
function makeWeekFromBase(base: Dish[]): Dish[][] {
  const dayNames = ["", " · вариант 2", " · вариант 3", " · вариант 4", " · вариант 5", " · вариант 6", " · вариант 7"];
  return dayNames.map((suffix, i) =>
    base.map((d) => ({
      ...d,
      name: i === 0 ? d.name : d.name + suffix,
      kcal: d.kcal + (i * 5) - 10,
    })),
  );
}

const DAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const DAYS_FULL = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

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

function Logo({ light = true }: { light?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5 select-none">
      <div
        className="grid place-items-center rounded-[10px] text-white shrink-0"
        style={{ background: "#2E7D32", width: 36, height: 36, fontFamily: "Unbounded", fontWeight: 900, fontSize: 18 }}
      >
        F
      </div>
      <span
        style={{ fontFamily: "Unbounded", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", color: light ? "#FFFFFF" : "#0E0F0E" }}
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
      style={{ background: "rgba(14,15,14,0.78)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between" style={{ height: 64 }}>
        <Logo />
        <nav className="hidden lg:flex items-center gap-7">
          {items.map((i) => (
            <a key={i.h} href={i.h} className="text-sm text-[#A0A89A] hover:text-white transition-colors">{i.l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="tel:+79991234567" className="hidden md:inline-block text-sm font-semibold" style={{ color: "#FFFFFF", letterSpacing: "0.01em" }}>
            +7 (999) 123-45-67
          </a>
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

/* ────────── Hero (Level Kitchen-inspired) ────────── */

function Hero({ onOrder, onCalc }: { onOrder: () => void; onCalc: () => void }) {
  const chips = [
    { Icon: Leaf, l: "Научный подход" },
    { Icon: Sparkles, l: "Под твою цель" },
    { Icon: Star, l: "Премиум" },
    { Icon: Truck, l: "Ежедневно" },
  ];
  return (
    <section id="top" className="relative" style={{ background: "#0E0F0E" }}>
      {/* Background photo */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroFood}
          alt=""
          width={1600}
          height={1200}
          className="w-full h-full object-cover"
          style={{ objectPosition: "right center" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,15,14,0.55) 0%, rgba(14,15,14,0.35) 40%, rgba(14,15,14,0.92) 100%)",
          }}
        />
        {/* Desktop: side gradient to support white card */}
        <div
          className="hidden md:block absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(14,15,14,0.85) 0%, rgba(14,15,14,0.35) 50%, rgba(14,15,14,0) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4" style={{ paddingTop: 32, paddingBottom: 40, minHeight: "min(640px, 90vh)" }}>
        <div className="reveal in" style={{ maxWidth: 560 }}>
          <span
            className="inline-flex items-center gap-1.5 rounded-full backdrop-blur"
            style={{
              padding: "6px 14px", border: "1px solid rgba(46,125,50,0.6)",
              background: "rgba(46,125,50,0.18)", color: "#C8E6C9",
              fontFamily: "Inter", fontSize: 13, fontWeight: 500,
            }}
          >
            <MapPin size={13} /> Доставка по Ростову-на-Дону
          </span>

          {/* White overlay card (Level Kitchen style) */}
          <div
            className="mt-6 backdrop-blur-md"
            style={{
              background: "rgba(255,255,255,0.97)",
              borderRadius: 28,
              padding: "28px 24px",
              boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)",
            }}
          >
            <h1
              className="font-display"
              style={{
                fontFamily: "Unbounded", fontWeight: 900,
                fontSize: "clamp(34px, 7vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.03em",
                color: "#0E0F0E",
              }}
            >
              Готовое питание
              <br />
              <span style={{
                background: "linear-gradient(90deg, #2E7D32 0%, #D4AF37 100%)",
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
              }}>с доставкой</span>
            </h1>

            <p className="mt-4" style={{ color: "#555", fontFamily: "Inter", fontSize: 15, lineHeight: 1.55 }}>
              5 линеек рационов с точным расчётом КБЖУ. Свежее, без готовки, каждый день.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={onOrder} className="press rounded-full inline-flex items-center gap-2"
                style={{ background: "#0E0F0E", color: "#FFFFFF", height: 52, padding: "0 24px", fontFamily: "Inter", fontWeight: 700, fontSize: 15 }}>
                Выбрать рацион <ArrowRight size={18} />
              </button>
              <button onClick={onCalc} className="press rounded-full"
                style={{ background: "transparent", border: "1.5px solid #0E0F0E", color: "#0E0F0E", height: 52, padding: "0 22px", fontFamily: "Inter", fontWeight: 600, fontSize: 15 }}>
                Рассчитать калории
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3 flex-wrap" style={{ fontFamily: "Inter", fontSize: 12, color: "#555" }}>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} color="#2E7D32" /> Бесплатная доставка
              </span>
              <span style={{ width: 3, height: 3, borderRadius: 99, background: "#CCC" }} />
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} color="#2E7D32" /> Первая неделя −15%
              </span>
            </div>
          </div>

          {/* Chips */}
          <div className="mt-5 flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
            {chips.map(({ Icon, l }) => (
              <div key={l} className="shrink-0 inline-flex items-center rounded-full backdrop-blur"
                style={{ background: "rgba(28,30,28,0.7)", border: "1px solid rgba(255,255,255,0.08)", padding: "8px 14px", gap: 6 }}>
                <Icon size={16} color="#D4AF37" />
                <span style={{ color: "#FFFFFF", fontFamily: "Inter", fontSize: 13 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────── Lines (compact row, drives menu) ────────── */

function LinesSection({ selected, onSelect }: { selected: LineId; onSelect: (id: LineId) => void }) {
  const selectedLine = LINES.find((l) => l.id === selected)!;

  return (
    <section id="lines" style={{ background: "#F7F7F5", padding: "56px 16px 32px" }}>
      <div className="mx-auto max-w-6xl">
        {/* Centered header */}
        <div className="text-center reveal">
          <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 12, color: "#2E7D32", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Наши рационы
          </span>
          <h2 className="mt-2 mx-auto" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: "clamp(28px, 5vw, 42px)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "#0E0F0E", maxWidth: 720 }}>
            Выбери линейку
          </h2>
          <p className="mt-3 mx-auto" style={{ fontFamily: "Inter", fontSize: 14, color: "#777", maxWidth: 420, lineHeight: 1.5 }}>
            Меню ниже автоматически собирается под выбранный рацион
          </p>
        </div>

        {/* Banking-app style tile grid */}
        <style>{`
          #lines-grid { display: grid; gap: 10px; grid-template-columns: repeat(2, minmax(0,1fr)); }
          @media (min-width: 560px) { #lines-grid { grid-template-columns: repeat(3, minmax(0,1fr)); } }
          @media (min-width: 900px) { #lines-grid { grid-template-columns: repeat(5, minmax(0,1fr)); } }
        `}</style>
        <div id="lines-grid" className="reveal mt-7">

          {LINES.map((line) => {
            const active = line.id === selected;
            const Icon = line.Icon;
            return (
              <button
                key={line.id}
                onClick={() => onSelect(line.id)}
                aria-pressed={active}
                className={`press relative text-left ${active ? "tile-active" : ""}`}
                style={{
                  background: active ? line.tint : "#FFFFFF",
                  border: `1.5px solid ${active ? line.accent : "rgba(0,0,0,0.06)"}`,
                  borderRadius: 22,
                  padding: 14,
                  ["--tile-accent" as never]: `${line.accent}66`,
                  boxShadow: active
                    ? `0 14px 32px -14px ${line.accent}80, inset 0 0 0 1px ${line.accent}33`
                    : "0 2px 6px rgba(0,0,0,0.03)",
                  transition: "background 240ms ease, border-color 240ms ease, box-shadow 240ms ease",
                  minHeight: 132,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Top row: icon + badge */}
                <div className="flex items-start justify-between">
                  <div
                    className="grid place-items-center rounded-2xl shrink-0"
                    style={{
                      width: 44, height: 44,
                      background: active ? line.accent : line.tint,
                      color: active ? "#FFFFFF" : line.accent,
                      transition: "all 220ms ease",
                    }}
                  >
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  {line.popular ? (
                    <span style={{
                      background: "#0E0F0E", color: "#D4AF37",
                      borderRadius: 50, padding: "3px 8px",
                      fontFamily: "Inter", fontWeight: 700, fontSize: 9, letterSpacing: "0.08em",
                    }}>
                      ХИТ
                    </span>
                  ) : active ? (
                    <span
                      className="grid place-items-center rounded-full"
                      style={{ width: 22, height: 22, background: line.accent, color: "#FFFFFF" }}
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                  ) : null}
                </div>

                {/* Bottom: title + meta */}
                <div className="mt-3">
                  <div style={{
                    fontFamily: "Unbounded", fontWeight: 800, fontSize: 16,
                    letterSpacing: "-0.02em", color: "#0E0F0E", lineHeight: 1.1,
                  }}>
                    {line.title}
                  </div>
                  <div className="tabular mt-1" style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 11, color: active ? line.accent : "#888", letterSpacing: "0.02em" }}>
                    {line.kcal} ккал
                  </div>
                  <div className="mt-0.5" style={{ fontFamily: "Inter", fontSize: 11, color: "#888", lineHeight: 1.35 }}>
                    {line.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected line summary pill — anchors the choice */}
        <div
          className="reveal mt-5 mx-auto flex items-center gap-3 rounded-full"
          style={{
            background: "#FFFFFF",
            border: `1px solid ${selectedLine.accent}33`,
            padding: "8px 14px 8px 8px",
            maxWidth: 420,
            boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
          }}
        >
          <span
            className="grid place-items-center rounded-full shrink-0"
            style={{ width: 36, height: 36, background: selectedLine.accent, color: "#FFFFFF" }}
          >
            <selectedLine.Icon size={18} strokeWidth={2.4} />
          </span>
          <div className="min-w-0 flex-1">
            <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 13, color: "#0E0F0E", lineHeight: 1.1 }}>
              Выбран рацион <span style={{ color: selectedLine.accent }}>{selectedLine.title}</span>
            </div>
            <div className="truncate" style={{ fontFamily: "Inter", fontSize: 11, color: "#888", marginTop: 2 }}>
              {selectedLine.kcal} ккал · {selectedLine.desc}
            </div>
          </div>
          <a
            href="#menu"
            className="press grid place-items-center rounded-full shrink-0"
            style={{ width: 36, height: 36, background: "#0E0F0E", color: "#FFFFFF" }}
            aria-label="К меню"
          >
            <ChevronRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}


/* ────────── Menu (auto-filtered by selected line) ────────── */

function MenuSection({ lineId, onOpenDish, onOrder }: { lineId: LineId; onOpenDish: (d: Dish) => void; onOrder: () => void }) {
  const [day, setDay] = useState(0);
  const line = LINES.find((l) => l.id === lineId)!;
  const dayMeals = WEEK_MENU[lineId][day];

  function pickDay(i: number) {
    if (i === day) return;
    setDay(i);
  }

  const totalKcal = dayMeals.reduce((s, d) => s + d.kcal, 0);
  const totalP = dayMeals.reduce((s, d) => s + d.p, 0);
  const totalF = dayMeals.reduce((s, d) => s + d.f, 0);
  const totalC = dayMeals.reduce((s, d) => s + d.c, 0);

  return (
    <section id="menu" style={{ background: "#0E0F0E", padding: "56px 16px" }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 12, color: "#D4AF37", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Меню недели
            </span>
            <h2 className="reveal mt-2" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
              Рацион{" "}
              <span style={{ color: line.accent, transition: "color 250ms ease" }}>{line.id}</span>
            </h2>
            <p className="reveal mt-2" style={{ fontFamily: "Inter", fontSize: 14, color: "#A0A89A" }}>
              {line.desc} · {line.kcal} ккал
            </p>
          </div>
        </div>

        {/* Day circles */}
        <div className="reveal mt-6 flex overflow-x-auto hide-scrollbar -mx-4 px-4" style={{ gap: 8 }}>
          {DAYS.map((d, i) => {
            const active = i === day;
            return (
              <button
                key={d}
                onClick={() => pickDay(i)}
                className="press shrink-0 flex flex-col items-center justify-center rounded-2xl"
                style={{
                  width: 56, height: 64,
                  background: active ? "#D4AF37" : "#161816",
                  color: active ? "#0E0F0E" : "#A0A89A",
                  border: active ? "none" : "1px solid #2A2E2A",
                  fontFamily: "Inter", fontWeight: 700,
                  transition: "all 200ms ease",
                }}
              >
                <span style={{ fontSize: 12, opacity: 0.7 }}>{d}</span>
                <span style={{ fontSize: 16, fontWeight: 800 }}>{i + 1}</span>
              </button>
            );
          })}
        </div>

        <div className="reveal mt-2" style={{ fontFamily: "Inter", fontSize: 13, color: "#7A8278" }}>
          {DAYS_FULL[day]}
        </div>

        {/* Dishes — re-mount on line/day change to retrigger animation */}
        <div
          key={`${lineId}-${day}`}
          className="mt-5 grid menu-anim"
          style={{
            gridTemplateColumns: "1fr",
            gap: 1,
            borderRadius: 24,
            overflow: "hidden",
            background: "#2A2E2A",
          }}
        >
          {dayMeals.map((d) => (
            <button
              key={d.meal + d.name}
              onClick={() => onOpenDish(d)}
              className="press text-left"
              style={{
                background: "#161816", padding: 18,
                display: "flex", gap: 14, alignItems: "center",
              }}
            >
              <div
                className="shrink-0 grid place-items-center rounded-2xl overflow-hidden"
                style={{ width: 72, height: 72, background: "#0E0F0E" }}
              >
                <img src={line.image} alt="" loading="lazy" width={800} height={800} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 10, color: line.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {d.meal}
                </div>
                <div className="mt-1 truncate" style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 15, color: "#FFFFFF", lineHeight: 1.3 }}>
                  {d.name}
                </div>
                <div className="mt-1 tabular" style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 12, color: "#A0A89A" }}>
                  {d.kcal} ккал · Б {d.p} · Ж {d.f} · У {d.c}
                </div>
              </div>
              <ChevronRight size={18} color="#A0A89A" className="shrink-0" />
            </button>
          ))}
        </div>

        {/* Totals + CTA */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl"
          style={{ background: "#161816", border: "1px solid #2A2E2A", padding: 18 }}>
          <div className="tabular" style={{ fontFamily: "Inter", color: "#A0A89A", fontSize: 13 }}>
            ИТОГО ЗА ДЕНЬ
            <div className="mt-1" style={{ color: "#FFFFFF", fontFamily: "Unbounded", fontWeight: 800, fontSize: 22 }}>
              {totalKcal} <span style={{ fontFamily: "Inter", fontSize: 13, color: "#A0A89A", fontWeight: 500 }}>ккал · Б {totalP} · Ж {totalF} · У {totalC}</span>
            </div>
          </div>
          <button onClick={onOrder} className="press rounded-full inline-flex items-center gap-2"
            style={{ background: "#D4AF37", color: "#0E0F0E", height: 48, padding: "0 22px", fontFamily: "Inter", fontWeight: 700, fontSize: 14 }}>
            Заказать {line.id} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ────────── Dish Modal ────────── */

function DishModal({ dish, onClose }: { dish: Dish; onClose: () => void }) {
  const line = LINES.find((l) => l.id === dish.line)!;
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
        <div style={{ height: 220, overflow: "hidden", borderRadius: "24px 24px 0 0", background: "#0E0F0E" }}>
          <img src={line.image} alt={dish.name} className="w-full h-full object-cover" />
        </div>

        <div className="p-5 space-y-5">
          <div>
            <span style={{ background: line.accent, color: "#0E0F0E", fontFamily: "Inter", fontWeight: 700, fontSize: 11, padding: "4px 10px", borderRadius: 50 }}>
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
    background: "#F5F5F5", border: "1px solid transparent", borderRadius: 14,
    padding: "14px 16px", fontFamily: "Inter", fontWeight: 500, fontSize: 16,
    color: "#0E0F0E", height: 56, width: "100%", outline: "none",
  };
  const lbl: React.CSSProperties = {
    fontFamily: "Inter", fontWeight: 600, fontSize: 12, color: "#555",
    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, display: "block",
  };

  return (
    <section id="calc" style={{ background: "#F7F7F5", padding: "56px 16px" }}>
      <div className="mx-auto max-w-2xl">
        <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 12, color: "#2E7D32", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Калькулятор КБЖУ
        </span>
        <h2 className="reveal mt-2" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: "clamp(28px, 4vw, 38px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#0E0F0E" }}>
          Рассчитай норму
        </h2>
        <p className="reveal mt-2" style={{ fontFamily: "Inter", fontSize: 15, color: "#555" }}>
          Подберём рацион под твои параметры
        </p>

        <div className="reveal mt-6 space-y-5 rounded-3xl" style={{ background: "#FFFFFF", padding: 24, boxShadow: "0 24px 60px -30px rgba(0,0,0,0.25)" }}>
          <div>
            <label style={lbl}>Пол</label>
            <div className="flex" style={{ gap: 8 }}>
              {(["M", "F"] as const).map((s) => {
                const active = sex === s;
                return (
                  <button key={s} onClick={() => setSex(s)} className="press"
                    style={{
                      flex: 1, height: 52, borderRadius: 14,
                      background: active ? "#0E0F0E" : "#F5F5F5",
                      color: active ? "#FFFFFF" : "#555",
                      fontFamily: "Inter", fontWeight: 600, fontSize: 15,
                      transition: "all 180ms ease",
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
                      flex: 1, height: 52, borderRadius: 14,
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

/* ────────── Subscription (compact horizontal cards) ────────── */

function Subscription({ onSelect }: { onSelect: (period: string) => void }) {
  const plans = [
    { id: "1 день", price: "от 750 ₽", per: "за день", old: null as string | null, badge: null as string | null,
      features: ["4 приёма пищи", "Доставка сегодня"], primary: false },
    { id: "3 дня", price: "от 2 100 ₽", per: "−12%", old: "2 400 ₽", badge: "ПОПУЛЯРНО",
      features: ["12 приёмов пищи", "Выбор линейки", "Скидка 12%"], primary: true },
    { id: "Месяц", price: "от 19 500 ₽", per: "−20%", old: "24 000 ₽", badge: null,
      features: ["Заморозка дней", "Приоритет", "Скидка 20%"], primary: false },
  ];

  return (
    <section style={{ background: "#0E0F0E", padding: "56px 16px" }}>
      <div className="mx-auto max-w-6xl">
        <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 12, color: "#D4AF37", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Подписки
        </span>
        <h2 className="reveal mt-2" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: "clamp(28px, 4vw, 38px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
          Выбери формат
        </h2>
        <p className="reveal mt-2" style={{ fontFamily: "Inter", fontSize: 14, color: "#A0A89A" }}>
          Чем длиннее период — тем выгоднее
        </p>

        <div className="mt-6 grid sm:grid-cols-3" style={{ gap: 12 }}>
          {plans.map((p) => (
            <div key={p.id} className="reveal relative flex flex-col"
              style={{
                background: p.primary ? "linear-gradient(180deg, #1C2A1C 0%, #162016 100%)" : "#161816",
                border: p.primary ? "1.5px solid #2E7D32" : "1px solid #2A2E2A",
                borderRadius: 20, padding: 20,
              }}>
              {p.badge && (
                <span className="absolute" style={{
                  top: -10, right: 16, background: "#D4AF37", color: "#0E0F0E",
                  borderRadius: 50, padding: "4px 12px",
                  fontFamily: "Inter", fontWeight: 700, fontSize: 10, letterSpacing: "0.06em",
                }}>
                  {p.badge}
                </span>
              )}
              <div style={{ fontFamily: "Unbounded", fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em", color: "#FFFFFF", textTransform: "uppercase" }}>
                {p.id}
              </div>

              <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                <span className="tabular" style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 24, color: "#D4AF37" }}>{p.price}</span>
                {p.old && (
                  <span className="tabular" style={{ fontFamily: "Inter", fontSize: 13, color: "#777", textDecoration: "line-through" }}>{p.old}</span>
                )}
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 12, color: "#9FD89F", marginTop: 2 }}>{p.per}</div>

              <ul className="mt-4 space-y-1.5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2" style={{ fontFamily: "Inter", fontSize: 13, color: "#A0A89A" }}>
                    <Check size={14} color="#9FD89F" style={{ marginTop: 3, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button onClick={() => onSelect(p.id)} className="press mt-5 w-full"
                style={{
                  height: 46, borderRadius: 50,
                  background: p.primary ? "#D4AF37" : "transparent",
                  border: p.primary ? "none" : "1.5px solid #2A2E2A",
                  color: p.primary ? "#0E0F0E" : "#FFFFFF",
                  fontFamily: "Inter", fontWeight: p.primary ? 700 : 600, fontSize: 14,
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
    <section id="delivery" style={{ background: "#FFFFFF", padding: "56px 16px" }}>
      <div className="mx-auto max-w-6xl">
        <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 12, color: "#2E7D32", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Доставка
        </span>
        <h2 className="reveal mt-2" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 34px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#0E0F0E" }}>
          Привезём свежее
        </h2>

        <div className="mt-6 grid sm:grid-cols-2" style={{ gap: 12 }}>
          <div className="reveal" style={{ background: "#E8F5E9", borderRadius: 20, padding: 20 }}>
            <div className="grid place-items-center rounded-full" style={{ width: 40, height: 40, background: "#2E7D32" }}>
              <Truck size={20} color="#FFFFFF" />
            </div>
            <div className="mt-3" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em", color: "#0E0F0E" }}>
              Бесплатно по Ростову
            </div>
            <div className="mt-1" style={{ fontFamily: "Inter", fontSize: 14, color: "#555", lineHeight: 1.5 }}>
              Выбирайте удобный временной слот при оформлении
            </div>
            <div className="mt-3 flex flex-wrap" style={{ gap: 6 }}>
              {["07:00–08:00", "09:00–10:00", "18:00–19:00", "20:00–21:00"].map((s) => (
                <span key={s} className="tabular" style={{
                  background: "#FFFFFF", color: "#0E0F0E", borderRadius: 50,
                  padding: "5px 10px", fontFamily: "Inter", fontSize: 12, fontWeight: 600,
                }}>{s}</span>
              ))}
            </div>
          </div>

          <div className="reveal" style={{ background: "#FFF8E1", borderRadius: 20, padding: 20 }}>
            <div className="grid place-items-center rounded-full" style={{ width: 40, height: 40, background: "#D4AF37" }}>
              <Phone size={20} color="#0E0F0E" />
            </div>
            <div className="mt-3" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em", color: "#0E0F0E" }}>
              Пригороды
            </div>
            <div className="mt-1" style={{ fontFamily: "Inter", fontSize: 14, color: "#555", lineHeight: 1.5 }}>
              Батайск, Аксай, Чалтырь — уточняйте стоимость у менеджера
            </div>
            <button onClick={onAsk} className="press mt-4 inline-flex items-center gap-1.5"
              style={{
                background: "#0E0F0E", color: "#D4AF37", borderRadius: 50,
                padding: "10px 18px", fontFamily: "Inter", fontWeight: 600, fontSize: 13,
              }}>
              Уточнить <ArrowRight size={14} />
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
    <section id="faq" style={{ background: "#0E0F0E", padding: "56px 16px" }}>
      <div className="mx-auto max-w-2xl">
        <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 12, color: "#D4AF37", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          FAQ
        </span>
        <h2 className="reveal mt-2" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: "clamp(28px, 4vw, 38px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
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
      padding: "56px 16px",
    }}>
      <div className="mx-auto max-w-2xl">
        <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 12, color: "#D4AF37", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Заявка
        </span>
        <h2 className="reveal mt-2" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: "clamp(28px, 4vw, 38px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
          Оставь заявку
        </h2>
        <p className="reveal mt-2" style={{ fontFamily: "Inter", fontSize: 15, color: "#A0A89A" }}>
          Ответим в Telegram за 30 минут
        </p>

        {sent ? (
          <div className="reveal in mt-6 animate-fade-in text-center" style={{
            background: "#161816", border: "1px solid #2E7D32", borderRadius: 24, padding: 32,
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
    <footer id="footer" style={{ background: "#0A0B0A", borderTop: "1px solid #1A1E1A", padding: "40px 16px 48px" }}>
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
              style={{ width: 36, height: 36, background: "#1A1E1A", color: "#D4AF37" }}>
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
  const [selectedLine, setSelectedLine] = useState<LineId>("POWER");
  const [order, setOrder] = useState<OrderState>({
    name: "", phone: "", messenger: "", line: "POWER", period: "3 дня",
    address: "", slot: "09:00–10:00", comment: "",
  });

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function chooseLine(id: LineId) {
    setSelectedLine(id);
    setOrder((s) => ({ ...s, line: id }));
    // Scroll to menu so user sees the bound menu
    setTimeout(() => scrollTo("menu"), 100);
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
        <LinesSection selected={selectedLine} onSelect={chooseLine} />
        <MenuSection lineId={selectedLine} onOpenDish={setDish} onOrder={() => scrollTo("order-form")} />
        <Calculator onOrder={(line) => { setSelectedLine(line); setOrder((s) => ({ ...s, line })); scrollTo("order-form"); }} />
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
