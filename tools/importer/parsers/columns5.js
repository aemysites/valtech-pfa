/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // --- LEFT COLUMN ---
  const leftCol = columns[0];
  let leftContent = [];
  // Heading
  const heading = leftCol.querySelector('h5');
  if (heading) leftContent.push(heading);
  // Paragraphs and links
  const teasers = leftCol.querySelectorAll('.teasers__teaser');
  teasers.forEach(teaser => {
    Array.from(teaser.childNodes).forEach(node => {
      // Only add elements (p, a, etc) and skip empty text nodes
      if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) {
        leftContent.push(node);
      }
    });
  });

  // --- RIGHT COLUMN ---
  const rightCol = columns[1];
  let rightContent = [];
  // Find image (img inside h3)
  const img = rightCol.querySelector('img');
  if (img) rightContent.push(img);

  // Table header must match block name exactly
  const headerRow = ['Columns (columns5)'];
  const contentRow = [leftContent, rightContent];

  // Create table with correct structure
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
