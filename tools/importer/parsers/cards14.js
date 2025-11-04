/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract CTA from a card
  function extractCTA(card) {
    // Look for .cta-btn or a single link at the bottom
    const cta = card.querySelector('.cta-btn, a.cta-btn');
    if (cta) return cta.cloneNode(true);
    // For news card, look for .panel__tags a
    const tagsLink = card.querySelector('.panel__tags a');
    if (tagsLink) return tagsLink.cloneNode(true);
    // For generic case, pick last anchor in card if it looks like a CTA
    const links = Array.from(card.querySelectorAll('a'));
    if (links.length === 1) return links[0].cloneNode(true);
    return null;
  }

  // Helper to extract image from a card
  function extractImage(card) {
    // Look for img inside .panel__image or direct img
    const img = card.querySelector('.panel__image img, img');
    return img ? img.cloneNode(true) : '';
  }

  // Helper to extract text content from a card
  function extractText(card) {
    const textParts = [];
    // Kicker
    const kicker = card.querySelector('.panel__kicker');
    if (kicker) textParts.push(kicker.cloneNode(true));
    // Headline (fix for investeringsprofiler card: headline is <h2><p>...</p></h2>)
    let headline = card.querySelector('.panel__headline');
    if (headline) {
      // If headline is empty and has a <p> child, use the <p> as headline
      if (!headline.textContent.trim() && headline.querySelector('p')) {
        const h2 = document.createElement('h2');
        h2.textContent = headline.querySelector('p').textContent;
        textParts.push(h2);
      } else {
        textParts.push(headline.cloneNode(true));
      }
    }
    // Description: <p> after headline, or <ul>, or .panel__tags
    // For podcast/senior/investeringstendenser cards: <p> after headline
    const descs = Array.from(card.querySelectorAll('p')).filter(
      p => !p.classList.contains('panel__kicker') && (!headline || p !== headline)
    );
    descs.forEach(p => textParts.push(p.cloneNode(true)));
    // For news card: <ul.panel__news-list>
    const newsList = card.querySelector('.panel__news-list');
    if (newsList) {
      // Only push if it contains at least one <li>
      if (newsList.querySelector('li')) {
        textParts.push(newsList.cloneNode(true));
      }
    }
    // For news card: .panel__tags (Se flere nyheder >)
    const tags = card.querySelector('.panel__tags');
    if (tags) textParts.push(tags.cloneNode(true));
    // For links card: <ul.panel__list>
    const linkList = card.querySelector('.panel__list');
    if (linkList) textParts.push(linkList.cloneNode(true));
    // For CTA
    const cta = extractCTA(card);
    if (cta && !textParts.some(el => el.isSameNode(cta))) {
      textParts.push(cta);
    }
    return textParts;
  }

  // Find all cards (panels) in the block, including the hero card
  const cards = [];
  // Hero card (desktop)
  const heroPanel = element.querySelector('.narrow-hero__panel--desktop');
  if (heroPanel) cards.push(heroPanel);
  // Podcast card
  const podcastPanel = element.querySelector('.col-sm-6.col-md-4 > a.panel.panel--image');
  if (podcastPanel) cards.push(podcastPanel);
  // Seniorliv card
  const seniorPanel = Array.from(element.querySelectorAll('.col-sm-6.col-md-4 > a.panel.panel--image'))[1];
  if (seniorPanel) cards.push(seniorPanel);
  // News card
  const newsPanel = element.querySelector('.panel.panel--news');
  if (newsPanel) cards.push(newsPanel);
  // Investeringstendenser card
  const investPanel = Array.from(element.querySelectorAll('.col-sm-6.col-md-4 > a.panel.panel--image'))[2];
  if (investPanel) cards.push(investPanel);
  // Nyttige links card
  const linksPanel = element.querySelector('.panel.panel--shortcuts-secondary');
  if (linksPanel) cards.push(linksPanel);
  // Investeringsprofiler card
  const profilerPanel = element.querySelector('.panel.panel--green');
  if (profilerPanel) cards.push(profilerPanel);

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards14)']);

  // Each card: [image/icon, text content]
  cards.forEach(card => {
    const img = extractImage(card);
    const text = extractText(card);
    rows.push([img, text]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
