"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type {
  Act,
  AppNotification,
  LicenseScenario,
  Part,
  Partner,
  Role,
  Ticket,
  TicketEvent,
  TicketStatus,
} from "./types";
import { canTransition, STATUS_LABELS } from "./status-machine";
import { calcFinance } from "./finance";
import { ROLE_USER } from "./roles";
import { TICKETS } from "@/demo-data/tickets";
import { PARTS } from "@/demo-data/parts";
import { PARTNERS } from "@/demo-data/partners";
import { NOTIFICATIONS } from "@/demo-data/notifications";
import { ACTS, buildShareToken } from "@/demo-data/acts";
import { masterById } from "@/demo-data/masters";

interface Toast {
  id: number;
  text: string;
}

interface DemoContextValue {
  role: Role;
  setRole: (role: Role) => void;
  currentUserName: string;
  currentMasterId?: string;

  tickets: Ticket[];
  visibleTickets: Ticket[];
  changeTicketStatus: (id: string, to: TicketStatus) => void;
  assignMaster: (id: string, masterId: string) => void;
  proposeMaster: (id: string, masterId: string) => void;
  acceptProposal: (id: string) => void;
  declineProposal: (id: string) => void;
  addComment: (id: string, text: string) => void;
  consumePart: (ticketId: string, partId: string, qty: number) => void;
  closeTicket: (id: string, workDone: string, revenue: number) => void;

  parts: Part[];
  partners: Partner[];
  closePoint: (partnerId: string, pointId: string) => void;
  transferPointToRepair: (partnerId: string, pointId: string) => void;

  acts: Act[];
  shareLinks: Record<string, string>;
  createShareLink: (actId: string) => string;

  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;

  licenseScenario: LicenseScenario;
  setLicenseScenario: (scenario: LicenseScenario) => void;
  uploadLicense: () => void;

  toasts: Toast[];
  toast: (text: string) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

let toastSeq = 0;
let eventSeq = 1000;

function makeEvent(
  kind: TicketEvent["kind"],
  text: string,
  author = "Система",
): TicketEvent {
  return {
    id: `re${++eventSeq}`,
    at: new Date().toISOString(),
    kind,
    text,
    author,
  };
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("admin");
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS);
  const [parts, setParts] = useState<Part[]>(PARTS);
  const [partners, setPartners] = useState<Partner[]>(PARTNERS);
  const [acts] = useState<Act[]>(ACTS);
  const [shareLinks, setShareLinks] = useState<Record<string, string>>({});
  const [notifications, setNotifications] =
    useState<AppNotification[]>(NOTIFICATIONS);
  const [licenseScenario, setLicenseScenario] =
    useState<LicenseScenario>("active");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((text: string) => {
    const id = ++toastSeq;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const patchTicket = useCallback(
    (id: string, patch: (t: Ticket) => Ticket) => {
      setTickets((prev) => prev.map((t) => (t.id === id ? patch(t) : t)));
    },
    [],
  );

  const changeTicketStatus = useCallback(
    (id: string, to: TicketStatus) => {
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id !== id || !canTransition(t.status, to)) return t;
          return {
            ...t,
            status: to,
            closedAt: to === "closed" ? new Date().toISOString() : t.closedAt,
            events: [
              ...t.events,
              makeEvent(
                "status",
                `Статус изменён: ${STATUS_LABELS[t.status]} → ${STATUS_LABELS[to]}`,
              ),
            ],
          };
        }),
      );
    },
    [],
  );

  const assignMaster = useCallback(
    (id: string, masterId: string) => {
      const master = masterById(masterId);
      if (!master) return;
      patchTicket(id, (t) => ({
        ...t,
        assigneeId: masterId,
        proposedToId: undefined,
        status: canTransition(t.status, "in_progress")
          ? "in_progress"
          : t.status,
        events: [
          ...t.events,
          makeEvent("system", `Назначен исполнитель: ${master.name}`),
          ...(canTransition(t.status, "in_progress")
            ? [
                makeEvent(
                  "status",
                  `Статус изменён: ${STATUS_LABELS[t.status]} → ${STATUS_LABELS.in_progress}`,
                ),
              ]
            : []),
        ],
      }));
      toast(`Исполнитель назначен: ${master.name}`);
    },
    [patchTicket, toast],
  );

  const proposeMaster = useCallback(
    (id: string, masterId: string) => {
      const master = masterById(masterId);
      if (!master) return;
      patchTicket(id, (t) => ({
        ...t,
        proposedToId: masterId,
        events: [
          ...t.events,
          makeEvent("system", `Заявка предложена мастеру: ${master.name}`),
        ],
      }));
      toast(`Заявка предложена: ${master.name}`);
    },
    [patchTicket, toast],
  );

  const acceptProposal = useCallback(
    (id: string) => {
      patchTicket(id, (t) => {
        if (!t.proposedToId) return t;
        const master = masterById(t.proposedToId);
        return {
          ...t,
          assigneeId: t.proposedToId,
          proposedToId: undefined,
          status: canTransition(t.status, "in_progress")
            ? "in_progress"
            : t.status,
          events: [
            ...t.events,
            makeEvent("system", `Мастер принял заявку: ${master?.name ?? ""}`),
          ],
        };
      });
      toast("Заявка принята в работу");
    },
    [patchTicket, toast],
  );

  const declineProposal = useCallback(
    (id: string) => {
      patchTicket(id, (t) => ({
        ...t,
        proposedToId: undefined,
        events: [...t.events, makeEvent("system", "Мастер отклонил заявку")],
      }));
      toast("Заявка отклонена");
    },
    [patchTicket, toast],
  );

  const addComment = useCallback(
    (id: string, text: string) => {
      const author = ROLE_USER[role].name;
      patchTicket(id, (t) => ({
        ...t,
        events: [...t.events, makeEvent("comment", text, author)],
      }));
    },
    [patchTicket, role],
  );

  const consumePart = useCallback(
    (ticketId: string, partId: string, qty: number) => {
      const part = parts.find((p) => p.id === partId);
      if (!part || qty < 1) return;
      // уменьшаем остаток только для секции SERVICE (учёт с остатками)
      setParts((prev) =>
        prev.map((p) =>
          p.id === partId && p.stock !== null
            ? { ...p, stock: Math.max(0, p.stock - qty) }
            : p,
        ),
      );
      patchTicket(ticketId, (t) => ({
        ...t,
        usedParts: [
          ...t.usedParts,
          { partId, name: part.name, qty, price: part.price },
        ],
        events: [
          ...t.events,
          makeEvent("system", `Списана запчасть: ${part.name} × ${qty}`),
        ],
      }));
      toast(`Списано: ${part.name} × ${qty}`);
    },
    [parts, patchTicket, toast],
  );

  const closeTicket = useCallback(
    (id: string, workDone: string, revenue: number) => {
      patchTicket(id, (t) => {
        const masterType = masterById(t.assigneeId)?.type ?? "staff";
        const partsCost = t.usedParts.reduce(
          (sum, p) => sum + p.qty * p.price,
          0,
        );
        // закрытие проходит по графу FSM: если прямого перехода в "closed"
        // нет, идём через промежуточный статус "on_approval"
        const path: typeof t.status[] = canTransition(t.status, "closed")
          ? ["closed"]
          : canTransition(t.status, "on_approval")
            ? ["on_approval", "closed"]
            : [];
        if (path.length === 0) return t;
        const statusEvents = path.map((to, i) =>
          makeEvent(
            "status",
            `Статус изменён: ${STATUS_LABELS[i === 0 ? t.status : path[i - 1]]} → ${STATUS_LABELS[to]}`,
          ),
        );
        return {
          ...t,
          status: "closed",
          closedAt: new Date().toISOString(),
          closing: { workDone, ...calcFinance(revenue, partsCost, masterType) },
          events: [
            ...t.events,
            makeEvent("system", "Анкета закрытия заполнена"),
            ...statusEvents,
          ],
        };
      });
      toast("Заявка закрыта, анкета сохранена");
    },
    [patchTicket, toast],
  );

  const closePoint = useCallback(
    (partnerId: string, pointId: string) => {
      setPartners((prev) =>
        prev.map((p) =>
          p.id === partnerId
            ? {
                ...p,
                points: p.points.map((pt) =>
                  pt.id === pointId
                    ? {
                        ...pt,
                        maintenanceDone: true,
                        doneAt: new Date().toISOString(),
                      }
                    : pt,
                ),
              }
            : p,
        ),
      );
      toast("Точка закрыта по ТО");
    },
    [toast],
  );

  const transferPointToRepair = useCallback(
    (partnerId: string, pointId: string) => {
      const partner = partners.find((p) => p.id === partnerId);
      const point = partner?.points.find((pt) => pt.id === pointId);
      if (!partner || !point) return;
      setPartners((prev) =>
        prev.map((p) =>
          p.id === partnerId
            ? {
                ...p,
                points: p.points.map((pt) =>
                  pt.id === pointId ? { ...pt, transferredToRepair: true } : pt,
                ),
              }
            : p,
        ),
      );
      // при переводе на ремонт создаётся обычная заявка
      setTickets((prev) => {
        const maxNum = Math.max(
          ...prev.map((t) => Number(t.number.replace("NX-", ""))),
        );
        const now = new Date();
        const ticket: Ticket = {
          id: `t-new-${pointId}`,
          number: `NX-${maxNum + 1}`,
          title: `Ремонт по итогам ТО: ${point.name}`,
          status: "new",
          priority: "P3",
          createdAt: now.toISOString(),
          deadline: new Date(now.getTime() + 24 * 3_600_000).toISOString(),
          client: {
            name: point.name,
            phone: "+7 (727) 300-00-00",
            address: point.address,
          },
          partnerId,
          equipment: "По результатам чек-листа ТО",
          description: `Точка «${point.name}» переведена из планового ТО в ремонт.`,
          attachments: [],
          usedParts: [],
          events: [
            makeEvent("system", "Заявка создана из модуля планового ТО"),
          ],
        };
        return [ticket, ...prev];
      });
      toast(`Точка «${point.name}» переведена на ремонт, создана заявка`);
    },
    [partners, toast],
  );

  const createShareLink = useCallback(
    (actId: string) => {
      const token = shareLinks[actId] ?? buildShareToken(actId);
      setShareLinks((prev) => ({ ...prev, [actId]: token }));
      return token;
    },
    [shareLinks],
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const uploadLicense = useCallback(() => {
    // Демо: никакой реальной валидации файла, просто UX-демонстрация
    setLicenseScenario("active");
    toast("Лицензия успешно обновлена");
  }, [toast]);

  const currentMasterId = ROLE_USER[role].masterId;

  const visibleTickets = useMemo(() => {
    if (role === "admin" || role === "manager") return tickets;
    return tickets.filter(
      (t) =>
        t.assigneeId === currentMasterId || t.proposedToId === currentMasterId,
    );
  }, [tickets, role, currentMasterId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: DemoContextValue = {
    role,
    setRole,
    currentUserName: ROLE_USER[role].name,
    currentMasterId,
    tickets,
    visibleTickets,
    changeTicketStatus,
    assignMaster,
    proposeMaster,
    acceptProposal,
    declineProposal,
    addComment,
    consumePart,
    closeTicket,
    parts,
    partners,
    closePoint,
    transferPointToRepair,
    acts,
    shareLinks,
    createShareLink,
    notifications,
    unreadCount,
    markAllRead,
    licenseScenario,
    setLicenseScenario,
    uploadLicense,
    toasts,
    toast,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
