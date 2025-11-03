/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all top-level accordion items from a column
  function extractAccordionItems(col) {
    const items = [];
    // Each teaser is a top-level accordion group
    const teasers = Array.from(col.querySelectorAll(':scope > .teasers__teaser'));
    teasers.forEach(teaser => {
      // The first .accordions__toggler is the main section title
      const mainToggler = teaser.querySelector(':scope > .accordions__toggler');
      if (mainToggler) {
        // The first .accordions__element is the main section content
        const mainElement = teaser.querySelector(':scope > .accordions__element');
        if (mainElement) {
          // Clone the mainElement so we can safely manipulate it
          const contentClone = mainElement.cloneNode(true);
          // Remove any empty <p> at the start
          while (
            contentClone.firstElementChild &&
            contentClone.firstElementChild.tagName === 'P' &&
            !contentClone.firstElementChild.textContent.trim()
          ) {
            contentClone.removeChild(contentClone.firstElementChild);
          }
          // If there are nested togglers, include them and their content
          // as part of the content cell
          // (leave the structure as is, so the inner accordions are preserved)
          items.push([
            mainToggler,
            contentClone
          ]);
        }
      }
    });
    return items;
  }

  // Find both columns
  const cols = Array.from(element.querySelectorAll(':scope > .row > .col-xs-12'));
  let allItems = [];
  if (cols.length > 0) {
    cols.forEach(col => {
      allItems = allItems.concat(extractAccordionItems(col));
    });
  } else {
    // Fallback: maybe no .row wrapper, just .col-xs-12
    const fallbackCols = Array.from(element.querySelectorAll(':scope > .col-xs-12'));
    fallbackCols.forEach(col => {
      allItems = allItems.concat(extractAccordionItems(col));
    });
  }

  // Build the table
  const headerRow = ['Accordion (accordion21)'];
  const tableRows = [headerRow];
  allItems.forEach(([titleEl, contentEl]) => {
    // Defensive: skip empty titles
    if (!titleEl || !contentEl) return;
    tableRows.push([
      titleEl,
      contentEl
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
