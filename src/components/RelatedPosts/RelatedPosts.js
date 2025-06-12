// src/components/RelatedPosts/RelatedPosts.js

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import styles from './RelatedPosts.module.css';

// Query untuk mengambil post terkait
const GET_RELATED_POSTS = gql`
  query GetRelatedPosts($categoryIn: [ID!], $notIn: [ID!]) {
    posts(where: { categoryIn: $categoryIn, notIn: $notIn }, first: 3) {
      nodes {
        id
        title
        uri
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

export default function RelatedPosts({ categories, currentPostId }) {
  // Ambil ID dari kategori pertama untuk dijadikan acuan.
  // Pastikan categoryId terdefinisi sebelum digunakan di useQuery.
  const categoryId = categories?.[0]?.id;

  const { data, loading, error } = useQuery(GET_RELATED_POSTS, {
    // Pastikan useQuery hanya dijalankan jika categoryId ada
    skip: !categoryId,
    variables: {
      categoryIn: categoryId ? [categoryId] : [], // Cari post di dalam kategori ini
      notIn: [currentPostId],    // Kecualikan post yang sedang dibaca
    },
  });

  // Jika post tidak punya kategori, jangan tampilkan apa-apa
  if (!categories || categories.length === 0 || !categoryId) {
    return null;
  }

  if (loading) return <p>Loading related posts...</p>;
  if (error) return <p>Error loading related posts.</p>;

  const relatedPosts = data?.posts?.nodes;

  // Jika tidak ada post terkait, jangan tampilkan apa-apa
  if (!relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className={styles.relatedPostsSection}>
      <h2 className={styles.sectionTitle}>Related Posts</h2>
      <div className={styles.grid}>
        {relatedPosts.map((post) => (
          <div key={post.id} className={styles.card}>
            <Link href={post.uri} className={styles.imageLink}>
              <img
                src={post.featuredImage?.node.sourceUrl || '/placeholder-image.png'}
                alt={post.title}
                className={styles.featuredImage}
              />
            </Link>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>
                <Link href={post.uri}>
                  {post.title}
                </Link>
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}