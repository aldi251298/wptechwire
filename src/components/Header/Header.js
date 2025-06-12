// src/components/Header/Header.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Nav from './Nav';
import styles from './Header.module.css';

export default function Header() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?s=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <Link href="/">
              <img src="/logo.png" alt="Site Logo" className={styles.logoImage} />
            </Link>
          </div>

          {/* Search Form */}
          <div className={styles.searchContainer}>
    <form onSubmit={handleSubmit} className={styles.searchForm}>
  <div className={styles.searchBox}>
    <input
      type="search"
      placeholder="Search..."
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
    />
    <button type="submit" aria-label="Search"></button>
  </div>
</form>
            
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.navContainer}>
          <Nav />
        </div>
      </div>
    </header>
  );
}
