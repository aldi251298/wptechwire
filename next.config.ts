const { withFaust, getWpHostname } = require("@faustwp/core");
const { createSecureHeaders } = require("next-secure-headers");
import type { NextConfig } from "next";

const config = {
	reactStrictMode: true,
	sassOptions: {
		includePaths: ["node_modules"],
	},
	images: {
		domains: [getWpHostname()],
	},
 
	async headers() {
		return [
			{
				source: "/:path*",
				headers: createSecureHeaders({
					xssProtection: false,
				}),
			},
		];
	},
};
 
module.exports = withFaust(config);