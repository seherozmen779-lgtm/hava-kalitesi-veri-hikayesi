const I = ICERIK;

function e(etiket, ozellikler = {}, ...cocuklar) {
  const el = document.createElement(etiket);
  for (const [k, v] of Object.entries(ozellikler)) {
    if (k === "text") el.textContent = v;
    else el.setAttribute(k, v);
  }
  cocuklar.flat().forEach(c => el.append(c));
  return el;
}

const bolum = (id, baslik, ...icerik) =>
  e("section", { id, class: "metin" }, e("h2", { text: baslik }), ...icerik);

const hero = e("header", { class: "hero" },
  e("p", { class: "kicker", text: "Veri hikâyesi" }),
  e("h1", { text: I.baslik }),
  e("p", { class: "alt", text: I.altbaslik }),
  e("p", { class: "yazar", text: `${I.yazar} · ${I.tarih}` }),
  e("p", { class: "ipucu", text: "Aşağı kaydırın ↓" })
);

const adimListesi = e("ol", { class: "steps" },
  I.adimlar.map(t => e("li", { class: "step" }, e("p", { text: t }))));

const grafik = e("figure", { class: "sticky", id: "grafik" },
  e("h2", { id: "fig-baslik", "aria-live": "polite" }),
  e("figcaption", { class: "kaynak" }));

const scrolly = e("section", { id: "scrolly", "aria-label": "Kaydırmalı anlatı" }, adimListesi, grafik);

const main = e("main", {},
  bolum("baglam", "Neden önemli?", I.baglam.map(p => e("p", { text: p }))),
  scrolly,
  bolum("kesif", "Kendiniz keşfedin", e("p", { text: I.kesif })),
  bolum("sonuc", "Peki ne olmuş?", I.sonuc.map(p => e("p", { text: p }))),
  bolum("yontem", "Yöntem",
    e("ul", {}, I.yontem.map(([a, b]) => e("li", {}, e("strong", { text: a + ": " }), b))))
);

const alt = e("footer", { id: "yazar", class: "metin" },
  e("h2", { text: "Yazar" }),
  e("p", { text: I.yazarMetin }),
  e("ul", {}, I.baglantilar.map(([t, u]) => e("li", {}, e("a", { href: u, text: t }))))
);

document.body.append(hero, main, alt);