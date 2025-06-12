// src/lib/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

let apolloClient;

// Fungsi untuk membuat instance Apollo Client baru
function createApolloClient() {
  return new ApolloClient({
    // ssrMode: true jika Anda hanya melakukan SSR, atau tergantung lingkungan
    ssrMode: typeof window === 'undefined',
    // Ganti dengan URL GraphQL WordPress Anda
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_WORDPRESS_URL, 
      // Anda mungkin perlu menambahkan headers jika WP GraphQL Anda membutuhkan otentikasi
      // headers: {
      //   authorization: `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`,
      // },
    }),
    cache: new InMemoryCache(),
  });
}

// Fungsi untuk menginisialisasi atau mendapatkan instance Apollo Client
export function initializeApollo(initialState = null) {
  // Gunakan instance yang sudah ada atau buat yang baru
  const _apolloClient = apolloClient ?? createApolloClient();

  // Jika ada state awal dari server, restore cache-nya
  if (initialState) {
    // Dapatkan cache yang ada
    const existingCache = _apolloClient.extract();

    // Restore cache dengan data terbaru
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // Untuk build waktu server (SSG/SSR), selalu kembalikan instance baru
  if (typeof window === 'undefined') return _apolloClient;

  // Untuk sisi klien, buat instance hanya sekali
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

// Optional: Fungsi untuk memastikan instance client selalu ada
export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}