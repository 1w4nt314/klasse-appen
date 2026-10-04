import { headers } from "next/headers";

const isProduction = () => process.env.NODE_ENV === "production";

/** Sitets offentlige adresse fra miljøet: APP_URL, ellers RENDER_EXTERNAL_URL (sættes af Render). */
const configuredUrl = () =>
  (process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || "").replace(/\/+$/, "") || null;

/**
 * Mails sendes via Resend, når RESEND_API_KEY og EMAIL_FROM er sat (fx på
 * Render). Uden dem sendes intet, og e-mailbekræftelse og "glemt
 * adgangskode" er slået fra. I produktion kræves også en fast adresse til
 * links (se appUrl).
 */
export const emailEnabled = () =>
  Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM && (configuredUrl() || !isProduction()));

/**
 * Adressen i links i mails. I produktion KUN fra miljøet — aldrig fra
 * Host-headeren, som en angriber selv kan sætte (så ville nulstil-linket pege
 * på hans server). Lokalt bruges Host-headeren som nødløsning.
 */
export async function appUrl() {
  const fromEnv = configuredUrl();
  if (fromEnv) return fromEnv;
  if (isProduction()) throw new Error("APP_URL mangler — kan ikke lave links i mails.");
  return `http://${(await headers()).get("host") ?? "localhost:3000"}`;
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
    // Links må aldrig havne i produktionens log — de giver adgang til kontoen.
    console.info(
      isProduction()
        ? `[mail] Ikke sendt (mail er ikke sat op): ${subject}`
        : `[mail] Ikke sendt (mail er ikke sat op) — til ${to}: ${subject}\n${body.text}`,
    );
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
