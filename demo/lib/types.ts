export type Role = "admin" | "manager" | "executor" | "master";

export type TicketStatus =
  | "new"
  | "in_progress"
  | "awaiting_parts"
  | "frozen"
  | "in_service"
  | "on_approval"
  | "recall"
  | "closed"
  | "cancelled";

export type Priority = "P1" | "P2" | "P3" | "P4";

export type MasterType = "staff" | "partner";

export interface Master {
  id: string;
  name: string;
  type: MasterType;
  phone: string;
  district: string;
  /** Кол-во активных заявок для отображения загрузки */
  activeLoad: number;
}

export interface TicketEvent {
  id: string;
  at: string; // ISO
  author: string; // "Система" | имя пользователя
  kind: "system" | "comment" | "status";
  text: string;
}

export interface UsedPart {
  partId: string;
  name: string;
  qty: number;
  price: number; // цена за единицу, ₸
}

export interface ClosingReport {
  workDone: string;
  revenue: number; // сумма, которую платит клиент/партнёр
  partsCost: number; // себестоимость запчастей
  profit: number; // revenue - partsCost
  payout: number; // выплата мастеру
  companyIncome: number; // profit - payout
}

export interface Ticket {
  id: string;
  number: string; // NX-1042
  title: string;
  status: TicketStatus;
  priority: Priority;
  createdAt: string;
  deadline: string;
  client: {
    name: string;
    phone: string;
    address: string;
  };
  partnerId?: string; // если заявка от сетевого партнёра
  equipment: string;
  description: string;
  assigneeId?: string; // назначенный мастер
  proposedToId?: string; // мастер, которому предложена заявка
  attachments: { name: string; size: string }[];
  usedParts: UsedPart[];
  events: TicketEvent[];
  closing?: ClosingReport;
  closedAt?: string;
}

export interface PartnerPoint {
  id: string;
  name: string;
  address: string;
  maintenanceDone: boolean;
  doneAt?: string;
  transferredToRepair?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  kind: string; // "Сеть быстрого питания" | "Ритейл" | ...
  contractNumber: string;
  points: PartnerPoint[];
  maintenancePeriod: string; // "Август 2026"
  pricePerPoint: number; // стоимость ТО одной точки, ₸
}

export interface Part {
  id: string;
  sku: string;
  name: string;
  category: string;
  section: "SERVICE" | "PARTNER"; // SERVICE — с остатками, PARTNER — учёт без остатков
  partnerId?: string;
  stock: number | null; // null для секции без остатков
  minStock: number | null;
  price: number;
}

export interface EquipmentInService {
  id: string;
  name: string;
  serial: string;
  client: string;
  acceptedAt: string;
  status: "diagnostics" | "repair" | "awaiting_parts" | "ready";
  ticketNumber: string;
}

export interface AppNotification {
  id: string;
  at: string;
  kind: "new_ticket" | "deadline" | "comment";
  title: string;
  text: string;
  read: boolean;
}

export interface ActRow {
  name: string;
  qty: number;
  unit: string;
  price: number;
}

export interface Act {
  id: string;
  number: string; // АВР-2026-014
  date: string;
  kind: "repair" | "maintenance";
  customer: string; // юр. название заказчика
  customerDetails: string; // БИН, адрес
  rows: ActRow[];
  ticketNumber?: string;
  partnerId?: string;
}

export type LicenseScenario = "active" | "grace" | "restricted";

export interface LicenseRenewal {
  date: string;
  amount: number;
  status: "paid";
  period: string;
}

export interface DirectoryItem {
  id: string;
  name: string;
  count: number;
}
