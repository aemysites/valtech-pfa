/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards84) block: 2 columns, header row, each card = [image/icon, text]
  const cardsContainer = element.querySelector('.icon-and-text');
  if (!cardsContainer) return;

  const cardLinks = Array.from(cardsContainer.querySelectorAll('.icon-and-text__link'));
  if (!cardLinks.length) return;

  const rows = [];
  rows.push(['Cards (cards84)']);

  cardLinks.forEach((cardLink) => {
    // Image/icon
    const imgDiv = cardLink.querySelector('.icon-and-text__image');
    let imageEl = null;
    if (imgDiv) {
      imageEl = imgDiv.querySelector('img');
    }
    // Text as anchor
    const textDiv = cardLink.querySelector('.icon-and-text__text');
    let anchorEl = null;
    if (textDiv) {
      anchorEl = document.createElement('a');
      anchorEl.href = cardLink.getAttribute('href');
      anchorEl.textContent = textDiv.textContent.trim();
    }
    if (imageEl && anchorEl) {
      rows.push([imageEl, anchorEl]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
