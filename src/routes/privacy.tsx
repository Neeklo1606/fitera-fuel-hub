import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Политика конфиденциальности — FITERA" },
      { name: "description", content: "Политика конфиденциальности и обработки персональных данных FITERA." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Политика конфиденциальности — FITERA" },
      { property: "og:description", content: "Как FITERA обрабатывает и защищает персональные данные клиентов." },
      { property: "og:url", content: "https://fitera-fuel-hub.lovable.app/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://fitera-fuel-hub.lovable.app/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return <LegalPage title="Политика конфиденциальности">
    <p>Настоящая Политика определяет порядок обработки и защиты персональных данных пользователей сайта FITERA (далее — «Сайт»).</p>
    <h2>1. Какие данные мы собираем</h2>
    <p>Имя, номер телефона, адрес доставки, ник Telegram, история заказов. Данные предоставляются пользователем добровольно при оформлении заказа.</p>
    <h2>2. Цели обработки</h2>
    <p>Оформление и доставка заказов, связь с клиентом, информирование о статусе заказа, исполнение обязательств по договору.</p>
    <h2>3. Передача третьим лицам</h2>
    <p>Данные не передаются третьим лицам, за исключением служб доставки и платёжных систем в объёме, необходимом для исполнения заказа.</p>
    <h2>4. Хранение и защита</h2>
    <p>Данные хранятся на защищённых серверах. Доступ имеют только уполномоченные сотрудники.</p>
    <h2>5. Права пользователя</h2>
    <p>Вы вправе запросить удаление своих данных, написав в Telegram <a href="https://t.me/fitera_rstv">@fitera_rstv</a>.</p>
    <h2>6. Cookies</h2>
    <p>Сайт использует технические cookie, необходимые для корректной работы.</p>
  </LegalPage>;
}

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#0E0F0E", minHeight: "100vh", color: "#E5E7E0" }}>
      <header style={{ borderBottom: "1px solid #1A1E1A", padding: "20px 16px" }}>
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: 800 }}>
          <Link to="/" style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 18, color: "#FFFFFF", letterSpacing: "0.04em" }}>FITERA</Link>
          <Link to="/" style={{ fontFamily: "Inter", fontSize: 14, color: "#D4AF37" }}>← На главную</Link>
        </div>
      </header>
      <main className="mx-auto" style={{ maxWidth: 800, padding: "40px 16px 80px" }}>
        <h1 style={{ fontFamily: "Unbounded", fontWeight: 800, fontSize: 32, color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: 24 }}>{title}</h1>
        <div className="legal-prose" style={{ fontFamily: "Inter", fontSize: 15, lineHeight: 1.7 }}>{children}</div>
      </main>
      <style>{`
        .legal-prose h2 { font-family: Unbounded; font-weight: 700; font-size: 18px; color: #FFFFFF; margin: 28px 0 10px; letter-spacing: -0.01em; }
        .legal-prose p { margin: 0 0 12px; color: #C5C9BD; }
        .legal-prose a { color: #D4AF37; text-decoration: underline; }
        .legal-prose ul { margin: 0 0 12px 20px; }
        .legal-prose li { margin-bottom: 6px; color: #C5C9BD; }
      `}</style>
    </div>
  );
}
