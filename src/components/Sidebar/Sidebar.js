// src/components/Sidebar/Sidebar.js (Versi Final Lengkap - 13 Juni 2025)

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Adsense from '../Adsense/Adsense'; // Pastikan menggunakan komponen kustom kita
import { useRouter } from 'next/router';
import styles from './Sidebar.module.css';

// Query untuk mengambil postingan (tidak perlu diubah)
const GET_POPULAR_POSTS = gql`
  query GetPopularPosts {
    posts(first: 20) {
      nodes {
        id
        title
        uri
        viewCount {
          viewCount
        }
      }
    }
  }
`;

export default function Sidebar() {
  const { data, loading, error } = useQuery(GET_POPULAR_POSTS);
  const router = useRouter();
  
  if (error) {
    console.error("Error fetching popular posts for sidebar:", error);
    return null;
  }
  
  const allPosts = data?.posts?.nodes ?? [];

  // Logika untuk mengurutkan dan mengambil 6 postingan teratas
  const sortedPopularPosts = [...allPosts]
    .sort((a, b) => (b.viewCount?.viewCount || 0) - (a.viewCount?.viewCount || 0))
    .slice(0, 6);

  return (
    <aside className={styles.sidebar}>
      {/* === WIDGET 1: TRENDING POSTS (TIDAK STICKY) === */}
      <div className={styles.widget}>
        <h3 className={styles.widgetTitle}>Trending</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ol className={styles.popularPostsList}>
            {sortedPopularPosts.map((post, index) => (
              <li key={post.id}>
                <span className={styles.postNumber}>0{index + 1}</span>
                <div className={styles.postInfo}>
                  <Link href={post.uri} className={styles.postTitle}>
                    {post.title}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* === WIDGET 2: IKLAN ADSENSE (STICKY) === */}
      {/* Perhatikan strukturnya: .widget dan .stickyWidget digabung */}
      <div className={`${styles.widget} ${styles.stickyWidget}`}>
        <div className={styles.adContainer}>
          <div className={styles.placeholderContent}>
             <div className={styles.placeholderLabel}>Advertisement</div>
          </div>
          <Adsense
            key={router.asPath}
            client="ca-pub-XXXXXXXXXXXXXXXX" 
            slot="YYYYYYYYYYYYYYYY"       
            style={{ display: 'block', width: '100%' }}
            format="auto"
            responsive="true"
          />
        </div>
      </div>
    </aside>
  );
}