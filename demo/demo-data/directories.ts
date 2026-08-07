import type { DirectoryItem } from "@/lib/types";

/** Справочники — статичная CRUD-заглушка для демо */
export const EQUIPMENT_CATEGORIES: DirectoryItem[] = [
  { id: "ec1", name: "Холодильное оборудование", count: 42 },
  { id: "ec2", name: "Тепловое оборудование", count: 31 },
  { id: "ec3", name: "Электромеханическое оборудование", count: 18 },
  { id: "ec4", name: "Кофейное оборудование", count: 12 },
  { id: "ec5", name: "Вентиляция и климат", count: 7 },
];

export const FAULT_TYPES: DirectoryItem[] = [
  { id: "ft1", name: "Не включается / нет питания", count: 24 },
  { id: "ft2", name: "Не держит температуру", count: 37 },
  { id: "ft3", name: "Утечка хладагента", count: 15 },
  { id: "ft4", name: "Механический износ узла", count: 22 },
  { id: "ft5", name: "Течь воды / гидравлика", count: 11 },
  { id: "ft6", name: "Электроника / контроллер", count: 9 },
];
