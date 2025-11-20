/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards105) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards105)'];
  const rows = [headerRow];

  // Find all card columns (ignore empty or 1-col divs)
  const cardCols = Array.from(element.querySelectorAll('.col-md-3'));

  cardCols.forEach((col) => {
    // Find the image (mandatory)
    let img = col.querySelector('img');
    // Find the title (usually in a <span> or <p> with font-size)
    let title = col.querySelector('span[style*="font-size"]');
    if (!title) {
      // fallback: find first <p> without image or link
      title = Array.from(col.querySelectorAll('p')).find(p => !p.querySelector('img') && !p.querySelector('a'));
    }
    // Find CTA (link with text)
    let cta = Array.from(col.querySelectorAll('a')).find(a => a.textContent.trim().toLowerCase().includes('læs mere'));
    // Compose text cell
    const textCell = [];
    if (title) {
      // Make title a heading (h3)
      const heading = document.createElement('h3');
      heading.textContent = title.textContent.trim();
      textCell.push(heading);
    }
    if (cta) {
      textCell.push(cta);
    }
    // Add row: [image, text content]
    if (img && textCell.length) {
      rows.push([img, textCell]);
    }
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
