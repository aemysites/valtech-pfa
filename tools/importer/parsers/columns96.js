/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns96)'];

  // Get all direct child columns (skip empty ones)
  const columns = Array.from(element.querySelectorAll(':scope > div'))
    .filter(col => {
      // Only keep columns that have actual teaser content (not empty)
      const teaser = col.querySelector('.teasers__teaser');
      return teaser && (teaser.textContent.trim() !== '' || teaser.querySelector('img'));
    });

  // Each column contains an image and a number (text)
  const contentRow = columns.map(col => {
    const teaser = col.querySelector('.teasers__teaser');
    if (!teaser) return '';

    // Find the image link and image
    const imgLink = teaser.querySelector('a[href]');
    const img = imgLink ? imgLink.querySelector('img') : null;

    // Find the number text inside the teaser (should be inside the img alt or as textContent)
    // In this HTML, the numbers are likely rendered as part of the SVG, but let's check for text nodes
    let numberText = '';
    // Check for text nodes directly inside teaser
    const textNodes = Array.from(teaser.childNodes).filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== '');
    if (textNodes.length) {
      numberText = textNodes.map(n => n.textContent.trim()).join(' ');
    } else {
      // Try to extract number from img alt if present
      if (img && img.alt && img.alt.trim()) {
        numberText = img.alt.trim();
      }
    }
    // If still empty, try to extract from <p> or other tags
    if (!numberText) {
      const p = teaser.querySelector('p');
      if (p && p.textContent.trim()) {
        numberText = p.textContent.trim();
      }
    }
    // If still empty, try to extract number from the image src filename
    if (!numberText && img && img.src) {
      const match = img.src.match(/hvid-stjerne(\d)\.svg/);
      if (match) {
        numberText = match[1];
      }
    }

    // Compose cell: image (wrapped in link), then number below
    const cell = document.createElement('div');
    cell.style.textAlign = 'center';
    if (imgLink && img) {
      const imgClone = img.cloneNode(true);
      const linkClone = imgLink.cloneNode(false);
      linkClone.appendChild(imgClone);
      cell.appendChild(linkClone);
    }
    if (numberText) {
      cell.appendChild(document.createElement('br'));
      cell.appendChild(document.createTextNode(numberText));
    }
    return cell;
  });

  const cells = [
    headerRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
