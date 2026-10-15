const TR = d3.formatLocale({ decimal: ",", thousands: ".", grouping: [3], currency: ["", ""] });
const f1 = TR.format(",.1f"), f0 = TR.format(",.0f");
const AZALT = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const SURE = AZALT ? 0 : 700;
const REHBER = 5;
const RENK = { dusen: "#0072B2", yukselen: "#D55E00", degismeyen: "#555555", gri: "#c4c4c4", medyan: "#111111" };
const KAYNAK = " Kaynak: WHO Ambient Air Quality Database v8.0 (Haziran 2026).";
const NOT0 = "Her çizgi bir yerleşim (2019–2024, en az 5 yıl ölçümü olanlar). PM2.5 yıllık ortalama, µg/m³." + KAYNAK;
const MOD = { cizgi: "ana", slope: "sl", kap: "kp", dis: "ds" };

let V = null, C = null, sonAdim = 0;
const scroller = scrollama();

Promise.all([
  d3.csv("data/city_year_pm25.csv"),
  d3.csv("data/city_trend.csv"),
  d3.csv("data/national_summary.csv"),
  d3.csv("data/coverage_by_year.csv")
]).then(([cy, trend, ulusal, kap]) => {
  const B = cy.filter(d => d.kume_B === "True" && +d.yil >= 2019)
              .map(d => ({ ad: d.yerlesim, yil: +d.yil, pm25: +d.pm25 }));
  const grupOf = new Map(trend.map(d => [d.yerlesim, d.grup]));
  const seriler = Array.from(d3.group(B, d => d.ad), ([ad, n]) => ({
    ad, grup: grupOf.get(ad), noktalar: n.sort((a, b) => a.yil - b.yil)
  }));
  const med = ulusal.filter(d => d.B_medyan !== "").map(d => ({ yil: +d.yil, pm25: +d.B_medyan }));
  const sayi = d3.rollup(trend, v => v.length, d => d.grup);
  const n24 = B.filter(d => d.yil === 2024);
  const erz = (seriler.find(s => s.ad === "Erzurum") || { noktalar: [] }).noktalar;
  const OZEL = ["Kesan", "Igdir", "Akyazi", "Duzce"];
  const dis = cy.filter(d => OZEL.includes(d.yerlesim)).map(d => ({ ad: d.yerlesim, yil: +d.yil, pm25: +d.pm25 }));

  V = {
    seriler, med, erz, toplam: trend.length,
    dusen: sayi.get("dusen") || 0, yukselen: sayi.get("yukselen") || 0, degismeyen: sayi.get("degismeyen") || 0,
    n24: n24.length, ustu: n24.filter(d => d.pm25 > REHBER).length,
    trend: trend.map(d => ({ ad: d.yerlesim, grup: d.grup, ilk: +d.ilk, son: +d.son })),
    kap: kap.map(d => ({ yil: +d.yil, dusuk: +d.dusuk, yeterli: +d.yeterli })),
    dis: Array.from(d3.group(dis, d => d.ad), ([ad, n]) => ({ ad, noktalar: n.sort((a, b) => a.yil - b.yil) }))
  };
  V.adimlar = adimlar();
  baslat();
}).catch(e => {
  document.getElementById("fig-baslik").textContent = "Veri yüklenemedi: " + e;
});

const GRI = { stroke: RENK.gri, w: 1.2, o: 0.8 };
const SOLUK = { stroke: RENK.gri, w: 1, o: 0.25 };
const vurgu = g => ({ stroke: RENK[g], w: 2.2, o: 0.95, dash: g === "degismeyen" ? "5 3" : null });

function adimlar() {
  const e = V.erz;
  const e19 = e.length ? e[0].pm25 : 0, e24 = e.length ? e[e.length - 1].pm25 : 0;
  const m19 = V.med[0].pm25, m24 = V.med[V.med.length - 1].pm25;
  const azalan = V.trend.filter(d => d.son < d.ilk).length;
  const k18 = V.kap.find(d => d.yil === 2018) || { dusuk: 0, yeterli: 0 };
  const nokta = ad => (V.dis.find(s => s.ad === ad) || { noktalar: [{ pm25: 0 }] }).noktalar;
  const k = nokta("Kesan"), ig = nokta("Igdir");
  return [
    { baslik: `PM2.5 medyanı 2019'da ${f1(m19)}, 2024'te ${f1(m24)} µg/m³`, stil: () => GRI, who: false, ann: false },
    { baslik: `2024'te ölçülen ${V.n24} yerleşimin ${V.ustu} tanesi WHO rehber değerinin (5 µg/m³) üstünde`, stil: () => GRI, who: true, ann: false },
    { baslik: `${V.dusen} yerleşimde PM2.5 düştü`, stil: d => d.grup === "dusen" ? vurgu("dusen") : SOLUK, who: true, ann: false,
      sayac: `Düşen: ${V.dusen} / ${V.toplam} yerleşim`, sayacRenk: RENK.dusen },
    { baslik: `${V.yukselen} yerleşimde PM2.5 arttı`, stil: d => d.grup === "yukselen" ? vurgu("yukselen") : SOLUK, who: true, ann: false,
      sayac: `Yükselen: ${V.yukselen} / ${V.toplam} yerleşim`, sayacRenk: RENK.yukselen },
    { baslik: `Erzurum'da PM2.5 2019'da ${f1(e19)}, 2024'te ${f1(e24)} µg/m³ ölçüldü`,
      stil: d => d.ad === "Erzurum" ? { stroke: RENK.dusen, w: 3.5, o: 1 } : { ...SOLUK, o: 0.18 }, who: true, ann: true },
    { baslik: `${V.degismeyen} yerleşimde belirgin bir değişim yok`, stil: d => d.grup === "degismeyen" ? vurgu("degismeyen") : SOLUK, who: true, ann: false,
      sayac: `Değişmeyen: ${V.degismeyen} / ${V.toplam} yerleşim`, sayacRenk: RENK.degismeyen },
    { baslik: `${V.toplam} yerleşimin ${azalan} tanesinde son ölçüm ilk ölçümden düşük`, mod: "slope",
      not: "Her çizgi bir yerleşimin ilk ölçümünü (2019 veya 2020) son ölçümüne (2024) bağlar. Mavi: düşen, turuncu: yükselen, kesikli gri: değişmeyen (eşik ±0,5 µg/m³/yıl). PM2.5, µg/m³." + KAYNAK },
    { baslik: `2018'de ölçümlerin ${k18.dusuk} / ${k18.dusuk + k18.yeterli} tanesi yetersiz kapsama nedeniyle elendi`, mod: "kap",
      not: "Her çubuk o yıl PM2.5 bildiren yerleşim ölçümü sayısı. Koyu: yeterli kapsama (yılın en az %75'i), açık: düşük kapsama, analizden çıkarıldı." + KAYNAK },
    { baslik: `Eğim analizine girmeyenler: Keşan ${f1(k[0].pm25)} → ${f1(k[k.length - 1].pm25)} µg/m³, Iğdır 2024'te ${f1(ig[ig.length - 1].pm25)}`, mod: "dis",
      not: "Keşan, Iğdır, Akyazı ve Düzce'nin 2019–2024'te beş yıldan az ölçümü olduğu için eğim analizinde yoktur. Yıllık PM2.5, µg/m³." + KAYNAK }
  ];
}

function kur() {
  d3.select("#grafik svg").remove();
  const svg = d3.select("#grafik").insert("svg", "figcaption").attr("role", "img");
  const kutu = svg.node().getBoundingClientRect();
  const W = kutu.width, H = kutu.height;
  if (!W || !H) return;
  const m = { t: 28, r: 14, b: 38, l: 44 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
  const x = d3.scaleLinear().domain([2019, 2024]).range([0, iw]);
  const y = d3.scaleLinear().domain([0, 60]).range([ih, 0]);
  const grup = () => g.append("g");

  const yEks = (p, sc, baslik) => {
    p.append("g").attr("class", "eksen").call(d3.axisLeft(sc).ticks(6).tickFormat(f0).tickSizeOuter(0));
    p.append("text").attr("class", "etiket").attr("transform", `translate(-34,${ih / 2}) rotate(-90)`).attr("text-anchor", "middle").text(baslik);
  };
  const xEks = (p, ax, baslik) => {
    p.append("g").attr("class", "eksen").attr("transform", `translate(0,${ih})`).call(ax.tickSizeOuter(0));
    p.append("text").attr("class", "etiket").attr("x", iw / 2).attr("y", ih + 32).attr("text-anchor", "middle").text(baslik);
  };
  const rehber = (p, x0, x1) => {
    p.append("line").attr("x1", x0).attr("x2", x1).attr("y1", y(REHBER)).attr("y2", y(REHBER))
      .attr("stroke", "#111").attr("stroke-width", 1.5).attr("stroke-dasharray", "6 4");
    p.append("text").attr("class", "halo").attr("x", x0 + 6).attr("y", y(REHBER) - 7).text("WHO rehber değeri: 5 µg/m³");
  };

  // 1) çizgi grafiği (adım 1–6)
  const ana = grup();
  yEks(ana, y, "PM2.5 (µg/m³)");
  xEks(ana, d3.axisBottom(x).tickValues([2019, 2020, 2021, 2022, 2023, 2024]).tickFormat(d3.format("d")), "Yıl");
  const line = d3.line().x(d => x(d.yil)).y(d => y(d.pm25));
  const cizgiler = ana.append("g").selectAll("path").data(V.seriler, d => d.ad).join("path")
    .attr("d", d => line(d.noktalar)).attr("fill", "none").attr("stroke-linejoin", "round").attr("stroke-linecap", "round")
    .attr("stroke", RENK.gri).attr("stroke-width", 1.2).attr("stroke-opacity", 0.8);
  const who = ana.append("g").attr("opacity", 0);
  rehber(who, 0, iw);
  const med = ana.append("path").datum(V.med).attr("d", line).attr("fill", "none")
    .attr("stroke", RENK.medyan).attr("stroke-width", 3.2).attr("stroke-linecap", "round");
  const sonM = V.med[V.med.length - 1];
  const medEtiket = ana.append("text").attr("class", "halo").attr("x", x(sonM.yil) - 4).attr("y", y(sonM.pm25) - 10)
    .attr("text-anchor", "end").text("Medyan");
  const ann = ana.append("g").attr("opacity", 0);
  if (V.erz.length) {
    [[V.erz[0], "start", 10], [V.erz[V.erz.length - 1], "end", -10]].forEach(([p, anc, dx]) => {
      ann.append("circle").attr("cx", x(p.yil)).attr("cy", y(p.pm25)).attr("r", 5).attr("fill", RENK.dusen).attr("stroke", "#fff").attr("stroke-width", 1.5);
      ann.append("text").attr("class", "halo").attr("x", x(p.yil) + dx).attr("y", y(p.pm25) - 8).attr("text-anchor", anc).text(`${p.yil}: ${f1(p.pm25)}`);
    });
  }
  const sayac = ana.append("text").attr("class", "halo").attr("x", iw).attr("y", -10).attr("text-anchor", "end");

  // 2) eğim grafiği (adım 7)
  const sl = grup().attr("opacity", 0);
  const xs = { ilk: iw * 0.18, son: iw * 0.82 };
  yEks(sl, y, "PM2.5 (µg/m³)");
  sl.append("text").attr("class", "etiket").attr("x", xs.ilk).attr("y", ih + 20).attr("text-anchor", "middle").text("İlk ölçüm (2019/2020)");
  sl.append("text").attr("class", "etiket").attr("x", xs.son).attr("y", ih + 20).attr("text-anchor", "middle").text("Son ölçüm (2024)");
  rehber(sl, xs.ilk - 20, xs.son + 20);
  V.trend.forEach(d => {
    sl.append("line").attr("x1", xs.ilk).attr("x2", xs.son).attr("y1", y(d.ilk)).attr("y2", y(d.son))
      .attr("stroke", RENK[d.grup]).attr("stroke-width", 1.8).attr("stroke-opacity", 0.75)
      .attr("stroke-dasharray", d.grup === "degismeyen" ? "5 3" : null);
  });
  sl.append("text").attr("class", "halo").attr("x", iw).attr("y", -10).attr("text-anchor", "end")
    .text("Mavi: düşen · Turuncu: yükselen · Kesikli gri: değişmeyen");

  // 3) kapsama (adım 8)
  const kp = grup().attr("opacity", 0);
  const xb = d3.scaleBand().domain(V.kap.map(d => d.yil)).range([0, iw]).padding(0.2);
  const yb = d3.scaleLinear().domain([0, d3.max(V.kap, d => d.yeterli + d.dusuk)]).nice().range([ih, 0]);
  yEks(kp, yb, "Ölçüm sayısı (yerleşim-yıl)");
  xEks(kp, d3.axisBottom(xb).tickFormat(d3.format("d")), "Yıl");
  kp.selectAll("rect.y").data(V.kap).join("rect").attr("x", d => xb(d.yil)).attr("width", xb.bandwidth())
    .attr("y", d => yb(d.yeterli)).attr("height", d => ih - yb(d.yeterli)).attr("fill", "#444");
  kp.selectAll("rect.d").data(V.kap).join("rect").attr("x", d => xb(d.yil)).attr("width", xb.bandwidth())
    .attr("y", d => yb(d.yeterli + d.dusuk)).attr("height", d => yb(d.yeterli) - yb(d.yeterli + d.dusuk))
    .attr("fill", "#e4e1da").attr("stroke", "#444").attr("stroke-dasharray", "3 2");
  kp.append("text").attr("class", "halo").attr("x", 4).attr("y", -10).text("Koyu: yeterli kapsama · Açık, kesikli: düşük kapsama (elendi)");

  // 4) eğim analizine girmeyenler (adım 9)
  const ds = grup().attr("opacity", 0);
  const xd = d3.scaleLinear().domain([2015, 2024]).range([0, iw]);
  yEks(ds, y, "PM2.5 (µg/m³)");
  xEks(ds, d3.axisBottom(xd).tickValues(d3.range(2015, 2025, 1)).tickFormat(d3.format("d")), "Yıl");
  rehber(ds, 0, iw);
  const ld = d3.line().x(d => xd(d.yil)).y(d => y(d.pm25));
  const AD = { Kesan: "Keşan", Igdir: "Iğdır", Akyazi: "Akyazı", Duzce: "Düzce" };
  V.dis.forEach((s, i) => {
    ds.append("path").datum(s.noktalar).attr("d", ld).attr("fill", "none").attr("stroke", "#333").attr("stroke-width", 2)
      .attr("stroke-dasharray", ["", "7 3", "2 3", "10 3 2 3"][i % 4]);
    const son = s.noktalar[s.noktalar.length - 1];
    ds.append("text").attr("class", "halo").attr("x", xd(son.yil) - 6).attr("y", y(son.pm25) - 8).attr("text-anchor", "end").text(AD[s.ad] || s.ad);
  });

  C = { svg, cizgiler, who, med, medEtiket, ann, sayac, ana, sl, kp, ds, adimlar: V.adimlar };
}

function guncelle(i) {
  sonAdim = i;
  if (!C) return;
  const a = C.adimlar[i], mod = a.mod || "cizgi";
  ["ana", "sl", "kp", "ds"].forEach(k => C[k].transition().duration(SURE).attr("opacity", k === MOD[mod] ? 1 : 0));
  if (mod === "cizgi") {
    C.cizgiler.transition().duration(SURE)
      .attr("stroke", d => a.stil(d).stroke).attr("stroke-width", d => a.stil(d).w).attr("stroke-opacity", d => a.stil(d).o);
    C.cizgiler.attr("stroke-dasharray", d => a.stil(d).dash || null);
    C.cizgiler.filter(d => a.stil(d).o > 0.5).raise();
    C.med.raise(); C.medEtiket.raise(); C.ann.raise(); C.sayac.raise();
    C.who.transition().duration(SURE).attr("opacity", a.who ? 1 : 0);
    C.ann.transition().duration(SURE).attr("opacity", a.ann ? 1 : 0);
    C.sayac.text(a.sayac || "").attr("fill", a.sayacRenk || "#111");
  }
  d3.select("#fig-baslik").text(a.baslik);
  d3.select("#grafik figcaption").text(a.not || NOT0);
  C.svg.attr("aria-label", "Grafik. " + a.baslik);
}

function baslat() {
  d3.select("#fig-baslik").text(V.adimlar[0].baslik);
  d3.select("#grafik figcaption").text(NOT0);
  kur();
  guncelle(0);
  scroller.setup({ step: ".step", offset: window.innerWidth < 800 ? 0.75 : 0.5 })
    .onStepEnter(({ index, element }) => {
      document.querySelectorAll(".step").forEach(s => s.classList.remove("is-active"));
      element.classList.add("is-active");
      guncelle(index);
    });
  let zamanlayici;
  window.addEventListener("resize", () => {
    clearTimeout(zamanlayici);
    zamanlayici = setTimeout(() => { kur(); guncelle(sonAdim); scroller.resize(); }, 200);
  });
}v 