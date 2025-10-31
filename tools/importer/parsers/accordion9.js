/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract all content nodes except empty <p>
  function getContentNodes(content) {
    return Array.from(content.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P' && node.textContent.trim() === '') {
        return false;
      }
      return true;
    });
  }

  // Extract top-level accordion items (teasers)
  function extractTeaserRows(teaser) {
    const rows = [];
    // The first toggler in teaser is the main section title
    const mainToggler = teaser.querySelector(':scope > p.accordions__toggler');
    if (!mainToggler) return rows;
    // The next sibling is the main content wrapper
    let mainContent = mainToggler.nextElementSibling;
    // Gather all nested toggler/content pairs as inner accordions
    let innerItems = [];
    if (mainContent && mainContent.classList.contains('accordions__element')) {
      const innerTogglers = Array.from(mainContent.querySelectorAll(':scope > p.accordions__toggler'));
      innerTogglers.forEach(innerToggler => {
        let innerContent = innerToggler.nextElementSibling;
        if (innerContent && innerContent.classList.contains('accordions__element')) {
          const contentNodes = getContentNodes(innerContent);
          innerItems.push([
            innerToggler.textContent.trim(),
            contentNodes.length ? contentNodes : ''
          ]);
        }
      });
    }
    // If there are innerItems, put them as a list in the content cell
    let contentCell;
    if (innerItems.length > 0) {
      // Create a fragment with all inner accordions as blocks
      const frag = document.createElement('div');
      innerItems.forEach(([title, content]) => {
        const block = document.createElement('div');
        const h = document.createElement('strong');
        h.textContent = title;
        block.appendChild(h);
        if (Array.isArray(content)) {
          content.forEach(node => block.appendChild(node.cloneNode(true)));
        } else if (content) {
          block.appendChild(document.createTextNode(content));
        }
        frag.appendChild(block);
      });
      contentCell = frag.childNodes.length ? Array.from(frag.childNodes) : '';
    } else {
      // If no innerItems, just use the main content
      if (mainContent && mainContent.classList.contains('accordions__element')) {
        const nodes = getContentNodes(mainContent);
        contentCell = nodes.length ? nodes : '';
      } else {
        contentCell = '';
      }
    }
    rows.push([
      mainToggler.textContent.trim(),
      contentCell
    ]);
    return rows;
  }

  // The block header
  const headerRow = ['Accordion (accordion9)'];
  // The main layout: two columns, each with a .col-xs-12.col-sm-6
  const cols = element.querySelectorAll(':scope > div');
  let rows = [];
  cols.forEach(col => {
    // Each col contains several .teasers__teaser blocks
    const teasers = col.querySelectorAll(':scope > div.teasers__teaser');
    teasers.forEach(teaser => {
      rows.push(...extractTeaserRows(teaser));
    });
  });

  // The block table: header + all accordion rows
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
