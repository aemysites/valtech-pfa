/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header
  const headerRow = ['Columns (columns80)'];

  // Defensive: Get all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Prepare columns content
  const contentRow = [];

  columns.forEach((col) => {
    // Defensive: If the column is empty, skip
    if (!col || !col.children || col.children.length === 0) {
      contentRow.push('');
      return;
    }

    // For the video column, convert iframe to a link, preserve heading
    const iframes = col.querySelectorAll('iframe');
    if (iframes.length > 0) {
      const fragment = document.createDocumentFragment();
      // Heading (if present)
      const heading = col.querySelector('h5, h4, h3, h2, h1');
      if (heading) fragment.appendChild(heading);
      // For each iframe, create a link
      Array.from(iframes).forEach((iframe) => {
        const src = iframe.getAttribute('src');
        if (src) {
          const link = document.createElement('a');
          link.href = src;
          link.textContent = 'Video: ' + (iframe.title || src);
          fragment.appendChild(link);
        }
      });
      // Add any other non-iframe content (e.g., paragraphs)
      Array.from(col.children).forEach((child) => {
        if (child.tagName !== 'IFRAME' && child.tagName !== 'DIV' && child !== heading) {
          fragment.appendChild(child);
        }
      });
      contentRow.push(fragment);
    } else {
      // For text column, just add all children as a fragment
      const fragment = document.createDocumentFragment();
      Array.from(col.children).forEach((child) => {
        fragment.appendChild(child);
      });
      contentRow.push(fragment);
    }
  });

  // Build table rows
  const rows = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
