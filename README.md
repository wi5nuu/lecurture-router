# LectureRouter

Platform agregator materi kuliah dari seluruh dunia. Satu akses untuk semua materi kuliah.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI:** shadcn/ui (custom)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Theme:** next-themes (dark/light mode)

## Struktur Halaman

| Route | Halaman |
|-------|---------|
| `/` | Landing Page |
| `/dashboard` | Dashboard (setelah login) |
| `/materials/[id]` | Detail materi |
| `/providers` | Browse providers |
| `/providers/[id]` | Detail provider |
| `/pricing` | Harga & perbandingan |
| `/login` | Login |
| `/register` | Register |
| `/forgot-password` | Lupa password |

## Cara Menjalankan

```bash
npm install
npm run dev
```

## Cara Push ke GitHub

Jalankan file `push.bat` atau jalankan perintah berikut di terminal:

```bash
git remote add origin https://github.com/wi5nuu/lecurture-router.git
git push -u origin master
```
