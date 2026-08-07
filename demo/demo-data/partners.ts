import type { Partner } from "@/lib/types";
import { daysAgo } from "./dates";

/**
 * Демо-партнёры (вымышленные сети).
 * QazFood почти полностью закрыл ТО за период, MegaMart — в процессе,
 * CoffeeLab только начал.
 */
export const PARTNERS: Partner[] = [
  {
    id: "p1",
    name: "QazFood",
    kind: "Сеть быстрого питания",
    contractNumber: "Д-2025/118",
    maintenancePeriod: "Август 2026",
    pricePerPoint: 25000,
    points: [
      { id: "p1-1", name: "QazFood Достык", address: "пр. Достык, 91", maintenanceDone: true, doneAt: daysAgo(9) },
      { id: "p1-2", name: "QazFood Абая", address: "пр. Абая, 44", maintenanceDone: true, doneAt: daysAgo(9) },
      { id: "p1-3", name: "QazFood Сайран", address: "ул. Толе би, 285", maintenanceDone: true, doneAt: daysAgo(8) },
      { id: "p1-4", name: "QazFood Мега Парк", address: "ул. Макатаева, 127", maintenanceDone: true, doneAt: daysAgo(8) },
      { id: "p1-5", name: "QazFood Аксай", address: "мкр. Аксай-4, 121", maintenanceDone: true, doneAt: daysAgo(7) },
      { id: "p1-6", name: "QazFood Орбита", address: "мкр. Орбита-3, 52", maintenanceDone: true, doneAt: daysAgo(6) },
      { id: "p1-7", name: "QazFood Жандосова", address: "ул. Жандосова, 98", maintenanceDone: true, doneAt: daysAgo(5) },
      { id: "p1-8", name: "QazFood Райымбека", address: "пр. Райымбека, 210", maintenanceDone: true, doneAt: daysAgo(4) },
      { id: "p1-9", name: "QazFood Сатпаева", address: "ул. Сатпаева, 30", maintenanceDone: true, doneAt: daysAgo(3) },
      { id: "p1-10", name: "QazFood Момышулы", address: "пр. Б. Момышулы, 12", maintenanceDone: true, doneAt: daysAgo(2) },
      { id: "p1-11", name: "QazFood Шевченко", address: "ул. Шевченко, 118", maintenanceDone: true, doneAt: daysAgo(1) },
      { id: "p1-12", name: "QazFood Есентай", address: "пр. Аль-Фараби, 77", maintenanceDone: false },
    ],
  },
  {
    id: "p2",
    name: "MegaMart",
    kind: "Продуктовый ритейл",
    contractNumber: "Д-2025/134",
    maintenancePeriod: "Август 2026",
    pricePerPoint: 40000,
    points: [
      { id: "p2-1", name: "MegaMart Центральный", address: "ул. Гоголя, 58", maintenanceDone: true, doneAt: daysAgo(6) },
      { id: "p2-2", name: "MegaMart Тастак", address: "ул. Тлендиева, 258", maintenanceDone: true, doneAt: daysAgo(5) },
      { id: "p2-3", name: "MegaMart Айнабулак", address: "мкр. Айнабулак-2, 45", maintenanceDone: true, doneAt: daysAgo(4) },
      { id: "p2-4", name: "MegaMart Саина", address: "ул. Саина, 24", maintenanceDone: true, doneAt: daysAgo(2) },
      { id: "p2-5", name: "MegaMart Кулагера", address: "мкр. Кулагер, 3", maintenanceDone: false },
      { id: "p2-6", name: "MegaMart Розыбакиева", address: "ул. Розыбакиева, 247", maintenanceDone: false },
      { id: "p2-7", name: "MegaMart Наурызбай", address: "мкр. Шугыла, 340", maintenanceDone: false },
      { id: "p2-8", name: "MegaMart Медеу", address: "ул. Керей-Жанибек, 180", maintenanceDone: false },
      { id: "p2-9", name: "MegaMart Турксиб", address: "ул. Майлина, 85", maintenanceDone: false, transferredToRepair: true },
      { id: "p2-10", name: "MegaMart Алатау", address: "мкр. Алатау, ул. Жулдыз, 15", maintenanceDone: false },
    ],
  },
  {
    id: "p3",
    name: "CoffeeLab",
    kind: "Сеть кофеен",
    contractNumber: "Д-2026/041",
    maintenancePeriod: "Август 2026",
    pricePerPoint: 18000,
    points: [
      { id: "p3-1", name: "CoffeeLab Панфилова", address: "ул. Панфилова, 109", maintenanceDone: true, doneAt: daysAgo(3) },
      { id: "p3-2", name: "CoffeeLab Арбат", address: "ул. Жибек Жолы, 64", maintenanceDone: false },
      { id: "p3-3", name: "CoffeeLab Терренкур", address: "пр. Достык, 132", maintenanceDone: false },
      { id: "p3-4", name: "CoffeeLab Ботсад", address: "пр. Аль-Фараби, 36", maintenanceDone: false },
      { id: "p3-5", name: "CoffeeLab Атакент", address: "ул. Тимирязева, 42", maintenanceDone: false },
      { id: "p3-6", name: "CoffeeLab Форум", address: "ул. Сейфуллина, 617", maintenanceDone: false },
    ],
  },
];

export function partnerById(id?: string): Partner | undefined {
  return PARTNERS.find((p) => p.id === id);
}
