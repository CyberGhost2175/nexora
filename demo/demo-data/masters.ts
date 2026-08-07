import type { Master } from "@/lib/types";

export const MASTERS: Master[] = [
  {
    id: "m1",
    name: "Аскар Турсынов",
    type: "staff",
    phone: "+7 (701) 111-22-33",
    district: "Бостандыкский р-н",
    activeLoad: 3,
  },
  {
    id: "m2",
    name: "Дмитрий Ковалёв",
    type: "staff",
    phone: "+7 (702) 222-33-44",
    district: "Алмалинский р-н",
    activeLoad: 2,
  },
  {
    id: "m3",
    name: "Ерлан Сагындыков",
    type: "staff",
    phone: "+7 (705) 333-44-55",
    district: "Медеуский р-н",
    activeLoad: 1,
  },
  {
    id: "m4",
    name: "Виктор Панченко",
    type: "partner",
    phone: "+7 (707) 444-55-66",
    district: "Ауэзовский р-н",
    activeLoad: 2,
  },
  {
    id: "m5",
    name: "Нурлан Абишев",
    type: "partner",
    phone: "+7 (747) 555-66-77",
    district: "Наурызбайский р-н",
    activeLoad: 1,
  },
  {
    id: "m6",
    name: "Сергей Мельник",
    type: "partner",
    phone: "+7 (778) 666-77-88",
    district: "Турксибский р-н",
    activeLoad: 0,
  },
];

export function masterById(id?: string): Master | undefined {
  return MASTERS.find((m) => m.id === id);
}
