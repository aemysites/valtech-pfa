/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card image or color block
  function getCardImage(card) {
    const img = card.querySelector('.panel__image img');
    if (img) return img;
    // Use color block for visually distinct cards (green CTA)
    if (card.classList.contains('panel--green')) {
      const colorDiv = document.createElement('div');
      colorDiv.setAttribute('style', 'background:#00676e;width:40px;height:40px;border-radius:6px;');
      return colorDiv;
    }
    // For shortcuts/links card, use the chevron SVG from the first link
    if (card.classList.contains('panel--shortcuts-secondary')) {
      const firstChevron = card.querySelector('.panel__link img');
      if (firstChevron) return firstChevron.cloneNode(true);
    }
    // For news card, use a generic icon (newspaper emoji)
    if (card.classList.contains('panel--news')) {
      const iconDiv = document.createElement('div');
      iconDiv.textContent = '\uD83D\uDCF0';
      iconDiv.setAttribute('style', 'font-size:32px;line-height:40px;text-align:center;width:40px;height:40px;');
      return iconDiv;
    }
    // If no image or icon, return empty span (never null)
    return document.createElement('span');
  }

  // Helper to extract all text content from a card, including links, lists, and all visible text
  function getCardText(card) {
    const body = card.querySelector('.panel__body');
    if (!body) return null;
    const parts = [];
    body.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        parts.push(node.cloneNode(true));
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        parts.push(document.createTextNode(node.textContent));
      }
    });
    return parts.length ? parts : null;
  }

  // Find all card containers (by column)
  const cards = [];
  // Hero (desktop)
  const heroDesktop = element.querySelector('.narrow-hero__panel--desktop');
  if (heroDesktop) {
    const img = getCardImage(heroDesktop);
    const text = getCardText(heroDesktop);
    if (text) cards.push([img, text]);
  }

  // All other cards: select all .col-sm-6.col-md-4 > a or > .panel
  element.querySelectorAll('.col-sm-6.col-md-4').forEach((col) => {
    let card = col.querySelector('a.panel, .panel');
    if (!card) return;
    const img = getCardImage(card);
    const text = getCardText(card);
    if (text) cards.push([img, text]);
  });

  // Table header
  const headerRow = ['Cards (cards1)'];
  const tableRows = [headerRow, ...cards];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
