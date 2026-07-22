import { jsPDF } from 'jspdf';

export interface SampleCatalogDef {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  coverBg: string;
  totalPages: number;
  generatePdf: () => Uint8Array;
}

/**
 * Creates sample PDFs dynamically using jsPDF so that the application always
 * has built-in downloadable & viewable magazine catalogs immediately available.
 */

// Helper to draw a sleek product card on PDF canvas
function drawProductCard(
  doc: jsPDF, 
  x: number, 
  y: number, 
  w: number, 
  h: number, 
  title: string, 
  category: string, 
  price: string, 
  badge: string,
  bgRgb: [number, number, number]
) {
  // Container box
  doc.setFillColor(...bgRgb);
  doc.roundedRect(x, y, w, h, 3, 3, 'F');

  // Top header accent line
  doc.setFillColor(30, 41, 59);
  doc.rect(x, y, w, 4, 'F');

  // Badge
  if (badge) {
    doc.setFillColor(239, 68, 68);
    doc.roundedRect(x + w - 32, y + 8, 28, 7, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(badge, x + w - 18, y + 13, { align: 'center' });
  }

  // Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, x + 8, y + 18);

  // Category
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(category, x + 8, y + 25);

  // Graphic illustration shape
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(x + 8, y + 30, w - 16, h - 50, 2, 2, 'F');
  
  // Decorative inner graphics
  doc.setFillColor(148, 163, 184);
  doc.circle(x + w / 2, y + 30 + (h - 50) / 2, 14, 'F');
  doc.setFillColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DESIGN', x + w / 2, y + 30 + (h - 50) / 2 + 3, { align: 'center' });

  // Price & CTA
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(price, x + 8, y + h - 8);

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(x + w - 38, y + h - 14, 30, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('KUP TERAZ', x + w - 23, y + h - 8, { align: 'center' });
}

export function createFurnitureCatalogPdf(): Uint8Array {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4' // 210 x 297 mm
  });

  // PAGE 1: COVER
  doc.setFillColor(15, 23, 42); // Dark Navy Slate
  doc.rect(0, 0, 210, 297, 'F');

  // Decorative luxury geometry
  doc.setFillColor(30, 41, 59);
  doc.rect(15, 15, 180, 267, 'F');

  doc.setFillColor(217, 119, 6); // Amber Gold accent
  doc.rect(25, 25, 160, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('MODERN LIVING', 105, 70, { align: 'center' });

  doc.setTextColor(217, 119, 6);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('KATALOG MEBLI I DESIGNU 2026', 105, 85, { align: 'center' });

  // Cover image placeholder box
  doc.setFillColor(51, 65, 85);
  doc.roundedRect(30, 105, 150, 110, 4, 4, 'F');
  
  doc.setFillColor(217, 119, 6);
  doc.circle(105, 160, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ELEGANCE', 105, 158, { align: 'center' });
  doc.setFontSize(10);
  doc.text('COLLECTION', 105, 166, { align: 'center' });

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Odkryj najnowszą kolekcję luksusowych mebli do salonu, sypialni i biura.', 105, 240, { align: 'center' });
  doc.text('Wydanie Wiosna / Lato • Nr 1/2026', 105, 250, { align: 'center' });

  // PAGE 2: TABLE OF CONTENTS & EDITORIAL
  doc.addPage();
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SPIS TREŚCI & EDITORIAL', 20, 30);

  doc.setFillColor(217, 119, 6);
  doc.rect(20, 35, 40, 2, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Witaj w nowym wydaniu katalogu Modern Living. Naszą misją jest tworzenie mebli,', 20, 48);
  doc.text('które łączą w sobie ponadczasową estetykę z najwyższą ergonomią użycia.', 20, 54);

  // TOC list
  const tocItems = [
    { page: '03', title: 'Kolekcja Sof & Foteli Velvet', desc: 'Minimalizm i aksamitna miękkość do salonu' },
    { page: '04', title: 'Stoły Jadalniane Dębowe', desc: 'Naturalne drewno z unikalnym usłojeniem' },
    { page: '05', title: 'Oświetlenie Designerskie', desc: 'Lampy wiszące i stojące z powłoką mosiężną' },
    { page: '06', title: 'Ergonomiczne Strefy Pracy', desc: 'Biurka regulowane i fotele gabinetowe Premium' },
  ];

  let yPos = 75;
  tocItems.forEach((item) => {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, yPos, 170, 22, 3, 3, 'F');
    
    doc.setFillColor(217, 119, 6);
    doc.roundedRect(25, yPos + 4, 18, 14, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(item.page, 34, yPos + 13, { align: 'center' });

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text(item.title, 48, yPos + 10);
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(item.desc, 48, yPos + 17);

    yPos += 28;
  });

  // Highlight box at bottom
  doc.setFillColor(224, 231, 255);
  doc.roundedRect(20, 210, 170, 50, 4, 4, 'F');
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('GWARANCJA JAKOŚCI & BEZPŁATNA DOSTAWA', 30, 225);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Wszystkie nasze meble objęte są 5-letnią gwarancją producenta oraz bezpłatnym transportem z wniesieniem na terenie całej Polski.', 30, 235, { maxWidth: 150 });

  // PAGE 3: SOFAS & ARMCHAIRS
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('KOLEKCJA SOF & FOTELI 2026', 20, 25);

  drawProductCard(doc, 20, 38, 80, 110, 'Sofa Velvet Royal', 'Aksamitna 3-osobowa', '4 899 PLN', 'HIT', [241, 245, 249]);
  drawProductCard(doc, 110, 38, 80, 110, 'Fotel Oslo Lounge', 'Skóra naturalna Cognac', '2 499 PLN', 'NOWOŚĆ', [241, 245, 249]);
  drawProductCard(doc, 20, 160, 80, 110, 'Narożnik Modular Nordic', 'Tkanina hydrofobowa', '6 200 PLN', 'SALE', [241, 245, 249]);
  drawProductCard(doc, 110, 160, 80, 110, 'Puf Loft Minimal', 'Szeroki podnóżek', '799 PLN', '', [241, 245, 249]);

  // PAGE 4: DINING TABLES
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('STOŁY & KRZESŁA JADALNIANE', 20, 25);

  drawProductCard(doc, 20, 38, 80, 110, 'Stół Dębowy Artisan', 'Lite drewno 220x100cm', '5 499 PLN', 'HIT', [254, 243, 199]);
  drawProductCard(doc, 110, 38, 80, 110, 'Krzesło Velvet Curve', 'Złota podstawa mosiężna', '699 PLN', 'NOWOŚĆ', [254, 243, 199]);
  drawProductCard(doc, 20, 160, 80, 110, 'Stół Okrągły Marble', 'Amonitowy marmur Carrara', '7 800 PLN', 'PREMIUM', [254, 243, 199]);
  drawProductCard(doc, 110, 160, 80, 110, 'Komoda Wood Sculpt', 'Frezowany dąb czarny', '3 999 PLN', '', [254, 243, 199]);

  // PAGE 5: LIGHTING & ACCENTS
  doc.addPage();
  doc.setFillColor(15, 23, 42); // Dark page for lighting showcase
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('OŚWIETLENIE & AKCESORIA', 20, 25);

  doc.setTextColor(217, 119, 6);
  doc.setFontSize(10);
  doc.text('BUDOWAJ NASTRÓJ ŚWIATŁEM I DETALAMI', 20, 32);

  drawProductCard(doc, 20, 42, 80, 110, 'Lampa Aura Sphere', 'Mosiądz + Szkło Mleczne', '1 299 PLN', 'NOWOŚĆ', [30, 41, 59]);
  drawProductCard(doc, 110, 42, 80, 110, 'Lampa Stojąca Eclipse', 'LED z regulacją barwy', '1 899 PLN', 'HIT', [30, 41, 59]);
  drawProductCard(doc, 20, 162, 80, 110, 'Lustro Arc Brass', 'Średnica 110cm ze złotą ramą', '1 199 PLN', '', [30, 41, 59]);
  drawProductCard(doc, 110, 162, 80, 110, 'Kinkiet Minimal Line', 'Matowa czarny stal', '450 PLN', 'PROMOCJA', [30, 41, 59]);

  // PAGE 6: BACK COVER / CONTACT & ORDERING
  doc.addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setFillColor(217, 119, 6);
  doc.rect(20, 40, 170, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('MODERN LIVING 2026', 105, 65, { align: 'center' });

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Dziękujemy za zapoznanie się z naszym katalogiem.', 105, 80, { align: 'center' });

  // Contact details box
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(30, 100, 150, 120, 4, 4, 'F');

  doc.setTextColor(217, 119, 6);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SALONY STACJONARNE & ZAMÓWIENIA', 105, 118, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Infolinia zamówień: +48 800 123 456', 45, 140);
  doc.text('E-mail: kontakt@modernliving2026.pl', 45, 150);
  doc.text('Strona www: www.modernliving2026.pl', 45, 160);
  doc.text('Flagowy Showroom: Warszawa, ul. Marszałkowska 100', 45, 170);
  doc.text('Godziny otwarcia: Pon - Sob: 10:00 - 20:00', 45, 180);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.text('© 2026 Modern Living Sp. z o.o. Wszelkie prawa zastrzeżone.', 105, 260, { align: 'center' });

  return new Uint8Array(doc.output('arraybuffer'));
}

export function createTechCatalogPdf(): Uint8Array {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // COVER
  doc.setFillColor(9, 9, 11);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setFillColor(99, 102, 241); // Indigo Accent
  doc.rect(0, 0, 210, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(38);
  doc.setFont('helvetica', 'bold');
  doc.text('FUTURE TECH', 105, 75, { align: 'center' });

  doc.setTextColor(99, 102, 241);
  doc.setFontSize(16);
  doc.text('INNOWACJE & GADŻETY 2026', 105, 90, { align: 'center' });

  doc.setFillColor(24, 24, 27);
  doc.roundedRect(30, 110, 150, 110, 4, 4, 'F');

  doc.setFillColor(99, 102, 241);
  doc.roundedRect(70, 145, 70, 40, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AI READY', 105, 168, { align: 'center' });

  doc.setTextColor(161, 161, 170);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Smartfony • Laptopy • Słuchawki TWS • Smartwatch AI', 105, 245, { align: 'center' });

  // PAGE 2: SMARTPHONES & TABLETS
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FLAGOWE SMARTFONY & TABLETY', 20, 28);

  drawProductCard(doc, 20, 42, 80, 110, 'Quantum Phone Pro', 'Procesor AI 3nm 16GB', '5 299 PLN', 'HIT', [238, 242, 255]);
  drawProductCard(doc, 110, 42, 80, 110, 'Fold Vision Ultra', 'Składany ekran OLED 120Hz', '7 999 PLN', 'NOWOŚĆ', [238, 242, 255]);
  drawProductCard(doc, 20, 162, 80, 110, 'Tab Creator 14"', 'Rysik ze stopniem nacisku 8K', '3 499 PLN', '', [238, 242, 255]);
  drawProductCard(doc, 110, 162, 80, 110, 'Watch Ultra Sync', 'Tytanowa koperta + ANC', '1 899 PLN', 'PROMOCJA', [238, 242, 255]);

  // PAGE 3: AUDIO & WEARABLES
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('AUDIO HI-RES & WEARABLES', 20, 28);

  drawProductCard(doc, 20, 42, 80, 110, 'Acoustic Sound ANC', 'Bezprzewodowe wokółuszne', '1 499 PLN', 'HIT', [243, 244, 246]);
  drawProductCard(doc, 110, 42, 80, 110, 'Buds Spatial Audio', 'TWS z przetwornikiem planarnym', '899 PLN', 'NOWOŚĆ', [243, 244, 246]);
  drawProductCard(doc, 20, 162, 80, 110, 'Smart Ring Health', 'Monitor snu i tętna ze stali 316L', '1 199 PLN', 'HIT', [243, 244, 246]);
  drawProductCard(doc, 110, 162, 80, 110, 'Gogle VR Vision 360', 'Rozdzielczość 4K na oko', '4 200 PLN', 'PREMIUM', [243, 244, 246]);

  // PAGE 4: BACK COVER
  doc.addPage();
  doc.setFillColor(9, 9, 11);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('FUTURE TECH 2026', 105, 100, { align: 'center' });

  doc.setTextColor(99, 102, 241);
  doc.setFontSize(14);
  doc.text('www.futuretech2026.pl', 105, 120, { align: 'center' });

  return new Uint8Array(doc.output('arraybuffer'));
}

export const SAMPLE_CATALOGS = [
  {
    id: 'sample-furniture',
    title: 'Modern Living 2026',
    subtitle: 'Katalog Mebli & Luksusowego Designu',
    category: 'Wnętrza & Meble',
    coverBg: 'from-slate-900 to-amber-950',
    totalPages: 6,
    generatePdf: createFurnitureCatalogPdf,
  },
  {
    id: 'sample-tech',
    title: 'FutureTech Innowacje',
    subtitle: 'Nowości Elektroniki & AI Gadżetów',
    category: 'Technologia & AI',
    coverBg: 'from-zinc-900 to-indigo-950',
    totalPages: 4,
    generatePdf: createTechCatalogPdf,
  },
];
