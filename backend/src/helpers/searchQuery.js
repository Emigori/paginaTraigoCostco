// Buscador "inteligente" sin IA.
//
// Qué hace:
//  1. Ignora acentos, mayúsculas, plurales y letras dobles.
//  2. "Fonética" en español: h muda (yoghurt = yogurt = yogurth),
//     b/v, s/z/c, k/c/qu, y/ll/i… así "yoguth" encuentra "yogurt".
//  3. Tolera errores de dedo (1 letra en palabras de 4+, 2 en palabras de 8+).
//  4. Prefijos: mientras escribes "yog" ya salen los yogures.
//  5. Sinónimos (helpers/synonyms.js): "yogur" también trae griego, greek,
//     skyr, Chobani…  Los sinónimos puntúan menos que la palabra exacta, así
//     que primero sale lo que escribiste y luego lo relacionado.
//  6. Ranking por relevancia. Si ninguna coincide con TODAS las palabras,
//     muestra las que coinciden con alguna.

import { SYNONYM_GROUPS } from "./synonyms.js";

const STOPWORDS = new Set([
  "de", "del", "la", "el", "los", "las", "un", "una", "unos", "unas",
  "y", "o", "con", "sin", "para", "por", "en", "a", "al", "e",
]);

// ── Normalización ───────────────────────────────────────────────────────────
export function normalize(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function singular(w) {
  if (w.length > 4 && w.endsWith("ces")) w = w.slice(0, -3) + "z"; // nueces -> nuez
  if (w.length > 3 && w.endsWith("s") && !/\d/.test(w)) w = w.slice(0, -1);
  if (w.length > 4 && w.endsWith("e")) w = w.slice(0, -1); // postre/postres, jabone/jabon
  return w;
}

// "Fonética" simple en español. Se aplica igual a lo que buscas y a los
// nombres de productos, así ambos quedan comparables.
function fold(word) {
  let w = singular(word);
  if (/^\d+$/.test(w)) return w;
  w = w
    .replace(/ch/g, "§")       // proteger "ch"
    .replace(/sh/g, "§")        // shampoo ≈ champu
    .replace(/h/g, "")          // h muda: yoghurt -> yogurt
    .replace(/§/g, "ch")
    .replace(/qu/g, "k")
    .replace(/c([ei])/g, "s$1")
    .replace(/c(?!h)/g, "k")
    .replace(/z/g, "s")
    .replace(/v/g, "b")
    .replace(/w/g, "u")
    .replace(/ll/g, "y")
    .replace(/y/g, "i")
    .replace(/ph/g, "f")
    .replace(/(.)\1+/g, "$1");  // letras dobles: mozzarella -> mosarela
  return w;
}

function words(str) {
  return normalize(str)
    .split(" ")
    .filter((t) => t && !STOPWORDS.has(t))
    .map(fold)
    .filter(Boolean);
}

// ── Distancia de edición (errores de dedo) ─────────────────────────────────
function lev(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const v = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      cur.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

function allowedTypos(len) {
  if (len >= 8) return 2;
  if (len >= 4) return 1;
  return 0;
}

// Qué tan bien una palabra buscada (q) coincide con una palabra del producto (w)
// strict = true para sinónimos cortos (evita que "te" encuentre "tenis").
function wordScore(q, w, strict) {
  if (q === w) return 1;
  const longEnough = q.length >= (strict ? 5 : 3);
  if (longEnough && w.startsWith(q)) return 0.9;
  // Los sinónimos no usan tolerancia a errores (evita "manzanilla" ≈ "manzana")
  const typos = strict ? 0 : allowedTypos(q.length);
  if (typos > 0) {
    if (lev(q, w, typos) <= typos) return 0.75;
    // error de dedo mientras aún escribes: "yogu" / "yoguh"
    if (q.length >= 5 && w.length > q.length && lev(q, w.slice(0, q.length), 1) <= 1) return 0.65;
  }
  return 0;
}

// Una "frase" (lista de palabras) coincide si TODAS sus palabras aparecen
function phraseScore(phraseWords, productWords, strict) {
  let total = 0;
  for (const q of phraseWords) {
    let best = 0;
    for (const w of productWords) {
      const s = wordScore(q, w, strict);
      if (s > best) best = s;
      if (best === 1) break;
    }
    if (best === 0) return 0;
    total += best;
  }
  return total / phraseWords.length;
}

// ── Sinónimos preprocesados ─────────────────────────────────────────────────
const GROUPS = SYNONYM_GROUPS.map((g) => g.map(words).filter((p) => p.length > 0));

// Grupos que corresponden a una palabra buscada (con tolerancia a errores)
function groupsForToken(token) {
  const found = [];
  for (const g of GROUPS) {
    const hit = g.some(
      (p) =>
        p.length === 1 &&
        (p[0] === token ||
          (token.length >= 5 && lev(token, p[0], 1) <= 1))
    );
    if (hit) found.push(g);
  }
  return found;
}

// Grupos que corresponden a una frase completa ("pan de muerto", "papel de baño")
function groupsForPhrase(tokens) {
  if (tokens.length < 2) return [];
  const joined = tokens.join(" ");
  return GROUPS.filter((g) => g.some((p) => p.length > 1 && p.join(" ") === joined));
}

const SYN_WEIGHT = 0.6;

/**
 * Filtra y ordena productos por relevancia.
 * products: [{ name, createdAt, ... }] (deben venir con _words precalculado)
 */
export function rankProducts(products, search) {
  const tokens = words(search);
  if (tokens.length === 0) return products;

  const queryNorm = normalize(search);
  const tokenGroups = tokens.map(groupsForToken);
  const phraseGroups = groupsForPhrase(tokens);

  const scoreFor = (p) => {
    const pw = p._words;
    const perToken = tokens.map((t, i) => {
      let best = 0;
      for (const w of pw) {
        const s = wordScore(t, w, false);
        if (s > best) best = s;
        if (best === 1) break;
      }
      if (best < 1) {
        for (const g of tokenGroups[i]) {
          for (const phrase of g) {
            const s = phraseScore(phrase, pw, true) * SYN_WEIGHT;
            if (s > best) best = s;
          }
        }
      }
      return best;
    });

    let phraseBonus = 0;
    for (const g of phraseGroups) {
      for (const phrase of g) {
        const s = phraseScore(phrase, pw, true) * SYN_WEIGHT * tokens.length;
        if (s > phraseBonus) phraseBonus = s;
      }
    }

    const matched = perToken.filter((s) => s > 0).length;
    const sum = perToken.reduce((a, b) => a + b, 0);
    const exactBonus = p._norm.includes(queryNorm) ? 2 : 0;
    const all = matched === tokens.length || phraseBonus > 0;
    return { all, matched, score: Math.max(sum, phraseBonus) + exactBonus };
  };

  const scored = products.map((p) => ({ p, ...scoreFor(p) }));
  let results = scored.filter((r) => r.all);
  if (results.length === 0) results = scored.filter((r) => r.matched > 0);

  results.sort(
    (a, b) =>
      b.score - a.score ||
      new Date(b.p.createdAt) - new Date(a.p.createdAt)
  );
  return results.map((r) => r.p);
}

// Precalcula las palabras "dobladas" de cada producto (se hace una vez por caché)
export function prepareProduct(p) {
  return { ...p, _words: words(p.name), _norm: normalize(p.name) };
}
