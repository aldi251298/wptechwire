import { gql } from '@apollo/client';
import { useEffect, useRef } from 'react';
import Head from 'next/head';
import { FiClock } from 'react-icons/fi';
import Comments from '../components/Comments/Comments';
import RelatedPosts from '../components/RelatedPosts/RelatedPosts';
import Sidebar from '../components/Sidebar/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import ShareButtons from '../components/ShareButtons/ShareButtons';
import styles from './single.module.css';
import SEO from '../components/SEO';
// Menghapus import Link karena tidak digunakan

export default function Single(props) {
  // Pindahkan deklarasi Hooks ke atas, sebelum ada conditional return
  const contentRef = useRef(null);

  // View counter
  useEffect(() => {
    // Pastikan `databaseId` tersedia sebelum memanggil API.
    // Jika props.loading, props.data mungkin belum ada.
    if (props.loading || !props.data?.post?.databaseId) return;

    const databaseId = props.data.post.databaseId;
    const apiUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/pvc/v1/posts/${databaseId}`;
    fetch(apiUrl, { method: 'POST' }).catch(console.error);
  }, [props.loading, props.data?.post?.databaseId]); // Tambahkan databaseId dan loading ke dependency array

  // Gambar responsif
  useEffect(() => {
    // Pastikan contentRef.current tersedia dan content sudah ada
    if (props.loading || !contentRef.current || !props.data?.post?.content) return;

    const images = contentRef.current.querySelectorAll('img');
    images.forEach(img => {
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.style.width = '100%';
      img.style.height = 'auto';
    });
  }, [props.loading, props.data?.post?.content]); // Tambahkan content ke dependency array

  if (props.loading) return <div>Loading...</div>;

  const { post } = props.data;
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
  } = post;

  const readingTimeText = calculateReadingTime(content);
  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}${uri}`;
  const ampUrl = `${postUrl.replace(/\/$/, '')}/amp`; // versi SEO-only AMP

  return (
    <>
      <Head>
        <link rel="amphtml" href={ampUrl} />
      </Head>

      <SEO seo={seo} />

      <main className={styles.container}>
        <Breadcrumbs categories={categories?.nodes} />
        <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />

        <div className={styles.metaContainer}>
          <div className={styles.authorBox}>
            <img
              src={author.node.avatar.url}
              alt={author.node.name}
              className={styles.authorAvatar}
            />
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
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mainLayout}>
          <article className={styles.postContent}>
            {featuredImage && (
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
    }
  }
`;

Single.variables = ({ databaseId }, ctx) => ({
  databaseId,
  asPreview: ctx?.asPreview,
});