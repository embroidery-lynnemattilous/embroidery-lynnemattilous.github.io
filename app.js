'use strict';

const app = document.getElementById('app');
const siteTitle = 'The Embroidery Studio | Patterns & Ideas';
const defaultDescription = document.querySelector('meta[name="description"]').content;
const avatarUrl = './assets/blog-avatar.png';
const storageKey = 'embroidery-studio-saved-v1';
let saved = new Set();
try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); if (Array.isArray(value)) saved = new Set(value.filter(id => posts.some(post => post.id === id))); } catch { /* Saving is optional when storage is unavailable. */ }
let filter = 'All ideas';
let query = '';
let toastTimer;
const toast = document.createElement('div');
toast.className = 'toast';
toast.setAttribute('role', 'status');
document.body.append(toast);
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const readingTime = post => Math.max(1, Math.ceil(post.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 220));
const categories = ['All ideas', 'Florals', 'Basics', 'Botanicals', 'Landscapes', 'Saved'];
const dateIso = post => new Date(post.date + ' 12:00:00 GMT').toISOString().slice(0, 10);
function notify(message) { clearTimeout(toastTimer); toast.textContent = message; toastTimer = setTimeout(() => { toast.textContent = ''; }, 3500); }
function saveButton(post) { const active = saved.has(post.id); return `<button class="save-button" type="button" data-save="${post.id}" aria-pressed="${active}" aria-label="${active ? 'Unsave' : 'Save'} ${escapeHtml(post.title)}"><span aria-hidden="true">${active ? '♥' : '♡'}</span> ${active ? 'Saved' : 'Save idea'}</button>`; }
function card(post) { return `<article class="post-card"><a href="#${post.id}" class="card-image" tabindex="-1" aria-hidden="true"><img src="${post.image}" alt="${escapeHtml(post.alt)}" width="1536" height="1024" loading="lazy"><span class="card-category">${post.category}</span></a><div class="card-meta"><time datetime="${dateIso(post)}">${post.date}</time><span aria-hidden="true">·</span><span>${readingTime(post)} min read</span></div><h3><a href="#${post.id}">${post.title}</a></h3><p class="card-summary">${post.summary}</p><div class="card-bottom"><a href="#${post.id}">Explore the idea <span aria-hidden="true">↗</span></a>${saveButton(post)}</div></article>`; }
function updateGrid() {
  const grid = document.getElementById('post-grid');
  if (!grid) return;
  const matches = posts.filter(post => (filter === 'All ideas' || (filter === 'Saved' ? saved.has(post.id) : post.category === filter)) && `${post.title} ${post.summary} ${post.excerpt}`.toLowerCase().includes(query.toLowerCase().trim()));
  grid.innerHTML = matches.length ? matches.map(card).join('') : `<div class="empty-state"><h3>${filter === 'Saved' ? 'Your next project starts here.' : 'A little more room to explore.'}</h3><p>${filter === 'Saved' ? 'Tap “Save idea” on a journal entry to keep it in this browser.' : 'No ideas match this search. Try a different word or choose another category.'}</p><button class="filter" type="button" data-reset>Show all ideas</button></div>`;
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  document.getElementById('results-status').textContent = `${matches.length} ${matches.length === 1 ? 'idea' : 'ideas'} to make your own${filter === 'Saved' ? ' · Saved in this browser' : ''}`;
}
function renderHome() {
  app.innerHTML = `<section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow">A little thread. A little wonder.</p><h1 id="hero-title">Beautiful things<br>begin with<br><em>a single stitch.</em></h1><p>Find your next quiet creative moment. Thoughtful embroidery ideas, gentle guides, and nature-inspired projects for hands that love to make.</p><div class="hero-actions"><a class="button" href="#patterns">Explore the journal <span aria-hidden="true">↗</span></a><a class="text-link" href="#beginners">New to embroidery?</a></div><div class="hero-footnote"><span class="tiny-flower" aria-hidden="true">✳</span> A slower pace. Something made by you.</div></div><div class="hero-visual"><img src="./assets/studio-hero.png" alt="Terracotta and blush wildflowers stitched in a wooden hoop, with thread and brass scissors on linen" width="1536" height="1024" fetchpriority="high"><span class="image-note">Little stitches, lovely possibilities.</span></div></section><div class="studio-values"><span><b aria-hidden="true">✳</b> Inspired by nature</span><span><b aria-hidden="true">⌁</b> Made at your pace</span><span><b aria-hidden="true">♡</b> For the joy of making</span></div><section class="journal" id="journal" aria-labelledby="journal-title"><div class="section-heading"><div><p class="eyebrow">Notes from the studio</p><h2 id="journal-title">Find your next little project.</h2></div><p>Fresh inspiration for your hoop,<br>one thoughtful idea at a time.</p></div><div class="journal-tools"><div class="filters" role="group" aria-label="Filter embroidery ideas">${categories.map(category => `<button class="filter" type="button" data-filter="${category}" aria-pressed="${category === filter}">${category}</button>`).join('')}</div><label class="search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Find an idea…" aria-label="Search embroidery ideas" value="${escapeHtml(query)}"></label></div><div class="post-grid" id="post-grid"></div><p class="results-status" id="results-status" role="status" aria-live="polite"></p></section><section class="beginner-banner" aria-labelledby="beginner-title"><div class="beginner-art"><img src="./assets/essential-embroidery-stitches.png" alt="A practice hoop with rows of simple stitches and small stitched leaves" width="1536" height="1024" loading="lazy"></div><div><p class="eyebrow">Your first stitch starts here</p><h2 id="beginner-title">You don't need perfect.<br>Just a place to begin.</h2><p>A hoop, a needle, and a few favorite colors. Get to know five essential stitches, then turn a little practice into something lovely.</p><a class="text-link" href="#essential-embroidery-stitches">Meet your first five stitches <span aria-hidden="true">↗</span></a></div></section><div class="closing-note"><small>A note to take with you</small><p>There is beauty in taking your time.</p></div>`;
  updateGrid();
}

const pages = {
  about: { title: 'A place for slow, lovely making.', content: `<p>Welcome to The Embroidery Studio, a journal of patterns, practical stitch guides, and ideas inspired by the natural world.</p><h2>Small stitches. Beautiful possibilities.</h2><p>We love loose wildflower arrangements, quiet botanical shapes, and miniature landscapes worked in earthy colors. Our guides break these ideas into approachable steps, with room to adapt every project to your own hands and materials.</p><p>Start with a simple sampler or follow a project from the first pencil line to the finished hoop. You can browse by subject, search the journal, and save favorite ideas in this browser.</p><h2>About the illustrations</h2><p>The journal uses AI-generated embroidery illustrations and photographs as creative references. They are inspiration images, rather than photographs of tested finished patterns. Stitch guides offer suggested approaches; your results will vary with fabric, thread, and technique.</p><p>No downloadable pattern is required to use these guides. Sketch the simple arrangements described in each article and make them your own.</p><p><a href="#patterns">Find something to stitch →</a></p>` },
  contact: { title: 'Say hello to the studio.', content: `<p>Have a question about a guide, a suggestion for a future project, or something on the site that needs correcting? We would love to hear from you.</p><h2>Get in touch</h2><p>The contact address supplied for this project is <a href="mailto:contact@carolynadamsulo-creator.github.io">contact@carolynadamsulo-creator.github.io</a>.</p><p>Include the article title and a short description so your message has the context it needs. Avoid sending passwords, payment information, or other sensitive details.</p><h2>Find a starting point</h2><p>For questions about materials, thread strands, and basic technique, begin with <a href="#essential-embroidery-stitches">Essential Embroidery Stitches</a>. Each project also includes a practical checklist and troubleshooting tips.</p>` },
  privacy: { title: 'Privacy Policy', content: `<p><strong>Last updated: November 5, 2026</strong></p><p>This page describes the features included in this version of The Embroidery Studio.</p><h2>Information stored in your browser</h2><p>When you save an idea, the site stores the article identifier in your browser's local storage under “embroidery-studio-saved-v1”. This lets your saved ideas remain available on this browser and device. The site does not send this saved list to a server. Unsave the entries, or clear this site's browser data, to remove it.</p><h2>Search and browsing</h2><p>The journal search runs in your browser. This version does not include an account system, advertising scripts, analytics tags, newsletter collection, or third-party social widgets. The site code does not set cookies.</p><h2>Hosting and external services</h2><p>When the site is hosted, the hosting provider may process technical request information, such as an IP address and request time, according to its own practices. External websites you choose to visit have their own privacy policies.</p><h2>Email contact</h2><p>If you choose to email the supplied contact address, your email provider and the recipient process the information you send. Do not include sensitive information that is unnecessary for your question.</p><h2>Changes to the site</h2><p>This policy should be updated before adding analytics, advertising, forms, or other services that collect data. For questions, visit the <a href="#contact">contact page</a>.</p>` },
  terms: { title: 'Terms of Use', content: `<p><strong>Last updated: November 5, 2026</strong></p><p>The Embroidery Studio shares creative inspiration and general educational material for hand embroidery.</p><h2>Using the guides</h2><p>You are welcome to use the tutorials to practice and make your own projects. They describe suggested techniques and approximate material choices. Fabric, thread, personal tension, and design size affect the result.</p><h2>Images and patterns</h2><p>Images are AI-generated creative references. They do not represent a tested commercial pattern, an included kit, or a finished item for sale. No downloadable template is promised unless an article explicitly provides one.</p><h2>Care and accuracy</h2><p>Use needles, scissors, marking tools, and irons with appropriate care and follow the manufacturers' instructions. Test unfamiliar materials on spare fabric. If you notice an error in a guide, please use the <a href="#contact">contact details</a> to flag it.</p><h2>Site features</h2><p>Saved ideas use local browser storage and may disappear when you clear browser data or change devices. External links and email services are provided by their respective operators.</p><h2>Sharing</h2><p>Please link to an article when sharing it. If you want to reproduce the full text or images elsewhere, use the contact details to ask about permission.</p>` }
};

function updateMeta(title, description = defaultDescription) {
  document.title = title;
  document.querySelector('meta[name="description"]').content = description;
}
function renderPost(post) {
  updateMeta(`${post.title} | The Embroidery Studio`, post.summary);
  app.innerHTML = `<div class="article-shell"><a class="back-link" href="#patterns">← Back to the journal</a><article><header class="article-heading"><p class="eyebrow">${post.category} · ${post.level}</p><h1>${post.title}</h1><div class="article-byline"><img src="${avatarUrl}" alt="" width="34" height="34"><span>The Embroidery Studio</span><span aria-hidden="true">·</span><time datetime="${dateIso(post)}">${post.date}</time><span aria-hidden="true">·</span><span>${readingTime(post)} min read</span></div></header><img class="article-cover" src="${post.image}" alt="${escapeHtml(post.alt)}" width="1536" height="1024"><p class="article-caption">Creative reference illustration · Adapt the colors and stitches to make it your own.</p><div class="article-actions">${saveButton(post)}<button type="button" data-copy="${post.id}">Copy this idea ↗</button></div><div class="article-body">${post.content}</div></article><aside class="related"><h2>A little more inspiration</h2>${posts.filter(other => other.id !== post.id).map(other => `<a href="#${other.id}">${other.title} <span aria-hidden="true">↗</span></a>`).join('')}</aside></div>`;
}
function renderPage(page) {
  updateMeta(`${page.title} | The Embroidery Studio`);
  const body = page.content.replace(/<h2>/g, '<h2 style="font-size:30px;line-height:1.3;margin:36px 0 18px;color:#303d31;border-bottom:1px solid #deded2;padding-bottom:10px;font-weight:400;">');
  app.innerHTML = `<article class="static-page"><a class="back-link" href="#home">← Back to the studio</a><h1>${page.title}</h1><div class="article-body">${body}</div></article>`;
}
function route(initial = false) {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = 'not-found'; }
  document.querySelector('.nav-links').classList.remove('is-open');
  document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
  document.querySelectorAll('.nav-links a').forEach(link => { if (link.hash === `#${id || 'home'}`) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
  if (!id || ['home', 'patterns', 'beginners', 'app'].includes(id)) {
    if (id === 'home' || !id) { filter = 'All ideas'; query = ''; }
    if (id === 'beginners') { filter = 'Basics'; query = ''; }
    updateMeta(siteTitle);
    renderHome();
    if (id === 'patterns' || id === 'beginners') document.getElementById('journal').scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (pages[id]) { renderPage(pages[id]); window.scrollTo({ top: 0, behavior: 'instant' }); }
  else {
    const post = posts.find(item => item.id === id);
    if (post) renderPost(post);
    else { updateMeta('Page not found | The Embroidery Studio'); app.innerHTML = '<section class="static-page"><a class="back-link" href="#home">← Back to the studio</a><h1>This thread ends here.</h1><p>We could not find that page. Explore the journal to find your next idea.</p><a class="button" href="#patterns">Explore the journal ↗</a></section>'; }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  if (!initial) app.focus({ preventScroll: true });
}

document.querySelector('.menu-toggle').addEventListener('click', event => {
  const open = document.querySelector('.nav-links').classList.toggle('is-open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});
document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); app.focus(); app.scrollIntoView({ behavior: 'instant' }); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { document.querySelector('.nav-links').classList.remove('is-open'); document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false'); } });
app.addEventListener('input', event => { if (event.target.matches('input[type=search]')) { query = event.target.value; updateGrid(); } });
app.addEventListener('click', async event => {
  const filterButton = event.target.closest('[data-filter]');
  if (filterButton) { filter = filterButton.dataset.filter; updateGrid(); }
  if (event.target.closest('[data-reset]')) { filter = 'All ideas'; query = ''; const input = app.querySelector('input[type=search]'); if (input) input.value = ''; updateGrid(); }
  const save = event.target.closest('[data-save]');
  if (save) {
    const id = save.dataset.save;
    saved.has(id) ? saved.delete(id) : saved.add(id);
    let persistent = true;
    try { localStorage.setItem(storageKey, JSON.stringify([...saved])); } catch { persistent = false; }
    const post = posts.find(item => item.id === id);
    save.outerHTML = saveButton(post);
    const replacement = app.querySelector(`[data-save="${id}"]`);
    replacement?.focus({ preventScroll: true });
    if (filter === 'Saved' && document.getElementById('post-grid')) { updateGrid(); app.querySelector('[data-filter="Saved"]')?.focus({ preventScroll: true }); }
    notify(saved.has(id) ? (persistent ? 'Idea saved in this browser.' : 'Idea saved for this visit. Browser storage is unavailable.') : 'Idea removed from your saved list.');
  }
  const copy = event.target.closest('[data-copy]');
  if (copy) {
    const post = posts.find(item => item.id === copy.dataset.copy);
    try { await navigator.clipboard.writeText(`${post.title}\n\n${post.excerpt}`); notify('Idea copied. Keep it somewhere inspiring!'); }
    catch { notify('Copy is unavailable here. Select and copy the article text instead.'); }
  }
});
window.addEventListener('hashchange', () => route());
route(true);
