/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all accordion sections and their nested items
  function extractAccordionSections(col) {
    const rows = [];
    col.querySelectorAll('.teasers__teaser').forEach(teaser => {
      // Top-level section title
      const sectionTitle = teaser.querySelector('.accordions__toggler');
      if (!sectionTitle) return;
      const sectionContentContainer = sectionTitle.nextElementSibling;
      let hasSubItems = false;
      // Collect all sub-items (nested toggler/content pairs)
      if (sectionContentContainer) {
        let node = sectionContentContainer.firstChild;
        const frag = document.createDocumentFragment();
        while (node) {
          if (node.nodeType === 1 && node.classList.contains('accordions__toggler')) {
            const content = node.nextElementSibling;
            if (content && content.classList.contains('accordion__element')) {
              frag.appendChild(node.cloneNode(true));
              frag.appendChild(content.cloneNode(true));
              hasSubItems = true;
              node = content.nextSibling;
              continue;
            }
          }
          node = node.nextSibling;
        }
        if (hasSubItems) {
          rows.push([
            sectionTitle.cloneNode(true),
            frag
          ]);
        }
      }
      // If no sub-items, add the section title as its own row
      if (!hasSubItems) {
        rows.push([
          sectionTitle.cloneNode(true),
          sectionContentContainer ? sectionContentContainer.cloneNode(true) : ''
        ]);
      }
    });
    return rows;
  }

  // Get the two columns
  const columns = element.querySelectorAll('.col-xs-12.col-sm-6');
  const leftRows = columns[0] ? extractAccordionSections(columns[0]) : [];
  const rightRows = columns[1] ? extractAccordionSections(columns[1]) : [];

  // Interleave rows to match screenshot's two-column grid
  const rows = [];
  const maxRows = Math.max(leftRows.length, rightRows.length);
  for (let i = 0; i < maxRows; i++) {
    if (leftRows[i]) rows.push(leftRows[i]);
    if (rightRows[i]) rows.push(rightRows[i]);
  }

  // Table header
  const headerRow = ['Accordion (accordion10)'];
  const tableCells = [headerRow, ...rows];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
