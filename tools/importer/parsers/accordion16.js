/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract accordion items from a column
  function extractAccordionItems(col) {
    const items = [];
    // Each accordion group is a .teasers__teaser
    const teasers = Array.from(col.querySelectorAll('.teasers__teaser'));
    teasers.forEach(teaser => {
      // The first toggler is the section title
      const toggler = teaser.querySelector('.accordions__toggler');
      if (!toggler) return;
      // The first .accordions__element after toggler is the section root (may be empty)
      let el = toggler.nextElementSibling;
      if (!el || !el.classList.contains('accordions__element')) return;
      // If there are nested toggler/content pairs, extract them
      const innerTogglers = Array.from(el.querySelectorAll(':scope > .accordions__toggler'));
      if (innerTogglers.length > 0) {
        innerTogglers.forEach(innerToggler => {
          const contentEl = innerToggler.nextElementSibling && innerToggler.nextElementSibling.classList.contains('accordions__element') ? innerToggler.nextElementSibling : null;
          let contentCell = '';
          if (contentEl) {
            // Collect all child nodes (including text, links, paragraphs, etc.)
            const nodes = Array.from(contentEl.childNodes);
            // Always include all nodes, even if empty
            contentCell = nodes.length === 1 ? nodes[0] : nodes;
          }
          items.push([innerToggler.textContent.trim(), contentCell]);
        });
      } else {
        // No inner togglers, treat as a single item
        const nodes = Array.from(el.childNodes);
        const contentCell = nodes.length === 1 ? nodes[0] : nodes;
        items.push([toggler.textContent.trim(), contentCell]);
      }
    });
    return items;
  }

  // Find both columns
  const columns = Array.from(element.querySelectorAll(':scope > div.row > div'));
  let rows = [];
  columns.forEach(col => {
    rows = rows.concat(extractAccordionItems(col));
  });

  // Header row
  const headerRow = ['Accordion (accordion16)'];
  // Compose table: header row, then each accordion item as [title, content]
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
