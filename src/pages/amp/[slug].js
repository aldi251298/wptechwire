// pages/amp/[slug].js
import { gql } from '@apollo/client';
import { initializeApollo } from '../../lib/apolloClient';
export const config = { amp: true };

export default function AmpPost({ post }) {
  // Tambahkan beberapa gaya dasar untuk AMP jika belum ada di WordPress
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <style jsx amp-custom>{`
        /* Tambahkan CSS spesifik AMP di sini */
        body {
          font-family: sans-serif;
          margin: 0;
          padding: 16px;
        }
        h1 {
          font-size: 1.8em;
          margin-bottom: 0.5em;
          word-break: break-word; /* Tambahkan ini */
        }
        img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1em 0;
        }
        p {
          line-height: 1.6;
          margin-bottom: 1em;
          word-break: break-word; /* Tambahkan ini */
        }
      `}</style>
    </article>
  );
}

export async function getStaticPaths() {
  const client = initializeApollo();
  const { data } = await client.query({
    query: gql`
      query {
        posts(first: 100) {
          nodes {
            slug
          }
        }
      }
    `,
  });

  const paths = data.posts.nodes.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const client = initializeApollo();
  const { data } = await client.query({
    query: gql`
      query GetPost($slug: ID!) {
        post(id: $slug, idType: SLUG) {
          title
          content
        }
      }
    `,
    variables: { slug: params.slug },
  });

  return {
    props: {
      post: data.post,
    },
  };
}
