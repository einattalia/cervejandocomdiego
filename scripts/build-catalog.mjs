import { readFileSync, writeFileSync } from 'node:fs';

const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const pageUrl = 'https://www.cervejandocomdiego.com.br/catalogo';
const title = 'Catálogo de cervejas artesanais em São Carlos | Cervejando com Diego';
const description = 'Encontre cervejas artesanais, importadas e kits no catálogo do Diegão. Compare estilos, amargor e preços e peça com entrega em São Carlos ou retirada.';

function replaceOnce(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`Elemento do catálogo não encontrado: ${pattern}`);
  return html.replace(pattern, replacement);
}

const products = home.match(/<section class="catalog" id="catalogo">[\s\S]*?(?=<section class="tips-section catalog-help" id="dicas">)/)?.[0];
if (!products || !products.includes('id="kitsCatalogSection"')) {
  throw new Error('Não foi possível localizar o catálogo e os kits na home.');
}

let catalog = replaceOnce(home, /<main>[\s\S]*?<\/main>/, `<main>\n${products}</main>`);
catalog = replaceOnce(catalog, /<h2>O que eu quero <span>beber hoje\?<\/span><\/h2>/, '<h1>Catálogo de <span>cervejas artesanais</span></h1>');
catalog = replaceOnce(catalog, /<p>Explore cervejas artesanais e importadas,[^<]*<\/p>/,
  '<p>Escolha cervejas artesanais, importadas ou kits da curadoria do Diegão. Compare estilos e preços e faça seu pedido com entrega em São Carlos ou retirada.</p>');
catalog = replaceOnce(catalog, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
catalog = replaceOnce(catalog, /<link href="[^"]+" rel="canonical"\/>/, `<link href="${pageUrl}" rel="canonical"/>`);
for (const attribute of ['name="description"', 'property="og:description"', 'name="twitter:description"']) {
  catalog = replaceOnce(catalog, new RegExp(`<meta content="[^"]*" ${attribute}/>`), `<meta content="${description}" ${attribute}/>`);
}
for (const attribute of ['property="og:title"', 'name="twitter:title"']) {
  catalog = replaceOnce(catalog, new RegExp(`<meta content="[^"]*" ${attribute}/>`), `<meta content="${title}" ${attribute}/>`);
}
catalog = replaceOnce(catalog, /<meta content="[^"]*" property="og:url"\/>/, `<meta content="${pageUrl}" property="og:url"/>`);
catalog = catalog
  .replace(/<meta name="google-site-verification"[^>]*>\n/, '')
  .replace('<a class="active" href="#inicio">', '<a href="#inicio">')
  .replaceAll('<a href="/catalogo">Catálogo</a>', '<a class="active" aria-current="page" href="/catalogo">Catálogo</a>')
  .replaceAll('href="#inicio"', 'href="/"')
  .replace(/href="#(dicas|como-funciona|festas-eventos|eventos|sobre|contato)"/g, 'href="/#$1"')
  .replace(/<script src="(?:assets\/party-(?:events|content)\.js|data\/events\.js|assets\/fridge-sizing\.js)\?[^"]+"(?: defer)?><\/script>/g, '');

writeFileSync(new URL('../catalogo.html', import.meta.url), catalog);
