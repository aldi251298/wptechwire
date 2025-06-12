import '../styles/globals.css';
import "@config";
import { useRouter } from "next/router";
import { FaustProvider } from "@faustwp/core";
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { Poppins, Inter } from 'next/font/google';
// --- 2. Konfigurasi Font ---
// Ambil ketebalan (weight) yang kita perlukan.
// 'variable' akan membuat CSS Variable yang bisa kita gunakan di file .css
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap', // Pastikan font langsung terlihat dengan fallback
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});
// -------------------------
 
export default function App({ Component, pageProps }) {
	const router = useRouter();
 
	return (
		<FaustProvider pageProps={pageProps}>
			 <Header /> {/* <-- 2. PASTIKAN KOMPONEN INI DIPANGGIL DI SINI */}
			<Component {...pageProps} key={router.asPath} />
		  <Footer /> {/* <-- 2. Letakkan komponen Footer di sini */}
		</FaustProvider>
	);
}