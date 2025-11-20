/* global WebImporter */
export default function parse(element, { document }) {
  // Find the four columns (direct children of the row)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (!columns.length) return;

  // Block header row
  const headerRow = ['Columns (columns52)'];

  // For each column, collect its content as a fragment
  const contentRow = columns.map((col) => {
    // Gather all direct children (including .teasers__teaser and any p outside)
    const frag = document.createDocumentFragment();
    Array.from(col.childNodes).forEach((node) => {
      // Only append non-empty nodes
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip empty paragraphs, spans, divs, h4s
        if (['P','SPAN','DIV','H4'].includes(node.tagName) && !node.textContent.trim()) return;
        frag.appendChild(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        frag.appendChild(document.createTextNode(node.textContent));
      }
    });
    // If nothing, fallback to the column itself
    if (!frag.childNodes.length) frag.appendChild(col);
    return frag;
  });

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
