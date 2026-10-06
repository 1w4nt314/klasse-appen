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
    }
  | {
      ok: false;
      pretty: string;
      /** Dansk fejltekst, fx "Ukendt tegn '&' (plads 5)". */
      error: string;
      /** Plads (1-baseret tegn i linjen), 0 når fejlen ikke har en plads. */
      pos: number;
    };

/** Normaliserede tokens. "−" er både minus og fortegn (afgøres af parseren). */
type Kind = "num" | "pi" | "+" | "−" | "·" | ":" | "/" | "^" | "²" | "³" | "(" | ")" | "√";
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
      if (chars[i] === ".") throw new Fail(`Brug komma som decimaltegn (plads ${i + 1})`, i + 1);
      const value = Number(s.replace(",", "."));
      if (!(value <= FORMULA_MAX_NUMBER)) throw new Fail(`Tallet er for stort (højst 1.000.000.000.000) (plads ${pos})`, pos);
      out.push({ k: "num", text: s, pos, value });
      continue;
    }
    if (ch === ".") throw new Fail(`Brug komma som decimaltegn (plads ${pos})`, pos);
    const k = symbol(ch);
    if (k === null) throw new Fail(`Ukendt tegn ${showChar(ch)} (plads ${pos})`, pos);
    out.push({ k, text: ch, pos, value: 0 });
    i++;
  }
  return out;
}

/** Tegnet, som tokenet skrives med i dansk notation. */
function canonical(t: Token): string {
  return t.k === "num" ? t.text : t.k === "pi" ? "π" : t.k;
}

const BINARY: ReadonlySet<Kind> = new Set<Kind>(["+", "−", "·", ":", "/"]);

/**
 * Tokenerne skrevet i dansk notation: mellemrum om regnetegnene, intet efter fortegn, "√" og
 * "(" og intet før ")", "²", "³"; "^" uden mellemrum. "3*(4+5)" → "3 · (4 + 5)".
 * Gen-tokenisering giver de samme tokens, så prettyfy(prettyfy(x)) = prettyfy(x).
 */
function prettify(tokens: Token[]): string {
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
      else if (t.k === "²" || t.k === "³") space = false;
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
    if (Math.abs(e) > FORMULA_MAX_EXPONENT) throw new Fail(`Eksponenten er for stor (højst ${FORMULA_MAX_EXPONENT}) (plads ${t.pos})`, t.pos);
    if (base === 0 && e < 0) throw new Fail(`Division med nul (plads ${t.pos})`, t.pos);
    return check(Math.pow(base, e), t);
  }

  function postfix(): number {
    let v = primary();
    for (let t = peek(); t && (t.k === "²" || t.k === "³"); t = peek()) {
      i++;
      v = check(t.k === "²" ? v * v : v * v * v, t);
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
    return { ok: false, pretty: `${cut}…`, error: `Linjen er for lang (højst ${FORMULA_MAX_CHARS} tegn)`, pos: 0 };
  }
  const text = stripEquals(raw);
  let tokens: Token[];
  try {
    tokens = tokenize(text);
  } catch (e) {
    const pretty = text.replace(/\s+/gu, " ").trim();
    return e instanceof Fail ? { ok: false, pretty, error: e.msg, pos: e.pos } : { ok: false, pretty, error: "Kan ikke regnes ud", pos: 0 };
  }
  const pretty = prettify(tokens);
  if (tokens.length === 0) return { ok: false, pretty, error: "Udtrykket er tomt", pos: 0 };
  try {
    const exact = run(tokens, Array.from(text).length + 1);
    const value = sig12(exact);
    if (Math.abs(value) > FORMULA_MAX_RESULT) return { ok: false, pretty, error: "Resultatet er for stort til at blive vist", pos: 0 };
    const rounded = roundDec(value, d);
    // Færrest nødvendige decimaler: 27 → "27", 2,50 → "2,5".
    let k = 0;
    while (k < d && roundDec(rounded, k) !== rounded) k++;
    return { ok: true, pretty, value, result: fmt(rounded, k), approx: rounded !== value };
  } catch (e) {
    return e instanceof Fail ? { ok: false, pretty, error: e.msg, pos: e.pos } : { ok: false, pretty, error: "Kan ikke regnes ud", pos: 0 };
  }
}

/** Linjerne i en formelblok, der er stykker (tomme linjer springes over). */
export function formulaItems(lines: readonly string[]): string[] {
  return lines.filter((l) => l.trim() !== "");
}
