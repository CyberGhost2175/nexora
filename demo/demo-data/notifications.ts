import type { AppNotification } from "@/lib/types";
import { hoursAgo } from "./dates";

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    at: hoursAgo(1),
    kind: "new_ticket",
    title: "Новая заявка NX-1061",
    text: "Кафе «Тандыр»: не морозит холодильный шкаф, приоритет P1",
    read: false,
  },
  {
    id: "n2",
    at: hoursAgo(3),
    kind: "deadline",
    title: "Дедлайн по NX-1058",
    text: "Просрочен SLA по заявке «Не включается конвекционная печь»",
    read: false,
  },
  {
    id: "n3",
    at: hoursAgo(6),
    kind: "comment",
    title: "Комментарий в NX-1049",
    text: "Нурлан Абишев: «Готово, шкаф выходит на 280°C стабильно»",
    read: false,
  },
  {
    id: "n4",
    at: hoursAgo(10),
    kind: "new_ticket",
    title: "Повторный вызов NX-1048",
    text: "Бар «Кристалл»: льдогенератор снова не намораживает",
    read: true,
  },
  {
    id: "n5",
    at: hoursAgo(20),
    kind: "comment",
    title: "Комментарий в NX-1054",
    text: "Виктор Панченко: «Компрессор под замену, оформил заказ поставщику»",
    read: true,
  },
];
