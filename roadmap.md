# Roadmap

- [x] Setelah remix: 42 foto/audio/video dipindahkan ke penyimpanan proyek baru (ukuran byte identik), semua rujukan dialihkan, arsip 41 entri dicocokkan ulang, acara dan arsip dipulihkan ke basis data; beranda 52 gambar tampil tanpa gambar rusak, halaman acara menampilkan poster + bagian reservasi; 225 tes lulus.

- [x] Hero desktop halaman detail event: poster di kiri, panel teks (kategori, nama, ringkasan, tanggal, lokasi, bintang tamu, harga) di kanan; di HP tetap poster penuh dengan judul di bawah. Diukur di 1440, 890, dan 390; build lulus.

- [x] Poster event di halaman detail di desktop tidak lagi seukuran layar: tinggi dibatasi 420–540 px dengan poster utuh di tengah dan versi blur di samping; di HP tetap penuh. Diukur di 1440, 890, dan 390.




- [x] Perbaiki klik MusiComedy Night yang 404 karena tabel events kosong setelah impor; rincian dari beranda dipulihkan ke database, klik beranda → detail berhasil, gambar tampil, tanggal 4 November dan harga gratis terverifikasi, endpoint tiket 200 tanpa kuota rekaan.

- [x] Pulihkan 39 gambar dan 2 media dari proyek lama ke penyimpanan gambar Lovable; semua 41 checksum cocok, poster beranda tampil, arsip tercatat di database dan 5 tes backup lulus. Bucket publik Cloud diblokir kebijakan workspace; saat pindah proyek berkas tetap harus ditransfer bersama arsip.

- [x] Pengamanan awal: backup dikunci sampai otorisasi admin tersedia, pengaturan situs dan kontak pengirim berita tidak bisa dibaca publik, hanya tiket aktif dapat dibaca, unggahan pendaftaran langsung dikunci; perlindungan browser aktif, 8 tes lulus, akses tanpa izin ditolak dan beranda diperiksa.
- [ ] Tinjau hasil pemeriksaan keamanan menyeluruh — menunggu hasil pemindaian yang sedang berjalan; dua peringatan baca publik (talent dan voucher) masih tercatat.

- [ ] Kompres foto unggahan baru ke WebP dan periksa jalur unggahan serta ukuran hasilnya.

- [x] Pulihkan data MusiComedy Night setelah remix, betulkan alamat API dan daftar tiket; klik beranda → detail, banner, tanggal, Saduli Ragap serta daftar event berhasil diperiksa.

- [x] Business System: katalog resmi dipasang (7 sistem operasional, 8 sistem manajemen, 10 sistem industri, custom, 3 paket bundling, maintenance, ketentuan, FAQ, CTA WhatsApp); 43 tes lulus, tab, harga, dan tautan WhatsApp diperiksa di HP dan komputer.

- [x] Halaman talent dirapikan: kartu orang dihapus jadi penjelasan daftar, form line-up diringkas dan tombolnya membuka WhatsApp dengan pesan terisi otomatis; 4 tes lulus, diperiksa di HP dan komputer.

- [x] Event Liaison Officer Service: 3 tarif per orang, durasi, rincian, harga tambahan, dan catatan pengecualian transportasi/konsumsi/akomodasi di halaman EO; 14 tes lulus, kartu dan daftar tambahan diperiksa di HP dan komputer tanpa potongan.

- [x] Wedding Content Creator: 3 paket (Intimate, Essential, Exclusive), add-on, dan catatan transport sesuai rincian pengguna; 11 tes lulus, harga dan tampilan diperiksa di HP dan komputer.

- [x] Rapikan halaman Web Development selaras EO/WO; tampilkan 5 paket website dan biaya tambahan sesuai rincian terbaru pengguna; semua pilihan, konsultasi paket, FAQ, serta tampilan HP/komputer diperiksa, 27 tes lulus.

- [x] Slide 32: keterangan 15 kartu foto berupa ajakan event (ayo joged bareng, seru-seruan bareng, nyanyi bareng, dll); semua terbaca penuh tanpa terpotong.

- [x] Slide 32: 15 foto asli Good Story Cafe (SJL01871/83/86/87/93/96/98, 01945/55/59/65/70, 01970_2, 01974/80) dalam tumpukan kartu, 2 detik per foto; foto AI lama dihapus.







- [x] Tambah slide 32 memakai poster slide 31; pilihan kedua slide dan tampilan ponsel diperiksa, semua gambar tampil.

- [x] Rapikan Design Creative selaras halaman layanan terbaru, tanpa oranye; tampilkan 15 harga desain, 3 paket bulanan, dan ketentuan terbaru pengguna; periksa harga dan tombol di HP/komputer.

- [x] Rapikan Sosmed Management selaras halaman lain: hero biru + marquee, tab paket bulanan, kartu layanan tambahan, paket promosi event, cara kerja, FAQ, CTA WhatsApp; galeri portofolio ikut tema biru; diperiksa di HP/komputer, 10 tes harga lulus.

- [x] Remix terbaru: migration salinan sudah bersih (jurnal kosong, tanpa file SQL/snapshot, schema.ts placeholder); database tidak diubah.

- [x] Perbagus contoh sosmed: 6 kategori, 12 tone, 108 desain AI; galeri, ganti tone, perbesar desain dan tampilan ponsel diperiksa.

- [x] Rapikan sampul pratinjau 16 tema: memakai sampul undangan asli, proporsi tetap tanpa potongan, kartu sejajar; diperiksa pada lebar 320, 390, 768, 950, 1280, dan 1920, filter dan pembukaan undangan berhasil, 17 tes tema lolos.

- [x] NEMPO 16: Merah Marun Tanpa Foto dengan cartoon beranimasi, acara, cerita, RSVP, kado dan kalender pratinjau; animasi, kalender, ucapan, kartu tema dan tampilan ponsel/komputer diperiksa, 76 tes lolos.

- [x] NEMPO 15: Merah Marun Adat Foto, acara, cerita, galeri, RSVP, kado dan kalender pratinjau; galeri, kalender, ucapan, kartu tema dan tampilan ponsel/komputer diperiksa, 75 tes lolos.

- [x] NEMPO 14: Rose Dusty Tanpa Foto dengan cartoon beranimasi, cerita, acara, RSVP, kado dan kalender pratinjau; animasi, kalender, ucapan, kartu tema dan tampilan ponsel/komputer diperiksa, 74 tes lolos.

- [x] NEMPO 13: Rose Dusty Adat Foto, acara, cerita, galeri, RSVP, kado dan kalender pratinjau; galeri, kalender, ucapan, kartu tema dan tampilan ponsel/komputer diperiksa, 73 tes lolos.

- [x] NEMPO 12: Biru Taman Tanpa Foto dengan cartoon pengantin beranimasi, acara, cerita, RSVP, kado dan kalender pratinjau; animasi, kalender, ucapan, kartu tema dan tampilan ponsel/komputer diperiksa.

- [x] NEMPO 11: Biru Taman Foto, acara, cerita, galeri, RSVP, kado dan kalender pratinjau; galeri, kalender, ucapan, kartu tema dan tampilan ponsel/komputer diperiksa.

- [x] NEMPO 10: Hitam Mewah Tanpa Foto dengan cartoon pengantin beranimasi, acara, cerita, RSVP, kado dan kalender pratinjau; animasi, kalender, ucapan, kartu tema dan tampilan ponsel/komputer diperiksa.

- [x] NEMPO 09: Hitam Mewah Foto, acara, cerita, galeri, RSVP, kado dan kalender pratinjau; kalender, galeri, ucapan, kartu tema dan tampilan ponsel/komputer diperiksa.

- [x] NEMPO 08: Mocca Hangat Tanpa Foto dengan cartoon beranimasi, acara, cerita, RSVP, kado dan kalender pratinjau; animasi, kalender, ucapan dan kartu tema diperiksa.

- [x] NEMPO 07: Mocca Hangat Foto, desain botanical vintage, acara, cerita, galeri, RSVP, dan kado pratinjau; kartu tema, kalender, ucapan, dan tampilan ponsel/komputer diperiksa.

- [x] Periksa migration remix terbaru: migration salinan sudah kosong, jurnal tanpa entri, database tidak diubah.

- [x] NEMPO 06: Navy Elegan Tanpa Foto dengan cartoon pengantin beranimasi, acara, cerita, RSVP, dan kado contoh.

- [x] NEMPO 06: sampul dua kolom di layar besar, ilustrasi cerita tersendiri, bingkai lengkung mempelai dengan bayangan, dan nama file kalender yang benar.

- [x] NEMPO 05: Navy Elegan Foto, desain tersendiri, acara, cerita, galeri, RSVP, dan kado pratinjau.

- [x] NEMPO 04: undangan Peach Klasik Tanpa Foto dengan ilustrasi taman bergerak, acara, cerita, RSVP, dan kado contoh.

- [x] NEMPO 03: desain Peach Klasik Foto, galeri, acara, cerita, dan RSVP pratinjau.

- [x] Tambah musik latar dan kartu hadiah rekening/QRIS contoh di NEMPO 01; data pembayaran asli menunggu pengguna.

- [x] Ganti foto NEMPO 01 dengan pasangan AI berbusana biru dan ivory, termasuk galeri dan kartu tema.

- [x] Lengkapi NEMPO 01 dengan cerita, kalender, galeri, RSVP dan ucapan contoh, serta animasi halus.

- [x] Perbagus NEMPO 01 sesuai kategori Spesial Foto dan tema Biru Bunga, memakai foto yang tersedia.

- [x] Periksa migration kosong setelah remix, tanpa mengubah database.

- [x] Beri setiap tema undangan kode berurutan NEMPO 01 dan seterusnya, tetap sama saat difilter.

- [x] Tambah kategori tema undangan sesuai referensi, dengan pilihan foto dan tanpa foto yang bisa dibuka.

- [x] Hapus unduhan moodboard dari studio wedding, tetap pertahankan konsultasi WhatsApp.

- [x] Rapikan judul dan pilihan studio wedding supaya ringkas dan sejajar.

- [x] Ganti ikon makeup dengan ikon sesuai gaya, termasuk Barbie tanpa bintang.

- [x] Tambah foto ilustrasi contoh untuk kelima gaya makeup pengantin.

- [x] Tambah jenis makeup Barbie, Bold, Natural, Soft Glam, Korean beserta pilihan konsultasi dan moodboard.

- [x] Tambah pilihan khusus gaun dengan jas senada dalam empat tone, manekin tanpa wajah, konsultasi dan moodboard.

- [x] Studio wedding: setiap kebaya didampingi busana pria senada di semua tone, termasuk moodboard.

- [x] Foto pasangan busana tanpa wajah/orang, hanya pajangan baju lengkap.

- [x] Manekin busana berleher tertutup dengan knop kuningan seperti referensi, tanpa wajah; ujung baju tidak diubah.

- [x] Tambah pilihan inspirasi dekor pelaminan, kebaya, tone warna, dan konsep acara di Wedding Organizer, dengan rangkuman konsultasi WhatsApp.

- [x] Migrate nempo-5 code into this project

- [x] Migrate nempo-10 code + 18 tables into this project

- [x] Recreate 18 database tables in Lovable Cloud

- [x] Migrate nempo-15 code + recreate 18 tables in Lovable Cloud

- [ ] Import existing data — waiting for backup JSON from old app's /backup page

- [x] Check remix-of-nempo-5 (older copy of nempo-5; nempo-5 used as source)

- [ ] Login user & admin panel, Midtrans payments, SMTP email (carried over from old roadmap)

- [x] Tambah event portofolio: Night Out Maxi (Temu Space), Color The Beat (Biang), Riuh Rona (Maru), Opening GGS (GGS Beauty)

- [ ] Foto acara untuk kartu portofolio — menunggu foto dari pengguna

- [x] Mitra Kami: tambah GGS Beauty

- [x] Footer & teks "tentang": ubah dari nada wisata ke layanan kreatif/organizer

- [x] Testimoni EO: 14 orang, nama + bagian saja, tanpa nama perusahaan

- [x] Bersihkan migration Drizzle yang tersalin dari remix, set migration kosong baru (tabel di database tetap ada)

- [x] Studio wedding: pilih tone warna langsung mengubah warna foto dekor pelaminan dan kebaya

- [x] Studio wedding: foto dekor & kebaya versi asli per tone (4 tone × 4 dekor × 3 kebaya, tanpa tint CSS)

- [x] Studio wedding: tambah pilihan tone warna, dekor, dan kebaya

- [x] Studio wedding: transisi hover, penanda dipilih, dan ringkasan yang muncul dengan animasi

- [x] Studio wedding: mode bandingkan — empat kombinasi tone + dekor + kebaya berdampingan

- [x] Studio wedding: foto tampil penuh sesuai aslinya, tidak terpotong

- [x] NEMPO 02: sampul berbingkai di layar besar, bagian cerita, rundown dua kolom, dan navigasi baru

- [x] NEMPO 03: undangan Peach Klasik (Premium Vintage Foto) — sampul foto, mempelai, acara, cerita, galeri+lightbox, RSVP, kado, navigasi bawah

- [x] NEMPO 04: tema tanpa foto pakai animasi cartoon pengantin (bagian mempelai, cerita, dan kartu tema)

- [x] Nempo Feed slide 32: tombol unduh video MP4 (30 detik, 1080×1440, 30 fps) hasil render persis seperti pratinjau

- [x] Musik jingle tidak berhenti saat pindah halaman

- [x] Menu di footer dihapus (desktop & mobile); daftar 9 layanan tetap ada di menu hamburger mobile

- [x] Grid team mobile: 2 card per baris, tidak terpotong

- [ ] Bilah ikon bawah mobile diganti sesuai menu terbaru (user: "nanti aja")

- [x] Studio konsep wedding: bilah geser (scrollbar) di baris Pelaminan / Kebaya & Beskap / Khusus Gaun & Jas disembunyikan di mobile, tetap bisa digeser

- [x] Studio konsep wedding (mobile): baris Pelaminan / Kebaya & Beskap / Khusus Gaun & Jas jadi kartu 2 kolom, semua pilihan terlihat, ada centang di pilihan aktif

- [x] Sosmed Management: 3 paket bulanan detail (Basic Rp750rb, Growth Rp1,5jt = Promo UMKM, Professional Rp2,5jt) + daftar Layanan Tambahan

- [x] Sosmed Management: warna "kue" dihapus — latar halaman biru muda, garis kartu biru, ikon aksen biru, tombol menu aktif biru, portofolio di panel navy dengan cover tone dingin

- [x] Business System: desain disamakan dengan halaman layanan lain (hero biru, marquee, kartu bergaris putus-putus, panel navy) — isi & harga tetap

- [x] Sosmed Management: tema pink kue (hero rose, latar pink muda, kartu & ikon warna kue, panel portofolio merah muda tua, cover portofolio tone hangat, pill menu pink)

- [x] Home: judul bagian tim disatukan jadi "Nempo Creative Team" (satu judul utama; nama grup jadi label kecil)

- [x] Loading awal (splash): brand "Nempo ORGANIZER" + tagline "Wedding, event & layanan kreatif / Dari konsep sampai hari-H"; teks progress "Menyiapkan acaramu…"; PageLoader merek disamakan

- [x] Tim beranda: 7 foto baru dipasang (wajah tetap, jas navy + kaus putih, tangan dilipat, latar biru muda; 7 perbandingan wajah asli-vs-hasil diperiksa); baris tim bisa digeser sentuh, jalan otomatis, dan ada tanda "GESER" di komputer — diperiksa di HP dan komputer tanpa error.

- [x] Tim beranda: foto yang tidak diminta dihapus (Maya/Faris/Laras/Evan + 10 ilustrasi "creator"); baris kini hanya 12 potret asli, semua termuat penuh, build OK.

- [x] Tim beranda: foto ke-13 (kiriman 20.47.07) dipasang — wajah dicocokkan dengan aslinya, jas navy + kaus putih, tangan sedekap, latar biru muda; baris tim kini 13 potret asli, semua termuat, build OK.

- [x] Recruitment: tanpa ikon/logo bintang; pilihan minat jadi Designer, Web Developer, Content Creator, Videografer dan Fotographer, Marketing, Event Management; kirim formulir langsung ke WhatsApp.

- [x] Notifikasi: 12 isi diambil dari konten situs sendiri (acara portofolio, recruitment, harga paket, kanal kontak); panel lonceng dan halaman /notifikasi bisa diklik ke halaman aslinya; 7 tes lulus.

- [x] Home: kartu "Event Mendatang" dibuat membentang selebar layar di desktop (1216×362) — poster utuh 3:4 di kiri, judul+deskripsi di tengah, panel Tanggal/Lokasi/Harga di kanan; di HP tetap poster di atas lalu teks.

- [x] Home: bagian "Upcoming Event" dihapus (dobel dengan "Event Mendatang" di atasnya); kode carousel Embla yang jadi tak terpakai ikut dibersihkan.

- [x] Event Mendatang: tulisan "bersama Saduli Ragap" dipasang di sampul (pill berikon mic di bawah judul + baris "Bintang Tamu" di panel kanan), dan bintang tamu yang sama masuk ke halaman detail event; 3 tes baru lulus, 195 tes lulus semua.

- [x] Remix 2 Nov: set migration sudah kosong (tidak ada yang perlu dibuang); data MusiComedy Night dikembalikan (4 Nov 2026, 15.00–23.00, Good Story Cafe, Saduli Ragap) + tiket Free Entry; beranda, /event, dan detail diperiksa.
- [x] Remix: set migration dicek ulang — masih kosong (nol file SQL, nol entri jurnal) jadi tidak ada file salinan yang perlu dibuang; database tetap 19 tabel jadi baseline.









- [x] Event detail banner: full width on desktop, uncropped
- [x] Remix 2 Nov (ulang): file SQL salinan 0000_nempo_schema + snapshot dihapus, jurnal dikosongkan, drizzle-kit check lolos; database tetap 19 tabel sebagai baseline.

- [ ] Rapikan reservasi Good Story Cafe: denah proporsional, pilihan nomor meja, jam 15.00–23.00 WIB dan WhatsApp; periksa alur pilihan meja.
- [x] Header: logo dikembalikan seperti semula; nama "Kala Muda Community" dipasang sebagai tombol di samping lonceng notifikasi dan membuka halaman Nempo Community (/komunitas); diperiksa di preview.

- [x] "Event mendatang" diklik memunculkan "event tidak ditemukan" karena tabel event kosong setelah remix; data MusiComedy Night dipasang kembali (4 November, Good Story Cafe, gratis, Saduli Ragap) dan klik beranda → detail diperiksa.
