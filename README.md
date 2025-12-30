# My Framework Dasar untuk PyQt6 Free

Ini adalah framework dasar untuk membuat aplikasi desktop menggunakan Python (PyQt6) sebagai backend dan HTML/JS sebagai frontend (UI).

## Struktur Project

- `src/main.py`: Entry point aplikasi (Window utama & konfigurasi WebEngine).
- `src/Controllers/Bridge.py`: Jembatan komunikasi antara Python dan JavaScript.
- `src/UI/`: Folder berisi file antarmuka (HTML, CSS, JS).

## Persyaratan (Requirements)

- Python 3.8 atau lebih baru.

## Cara Install (Installation)

1.  **Clone atau Download** repository ini ke komputer Anda.
2.  Buka terminal (Command Prompt atau PowerShell) dan arahkan ke folder project:
    ```bash
    cd d:\python\ProjectT
    ```
3.  **Install Dependencies** menggunakan `pip` dan file `requirements.txt` yang telah disediakan:
    ```bash
    pip install -r requirements.txt
    ```

## Cara Menjalankan Aplikasi

Setelah instalasi selesai, jalankan perintah berikut di terminal:

```bash
python src/main.py
```

## Fitur Utama

- **Hybrid UI**: Menggunakan teknologi web (HTML5/CSS3) untuk tampilan desktop.
- **Python Bridge**: Komunikasi dua arah antara Python dan JavaScript (Signal/Slot).
- **Custom Context Menu**: Menu klik kanan yang disesuaikan.