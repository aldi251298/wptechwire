import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import styles from './search.module.css';
import { useState } from 'react';

const SEARCH_QUERY = gql`
  query SearchPosts($search: String!, $after: String) {
    posts(first: 6, after: $after, where: { search: $search }) {
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
`;

export default function SearchPage() {
  const router = useRouter();
  const { s } = router.query;
  const [allPosts, setAllPosts] = useState([]);
  const [cursor, setCursor] = useState(null);

  const { data, loading, fetchMore } = useQuery(SEARCH_QUERY, {
    variables: { search: s || '', after: null },
    skip: !s,
    onCompleted: (data) => {
      setAllPosts(data?.posts?.nodes || []);
      setCursor(data?.posts?.pageInfo?.endCursor);
    },
  });

  const handleLoadMore = () => {
    fetchMore({
      variables: { search: s, after: cursor },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        const newPosts = fetchMoreResult.posts.nodes;
        const newCursor = fetchMoreResult.posts.pageInfo.endCursor;

        setAllPosts((prev) => [...prev, ...newPosts]);
        setCursor(newCursor);
      },
    });
  };

  if (!s) return <p>Please enter a search keyword.</p>;
  if (loading && allPosts.length === 0) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>Search Results for: {s}</title>
      </Head>
      <main className={styles.container}>
        <h1 className={styles.title}>Search Results for: {s}</h1>
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
        {data?.posts?.pageInfo?.hasNextPage && (
          <button className={styles.loadMore} onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </main>
    </>
  );
}