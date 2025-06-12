import { useRouter } from 'next/router';
import { useState } from 'react';

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
      <form role="search" onSubmit={handleSubmit}>
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari berita..."
        />
      </form>
    </div>
  );
}
