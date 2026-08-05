import { NextResponse } from "next/server";

function isValidKzPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return /^77\d{9}$/.test(digits);
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 11) return value;
  return `+${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      phone?: string;
      source?: string;
      lang?: string;
    };

    const phone = (body.phone ?? "").trim();
    if (!isValidKzPhone(phone)) {
      return NextResponse.json(
        { ok: false, error: "invalid_phone" },
        { status: 400 },
      );
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Telegram env vars are missing");
      return NextResponse.json(
        { ok: false, error: "server_misconfigured" },
        { status: 500 },
      );
    }

    const nicePhone = formatPhone(phone);
    const when = new Date().toLocaleString("ru-RU", {
      timeZone: "Asia/Almaty",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const text = [
      "🆕 Новая заявка с сайта Nexora",
      "",
      `📞 Телефон: ${nicePhone}`,
      `🌐 Источник: ${body.source || "nexorasystems.kz / form"}`,
      `🗣 Язык: ${body.lang === "kk" ? "Қазақша" : "Русский"}`,
      `🕒 ${when} (Алматы)`,
    ].join("\n");

    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
          disable_notification: false,
        }),
      },
    );

    const tgData = (await tgRes.json()) as { ok?: boolean; description?: string };

    if (!tgRes.ok || !tgData.ok) {
      console.error("Telegram send failed", tgData);
      return NextResponse.json(
        { ok: false, error: "telegram_failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead API error", err);
    return NextResponse.json(
      { ok: false, error: "unexpected" },
      { status: 500 },
    );
  }
}
