/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content container
  const container = element.querySelector('.container-fluid') || element;

  // Extract heading and intro paragraph
  const heading = container.querySelector('h2');
  const intro = container.querySelector('p');

  // Find the accordion toggler (the clickable header for the accordion item)
  const toggler = container.querySelector('.accordions__toggler');

  // Find the accordion content block
  let accordionContent = null;
  if (toggler) {
    let next = toggler.nextElementSibling;
    if (next && next.classList.contains('accordions__element')) {
      accordionContent = next;
    }
  }
  if (!accordionContent) {
    accordionContent = container.querySelector('.accordions__element');
  }

  // Defensive: If toggler or accordionContent missing, do not create block
  if (!toggler || !accordionContent) return;

  // Compose the content cell: include the main table (prefer show-in-print), and all non-empty paragraphs inside accordionContent
  let table = accordionContent.querySelector('table.show-in-print') || accordionContent.querySelector('table');
  if (table) {
    // Fix: For the 'Ulemper' row, ensure the label and list are together in the table cell
    const ulemperRow = Array.from(table.querySelectorAll('tr')).find(tr => {
      const firstCell = tr.querySelector('td');
      return firstCell && firstCell.textContent.trim().toLowerCase().includes('ulemper');
    });
    if (ulemperRow) {
      const firstCell = ulemperRow.querySelector('td');
      const secondCell = firstCell.nextElementSibling;
      // If the first cell is empty, but the label is outside the list, move it into the cell
      if (firstCell && !firstCell.textContent.trim()) {
        firstCell.innerHTML = '<p><strong>Ulemper</strong></p>';
      }
    }
  }
  const paragraphs = Array.from(accordionContent.querySelectorAll('p')).filter(p => p.textContent.trim());
  // Remove duplicate or misplaced 'Ulemper' paragraphs
  const filteredParagraphs = paragraphs.filter(p => !/^Ulemper$/i.test(p.textContent.trim()));
  const contentCell = [table, ...filteredParagraphs].filter(Boolean);

  // Compose table rows
  const headerRow = ['Accordion (accordion4)'];
  const rows = [];

  // Add heading and intro as a first row (if present)
  if (heading || intro) {
    rows.push([
      heading ? heading.textContent.trim() : '',
      intro ? intro.textContent.trim() : ''
    ]);
  }

  // Add the accordion item row
  rows.push([
    toggler.textContent.trim(),
    contentCell
  ]);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);

  // Replace the original element with the block
  element.replaceWith(block);
}
