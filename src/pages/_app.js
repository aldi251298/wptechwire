import '../styles/globals.css';
import "@config";
import { useRouter } from "next/router";
import { FaustProvider } from "@faustwp/core";
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
// Menghapus import Poppins, Inter dan deklarasinya karena tidak digunakan di sini.
// Jika Anda ingin menggunakannya, terapkan ke elemen HTML atau CSS (misalnya di _document.js atau di body/h1-h6 di globals.css)
// import { Poppins, Inter } from 'next/font/google'; 

// const poppins = Poppins({
//   subsets: ['latin'],
//   weight: ['500', '600', '700', '800'],
//   variable: '--font-poppins',
//   display: 'swap',
// });

// const inter = Inter({
//   subsets: ['latin'],
//   weight: ['400', '500', '600'],
//   variable: '--font-inter',
//   display: 'swap',
// });
 
export default function App({ Component, pageProps }) {
	const router = useRouter();
 
	return (
		<FaustProvider pageProps={pageProps}>
			 <Header />
			<Component {...pageProps} key={router.asPath} />
		  <Footer />
		</FaustProvider>
	);
}