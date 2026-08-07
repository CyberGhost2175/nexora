"use client";

import { EQUIPMENT_CATEGORIES, FAULT_TYPES } from "@/demo-data/directories";
import type { DirectoryItem } from "@/lib/types";
import { Button, Card, PageHeader } from "@/components/ui";
import { useDemo } from "@/lib/store";

function DirectoryCard({
  title,
  items,
}: {
  title: string;
  items: DirectoryItem[];
}) {
  const { toast } = useDemo();
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <span className="text-sm font-semibold">{title}</span>
        <Button variant="secondary" onClick={() => toast("Создание записей доступно в полной версии")}>
          + Добавить
        </Button>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b border-slate-50 px-4 py-2.5 last:border-0"
        >
          <span className="text-sm">{item.name}</span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            {item.count} исп.
          </span>
        </div>
      ))}
    </Card>
  );
}

export default function DirectoriesPage() {
  return (
    <div>
      <PageHeader
        title="Справочники"
        subtitle="Номенклатура системы: категории оборудования и типы неисправностей"
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <DirectoryCard title="Категории оборудования" items={EQUIPMENT_CATEGORIES} />
        <DirectoryCard title="Типы неисправностей" items={FAULT_TYPES} />
      </div>
    </div>
  );
}
