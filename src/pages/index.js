// src/wp-templates/front-page.js

import { gql, useQuery } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../wp-templates/front-page.module.css';

// Query tidak berubah
const GET_HOMEPAGE_DATA = gql`
  query GetHomepageData($first: Int!, $after: String) {
    heroPosts: posts(first: 5) {
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
    popularPosts: posts(first: 20) {
      nodes {
        id
        title
        uri
        viewCount {
          viewCount
        }
      }
    }
    latestPosts: posts(first: $first, after: $after) {
      nodes {
        id
        title
        uri
        date
        excerpt
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export default function FrontPage() {
  const { data, loading, error, fetchMore } = useQuery(GET_HOMEPAGE_DATA, {
    variables: { first: 6 },
  });

  if (loading && !data) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // ... (semua logika JavaScript lainnya tidak berubah)
  const heroPosts = data?.heroPosts?.nodes ?? [];
  const latestPostsData = data?.latestPosts;
  const allPopularPosts = data?.popularPosts?.nodes ?? [];

  const sortedPopularPosts = [...allPopularPosts]
    .sort((a, b) => (b.viewCount?.viewCount || 0) - (a.viewCount?.viewCount || 0))
    .slice(0, 5);
  
  const mainHeroPost = heroPosts[0];
  const sideHeroPosts = heroPosts.slice(1, 5);

  const handleLoadMore = () => {
    if (!latestPostsData.pageInfo.hasNextPage || loading) return;
    fetchMore({ /* ... */ });
  };

  return (
    <>
      <Head>
        <title>Nama Situs Anda - Portal Berita Terkini</title>
      </Head>
      {/* <Header /> <-- Dihapus dari sini */}

      <main className={styles.container}>
        {/* === HERO SECTION === */}
        <section className={styles.heroSection}>
          {/* ... Isi Hero Section tidak berubah ... */}
          {mainHeroPost && (
            <div className={styles.heroMain}>
              <Link href={mainHeroPost.uri}>
                <img 
                  src={mainHeroPost.featuredImage?.node.sourceUrl || '/placeholder-image.png'} 
                  alt={mainHeroPost.title} 
                  className={styles.heroMainImage} 
                />
                <div className={styles.heroOverlay}>
                  <h2 className={styles.heroMainTitle}>{mainHeroPost.title}</h2>
                </div>
              </Link>
            </div>
          )}
          <div className={styles.heroSide}>
            {sideHeroPosts.map(post => (
              <div key={post.id} className={styles.heroSideItem}>
                <Link href={post.uri}>
                  <img 
                    src={post.featuredImage?.node.sourceUrl || '/placeholder-image.png'} 
                    alt={post.title} 
                    className={styles.heroSideImage} 
                  />
                  <h3 className={styles.heroSideTitle}>{post.title}</h3>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* === KONTEN UTAMA & SIDEBAR === */}
        <div className={styles.mainContentLayout}>
          {/* ... Isi Konten Utama & Sidebar tidak berubah ... */}
          <section className={styles.latestPosts}>
            <h2 className={styles.sectionTitle}>Latest News</h2>
            <div className={styles.latestPostsGrid}>
              {latestPostsData?.nodes.map(post => (
                <div key={post.id} className={styles.postCard}>
                  <Link href={post.uri}>
                    <img 
                      src={post.featuredImage?.node.sourceUrl || '/placeholder-image.png'} 
                      alt={post.title}
                      className={styles.cardImage}
                    />
                  </Link>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                      <Link href={post.uri}>{post.title}</Link>
                    </h3>
                    <div className={styles.cardMeta}>
                      <span>{post.author.node.name}</span> ● <span>{new Date(post.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {latestPostsData?.pageInfo.hasNextPage && (
              <button onClick={handleLoadMore} disabled={loading} className={styles.loadMoreButton}>
                {loading ? 'Loading...' : 'Load More Stories'}
              </button>
            )}
          </section>

          <aside className={styles.sidebar}>
            <div className={styles.widget}>
              <h3 className={styles.widgetTitle}>Most Popular</h3>
              <ol className={styles.popularPostsList}>
                {sortedPopularPosts.map((post, index) => (
                  <li key={post.id}>
                    <span className={styles.postNumber}>0{index + 1}</span>
                    <Link href={post.uri}>
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </main>

      {/* <Footer /> <-- Dihapus dari sini */}
    </>
  );
}