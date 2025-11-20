/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards45) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards45)'];

  // 2. Find all card links in the container
  // The actual cards are <a class="icon-and-text__link"> elements
  const cardLinks = Array.from(element.querySelectorAll('.icon-and-text__link'));

  // 3. Build rows for each card
  const rows = cardLinks.map((link) => {
    // Image: Find the first <img> inside the link
    const img = link.querySelector('img');
    // Text: Find the text container
    const textDiv = link.querySelector('.icon-and-text__text');
    // Defensive: If missing, fallback to link.textContent
    let textContent;
    if (textDiv) {
      // Wrap in <strong> for heading style as per block description
      const strong = document.createElement('strong');
      strong.textContent = textDiv.textContent.trim();
      textContent = strong;
    } else {
      const strong = document.createElement('strong');
      strong.textContent = link.textContent.trim();
      textContent = strong;
    }
    // Each row: [image, text]
    return [img, textContent];
  });

  // 4. Compose table data
  const cells = [headerRow, ...rows];

  // 5. Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace original element with block
  element.replaceWith(block);
}
