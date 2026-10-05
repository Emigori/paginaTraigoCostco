// Búsqueda "inteligente" sin IA: ignora acentos/mayúsculas, maneja plurales,
// busca cada palabra por separado y expande sinónimos.
// Para agregar sinónimos, edita SYNONYMS (todo en minúsculas y sin acentos).

const SYNONYMS = {
  cable: ["cable", "cargador", "usb", "lightning", "hdmi"],
  cargador: ["cargador", "cable", "usb"],
  pastel: ["pastel", "pay", "cheesecake", "brownie", "tarta", "bizcocho", "muffin", "cupcake"],
  pay: ["pay", "pastel", "tarta"],
  leche: ["leche", "lacteo", "yogurt", "yogur", "crema"],
  refresco: ["refresco", "soda", "gaseosa", "coca", "pepsi"],
  soda: ["soda", "refresco", "gaseosa"],
  jugo: ["jugo", "juice", "nectar"],
  cafe: ["cafe", "nescafe", "coffee", "capuchino"],
  chocolate: ["chocolate", "cacao", "nesquik", "ghirardelli"],
  galleta: ["galleta", "cookie", "cookies"],
  carne: ["carne", "res", "arrachera", "bistec", "pollo", "cerdo"],
  pollo: ["pollo", "pechuga", "muslo", "pierna"],
  queso: ["queso", "mozzarella", "mascarpone", "parmesano", "cheddar"],
  salchicha: ["salchicha", "hot dog", "jamon", "embutido"],
  jamon: ["jamon", "salchicha", "pavo"],
  detergente: ["detergente", "jabon", "suavizante", "limpiador"],
  jabon: ["jabon", "detergente", "shampoo", "gel"],
  shampoo: ["shampoo", "champu", "acondicionador"],
  papel: ["papel", "servilleta", "toalla"],
  playera: ["playera", "camiseta", "camisa", "polo"],
  camisa: ["camisa", "playera", "camiseta"],
  pantalon: ["pantalon", "jeans", "mezclilla", "short"],
  chamarra: ["chamarra", "sudadera", "chaqueta", "abrigo", "hoodie"],
  zapato: ["zapato", "tenis", "bota", "sandalia"],
  tenis: ["tenis", "zapato"],
  vitamina: ["vitamina", "suplemento", "capsula", "gomita", "omega"],
  medicina: ["medicina", "pastilla", "tableta", "capsula"],
  juguete: ["juguete", "lego", "muneco", "play-doh", "playdoh"],
  sabana: ["sabana", "cobija", "colcha", "edredon", "frazada"],
  cobija: ["cobija", "frazada", "colcha", "sabana"],
};

const ACCENT_CLASSES = {
  a: "[aáàäâ]",
  e: "[eéèëê]",
  i: "[iíìïî]",
  o: "[oóòöô]",
  u: "[uúùüû]",
  n: "[nñ]",
};

export function normalize(str = "") {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Quita plural simple: "cables" -> "cable", "galletas" -> "galleta", "jabones" -> "jabon"
function singular(word) {
  if (word.length > 4 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s")) return word.slice(0, -1);
  return word;
}

// Convierte una palabra en patrón regex tolerante a acentos
function accentPattern(word) {
  return [...word]
    .map((ch) => ACCENT_CLASSES[ch] ?? escapeRegex(ch))
    .join("");
}

function termsFor(token) {
  const base = singular(token);
  const set = new Set([base]);
  // Candidatos de singular: "cables"->"cable", "jabones"->"jabon"
  const candidates = [token, base, token.endsWith("s") ? token.slice(0, -1) : token];
  const key = candidates.find((c) => SYNONYMS[c]);
  const syns = key ? SYNONYMS[key] : [];
  syns.forEach((s) => set.add(singular(normalize(s))));
  return [...set];
}

/**
 * Devuelve { and, or } filtros de Mongo para el campo name.
 * and: todas las palabras deben aparecer (cada una o algún sinónimo suyo).
 * or:  basta con que aparezca alguna (fallback si "and" no da resultados).
 */
export function buildSearchFilters(search) {
  const tokens = normalize(search)
    .split(/\s+/)
    .filter((t) => t.length > 0);
  if (tokens.length === 0) return null;

  const perToken = tokens.map((t) => {
    const pattern = termsFor(t).map(accentPattern).join("|");
    return { name: { $regex: pattern, $options: "i" } };
  });

  return {
    and: { $and: perToken },
    or: perToken.length > 1 ? { $or: perToken } : null,
  };
}
