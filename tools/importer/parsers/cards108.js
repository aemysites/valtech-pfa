/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from anchor.card structure
  function extractCard(cardAnchor) {
    // Find image
    const img = cardAnchor.querySelector('.panel__image img');
    // Find headline
    const headline = cardAnchor.querySelector('.panel__body .panel__headline');
    // Find description (if any)
    let description = null;
    // Try to find a paragraph or span below the headline
    const body = cardAnchor.querySelector('.panel__body');
    if (body) {
      // Get all children after headline
      const children = Array.from(body.childNodes);
      const headlineIdx = children.indexOf(headline);
      if (headlineIdx > -1 && headlineIdx < children.length - 1) {
        for (let i = headlineIdx + 1; i < children.length; i++) {
          const node = children[i];
          // Accept text nodes or elements that are not the CTA
          if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('cta-btn')) {
            description = node;
            break;
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            // Wrap text node in span
            const span = document.createElement('span');
            span.textContent = node.textContent.trim();
            description = span;
            break;
          }
        }
      }
    }
    // Find CTA span (contains text and icon)
    const ctaSpan = cardAnchor.querySelector('.panel__body .cta-btn');
    // Compose text cell: headline + description + CTA
    const textCellContent = [];
    if (headline) textCellContent.push(headline);
    if (description) textCellContent.push(description);
    if (ctaSpan) {
      // Convert CTA to a link if possible
      const parentA = cardAnchor;
      if (parentA && parentA.href) {
        const a = document.createElement('a');
        a.href = parentA.href;
        a.textContent = ctaSpan.textContent.trim();
        textCellContent.push(a);
      } else {
        textCellContent.push(ctaSpan);
      }
    }
    return [img, textCellContent];
  }

  // Only extract cards (do not include hero or sticky banner)
  const cardAnchors = Array.from(
    element.querySelectorAll('.anchor.col-sm-6.col-md-4 > a.panel.panel--image')
  );

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards108)']);
  // Card rows
  cardAnchors.forEach(cardAnchor => {
    rows.push(extractCard(cardAnchor));
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
