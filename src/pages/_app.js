import '../styles/globals.css';
import "@config";
import { useRouter } from "next/router";
import { FaustProvider } from "@faustwp/core";
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
// Menghapus import Poppins, Inter dan deklarasinya karena tidak digunakan di sini.
// Jika Anda ingin menggunakannya, terapkan ke elemen HTML atau CSS.

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