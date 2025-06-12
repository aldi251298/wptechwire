// pages/amp/[slug].js
import { gql } from '@apollo/client';
import { initializeApollo } from '../../lib/apolloClient';

export const config = { amp: true };

export default function AmpPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
