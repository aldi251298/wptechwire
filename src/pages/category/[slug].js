import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from './category.module.css';
import { useState, useEffect } from 'react';

const CATEGORY_POSTS_QUERY = gql`
  query CategoryPosts($slug: ID!, $after: String) {
    category(id: $slug, idType: SLUG) {
      name
      posts(first: 6, after: $after) {
        nodes {
          id
          title
          uri
          date
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
  }
`;

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [allPosts, setAllPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  const { data, loading, fetchMore } = useQuery(CATEGORY_POSTS_QUERY, {
    variables: { slug, after: null },
    skip: !slug,
    onCompleted: (data) => {
      const newPosts = data?.category?.posts?.nodes || [];
      setCategoryName(data?.category?.name || '');
      setAllPosts(newPosts);
      setCursor(data?.category?.posts?.pageInfo?.endCursor);
    },
  });

  const handleLoadMore = () => {
    fetchMore({
      variables: { slug, after: cursor },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        const newPosts = fetchMoreResult.category.posts.nodes;
        const newCursor = fetchMoreResult.category.posts.pageInfo.endCursor;
        setAllPosts((prev) => [...prev, ...newPosts]);
        setCursor(newCursor);
      },
    });
  };

  if (!slug || (loading && allPosts.length === 0)) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>Category: {categoryName}</title>
      </Head>
      <main className={styles.container}>
        <h1 className={styles.title}>Category: {categoryName}</h1>
        <div className={styles.grid}>
          {allPosts.map((post) => (
            <div key={post.id} className={styles.card}>
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
                <p className={styles.cardDate}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
        {data?.category?.posts?.pageInfo?.hasNextPage && (
          <button className={styles.loadMore} onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </main>
    </>
  );
}
