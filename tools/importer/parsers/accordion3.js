/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion3)'];

  // Find the main content container
  const container = element.querySelector('.container-fluid');
  if (!container) return;

  // Extract heading and all descriptive paragraphs (before the toggler)
  const h2 = container.querySelector('h2');
  const descParas = [];
  let foundToggler = false;
  container.querySelectorAll('p').forEach(p => {
    if (p.classList.contains('accordions__toggler')) {
      foundToggler = true;
    } else if (!foundToggler) {
      descParas.push(p);
    }
  });

  // Compose intro fragment (heading + description)
  const introFragment = document.createDocumentFragment();
  if (h2) introFragment.appendChild(h2.cloneNode(true));
  descParas.forEach(p => {
    if (p.textContent.trim()) {
      introFragment.appendChild(p.cloneNode(true));
    }
  });

  // Find the accordion toggler (title for the first item)
  const toggler = container.querySelector('.accordions__toggler');

  // Find the accordion content (the details block)
  const accordionElement = container.querySelector('.accordions__element');

  // Compose the rows
  const rows = [headerRow];

  if (toggler && accordionElement) {
    // Compose the content cell: intro content + accordion details (only one table)
    const contentFragment = document.createDocumentFragment();
    contentFragment.appendChild(introFragment);
    // Only include the first pension info table (not both)
    const mainTable = accordionElement.querySelector('table');
    if (mainTable) {
      contentFragment.appendChild(mainTable.cloneNode(true));
    }
    // Include only non-empty, non-duplicate explanatory footnotes after the table
    const seenFootnotes = new Set();
    accordionElement.querySelectorAll('p').forEach(p => {
      const txt = p.textContent.trim();
      if (txt && !seenFootnotes.has(txt) && txt !== 'Ulemper') {
        contentFragment.appendChild(p.cloneNode(true));
        seenFootnotes.add(txt);
      }
    });
    rows.push([
      toggler.cloneNode(true), // Title cell (clickable label)
      contentFragment // Content cell (intro + accordion details)
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
