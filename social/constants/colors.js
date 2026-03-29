/**
 * FSM İzci Ocağı - Renk Sistemi
 * 4 Renk Modu:
 *  - "dark"       : Sisli Şafak  (koyu mor-obsidyen)
 *  - "light"      : Zümrüt Gecesi (koyu zümrüt · elektrik yeşil)
 *  - "scout"      : Derin Okyanus (koyu lacivert · elektrik mavi)
 *  - "scoutLight" : Yakut Akşamı  (koyu obsidyen · fuşya-pembe)
 */

// ─── TEMA PALETLERİ ────────────────────────────────────────────────────────────

const THEMES = {
  // ─── SİSLİ ŞAFAK (KOYU MOD) ──────────────────────────────────────────────────
  dark: {
    // Ana renkler
    primary:         "#B87FEA",   // lâvanta vurgu
    primaryLight:    "#D4AEFF",   // açık lâvanta
    primaryDark:     "#7C5BAF",   // koyu mor
    primaryGlow:     "#B87FEA30", // mor parıltı (rgba)

    // Metin
    textPrimary:     "#E8D9FF",   // soğuk lâvanta beyazı
    textSecondary:   "#9B88C0",   // soluk mor
    textDark:        "#F5EEFF",   // neredeyse beyaz
    textMuted:       "#5A4880",   // pasif mor
    placeholderText: "#5A4880",

    // Arka planlar
    background:      "#1B1620",   // obsidyen mor-siyah
    cardBackground:  "#231D2C",   // koyu mor kart
    inputBackground: "#2A2338",   // biraz açık
    surface:         "#2E2640",   // yüzey
    surfaceElevated: "#352D4A",   // yükseltilmiş yüzey
    overlay:         "#00000085", // yarı saydam siyah

    // Kenarlıklar
    border:          "#3D3054",   // koyu mor kenarlık
    borderLight:     "#4A3D66",   // biraz açık kenarlık
    borderFocus:     "#B87FEA55", // odaklanan kenarlık

    // Durum renkleri
    success:         "#3DDB82",
    successLight:    "#3DDB8220",
    error:           "#E05575",
    errorLight:      "#E0557520",
    warning:         "#E8A630",
    warningLight:    "#E8A63020",
    info:            "#60AAEE",
    infoLight:       "#60AAEE20",

    // Sabitler
    white:           "#FFFFFF",
    black:           "#000000",

    // Ek özellikler
    shadow:          "#000000",
    shimmer:         "#2A2338",
    shimmerHigh:     "#352D4A",
    tabBar:          "#231D2C",
    tabBarBorder:    "#3D3054",
    headerBg:        "#1B1620",
    divider:         "#3D3054",
    badge:           "#2E2640",
    badgeText:       "#C4A8FF",
    highlight:       "#B87FEA12",
    scrim:           "#1B162099",
  },

  // ─── ZÜMRÜT GECESİ (AÇIK MOD) ────────────────────────────────────────────────
  light: {
    // Ana renkler
    primary:         "#3DDB82",   // elektrik zümrüt
    primaryLight:    "#6EEEA3",   // açık neon yeşil
    primaryDark:     "#1F6644",   // koyu zümrüt
    primaryGlow:     "#3DDB8230", // zümrüt parıltı (rgba)

    // Metin
    textPrimary:     "#C8F5DC",   // açık zümrüt beyazı
    textSecondary:   "#4D9966",   // orta yeşil
    textDark:        "#E8FFF2",   // neredeyse beyaz-yeşil
    textMuted:       "#2D6644",   // pasif koyu yeşil
    placeholderText: "#2D6644",

    // Arka planlar
    background:      "#0D1C14",   // mürekkep yeşili siyah
    cardBackground:  "#132218",   // koyu orman kartı
    inputBackground: "#192C1E",   // biraz açık
    surface:         "#1D3224",   // yüzey
    surfaceElevated: "#22382A",   // yükseltilmiş yüzey
    overlay:         "#00000085", // yarı saydam siyah

    // Kenarlıklar
    border:          "#1F3D29",   // koyu yeşil kenarlık
    borderLight:     "#2A5038",   // biraz açık kenarlık
    borderFocus:     "#3DDB8255", // odaklanan kenarlık

    // Durum renkleri
    success:         "#3DDB82",
    successLight:    "#3DDB8220",
    error:           "#E05555",
    errorLight:      "#E0555520",
    warning:         "#E8A630",
    warningLight:    "#E8A63020",
    info:            "#40C0EE",
    infoLight:       "#40C0EE20",

    // Sabitler
    white:           "#FFFFFF",
    black:           "#000000",

    // Ek özellikler
    shadow:          "#000000",
    shimmer:         "#192C1E",
    shimmerHigh:     "#22382A",
    tabBar:          "#132218",
    tabBarBorder:    "#1F3D29",
    headerBg:        "#0D1C14",
    divider:         "#1F3D29",
    badge:           "#1D3224",
    badgeText:       "#5DEEA0",
    highlight:       "#3DDB8212",
    scrim:           "#0D1C1499",
  },

  // ─── DERİN OKYANUS (İZCİ KOYU MAVİ) ─────────────────────────────────────────
  scout: {
    // Ana renkler
    primary:         "#3BAEFF",   // elektrik mavi
    primaryLight:    "#72CAFF",   // açık neon mavi
    primaryDark:     "#0E5E94",   // koyu okyanus mavisi
    primaryGlow:     "#3BAEFF30", // mavi parıltı (rgba)

    // Metin
    textPrimary:     "#D4EEFF",   // soğuk buz beyazı
    textSecondary:   "#5B8CB5",   // soluk okyanus mavisi
    textDark:        "#EDF6FF",   // neredeyse beyaz
    textMuted:       "#2A5878",   // pasif koyu mavi
    placeholderText: "#2A5878",

    // Arka planlar
    background:      "#050D1A",   // mürekkep gece mavisi
    cardBackground:  "#091526",   // koyu deniz kartı
    inputBackground: "#0D1E35",   // biraz açık
    surface:         "#112440",   // yüzey
    surfaceElevated: "#152A4A",   // yükseltilmiş yüzey
    overlay:         "#00000085", // yarı saydam siyah

    // Kenarlıklar
    border:          "#112840",   // koyu mavi kenarlık
    borderLight:     "#1A3D5C",   // biraz açık kenarlık
    borderFocus:     "#3BAEFF55", // odaklanan kenarlık

    // Durum renkleri
    success:         "#3DDB82",
    successLight:    "#3DDB8220",
    error:           "#E05555",
    errorLight:      "#E0555520",
    warning:         "#E8A630",
    warningLight:    "#E8A63020",
    info:            "#3BAEFF",
    infoLight:       "#3BAEFF20",

    // Sabitler
    white:           "#FFFFFF",
    black:           "#000000",

    // Ek özellikler
    shadow:          "#000000",
    shimmer:         "#0D1E35",
    shimmerHigh:     "#152A4A",
    tabBar:          "#091526",
    tabBarBorder:    "#112840",
    headerBg:        "#050D1A",
    divider:         "#112840",
    badge:           "#112440",
    badgeText:       "#60C4FF",
    highlight:       "#3BAEFF12",
    scrim:           "#050D1A99",

    // İzci özel - ikincil vurgu
    accent:          "#3BAEFF",
    accentLight:     "#3BAEFF20",
    accentDark:      "#0E5E94",
  },

  // ─── YAKUT AKŞAMI (İZCİ AÇIK / FUŞYA) ───────────────────────────────────────
  scoutLight: {
    // Ana renkler
    primary:         "#E84FA0",   // fuşya-pembe vurgu
    primaryLight:    "#F580BF",   // açık pembe
    primaryDark:     "#8A2E6A",   // koyu yakut
    primaryGlow:     "#E84FA030", // fuşya parıltı (rgba)

    // Metin
    textPrimary:     "#FBDAED",   // soluk pembe beyaz
    textSecondary:   "#8A4472",   // orta fuşya
    textDark:        "#FFF0F8",   // neredeyse beyaz
    textMuted:       "#4D2244",   // pasif koyu mor
    placeholderText: "#4D2244",

    // Arka planlar
    background:      "#160D18",   // obsidyen mor-siyah
    cardBackground:  "#1E1022",   // koyu yakut kartı
    inputBackground: "#261530",   // biraz açık
    surface:         "#2C1838",   // yüzey
    surfaceElevated: "#321C40",   // yükseltilmiş yüzey
    overlay:         "#00000085", // yarı saydam siyah

    // Kenarlıklar
    border:          "#321845",   // koyu mor kenarlık
    borderLight:     "#3E2055",   // biraz açık kenarlık
    borderFocus:     "#E84FA055", // odaklanan kenarlık

    // Durum renkleri
    success:         "#3DDB82",
    successLight:    "#3DDB8220",
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
    shimmer:         "#261530",
    shimmerHigh:     "#321C40",
    tabBar:          "#1E1022",
    tabBarBorder:    "#321845",
    headerBg:        "#160D18",
    divider:         "#321845",
    badge:           "#2C1838",
    badgeText:       "#F07DC0",
    highlight:       "#E84FA012",
    scrim:           "#160D1899",

    // İzci özel - ikincil vurgu
    accent:          "#E84FA0",
    accentLight:     "#E84FA020",
    accentDark:      "#8A2E6A",
  },
};

// ─── AKTİF TEMA ───────────────────────────────────────────────────────────────
// Varsayılan tema: "scout" (derin okyanus)
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
    label:        "Sisli Şafak",
    labelEn:      "Misty Dawn",
    previewBg:    "#1B1620",
    previewAccent:"#B87FEA",
    icon:         "moon",
  },
  light: {
    label:        "Zümrüt Gecesi",
    labelEn:      "Emerald Night",
    previewBg:    "#0D1C14",
    previewAccent:"#3DDB82",
    icon:         "leaf",
  },
  scout: {
    label:        "Derin Okyanus",
    labelEn:      "Deep Ocean",
    previewBg:    "#050D1A",
    previewAccent:"#3BAEFF",
    icon:         "compass",
  },
  scoutLight: {
    label:        "Yakut Akşamı",
    labelEn:      "Ruby Dusk",
    previewBg:    "#160D18",
    previewAccent:"#E84FA0",
    icon:         "gem",
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