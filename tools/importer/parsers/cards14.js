/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from panel structure
  function extractCard(panel) {
    // Image (if present)
    let img = panel.querySelector('.panel__image img');
    // Text content
    const body = panel.querySelector('.panel__body') || panel;
    let textContent = [];
    // Kicker
    const kicker = body.querySelector('.panel__kicker');
    if (kicker) textContent.push(kicker);
    // Headline (h1/h2)
    const headline = body.querySelector('.panel__headline');
    if (headline) {
      // Fix: If headline is an h2 containing a <p>, move the <p> content into the h2
      if (headline.tagName === 'H2' && headline.querySelector('p')) {
        headline.textContent = headline.querySelector('p').textContent;
        headline.innerHTML = headline.textContent;
      }
      textContent.push(headline);
    }
    // Description (p not kicker and not inside headline)
    body.querySelectorAll('p').forEach(p => {
      if (!p.classList.contains('panel__kicker') && (!headline || !headline.contains(p))) textContent.push(p);
    });
    // CTA (span.cta-btn)
    const cta = body.querySelector('.cta-btn');
    if (cta) textContent.push(cta);
    // News panel: add news list and tags
    const newsList = body.querySelector('.panel__news-list');
    if (newsList) textContent.push(newsList);
    const tags = body.querySelector('.panel__tags');
    if (tags) textContent.push(tags);
    // Links panel: add ul.panel__list
    const linksList = body.querySelector('.panel__list');
    if (linksList) textContent.push(linksList);
    // If textContent is empty, fallback to panel innerText
    if (textContent.length === 0) textContent.push(document.createTextNode(panel.innerText));
    return [img || '', textContent];
  }

  // Find all card panels (excluding empty columns)
  const cards = [];
  // Hero card (desktop)
  const heroDesktop = element.querySelector('.narrow-hero__panel--desktop');
  if (heroDesktop) cards.push(heroDesktop);
  // Standard image cards
  element.querySelectorAll('.col-sm-6.col-md-4 > a.panel--image').forEach(card => {
    cards.push(card);
  });
  // News panel
  const newsPanel = element.querySelector('.panel--news');
  if (newsPanel) cards.push(newsPanel);
  // Links panel
  const linksPanel = element.querySelector('.panel--shortcuts-secondary');
  if (linksPanel) cards.push(linksPanel);
  // Colored card (green)
  const greenPanel = element.querySelector('.panel--green');
  if (greenPanel) cards.push(greenPanel);

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards14)']);
  // Card rows
  cards.forEach(panel => {
    const [img, textContent] = extractCard(panel);
    rows.push([img || '', textContent]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
