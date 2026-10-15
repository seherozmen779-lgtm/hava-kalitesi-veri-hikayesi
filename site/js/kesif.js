(function () {
  const sec = document.getElementById("kesif");
  if (!sec) return;
  const RENK1 = "#0072B2", RENK2 = "#D55E00";

  d3.csv("data/city_year_pm25.csv", d => ({ ad: d.yerlesim, yil: +d.yil, pm25: +d.pm25 })).then(rows => {
    const adlar = Array.from(new Set(rows.map(d => d.ad))).sort((a, b) => a.localeCompare(b, "tr"));
    const seri = d3.group(rows, d => d.ad);

    const yer1 = e("select", { id: "k-yer1" }, adlar.map(a => e("option", { value: a, text: a })));
    yer1.value = adlar.includes("Istanbul") ? "Istanbul" : adlar[0];
    const yer2 = e("select", { id: "k-yer2" }, e("option", { value: "", text: "Yok" }),
      adlar.map(a => e("option", { value: a, text: a })));
    const aralik = e("input", { type: "range", id: "k-yil", min: 2015, max: 2023, step: 1, value: 2015 });
    const yilCikti = e("output", { for: "k-yil", text: "2015" });
    const who = e("input", { type: "checkbox", id: "k-who", checked: "" });

    const form = e("form", { class: "kontroller", "aria-label": "Grafik ayarları" },
      e("fieldset", {},
        e("legend", { text: "Grafiği ayarlayın" }),
        e("p", {}, e("label", { for: "k-yer1", text: "Yerleşim" }), yer1),
        e("p", {}, e("label", { for: "k-yer2", text: "Karşılaştır (isteğe bağlı)" }), yer2),
        e("p", {}, e("label", { for: "k-yil", text: "Başlangıç yılı" }), aralik, yilCikti),
        e("p", {}, e("label", { for: "k-who", class: "onay" }, who, " WHO rehber değerini göster"))
      ));
    form.addEventListener("submit", ev => ev.preventDefault());

    const fig = e("figure", { class: "kesif-fig" },
      e("h3", { id: "k-baslik", "aria-live": "polite" }),
      e("figcaption", { class: "kaynak",
        text: "Seçtiğiniz yerleşimlerin yıllık ortalama PM2.5 değeri (µg/m³). Yalnızca ölçüm kapsaması yeterli (en az %75) yıllar gösterilir; eksik yıllarda çizgi mevcut noktaları birleştirir. Kaynak: WHO Ambient Air Quality Database v8.0 (Haziran 2026)." }));
    const svg = d3.select(fig).insert("svg", "figcaption").attr("role", "img");

    sec.append(form, fig);

    function cumle(s) {
      if (s.pts.length < 2) return `${s.ad}: seçilen aralıkta yeterli ölçüm yok`;
      const f = s.pts[0], l = s.pts[s.pts.length - 1];
      return `${s.ad}: ${f.yil}: ${f1(f.pm25)} → ${l.yil}: ${f1(l.pm25)} µg/m³ (rehber değerin ${f1(l.pm25 / REHBER)} katı)`;
    }

    function ciz() {
      const a1 = yer1.value, a2 = yer2.value, y0 = +aralik.value, goster = who.checked;
      yilCikti.textContent = y0;
      const secili = [{ ad: a1, renk: RENK1, sek: "daire" }];
      if (a2 && a2 !== a1) secili.push({ ad: a2, renk: RENK2, sek: "kare" });
      secili.forEach(s => {
        s.pts = (seri.get(s.ad) || []).filter(d => d.yil >= y0).sort((a, b) => a.yil - b.yil);
      });

      const W = Math.max(300, fig.clientWidth), H = Math.round(Math.min(400, Math.max(270, W * 0.62)));
      svg.attr("width", W).attr("height", H);
      svg.selectAll("*").remove();
      const m = { t: 22, r: 16, b: 44, l: 46 };
      const iw = W - m.l - m.r, ih = H - m.t - m.b;
      const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);

      const tum = secili.flatMap(s => s.pts);
      const ymax = Math.max(10, d3.max(tum, d => d.pm25) || 10, goster ? REHBER : 0);
      const x = d3.scaleLinear().domain([y0, 2024]).range([0, iw]);
      const y = d3.scaleLinear().domain([0, ymax * 1.1]).nice().range([ih, 0]);

      g.append("g").attr("class", "eksen").attr("transform", `translate(0,${ih})`)
        .call(d3.axisBottom(x).tickValues(d3.range(y0, 2025).filter((d, i) => W >= 520 || i % 2 === 0))
          .tickFormat(d3.format("d")).tickSizeOuter(0));
      g.append("g").attr("class", "eksen").call(d3.axisLeft(y).ticks(6).tickFormat(f0).tickSizeOuter(0));
      svg.append("text").attr("class", "etiket").attr("transform", `translate(14,${m.t + ih / 2}) rotate(-90)`)
        .attr("text-anchor", "middle").text("PM2.5 (µg/m³)");
      svg.append("text").attr("class", "etiket").attr("x", m.l + iw / 2).attr("y", H - 6)
        .attr("text-anchor", "middle").text("Yıl");

      if (goster) {
        g.append("line").attr("x1", 0).attr("x2", iw).attr("y1", y(REHBER)).attr("y2", y(REHBER))
          .attr("stroke", "#111").attr("stroke-width", 1.5).attr("stroke-dasharray", "6 4");
        g.append("text").attr("class", "halo").attr("x", 6).attr("y", y(REHBER) - 7).text("WHO rehber değeri: 5 µg/m³");
      }

      const line = d3.line().x(d => x(d.yil)).y(d => y(d.pm25));
      secili.forEach(s => {
        if (s.pts.length > 1) {
          g.append("path").datum(s.pts).attr("d", line).attr("fill", "none").attr("stroke", s.renk)
            .attr("stroke-width", 2.5).attr("stroke-dasharray", s.sek === "kare" ? "7 4" : null);
        }
        s.pts.forEach(p => {
          if (s.sek === "kare") {
            g.append("rect").attr("x", x(p.yil) - 4).attr("y", y(p.pm25) - 4).attr("width", 8).attr("height", 8).attr("fill", s.renk);
          } else {
            g.append("circle").attr("cx", x(p.yil)).attr("cy", y(p.pm25)).attr("r", 4.5).attr("fill", s.renk);
          }
        });
        if (s.pts.length) {
          const l = s.pts[s.pts.length - 1];
          g.append("text").attr("class", "halo").attr("x", x(l.yil)).attr("y", y(l.pm25) - 10)
            .attr("text-anchor", "end").text(s.ad);
        }
      });

      const baslik = secili.map(cumle).join(" — ");
      d3.select("#k-baslik").text(baslik);
      svg.attr("aria-label", "Çizgi grafik. " + baslik);
    }

    [yer1, yer2, who].forEach(el => el.addEventListener("change", ciz));
    aralik.addEventListener("input", ciz);
    let zaman;
    window.addEventListener("resize", () => { clearTimeout(zaman); zaman = setTimeout(ciz, 200); });
    ciz();
  }).catch(err => {
    sec.append(e("p", { text: "Keşif grafiği yüklenemedi: " + err }));
  });
})();