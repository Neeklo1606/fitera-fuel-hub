import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "./privacy";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Пользовательское соглашение — FITERA" },
      { name: "description", content: "Условия использования сайта FITERA и сервиса доставки рационов питания." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Пользовательское соглашение — FITERA" },
      { property: "og:description", content: "Правила пользования сайтом и сервисом FITERA." },
      { property: "og:url", content: "https://fitera-fuel-hub.lovable.app/terms" },
    ],
    links: [{ rel: "canonical", href: "https://fitera-fuel-hub.lovable.app/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return <LegalPage title="Пользовательское соглашение">
    <p>Используя сайт FITERA, вы соглашаетесь с условиями настоящего соглашения.</p>
    <h2>1. Предмет</h2>
    <p>Сайт предоставляет информацию о готовых рационах питания и возможность оформить заказ с доставкой по Ростову-на-Дону.</p>
    <h2>2. Заказ и оплата</h2>
    <p>Заказ оформляется через форму на сайте или Telegram. Оплата производится наличными при доставке или переводом по согласованию.</p>
    <h2>3. Доставка</h2>
    <p>Доставка осуществляется в пределах Ростова-на-Дону в согласованное время. По вопросам доставки в пригороды свяжитесь с нами.</p>
    <h2>4. Возврат</h2>
    <p>В соответствии со ст. 26.1 Закона «О защите прав потребителей» продукты питания надлежащего качества возврату не подлежат. При обнаружении дефекта свяжитесь с нами в течение 2 часов после доставки.</p>
    <h2>5. Ответственность</h2>
    <p>Клиент обязан указать достоверные контактные данные и адрес. FITERA не несёт ответственности за невозможность доставки из-за неверных данных.</p>
    <h2>6. Контакты</h2>
    <p>Telegram: <a href="https://t.me/fitera_rstv">@fitera_rstv</a></p>
  </LegalPage>;
}
