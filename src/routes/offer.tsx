import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "./privacy";

export const Route = createFileRoute("/offer")({
  head: () => ({
    meta: [
      { title: "Публичная оферта — FITERA" },
      { name: "description", content: "Публичная оферта на оказание услуг по доставке рационов питания FITERA." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Публичная оферта — FITERA" },
      { property: "og:description", content: "Договор публичной оферты FITERA." },
      { property: "og:url", content: "https://fitera-fuel-hub.lovable.app/offer" },
    ],
    links: [{ rel: "canonical", href: "https://fitera-fuel-hub.lovable.app/offer" }],
  }),
  component: OfferPage,
});

function OfferPage() {
  return <LegalPage title="Публичная оферта">
    <p>Настоящий документ является публичной офертой FITERA (далее — «Исполнитель») на оказание услуг по приготовлению и доставке готовых рационов питания.</p>
    <h2>1. Общие положения</h2>
    <p>Акцептом оферты является оформление заказа через сайт или Telegram-чат Исполнителя.</p>
    <h2>2. Предмет договора</h2>
    <p>Исполнитель обязуется приготовить и доставить заказанные рационы, а Заказчик — принять и оплатить их.</p>
    <h2>3. Стоимость и оплата</h2>
    <p>Стоимость определяется в соответствии с актуальным прайс-листом на сайте на момент оформления заказа.</p>
    <h2>4. Сроки доставки</h2>
    <p>Доставка осуществляется ежедневно по графику, согласованному с Заказчиком.</p>
    <h2>5. Качество</h2>
    <p>Исполнитель гарантирует свежесть и соответствие заявленному КБЖУ. Все блюда готовятся в день доставки.</p>
    <h2>6. Реквизиты</h2>
    <p>ИП / самозанятый, г. Ростов-на-Дону. Telegram: <a href="https://t.me/fitera_rstv">@fitera_rstv</a></p>
  </LegalPage>;
}
