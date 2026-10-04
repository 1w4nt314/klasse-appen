import { headers } from "next/headers";

/**
 * Mails sendes via Resend, når RESEND_API_KEY og EMAIL_FROM er sat (fx på
 * Render). Uden dem sendes intet: linket skrives i serverloggen, og
 * e-mailbekræftelse ved oprettelse er slået fra.
 */
export const emailEnabled = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

/**
 * Sitets offentlige adresse til links i mails. APP_URL vinder; ellers
 * RENDER_EXTERNAL_URL (sættes af Render), og lokalt Host-headeren.
 */
export async function appUrl() {
  const fromEnv = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  const host = (await headers()).get("host") ?? "localhost:3000";
  return `http://${host}`;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Enkel mail med én knap. Al tekst escapes. */
export function linkMail({ greeting, lines, button, link, footer }: {
  greeting: string;
  lines: string[];
  button: string;
  link: string;
  footer: string;
}) {
  const p = (t: string) => `<p style="margin:0 0 14px">${escapeHtml(t)}</p>`;
  const html = `<!doctype html><html lang="da"><body style="margin:0;background:#f5f4f0;font-family:Arial,Helvetica,sans-serif;color:#1d2433">
<div style="max-width:480px;margin:0 auto;padding:32px 20px">
<div style="background:#ffffff;border:1px solid #e3e1da;border-radius:12px;padding:28px">
<p style="margin:0 0 18px;font-weight:bold;font-size:18px">Klasse-appen</p>
${p(greeting)}${lines.map(p).join("")}
<p style="margin:22px 0"><a href="${escapeHtml(link)}" style="display:inline-block;background:#1a4f8b;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:8px">${escapeHtml(button)}</a></p>
<p style="margin:0 0 14px;font-size:13px;color:#5d6475">Virker knappen ikke, så kopiér adressen ind i browseren:<br><span style="word-break:break-all">${escapeHtml(link)}</span></p>
<p style="margin:0;font-size:13px;color:#5d6475">${escapeHtml(footer)}</p>
</div></div></body></html>`;
  const text = [greeting, "", ...lines, "", `${button}: ${link}`, "", footer].join("\n");
  return { html, text };
}

/**
 * Send en mail. Fejler aldrig udadtil — fejl logges, så en nede mailtjeneste
 * ikke vælter siden (og svartiden ikke afslører, om modtageren findes).
 */
export async function sendMail(to: string, subject: string, body: { html: string; text: string }) {
  if (!emailEnabled()) {
    console.info(`[mail] Ikke sendt (RESEND_API_KEY/EMAIL_FROM mangler) — til ${to}: ${subject}\n${body.text}`);
    return;
  }
  try {
    // RESEND_API_URL kun til test mod en lokal attrap.
    const res = await fetch(process.env.RESEND_API_URL || "https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [to], subject, ...body }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error(`[mail] Resend svarede ${res.status}: ${await res.text()}`);
  } catch (err) {
    console.error("[mail] Kunne ikke sende:", err);
  }
}
