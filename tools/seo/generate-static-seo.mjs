import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const outputDirs = [path.join(rootDir, 'public'), path.join(rootDir, 'dist/app/browser')];

const staticRoutes = [
	{ path: '/', priority: '1.0' },
	{ path: '/about', priority: '0.7' },
	{ path: '/production', priority: '0.7' },
	{ path: '/composition', priority: '0.6' },
	{ path: '/certificates', priority: '0.5' },
	{ path: '/delivery', priority: '0.6' },
	{ path: '/partner', priority: '0.7' },
	{ path: '/contacts', priority: '0.6' },
];

// Never crawled: cart/checkout/order are per-visitor state, and admin is the demo CRM.
const disallowedPaths = ['/cart', '/checkout', '/order', '/admin'];

const company = await readJson('src/data/company/company.json');
const products = await readJson('src/data/product/products.json');
const siteUrl = trimTrailingSlash(company.siteUrl || 'https://example.com');
const pageSeo = company.pageSeo ?? {};

const productRoutes = products.map((product) => ({ path: `/product/${product.id}`, priority: '0.8' }));
const routes = [...staticRoutes, ...productRoutes].filter((route) => isIndexable(route.path, pageSeo));
const lastmod = new Date().toISOString().slice(0, 10);

await Promise.all(
	outputDirs.map(async (outputDir) => {
		await mkdir(outputDir, { recursive: true });
		await writeFile(path.join(outputDir, 'sitemap.xml'), buildSitemap(routes, siteUrl, lastmod));
		await writeFile(path.join(outputDir, 'robots.txt'), buildRobots(siteUrl));
	}),
);

function buildSitemap(routes, siteUrl, lastmod) {
	const urls = routes
		.map(
			(route) => `	<url>
		<loc>${escapeXml(toAbsoluteUrl(siteUrl, route.path))}</loc>
		<lastmod>${lastmod}</lastmod>
		<priority>${route.priority}</priority>
	</url>`,
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRobots(siteUrl) {
	const disallow = disallowedPaths.map((route) => `Disallow: ${route}`).join('\n');

	return `User-agent: *
Allow: /
${disallow}

Sitemap: ${siteUrl}/sitemap.xml
`;
}

function isIndexable(route, pageSeo) {
	const robots = pageSeo[route]?.robots;

	return typeof robots !== 'string' || !robots.toLowerCase().includes('noindex');
}

async function readJson(relativePath) {
	return JSON.parse(await readFile(path.join(rootDir, relativePath), 'utf8'));
}

function toAbsoluteUrl(siteUrl, route) {
	return `${siteUrl}${route === '/' ? '' : route}`;
}

function trimTrailingSlash(value) {
	return value.endsWith('/') ? value.slice(0, -1) : value;
}

function escapeXml(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}
