/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion47)'];

  // Helper to extract accordion items from a column
  function extractAccordionItems(col) {
    const items = [];
    // Find all toggler elements (accordion headers)
    const togglers = Array.from(col.querySelectorAll('.accordions__toggler'));
    togglers.forEach((toggler) => {
      // The content is the next sibling with class 'accordions__element'
      let content = toggler.nextElementSibling;
      while (content && !content.classList.contains('accordions__element')) {
        content = content.nextElementSibling;
      }
      // Defensive: Only add if both title and content exist
      if (toggler && content) {
        // Title cell: include ALL elements above the toggler up to the start of the teaser
        const titleParts = [];
        let node = toggler.parentNode.firstChild;
        while (node && node !== toggler) {
          // Clone and add every element, including <p>&nbsp;</p>
          titleParts.push(node.cloneNode(true));
          node = node.nextSibling;
        }
        // Always include the toggler itself (button)
        titleParts.push(toggler.cloneNode(true));
        // Compose title cell
        const titleCell = titleParts;
        // Content cell: the accordion content
        items.push([titleCell, content.cloneNode(true)]);
      }
    });
    return items;
  }

  // Find the two columns
  const columns = element.querySelectorAll(':scope > div > div');
  let leftCol, rightCol;
  if (columns.length === 2) {
    [leftCol, rightCol] = columns;
  } else {
    leftCol = element.querySelector('.col-xs-12.col-sm-6');
    rightCol = element.querySelectorAll('.col-xs-12.col-sm-6')[1];
  }

  // Extract accordion items from both columns
  const leftItems = leftCol ? extractAccordionItems(leftCol) : [];
  const rightItems = rightCol ? extractAccordionItems(rightCol) : [];

  // Build the table: header row, then each row is a single accordion item (title, content)
  const tableRows = [headerRow];
  for (let i = 0; i < leftItems.length; i++) {
    tableRows.push([leftItems[i][0], leftItems[i][1]]);
  }
  for (let i = 0; i < rightItems.length; i++) {
    tableRows.push([rightItems[i][0], rightItems[i][1]]);
  }

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
