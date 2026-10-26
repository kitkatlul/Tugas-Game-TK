# Ayo Main Hitung 🧮

Game matematika awal untuk anak usia 3–6 tahun: menghitung benda, mencocokkan jumlah,
membandingkan ukuran, melanjutkan pola, mengenali bentuk, dan menumpuk balok.

Situs statis (HTML, CSS, JavaScript). Tidak perlu install apa pun dan tidak ada build step.

## Struktur folder

```
kartu-hitung/
├── index.html        ← halaman utama (harus bernama index.html dan ada di folder paling luar)
├── css/
│   └── style.css     ← warna dan tampilan
├── js/
│   └── script.js     ← logika permainan
└── README.md
```

## Jalankan di komputer

Klik dua kali `index.html`, atau di VS Code pasang ekstensi **Live Server** lalu klik
kanan `index.html` > **Open with Live Server**.

## Deploy ke Vercel

**Cara A: lewat GitHub (disarankan)**
1. Buat repository baru di github.com, lalu upload isi folder ini (`index.html` harus berada di level paling luar repository).
2. Buka vercel.com, login dengan akun GitHub.
3. Klik **Add New > Project**, pilih repository tadi, lalu **Import**.
4. Framework Preset: **Other**. Build Command dan Output Directory dibiarkan kosong.
5. Klik **Deploy**. Tunggu sekitar setengah menit, lalu klik link `.vercel.app` yang muncul.

**Cara B: lewat terminal (Vercel CLI)**
```
npm install -g vercel
cd kartu-hitung
vercel login
vercel          # deploy percobaan (preview)
vercel --prod   # deploy ke alamat utama
```

## Mengubah isi game

- Warna: bagian `:root` di `css/style.css`.
- Emoji benda, warna pola, dan bentuk: bagian `DATA` di `js/script.js`.
- Jumlah soal per ronde: `SOAL_PER_RONDE` di `js/script.js`.
- Kalimat pujian dan tips pendamping: `PUJIAN` dan `TIPS`.
