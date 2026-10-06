// Opgavelab — formelblok: en sikker lommeregner til ét regnestykke pr. linje.
//
// SIKKERHED: linjen fortolkes ALDRIG som kode (ingen eval, Function, objektopslag på
// brugerens tekst e.l.). Tokenizeren kender kun tal og et fast sæt regnetegn — alt andet er en
// fejl — og parseren er en recursive descent med grænser for længde (80 tegn), dybde (32),
// tal (1e12), eksponent (|e| ≤ 64) og resultat. Værdien regnes under parsingen (ingen AST).
// evaluate() kaster aldrig: den returnerer altid et objekt med enten facit eller en dansk fejl.
//
// Ingen runtime-imports (kun `import type`), så filen kan køres i Node med
// --experimental-strip-types.

/** Længste linje (tegn); samme som LIMITS.formulaLineChars (core-filer må ikke importere model/types ved runtime). */
export const FORMULA_MAX_CHARS = 80;
/** Største dybde (parenteser, fortegn, rødder og potenser inden i hinanden). */
export const FORMULA_MAX_DEPTH = 32;
/** Største tal, der må skrives. */
export const FORMULA_MAX_NUMBER = 1e12;
/** Største eksponent (absolut værdi). */
export const FORMULA_MAX_EXPONENT = 64;
/** Største resultat (absolut værdi), der vises. */
export const FORMULA_MAX_RESULT = 1e15;
/** Højst så mange decimaler i facit (0–4; FormulaObject.decimals, standard 2). */
export const FORMULA_DECIMALS_MAX = 4;

export type FormulaResult =
  | {
      ok: true;
      /** Linjen i dansk notation uden "=", fx "3 · (4 + 5)". */
      pretty: string;
      /** Værdien afrundet til 12 betydende cifre (0,1 + 0,2 = 0,3). */
      value: number;
      /** Facit med højst `decimals` decimaler og kun de nødvendige, fx "27", "2,5", "3,14". */
      result: string;
      /** true: facit er afrundet → vis "≈" i stedet for "=". */
      approx: boolean;
      /** true: der stod tekst efter "=" (fx et svar), som ikke bruges. */
      ignored: boolean;
    }
  | {
      ok: false;
      pretty: string;
      /** Dansk fejltekst, fx "Ukendt tegn '&' (plads 5)". */
      error: string;
      /** Plads (1-baseret tegn i linjen), 0 når fejlen ikke har en plads. */
      pos: number;
      ignored: boolean;
    };

/** Normaliserede tokens. "−" er både minus og fortegn (afgøres af parseren). */
type Kind = "num" | "pi" | "+" | "−" | "·" | ":" | "/" | "^" | "²" | "³" | "sup" | "(" | ")" | "√";
type Token = { k: Kind; text: string; pos: number; value: number };

/** Intern fejl; fanges altid i evaluate(). */
class Fail {
  readonly msg: string;
  readonly pos: number;
  constructor(msg: string, pos: number) {
    this.msg = msg;
    this.pos = pos;
  }
}

/** Afsluttende "=" og mellemrum fjernes ("3 · 4 =" → "3 · 4"). */
function stripEquals(line: string): string {
  return line.replace(/[\s=]+$/u, "");
}

/**
 * Stykket er teksten før det første "="; det efter (fx et svar: "(2 + 3) = 5") bruges ikke.
 * Pladserne i fejltekster passer stadig, fordi stykket er starten af linjen.
 */
function splitEquals(line: string): { text: string; ignored: boolean } {
  const i = line.indexOf("=");
  if (i < 0) return { text: line, ignored: false };
  return { text: line.slice(0, i), ignored: /[^\s=]/u.test(line.slice(i + 1)) };
}

/** Hævede cifre: ⁰ ¹ ⁴ … ⁹ (² og ³ har deres egne tokens). Fast tabel, intet opslag på brugerens tekst. */
const SUPERSCRIPT = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
function superDigit(ch: string): number {
  switch (ch) {
    case "⁰":
      return 0;
    case "¹":
      return 1;
    case "⁴":
      return 4;
    case "⁵":
      return 5;
    case "⁶":
      return 6;
    case "⁷":
      return 7;
    case "⁸":
      return 8;
    case "⁹":
      return 9;
    default:
      return -1;
  }
}
const isPost = (k: Kind) => k === "²" || k === "³" || k === "sup";

/** Et tegn til en fejltekst: usynlige tegn og kontroltegn vises som U+XXXX. */
function showChar(ch: string): string {
  const cp = ch.codePointAt(0) ?? 0;
  return /^[\p{L}\p{N}\p{P}\p{S}]$/u.test(ch) ? `'${ch}'` : `(U+${cp.toString(16).toUpperCase().padStart(4, "0")})`;
}

/** Ét tegn → token-type (et fast sæt; aldrig et objektopslag på brugerens tekst). */
function symbol(ch: string): Kind | null {
  switch (ch) {
    case "+":
      return "+";
    case "−":
    case "-":
      return "−";
    case "·":
    case "*":
    case "×":
      return "·";
    case ":":
    case "÷":
      return ":";
    case "/":
      return "/";
    case "^":
      return "^";
    case "²":
      return "²";
    case "³":
      return "³";
    case "(":
      return "(";
    case ")":
      return ")";
    case "√":
      return "√";
    case "π":
      return "pi";
    default:
      return null;
  }
}

const isDigit = (ch: string | undefined) => ch !== undefined && ch >= "0" && ch <= "9";

/**
 * Et punktum i et tal (chars[i] === "."). Ligner det et tusindtalspunktum ("1.000", "12.500.000": 1–3 cifre
 * og derefter grupper på præcis 3 cifre), forklares det med tallet skrevet rigtigt; ellers er det et
 * decimalpunktum ("2.5").
 */
function dotFail(chars: string[], i: number, before: string): Fail {
  const pos = i + 1;
  if (/^[0-9]{1,3}$/.test(before)) {
    let j = i;
    let digits = before;
    while (chars[j] === "." && isDigit(chars[j + 1]) && isDigit(chars[j + 2]) && isDigit(chars[j + 3]) && !isDigit(chars[j + 4])) {
      digits += chars[j + 1] + chars[j + 2] + chars[j + 3];
      j += 4;
    }
    if (j > i && chars[j] !== ".") {
      // "1.000,5" → "1000,5" (decimalkommaet er rigtigt).
      let k = j;
      if (chars[k] === "," && isDigit(chars[k + 1])) {
        k++;
        while (isDigit(chars[k])) k++;
      }
      return new Fail(`Skriv tallet uden tusindtalspunktum: ${digits}${chars.slice(j, k).join("")} (plads ${pos})`, pos);
    }
  }
  return new Fail(`Brug komma som decimaltegn (plads ${pos})`, pos);
}

function tokenize(text: string): Token[] {
  const chars = Array.from(text);
  const out: Token[] = [];
  let i = 0;
  while (i < chars.length) {
    const ch = chars[i];
    const pos = i + 1;
    if (/^\s$/u.test(ch)) {
      i++;
      continue;
    }
    if (isDigit(ch)) {
      let s = "";
      while (isDigit(chars[i])) s += chars[i++];
      if (chars[i] === ",") {
        if (!isDigit(chars[i + 1])) throw new Fail(`Der mangler et ciffer efter kommaet (plads ${i + 1})`, i + 1);
        s += ",";
        i++;
        while (isDigit(chars[i])) s += chars[i++];
      }
      if (chars[i] === ".") throw dotFail(chars, i, s);
      const value = Number(s.replace(",", "."));
      if (!(value <= FORMULA_MAX_NUMBER)) throw new Fail(`Tallet er for stort (højst 1.000.000.000.000) (plads ${pos})`, pos);
      out.push({ k: "num", text: s, pos, value });
      continue;
    }
    if (ch === ".") throw dotFail(chars, i, "");
    const sup = superDigit(ch);
    if (sup >= 0) {
      // Flere hævede cifre efter hinanden ("2¹⁰") ville blive læst som (2¹)⁰: bed om ^ i stedet.
      const prev = out[out.length - 1];
      if (prev && isPost(prev.k)) throw new Fail(`Skriv potensen med ^ (fx 2^10) (plads ${pos})`, pos);
      out.push({ k: "sup", text: ch, pos, value: sup });
      i++;
      continue;
    }
    const k = symbol(ch);
    if (k === null) throw new Fail(`Ukendt tegn ${showChar(ch)} (plads ${pos})`, pos);
    if ((k === "²" || k === "³") && out.length > 0 && out[out.length - 1].k === "sup")
      throw new Fail(`Skriv potensen med ^ (fx 2^10) (plads ${pos})`, pos);
    out.push({ k, text: ch, pos, value: 0 });
    i++;
  }
  return out;
}

/**
 * "^" med et lille heltal (0–9) skrives hævet: "2^4" → "2⁴", "2^2" → "2²". Kun når potensen står alene, så
 * værdien er uændret og notationen entydig: ikke når der står en ny potens lige efter (2^3^2 = 2^(3^2) må
 * ikke blive (2³)², og 2^3² = 2^9), ikke inde i en ^-kæde (2^4^2 forbliver 2^4^2, ikke 2^4²), og ikke efter
 * en hævet potens (2⁴^2 ville blive "2⁴²", som ikke kan læses).
 */
function raiseExponents(tokens: Token[]): Token[] {
  const out: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const n = tokens[i + 1];
    const after = tokens[i + 2];
    const base = tokens[i - 1];
    const beforeBase = tokens[i - 2];
    const inChain = (after && (after.k === "^" || isPost(after.k))) || (beforeBase && beforeBase.k === "^") || (base && isPost(base.k));
    if (t.k === "^" && n && n.k === "num" && /^[0-9]$/.test(n.text) && !inChain) {
      const d = n.value;
      out.push({ k: d === 2 ? "²" : d === 3 ? "³" : "sup", text: SUPERSCRIPT[d], pos: t.pos, value: d });
      i++;
      continue;
    }
    out.push(t);
  }
  return out;
}

/** Tegnet, som tokenet skrives med i dansk notation. */
function canonical(t: Token): string {
  return t.k === "num" || t.k === "sup" ? t.text : t.k === "pi" ? "π" : t.k;
}

const BINARY: ReadonlySet<Kind> = new Set<Kind>(["+", "−", "·", ":", "/"]);

/**
 * Tokenerne skrevet i dansk notation: mellemrum om regnetegnene, intet efter fortegn, "√" og
 * "(" og intet før ")", "²", "³", "⁴" …; "^" uden mellemrum, og "^" + ét ciffer hævet (raiseExponents).
 * "3*(4+5)" → "3 · (4 + 5)". Gen-tokenisering giver de samme tokens, så prettyfy(prettyfy(x)) = prettyfy(x).
 */
function prettify(raw: Token[]): string {
  const tokens = raiseExponents(raw);
  let out = "";
  let prev: Token | null = null;
  let prevUnary = false;
  for (const t of tokens) {
    // Et minus er et fortegn, når der ikke står et tal/π/")"/"²"/"³" foran.
    const unary = t.k === "−" && (prev === null || prev.k === "(" || prev.k === "^" || prev.k === "√" || BINARY.has(prev.k));
    const binary = BINARY.has(t.k) && !unary;
    if (prev !== null) {
      const prevBinary = BINARY.has(prev.k) && !prevUnary;
      let space: boolean;
      if (binary || prevBinary) space = true;
      else if (t.k === "^" || prev.k === "^" || prev.k === "(" || t.k === ")" || prev.k === "√" || prevUnary) space = false;
      else if (isPost(t.k)) space = false;
      else space = true; // to tal/udtryk efter hinanden (fejl, men læsbart)
      if (space) out += " ";
    }
    out += canonical(t);
    prev = t;
    prevUnary = unary;
  }
  return out;
}

/** Recursive descent med evaluering undervejs. Kaster kun Fail. */
function run(tokens: Token[], endPos: number): number {
  let i = 0;
  let depth = 0;
  const peek = (): Token | undefined => tokens[i];

  const enter = (t: Token | undefined) => {
    depth++;
    if (depth > FORMULA_MAX_DEPTH) {
      const pos = t?.pos ?? endPos;
      throw new Fail(t?.k === "(" ? `For mange parenteser (plads ${pos})` : `Udtrykket er for indviklet (plads ${pos})`, pos);
    }
  };
  const check = (v: number, at: Token): number => {
    if (Number.isNaN(v)) throw new Fail(`Kan ikke regnes ud (plads ${at.pos})`, at.pos);
    if (!Number.isFinite(v)) throw new Fail(`Tallet bliver for stort (plads ${at.pos})`, at.pos);
    return v;
  };
  const leftover = (t: Token): Fail =>
    t.k === ")" ? new Fail(`Der er en ) for meget (plads ${t.pos})`, t.pos) : new Fail(`Der mangler et regnetegn før '${canonical(t)}' (plads ${t.pos})`, t.pos);

  function expr(): number {
    let v = term();
    for (let t = peek(); t && (t.k === "+" || t.k === "−"); t = peek()) {
      i++;
      const r = term();
      v = check(t.k === "+" ? v + r : v - r, t);
    }
    return v;
  }

  function term(): number {
    let v = unary();
    for (let t = peek(); t && (t.k === "·" || t.k === ":" || t.k === "/"); t = peek()) {
      i++;
      const r = unary();
      if (t.k !== "·" && r === 0) throw new Fail(`Division med nul (plads ${t.pos})`, t.pos);
      v = check(t.k === "·" ? v * r : v / r, t);
    }
    return v;
  }

  function unary(): number {
    const t = peek();
    enter(t);
    let v: number;
    if (t && t.k === "−") {
      i++;
      v = -unary();
    } else v = power();
    depth--;
    return v;
  }

  function power(): number {
    const base = postfix();
    const t = peek();
    if (!t || t.k !== "^") return base;
    i++;
    const e = unary();
    // Som ² og ³ (så "2^2" og "2²" giver præcis samme tal).
    if (e === 2) return check(base * base, t);
    if (e === 3) return check(base * base * base, t);
    if (Math.abs(e) > FORMULA_MAX_EXPONENT) throw new Fail(`Eksponenten er for stor (højst ${FORMULA_MAX_EXPONENT}) (plads ${t.pos})`, t.pos);
    if (base === 0 && e < 0) throw new Fail(`Division med nul (plads ${t.pos})`, t.pos);
    return check(Math.pow(base, e), t);
  }

  function postfix(): number {
    let v = primary();
    for (let t = peek(); t && isPost(t.k); t = peek()) {
      i++;
      v = check(t.k === "²" ? v * v : t.k === "³" ? v * v * v : Math.pow(v, t.value), t);
    }
    return v;
  }

  function primary(): number {
    const t = peek();
    if (!t) throw new Fail("Uventet slutning — der mangler et tal", endPos);
    if (t.k === "num") {
      i++;
      return t.value;
    }
    if (t.k === "pi") {
      i++;
      return Math.PI;
    }
    if (t.k === "(") {
      i++;
      const v = expr();
      const c = peek();
      if (!c) throw new Fail("Der mangler en parentes", endPos);
      if (c.k !== ")") throw leftover(c);
      i++;
      return v;
    }
    if (t.k === "√") {
      i++;
      enter(peek());
      const v = primary();
      depth--;
      if (v < 0) throw new Fail(`Kvadratroden af et negativt tal kan ikke regnes ud (plads ${t.pos})`, t.pos);
      return Math.sqrt(v);
    }
    throw t.k === ")"
      ? new Fail(`Der mangler et tal før ) (plads ${t.pos})`, t.pos)
      : new Fail(`Der mangler et tal før '${canonical(t)}' (plads ${t.pos})`, t.pos);
  }

  const v = expr();
  const rest = peek();
  if (rest) throw leftover(rest);
  return v;
}

/** x med 12 betydende cifre (fjerner flydende-tals-støj som 0,30000000000000004). */
function sig12(x: number): number {
  if (x === 0) return 0;
  return Number(x.toExponential(11));
}

/** x afrundet til d decimaler (halve væk fra nul), uden ×10^d-støj: skifter via eksponenten. */
function roundDec(x: number, d: number): number {
  if (x === 0) return 0;
  const sign = x < 0 ? -1 : 1;
  const [mant, exp] = Math.abs(x).toExponential(14).split("e");
  const shifted = Number(`${mant}e${Number(exp) + d}`);
  const r = Math.round(shifted);
  return sign * Number(`${r}e${-d}`);
}

const formatters = new Map<number, Intl.NumberFormat>();
/** Tal med d decimaler, decimalkomma, punktum som tusindtalsseparator og U+2212-minus. */
function fmt(x: number, d: number): string {
  let f = formatters.get(d);
  if (!f) {
    f = new Intl.NumberFormat("da-DK", { minimumFractionDigits: d, maximumFractionDigits: d });
    formatters.set(d, f);
  }
  const text = f.format(Math.abs(x));
  return x < 0 && /[1-9]/.test(text) ? `−${text}` : text;
}

/**
 * Regn én linje ud. Kaster aldrig.
 * @param decimals højst så mange decimaler i facit (0–4); kun de nødvendige vises.
 */
export function evaluate(line: string, decimals: number): FormulaResult {
  const raw = typeof line === "string" ? line : "";
  const d = Number.isInteger(decimals) && decimals >= 0 && decimals <= FORMULA_DECIMALS_MAX ? decimals : 2;
  if (raw.length > FORMULA_MAX_CHARS) {
    const cut = stripEquals(raw.slice(0, FORMULA_MAX_CHARS)).replace(/\s+/gu, " ").trim();
    return { ok: false, pretty: `${cut}…`, error: `Linjen er for lang (højst ${FORMULA_MAX_CHARS} tegn)`, pos: 0, ignored: false };
  }
  const { text, ignored } = splitEquals(raw);
  let tokens: Token[];
  try {
    tokens = tokenize(text);
  } catch (e) {
    const pretty = text.replace(/\s+/gu, " ").trim();
    // "A = 2 + 3": et navn før "=" og stykket efter. Kun bogstaver (og tal efter første bogstav) før "=".
    const name = ignored && /^\s*\p{L}[\p{L}\p{N} ]*$/u.test(text) ? pretty : null;
    if (name !== null && e instanceof Fail && /^Ukendt tegn/.test(e.msg))
      return { ok: false, pretty, error: `Skriv kun selve regnestykket — uden "${name} =" foran`, pos: 1, ignored };
    return e instanceof Fail ? { ok: false, pretty, error: e.msg, pos: e.pos, ignored } : { ok: false, pretty, error: "Kan ikke regnes ud", pos: 0, ignored };
  }
  const pretty = prettify(tokens);
  if (tokens.length === 0) return { ok: false, pretty, error: "Udtrykket er tomt", pos: 0, ignored };
  try {
    const exact = run(tokens, Array.from(text).length + 1);
    const value = sig12(exact);
    if (Math.abs(value) > FORMULA_MAX_RESULT) return { ok: false, pretty, error: "Resultatet er for stort til at blive vist", pos: 0, ignored };
    const rounded = roundDec(value, d);
    // Færrest nødvendige decimaler: 27 → "27", 2,50 → "2,5".
    let k = 0;
    while (k < d && roundDec(rounded, k) !== rounded) k++;
    return { ok: true, pretty, value, result: fmt(rounded, k), approx: rounded !== value, ignored };
  } catch (e) {
    return e instanceof Fail ? { ok: false, pretty, error: e.msg, pos: e.pos, ignored } : { ok: false, pretty, error: "Kan ikke regnes ud", pos: 0, ignored };
  }
}

/** Linjerne i en formelblok, der er stykker (tomme linjer springes over). */
export function formulaItems(lines: readonly string[]): string[] {
  return lines.filter((l) => l.trim() !== "");
}
