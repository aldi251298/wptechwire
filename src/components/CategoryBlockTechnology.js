// components/CategoryBlockTechnology.js

import Link from 'next/link';
import styles from './CategoryBlockTechnology.module.css';

export default function CategoryBlockTechnology({ posts }) {
  if (!posts || posts.length === 0) return null;

  const mainPost = posts[0];
  const sidePosts = posts.slice(1, 4);

  return (
    <section className={styles.techBlock}>
      <h2 className={styles.title}>Technology</h2>
      <div className={styles.grid}>
        {/* Post besar */}
        <div className={styles.mainPost}>
          <Link href={mainPost.uri}>
            <img
              src={mainPost.featuredImage?.node.sourceUrl || '/placeholder-image.png'}
              alt={mainPost.title}
              className={styles.mainImage}
            />
            <h3 className={styles.mainTitle}>{mainPost.title}</h3>
          </Link>
        </div>

        {/* Post kecil */}
        <div className={styles.sidePosts}>
          {sidePosts.map((post) => (
            <div key={post.id} className={styles.sidePost}>
              <Link href={post.uri}>
                <img
                  src={post.featuredImage?.node.sourceUrl || '/placeholder-image.png'}
                  alt={post.title}
                  className={styles.sideImage}
                />
                <h4 className={styles.sideTitle}>{post.title}</h4>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
