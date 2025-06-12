import { getWordPressProps, WordPressTemplate } from "@faustwp/core";
import * as templates from '../wp-templates';
 
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