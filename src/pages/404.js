import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './404.module.css';

export default function NotFoundPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?s=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.box}>
          <h1 className={styles.code}>404</h1>
          <h2 className={styles.message}>Page Not Found</h2>
          <p className={styles.description}>
            Sorry, the page you are looking for does not exist or has been moved.
          </p>

          {/* FORM PENCARIAN */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search articles..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>

          <Link href="/" className={styles.homeLink}>
            ← Back to Homepage
          </Link>
        </div>
      </main>
    </>
  );
}
