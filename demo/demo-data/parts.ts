import type { Part } from "@/lib/types";

/**
 * Склад: секция SERVICE — собственный склад с остатками,
 * секция PARTNER — номенклатура сетевого партнёра (учёт без остатков).
 */
export const PARTS: Part[] = [
  { id: "pt1", sku: "CMP-104", name: "Компрессор Embraco NEK6214Z", category: "Холодильное", section: "SERVICE", stock: 3, minStock: 2, price: 78000 },
  { id: "pt2", sku: "CMP-089", name: "Компрессор Danfoss SC15G", category: "Холодильное", section: "SERVICE", stock: 1, minStock: 2, price: 92000 },
  { id: "pt3", sku: "TEN-201", name: "ТЭН духового шкафа 2.5 кВт", category: "Тепловое", section: "SERVICE", stock: 8, minStock: 4, price: 12500 },
  { id: "pt4", sku: "TEN-215", name: "ТЭН фритюрницы 3 кВт", category: "Тепловое", section: "SERVICE", stock: 2, minStock: 3, price: 15800 },
  { id: "pt5", sku: "TRM-054", name: "Термостат Danfoss 077B", category: "Холодильное", section: "SERVICE", stock: 12, minStock: 5, price: 6400 },
  { id: "pt6", sku: "TRM-061", name: "Термостат капиллярный 300°C", category: "Тепловое", section: "SERVICE", stock: 6, minStock: 3, price: 4800 },
  { id: "pt7", sku: "FLT-310", name: "Фильтр-осушитель 30 г", category: "Холодильное", section: "SERVICE", stock: 24, minStock: 10, price: 1900 },
  { id: "pt8", sku: "GSK-118", name: "Уплотнитель двери шкафа 650×1500", category: "Холодильное", section: "SERVICE", stock: 4, minStock: 4, price: 9200 },
  { id: "pt9", sku: "FAN-072", name: "Вентилятор обдува YZF 10-20", category: "Холодильное", section: "SERVICE", stock: 7, minStock: 3, price: 8700 },
  { id: "pt10", sku: "REL-033", name: "Пусковое реле РКТ-2", category: "Электрика", section: "SERVICE", stock: 15, minStock: 6, price: 2300 },
  { id: "pt11", sku: "PMP-091", name: "Помпа сливная посудомоечной машины", category: "Электромеханика", section: "SERVICE", stock: 2, minStock: 2, price: 14500 },
  { id: "pt12", sku: "VLV-127", name: "Клапан соленоидный 220В 1/2\"", category: "Электромеханика", section: "SERVICE", stock: 5, minStock: 3, price: 7600 },
  { id: "pt13", sku: "CTL-208", name: "Контроллер Eliwell ID Plus 974", category: "Электрика", section: "SERVICE", stock: 1, minStock: 2, price: 28000 },
  { id: "pt14", sku: "BLT-045", name: "Ремень привода тестомеса B-1250", category: "Электромеханика", section: "SERVICE", stock: 9, minStock: 4, price: 3500 },
  { id: "pt15", sku: "LMP-012", name: "Лампа ИК нагрева 250 Вт", category: "Тепловое", section: "SERVICE", stock: 18, minStock: 8, price: 1400 },
  { id: "pt16", sku: "QF-GRL-01", name: "Решётка гриля QazFood (оригинал)", category: "Тепловое", section: "PARTNER", partnerId: "p1", stock: null, minStock: null, price: 11000 },
  { id: "pt17", sku: "QF-FRY-04", name: "Корзина фритюра QazFood", category: "Тепловое", section: "PARTNER", partnerId: "p1", stock: null, minStock: null, price: 7500 },
  { id: "pt18", sku: "QF-DSP-02", name: "Дозатор соусной станции QazFood", category: "Электромеханика", section: "PARTNER", partnerId: "p1", stock: null, minStock: null, price: 19800 },
];
