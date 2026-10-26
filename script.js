// =====================================================
// AYO MAIN HITUNG — game matematika awal anak 3–6 tahun
// =====================================================

// ---------- 1. ALAT BANTU ----------
const app = document.getElementById("app");
const $ = selektor => document.querySelector(selektor);

// angka acak dari a sampai b (termasuk keduanya)
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
// ambil satu isi daftar secara acak
const pick = daftar => daftar[rnd(0, daftar.length - 1)];
// acak urutan daftar
const acak = daftar => daftar.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
// tulis emoji sebanyak n kali, contoh: ulang("🍎", 3) → 🍎🍎🍎
const ulang = (emoji, n) => Array.from({ length: n }, () => `<span>${emoji}</span>`).join("");
// tiga pilihan angka berbeda, salah satunya jawaban benar
function tigaAngka(benar, maks) {
  const s = new Set([benar]);
  while (s.size < 3) s.add(rnd(1, maks));
  return acak([...s]);
}

// ---------- 2. DATA ----------
const BENDA = ["🍎", "🍌", "🍓", "🐟", "🐥", "🚗", "🦋", "🍪"];
const WARNA = ["🔴", "🔵", "🟡", "🟢", "🟣"];
const BENTUK = [
  { emoji: "🔴", nama: "lingkaran" },
  { emoji: "🟦", nama: "persegi" },
  { emoji: "🔺", nama: "segitiga" },
  { emoji: "⭐", nama: "bintang" }
];
const PUJIAN = ["Hebat!", "Pintar!", "Betul!"];
const TIPS = [
  "Biarkan anak mencoba sendiri dulu, bantu dengan pertanyaan, bukan jawaban.",
  "Tanyakan “Kamu tahu dari mana?” supaya anak menjelaskan caranya.",
  "Ulangi dengan benda nyata: balok, tutup botol, atau kancing, lalu hitung bersama.",
  "Hitung sambil menunjuk satu per satu supaya anak paham satu angka untuk satu benda."
];
const SOAL_PER_RONDE = 5;

// ---------- 3. KEADAAN (state) ----------
const S = {
  maks: 5,        // angka terbesar: 5 (3–4 tahun) atau 10 (5–6 tahun)
  suara: true,    // suara menyala atau mati
  game: null,     // permainan yang sedang dipilih
  soal: 0,        // jumlah soal yang sudah dijawab benar
  kunci: false    // true = tombol dikunci sebentar setelah jawaban benar
};

// ---------- 4. SUARA ----------
let audio;
function bunyi(frekuensi, durasi = 0.15) {
  try {
    audio = audio || new AudioContext();
    const osc = audio.createOscillator(), vol = audio.createGain();
    osc.frequency.value = frekuensi;
    vol.gain.value = 0.15;
    osc.connect(vol); vol.connect(audio.destination);
    osc.start(); osc.stop(audio.currentTime + durasi);
  } catch (e) { /* browser tanpa audio: abaikan */ }
}
function ucap(teks) {
  if (!S.suara) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(teks);
    u.lang = "id-ID"; u.rate = 0.85;
    speechSynthesis.speak(u);
  } catch (e) { /* tanpa suara: abaikan */ }
}
function bunyiBenar() { bunyi(660); setTimeout(() => bunyi(880), 150); }

// ---------- 5. DAFTAR PERMAINAN ----------
// Setiap permainan punya fungsi buat(maks) yang menghasilkan satu soal:
//   teks     = kalimat soal (juga dibacakan)
//   tampil   = HTML yang ditampilkan di atas pilihan
//   pilihan  = daftar jawaban { html, ok }  (ok = true kalau benar)
const GAME = {
  hitung: { ikon: "🍎", nama: "Hitung Benda", buat(maks) {
    const n = rnd(1, maks), e = pick(BENDA);
    return {
      teks: "Ada berapa? Hitung dulu ya!",
      tampil: `<div class="kelompok">${ulang(e, n)}</div>`,
      pilihan: tigaAngka(n, maks).map(x => ({ html: x, ok: x === n }))
    };
  } },

  cocok: { ikon: "🔢", nama: "Cocokkan Jumlah", buat(maks) {
    const n = rnd(1, maks), e = pick(BENDA);
    return {
      teks: `Mana yang jumlahnya ${n}?`,
      tampil: `<div class="angka-besar">${n}</div>`,
      pilihan: tigaAngka(n, maks).map(x => ({ html: `<div class="kelompok kecil">${ulang(e, x)}</div>`, ok: x === n }))
    };
  } },

  besar: { ikon: "🐘", nama: "Besar dan Kecil", buat(maks) {
    const e = pick(BENDA), cariBesar = Math.random() < 0.5;
    const ukuran = maks > 5 ? [40, 75, 110] : [48, 110];
    const target = cariBesar ? Math.max(...ukuran) : Math.min(...ukuran);
    return {
      teks: `Mana yang paling ${cariBesar ? "besar" : "kecil"}?`,
      tampil: "",
      pilihan: acak(ukuran).map(u => ({ html: `<span style="font-size:${u}px">${e}</span>`, ok: u === target }))
    };
  } },

  pola: { ikon: "🔴", nama: "Lanjutkan Pola", buat(maks) {
    const w = acak(WARNA);
    // pola: AB untuk 3–4 tahun; AB, AAB, atau ABB untuk 5–6 tahun
    const unit = maks > 5 ? pick([[0, 1], [0, 0, 1], [0, 1, 1]]) : [0, 1];
    const panjang = unit.length * 2 + rnd(1, unit.length);
    const urutan = Array.from({ length: panjang }, (_, i) => w[unit[i % unit.length]]);
    const jawab = urutan[panjang - 1];
    const salah = acak(w.filter(x => x !== jawab)).slice(0, 2);
    return {
      teks: "Warna apa yang selanjutnya?",
      tampil: `<div class="kelompok">${urutan.slice(0, -1).map(x => `<span>${x}</span>`).join("")}<span class="kotak-tanya">❓</span></div>`,
      pilihan: acak([jawab, ...salah]).map(x => ({ html: x, ok: x === jawab }))
    };
  } },

  bentuk: { ikon: "🔷", nama: "Kenali Bentuk", buat(maks) {
    const kumpulan = maks > 5 ? BENTUK : BENTUK.slice(0, 3);
    const target = pick(kumpulan);
    const tiga = acak(kumpulan).slice(0, 3);
    if (!tiga.includes(target)) tiga[0] = target;
    return {
      teks: `Mana yang bentuknya ${target.nama}?`,
      tampil: "",
      pilihan: acak(tiga).map(b => ({ html: b.emoji, ok: b === target }))
    };
  } },

  balok: { ikon: "🧱", nama: "Tumpuk Balok", buat(maks) {
    const n = rnd(2, maks);
    return { balok: n, teks: `Tumpuk ${n} balok! Tekan tombol dan hitung bersama.` };
  } }
};

// ---------- 6. TAMPILAN ----------
const kepala = () => `
  <div class="atas">
    <button class="btn btn-kecil" data-aksi="menu" aria-label="Kembali ke menu">🏠</button>
    <div class="bintang" aria-label="${S.soal} dari ${SOAL_PER_RONDE} soal selesai">${"⭐".repeat(S.soal)}${"☆".repeat(SOAL_PER_RONDE - S.soal)}</div>
    <button class="btn btn-kecil" data-aksi="ulang" aria-label="Dengarkan soal lagi">🔊</button>
  </div>`;

// --- Menu utama ---
function menu() {
  try { speechSynthesis.cancel(); } catch (e) {}
  app.innerHTML = `
    <h1>Ayo Main Hitung! 🧮</h1>
    <p>Pilih umur dulu, lalu pilih permainan.</p>
    <div class="baris">
      <button class="btn ${S.maks === 5 ? "aktif" : ""}" data-umur="5">👶 3–4 tahun</button>
      <button class="btn ${S.maks === 10 ? "aktif" : ""}" data-umur="10">🧒 5–6 tahun</button>
    </div>
    <div class="menu">
      ${Object.entries(GAME).map(([kunci, g]) =>
        `<button class="btn kartu-game" data-game="${kunci}"><span class="ikon">${g.ikon}</span>${g.nama}</button>`).join("")}
    </div>
    <div class="baris">
      <button class="btn btn-kecil" data-aksi="suara">${S.suara ? "🔊 Suara menyala" : "🔇 Suara mati"}</button>
    </div>
    <p class="catatan">Untuk pendamping: duduk di samping anak, biarkan anak mencoba dulu, lalu tanyakan “Kamu tahu dari mana?”</p>`;

  app.onclick = e => {
    const tombol = e.target.closest("button");
    if (!tombol) return;
    if (tombol.dataset.umur) { S.maks = Number(tombol.dataset.umur); menu(); }
    else if (tombol.dataset.game) { S.game = tombol.dataset.game; S.soal = 0; tanya(); }
    else if (tombol.dataset.aksi === "suara") { S.suara = !S.suara; menu(); }
  };
}

// --- Satu soal pilihan ganda ---
function tanya() {
  if (S.soal >= SOAL_PER_RONDE) return akhir();
  const q = GAME[S.game].buat(S.maks);
  S.kunci = false;
  if (q.balok) return tumpukBalok(q);

  app.innerHTML = `${kepala()}
    <h2>${q.teks}</h2>
    <div class="tampil">${q.tampil}</div>
    <div class="pilihan">
      ${q.pilihan.map((p, i) => `<button class="btn pilih" data-i="${i}">${p.html}</button>`).join("")}
    </div>`;
  ucap(q.teks);

  app.onclick = e => {
    const tombol = e.target.closest("button");
    if (!tombol) return;
    if (tombol.dataset.aksi === "menu") return menu();
    if (tombol.dataset.aksi === "ulang") return ucap(q.teks);
    if (tombol.dataset.i === undefined || S.kunci) return;

    if (q.pilihan[tombol.dataset.i].ok) {
      S.kunci = true;
      tombol.classList.add("benar");
      bunyiBenar();
      S.soal++;
      ucap(pick(PUJIAN));
      setTimeout(tanya, 1300);          // lanjut ke soal berikutnya
    } else {
      tombol.classList.add("salah");    // salah = tidak ada hukuman, boleh coba lagi
      bunyi(200, 0.25);
      ucap("Coba lagi ya");
      setTimeout(() => tombol.classList.remove("salah"), 500);
    }
  };
}

// --- Soal khusus: tumpuk balok ---
function tumpukBalok(q) {
  let jumlah = 0;
  const warna = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"];
  app.innerHTML = `${kepala()}
    <h2>${q.teks}</h2>
    <div class="menara" id="menara"></div>
    <button class="btn pilih" id="tambah" style="margin:auto;font-size:1.5rem">🧱 Tambah balok</button>`;
  ucap(q.teks);

  app.onclick = e => {
    const tombol = e.target.closest("button");
    if (!tombol) return;
    if (tombol.dataset.aksi === "menu") return menu();
    if (tombol.dataset.aksi === "ulang") return ucap(q.teks);
    if (tombol.id !== "tambah" || S.kunci) return;

    jumlah++;
    const b = document.createElement("div");
    b.className = "balok";
    b.style.background = warna[jumlah % 5];
    b.textContent = jumlah;
    $("#menara").appendChild(b);
    bunyi(300 + jumlah * 60, 0.1);
    ucap(String(jumlah));               // anak mendengar hitungan satu per satu

    if (jumlah === q.balok) {
      S.kunci = true;
      setTimeout(() => {
        bunyiBenar(); ucap(`Hebat! ${jumlah} balok`);
        S.soal++;
        setTimeout(tanya, 1800);
      }, 700);
    }
  };
}

// --- Layar akhir ronde ---
function akhir() {
  app.innerHTML = `
    <h1>Hebat sekali! 🎉</h1>
    <div class="bintang">⭐⭐⭐⭐⭐</div>
    <p>Kamu menyelesaikan “${GAME[S.game].nama}”.</p>
    <div class="baris">
      <button class="btn" data-aksi="lagi">🔁 Main lagi</button>
      <button class="btn" data-aksi="menu">🏠 Menu</button>
    </div>
    <p class="catatan">Tips pendamping: ${pick(TIPS)}</p>`;
  ucap("Hebat sekali! Kamu pintar!");
  bunyiBenar();

  for (let i = 0; i < 24; i++) {        // konfeti emoji
    const k = document.createElement("div");
    k.className = "konfeti";
    k.textContent = pick(["🎉", "⭐", "🎈", "✨", "🍬"]);
    k.style.left = rnd(0, 95) + "vw";
    k.style.animationDelay = Math.random() * 1.2 + "s";
    document.body.appendChild(k);
    setTimeout(() => k.remove(), 4000);
  }

  app.onclick = e => {
    const tombol = e.target.closest("button");
    if (!tombol) return;
    if (tombol.dataset.aksi === "lagi") { S.soal = 0; tanya(); }
    else if (tombol.dataset.aksi === "menu") menu();
  };
}

// ---------- 7. MULAI ----------
menu();
