/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards126) block: 2 columns, multiple rows, each card = image + text
  const headerRow = ['Cards (cards126)'];
  const rows = [headerRow];

  // Find all card items inside the parent container
  // Each card is a .press-item div
  const cardItems = element.querySelectorAll('.press-item');

  cardItems.forEach((card) => {
    // Image: first <img> in card
    const img = card.querySelector('img');

    // Text: all non-image content in card
    // We'll take all <p> elements (there's only one per card)
    const textContent = card.querySelector('p');

    // Defensive: If image or text missing, skip this card
    if (!img || !textContent) return;

    // Add row: [image, text]
    rows.push([img, textContent]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
