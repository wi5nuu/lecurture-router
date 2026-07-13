export interface Material {
  id: string;
  title: string;
  source: string;
  provider: string;
  course: string;
  format: "PDF" | "Video" | "Slide" | "E-Book" | "Audio" | "Interactive";
  language: string;
  level: "S1" | "S2" | "S3" | "Umum";
  year: number;
  rating: number;
  reviewCount: number;
  price: "Gratis" | "Premium" | "Freemium";
  accessUrl: string;
  description: string;
  category: string;
  instructor: string;
  university: string;
  citations: number;
  tags: string[];
  thumbnail?: string;
}

export interface Provider {
  id: string;
  name: string;
  logo: string;
  description: string;
  totalMaterials: number;
  formats: string[];
  languages: string[];
  priceModel: "Gratis" | "Premium" | "Freemium" | "Mixed";
  rating: number;
  url: string;
  categories: string[];
  established: number;
  headquarters: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  materialCount: number;
  description: string;
  color: string;
}

export const categories: Category[] = [
  { id: "teknik", name: "Teknik", icon: "settings", materialCount: 284_000, description: "Teknik Sipil, Mesin, Elektro, Kimia, dan lainnya", color: "emerald" },
  { id: "kedokteran", name: "Kedokteran", icon: "heart-pulse", materialCount: 192_000, description: "Kedokteran Umum, Farmasi, Keperawatan, Gigi", color: "rose" },
  { id: "ekonomi", name: "Ekonomi & Bisnis", icon: "trending-up", materialCount: 215_000, description: "Manajemen, Akuntansi, Ekonomi, Marketing", color: "amber" },
  { id: "hukum", name: "Hukum", icon: "scale", materialCount: 98_000, description: "Hukum Perdata, Pidana, Tata Negara, Internasional", color: "violet" },
  { id: "sains", name: "Sains", icon: "flask-conical", materialCount: 312_000, description: "Fisika, Kimia, Biologi, Matematika, Statistika", color: "cyan" },
  { id: "sosial", name: "Ilmu Sosial", icon: "users", materialCount: 156_000, description: "Sosiologi, Psikologi, Antropologi, Politik", color: "orange" },
  { id: "bahasa", name: "Bahasa & Sastra", icon: "book-open", materialCount: 87_000, description: "Linguistik, Sastra, Penerjemahan, Filologi", color: "pink" },
  { id: "komputer", name: "Ilmu Komputer", icon: "monitor", materialCount: 421_000, description: "AI, Database, Jaringan, Keamanan Siber", color: "blue" },
  { id: "pendidikan", name: "Pendidikan", icon: "graduation-cap", materialCount: 74_000, description: "Pedagogi, Kurikulum, Psikologi Pendidikan", color: "teal" },
  { id: "seni", name: "Seni & Desain", icon: "palette", materialCount: 63_000, description: "Arsitektur, Desain Grafis, Musik, Film", color: "purple" },
  { id: "pertanian", name: "Pertanian", icon: "sprout", materialCount: 52_000, description: "Agroteknologi, Peternakan, Perikanan, Kehutanan", color: "green" },
  { id: "agama", name: "Agama & Filsafat", icon: "compass", materialCount: 41_000, description: "Studi Agama, Filsafat, Etika, Teologi", color: "indigo" },
];

export const providers: Provider[] = [
  { id: "mit-ocw", name: "MIT OpenCourseWare", logo: "/logos/mit.svg", description: "Materi kuliah gratis dari Massachusetts Institute of Technology, mencakup ribuan mata kuliah dari berbagai departemen.", totalMaterials: 2_580, formats: ["PDF", "Video", "Slide"], languages: ["Inggris"], priceModel: "Gratis", rating: 4.9, url: "https://ocw.mit.edu", categories: ["teknik", "sains", "komputer", "ekonomi"], established: 2002, headquarters: "Cambridge, AS" },
  { id: "coursera", name: "Coursera", logo: "/logos/coursera.svg", description: "Platform kursus online dengan materi dari 200+ universitas top dunia. Tersedia sertifikat dan gelar online.", totalMaterials: 7_640, formats: ["Video", "PDF", "Interactive"], languages: ["Inggris", "Spanyol", "Prancis", "Arab"], priceModel: "Freemium", rating: 4.7, url: "https://coursera.org", categories: ["teknik", "ekonomi", "sains", "sosial", "komputer"], established: 2012, headquarters: "Mountain View, AS" },
  { id: "edx", name: "edX", logo: "/logos/edx.svg", description: "Platform open-source course dari Harvard & MIT. Ratusan kursus dari universitas Ivy League.", totalMaterials: 4_200, formats: ["Video", "PDF", "Slide"], languages: ["Inggris", "Spanyol", "Mandarin"], priceModel: "Freemium", rating: 4.6, url: "https://edx.org", categories: ["teknik", "sains", "hukum", "ekonomi"], established: 2012, headquarters: "Cambridge, AS" },
  { id: "researchgate", name: "ResearchGate", logo: "/logos/researchgate.svg", description: "Jaringan sosial untuk peneliti. Akses ke 135+ juta publikasi ilmiah dari seluruh dunia.", totalMaterials: 135_000_000, formats: ["PDF", "E-Book"], languages: ["Inggris", "Jerman", "Prancis", "Spanyol", "Mandarin"], priceModel: "Gratis", rating: 4.5, url: "https://researchgate.net", categories: ["sains", "kedokteran", "teknik", "sosial"], established: 2008, headquarters: "Berlin, Jerman" },
  { id: "google-scholar", name: "Google Scholar", logo: "/logos/googlescholar.svg", description: "Mesin pencari literatur akademik terbesar. Indeks jurnal, proceeding, dan repositori institusi.", totalMaterials: 389_000_000, formats: ["PDF", "E-Book"], languages: ["Multibahasa"], priceModel: "Gratis", rating: 4.8, url: "https://scholar.google.com", categories: ["sains", "teknik", "kedokteran", "sosial", "hukum"], established: 2004, headquarters: "Mountain View, AS" },
  { id: "khan-academy", name: "Khan Academy", logo: "/logos/khan.svg", description: "Platform pembelajaran gratis dengan video interaktif dan latihan soal untuk semua level.", totalMaterials: 10_000, formats: ["Video", "Interactive"], languages: ["Inggris", "Spanyol", "Prancis", "Turki", "Arab", "Hindi"], priceModel: "Gratis", rating: 4.8, url: "https://khanacademy.org", categories: ["sains", "komputer", "bahasa", "pendidikan"], established: 2008, headquarters: "Mountain View, AS" },
  { id: "academia", name: "Academia.edu", logo: "/logos/academia.svg", description: "Platform berbagi paper akademik. 95+ juta paper dari peneliti di seluruh dunia.", totalMaterials: 95_000_000, formats: ["PDF", "E-Book"], languages: ["Inggris", "Spanyol", "Portugis", "Prancis"], priceModel: "Freemium", rating: 4.3, url: "https://academia.edu", categories: ["sains", "sosial", "hukum", "ekonomi"], established: 2008, headquarters: "San Francisco, AS" },
  { id: "udemy", name: "Udemy", logo: "/logos/udemy.svg", description: "Marketplace kursus online dengan 200k+ kursus dari instruktur independen.", totalMaterials: 210_000, formats: ["Video", "PDF", "Slide"], languages: ["Multibahasa"], priceModel: "Premium", rating: 4.4, url: "https://udemy.com", categories: ["komputer", "ekonomi", "seni", "bahasa"], established: 2010, headquarters: "San Francisco, AS" },
  { id: "ieee", name: "IEEE Xplore", logo: "/logos/ieee.svg", description: "Database riset teknologi dan teknik terbesar. Jurnal, konferensi, dan standar industri.", totalMaterials: 6_000_000, formats: ["PDF", "E-Book"], languages: ["Inggris"], priceModel: "Premium", rating: 4.9, url: "https://ieeexplore.ieee.org", categories: ["teknik", "komputer"], established: 2000, headquarters: "New York, AS" },
  { id: "springer", name: "SpringerLink", logo: "/logos/springer.svg", description: "Penerbit akademik terkemuka dengan 13+ juta jurnal, buku, dan protokol riset.", totalMaterials: 13_000_000, formats: ["PDF", "E-Book"], languages: ["Inggris", "Jerman"], priceModel: "Premium", rating: 4.7, url: "https://link.springer.com", categories: ["sains", "kedokteran", "teknik", "sosial"], established: 1842, headquarters: "Berlin, Jerman" },
  { id: "jstor", name: "JSTOR", logo: "/logos/jstor.svg", description: "Perpustakaan digital untuk riset akademik. Koleksi lengkap jurnal, buku, dan sumber primer.", totalMaterials: 12_000_000, formats: ["PDF", "E-Book"], languages: ["Inggris", "Prancis", "Jerman", "Spanyol"], priceModel: "Premium", rating: 4.6, url: "https://jstor.org", categories: ["sains", "sosial", "hukum", "ekonomi", "seni"], established: 1995, headquarters: "New York, AS" },
  { id: "youtube-edu", name: "YouTube Education", logo: "/logos/youtube.svg", description: "Ribuan video kuliah dan tutorial pendidikan gratis dari channel edukasi terkurasi.", totalMaterials: 5_000_000, formats: ["Video"], languages: ["Multibahasa"], priceModel: "Gratis", rating: 4.5, url: "https://youtube.com/education", categories: ["sains", "teknik", "komputer", "bahasa", "seni"], established: 2008, headquarters: "San Bruno, AS" },
];

export const materials: Material[] = [
  {
    id: "mat-001", title: "Introduction to Algorithms (CLRS) - Full Lecture Notes", source: "MIT OpenCourseWare", provider: "mit-ocw", course: "6.006 Introduction to Algorithms", format: "PDF", language: "Inggris", level: "S1", year: 2024, rating: 4.9, reviewCount: 1_284, price: "Gratis", accessUrl: "#", description: "Catatan kuliah lengkap untuk mata kuliah pengantar algoritma dari MIT. Mencakup analisis kompleksitas, sorting, graph algorithms, dynamic programming, dan NP-completeness.", category: "komputer", instructor: "Prof. Erik Demaine", university: "Massachusetts Institute of Technology", citations: 15_842, tags: ["algoritma", "python", "pemrograman", "kompleksitas"],
  },
  {
    id: "mat-002", title: "Machine Learning Specialization - Andrew Ng", source: "Coursera", provider: "coursera", course: "Machine Learning Specialization", format: "Video", language: "Inggris", level: "S1", year: 2024, rating: 4.8, reviewCount: 2_356, price: "Freemium", accessUrl: "#", description: "Spesialisasi Machine Learning oleh Andrew Ng dari Stanford. Mencakup supervised learning, neural networks, decision trees, clustering, dan recommender systems.", category: "komputer", instructor: "Andrew Ng", university: "Stanford University", citations: 8_941, tags: ["machine learning", "deep learning", "ai", "python"],
  },
  {
    id: "mat-003", title: "Principles of Economics - N. Gregory Mankiw", source: "Coursera", provider: "coursera", course: "Principles of Microeconomics", format: "E-Book", language: "Inggris", level: "S1", year: 2023, rating: 4.5, reviewCount: 892, price: "Premium", accessUrl: "#", description: "Buku teks ekonomi paling populer di dunia. Mencakup supply & demand, elastisitas, struktur pasar, dan kebijakan pemerintah.", category: "ekonomi", instructor: "N. Gregory Mankiw", university: "Harvard University", citations: 25_647, tags: ["ekonomi", "mikroekonomi", "bisnis"],
  },
  {
    id: "mat-004", title: "Human Anatomy Atlas - 3D Interactive", source: "YouTube Education", provider: "youtube-edu", course: "Human Anatomy & Physiology", format: "Video", language: "Inggris", level: "S1", year: 2024, rating: 4.7, reviewCount: 3_421, price: "Gratis", accessUrl: "#", description: "Atlas anatomi manusia interaktif 3D dengan narasi detail. Mencakup sistem skeleton, otot, saraf, kardiovaskular, dan organ vital.", category: "kedokteran", instructor: "Dr. John Campbell", university: "Visible Body", citations: 1_204, tags: ["anatomi", "kedokteran", "biologi", "3d"],
  },
  {
    id: "mat-005", title: "Advanced Quantum Mechanics - MIT 8.06", source: "MIT OpenCourseWare", provider: "mit-ocw", course: "8.06 Advanced Quantum Mechanics", format: "Slide", language: "Inggris", level: "S3", year: 2024, rating: 4.9, reviewCount: 567, price: "Gratis", accessUrl: "#", description: "Slide kuliah mekanika kuantum lanjutan dari MIT. Mencakup teori medan kuantum, partikel identik, dan aplikasi dalam fisika partikel.", category: "sains", instructor: "Prof. Barton Zwiebach", university: "Massachusetts Institute of Technology", citations: 6_823, tags: ["fisika", "kuantum", "mekanika"],
  },
  {
    id: "mat-006", title: "Legal Research & Writing - Harvard Law", source: "edX", provider: "edx", course: "Legal Research & Writing", format: "PDF", language: "Inggris", level: "S1", year: 2023, rating: 4.6, reviewCount: 723, price: "Freemium", accessUrl: "#", description: "Panduan komprehensif riset dan penulisan hukum dari Harvard Law School. Mencakup legal memo, brief, dan sitasi hukum.", category: "hukum", instructor: "Prof. Martha Minow", university: "Harvard Law School", citations: 3_412, tags: ["hukum", "riset", "legal writing"],
  },
  {
    id: "mat-007", title: "Structural Analysis & Design - Civil Engineering", source: "MIT OpenCourseWare", provider: "mit-ocw", course: "1.051 Structural Engineering Design", format: "PDF", language: "Inggris", level: "S2", year: 2024, rating: 4.7, reviewCount: 456, price: "Gratis", accessUrl: "#", description: "Analisis struktur bangunan, jembatan, dan infrastruktur. Mencakup metode elemen hingga, analisis gempa, dan desain beton bertulang.", category: "teknik", instructor: "Prof. John Ochsendorf", university: "Massachusetts Institute of Technology", citations: 4_215, tags: ["teknik sipil", "struktur", "desain"],
  },
  {
    id: "mat-008", title: "Introduction to Psychology - Yale PSYC 110", source: "YouTube Education", provider: "youtube-edu", course: "PSYC 110 Introduction to Psychology", format: "Video", language: "Inggris", level: "S1", year: 2023, rating: 4.8, reviewCount: 4_892, price: "Gratis", accessUrl: "#", description: "Rekaman kuliah pengantar psikologi dari Yale University oleh Prof. Paul Bloom. Mencakup neuroscience, perkembangan, sosial, dan klinis.", category: "sosial", instructor: "Prof. Paul Bloom", university: "Yale University", citations: 12_456, tags: ["psikologi", "sosial", "perilaku"],
  },
  {
    id: "mat-009", title: "Biological Chemistry - Molecular Biology", source: "ResearchGate", provider: "researchgate", course: "Biochemistry", format: "PDF", language: "Inggris", level: "S2", year: 2024, rating: 4.4, reviewCount: 342, price: "Gratis", accessUrl: "#", description: "Paper riset terkini dalam biokimia molekuler. Fokus pada mekanisme enzim, jalur metabolisme, dan regulasi gen.", category: "kedokteran", instructor: "Dr. Sarah Chen", university: "University of Cambridge", citations: 2_891, tags: ["biokimia", "molekuler", "biologi"],
  },
  {
    id: "mat-010", title: "Statistik Inferensial untuk Penelitian Sosial", source: "Google Scholar", provider: "google-scholar", course: "Statistika Sosial", format: "E-Book", language: "Indonesia", level: "S1", year: 2023, rating: 4.5, reviewCount: 678, price: "Gratis", accessUrl: "#", description: "Buku lengkap statistik inferensial untuk penelitian ilmu sosial. Mencakup regresi, ANOVA, chi-square, dan SPSS.", category: "sosial", instructor: "Prof. Budi Santoso", university: "Universitas Indonesia", citations: 1_876, tags: ["statistika", "spss", "riset", "sosial"],
  },
  {
    id: "mat-011", title: "Pengantar Kecerdasan Buatan - IF3170", source: "Academia.edu", provider: "academia", course: "IF3170 Kecerdasan Buatan", format: "Slide", language: "Indonesia", level: "S1", year: 2024, rating: 4.3, reviewCount: 234, price: "Gratis", accessUrl: "#", description: "Slide kuliah pengantar AI dari Institut Teknologi Bandung. Mencakup search, knowledge representation, machine learning, dan NLP.", category: "komputer", instructor: "Dr. Ayu Purwarianti", university: "Institut Teknologi Bandung", citations: 412, tags: ["ai", "kecerdasan buatan", "informatika"],
  },
  {
    id: "mat-012", title: "Financial Accounting - Full Course Bundle", source: "Udemy", provider: "udemy", course: "Financial Accounting Fundamentals", format: "Video", language: "Inggris", level: "S1", year: 2024, rating: 4.6, reviewCount: 1_567, price: "Premium", accessUrl: "#", description: "Kursus akuntansi keuangan lengkap dari dasar hingga mahir. Mencakup laporan keuangan, jurnal, neraca, dan analisis rasio.", category: "ekonomi", instructor: "Brian Ferris", university: "Independent Instructor", citations: 234, tags: ["akuntansi", "keuangan", "bisnis"],
  },
  {
    id: "mat-013", title: "Organic Chemistry - Khan Academy Masterclass", source: "Khan Academy", provider: "khan-academy", course: "Organic Chemistry", format: "Video", language: "Inggris", level: "S1", year: 2024, rating: 4.9, reviewCount: 6_234, price: "Gratis", accessUrl: "#", description: "Video pembelajaran kimia organik dari dasar hingga reaksi kompleks. Mencakup stereokimia, spektroskopi, dan sintesis.", category: "sains", instructor: "Sal Khan", university: "Khan Academy", citations: 3_567, tags: ["kimia", "organik", "reaksi"],
  },
  {
    id: "mat-014", title: "International Law - UN Treaties Collection", source: "JSTOR", provider: "jstor", course: "Public International Law", format: "E-Book", language: "Inggris", level: "S2", year: 2023, rating: 4.5, reviewCount: 445, price: "Premium", accessUrl: "#", description: "Koleksi lengkap traktat dan perjanjian internasional. Analisis hukum laut, HAM, hukum humaniter, dan penyelesaian sengketa.", category: "hukum", instructor: "Prof. Antonio Cassese", university: "University of Florence", citations: 8_912, tags: ["hukum internasional", "traktat", "pbb"],
  },
  {
    id: "mat-015", title: "Data Structures in C++ - Full Implementation", source: "IEEE Xplore", provider: "ieee", course: "Data Structures & Algorithms", format: "PDF", language: "Inggris", level: "S1", year: 2024, rating: 4.7, reviewCount: 891, price: "Premium", accessUrl: "#", description: "Implementasi lengkap struktur data dalam C++. Stack, queue, tree, graph, hash table, dan advanced data structures.", category: "komputer", instructor: "Dr. Mark Allen Weiss", university: "Florida International University", citations: 5_234, tags: ["struktur data", "c++", "pemrograman"],
  },
  {
    id: "mat-016", title: "Desain Arsitektur Parametrik dengan Grasshopper", source: "YouTube Education", provider: "youtube-edu", course: "Architectural Design Studio", format: "Video", language: "Indonesia", level: "S1", year: 2024, rating: 4.6, reviewCount: 1_234, price: "Gratis", accessUrl: "#", description: "Tutorial lengkap desain arsitektur parametrik menggunakan Grasshopper untuk Rhino. Mencakup algoritma generatif dan fabrikasi digital.", category: "seni", instructor: "Ir. Andi Gunawan, M.Arch", university: "Universitas Gadjah Mada", citations: 345, tags: ["arsitektur", "parametrik", "grasshopper", "desain"],
  },
  {
    id: "mat-017", title: "Filsafat Ilmu - Epistemologi Kontemporer", source: "Google Scholar", provider: "google-scholar", course: "Filsafat Ilmu", format: "PDF", language: "Indonesia", level: "S2", year: 2023, rating: 4.4, reviewCount: 312, price: "Gratis", accessUrl: "#", description: "Kajian epistemologi kontemporer dalam filsafat ilmu. Mencakup positivisme, hermeneutika, dan critical theory.", category: "agama", instructor: "Prof. Franz Magnis-Suseno", university: "Sekolah Tinggi Filsafat Driyarkara", citations: 2_156, tags: ["filsafat", "epistemologi", "ilmu"],
  },
  {
    id: "mat-018", title: "Soil Science & Agricultural Engineering", source: "SpringerLink", provider: "springer", course: "Soil Mechanics & Agriculture", format: "E-Book", language: "Inggris", level: "S1", year: 2023, rating: 4.5, reviewCount: 267, price: "Premium", accessUrl: "#", description: "Buku teks ilmu tanah dan teknik pertanian. Mencakup fisika tanah, kesuburan, irigasi, dan mekanisasi pertanian.", category: "pertanian", instructor: "Prof. Rattan Lal", university: "Ohio State University", citations: 18_456, tags: ["tanah", "pertanian", "agroteknologi"],
  },
  {
    id: "mat-019", title: "Second Language Acquisition Theories", source: "Academia.edu", provider: "academia", course: "TESOL & Applied Linguistics", format: "PDF", language: "Inggris", level: "S2", year: 2024, rating: 4.3, reviewCount: 189, price: "Gratis", accessUrl: "#", description: "Paper komprehensif tentang teori akuisisi bahasa kedua. Mencakup hipotesis Krashen, interlanguage, dan pengaruh L1.", category: "bahasa", instructor: "Dr. Rod Ellis", university: "University of Auckland", citations: 9_234, tags: ["linguistik", "tesol", "bahasa"],
  },
  {
    id: "mat-020", title: "Pedagogi Kritis - Paulo Freire", source: "ResearchGate", provider: "researchgate", course: "Philosophy of Education", format: "E-Book", language: "Indonesia", level: "S2", year: 2023, rating: 4.7, reviewCount: 534, price: "Gratis", accessUrl: "#", description: "Pendidikan sebagai praktik pembebasan. Analisis pedagogi kritis Freire dan aplikasinya dalam konteks pendidikan Indonesia.", category: "pendidikan", instructor: "Prof. Paulo Freire", university: "Universitas Indonesia", citations: 45_678, tags: ["pendidikan", "pedagogi", "kritis"],
  },
];

export const testimonials = [
  { id: 1, name: "Ahmad Fauzi", role: "Mahasiswa S1 Teknik Informatika", university: "Institut Teknologi Bandung", avatar: "AF", content: "LectureRouter mengubah cara saya belajar. Semua materi kuliah dari MIT, Stanford, dan universitas lain bisa saya akses dari satu tempat. Sangat membantu riset tugas akhir saya!", rating: 5 },
  { id: 2, name: "Dr. Sarah Wijaya", role: "Dosen Fakultas Kedokteran", university: "Universitas Gadjah Mada", content: "Sebagai dosen, saya sering mencari referensi jurnal dan video kuliah untuk bahan ajar. LectureRouter menghemat waktu saya berjam-jam setiap minggu.", rating: 5 },
  { id: 3, name: "Budi Hartono", role: "Mahasiswa S2 Ekonomi", university: "Universitas Indonesia", content: "Fitur perbandingan provider sangat membantu. Saya bisa memilih sumber materi terbaik dengan rating tertinggi tanpa harus registrasi satu-satu.", rating: 5 },
  { id: 4, name: "Maria Oentoro", role: "Peneliti & Dosen", university: "Universitas Airlangga", content: "Koleksi jurnalnya luar biasa. Dari IEEE, Springer, sampai JSTOR bisa diakses dari satu dashboard. Recommended untuk peneliti.", rating: 4 },
  { id: 5, name: "Rizky Pratama", role: "Mahasiswa S3 Fisika", university: "University of Tokyo", content: "Saya pakai LectureRouter hampir setiap hari. Fitur rekomendasi materi terkait sangat akurat, sering menemukan paper yang saya butuhkan.", rating: 5 },
  { id: 6, name: "Dr. Nina Puspita", role: "Kepala Perpustakaan", university: "Universitas Brawijaya", content: "Kami menggunakan paket Institution untuk seluruh kampus. Akses massal ke jutaan materi sangat menguntungkan mahasiswa dan dosen kami.", rating: 5 },
];

export const faqs = [
  { q: "Apa itu LectureRouter?", a: "LectureRouter adalah platform agregator yang menyediakan akses terpusat ke berbagai sumber materi kuliah dari seluruh dunia. Kami mengumpulkan tautan dan konten dari berbagai provider seperti MIT OCW, Coursera, ResearchGate, dan lainnya dalam satu dashboard yang mudah digunakan." },
  { q: "Apakah LectureRouter gratis?", a: "Ya. Kami memiliki tier gratis dengan akses ke ribuan materi open-source. Untuk akses penuh termasuk unduhan dan fitur premium, tersedia paket Student Pro dan Institution dengan harga yang sangat terjangkau." },
  { q: "Bagaimana cara LectureRouter berbeda dari Google Scholar?", a: "Google Scholar fokus pada pencarian paper/jurnal. LectureRouter mencakup lebih banyak format: video kuliah, slide, catatan mahasiswa, soal ujian, dan e-book. Kami juga menyediakan perbandingan provider, rating, dan rekomendasi personal." },
  { q: "Apakah materi di LectureRouter legal?", a: "Kami hanya mengindeks materi yang sudah bersifat open-access atau telah mendapatkan lisensi distribusi. Setiap materi mencantumkan sumber asli dan lisensinya. Kami tidak menghosting konten bajakan." },
  { q: "Bisakah saya berkontribusi menambahkan materi?", a: "Tentu! Mahasiswa dan dosen dapat mengunggah catatan kuliah, soal ujian, atau materi lain yang mereka miliki haknya. Setiap kontribusi akan direview tim kami sebelum dipublikasikan." },
  { q: "Apa saja format materi yang tersedia?", a: "Kami mendukung berbagai format: PDF (jurnal, paper, e-book), Video (kuliah, tutorial), Slide presentasi, Audio (podcast, rekaman kuliah), dan konten interaktif (quiz, simulator)." },
  { q: "Apakah ada fitur koleksi/simpan materi?", a: "Ya. Pengguna terdaftar dapat membuat koleksi pribadi, menyimpan materi favorit, dan membuat folder berdasarkan mata kuliah atau topik tertentu." },
  { q: "Bagaimana dengan institusi yang ingin berlangganan?", a: "Kami menyediakan paket Institution dengan fitur manajemen akses untuk seluruh civitas akademika, integrasi SSO, dan analitik penggunaan. Hubungi tim kami untuk demo." },
];

export const pricingTiers = [
  { id: "free", name: "Free", price: 0, description: "Akses terbatas untuk memulai perjalanan akademik Anda", features: ["Cari & jelajahi 10% materi", "Preview 3 halaman per dokumen", "Akses 5 materi/hari", "Rating dasar masyarakat", "Iklan ditampilkan"], cta: "Mulai Gratis", popular: false },
  { id: "student-pro", name: "Student Pro", price: 49_000, period: "bulan", description: "Untuk mahasiswa yang serius ingin sukses akademik", features: ["Akses penuh ke semua materi", "Unduh tak terbatas", "Simpan ke koleksi pribadi", "Tidak ada iklan", "Rekomendasi AI personal", "Riwayat pencarian", "Export sitasi (BibTeX/MLA/APA)", "Akses offline"], cta: "Langganan Student Pro", popular: true },
  { id: "institution", name: "Institution", price: "Custom", period: "tahun", description: "Solusi lengkap untuk universitas dan institusi pendidikan", features: ["Semua fitur Student Pro", "Akses massal tak terbatas", "Manajemen pengguna admin", "Integrasi SSO/LDAP", "Analitik & laporan penggunaan", "API akses khusus", "Dedicated support", "Kustomisasi branding", "Workshop & training"], cta: "Hubungi Kami", popular: false },
];
