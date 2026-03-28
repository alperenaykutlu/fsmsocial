/**
 * FSM İzci Ocağı - Renk Sistemi
 * 4 Renk Modu:
 *  - "dark"       : Koyu ton (orijinal koyu amber/kahve)
 *  - "light"      : Açık ton (krem/beyaz)
 *  - "scout"      : İzci Koyu Mavi (ana marka rengi)
 *  - "scoutLight" : İzci Açık Mavi (marka rengi, açık versiyon)
 */

// ─── TEMA PALETLERİ ────────────────────────────────────────────────────────────

const THEMES = {
  // ─── KOYU MOD ────────────────────────────────────────────────────────────────
  dark: {
    // Ana renkler
    primary:         "#E8A630",   // sıcak amber
    primaryLight:    "#F4C35A",   // açık altın
    primaryDark:     "#B07A18",   // koyu amber
    primaryGlow:     "#E8A63040", // amber parıltı (rgba)

    // Metin
    textPrimary:     "#F2EBD9",   // sıcak krem beyaz
    textSecondary:   "#A89880",   // soluk kum
    textDark:        "#FDFAF4",   // neredeyse beyaz
    textMuted:       "#6B5D4E",   // soluk/pasif metin
    placeholderText: "#6B5D4E",

    // Arka planlar
    background:      "#141210",   // neredeyse siyah
    cardBackground:  "#1E1B17",   // koyu kahverengi-siyah
    inputBackground: "#252119",   // biraz daha açık
    surface:         "#2A2620",   // kart üstü yüzey
    surfaceElevated: "#312C26",   // yükseltilmiş yüzey
    overlay:         "#00000080", // yarı saydam siyah

    // Kenarlıklar
    border:          "#3A342C",   // koyu kahve kenarlık
    borderLight:     "#4A4238",   // biraz açık kenarlık
    borderFocus:     "#E8A63066", // odaklanan kenarlık

    // Durum renkleri
    success:         "#5A9E6F",
    successLight:    "#5A9E6F20",
    error:           "#D05050",
    errorLight:      "#D0505020",
    warning:         "#E8A630",
    warningLight:    "#E8A63020",
    info:            "#4A90C4",
    infoLight:       "#4A90C420",

    // Sabitler
    white:           "#FFFFFF",
    black:           "#000000",

    // Ek özellikler
    shadow:          "#000000",
    shimmer:         "#2A2620",
    shimmerHigh:     "#352F28",
    tabBar:          "#1E1B17",
    tabBarBorder:    "#3A342C",
    headerBg:        "#1A1714",
    divider:         "#3A342C",
    badge:           "#E8A630",
    badgeText:       "#141210",
    highlight:       "#E8A63015",
    scrim:           "#14121099",
  },

  // ─── AÇIK MOD ────────────────────────────────────────────────────────────────
  light: {
    // Ana renkler
    primary:         "#C88A1A",   // koyu altın
    primaryLight:    "#E8A630",   // amber
    primaryDark:     "#8A5E10",   // derin altın
    primaryGlow:     "#C88A1A30", // altın parıltı (rgba)

    // Metin
    textPrimary:     "#1A1510",   // neredeyse siyah
    textSecondary:   "#5C4E3A",   // koyu kum
    textDark:        "#0D0B08",   // tam siyah
    textMuted:       "#9A8870",   // soluk/pasif metin
    placeholderText: "#A08A6A",

    // Arka planlar
    background:      "#FAF7F2",   // sıcak beyaz
    cardBackground:  "#FFFFFF",   // tam beyaz
    inputBackground: "#F0EBE2",   // çok açık krem
    surface:         "#EDE6DA",   // açık krem yüzey
    surfaceElevated: "#FFFFFF",   // yükseltilmiş (beyaz)
    overlay:         "#1A151080", // yarı saydam koyu

    // Kenarlıklar
    border:          "#D4C4A8",   // açık kahve kenarlık
    borderLight:     "#E4D8C0",   // çok açık kenarlık
    borderFocus:     "#C88A1A66", // odaklanan kenarlık

    // Durum renkleri
    success:         "#2E7D50",
    successLight:    "#2E7D5015",
    error:           "#B03030",
    errorLight:      "#B0303015",
    warning:         "#C88A1A",
    warningLight:    "#C88A1A15",
    info:            "#2266AA",
    infoLight:       "#2266AA15",

    // Sabitler
    white:           "#FFFFFF",
    black:           "#000000",

    // Ek özellikler
    shadow:          "#5C4E3A",
    shimmer:         "#F0EBE2",
    shimmerHigh:     "#FFFFFF",
    tabBar:          "#FFFFFF",
    tabBarBorder:    "#D4C4A8",
    headerBg:        "#FAF7F2",
    divider:         "#D4C4A8",
    badge:           "#C88A1A",
    badgeText:       "#FFFFFF",
    highlight:       "#C88A1A10",
    scrim:           "#FAF7F299",
  },

  // ─── İZCİ KOYU MAVİ MOD ──────────────────────────────────────────────────────
  scout: {
    // Ana renkler - koyu mavi dominant
    primary:         "#FFFFFF",   // beyaz (izci bayrağı rengi)
    primaryLight:    "#E8F0FF",   // çok açık mavi-beyaz
    primaryDark:     "#C8D8F4",   // açık soluk mavi
    primaryGlow:     "#FFFFFF25", // beyaz parıltı (rgba)

    // Metin
    textPrimary:     "#F0F4FF",   // soğuk beyaz
    textSecondary:   "#9AADD4",   // soluk açık mavi
    textDark:        "#FFFFFF",   // tam beyaz
    textMuted:       "#5A7099",   // soluk koyu mavi
    placeholderText: "#6080AA",

    // Arka planlar
    background:      "#0A0F1E",   // neredeyse siyah mavi
    cardBackground:  "#111828",   // koyu gece mavisi
    inputBackground: "#182030",   // biraz açık lacivert
    surface:         "#1C2640",   // yüzey lacivert
    surfaceElevated: "#223050",   // yükseltilmiş lacivert
    overlay:         "#00000085", // yarı saydam siyah

    // Kenarlıklar
    border:          "#1E3050",   // koyu mavi kenarlık
    borderLight:     "#2A4068",   // biraz açık mavi kenarlık
    borderFocus:     "#FFFFFF40", // beyaz odak kenarlık

    // Durum renkleri
    success:         "#3DAA6A",
    successLight:    "#3DAA6A20",
    error:           "#E05555",
    errorLight:      "#E0555520",
    warning:         "#E8A630",
    warningLight:    "#E8A63020",
    info:            "#60AAEE",
    infoLight:       "#60AAEE20",

    // Sabitler
    white:           "#FFFFFF",
    black:           "#000000",

    // Ek özellikler
    shadow:          "#000000",
    shimmer:         "#182030",
    shimmerHigh:     "#223050",
    tabBar:          "#0D1520",
    tabBarBorder:    "#1E3050",
    headerBg:        "#0A0F1E",
    divider:         "#1E3050",
    badge:           "#FFFFFF",
    badgeText:       "#0A0F1E",
    highlight:       "#FFFFFF10",
    scrim:           "#0A0F1E99",

    // İzci özel - ikincil vurgu
    accent:          "#1E90FF",   // parlak mavi vurgu
    accentLight:     "#1E90FF20",
    accentDark:      "#0060CC",
  },

  // ─── İZCİ AÇIK MAVİ MOD ──────────────────────────────────────────────────────
  scoutLight: {
    // Ana renkler - açık mavi / beyaz dominant
    primary:         "#0A3875",   // koyu lacivert
    primaryLight:    "#1452A8",   // orta mavi
    primaryDark:     "#061E42",   // çok koyu lacivert
    primaryGlow:     "#0A387520", // lacivert parıltı (rgba)

    // Metin
    textPrimary:     "#08244A",   // koyu lacivert metin
    textSecondary:   "#2E5A8A",   // orta lacivert metin
    textDark:        "#040E20",   // neredeyse siyah
    textMuted:       "#7094BE",   // soluk mavi metin
    placeholderText: "#8AAAD0",

    // Arka planlar
    background:      "#F0F5FF",   // çok açık mavi-beyaz
    cardBackground:  "#FFFFFF",   // beyaz
    inputBackground: "#E4EEFF",   // açık mavi input
    surface:         "#D8E8FF",   // açık mavi yüzey
    surfaceElevated: "#FFFFFF",   // beyaz yükseltilmiş
    overlay:         "#08244A80", // yarı saydam lacivert

    // Kenarlıklar
    border:          "#A8C4E8",   // açık mavi kenarlık
    borderLight:     "#C8DCF4",   // çok açık mavi kenarlık
    borderFocus:     "#0A387566", // lacivert odak kenarlık

    // Durum renkleri
    success:         "#1A7A48",
    successLight:    "#1A7A4815",
    error:           "#C03030",
    errorLight:      "#C0303015",
    warning:         "#D08020",
    warningLight:    "#D0802015",
    info:            "#1466CC",
    infoLight:       "#1466CC15",

    // Sabitler
    white:           "#FFFFFF",
    black:           "#000000",

    // Ek özellikler
    shadow:          "#0A3875",
    shimmer:         "#E4EEFF",
    shimmerHigh:     "#FFFFFF",
    tabBar:          "#FFFFFF",
    tabBarBorder:    "#A8C4E8",
    headerBg:        "#F0F5FF",
    divider:         "#A8C4E8",
    badge:           "#0A3875",
    badgeText:       "#FFFFFF",
    highlight:       "#0A387510",
    scrim:           "#F0F5FF99",

    // İzci özel - ikincil vurgu
    accent:          "#0066CC",   // orta mavi vurgu
    accentLight:     "#0066CC15",
    accentDark:      "#003D80",
  },
};

// ─── AKTİF TEMA ───────────────────────────────────────────────────────────────
// Varsayılan tema: "scout" (izci koyu mavi)
// Değiştirmek için: setActiveTheme("dark" | "light" | "scout" | "scoutLight")

let _activeTheme = "scout";

/**
 * Aktif temayı değiştir
 * @param {"dark"|"light"|"scout"|"scoutLight"} themeName
 */
export const setActiveTheme = (themeName) => {
  if (THEMES[themeName]) {
    _activeTheme = themeName;
  } else {
    console.warn(`[Colors] Geçersiz tema: "${themeName}". Geçerli temalar: dark, light, scout, scoutLight`);
  }
};

/**
 * Aktif tema adını döndürür
 * @returns {"dark"|"light"|"scout"|"scoutLight"}
 */
export const getActiveTheme = () => _activeTheme;

/**
 * Belirli bir temanın tüm renklerini döndürür
 * @param {"dark"|"light"|"scout"|"scoutLight"} [themeName]
 * @returns {Object}
 */
export const getTheme = (themeName) => THEMES[themeName] || THEMES[_activeTheme];

/**
 * Tüm tema paletlerini döndürür (ayarlar ekranı için)
 */
export const getAllThemes = () => THEMES;

/**
 * Tema meta verileri (görünen isimler, ikon renkleri)
 */
export const THEME_META = {
  dark: {
    label:       "Koyu Ton",
    labelEn:     "Dark",
    previewBg:   "#141210",
    previewAccent:"#E8A630",
    icon:        "moon",
  },
  light: {
    label:       "Açık Ton",
    labelEn:     "Light",
    previewBg:   "#FAF7F2",
    previewAccent:"#C88A1A",
    icon:        "sun",
  },
  scout: {
    label:       "İzci Koyu",
    labelEn:     "Scout Dark",
    previewBg:   "#0A0F1E",
    previewAccent:"#FFFFFF",
    icon:        "compass",
  },
  scoutLight: {
    label:       "İzci Açık",
    labelEn:     "Scout Light",
    previewBg:   "#F0F5FF",
    previewAccent:"#0A3875",
    icon:        "sun-compass",
  },
};

// ─── VARSAYILAN EXPORT (geriye dönük uyumluluk) ───────────────────────────────
// Mevcut kodlar `import COLORS from '../constants/colors'` şeklinde kullandığı için
// varsayılan export dinamik proxy obje olarak çalışır.
// Not: React Native ortamında Proxy kullanılabiliyorsa dinamik; değilse statik.

const COLORS = new Proxy({}, {
  get(_, key) {
    return THEMES[_activeTheme][key];
  },
});

export { THEMES };
export default COLORS;
