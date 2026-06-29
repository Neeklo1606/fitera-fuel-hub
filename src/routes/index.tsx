import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  X, Check, Phone, Leaf, Truck, Sparkles, Send, MapPin, Plus, ArrowRight,
  Flame, Heart, Crown, Home, UtensilsCrossed, Calculator as CalcIcon, FlaskConical, Target,
  MessageCircle, ChevronLeft, ChevronRight,
  type LucideIcon,
} from "lucide-react";

import lineLight from "../assets/line-light.jpg";
import lineBalance from "../assets/line-balance.jpg";
import linePower from "../assets/line-power.jpg";
import lineMom from "../assets/line-mom.jpg";
import linePro from "../assets/line-pro.jpg";
import fiteraLogoAsset from "../assets/fitera-logo.png.asset.json";

const FITERA_LOGO = fiteraLogoAsset.url;

// Real Unsplash food photo — dark, premium plate composition
const HERO_BG =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1800&q=80";

const SITE_URL = "https://fitera-fuel-hub.lovable.app";
const OG_IMAGE = "https://fitera-fuel-hub.lovable.app/og-image.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FITERA — Доставка готовых рационов КБЖУ в Ростове-на-Дону" },
      { name: "description", content: "Готовые рационы FITERA с расчётом КБЖУ: LIGHT, BALANCE, POWER, MOM, PRO. Доставка по Ростову-на-Дону ежедневно. Без готовки и подсчётов." },
      { name: "keywords", content: "доставка еды Ростов, рационы питания, КБЖУ, правильное питание, готовая еда, ПП доставка, FITERA" },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "FITERA" },
      { property: "og:locale", content: "ru_RU" },
      { property: "og:title", content: "FITERA — Ешь для результата" },
      { property: "og:description", content: "Готовые рационы FITERA с расчётом КБЖУ. Доставка по Ростову-на-Дону ежедневно." },
      { property: "og:url", content: SITE_URL + "/" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "FITERA — Ешь для результата" },
      { name: "twitter:description", content: "Готовые рационы с расчётом КБЖУ. Доставка по Ростову-на-Дону." },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: SITE_URL + "/" },
      { rel: "preload", as: "image", href: HERO_BG, fetchpriority: "high" } as unknown as { rel: string; href: string },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "FITERA",
          description: "Доставка готовых рационов с расчётом КБЖУ в Ростове-на-Дону.",
          url: SITE_URL,
          image: OG_IMAGE,
          servesCuisine: "Healthy",
          priceRange: "₽₽",
          telephone: "+7 (996) 610-00-06",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Ростов-на-Дону",
            addressCountry: "RU",
          },
          areaServed: "Ростов-на-Дону",
        }),
      },
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
  pastel: string;
  image: string;
  Icon: LucideIcon;
  features: string[];
  dishesPerDay: string;
  dishPhotos: string[];
};

const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=420&q=70`;

const LINES: Line[] = [
  { id: "LIGHT",   title: "Лёгкий",  kcal: "1200–1400", desc: "Снижение веса",     priceFrom: "от 750 ₽",   accent: "#7CB342", tint: "#EEF7E4", pastel: "#E8F5E9", image: lineLight,   Icon: Leaf,     features: ["Низкокалорийный профиль", "Овощи, рыба, белок", "Дефицит 300–500 ккал"], dishesPerDay: "4 блюда в день",
    dishPhotos: [U("1512621776951-a57141f2eefd"), U("1490645935967-10de6ba17061"), U("1540420773420-3366772f4999"), U("1467003909585-2f8a72700288")] },
  { id: "BALANCE", title: "Баланс",  kcal: "1500–1800", desc: "Поддержание формы", priceFrom: "от 850 ₽",   accent: "#42A5F5", tint: "#E5F1FB", pastel: "#E3F2FD", image: lineBalance, Icon: Sparkles, features: ["Сбалансированный КБЖУ", "Разнообразное меню", "Без переедания"], dishesPerDay: "5 блюд в день",
    dishPhotos: [U("1546069901-ba9599a7e63c"), U("1565299624946-b28f40a0ae38"), U("1494390248081-4e521a5940db"), U("1567620905732-2d1ec7ab7445"), U("1565958011703-44f9829ba187")] },
  { id: "POWER",   title: "Сила",    kcal: "2000–2500", desc: "Набор массы",       priceFrom: "от 950 ₽",   popular: true, accent: "#D4AF37", tint: "#FBF3DC", pastel: "#FFF8E1", image: linePower, Icon: Flame, features: ["Профицит +300–500 ккал", "Больше белка и сложных углей", "Для силовых тренировок"], dishesPerDay: "6 блюд в день",
    dishPhotos: [U("1544025162-d76694265947"), U("1607330289024-1535c6b4e1c1"), U("1432139509613-5c4255815697"), U("1546833999-b9f581a1996d"), U("1559339352-11d035aa65de"), U("1551782450-a2132b4ba21d")] },
  { id: "MOM",     title: "Мама",    kcal: "1600–1900", desc: "Для молодых мам",   priceFrom: "от 900 ₽",   accent: "#EC8DA5", tint: "#FBEAF0", pastel: "#FCE4EC", image: lineMom,     Icon: Heart,    features: ["Без острого и аллергенов", "Кальций и железо", "Поддержка лактации"], dishesPerDay: "5 блюд в день",
    dishPhotos: [U("1565895405137-61a3d8d3da9c"), U("1495546968767-f0573cca821e"), U("1567620905732-2d1ec7ab7445"), U("1490645935967-10de6ba17061"), U("1494390248081-4e521a5940db")] },
  { id: "PRO",     title: "Премиум", kcal: "2200–2800", desc: "Для занятых людей", priceFrom: "от 1 100 ₽", accent: "#8E7CC3", tint: "#EFEAF8", pastel: "#F3E5F5", image: linePro,     Icon: Crown,    features: ["Премиум-ингредиенты", "Авторские блюда", "Идеально для офиса"], dishesPerDay: "6 блюд в день",
    dishPhotos: [U("1559339352-11d035aa65de"), U("1414235077428-338989a2e8c0"), U("1551183053-bf91a1d81141"), U("1432139509613-5c4255815697"), U("1546069901-ba9599a7e63c"), U("1504674900247-0877df9cc836")] },
];

type Dish = {
  name: string;
  meal: "ЗАВТРАК" | "ПЕРЕКУС" | "ОБЕД" | "УЖИН";
  kcal: number;
  p: number; f: number; c: number;
  line: LineId;
  ingredients: string;
};

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

function makeWeekFromBase(base: Dish[]): Dish[][] {
  return Array.from({ length: 7 }, (_, i) =>
    base.map((d) => ({ ...d, kcal: d.kcal + i * 5 - 10 })),
  );
}

const DAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const DAYS_FULL = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

const FAQ = [
  { q: "Время приема заказа?", a: "Заказы принимаем до 14:00 в день доставки." },
  { q: "Как вы доставляете рационы?", a: "Доставка бесплатная по Ростову. Курьер привезёт с 17:00 до 21:00 и предварительно позвонит." },
  { q: "Как оплатить заказ?", a: "Наличными, переводом на карту любого банка или безналичным расчётом." },
  { q: "Что делать, если не могу получить рацион в этот день?", a: "Предупредите нас до 12:00 в день доставки — перенесём или отменим." },
  { q: "Помогут ли мне с выбором рациона?", a: "Да, наш менеджер подберёт оптимальный рацион под ваши параметры и цели." },
  { q: "Есть скидки для новых клиентов?", a: "Да — скидка 15% на первый пробный рацион. При подписке от 7 дней — бесплатные подарочные дни." },
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

function useFocusTrap<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const container = ref.current;
    if (!container) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const focusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => {
        if (el.getAttribute("aria-hidden") === "true") return false;
        // visibility check: offsetParent is null for display:none
        if (el.offsetParent === null && getComputedStyle(el).position !== "fixed") return false;
        return true;
      });

    const first = () => focusable()[0];
    const last = () => focusable()[focusable().length - 1];

    // Focus the first element after a short tick to allow render to settle
    const initialTimer = setTimeout(() => {
      const f = first();
      if (f) f.focus();
    }, 0);

    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = focusable();
      if (list.length === 0) return;
      const f = list[0];
      const l = list[list.length - 1];
      if (e.shiftKey && document.activeElement === f) {
        e.preventDefault();
        l.focus();
      } else if (!e.shiftKey && document.activeElement === l) {
        e.preventDefault();
        f.focus();
      }
    };

    document.addEventListener("keydown", handler, true);
    return () => {
      clearTimeout(initialTimer);
      document.removeEventListener("keydown", handler, true);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus();
      }
    };
  }, [enabled]);

  return ref;
}


function SmartImage({
  src, alt = "", className = "", style, light = false, aspectRatio = "1 / 1", eager = false,
}: {
  src: string; alt?: string; className?: string; style?: React.CSSProperties;
  light?: boolean; aspectRatio?: string; eager?: boolean;
}) {
  const [loaded, setLoaded] = useState(eager);
  return (
    <div
      className={`${loaded ? "" : `img-skel ${light ? "light" : ""}`} ${className}`}
      style={{ position: "relative", aspectRatio, overflow: "hidden", ...style }}
    >
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={`img-fade ${loaded ? "loaded" : ""}`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

function SectionHeader({
  eyebrow, title, desc, dark = false, accent = "#2E7D32", center = false, titleAccent,
}: {
  eyebrow: string; title: React.ReactNode; desc?: string;
  dark?: boolean; accent?: string; center?: boolean; titleAccent?: React.ReactNode;
}) {
  const titleColor = dark ? "#FFFFFF" : "#0E0F0E";
  const descColor = dark ? "#A0A89A" : "#6A6F68";
  return (
    <div className={`reveal ${center ? "text-center mx-auto" : ""}`} style={{ maxWidth: center ? 640 : undefined }}>
      <span style={{
        fontFamily: "Inter", fontWeight: 600, fontSize: 12,
        color: accent, letterSpacing: "0.14em", textTransform: "uppercase",
      }}>
        {eyebrow}
      </span>
      <h2 className="mt-2" style={{
        fontFamily: "Unbounded", fontWeight: 800,
        fontSize: "clamp(26px, 4.2vw, 38px)",
        lineHeight: 1.08, letterSpacing: "-0.025em", color: titleColor,
      }}>
        {title}{titleAccent ? <> <span style={{ transition: "color 240ms ease" }}>{titleAccent}</span></> : null}
      </h2>
      {desc && (
        <p className="mt-2" style={{ fontFamily: "Inter", fontSize: 14, color: descColor, lineHeight: 1.5 }}>
          {desc}
        </p>
      )}
    </div>
  );
}

/* ────────── Scroll progress bar ────────── */

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none" style={{ height: 2 }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: "linear-gradient(90deg, #2E7D32, #D4AF37)",
          transition: "width 80ms linear",
          boxShadow: "0 0 8px rgba(212,175,55,0.6)",
        }}
      />
    </div>
  );
}

/* ────────── Logo / Navbar ────────── */

function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" aria-label="FITERA — Ешь для результата" className={`flex items-center select-none shrink-0 ${className}`}>
      <img
        src={FITERA_LOGO}
        alt="FITERA — Ешь для результата"
        width={320}
        height={96}
        className="block w-auto h-[64px] md:h-[96px]"
        decoding="async"
      />
    </a>
  );
}



function Navbar({ onOrder }: { onOrder: () => void }) {
  const items = [
    { l: "Рационы", h: "#lines" }, { l: "Меню", h: "#menu" },
    { l: "Калории", h: "#calc" }, { l: "Подписки", h: "#subs" },
    { l: "FAQ", h: "#faq" },
  ];
  return (
    <header
      className="sticky z-40 backdrop-blur-xl"
      style={{ top: 2, background: "rgba(14,15,14,0.78)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="mx-auto px-4 flex items-center justify-between gap-3 h-20 md:h-28" style={{ maxWidth: 1200 }}>
        <Logo />
        <nav className="hidden lg:flex items-center gap-7">
          {items.map((i) => (
            <a key={i.h} href={i.h} className="text-sm text-[#A0A89A] hover:text-white transition-colors">{i.l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:+79966100006"
            aria-label="Позвонить"
            className="press lg:hidden grid place-items-center rounded-full"
            style={{ width: 40, height: 40, background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)", color: "#D4AF37" }}
          >
            <Phone size={17} />
          </a>
          <a href="tel:+79966100006" className="hidden lg:inline-block text-sm font-semibold" style={{ color: "#FFFFFF" }}>
            +7 (996) 610-00-06
          </a>
          <button
            onClick={onOrder}
            className="press rounded-full inline-flex items-center justify-center gap-1.5 shrink-0"
            style={{ background: "#D4AF37", color: "#0E0F0E", fontFamily: "Inter", fontWeight: 700, fontSize: 13, height: 52, padding: "0 20px", borderRadius: 50 }}
          >
            Заказать <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ────────── Hero ────────── */

function Hero({ onOrder, onCalc }: { onOrder: () => void; onCalc: () => void }) {
  return (
    <section id="top" className="relative" style={{ background: "#0E0F0E", overflow: "hidden" }}>
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt="Готовый рацион FITERA"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center" }}
        />
        <div className="absolute inset-0" style={{
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(14,15,14,0.35) 0%, rgba(14,15,14,0.8) 60%, rgba(14,15,14,0.98) 100%)",
        }} />
        <div className="absolute inset-0" style={{
          background:
            "linear-gradient(180deg, rgba(14,15,14,0.5) 0%, rgba(14,15,14,0) 30%, rgba(14,15,14,0) 60%, rgba(14,15,14,1) 100%)",
        }} />
      </div>

      <div className="relative mx-auto px-4 flex flex-col justify-end md:justify-center"
        style={{ maxWidth: 1200, minHeight: "min(640px, 86vh)", paddingTop: 32, paddingBottom: 44 }}>
        <div className="reveal in" style={{ maxWidth: 620 }}>
          <span
            className="inline-flex items-center gap-1.5 rounded-full backdrop-blur"
            style={{
              padding: "6px 14px", border: "1px solid rgba(212,175,55,0.4)",
              background: "rgba(212,175,55,0.12)", color: "#E8C46B",
              fontFamily: "Inter", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
            }}
          >
            <MapPin size={12} /> РОСТОВ-НА-ДОНУ · ЕЖЕДНЕВНО
          </span>

          <h1
            className="mt-5"
            style={{
              fontFamily: "Unbounded", fontWeight: 900,
              fontSize: "clamp(38px, 8vw, 72px)", lineHeight: 0.98, letterSpacing: "-0.035em",
              color: "#FFFFFF",
            }}
          >
            Умное питание<br />
            <span style={{
              background: "linear-gradient(90deg, #D4AF37 0%, #F5E08F 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
            }}>под твою цель.</span>
          </h1>

          <p className="mt-5" style={{ color: "#C8CCC4", fontFamily: "Inter", fontSize: 16, lineHeight: 1.55, maxWidth: 480 }}>
            5 линеек готовых рационов с точным расчётом КБЖУ. Свежее, без готовки, доставка к двери.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
            <button onClick={onOrder} className="press rounded-full inline-flex items-center justify-center gap-2"
              style={{
                background: "#D4AF37", color: "#0E0F0E",
                height: 52, padding: "0 26px", borderRadius: 50,
                fontFamily: "Inter", fontWeight: 700, fontSize: 15,
                boxShadow: "0 12px 32px -8px rgba(212,175,55,0.5)",
              }}>
              Выбрать рацион <ArrowRight size={18} />
            </button>
            <button onClick={onCalc} className="press rounded-full inline-flex items-center justify-center gap-2"
              style={{
                background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(46,125,50,0.7)",
                color: "#FFFFFF", height: 52, padding: "0 22px", borderRadius: 50,
                fontFamily: "Inter", fontWeight: 600, fontSize: 15, backdropFilter: "blur(8px)",
              }}>
              <CalcIcon size={16} /> Рассчитать калории
            </button>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {[
              { Icon: FlaskConical, text: "Научный подход" },
              { Icon: Target, text: "Индивидуальный рацион" },
              { Icon: Sparkles, text: "Премиальные ингредиенты" },
              { Icon: Truck, text: "Доставка каждый день" },
            ].map((item) => (
              <span key={item.text} className="inline-flex items-center gap-2 rounded-full"
                style={{
                  background: "rgba(14,15,14,0.55)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                  padding: "8px 14px",
                  fontFamily: "Inter",
                  fontSize: 12,
                  color: "#E0E2DD",
                }}>
                <item.Icon size={14} color="#D4AF37" />
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────── Lines — always-open pastel cards with photo slider ────────── */

function LinesSection({ selected, onChoose }: {
  selected: LineId;
  openId?: LineId | null;
  onOpen?: (id: LineId) => void;
  onChoose: (id: LineId) => void;
}) {
  return (
    <section id="lines" style={{ background: "#F7F7F5", padding: "48px 16px 40px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionHeader
          eyebrow="Наши рационы"
          title="Выбери линейку"
          desc="Под каждую цель — свой рацион с точным КБЖУ. Меню недели ниже подстроится автоматически."
          accent="#2E7D32"
          center
        />

        <div className="reveal mt-8 mx-auto flex flex-col" style={{ maxWidth: 1040, gap: 20 }}>
          {LINES.map((line) => {
            const isSelected = selected === line.id;
            return (
              <article
                key={line.id}
                className="overflow-hidden tile-trans"
                style={{
                  background: line.pastel,
                  border: `1.5px solid ${isSelected ? line.accent : "rgba(14,15,14,0.06)"}`,
                  borderRadius: 24,
                  boxShadow: isSelected
                    ? `0 18px 40px -18px ${line.accent}80`
                    : "0 4px 14px rgba(0,0,0,0.05)",
                }}
              >
                <div className="grid md:grid-cols-[40%_60%]" style={{ gap: 0 }}>
                  {/* Left photo */}
                  <div className="relative" style={{ minHeight: 200 }}>
                    <SmartImage
                      src={line.image}
                      alt={line.title}
                      light
                      eager
                      style={{
                        position: "absolute",
                        inset: 12,
                        width: "calc(100% - 24px)",
                        height: "calc(100% - 24px)",
                        objectFit: "cover",
                        borderRadius: 18,
                      }}
                    />
                    {line.popular && (
                      <span
                        className="absolute"
                        style={{
                          top: 22, left: 22,
                          background: "#0E0F0E", color: "#D4AF37",
                          borderRadius: 50, padding: "5px 11px",
                          fontFamily: "Inter", fontWeight: 700, fontSize: 10, letterSpacing: "0.08em",
                        }}
                      >ХИТ</span>
                    )}
                  </div>

                  {/* Right content */}
                  <div className="flex flex-col" style={{ padding: "20px 22px 18px" }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="grid place-items-center rounded-xl shrink-0"
                        style={{ width: 36, height: 36, background: line.accent, color: "#FFFFFF" }}>
                        <line.Icon size={18} />
                      </div>
                      <span style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em", color: "#0E0F0E" }}>
                        {line.id}
                      </span>
                      <span style={{ fontFamily: "Inter", fontSize: 14, color: "#5A5F58" }}>
                        · {line.title}
                      </span>
                    </div>

                    <div className="tabular mt-2 flex flex-wrap items-center" style={{ gap: 8, fontFamily: "Inter", fontSize: 13, color: "#5A5F58" }}>
                      <span style={{ fontWeight: 600, color: "#0E0F0E" }}>{line.kcal} ккал</span>
                      <span>·</span>
                      <span>{line.desc}</span>
                      <span>·</span>
                      <span>{line.dishesPerDay}</span>
                    </div>

                    <ul className="mt-3 space-y-1.5">
                      {line.features.map((f) => (
                        <li key={f} className="flex items-start gap-2" style={{ fontFamily: "Inter", fontSize: 13.5, color: "#2A2E2A" }}>
                          <span className="grid place-items-center rounded-full shrink-0 mt-0.5"
                            style={{ width: 16, height: 16, background: line.accent, color: "#FFFFFF" }}>
                            <Check size={10} strokeWidth={3} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex items-center justify-between flex-wrap" style={{ gap: 12 }}>
                      <div className="tabular">
                        <span style={{ fontFamily: "Unbounded", fontWeight: 700, fontSize: 18, color: "#0E0F0E" }}>
                          {line.priceFrom}
                        </span>
                        <span style={{ fontFamily: "Inter", fontSize: 12, color: "#5A5F58", marginLeft: 4 }}>/ день</span>
                      </div>
                      <button
                        onClick={() => onChoose(line.id)}
                        className="press inline-flex items-center justify-center gap-2"
                        style={{
                          background: "#0E0F0E", color: "#FFFFFF",
                          height: 52, padding: "0 22px", borderRadius: 50,
                          fontFamily: "Inter", fontWeight: 600, fontSize: 14,
                        }}
                      >
                        Выбрать рацион <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Horizontal dish photo slider */}
                <DishSlider photos={line.dishPhotos} accent={line.accent} title={line.title} />

              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ────────── Menu (2×2 grid, day pills) ────────── */

function MenuSection({ lineId, onOpenDish, onOrder }: { lineId: LineId; onOpenDish: (d: Dish) => void; onOrder: () => void }) {
  const [day, setDay] = useState(0);
  const line = LINES.find((l) => l.id === lineId)!;
  const dayMeals = WEEK_MENU[lineId][day];

  const totalKcal = dayMeals.reduce((s, d) => s + d.kcal, 0);
  const totalP = dayMeals.reduce((s, d) => s + d.p, 0);
  const totalF = dayMeals.reduce((s, d) => s + d.f, 0);
  const totalC = dayMeals.reduce((s, d) => s + d.c, 0);

  return (
    <section id="menu" style={{ background: "#0E0F0E", padding: "48px 16px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionHeader
          eyebrow="Меню недели"
          title="Рацион"
          titleAccent={<span style={{ color: line.accent }}>{line.id}</span>}
          desc={`${line.desc} · ${line.kcal} ккал в день`}
          dark
          accent="#D4AF37"
        />

        {/* Days — round pills */}
        <div className="reveal mt-7 flex overflow-x-auto hide-scrollbar -mx-4 px-4" style={{ gap: 12, paddingTop: 6, paddingBottom: 6, scrollSnapType: "x mandatory" }}>
          {DAYS.map((d, i) => {
            const active = i === day;
            return (
              <button
                key={d}
                onClick={() => setDay(i)}
                aria-pressed={active}
                aria-label={DAYS_FULL[i]}
                className="press shrink-0 flex flex-col items-center justify-center rounded-full tile-trans"
                style={{
                  width: 56, height: 56,
                  aspectRatio: "1 / 1",
                  scrollSnapAlign: "start",
                  background: active ? "#D4AF37" : "transparent",
                  color: active ? "#0E0F0E" : "#A0A89A",
                  border: active ? "none" : "1.5px solid #2A2E2A",
                  fontFamily: "Inter",
                  boxShadow: active ? "0 0 0 4px rgba(212,175,55,0.18)" : "none",
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, letterSpacing: "0.05em" }}>{d}</span>
                <span className="tabular" style={{ fontWeight: 800, fontSize: 16, lineHeight: 1 }}>{i + 1}</span>
              </button>
            );
          })}
        </div>

        <div className="reveal mt-3" style={{ fontFamily: "Inter", fontSize: 13, color: "#7A8278" }}>
          {DAYS_FULL[day]}
        </div>

        {/* 2×2 grid of meal cards */}
        <div
          key={`${lineId}-${day}`}
          className="mt-5 grid menu-anim grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          style={{
            gap: 12,
          }}
        >

          {dayMeals.map((d) => (
            <button
              key={d.meal + d.name}
              onClick={() => onOpenDish(d)}
              className="press text-left flex flex-col overflow-hidden tile-trans"
              style={{
                background: "#161816", border: "1px solid #2A2E2A",
                borderRadius: 18,
              }}
            >
              <SmartImage
                src={line.image}
                alt={d.name}
                aspectRatio="4 / 3"
                eager
                style={{ width: "100%", background: "#0E0F0E" }}
              />
              <div className="flex-1 flex flex-col" style={{ padding: 12 }}>
                <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 9, color: line.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {d.meal}
                </div>
                <div
                  className="mt-1"
                  style={{
                    fontFamily: "Inter", fontWeight: 700, fontSize: 13.5, color: "#FFFFFF", lineHeight: 1.25,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                    overflow: "hidden", wordBreak: "break-word", minHeight: 34,
                  }}
                >
                  {d.name}
                </div>
                <div className="mt-2 tabular flex items-center flex-wrap" style={{ fontFamily: "Inter", fontSize: 10.5, color: "#A0A89A", gap: 6 }}>
                  <span style={{ color: "#D4AF37", fontWeight: 700 }}>{d.kcal} ккал</span>
                  <span style={{ opacity: 0.4 }}>·</span>
                  <span>Б{d.p} Ж{d.f} У{d.c}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Totals + CTA */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl"
          style={{ background: "#161816", border: "1px solid #2A2E2A", padding: 18 }}>
          <div className="tabular" style={{ fontFamily: "Inter", color: "#A0A89A", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Итого за день
            <div className="mt-1" style={{ color: "#FFFFFF", fontFamily: "Unbounded", fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>
              {totalKcal} <span style={{ fontFamily: "Inter", fontSize: 13, color: "#A0A89A", fontWeight: 500, letterSpacing: 0, textTransform: "none" }}>ккал · Б {totalP} · Ж {totalF} · У {totalC}</span>
            </div>
          </div>
          <button onClick={onOrder} className="press rounded-full inline-flex items-center gap-2"
            style={{ background: "#D4AF37", color: "#0E0F0E", height: 52, padding: "0 22px", borderRadius: 50, fontFamily: "Inter", fontWeight: 700, fontSize: 14 }}>
            Заказать {line.id} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ────────── Dish Modal (bottom sheet) ────────── */

function DishModal({ dish, onClose, onOrder }: { dish: Dish; onClose: () => void; onOrder: (line: LineId) => void }) {
  const line = LINES.find((l) => l.id === dish.line)!;
  const modalRef = useFocusTrap<HTMLDivElement>(true);
  const mouseDownOnBackdropRef = useRef(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    const body = document.body;
    const html = document.documentElement;
    const scrollY = window.scrollY;
    const prev = {
      bodyOverflow: body.style.overflow,
      bodyTouch: body.style.touchAction,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      htmlOverflow: html.style.overflow,
    };
    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    html.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      body.style.overflow = prev.bodyOverflow;
      body.style.touchAction = prev.bodyTouch;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      html.style.overflow = prev.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [onClose]);

  const onBackdropMouseDown = (e: React.MouseEvent) => {
    mouseDownOnBackdropRef.current = e.target === e.currentTarget;
  };
  const onBackdropMouseUp = (e: React.MouseEvent) => {
    if (mouseDownOnBackdropRef.current && e.target === e.currentTarget) onClose();
    mouseDownOnBackdropRef.current = false;
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      onMouseDown={onBackdropMouseDown}
      onMouseUp={onBackdropMouseUp}
      onTouchEnd={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-modal-title"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-[420px] animate-slide-up flex flex-col"
        style={{
          background: "#161816",
          borderRadius: "20px 20px 0 0",
          border: "1px solid #2A2E2A",
          maxHeight: "92dvh",
        }}
      >
        <div className="mx-auto mt-2 mb-0.5 rounded-full sm:hidden shrink-0" style={{ width: 36, height: 4, background: "#2A2E2A" }} />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 h-8 w-8 grid place-items-center rounded-full"
          style={{ background: "rgba(0,0,0,0.6)", color: "#FFFFFF" }}
          aria-label="Закрыть"
        >
          <X size={16} />
        </button>
        <SmartImage
          src={line.image}
          alt={dish.name}
          eager
          style={{ background: "#0E0F0E", borderRadius: "20px 20px 0 0", flexShrink: 0 }}
          aspectRatio="21 / 9"
        />

        <div className="p-3.5 space-y-2.5">
          <div>
            <span style={{ background: line.accent, color: "#0E0F0E", fontFamily: "Inter", fontWeight: 700, fontSize: 10, padding: "3px 9px", borderRadius: 50 }}>
              {dish.line}
            </span>
            <h3 id="dish-modal-title" className="mt-1.5" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 16, lineHeight: 1.2, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
              {dish.name}
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { l: "ккал", v: dish.kcal },
              { l: "Б", v: dish.p },
              { l: "Ж", v: dish.f },
              { l: "У", v: dish.c },
            ].map((m) => (
              <div key={m.l} className="rounded-lg py-1.5 text-center" style={{ background: "#1C1E1C" }}>
                <div style={{ fontSize: 9, color: "#A0A89A", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.l}</div>
                <div className="tabular" style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 14, color: "#D4AF37" }}>{m.v}</div>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: "Inter", fontSize: 12.5, lineHeight: 1.45, color: "#C5C9BD" }}>
            <span style={{ color: "#A0A89A", fontWeight: 600, textTransform: "uppercase", fontSize: 10, letterSpacing: "0.08em", marginRight: 6 }}>Состав:</span>
            {dish.ingredients}
          </p>

          <button
            onClick={() => { onOrder(dish.line); onClose(); }}
            className="press w-full rounded-full inline-flex items-center justify-center gap-2"
            style={{ height: 52, borderRadius: 50, background: "linear-gradient(180deg,#E6C04A 0%,#D4AF37 100%)", color: "#0E0F0E", fontFamily: "Inter", fontWeight: 700, fontSize: 14, boxShadow: "0 8px 24px rgba(212,175,55,0.28)" }}
          >
            Заказать {dish.line} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}


/* ────────── Order Modal ────────── */

type PaymentMethod = "Наличными" | "Перевод на карту" | "Безналичный расчёт";

function OrderModal({
  initialLine,
  initialPeriod,
  onClose,
}: {
  initialLine: LineId | null;
  initialPeriod?: string;
  onClose: () => void;
}) {
  const modalRef = useFocusTrap<HTMLDivElement>(true);
  const mouseDownOnBackdropRef = useRef(false);
  const line = initialLine ? LINES.find((l) => l.id === initialLine) ?? null : null;

  const [period, setPeriod] = useState<string>(initialPeriod ?? "1 неделя");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7 (");
  const [payment, setPayment] = useState<PaymentMethod>("Наличными");
  const [agree, setAgree] = useState(true);
  const [sent, setSent] = useState(false);

  function maskPhone(v: string) {
    const d = v.replace(/\D/g, "").replace(/^7?/, "");
    const p = d.slice(0, 10);
    let out = "+7";
    if (p.length > 0) out += " (" + p.slice(0, 3);
    if (p.length >= 4) out += ") " + p.slice(3, 6);
    if (p.length >= 7) out += "-" + p.slice(6, 8);
    if (p.length >= 9) out += "-" + p.slice(8, 10);
    return out;
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    const body = document.body;
    const html = document.documentElement;
    const scrollY = window.scrollY;
    const prev = {
      bodyOverflow: body.style.overflow, bodyTouch: body.style.touchAction,
      bodyPosition: body.style.position, bodyTop: body.style.top, bodyWidth: body.style.width,
      htmlOverflow: html.style.overflow,
    };
    body.style.overflow = "hidden"; body.style.touchAction = "none";
    body.style.position = "fixed"; body.style.top = `-${scrollY}px`; body.style.width = "100%";
    html.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      body.style.overflow = prev.bodyOverflow; body.style.touchAction = prev.bodyTouch;
      body.style.position = prev.bodyPosition; body.style.top = prev.bodyTop; body.style.width = prev.bodyWidth;
      html.style.overflow = prev.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [onClose]);

  const onBackdropMouseDown = (e: React.MouseEvent) => {
    mouseDownOnBackdropRef.current = e.target === e.currentTarget;
  };
  const onBackdropMouseUp = (e: React.MouseEvent) => {
    if (mouseDownOnBackdropRef.current && e.target === e.currentTarget) onClose();
    mouseDownOnBackdropRef.current = false;
  };

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!agree || !name.trim() || phone.replace(/\D/g, "").length < 11) return;
    setSent(true);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 52, padding: "0 18px", borderRadius: 50,
    background: "#1C1E1C", color: "#FFFFFF", border: "1px solid #2A2E2A",
    fontFamily: "Inter", fontSize: 15, fontWeight: 500, outline: "none",
  };

  const canSubmit = agree && name.trim().length > 0 && phone.replace(/\D/g, "").length >= 11;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      onMouseDown={onBackdropMouseDown}
      onMouseUp={onBackdropMouseUp}
      onTouchEnd={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-[460px] animate-slide-up flex flex-col"
        style={{
          background: "#161816",
          borderRadius: "24px 24px 0 0",
          border: "1px solid #2A2E2A",
          maxHeight: "92dvh",
          overflowY: "auto",
        }}
      >
        <div className="mx-auto mt-2 rounded-full sm:hidden shrink-0" style={{ width: 36, height: 4, background: "#2A2E2A" }} />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 h-9 w-9 grid place-items-center rounded-full"
          style={{ background: "rgba(0,0,0,0.6)", color: "#FFFFFF" }}
          aria-label="Закрыть"
        >
          <X size={18} />
        </button>

        <div className="p-5 sm:p-6">
          <h3 id="order-modal-title" style={{
            fontFamily: "Unbounded", fontWeight: 800, fontSize: 22,
            letterSpacing: "-0.02em", color: "#FFFFFF", paddingRight: 36,
          }}>
            Оформление заказа
          </h3>

          {line && (
            <div className="mt-3" style={{ fontFamily: "Inter", fontSize: 13, color: "#A0A89A" }}>
              Рацион <span style={{ color: line.accent, fontWeight: 700 }}>«{line.title}»</span> × выберите период
            </div>
          )}
          {line && (
            <div className="mt-2 flex flex-wrap" style={{ gap: 8 }}>
              {["1 день", "1 неделя", "1 месяц"].map((p) => {
                const on = period === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className="press"
                    style={{
                      height: 36, padding: "0 14px", borderRadius: 50,
                      background: on ? "#D4AF37" : "rgba(255,255,255,0.06)",
                      color: on ? "#0E0F0E" : "#FFFFFF",
                      border: `1px solid ${on ? "#D4AF37" : "#2A2E2A"}`,
                      fontFamily: "Inter", fontSize: 13, fontWeight: 600,
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          )}

          {sent ? (
            <div className="mt-5 text-center" style={{
              background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.3)",
              borderRadius: 18, padding: 22, color: "#FFFFFF", fontFamily: "Inter",
            }}>
              <div style={{ fontFamily: "Unbounded", fontSize: 18, fontWeight: 700, color: "#D4AF37" }}>Заявка принята</div>
              <div className="mt-1.5" style={{ fontSize: 13, color: "#A0A89A" }}>Свяжемся в течение 30 минут</div>
              <button onClick={onClose} className="press mt-4" style={{
                height: 44, padding: "0 22px", borderRadius: 50, background: "#1C1E1C",
                color: "#FFFFFF", fontFamily: "Inter", fontWeight: 600, fontSize: 13,
                border: "1px solid #2A2E2A",
              }}>Закрыть</button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5" style={{ display: "grid", gap: 12 }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                style={inputStyle}
              />
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(maskPhone(e.target.value))}
                placeholder="+7 (___) ___-__-__"
                style={inputStyle}
              />
              <div style={{ position: "relative" }}>
                <select
                  value={payment}
                  onChange={(e) => setPayment(e.target.value as PaymentMethod)}
                  style={{
                    ...inputStyle,
                    appearance: "none",
                    WebkitAppearance: "none",
                    paddingRight: 40,
                    cursor: "pointer",
                  }}
                  aria-label="Способ оплаты"
                >
                  <option value="Наличными">Наличными</option>
                  <option value="Перевод на карту">Перевод на карту</option>
                  <option value="Безналичный расчёт">Безналичный расчёт</option>
                </select>
                <span style={{
                  position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)",
                  color: "#A0A89A", pointerEvents: "none", fontSize: 12,
                }}>▾</span>
              </div>

              <label className="flex items-start" style={{
                gap: 10, color: "#A0A89A", fontFamily: "Inter", fontSize: 12.5, lineHeight: 1.55,
                marginTop: 2,
              }}>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  style={{ marginTop: 3, accentColor: "#D4AF37", width: 16, height: 16, flexShrink: 0 }}
                />
                <span>
                  Я согласен с{" "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#D4AF37", textDecoration: "underline" }}>политикой конфиденциальности</a>{" "}
                  и даю{" "}
                  <a href="/consent" target="_blank" rel="noopener noreferrer" style={{ color: "#D4AF37", textDecoration: "underline" }}>согласие на обработку персональных данных</a>
                </span>
              </label>

              <button
                type="submit"
                disabled={!canSubmit}
                className="press w-full inline-flex items-center justify-center gap-2"
                style={{
                  height: 52, borderRadius: 50,
                  background: canSubmit ? "linear-gradient(180deg,#E6C04A 0%,#D4AF37 100%)" : "rgba(212,175,55,0.4)",
                  color: "#0E0F0E", fontFamily: "Inter", fontWeight: 700, fontSize: 15,
                  letterSpacing: "-0.01em", cursor: canSubmit ? "pointer" : "not-allowed",
                  boxShadow: canSubmit ? "0 8px 24px rgba(212,175,55,0.28)" : "none",
                }}
              >
                Заказать <ArrowRight size={16} />
              </button>
            </form>
          )}
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
    const a = Math.max(14, Math.min(100, age || 0));
    const h = Math.max(120, Math.min(230, height || 0));
    const w = Math.max(30, Math.min(250, weight || 0));
    const bmr = sex === "M"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;
    let kcal = Math.round(bmr * act);
    if (goal === "loss") kcal -= 400;
    if (goal === "gain") kcal += 400;
    let line: LineId = "PRO";
    if (kcal <= 1450) line = "LIGHT";
    else if (kcal <= 1850) line = "BALANCE";
    else if (kcal <= 2300) line = "POWER";
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
    <section id="calc" style={{ background: "#F7F7F5", padding: "48px 16px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionHeader
          eyebrow="Калькулятор КБЖУ"
          title="Рассчитай свою норму калорий"
          desc="Подберём подходящий рацион автоматически."
          accent="#2E7D32"
          center
        />

        <div className="mt-8 mx-auto grid md:grid-cols-[1fr_1fr] gap-5 items-start" style={{ maxWidth: 980 }}>
          {/* Form column */}
          <div className="reveal space-y-5 rounded-3xl" style={{ background: "#FFFFFF", padding: 24, boxShadow: "0 24px 60px -30px rgba(0,0,0,0.18)" }}>
            <div>
              <label style={lbl}>Пол</label>
              <div className="flex" style={{ gap: 8 }}>
                {(["M", "F"] as const).map((s) => {
                  const active = sex === s;
                  return (
                    <button key={s} onClick={() => setSex(s)} type="button" className="press inline-flex items-center justify-center"
                      style={{
                        flex: 1, minWidth: 0, height: 52, borderRadius: 14,
                        background: active ? "#0E0F0E" : "#F5F5F5",
                        color: active ? "#FFFFFF" : "#555",
                        fontFamily: "Inter", fontWeight: 600,
                        fontSize: "clamp(13px, 3.6vw, 15px)",
                        whiteSpace: "nowrap", textAlign: "center",
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
                  ["loss", "Снижение"], ["keep", "Норма"], ["gain", "Набор"],
                ] as const).map(([k, l]) => {
                  const active = goal === k;
                  return (
                    <button key={k} onClick={() => setGoal(k)} type="button" className="press inline-flex items-center justify-center"
                      style={{
                        flex: 1, minWidth: 0, height: 52, borderRadius: 14,
                        background: active ? "#0E0F0E" : "#F5F5F5",
                        color: active ? "#FFFFFF" : "#555",
                        fontFamily: "Inter", fontWeight: 600,
                        fontSize: "clamp(12px, 3.4vw, 14px)",
                        whiteSpace: "nowrap", textAlign: "center",
                      }}>{l}</button>
                  );
                })}
              </div>
            </div>

            <button onClick={compute} className="press"
              style={{
                width: "100%", height: 52, borderRadius: 50,
                background: "linear-gradient(135deg, #D4AF37 0%, #E9C75A 100%)",
                color: "#0E0F0E",
                fontFamily: "Unbounded", fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em",
                boxShadow: "0 14px 30px -10px rgba(212,175,55,0.55)",
              }}>
              Рассчитать норму
            </button>
          </div>

          {/* Result column */}
          <div className="reveal rounded-3xl flex flex-col md:sticky md:top-20" style={{
            background: result
              ? "linear-gradient(160deg, #0E0F0E 0%, #1B2E1B 100%)"
              : "#FFFFFF",
            padding: 24, minHeight: result ? 360 : 280,
            border: result ? "none" : "1.5px dashed #E0E0DC",
            boxShadow: result ? "0 24px 60px -30px rgba(46,125,50,0.4)" : "0 12px 30px -20px rgba(0,0,0,0.1)",
            transition: "background 320ms ease",
          }}>
            {result ? (
              <div className="animate-fade-in flex-1 flex flex-col">
                <div style={{ fontFamily: "Inter", fontSize: 12, color: "#A0A89A", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Ваша норма
                </div>
                <div className="tabular mt-2" style={{ fontFamily: "Unbounded", fontWeight: 900, fontSize: 56, color: "#D4AF37", lineHeight: 1, letterSpacing: "-0.03em" }}>
                  {result.kcal}
                </div>
                <div className="mt-1" style={{ fontFamily: "Inter", fontSize: 14, color: "#A0A89A" }}>
                  ккал в день
                </div>

                <div className="mt-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: 16 }}>
                  <div style={{ fontFamily: "Inter", fontSize: 11, color: "#A0A89A", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Рекомендуем
                  </div>
                  <div className="mt-1" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 22, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
                    Рацион {result.line}
                  </div>
                  <div className="mt-1" style={{ fontFamily: "Inter", fontSize: 13, color: "#9AA197" }}>
                    {LINES.find(l => l.id === result.line)?.desc}
                  </div>
                </div>

                <button onClick={() => onOrder(result.line)} className="press mt-auto"
                  style={{
                    width: "100%", height: 52, borderRadius: 50, marginTop: 24,
                    background: "#D4AF37", color: "#0E0F0E",
                    fontFamily: "Inter", fontWeight: 700, fontSize: 15,
                  }}>
                  Выбрать рацион {result.line}
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="grid place-items-center rounded-full mb-4" style={{ width: 72, height: 72, background: "#F0F4EE" }}>
                  <CalcIcon size={32} color="#2E7D32" />
                </div>
                <div style={{ fontFamily: "Unbounded", fontWeight: 700, fontSize: 18, color: "#0E0F0E", letterSpacing: "-0.02em" }}>
                  Готовы посчитать?
                </div>
                <div className="mt-2 mb-5" style={{ fontFamily: "Inter", fontSize: 13.5, color: "#777", maxWidth: 260, lineHeight: 1.5 }}>
                  Заполните параметры слева — здесь появится ваша норма и подходящий рацион.
                </div>
                <button onClick={compute} className="press inline-flex items-center justify-center gap-2"
                  style={{
                    height: 52, padding: "0 22px", borderRadius: 50,
                    background: "linear-gradient(135deg, #D4AF37 0%, #E9C75A 100%)",
                    color: "#0E0F0E",
                    fontFamily: "Inter", fontWeight: 700, fontSize: 14,
                    boxShadow: "0 12px 26px -10px rgba(212,175,55,0.55)",
                  }}>
                  Посчитать сейчас <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────── Subscriptions ────────── */

function Subscription({ onSelect }: { onSelect: (period: string) => void }) {
  const plans = [
    { id: "1 день", price: "от 750 ₽", per: "за день", old: null as string | null, badge: null as string | null,
      features: ["4 приёма пищи", "Доставка сегодня", "Без подписки"], primary: false },
    { id: "1 неделя", price: "от 4 900 ₽", per: "−15%", old: "5 770 ₽", badge: "ПОПУЛЯРНО",
      features: ["28 приёмов пищи", "Выбор линейки", "Скидка 15%"], primary: true },
    { id: "1 месяц", price: "от 19 500 ₽", per: "−20%", old: "24 000 ₽", badge: null,
      features: ["Заморозка дней", "Приоритет", "Скидка 20%"], primary: false },
  ];

  return (
    <section id="subs" style={{ background: "#0E0F0E", padding: "48px 16px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionHeader
          eyebrow="Подписки"
          title="Выбери формат"
          desc="Чем длиннее период — тем выгоднее цена за день"
          dark
          accent="#D4AF37"
          center
        />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3" style={{ gap: 12 }}>
          {plans.map((p) => (
            <div key={p.id} className="reveal relative flex flex-col tile-trans"
              style={{
                background: p.primary ? "linear-gradient(180deg, #1C2A1C 0%, #162016 100%)" : "#161816",
                border: p.primary ? "1.5px solid #2E7D32" : "1px solid #2A2E2A",
                borderRadius: 22, padding: 22,
                boxShadow: p.primary ? "0 20px 50px -20px rgba(46,125,50,0.45)" : "none",
              }}>
              {p.badge && (
                <span className="absolute" style={{
                  top: -11, left: "50%", transform: "translateX(-50%)",
                  background: "#D4AF37", color: "#0E0F0E",
                  borderRadius: 50, padding: "5px 14px",
                  fontFamily: "Inter", fontWeight: 700, fontSize: 10, letterSpacing: "0.08em",
                  boxShadow: "0 6px 16px -4px rgba(212,175,55,0.5)",
                }}>
                  {p.badge}
                </span>
              )}
              <div style={{ fontFamily: "Unbounded", fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em", color: "#FFFFFF", textTransform: "uppercase" }}>
                {p.id}
              </div>

              <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                <span className="tabular" style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 26, color: "#D4AF37" }}>{p.price}</span>
                {p.old && (
                  <span className="tabular" style={{ fontFamily: "Inter", fontSize: 13, color: "#777", textDecoration: "line-through" }}>{p.old}</span>
                )}
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 12, color: p.primary ? "#9FD89F" : "#A0A89A", marginTop: 2 }}>{p.per}</div>

              <ul className="mt-5 space-y-2 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2" style={{ fontFamily: "Inter", fontSize: 13.5, color: "#C8CCC4" }}>
                    <Check size={14} color={p.primary ? "#9FD89F" : "#7CB342"} style={{ marginTop: 3, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button onClick={() => onSelect(p.id)} className="press mt-6 w-full"
                style={{
                  height: 52, borderRadius: 50,
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
    <section id="delivery" style={{ background: "#FFFFFF", padding: "48px 16px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <SectionHeader
          eyebrow="Доставка"
          title="Доставка"
          desc="По Ростову бесплатно, в пригороды — по согласованию"
          accent="#2E7D32"
          center
        />

        <div className="mt-8 grid sm:grid-cols-2" style={{ gap: 12, maxWidth: 880, marginInline: "auto" }}>
          <div className="reveal" style={{ background: "#E8F5E9", borderRadius: 22, padding: 22 }}>
            <div className="grid place-items-center rounded-2xl" style={{ width: 44, height: 44, background: "#2E7D32" }}>
              <Truck size={22} color="#FFFFFF" />
            </div>
            <div className="mt-3" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em", color: "#0E0F0E" }}>
              Бесплатно по Ростову
            </div>
            <div className="mt-1" style={{ fontFamily: "Inter", fontSize: 14, color: "#555", lineHeight: 1.5 }}>
              Доставка с 17:00 до 21:00, курьер предварительно позвонит
            </div>
          </div>

          <div className="reveal" style={{ background: "#FFF8E1", borderRadius: 22, padding: 22 }}>
            <div className="grid place-items-center rounded-2xl" style={{ width: 44, height: 44, background: "#D4AF37" }}>
              <Phone size={22} color="#0E0F0E" />
            </div>
            <div className="mt-3" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em", color: "#0E0F0E" }}>
              Пригороды
            </div>
            <div className="mt-1" style={{ fontFamily: "Inter", fontSize: 14, color: "#555", lineHeight: 1.5 }}>
              Батайск, Аксай, Чалтырь — уточняйте стоимость у менеджера
            </div>
            <button onClick={onAsk} className="press mt-4 inline-flex items-center gap-1.5"
              style={{
                background: "#0E0F0E", color: "#D4AF37", borderRadius: 50,
                height: 52, padding: "0 20px", fontFamily: "Inter", fontWeight: 600, fontSize: 13,
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

function CantDecideSection() {
  const [phone, setPhone] = useState("+7 ");
  const [agree, setAgree] = useState(true);
  const [sent, setSent] = useState(false);

  function maskPhone(v: string) {
    const d = v.replace(/\D/g, "").replace(/^7?/, "");
    const p = d.slice(0, 10);
    let out = "+7";
    if (p.length > 0) out += " " + p.slice(0, 3);
    if (p.length >= 4) out += " " + p.slice(3, 6);
    if (p.length >= 7) out += "-" + p.slice(6, 8);
    if (p.length >= 9) out += "-" + p.slice(8, 10);
    return out;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!agree) return;
    setSent(true);
  }

  return (
    <section id="cant-decide" style={{ background: "#0E0F0E", padding: "48px 16px" }}>
      <div className="mx-auto" style={{ maxWidth: 560 }}>
        <SectionHeader
          eyebrow="Помощь с выбором"
          title="Не смогли определиться с выбором?"
          desc="Оставьте заявку — менеджер подберёт идеальный вариант для вас"
          dark
          accent="#D4AF37"
          center
        />

        {sent ? (
          <div className="reveal mt-7 text-center" style={{
            background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: 22, padding: 28, color: "#FFFFFF", fontFamily: "Inter",
          }}>
            <div style={{ fontFamily: "Unbounded", fontSize: 20, fontWeight: 700, color: "#D4AF37" }}>Заявка принята</div>
            <div className="mt-2" style={{ fontSize: 14, color: "#A0A89A" }}>Свяжемся в течение 30 минут</div>
          </div>
        ) : (
          <form onSubmit={submit} className="reveal mt-7" style={{ display: "grid", gap: 14 }}>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
              placeholder="+7 999 000-00-00"
              style={{
                height: 52, padding: "0 18px", borderRadius: 50,
                background: "rgba(255,255,255,0.06)", color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.12)",
                fontFamily: "Inter", fontSize: 15, fontWeight: 500, outline: "none",
              }}
            />
            <label className="flex items-start" style={{ gap: 10, color: "#A0A89A", fontFamily: "Inter", fontSize: 13, lineHeight: 1.55 }}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                style={{ marginTop: 3, accentColor: "#D4AF37", width: 16, height: 16, flexShrink: 0 }}
              />
              <span>
                Я согласен с{" "}
                <a href="/privacy" style={{ color: "#D4AF37", textDecoration: "underline" }}>политикой конфиденциальности</a>{" "}
                и даю{" "}
                <a href="/consent" style={{ color: "#D4AF37", textDecoration: "underline" }}>согласие на обработку персональных данных</a>
              </span>
            </label>
            <button
              type="submit"
              disabled={!agree}
              className="press"
              style={{
                height: 52, borderRadius: 50, background: agree ? "#D4AF37" : "rgba(212,175,55,0.4)",
                color: "#0E0F0E", fontFamily: "Inter", fontWeight: 700, fontSize: 15,
                letterSpacing: "-0.01em", cursor: agree ? "pointer" : "not-allowed",
              }}
            >
              Хочу получить
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" style={{ background: "#0E0F0E", padding: "48px 16px" }}>
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <SectionHeader
          eyebrow="FAQ"
          title="Частые вопросы"
          desc="Коротко о доставке, меню и оформлении"
          dark
          accent="#D4AF37"
          center
        />

        <div className="reveal mt-7">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} style={{ borderBottom: "1px solid #2A2E2A" }}>
                <button onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left"
                  style={{ padding: "18px 0", fontFamily: "Inter", fontWeight: 600, fontSize: 16, color: "#FFFFFF" }}>
                  <span style={{ paddingRight: 16 }}>{item.q}</span>
                  <span
                    className="grid place-items-center rounded-full shrink-0 tile-trans"
                    style={{
                      width: 28, height: 28, background: isOpen ? "#D4AF37" : "rgba(255,255,255,0.06)",
                      color: isOpen ? "#0E0F0E" : "#D4AF37",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    <Plus size={16} />
                  </span>
                </button>
                <div style={{
                  maxHeight: isOpen ? 320 : 0, overflow: "hidden",
                  transition: "max-height 280ms ease",
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

/* ────────── Order Form (minimal — 3 fields) ────────── */

type OrderState = {
  name: string; phone: string; telegram: string; address: string; line: LineId; period: string;
};

function OrderForm({ initial, onUpdate }: { initial: OrderState; onUpdate: (s: OrderState) => void }) {
  const [state, setState] = useState(initial);
  const [sent, setSent] = useState(false);
  const [addrSuggest, setAddrSuggest] = useState<string[]>([]);
  useEffect(() => { setState(initial); }, [initial]);

  // Address autocomplete via OpenStreetMap (no API key). Debounced + Rostov-bounded.
  useEffect(() => {
    const q = state.address.trim();
    if (q.length < 3) { setAddrSuggest([]); return; }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&accept-language=ru&countrycodes=ru&limit=5&q=${encodeURIComponent("Ростов-на-Дону, " + q)}`;
        const r = await fetch(url, { signal: ctrl.signal, headers: { "Accept": "application/json" } });
        if (!r.ok) return;
        const data: Array<{ display_name: string }> = await r.json();
        setAddrSuggest(data.map((d) => d.display_name).slice(0, 5));
      } catch { /* ignore */ }
    }, 350);
    return () => { ctrl.abort(); clearTimeout(t); };
  }, [state.address]);

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

  function submit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  const fieldStyle: React.CSSProperties = {
    background: "#161816", border: "1px solid #2A2E2A", borderRadius: 14,
    padding: "0 16px", fontFamily: "Inter", fontWeight: 500, fontSize: 15,
    color: "#FFFFFF", height: 54, width: "100%", outline: "none",
    transition: "border-color 180ms ease",
  };

  const line = LINES.find((l) => l.id === state.line)!;

  return (
    <section id="order-form" style={{
      position: "relative",
      background: "#0E0F0E",
      padding: "56px 16px 72px",
      overflow: "hidden",
    }}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(circle at 80% 0%, rgba(46,125,50,0.18) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(212,175,55,0.1) 0%, transparent 50%)",
      }} />

      <div className="relative mx-auto" style={{ maxWidth: 520 }}>
        <SectionHeader
          eyebrow="Заявка"
          title="Оставь заявку"
          desc="Менеджер напишет в Telegram за 30 минут"
          dark
          accent="#D4AF37"
          center
        />

        {/* Selected ration badge */}
        <div className="reveal mt-5 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full"
            style={{
              background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.4)",
              padding: "8px 14px",
            }}>
            <line.Icon size={14} color="#D4AF37" />
            <span style={{ fontFamily: "Inter", fontSize: 12.5, color: "#E8C46B", fontWeight: 600 }}>
              Выбран рацион
            </span>
            <span style={{ fontFamily: "Unbounded", fontSize: 12.5, color: "#D4AF37", fontWeight: 800, letterSpacing: "0.02em" }}>
              {state.line}
            </span>
            <span style={{ color: "#7A8278", fontFamily: "Inter", fontSize: 12 }}>· {state.period}</span>
          </div>
        </div>

        {sent ? (
          <div className="reveal in mt-6 animate-fade-in" style={{
            background: "#161816", border: "1px solid #2A2E2A", borderRadius: 22, padding: 22,
          }}>
            <div className="flex items-center gap-3">
              <div className="grid place-items-center rounded-full shrink-0 check-pop"
                style={{ width: 48, height: 48, background: "#2E7D32", boxShadow: "0 8px 22px -6px rgba(46,125,50,0.5)" }}>
                <Check size={24} color="#FFFFFF" strokeWidth={3} />
              </div>
              <div className="min-w-0">
                <div style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
                  Заявка принята
                </div>
                <div className="mt-0.5" style={{ fontFamily: "Inter", fontSize: 13, color: "#A0A89A" }}>
                  Напишем в Telegram за 30 минут
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl" style={{ background: "#0E0F0E", border: "1px solid #2A2E2A", padding: 16 }}>
              <div style={{ fontFamily: "Inter", fontSize: 10.5, color: "#7A8278", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Ваш заказ
              </div>
              <dl className="mt-2 space-y-1.5" style={{ fontFamily: "Inter", fontSize: 13.5 }}>
                {[
                  ["Имя", state.name || "—"],
                  ["Телефон", state.phone || "—"],
                  ["Telegram", state.telegram || "—"],
                  ["Адрес", state.address || "—"],
                  ["Рацион", `${state.line} · ${line.title}`],
                  ["Период", state.period],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 justify-between">
                    <dt style={{ color: "#7A8278" }}>{k}</dt>
                    <dd className="text-right min-w-0" style={{ color: "#FFFFFF", fontWeight: 500, wordBreak: "break-word" }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <button
              onClick={() => setSent(false)}
              className="press mt-4 w-full"
              style={{
                height: 52, borderRadius: 50,
                background: "transparent", border: "1px solid #2A2E2A",
                color: "#FFFFFF", fontFamily: "Inter", fontWeight: 600, fontSize: 14,
              }}
            >
              Изменить заявку
            </button>
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
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                fontFamily: "Inter", color: "#7A8278", fontSize: 15, pointerEvents: "none",
              }}>@</span>
              <input
                style={{ ...fieldStyle, paddingLeft: 32 }}
                placeholder="username"
                value={state.telegram.replace(/^@/, "")}
                onChange={(e) => set("telegram", e.target.value.replace(/^@/, ""))}
                onFocus={(e) => e.currentTarget.style.borderColor = "#D4AF37"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#2A2E2A"}
              />
            </div>
            <input
              style={fieldStyle}
              type="text"
              list="addr-suggest"
              autoComplete="street-address"
              placeholder="Адрес доставки: ул., дом, кв."
              value={state.address}
              onChange={(e) => set("address", e.target.value)}
              required
              onFocus={(e) => e.currentTarget.style.borderColor = "#D4AF37"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#2A2E2A"}
            />
            <datalist id="addr-suggest">
              {addrSuggest.map((s) => <option key={s} value={s} />)}
            </datalist>


            <button type="submit" className="press"
              style={{
                marginTop: 8,
                width: "100%", height: 52, borderRadius: 50,
                background: "#D4AF37", color: "#0E0F0E",
                fontFamily: "Unbounded", fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em",
                boxShadow: "0 14px 32px -10px rgba(212,175,55,0.55)",
              }}>
              Отправить заявку
            </button>
            <p className="text-center" style={{ marginTop: 8, fontFamily: "Inter", fontSize: 11, color: "#7A8278" }}>
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
  const labelStyle = { fontFamily: "Unbounded", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", color: "#FFFFFF", textTransform: "uppercase" as const, marginBottom: 16 };
  const linkStyle = { fontFamily: "Inter", fontSize: 14, color: "#A0A89A", lineHeight: 1.8, display: "block" as const };
  const socialStyle = { width: 40, height: 40, background: "#1A1E1A", color: "#D4AF37", borderRadius: 999, display: "grid", placeItems: "center" } as const;

  return (
    <footer id="footer" style={{ background: "#0A0B0A", borderTop: "1px solid #1A1E1A", padding: "56px 16px 32px" }}>
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <div className="grid gap-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {/* Left */}
          <div>
            <Logo />
            <p className="mt-3" style={{ fontFamily: "Inter", fontSize: 14, color: "#A0A89A", maxWidth: 280, lineHeight: 1.6 }}>
              Доставка здорового питания
            </p>
            <p className="mt-5" style={{ fontFamily: "Inter", fontSize: 13, color: "#7A8076" }}>
              ИП Иванов И.И.
            </p>
            <a href="#" style={{ fontFamily: "Inter", fontSize: 13, color: "#D4AF37", textDecoration: "underline", marginTop: 6, display: "inline-block" }}>
              Посмотреть реквизиты
            </a>
          </div>

          {/* Middle */}
          <div>
            <div style={labelStyle}>Полезная информация</div>
            <a href="/offer" style={linkStyle}>Публичная оферта</a>
            <a href="/privacy" style={linkStyle}>Политика обработки персональных данных</a>
            <a href="/consent" style={linkStyle}>Согласие на обработку персональных данных</a>
          </div>

          {/* Right */}
          <div>
            <div style={labelStyle}>Контакты</div>
            <div style={{ ...linkStyle, color: "#C5C9BD" }}>г. Ростов-на-Дону</div>
            <a href="tel:+79966100006" style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 18, color: "#D4AF37", display: "inline-block", marginTop: 6 }}>
              +7 (996) 610-00-06
            </a>
            <div className="mt-5 flex" style={{ gap: 10 }}>
              <a href="https://vk.com/fitera" aria-label="VK" style={socialStyle}>
                <span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 14 }}>VK</span>
              </a>
              <a href="https://t.me/fitera_rstv" aria-label="Telegram" style={socialStyle}>
                <Send size={18} />
              </a>
              <a href="https://wa.me/79966100006" aria-label="WhatsApp" style={socialStyle}>
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-wrap items-center justify-between" style={{ borderTop: "1px solid #1A1E1A", gap: 12 }}>
          <div style={{ fontFamily: "Inter", fontSize: 12, color: "#555" }}>
            © 2026 Fitera. Все права защищены
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 12, color: "#555" }}>
            Разработка — <a href="https://neeklo.ru" target="_blank" rel="noopener noreferrer" style={{ color: "#A0A89A", textDecoration: "underline" }}>neeklo.ru</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ────────── Mobile Bottom Nav (4 tabs + order pill) ────────── */

function MobileBottomBar({
  activeId,
  onTab,
  onOrder,
}: {
  activeId: string;
  onTab: (id: string, hash: string) => void;
  onOrder: () => void;
}) {
  const tabs = [
    { id: "top", label: "Главная", Icon: Home, hash: "#top" },
    { id: "lines", label: "Рационы", Icon: UtensilsCrossed, hash: "#lines" },
    { id: "menu", label: "Меню", Icon: Sparkles, hash: "#menu" },
    { id: "calc", label: "Калории", Icon: CalcIcon, hash: "#calc" },
  ];
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe"
      style={{
        background: "rgba(14,15,14,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingTop: 8,
        paddingLeft: 8,
        paddingRight: 8,
      }}
    >
      <div className="flex items-center" style={{ gap: 4 }}>
        {tabs.map((t) => {
          const active = activeId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTab(t.id, t.hash)}
              className="press flex flex-col items-center justify-center rounded-xl"
              style={{
                flex: 1, height: 52,
                background: active ? "rgba(212,175,55,0.12)" : "transparent",
                color: active ? "#D4AF37" : "#A0A89A",
                transition: "background 200ms ease, color 200ms ease",
              }}
              aria-label={t.label}
              aria-current={active ? "page" : undefined}
            >
              <t.Icon size={18} />
              <span style={{ fontFamily: "Inter", fontSize: 9.5, marginTop: 3, fontWeight: 600, letterSpacing: "0.02em" }}>
                {t.label}
              </span>
            </button>
          );
        })}
        <button
          onClick={onOrder}
          className="press inline-flex items-center justify-center gap-1 shrink-0"
          style={{
            height: 52, paddingInline: 14, borderRadius: 50,
            background: "#D4AF37",
            color: "#0E0F0E",
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: 13,
            boxShadow: "0 8px 22px -6px rgba(212,175,55,0.55)",
          }}
        >
          Заказать <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ────────── Active section tracker ────────── */

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids.join(",")]);
  return active;
}

/* ────────── Root ────────── */

function Landing() {
  useReveal();
  const [dish, setDish] = useState<Dish | null>(null);
  const [selectedLine, setSelectedLine] = useState<LineId>("POWER");
  const [openLine, setOpenLine] = useState<LineId | null>("POWER");
  const [orderModal, setOrderModal] = useState<{ line: LineId | null; period?: string } | null>(null);
  const active = useActiveSection(["top", "lines", "menu", "calc", "subs", "delivery", "faq", "cant-decide"]);

  // Telegram Mini App viewport — try to expand & set theme
  const tgInitRan = useRef(false);
  useEffect(() => {
    if (tgInitRan.current) return;
    tgInitRan.current = true;
    const tg = (window as unknown as { Telegram?: { WebApp?: { ready?: () => void; expand?: () => void; setHeaderColor?: (c: string) => void; setBackgroundColor?: (c: string) => void } } }).Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready?.();
        tg.expand?.();
        tg.setHeaderColor?.("#0E0F0E");
        tg.setBackgroundColor?.("#0E0F0E");
      } catch { /* noop */ }
    }
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openOrder(line: LineId | null = null, period?: string) {
    if (line) {
      setSelectedLine(line);
      setOpenLine(line);
    }
    setOrderModal({ line, period });
  }

  function openLineAccordion(id: LineId) {
    setSelectedLine(id);
    setOpenLine((cur) => (cur === id ? null : id));
  }

  function chooseLine(id: LineId) {
    openOrder(id);
  }

  return (
    <div className="has-bottom-bar" style={{ background: "#0E0F0E", minHeight: "100vh" }}>
      <ScrollProgress />
      <Navbar onOrder={() => openOrder()} />
      <main>
        <Hero onOrder={() => scrollTo("lines")} onCalc={() => scrollTo("calc")} />
        <LinesSection
          selected={selectedLine}
          openId={openLine}
          onOpen={openLineAccordion}
          onChoose={chooseLine}
        />
        <MenuSection lineId={selectedLine} onOpenDish={setDish} onOrder={() => openOrder(selectedLine)} />
        <Subscription onSelect={(period) => openOrder(selectedLine, period)} />
        <Delivery onAsk={() => openOrder()} />
        <Calculator onOrder={(line) => openOrder(line)} />
        <FAQSection />
        <CantDecideSection />
      </main>
      <Footer />
      {dish && <DishModal dish={dish} onClose={() => setDish(null)} onOrder={(line) => openOrder(line)} />}
      {orderModal && (
        <OrderModal
          initialLine={orderModal.line}
          initialPeriod={orderModal.period}
          onClose={() => setOrderModal(null)}
        />
      )}
      <MobileBottomBar
        activeId={active}
        onTab={(_id, hash) => scrollTo(hash.slice(1))}
        onOrder={() => openOrder()}
      />
    </div>
  );
}

