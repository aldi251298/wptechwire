import { useRouter } from 'next/router';
import { useState } from 'react';
// Import styles dari Header.module.css atau buat SearchForm.module.css terpisah
// Untuk saat ini, saya akan mengasumsikan styles diimpor dari Header.module.css
// Jika Anda ingin terpisah, buat file SearchForm.module.css dan definisikan styles.searchContainer & styles.searchForm di sana.
import styles from './Header/Header.module.css'; // Menggunakan styles dari Header.module.css

export default function SearchForm() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?s=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <form role="search" onSubmit={handleSubmit} className={styles.searchForm}> {/* Tambahkan className */}
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari berita..."
          className={styles.searchInput} 
        />
        {/* Tombol search bisa ditambahkan di sini jika ada desainnya */}
        {/* <button type="submit" className={styles.searchButton}>Cari</button> */}
      </form>
    </div>
  );
}