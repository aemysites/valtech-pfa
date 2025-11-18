/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct column divs (should be 4)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (!columns.length) return;

  // Block header row (must match spec)
  const headerRow = ['Columns (columns52)'];

  // Helper to filter out empty and redundant nodes
  function cleanNodes(nodes) {
    return nodes.filter((node) => {
      // Remove empty paragraphs/spans and teasers__teaser wrappers
      if (node.nodeType !== 1) return false;
      if (node.classList.contains('teasers__teaser')) return false;
      if ((node.tagName === 'P' || node.tagName === 'SPAN') && node.textContent.trim() === '') return false;
      return true;
    });
  }

  // For each column, extract its content
  const contentRow = columns.map((col) => {
    // Find the first image in the column (if any)
    const img = col.querySelector('img');
    // Gather all direct children of .teasers__teaser blocks
    const teasers = Array.from(col.querySelectorAll(':scope > .teasers__teaser'));
    let teaserChildren = [];
    teasers.forEach((teaser) => {
      teaserChildren.push(...cleanNodes(Array.from(teaser.children)));
    });
    // Also collect direct children not inside .teasers__teaser (e.g. paragraphs, links)
    const extras = cleanNodes(Array.from(col.childNodes).filter((node) => {
      if (node.nodeType !== 1) return false;
      if (node.classList.contains('teasers__teaser')) return false;
      return ['P', 'UL', 'H3', 'H4'].includes(node.tagName);
    }));
    // Compose cell content: image (if present), then all teaser children, then extras
    const cellContent = [];
    if (img) cellContent.push(img);
    teaserChildren.forEach((child) => cellContent.push(child));
    extras.forEach((extra) => cellContent.push(extra));
    // If nothing found, fallback to the whole column
    if (cellContent.length === 0) return col;
    return cellContent;
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
