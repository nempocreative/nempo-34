export type ModuleSpec = { title: string; description: string; endpoint?: string; fields?: Array<{ key: string; label: string; type?: 'textarea' | 'number' | 'checkbox' | 'date' | 'url'; required?: boolean }>; readonly?: boolean };
type FieldDefinition = NonNullable<ModuleSpec['fields']>[number];
const fields = (...items: FieldDefinition[]) => items;
export const modules: Record<string, ModuleSpec> = {
  wisata: { title: 'Wisata', description: 'Kelola informasi destinasi dan layanan wisata Garut.', fields: fields(
    {key:'name',label:'Nama destinasi',required:true},{key:'slug',label:'Slug'},{key:'category',label:'Kategori'},{key:'entry_fee',label:'Harga tiket masuk',type:'number'},
    {key:'image',label:'URL foto',type:'url'},{key:'location',label:'Lokasi',required:true},{key:'description',label:'Deskripsi',type:'textarea'},
    {key:'opening_hours',label:'Jam operasional'},{key:'phone',label:'Telepon'},{key:'website',label:'Website',type:'url'},
    {key:'facilities',label:'Fasilitas'},{key:'google_maps_url',label:'Google Maps',type:'url'},{key:'instagram',label:'Instagram'},{key:'partner',label:'Mitra',type:'checkbox'}) },
  kuliner: { title:'Kuliner', description:'Perbarui data tempat makan dan kuliner lokal.', fields: fields(
    {key:'name',label:'Nama',required:true},{key:'category',label:'Kategori'},{key:'image',label:'URL foto',type:'url'},{key:'location',label:'Lokasi',required:true},
    {key:'description',label:'Deskripsi',type:'textarea'},{key:'featured',label:'Unggulan',type:'checkbox'},{key:'hours',label:'Jam buka'},
    {key:'price_range',label:'Kisaran harga'},{key:'phone',label:'Telepon'},{key:'google_maps_url',label:'Google Maps',type:'url'},{key:'instagram',label:'Instagram'}) },
  cafe: { title:'Cafe', description:'Kelola listing cafe, jam buka, dan informasi kunjungan.', fields: fields(
    {key:'name',label:'Nama cafe',required:true},{key:'category',label:'Kategori'},{key:'image',label:'URL foto',type:'url'},{key:'location',label:'Lokasi',required:true},
    {key:'description',label:'Deskripsi',type:'textarea'},{key:'featured',label:'Unggulan',type:'checkbox'},{key:'hours',label:'Jam buka'},
    {key:'price_range',label:'Kisaran harga'},{key:'phone',label:'Telepon'},{key:'google_maps_url',label:'Google Maps',type:'url'},{key:'instagram',label:'Instagram'}) },
  penginapan: { title:'Penginapan', description:'Pastikan informasi akomodasi tetap akurat.', fields: fields(
    {key:'name',label:'Nama',required:true},{key:'slug',label:'Slug'},{key:'category',label:'Kategori'},{key:'location',label:'Lokasi',required:true},
    {key:'description',label:'Deskripsi',type:'textarea'},{key:'image',label:'URL foto',type:'url'},{key:'facilities',label:'Fasilitas'},{key:'phone',label:'Telepon'}) },
  events: { title:'Event', description:'Kelola agenda dan informasi acara Garut.', fields: fields(
    {key:'title',label:'Judul acara',required:true},{key:'slug',label:'Slug'},{key:'start_date',label:'Mulai',type:'date'},{key:'end_date',label:'Selesai',type:'date'},
    {key:'venue',label:'Tempat'},{key:'location',label:'Lokasi'},{key:'description',label:'Deskripsi',type:'textarea'},{key:'status',label:'Status'},
    {key:'image',label:'URL gambar',type:'url'}) },
  berita: { title:'Berita & Artikel', description:'Tinjau dan kelola kabar lokal untuk publik Garut.', fields: fields(
    {key:'title',label:'Judul',required:true},{key:'slug',label:'Slug'},{key:'excerpt',label:'Ringkasan',type:'textarea'},{key:'content',label:'Isi berita',type:'textarea'},
    {key:'category',label:'Kategori'},{key:'source',label:'Sumber'},{key:'source_url',label:'URL sumber',type:'url'},{key:'status',label:'Status'},
    {key:'published_at',label:'Tanggal publikasi',type:'date'},{key:'image',label:'URL gambar',type:'url'}) },
  banners: {title:'Banner Beranda',description:'Kelola banner utama yang tampil pada aplikasi Garut.',fields:fields({key:'title',label:'Judul',required:true},{key:'image',label:'URL gambar',type:'url'},{key:'url',label:'Tautan',type:'url'},{key:'active',label:'Aktif',type:'checkbox'},{key:'sort_order',label:'Urutan',type:'number'})},
  'promo-banners': {title:'Banner Promo',description:'Kelola materi promosi berukuran ringkas.',fields:fields({key:'title',label:'Judul',required:true},{key:'image',label:'URL gambar',type:'url'},{key:'url',label:'Tautan',type:'url'},{key:'active',label:'Aktif',type:'checkbox'},{key:'sort_order',label:'Urutan',type:'number'})},
  partners: {title:'Mitra Kami',description:'Kelola mitra dan tautan yang tampil pada platform.',fields:fields({key:'name',label:'Nama mitra',required:true},{key:'logo',label:'URL logo',type:'url'},{key:'link',label:'Tautan',type:'url'},{key:'category',label:'Kategori'},{key:'active',label:'Aktif',type:'checkbox'})},
  'event-orders':{title:'Pesanan Tiket',description:'Pantau dan proses pesanan tiket acara.',endpoint:'/api/event-orders',readonly:true},
  'jajan-yuk':{title:'Pesanan & Menu',description:'Kelola menu merchant dan pesanan Jajan YUK.',endpoint:'/api/admin/jajan-yuk/merchants',readonly:true},
  'ticket-scanner':{title:'Scan Tiket Masuk',description:'Validasi kode tiket pada layanan tiket Garut.',readonly:true},
  'user-rewards':{title:'Poin & Reward',description:'Pantau reward pengguna.',endpoint:'/api/admin/user-rewards',readonly:true},
  reviews:{title:'Ulasan & Rating',description:'Pantau masukan publik pada listing.',endpoint:'/api/admin/reviews',readonly:true},
  'settings':{title:'Pengaturan',description:'Pengaturan CMS Nempo Organizer Garut.',endpoint:'/api/admin/settings'},
  'backup':{title:'Backup Data',description:'Ekspor atau pulihkan data layanan CMS.',readonly:true},
};
const titles: Record<string,string> = {
  vouchers:'Voucher & Kupon','kamus-sunda':'Kamus Sunda',transportasi:'Transportasi','price-list':'Daftar Harga',partnership:'Kerja Sama',
  'digital-services':'Layanan Digital',notifications:'Notifikasi',users:'Daftar User',mitra:'Akun Mitra',donations:'Donasi Bibit',
  influencers:'Influencer & Kreator','talent':'Talent Studio','talent-portfolio':'Karya Talent','talent-banner':'Banner Talent',
  'influencer-banner-photos':'Foto Banner Influencer',
};
for (const [slug,title] of Object.entries(titles)) modules[slug] = { title, description:`Kelola data ${title.toLocaleLowerCase('id-ID')} pada layanan Garut.` };
export const navGroups = [
  {label:'NEMPO ORGANIZER',items:[['Dashboard','/'],['Banner Beranda','/banners'],['Banner Promo','/promo-banners'],['Mitra Kami','/partners'],['Wisata','/wisata'],['Kuliner','/kuliner'],['Cafe','/cafe'],['Penginapan','/penginapan'],['Event','/events'],['Pesanan Tiket','/event-orders'],['Scan Tiket','/ticket-scanner'],['Berita & Artikel','/berita'],['Influencer','/influencers'],['Foto Banner Influencer','/influencer-banner-photos'],['Talent Studio','/talent'],['Karya Talent','/talent-portfolio'],['Banner Talent','/talent-banner'],['Kerja Sama','/partnership']]},
  {label:'OPERASIONAL',items:[['Pesanan & Menu','/jajan-yuk']]},
  {label:'FITUR GARUT',items:[['Voucher & Kupon','/vouchers'],['Kamus Sunda','/kamus-sunda'],['Transportasi','/transportasi'],['Daftar Harga','/price-list'],['Layanan Digital','/digital-services'],['Donasi Bibit','/donations']]},
  {label:'MANAJEMEN',items:[['Daftar User','/users'],['Akun Mitra','/mitra'],['Poin & Reward','/user-rewards'],['Ulasan & Rating','/reviews']]},
  {label:'SISTEM',items:[['Notifikasi','/notifications'],['Backup Data','/backup'],['Pengaturan','/settings']]},
];
