/** Демо-тенант. Все названия и реквизиты вымышленные. */
export const COMPANY = {
  name: "ТОО «СервисПро Алматы»",
  bin: "123456789012",
  address: "г. Алматы, ул. Кунаева, 77, офис 412",
  phone: "+7 (727) 300-00-00",
  director: "Сапарова А. Б.",
};

export const MODULES = [
  { key: "tickets", label: "Заявки и диспетчеризация" },
  { key: "maintenance", label: "Плановое ТО (сетевые партнёры)" },
  { key: "warehouse", label: "Склад запчастей" },
  { key: "finance", label: "Финансы по заявке" },
  { key: "acts", label: "Акты (АВР) и публичные ссылки" },
  { key: "service", label: "Оборудование в сервисе" },
  { key: "map", label: "Карта и маршруты" },
  { key: "analytics", label: "Аналитика и KPI" },
  { key: "mobile", label: "Мобильное приложение мастера" },
  { key: "notifications", label: "Уведомления" },
] as const;
