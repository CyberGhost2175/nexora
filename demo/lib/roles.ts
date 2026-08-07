import type { Role } from "./types";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Администратор",
  manager: "Менеджер / диспетчер",
  executor: "Штатный мастер",
  master: "Партнёрский мастер",
};

/** Демо-пользователь, от лица которого работает каждая роль */
export const ROLE_USER: Record<Role, { name: string; masterId?: string }> = {
  admin: { name: "Алия Сапарова" },
  manager: { name: "Мария Ким" },
  executor: { name: "Аскар Турсынов", masterId: "m1" },
  master: { name: "Виктор Панченко", masterId: "m4" },
};

export interface NavItem {
  href: string;
  label: string;
  roles: Role[];
  icon: string; // ключ иконки, рендерится в Sidebar
}

/** Матрица доступа: какие пункты меню видит каждая роль */
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Дашборд", icon: "dashboard", roles: ["admin", "manager", "executor", "master"] },
  { href: "/tickets", label: "Заявки", icon: "tickets", roles: ["admin", "manager", "executor", "master"] },
  { href: "/dispatch", label: "Диспетчеризация", icon: "dispatch", roles: ["admin", "manager"] },
  { href: "/maintenance", label: "Плановое ТО", icon: "maintenance", roles: ["admin", "manager"] },
  { href: "/warehouse", label: "Склад запчастей", icon: "warehouse", roles: ["admin", "manager", "executor"] },
  { href: "/acts", label: "Акты (АВР)", icon: "acts", roles: ["admin", "manager"] },
  { href: "/service", label: "В сервисе", icon: "service", roles: ["admin", "manager", "executor"] },
  { href: "/map", label: "Карта и маршруты", icon: "map", roles: ["admin", "manager", "executor", "master"] },
  { href: "/analytics", label: "Аналитика и KPI", icon: "analytics", roles: ["admin", "manager"] },
  { href: "/directories", label: "Справочники", icon: "directories", roles: ["admin"] },
  { href: "/settings/license", label: "Лицензия", icon: "license", roles: ["admin"] },
];

export function navForRole(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}
