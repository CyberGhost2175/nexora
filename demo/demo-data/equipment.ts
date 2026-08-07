import type { EquipmentInService } from "@/lib/types";
import { daysAgo } from "./dates";

export const EQUIPMENT_IN_SERVICE: EquipmentInService[] = [
  {
    id: "s1",
    name: "Слайсер RGV Lusso 25 GS",
    serial: "SN-88412-K",
    client: "Гастроном «Восток»",
    acceptedAt: daysAgo(4),
    status: "repair",
    ticketNumber: "NX-1051",
  },
  {
    id: "s2",
    name: "Кофемашина Nuova Simonelli Appia II",
    serial: "SN-20574-A",
    client: "CoffeeLab Арбат",
    acceptedAt: daysAgo(5),
    status: "awaiting_parts",
    ticketNumber: "NX-1050",
  },
  {
    id: "s3",
    name: "Миксер планетарный Kitfort KT-1348",
    serial: "SN-11930-M",
    client: "Кулинария «Береке»",
    acceptedAt: daysAgo(2),
    status: "diagnostics",
    ticketNumber: "NX-1062",
  },
  {
    id: "s4",
    name: "Вакууматор Profi Cook PC-VK 1080",
    serial: "SN-45021-P",
    client: "Ресторан «Алтын Орда»",
    acceptedAt: daysAgo(8),
    status: "ready",
    ticketNumber: "NX-1041",
  },
];

export const SERVICE_STATUS_LABELS: Record<
  EquipmentInService["status"],
  string
> = {
  diagnostics: "Диагностика",
  repair: "В ремонте",
  awaiting_parts: "Ожидает запчасть",
  ready: "Готово к выдаче",
};
