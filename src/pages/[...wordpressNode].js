import { getWordPressProps, WordPressTemplate } from "@faustwp/core";
// Menghapus import * as templates dari sini karena tidak digunakan secara langsung

export default function Page(props) {
	return <WordPressTemplate {...props} />;
}
 
export function getStaticProps(ctx) {
	return getWordPressProps({ ctx });
}
 
export async function getStaticPaths() {
	return {
		paths: [],
		fallback: "blocking",
	};
}