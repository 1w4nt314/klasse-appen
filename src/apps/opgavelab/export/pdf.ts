// Opgavelab — PDF-eksport i browseren (jsPDF + svg2pdf.js, vektor med indlejret font).
// Bibliotekerne importeres først, når læreren klikker "Eksporter", så de ikke er en
// del af sidens første JavaScript. Fonten er den samme TTF, som skærmen bruger
// (public/fonts), så tekstbredder og text-anchor stemmer.

import { FONT_FAMILY } from "../render/measure";

const FONT_FILES = [
  { file: "DejaVuSans.ttf", style: "normal", psName: "DejaVuSans" },
  { file: "DejaVuSans-Bold.ttf", style: "bold", psName: "DejaVuSans-Bold" },
] as const;

type FontData = { file: string; style: "normal" | "bold"; psName: string; base64: string };

let fontCache: Promise<FontData[]> | null = null;

function toBase64(buf: Uint8Array): string {
  let bin = "";
  // I bidder á 32 KB, så String.fromCharCode ikke sprænger argumentgrænsen.
  for (let i = 0; i < buf.length; i += 0x8000) {
    bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

/** Henter begge fontsnit én gang pr. sideindlæsning (en fejl prøves igen næste gang). */
function loadFonts(): Promise<FontData[]> {
  if (!fontCache) {
    fontCache = Promise.all(
      FONT_FILES.map(async ({ file, style, psName }) => {
        const res = await fetch(`/fonts/${file}`);
        if (!res.ok) throw new Error(`Font ${file}: HTTP ${res.status}`);
        return { file, style, psName, base64: toBase64(new Uint8Array(await res.arrayBuffer())) };
      }),
    );
    fontCache.catch(() => {
      fontCache = null;
    });
  }
  return fontCache;
}

let libCache: Promise<[typeof import("jspdf"), typeof import("svg2pdf.js")]> | null = null;

function loadLibs() {
  if (!libCache) {
    libCache = Promise.all([import("jspdf"), import("svg2pdf.js")]);
    libCache.catch(() => {
      libCache = null;
    });
  }
  return libCache;
}

/** Henter biblioteker og fontbytes (kan kaldes tidligt for at varme op). */
export function preparePdfExport(): Promise<void> {
  return Promise.all([loadLibs(), loadFonts()]).then(() => undefined);
}

// Kontroltegn og tegn, der ikke må stå i filnavne på Windows/macOS.
const BAD_CHARS = /[\\/:*?"<>|\u0000-\u001f\u007f-\u009f]/g;

/** "Trekanter: 7.b" → "Trekanter 7.b"; tomt → "opgave". Højst 80 tegn. */
export function safeFileName(name: string): string {
  const s = name
    .normalize("NFC")
    .replace(BAD_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80)
    .trim()
    // Windows tillader ikke punktum eller mellemrum sidst i et filnavn.
    .replace(/[. ]+$/, "");
  return s || "opgave";
}

export type PdfFiles = {
  opgave: { fileName: string; blob: Blob };
  svarark: { fileName: string; blob: Blob };
};

async function renderPdf(svg: SVGSVGElement, fonts: FontData[], title: string): Promise<Blob> {
  const [{ jsPDF }, { svg2pdf }] = await loadLibs();
  // putOnlyUsedFonts: ellers lister PDF'en også jsPDFs 14 standardfonte (ubrugte, ikke indlejrede).
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true, putOnlyUsedFonts: true });
  doc.setProperties({ title, creator: "Opgavelab" });
  for (const f of fonts) {
    // addFileToVFS gælder pr. jsPDF-instans.
    doc.addFileToVFS(f.file, f.base64);
    doc.addFont(f.file, FONT_FAMILY, f.style);
  }
  doc.setFont(FONT_FAMILY, "normal");
  await svg2pdf(svg, doc, { x: 0, y: 0, width: 210, height: 297 });
  // jsPDF skriver familienavnet som BaseFont for begge snit. Giv dem fontenes egne
  // PostScript-navne, så PDF-læsere (og pdffonts) viser DejaVuSans / DejaVuSans-Bold.
  // Opslag sker via jsPDFs fontmap (stadig "OpgavelabSans"), så tegningen er upåvirket.
  for (const f of fonts) {
    doc.setFont(FONT_FAMILY, f.style);
    doc.getFont().fontName = f.psName;
  }
  return doc.output("blob");
}

/** Laver opgave- og svarark-PDF ud fra to monterede eksport-SVG'er (uden editor-overlay). */
export async function buildPdfs({
  opgaveSvg,
  svarSvg,
  name,
}: {
  opgaveSvg: SVGSVGElement;
  svarSvg: SVGSVGElement;
  name: string;
}): Promise<PdfFiles> {
  const [fonts] = await Promise.all([loadFonts(), loadLibs()]);
  const safe = safeFileName(name);
  const opgave = await renderPdf(opgaveSvg, fonts, safe);
  const svarark = await renderPdf(svarSvg, fonts, `${safe} – svarark`);
  return {
    opgave: { fileName: `${safe}.pdf`, blob: opgave },
    svarark: { fileName: `${safe}_svarark.pdf`, blob: svarark },
  };
}

/** Starter en download af en Blob med et bestemt filnavn. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Browseren skal nå at starte downloaden, før adressen frigives.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/** Henter begge filer: opgaven først, så svararket ~0,5 s efter. */
export async function downloadBoth(files: PdfFiles): Promise<void> {
  downloadBlob(files.opgave.blob, files.opgave.fileName);
  await sleep(500);
  downloadBlob(files.svarark.blob, files.svarark.fileName);
}
