/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main striped table (visible version)
  const table = element.querySelector('table.table.show-in-print') || element.querySelector('table.table');
  if (!table) return;

  // Extract header cells from the table's thead for column headers
  const thead = table.querySelector('thead');
  const headerCells = Array.from(thead.querySelectorAll('th')).map(th => {
    return th.textContent.replace(/\s+/g, ' ').trim();
  });

  // Extract all rows from tbody
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr')).map(tr => {
    return Array.from(tr.children).map(td => {
      const links = td.querySelectorAll('a');
      if (links.length > 0) {
        if (links.length === td.childNodes.length) {
          const frag = document.createDocumentFragment();
          links.forEach(a => frag.appendChild(a.cloneNode(true)));
          return frag;
        }
        const div = document.createElement('div');
        Array.from(td.childNodes).forEach(node => div.appendChild(node.cloneNode(true)));
        return div;
      }
      if (td.childNodes.length > 1 || td.firstElementChild) {
        const div = document.createElement('div');
        Array.from(td.childNodes).forEach(node => div.appendChild(node.cloneNode(true)));
        return div;
      }
      return td.textContent.replace(/\s+/g, ' ').trim();
    });
  });

  // Build the block table with correct header row (block name) and column header row
  const headerRow = ['Table (striped, tableStriped144)'];
  const cells = [headerRow, headerCells, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Find the CTA button below the table (if present)
  let cta = null;
  const ctaDiv = element.querySelector('.col-xs-12.text-center');
  if (ctaDiv) {
    cta = ctaDiv.querySelector('a');
  }

  // Replace the original element with the table block
  element.replaceWith(block);
  // If CTA exists, insert it after the block
  if (cta && block.parentNode) {
    block.parentNode.insertBefore(cta, block.nextSibling);
  }
}
