// src/wp-templates/single.js (Versi Final Lengkap)

import { gql } from '@apollo/client';
import { useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiClock } from 'react-icons/fi';
import Comments from '../components/Comments/Comments';
import RelatedPosts from '../components/RelatedPosts/RelatedPosts';
import Sidebar from '../components/Sidebar/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import ShareButtons from '../components/ShareButtons/ShareButtons';
import styles from './single.module.css';

// Fungsi untuk menghitung waktu baca
function calculateReadingTime(htmlContent) {
  if (!htmlContent) return '1 min read';
  const text = htmlContent.replace(/<[^>]+>/g, '');
  const wordsPerMinute = 225;
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min read`;
}

export default function Single(props) {
  if (props.loading) {
    return <>Loading...</>;
  }

  const { post } = props.data;
  // Pastikan 'uri' ada di dalam daftar ini
  const { 
    title, 
    content, 
    featuredImage, 
    date, 
    author, 
    categories, 
    comments, 
    databaseId,
    uri 
  } = post;

  const contentRef = useRef(null);
  const readingTimeText = calculateReadingTime(content);
  // Variabel 'postUrl' sekarang akan bekerja karena 'uri' sudah didefinisikan
  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}${uri}`;

  // useEffect untuk View Counter
  useEffect(() => {
    if (!databaseId) return;
    const apiUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/pvc/v1/posts/${databaseId}`;
    fetch(apiUrl, { method: 'POST' }).catch(console.error);
  }, [databaseId]);

  // useEffect untuk Perbaikan Gambar
  useEffect(() => {
    if (contentRef.current) {
      const images = contentRef.current.querySelectorAll('img');
      images.forEach(img => {
        img.removeAttribute('width');
        img.removeAttribute('height');
        img.style.width = '100%';
        img.style.height = 'auto';
      });
    }
  }, [content]);

  return (
    <>
      <Head>
        <title>{title} - Nama Situs Anda</title>
      </Head>

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
                            {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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
            <div
              ref={contentRef}
              dangerouslySetInnerHTML={{ __html: content }}
            />
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

Single.query = gql`
  query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
    post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      date
      databaseId
      uri # Pastikan 'uri' juga diminta di dalam query
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

Single.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview,
  };
};