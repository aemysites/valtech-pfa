/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns4)'];

  // Find the main .row.teasers .row (contains columns)
  const mainRow = element.querySelector('.row.teasers .row');
  if (!mainRow) return;

  // Get the two columns
  const columns = mainRow.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // LEFT COLUMN: represent video visually as a link with the iframe's title
  const leftCol = columns[0];
  let leftContent = '';
  const iframe = leftCol.querySelector('iframe');
  if (iframe && iframe.src) {
    const a = document.createElement('a');
    a.href = iframe.src;
    a.textContent = iframe.title ? iframe.title : 'Video';
    leftContent = a;
  }

  // RIGHT COLUMN: heading + all paragraphs
  const rightCol = columns[1];
  const rightContent = [];
  // Heading
  const heading = rightCol.querySelector('h2');
  if (heading) rightContent.push(heading);
  // All paragraphs in all .teasers__teaser blocks in rightCol
  rightCol.querySelectorAll('.teasers__teaser p').forEach(p => {
    if (p.textContent.trim()) rightContent.push(p);
  });

  // Build table rows
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
