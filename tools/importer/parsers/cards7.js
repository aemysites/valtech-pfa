/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card image and text content
  function extractImageAndText(cardEl) {
    let img = cardEl.querySelector('.panel__image img');
    let body = cardEl.querySelector('.panel__body');
    let textContent = body || cardEl;
    // Always return two columns, even if no image
    return [img || '', textContent];
  }

  // Find all card containers in visual order
  const cards = [];
  // Hero card (desktop only, as screenshot shows desktop layout)
  const heroDesktop = element.querySelector('.narrow-hero__panel--desktop');
  if (heroDesktop) {
    cards.push(heroDesktop);
  }
  // Spot cards (image cards)
  element.querySelectorAll('.col-sm-6.col-md-4 > a.panel--image').forEach(card => {
    cards.push(card);
  });
  // News panel
  const newsPanel = element.querySelector('.panel--news');
  if (newsPanel) {
    cards.push(newsPanel);
  }
  // Links panel
  const linksPanel = element.querySelector('.panel--shortcuts-secondary');
  if (linksPanel) {
    cards.push(linksPanel);
  }
  // Green panel (CTA)
  const greenPanel = element.querySelector('.panel--green');
  if (greenPanel) {
    cards.push(greenPanel);
  }

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards7)']);
  // Card rows
  cards.forEach(cardEl => {
    const [img, textContent] = extractImageAndText(cardEl);
    rows.push([
      img,
      textContent
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace element
  element.replaceWith(block);
}
