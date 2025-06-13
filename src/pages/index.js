// src/wp-templates/front-page.js

import { gql } from '@apollo/client'; // Tetap butuh gql untuk menulis query
import Head from 'next/head';
import Link from 'next/link';
import styles from './front-page.module.css'; // Sesuaikan path jika berbeda
import SEO from '../components/SEO';
import CategoryBlockTechnology from '../components/CategoryBlockTechnology';

// --- Faust.js Integration: Dapatkan client untuk getStaticProps ---
// Ini penting. getClient akan mengembalikan instance Apollo Client yang sudah dikonfigurasi
// oleh Faust.js menggunakan WORDPRESS_URL dari environment variables Anda.
import { getClient } from '@faustjs/next'; 

// === GraphQL Query untuk Homepage ===
// Query ini sekarang akan digunakan oleh getStaticProps
const GET_HOMEPAGE_DATA = gql`
  query GetHomepageData($first: Int!, $after: String) {
    page(id: 3266, idType: DATABASE_ID) {
      seo {
        title
        metaDesc
        canonical
        opengraphTitle
        opengraphDescription
        opengraphUrl
        opengraphSiteName
        opengraphImage {
          sourceUrl
        }
        twitterTitle
        twitterDescription
        twitterImage {
          sourceUrl
        }
      }
    }
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
    popularPosts: posts(first: 20) { # Ambil lebih banyak untuk diurutkan
      nodes {
        id
        title
        uri
        # Pastikan nama field ini sesuai dengan yang diekspos di GraphQL API Anda
        # Jika itu custom field ACF, mungkin perlu diakses melalui 'customFields' atau yang serupa
        viewCount { # Asumsi viewCount adalah objek dengan field viewCount di dalamnya
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
    # === Tambahan Query untuk Kategori Technology ===
    # Asumsikan ID kategori untuk "Technology" adalah 2
    # Jika Anda ingin filter berdasarkan slug, Anda perlu mengubah filter
    techPosts: posts(where: { categoryId: 2 }, first: 5) { # Ganti ID kategori
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

export default function FrontPage({ data }) { // Menerima 'data' dari getStaticProps
  // `loading` dan `error` tidak ada lagi karena data diambil di server
  // `fetchMore` tidak digunakan secara langsung di komponen karena kita menggunakan SSG/ISR
  // Jika Anda ingin Load More Stories, Anda perlu implementasi client-side fetching yang terpisah atau SSR.
  // Untuk tujuan SSG/ISR murni, tombol "Load More" akan dihilangkan atau diimplementasikan secara berbeda.

  const seo = data?.page?.seo;
  const heroPosts = data?.heroPosts?.nodes ?? [];
  const latestPostsData = data?.latestPosts;
  const allPopularPosts = data?.popularPosts?.nodes ?? [];
  const techPosts = data?.techPosts?.nodes ?? []; // Data teknologi sekarang datang dari query

  const sortedPopularPosts = [...allPopularPosts]
    .sort((a, b) => (b.viewCount?.viewCount || 0) - (a.viewCount?.viewCount || 0))
    .slice(0, 5);

  const mainHeroPost = heroPosts[0];
  const sideHeroPosts = heroPosts.slice(1, 5);

  // Fungsi handleLoadMore tidak akan berjalan secara langsung seperti sebelumnya
  // karena data sudah statis. Jika Anda ingin "Load More" di halaman statis,
  // Anda harus menggunakan client-side fetching terpisah atau beralih ke SSR untuk bagian itu.
  // Untuk saat ini, saya akan mengomentari tombol Load More.
  // const handleLoadMore = () => {
  //   // Logika ini hanya berfungsi dengan useQuery
  //   // if (!latestPostsData.pageInfo.hasNextPage || loading) return;
  //   // fetchMore({ variables: { after: latestPostsData.pageInfo.endCursor } });
  // };

  return (
    <>
      <SEO seo={seo} />
      <main className={styles.container}>
        {/* === HERO SECTION === */}
        <section className={styles.heroSection}>
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
        
        {/* CategoryBlockTechnology sekarang menerima data dari query */}
        <CategoryBlockTechnology posts={techPosts} /> 

        {/* === KONTEN UTAMA & SIDEBAR === */}
        <div className={styles.mainContentLayout}>
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
                      <span>{post.author.node.name}</span> ●{' '}
                      <span>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Tombol Load More Stories tidak berfungsi langsung dengan SSG/ISR murni
                Anda perlu implementasi client-side fetching terpisah jika ingin fitur ini */}
            {/* {latestPostsData?.pageInfo.hasNextPage && (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className={styles.loadMoreButton}
              >
                {loading ? 'Loading...' : 'Load More Stories'}
              </button>
            )} */}
          </section>

          <aside className={styles.sidebar}>
            <div className={styles.widget}>
              <h3 className={styles.widgetTitle}>Most Popular</h3>
              <ol className={styles.popularPostsList}>
                {sortedPopularPosts.map((post, index) => (
                  <li key={post.id}>
                    <span className={styles.postNumber}>0{index + 1}</span>
                    <Link href={post.uri}>{post.title}</Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

// === FUNGSI getStaticProps untuk Homepage (ISR) ===
// Fungsi ini akan dijalankan Next.js di sisi server (saat build atau saat regenerasi).
export async function getStaticProps(context) {
  const client = getClient(); // Dapatkan instance Apollo Client dari Faust.js

  // Jalankan query GraphQL yang sudah Anda definisikan di atas
  const { data } = await client.query({
    query: GET_HOMEPAGE_DATA,
    variables: { first: 6 }, // Sesuaikan variabel seperti 'first' untuk jumlah postingan awal
  });

  // Pastikan data yang diperlukan ada
  if (!data) {
    return {
      notFound: true, // Akan menampilkan halaman 404 Next.js jika tidak ada data
      revalidate: 60, // Coba lagi validasi setelah 60 detik jika halaman 404
    };
  }

  return {
    props: {
      data: data, // Teruskan data ke komponen FrontPage sebagai props
    },
    revalidate: 3600, // ISR: Halaman ini akan diregenerasi setiap 3600 detik (1 jam)
    // Sesuaikan nilai 'revalidate' (dalam detik) berdasarkan seberapa sering Anda ingin homepage diperbarui.
    // - `3600` (1 jam): Pilihan yang bagus jika konten homepage diupdate beberapa kali sehari.
    // - `600` (10 menit): Jika Anda ingin homepage lebih sering diperbarui, tapi ini akan membebani backend.
    // - `86400` (24 jam): Untuk homepage yang jarang sekali berubah.
  };
}
