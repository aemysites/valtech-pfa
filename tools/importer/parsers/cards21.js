/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Find all card columns (each card is in a .col-xs-12.col-sm-4)
  const cardColumns = element.querySelectorAll('.col-xs-12.col-sm-4');

  cardColumns.forEach((col) => {
    const teaser = col.querySelector('.teasers__teaser');
    if (!teaser) return;

    // Collect ALL images (background + icon) for the first cell
    const imgs = teaser.querySelectorAll('img');
    const imgCell = Array.from(imgs);

    // Collect all text content: heading, all paragraphs, links, toggler spans, etc.
    const textCell = document.createElement('div');

    // Title
    const title = teaser.querySelector('h3');
    if (title) textCell.appendChild(title.cloneNode(true));

    // All paragraphs (some cards have multiple <p>)
    teaser.querySelectorAll('p').forEach((p) => {
      textCell.appendChild(p.cloneNode(true));
    });

    // Also include any direct children that are not img or h3 or p (e.g., toggler spans)
    Array.from(teaser.children).forEach((child) => {
      if (!['IMG', 'H3', 'P'].includes(child.tagName)) {
        textCell.appendChild(child.cloneNode(true));
      }
    });

    rows.push([
      imgCell.length ? imgCell : '',
      textCell.childNodes.length ? Array.from(textCell.childNodes) : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
