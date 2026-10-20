// Diccionario de sinónimos del buscador (sin IA).
//
// Cada grupo es una lista de palabras que significan "lo mismo" para quien
// busca. Si alguien escribe CUALQUIER palabra del grupo, se buscan TODAS.
// - Escribe en minúsculas; acentos y plurales no importan.
// - Errores de dedo (yoguth, yougurt, chocolatte) ya los tolera el buscador,
//   no hace falta agregarlos aquí.
// - Incluye marcas cuando ayude: "yogur" también trae Chobani, Oikos, etc.
// - Para agregar algo nuevo: agrega una palabra a un grupo existente o crea
//   un grupo nuevo. Evita grupos demasiado amplios (ej. no meter "leche" con
//   "queso") porque ensucian los resultados.

export const SYNONYM_GROUPS = [
  // ── Lácteos y refrigerados ────────────────────────────────────────────────
  ["yogur", "yogurt", "yoghurt", "yogurth", "griego", "greek", "skyr", "oikos", "chobani", "fage", "activia", "danone", "lala yogur"],
  ["kefir", "bulgaros", "probiotico"],
  ["leche", "milk", "lala", "alpura", "santa clara", "deslactosada", "entera", "semidescremada"],
  ["leche vegetal", "almendra", "avena", "soya", "silk", "coco"],
  ["crema", "media crema", "nata", "cream", "sustituto de crema", "coffee mate", "coffeemate"],
  ["mantequilla", "butter", "margarina"],
  ["queso", "cheese", "quesos"],
  ["mozzarella", "mozarela", "mozarella"],
  ["parmesano", "parmesan", "parmigiano", "reggiano", "grana padano"],
  ["cheddar", "chedar", "americano"],
  ["manchego", "oaxaca", "panela", "asadero", "chihuahua"],
  ["queso crema", "philadelphia", "cream cheese", "mascarpone"],
  ["huevo", "huevos", "blanquillo", "egg", "eggs"],
  ["hummus", "humus", "garbanzo"],

  // ── Carnes y embutidos ────────────────────────────────────────────────────
  ["carne", "res", "beef", "bistec", "arrachera", "ribeye", "rib eye", "sirloin", "new york", "picana", "molida", "hamburguesa"],
  ["pollo", "chicken", "pechuga", "muslo", "pierna", "alitas", "nuggets", "rostizado"],
  ["cerdo", "puerco", "pork", "costilla", "chuleta", "lomo", "tocino", "bacon", "cochinita"],
  ["pescado", "fish", "salmon", "atun", "tilapia", "mariscos", "camaron", "shrimp"],
  ["salmon", "salmón", "lox", "ahumado"],
  ["atun", "tuna", "dolores", "tuny"],
  ["jamon", "ham", "pavo", "turkey", "fud", "kir", "serrano", "prosciutto"],
  ["salchicha", "salchichas", "sausage", "hot dog", "hotdog", "frankfurt", "chorizo", "salami", "pepperoni", "embutido"],

  // ── Panadería y postres ───────────────────────────────────────────────────
  ["pastel", "pasteles", "cake", "pay", "pie", "cheesecake", "tarta", "torta", "brownie", "bizcocho", "panque", "muffin", "mantecada", "cupcake", "rol", "roll", "cinnamon"],
  ["pan", "bread", "bolillo", "baguette", "hogaza", "bagel", "croissant", "cuernito", "concha", "dona", "donas", "tortilla"],
  ["galleta", "galletas", "cookie", "cookies", "cracker", "crackers", "oreo", "barritas", "wafer"],
  ["pan de muerto", "muerto", "rosca", "reyes"],

  // ── Dulces y botanas ──────────────────────────────────────────────────────
  ["chocolate", "choco", "cacao", "chocolates", "ghirardelli", "hersheys", "hershey", "kinder", "ferrero", "lindt", "m&m", "mms", "snickers", "nutella", "toblerone", "carlos v", "bombon"],
  ["dulce", "dulces", "candy", "caramelo", "gomitas", "gomita", "panditas", "paleta", "chicle", "malvavisco", "bombones", "skittles", "turin", "de la rosa", "mazapan"],
  ["botana", "snack", "papas", "papitas", "chips", "sabritas", "doritos", "pringles", "cheetos", "takis", "ruffles", "palomitas", "popcorn", "churritos"],
  ["nuez", "nueces", "nuts", "almendra", "almendras", "cacahuate", "cacahuates", "pistache", "pistachos", "maranon", "macadamia", "mixed nuts", "mixtos", "pecanas"],
  ["fruta seca", "deshidratada", "datil", "datiles", "pasas", "arandano", "arandanos", "cranberry", "mango deshidratado", "ciruela"],
  ["cereal", "cereales", "granola", "avena", "oats", "corn flakes", "zucaritas", "cheerios", "special k", "muesli"],
  ["barra", "barras", "barrita", "bar", "protein bar", "kind", "nature valley", "quest"],

  // ── Bebidas ───────────────────────────────────────────────────────────────
  ["cafe", "coffee", "nescafe", "starbucks", "capuchino", "cappuccino", "espresso", "latte", "soluble", "molido", "grano", "capsulas", "kcup", "k-cup", "nespresso", "dolce gusto"],
  ["te", "tea", "infusion", "manzanilla", "matcha", "chai", "tisana"],
  ["refresco", "soda", "gaseosa", "coca", "coca-cola", "cocacola", "pepsi", "sprite", "fanta", "squirt", "sidral", "topo chico", "mineral"],
  ["agua", "water", "agua mineral", "electrolit", "suero", "bonafont", "ciel", "epura"],
  ["jugo", "juice", "nectar", "jumex", "del valle", "naranja", "limonada"],
  ["bebida energetica", "energetica", "energy", "red bull", "monster", "vive 100", "volt"],
  ["gatorade", "powerade", "isotonica", "hidratante", "electrolitos", "electrolit"],
  ["vino", "wine", "tinto", "blanco", "rosado", "espumoso", "champagne", "prosecco"],
  ["cerveza", "beer", "chela", "modelo", "corona", "michelob", "heineken"],
  ["licor", "tequila", "whisky", "whiskey", "vodka", "ron", "mezcal", "brandy", "ginebra", "gin", "baileys"],
  ["chocolate en polvo", "nesquik", "chocomilk", "cocoa", "chocolate caliente", "abuelita", "ibarra"],
  ["proteina", "protein", "whey", "suero de leche", "isolate", "premier protein", "batido", "shake"],

  // ── Despensa ──────────────────────────────────────────────────────────────
  ["aceite", "oil", "oliva", "olive", "aguacate", "canola", "girasol", "coco", "spray"],
  ["arroz", "rice", "jazmin", "basmati", "integral"],
  ["pasta", "spaghetti", "espagueti", "fideo", "fusilli", "penne", "macarrones", "macarron", "lasagna", "lasana", "ravioli", "tortellini", "ramen", "sopa instantanea", "maruchan"],
  ["frijol", "frijoles", "beans", "lenteja", "lentejas", "garbanzo"],
  ["salsa", "sauce", "catsup", "ketchup", "mostaza", "mustard", "mayonesa", "mayo", "valentina", "huichol", "tabasco", "sriracha", "chipotle", "bbq", "barbacoa", "pesto", "aderezo", "dressing", "ranch"],
  ["especia", "especias", "sazonador", "condimento", "sal", "pimienta", "oregano", "canela", "comino", "ajo", "paprika", "tajin", "consome", "knorr"],
  ["azucar", "sugar", "endulzante", "splenda", "stevia", "monk fruit", "piloncillo", "mascabado"],
  ["miel", "honey", "maple", "jarabe", "syrup", "agave"],
  ["mermelada", "jam", "jalea", "crema de cacahuate", "peanut butter", "nutella", "untable"],
  ["harina", "flour", "hot cakes", "hotcakes", "pancake", "waffle", "maseca", "polvo para hornear"],
  ["lata", "enlatado", "conserva", "elote", "chiles", "jalapenos", "chipotles", "champinones", "aceitunas", "duraznos"],
  ["mole", "pipian", "adobo"],
  ["congelado", "congelados", "frozen", "pizza", "papas a la francesa", "nuggets", "helado"],
  ["helado", "ice cream", "nieve", "paleta helada", "haagen", "magnum", "gelato"],
  ["fruta", "frutas", "fresa", "fresas", "berries", "mora", "moras", "blueberry", "frambuesa", "uva", "uvas", "manzana", "platano", "mango", "pina", "aguacate"],
  ["verdura", "verduras", "vegetales", "ensalada", "lechuga", "espinaca", "brocoli", "zanahoria", "jitomate", "tomate"],

  // ── Limpieza y hogar ──────────────────────────────────────────────────────
  ["detergente", "jabon para ropa", "ariel", "persil", "tide", "roma", "foca", "mas color", "pods", "capsulas de lavado"],
  ["suavizante", "suavitel", "downy", "ensueno", "fabric softener"],
  ["cloro", "blanqueador", "clorox", "bleach"],
  ["limpiador", "multiusos", "pinol", "fabuloso", "lysol", "desinfectante", "toallitas desinfectantes", "mr musculo", "windex"],
  ["lavatrastes", "lavaplatos", "salvo", "axion", "dawn", "finish", "cascade", "lavavajillas"],
  ["papel", "papel de bano", "papel higienico", "toilet paper", "kleenex", "petalo", "regio", "charmin", "cottonelle"],
  ["servilleta", "servilletas", "toalla de papel", "toallas de cocina", "bounty", "sanitas"],
  ["bolsa", "bolsas", "bolsa de basura", "ziploc", "hefty", "glad", "contenedor", "contenedores", "tupper", "topper"],
  ["aluminio", "papel aluminio", "plastico", "egapack", "film", "papel encerado"],
  ["vaso", "vasos", "plato", "platos", "desechable", "desechables", "cubiertos", "popote"],

  // ── Cuidado personal y farmacia ───────────────────────────────────────────
  ["jabon", "soap", "jabon de tocador", "dove", "zest", "gel de bano", "body wash"],
  ["shampoo", "champu", "acondicionador", "conditioner", "head shoulders", "pantene", "tresemme", "herbal essences"],
  ["pasta dental", "pasta de dientes", "dentifrico", "colgate", "crest", "sensodyne", "cepillo", "cepillo de dientes", "enjuague", "listerine", "hilo dental"],
  ["desodorante", "antitranspirante", "deodorant", "rexona", "axe", "speed stick", "dove men"],
  ["crema corporal", "lotion", "locion", "crema humectante", "humectante", "nivea", "cetaphil", "cerave", "eucerin", "lubriderm", "aveeno"],
  ["protector solar", "bloqueador", "sunscreen", "spf", "solar"],
  ["rastrillo", "rasuradora", "afeitar", "gillette", "navaja", "cartuchos"],
  ["panal", "panales", "diaper", "diapers", "huggies", "pampers", "kirkland panales", "toallitas", "toallitas humedas", "wipes"],
  ["toalla femenina", "toallas femeninas", "tampon", "tampones", "kotex", "saba", "always"],
  ["vitamina", "vitaminas", "suplemento", "suplementos", "multivitaminico", "gomitas de vitamina", "omega", "omega 3", "colageno", "biotina", "magnesio", "zinc", "vitamina c", "vitamina d", "centrum", "nature made"],
  ["medicina", "medicamento", "pastilla", "pastillas", "tableta", "tabletas", "capsula", "analgesico", "ibuprofeno", "paracetamol", "aspirina", "tylenol", "advil", "antigripal", "antialergico", "loratadina"],
  ["melatonina", "dormir", "sueno", "zzzquil"],

  // ── Ropa ──────────────────────────────────────────────────────────────────
  ["playera", "playeras", "camiseta", "t-shirt", "tshirt", "polo", "blusa"],
  ["camisa", "camisas", "franela", "shirt"],
  ["pantalon", "pantalones", "jeans", "mezclilla", "pants", "jogger", "leggings", "licra", "short", "shorts", "bermuda"],
  ["chamarra", "chamarras", "chaqueta", "jacket", "abrigo", "rompevientos", "rompe viento", "chaleco", "parka"],
  ["sudadera", "sudaderas", "hoodie", "sueter", "sweater", "pullover", "cardigan", "polar", "fleece"],
  ["pijama", "pijamas", "pijamas", "ropa de dormir", "bata"],
  ["calcetines", "calcetin", "socks", "tines"],
  ["ropa interior", "boxer", "boxers", "calzon", "calzones", "trusa", "brasier", "bra", "panty", "pantys"],
  ["zapato", "zapatos", "tenis", "sneakers", "botas", "bota", "sandalias", "sandalia", "chanclas", "pantuflas", "crocs", "skechers"],
  ["bebe", "bebes", "baby", "nino", "nina", "ninos", "infantil", "kids", "conjunto", "mameluco", "pekkle", "carter", "carters"],
  ["gorro", "gorra", "beanie", "bufanda", "guantes"],
  ["traje de bano", "bikini", "short de bano", "swim"],

  // ── Casa y temporada ──────────────────────────────────────────────────────
  ["cobija", "cobijas", "frazada", "frazadas", "manta", "colcha", "edredon", "cobertor", "blanket", "sherpa", "duvet"],
  ["sabana", "sabanas", "juego de sabanas", "sheet", "sheets", "funda", "fundas"],
  ["almohada", "almohadas", "pillow", "cojin", "cojines"],
  ["toalla", "toallas", "towel", "toalla de bano"],
  ["cortina", "cortinas", "blackout", "persiana"],
  ["sarten", "sartenes", "olla", "ollas", "bateria de cocina", "cacerola", "tefal", "cuchillo", "cuchillos", "utensilios"],
  ["jarra", "jarras", "vaso", "termo", "termos", "botella", "stanley", "yeti", "owala", "hydro flask"],
  ["contenedor", "contenedores", "recipiente", "recipientes", "organizador", "organizadores", "caja organizadora"],
  ["vela", "velas", "aromatizante", "difusor", "candle"],
  ["foco", "focos", "luz", "luces", "lampara", "led", "serie de luces"],
  ["cable", "cables", "cargador", "cargadores", "usb", "usb-c", "lightning", "hdmi", "extension", "multicontacto", "power bank", "bateria portatil"],
  ["pila", "pilas", "baterias", "bateria", "duracell", "energizer", "aa", "aaa"],
  ["audifonos", "audifono", "headphones", "earbuds", "airpods", "bocina", "bocinas", "speaker"],
  ["juguete", "juguetes", "toy", "toys", "lego", "muneca", "muneco", "peluche", "play-doh", "playdoh", "plastilina", "hot wheels", "barbie", "rompecabezas", "juego de mesa"],
  ["navidad", "navideno", "navidena", "arbol de navidad", "esfera", "esferas", "santa", "nieve", "muneco de nieve", "nacimiento", "christmas"],
  ["halloween", "dia de muertos", "calaverita", "calaveritas", "calabaza", "disfraz", "catrina"],
  ["mascota", "mascotas", "perro", "gato", "croquetas", "alimento para perro", "alimento para gato", "arena para gato", "pet"],
  ["planta", "plantas", "maceta", "flores", "jardin"],
];
