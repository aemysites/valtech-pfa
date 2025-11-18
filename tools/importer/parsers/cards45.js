/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards45) block parsing
  // Find the parent container holding all card instances
  // In this HTML, cards are anchor tags inside .icon-and-text

  // 1. Header row
  const headerRow = ['Cards (cards45)'];

  // 2. Find all card elements (anchors)
  const cardsContainer = element.querySelector('.icon-and-text');
  if (!cardsContainer) return;
  const cardLinks = Array.from(cardsContainer.querySelectorAll('a.icon-and-text__link'));

  // 3. Build card rows
  const rows = cardLinks.map(card => {
    // Image: first child div with img
    const imgDiv = card.querySelector('.icon-and-text__image');
    let img = imgDiv ? imgDiv.querySelector('img') : null;
    // Text: second child div
    const textDiv = card.querySelector('.icon-and-text__text');
    // Compose cell 2: text as heading (strong)
    let textCell;
    if (textDiv) {
      // Wrap in <strong> for heading style, as per block spec
      const strong = document.createElement('strong');
      strong.textContent = textDiv.textContent.trim();
      textCell = strong;
    } else {
      textCell = '';
    }
    return [img, textCell];
  });

  // 4. Compose table
  const tableCells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // 5. Replace original element
  element.replaceWith(blockTable);
}
