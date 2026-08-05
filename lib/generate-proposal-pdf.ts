import { jsPDF } from "jspdf";
import type { Dictionary } from "@/lib/i18n";

const C = {
  blue: [54, 72, 241] as [number, number, number],
  blueDark: [36, 48, 196] as [number, number, number],
  ink: [17, 19, 24] as [number, number, number],
  gray: [100, 108, 122] as [number, number, number],
  soft: [245, 246, 250] as [number, number, number],
  line: [226, 229, 236] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let s = "";
  for (let i = 0; i < bytes.length; i += 1) s += String.fromCharCode(bytes[i]!);
  return btoa(s);
}

async function withFonts(doc: jsPDF) {
  const [regular, bold] = await Promise.all([
    fetch("/fonts/NotoSans-Regular.ttf").then((r) => r.arrayBuffer()),
    fetch("/fonts/NotoSans-Bold.ttf").then((r) => r.arrayBuffer()),
  ]);
  doc.addFileToVFS("NotoSans-Regular.ttf", toBase64(regular));
  doc.addFileToVFS("NotoSans-Bold.ttf", toBase64(bold));
  doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");
  doc.addFont("NotoSans-Bold.ttf", "NotoSans", "bold");
  doc.setFont("NotoSans", "normal");
}

type Ctx = {
  doc: jsPDF;
  pageW: number;
  pageH: number;
  m: number;
  w: number;
  y: number;
  lang: string;
  page: number;
};

function ensure(ctx: Ctx, need: number) {
  if (ctx.y + need < ctx.pageH - 22) return;
  drawFooter(ctx);
  ctx.doc.addPage();
  ctx.page += 1;
  ctx.y = ctx.m;
  drawPageChrome(ctx);
}

function drawPageChrome(ctx: Ctx) {
  const { doc, pageW } = ctx;
  doc.setFillColor(...C.blue);
  doc.rect(0, 0, pageW, 2.2, "F");
}

function drawFooter(ctx: Ctx) {
  const { doc, pageW, pageH, m, page, lang } = ctx;
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.3);
  doc.line(m, pageH - 16, pageW - m, pageH - 16);
  doc.setFont("NotoSans", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.gray);
  doc.text("Nexora Systems  ·  nexorasystems.kz", m, pageH - 10);
  doc.text(`${page}`, pageW - m, pageH - 10, { align: "right" });
  void lang;
}

function text(
  ctx: Ctx,
  value: string,
  opts: {
    x?: number;
    size?: number;
    bold?: boolean;
    color?: [number, number, number];
    maxW?: number;
    lh?: number;
  } = {},
) {
  const {
    x = ctx.m,
    size = 10,
    bold = false,
    color = C.ink,
    maxW = ctx.w,
    lh = size * 0.42,
  } = opts;
  ctx.doc.setFont("NotoSans", bold ? "bold" : "normal");
  ctx.doc.setFontSize(size);
  ctx.doc.setTextColor(...color);
  const lines = ctx.doc.splitTextToSize(value, maxW) as string[];
  ctx.doc.text(lines, x, ctx.y);
  ctx.y += lines.length * lh;
}

function sectionTitle(ctx: Ctx, title: string) {
  ensure(ctx, 16);
  ctx.y += 4;
  text(ctx, title, { size: 12, bold: true, color: C.ink, lh: 6 });
  ctx.y += 1;
  ctx.doc.setDrawColor(...C.blue);
  ctx.doc.setLineWidth(0.9);
  ctx.doc.line(ctx.m, ctx.y, ctx.m + 14, ctx.y);
  ctx.y += 7;
}

export async function downloadProposalPdf(dict: Dictionary, lang: string) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  await withFonts(doc);

  const ctx: Ctx = {
    doc,
    pageW: doc.internal.pageSize.getWidth(),
    pageH: doc.internal.pageSize.getHeight(),
    m: 22,
    w: 0,
    y: 0,
    lang,
    page: 1,
  };
  ctx.w = ctx.pageW - ctx.m * 2;

  const kk = lang === "kk";
  const date = new Date().toLocaleDateString(kk ? "kk-KZ" : "ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const directorName = dict.contact.director
    .replace(/^Руководитель:\s*/i, "")
    .replace(/^Басшы:\s*/i, "");

  // ─── Cover ───
  doc.setFillColor(...C.soft);
  doc.rect(0, 0, ctx.pageW, ctx.pageH, "F");

  doc.setFillColor(...C.blue);
  doc.rect(0, 0, 8, ctx.pageH, "F");

  ctx.y = 48;
  text(ctx, "NEXORA SYSTEMS", {
    size: 11,
    bold: true,
    color: C.blue,
    lh: 6,
  });
  ctx.y += 2;
  text(ctx, kk ? "Коммерциялық ұсыныс" : "Коммерческое предложение", {
    size: 9,
    color: C.gray,
    lh: 5,
  });
  ctx.y += 1;
  text(ctx, date, { size: 8, color: C.gray, lh: 5 });

  ctx.y += 14;
  text(ctx, dict.cover.title, {
    size: 20,
    bold: true,
    color: C.ink,
    lh: 8.5,
  });
  ctx.y += 6;
  text(ctx, dict.cover.subtitle, {
    size: 11,
    color: C.gray,
    lh: 5.8,
  });

  ctx.y += 18;
  doc.setFillColor(...C.blue);
  doc.roundedRect(ctx.m, ctx.y, 56, 10, 5, 5, "F");
  doc.setFont("NotoSans", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.white);
  doc.text(
    `${dict.pricing.amount} ${dict.pricing.currency}`,
    ctx.m + 28,
    ctx.y + 6.5,
    { align: "center" },
  );

  ctx.y += 22;
  text(ctx, dict.pricing.note, { size: 9, color: C.gray, lh: 4.8 });

  // Contact strip on cover
  ctx.y = ctx.pageH - 52;
  doc.setFillColor(...C.white);
  doc.roundedRect(ctx.m, ctx.y, ctx.w, 28, 3, 3, "F");
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.35);
  doc.roundedRect(ctx.m, ctx.y, ctx.w, 28, 3, 3, "S");

  ctx.y += 9;
  text(ctx, kk ? "Контакты" : "Контакты", {
    x: ctx.m + 6,
    size: 8,
    color: C.gray,
    lh: 4,
  });
  ctx.y += 1;
  text(ctx, directorName, {
    x: ctx.m + 6,
    size: 11,
    bold: true,
    color: C.ink,
    lh: 5.5,
  });
  text(ctx, dict.contact.phone, {
    x: ctx.m + 6,
    size: 11,
    bold: true,
    color: C.blue,
    lh: 5.5,
  });

  drawFooter(ctx);

  // ─── Page 2: content ───
  doc.addPage();
  ctx.page = 2;
  ctx.y = ctx.m + 6;
  drawPageChrome(ctx);

  // Problems — titles only, laconic
  sectionTitle(ctx, dict.problem.title);
  const problemCols = 2;
  const colW = (ctx.w - 6) / problemCols;
  let col = 0;
  let rowY = ctx.y;
  let maxRowY = ctx.y;

  dict.problem.items.forEach((item, i) => {
    const x = ctx.m + col * (colW + 6);
    const startY = rowY;

    doc.setFillColor(...C.soft);
    doc.roundedRect(x, startY, colW, 18, 2.5, 2.5, "F");

    doc.setFont("NotoSans", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...C.ink);
    const titleLines = doc.splitTextToSize(item.title, colW - 8) as string[];
    doc.text(titleLines, x + 4, startY + 7);

    doc.setFont("NotoSans", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...C.gray);
    // one short line only
    const short = doc.splitTextToSize(item.text, colW - 8) as string[];
    doc.text(short[0] ?? "", x + 4, startY + 13);

    maxRowY = Math.max(maxRowY, startY + 22);
    col += 1;
    if (col >= problemCols || i === dict.problem.items.length - 1) {
      col = 0;
      rowY = maxRowY;
    }
  });
  ctx.y = rowY + 2;

  // Benefits — compact checklist
  sectionTitle(ctx, dict.solution.title);
  dict.solution.items.forEach((item) => {
    ensure(ctx, 10);
    doc.setFillColor(...C.blue);
    doc.circle(ctx.m + 2.2, ctx.y - 1.2, 1.4, "F");
    doc.setFont("NotoSans", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...C.white);
    doc.text("✓", ctx.m + 2.2, ctx.y - 0.2, { align: "center" });

    doc.setFont("NotoSans", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...C.ink);
    doc.text(item.title, ctx.m + 7, ctx.y);
    ctx.y += 4.2;
    doc.setFont("NotoSans", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...C.gray);
    const lines = doc.splitTextToSize(item.text, ctx.w - 7) as string[];
    doc.text(lines.slice(0, 2), ctx.m + 7, ctx.y);
    ctx.y += Math.min(lines.length, 2) * 4 + 3.5;
  });

  // Pricing
  ensure(ctx, 55);
  sectionTitle(ctx, dict.pricing.title);

  doc.setFillColor(...C.blue);
  doc.roundedRect(ctx.m, ctx.y, ctx.w, 26, 3, 3, "F");
  doc.setFont("NotoSans", "normal");
  doc.setFontSize(8);
  doc.setTextColor(200, 210, 255);
  doc.text(dict.pricing.badge.toUpperCase(), ctx.m + 8, ctx.y + 9);
  doc.setFont("NotoSans", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...C.white);
  doc.text(
    `${dict.pricing.amount} ${dict.pricing.currency}`,
    ctx.m + 8,
    ctx.y + 19,
  );
  ctx.y += 32;

  // Two columns: included / not included
  ensure(ctx, 50);
  const half = (ctx.w - 8) / 2;
  const leftX = ctx.m;
  const rightX = ctx.m + half + 8;
  const blockTop = ctx.y;

  doc.setFont("NotoSans", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.ink);
  doc.text(dict.pricing.includedTitle, leftX, blockTop);
  doc.setTextColor(...C.gray);
  doc.text(dict.pricing.excludedTitle, rightX, blockTop);

  let yL = blockTop + 6;
  let yR = blockTop + 6;

  doc.setFont("NotoSans", "normal");
  doc.setFontSize(8);
  for (const item of dict.pricing.included) {
    doc.setTextColor(...C.blue);
    doc.text("+", leftX, yL);
    doc.setTextColor(...C.ink);
    const lines = doc.splitTextToSize(item, half - 5) as string[];
    doc.text(lines, leftX + 4, yL);
    yL += lines.length * 3.8 + 2;
  }
  for (const item of dict.pricing.excluded) {
    doc.setTextColor(...C.gray);
    doc.text("–", rightX, yR);
    const lines = doc.splitTextToSize(item, half - 5) as string[];
    doc.text(lines, rightX + 4, yR);
    yR += lines.length * 3.8 + 2;
  }
  ctx.y = Math.max(yL, yR) + 6;

  // Final contact
  ensure(ctx, 36);
  doc.setFillColor(...C.soft);
  doc.roundedRect(ctx.m, ctx.y, ctx.w, 30, 3, 3, "F");

  const cy = ctx.y + 9;
  doc.setFont("NotoSans", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.gray);
  doc.text(dict.contact.company, ctx.m + 7, cy);

  doc.setFont("NotoSans", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.ink);
  doc.text(directorName, ctx.m + 7, cy + 8);

  doc.setTextColor(...C.blue);
  doc.text(dict.contact.phone, ctx.m + 7, cy + 16);

  doc.setFont("NotoSans", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.gray);
  doc.text(dict.contact.geo, ctx.pageW - ctx.m - 7, cy + 8, { align: "right" });

  drawFooter(ctx);

  doc.save(
    kk
      ? "Nexora-kommerciyalyq-usynys.pdf"
      : "Nexora-kommercheskoe-predlozhenie.pdf",
  );
}
