import { gql } from '@apollo/client';
import { useEffect, useRef } from 'react';
import Head from 'next/head';
import { FiClock } from 'react-icons/fi';
import Comments from '../components/Comments/Comments';
import RelatedPosts from '../components/RelatedPosts/RelatedPosts';
import Sidebar from '../components/Sidebar/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import ShareButtons from '../components/ShareButtons/ShareButtons';
import styles from './single.module.css'; // Sesuaikan path jika berbeda
import SEO from '../components/SEO';

// --- Faust.js Integration: Dapatkan client untuk getStaticPaths/Props ---
// Ini penting. getClient akan mengembalikan instance Apollo Client yang sudah dikonfigurasi
// oleh Faust.js menggunakan WORDPRESS_URL dari environment variables Anda.
import { getClient } from '@faustjs/next'; 

// Export config untuk halaman AMP (jika Anda ingin halaman ini juga versi AMP)
// Jika tidak, Anda bisa menghapus baris ini.
export const config = { amp: true }; 

export default function Single(props) {
  const contentRef = useRef(null);

  // View counter: Pastikan ini berjalan di client-side saja
  // karena kita tidak ingin memicu update tampilan saat build atau regenerasi server-side
  useEffect(() => {
    // Pastikan `databaseId` tersedia dan ini berjalan di browser (window ada)
    if (typeof window === 'undefined' || props.loading || !props.data?.post?.databaseId) {
        return;
    }

    const databaseId = props.data.post.databaseId;
    const apiUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/pvc/v1/posts/${databaseId}`;
    fetch(apiUrl, { method: 'POST' }).catch(console.error);
  }, [props.loading, props.data?.post?.databaseId]);

  // Gambar responsif
  useEffect(() => {
    // Pastikan contentRef.current tersedia dan content sudah ada
    // Serta hanya jalankan di browser
    if (typeof window === 'undefined' || props.loading || !contentRef.current || !props.data?.post?.content) {
        return;
    }

    const images = contentRef.current.querySelectorAll('img');
    images.forEach(img => {
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.style.width = '100%';
      img.style.height = 'auto';
    });
  }, [props.loading, props.data?.post?.content]);

  // Penanganan loading state saat fallback 'blocking' atau 'true'
  if (props.loading) {
    return <div>Loading...</div>;
  }

  // Penanganan jika data atau postingan tidak ditemukan (dari getStaticProps notFound: true)
  if (!props.data || !props.data.post) {
      return <div>Postingan tidak ditemukan atau terjadi kesalahan.</div>;
  }

  const {
    title,
    content,
    featuredImage,
    date,
    author,
    categories,
    comments,
    databaseId,
    uri,
    seo,
    // Pastikan nama field ini sesuai dengan yang diekspos di GraphQL API Anda
    // Misalnya, jika ACF Anda mengeksposnya sebagai 'postViewsCount', gunakan itu
    viewCount, // Asumsikan field 'viewCount' diekspos langsung di WPGraphQL
  } = props.data.post;

  const readingTimeText = calculateReadingTime(content);
  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}${uri}`;
  // Relasi ke halaman AMP (jika ada halaman AMP terpisah)
  // Perhatikan: AmpPost.config.amp: true di pages/amp/[slug].js
  // Ini hanya link untuk SEO, bukan berarti halaman ini di-render sebagai AMP.
  const ampUrl = `${postUrl.replace(/\/$/, '')}/amp`; 

  return (
    <>
      <Head>
        {/* Ini untuk memberitahu search engine ada versi AMP dari halaman ini */}
        {/* Pastikan Anda memiliki halaman AMP terpisah di pages/amp/[slug].js */}
        <link rel="amphtml" href={ampUrl} />
      </Head>

      {/* Komponen SEO untuk mengelola meta tag */}
      <SEO seo={seo} />

      <main className={styles.container}>
        <Breadcrumbs categories={categories?.nodes} />
        <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />

        <div className={styles.metaContainer}>
          <div className={styles.authorBox}>
            {/* Pastikan author.node.avatar.url ada */}
            {author?.node?.avatar?.url && (
              <img
                src={author.node.avatar.url}
                alt={author.node.name}
                className={styles.authorAvatar}
              />
            )}
            <div className={styles.authorDetails}>
              <span className={styles.authorName}>{author.node.name}</span>
              <div className={styles.postDetails}>
                <span className={styles.postDate}>
                  {new Date(date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className={styles.metaSeparator}>●</span>
                <span className={styles.readingTime}>
                  <FiClock size="0.9em" /> {readingTimeText}
                </span>
                {/* Tampilkan viewCount jika ada data */}
                {viewCount && (
                    <>
                        <span className={styles.metaSeparator}>●</span>
                        <span className={styles.viewCount}>Tayangan: {viewCount}</span>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mainLayout}>
          <article className={styles.postContent}>
            {featuredImage?.node?.sourceUrl && (
              <img
                src={featuredImage.node.sourceUrl}
                alt={title}
                className={styles.featuredImage}
              />
            )}
            <div ref={contentRef} dangerouslySetInnerHTML={{ __html: content }} />
          </article>
          <Sidebar />
        </div>

        <ShareButtons title={title} url={postUrl} />
        <Comments comments={comments?.nodes} postId={databaseId} />
        <RelatedPosts categories={categories?.nodes} currentPostId={databaseId} />
      </main>
    </>
  );
}

function calculateReadingTime(htmlContent) {
  if (!htmlContent) return '1 min read';
  const text = htmlContent.replace(/<[^>]+>/g, '');
  const wordsPerMinute = 225;
  const wordCount = text.split(/\s+/).length;
  return `${Math.ceil(wordCount / wordsPerMinute)} min read`;
}

// --- Query GraphQL untuk Single Post ---
// Query ini akan digunakan oleh getStaticProps untuk mengambil data
Single.query = gql`
  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      date
      databaseId
      uri
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
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
      categories {
        nodes {
          id
          name
          uri
        }
      }
      comments(where: { order: ASC }) {
        nodes {
          id
          content
          date
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
        }
      }
      # PASTIKAN NAMA FIELD INI SESUAI DENGAN SCHEMA GRAPHQL ANDA
      # Jika Anda menggunakan WP-PostViews yang di-bridge melalui ACF,
      # namanya mungkin berbeda (misalnya 'postViewsCount' atau nama ACF Anda).
      # Contoh:
      viewCount
    }
  }
`;

// --- Variabel untuk Query ---
// Ini menentukan bagaimana variabel databaseId dan asPreview akan diteruskan ke query.
Single.variables = ({ databaseId }, ctx) => ({
  databaseId,
  asPreview: ctx?.asPreview,
});

// --- getStaticPaths: Menentukan Path untuk Build Time ---
// Next.js akan memanggil fungsi ini saat build time untuk mengetahui
// postingan mana saja yang harus dibuatkan halaman HTML statis.
export async function getStaticPaths() {
  const client = getClient(); // Dapatkan instance Apollo Client dari Faust.js

  // Query semua databaseId postingan dari WordPress
  // Sesuaikan 'first' jika Anda memiliki lebih dari 5000 postingan
  // atau ingin membatasi jumlah halaman yang di-generate saat build.
  const { data } = await client.query({
    query: gql`
      query GetAllPostDatabaseIds {
        posts(first: 5000) { 
          nodes {
            databaseId # Kita menggunakan databaseId karena Single.query dan nama file
          }
        }
      }
    `,
  });

  // Petakan hasil query ke format yang diharapkan oleh getStaticPaths.
  // Parameter harus berupa string.
  const paths = data.posts.nodes.map((post) => ({
    params: { databaseId: String(post.databaseId) }, 
  }));

  return {
    paths,
    fallback: 'blocking', 
    // 'blocking' adalah pilihan terbaik untuk blog:
    // - Jika path (postingan) tidak ada di build cache, Next.js akan mengambil data dari WP,
    //   merender halaman, dan meng-cache-nya. Pengguna akan menunggu sebentar (blocking),
    //   tapi permintaan berikutnya akan super cepat dari cache.
    // - Ini memungkinkan postingan baru yang ditambahkan di WordPress setelah deploy
    //   untuk tetap muncul tanpa perlu rebuild penuh setiap saat.
  };
}

// --- getStaticProps: Mengambil Data untuk Setiap Halaman Postingan dan Mengaktifkan ISR ---
// Fungsi ini akan dijalankan Next.js di sisi server (saat build atau saat regenerasi).
export async function getStaticProps(context) {
  const client = getClient(); // Dapatkan instance Apollo Client dari Faust.js

  // context.params akan berisi { databaseId: 'ID_POSTINGAN' }
  const databaseId = context.params.databaseId; 

  // Menggunakan Single.query yang sudah Anda definisikan di atas untuk mengambil data
  const { data } = await client.query({
    query: Single.query,
    variables: { 
      databaseId: databaseId,
      asPreview: context?.preview, // Mengaktifkan mode preview jika ada di context Next.js
    },
  });

  // Penanganan jika postingan tidak ditemukan di WordPress
  if (!data || !data.post) {
    return {
      notFound: true, // Memberi tahu Next.js untuk merender halaman 404
      revalidate: 60, // Coba lagi validasi setelah 60 detik jika halaman 404 (misal: sempat down)
    };
  }

  return {
    props: {
      data: data, // Meneruskan objek 'data' ke komponen Single
      loading: false, // Menunjukkan bahwa data sudah dimuat
    },
    revalidate: 3600, // ISR: Halaman ini akan diregenerasi setiap 3600 detik (1 jam)
    // - `3600` (1 jam): Pilihan yang bagus untuk postingan blog yang tidak sering berubah.
    // - Sesuaikan nilai ini (dalam detik) berdasarkan seberapa sering Anda ingin konten
    //   postingan diperbarui di frontend tanpa redeploy penuh.
    // - Semakin kecil revalidate, semakin "fresh" konten, tapi semakin sering beban ke backend.
  };
}
