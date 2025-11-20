/* global WebImporter */
export default function parse(element, { document }) {
  // Find all .row.teasers blocks (each represents a columns block)
  const teaserRows = Array.from(element.querySelectorAll('.row.teasers'));
  const tableRows = [];

  teaserRows.forEach(teaserRow => {
    // Find all direct child .row elements inside the teasers block
    const contentRows = Array.from(teaserRow.querySelectorAll(':scope > .row'));
    contentRows.forEach(row => {
      // Only process rows with both .col-sm-7 and .col-sm-5
      const leftCol = row.querySelector('.col-sm-7');
      const rightCol = row.querySelector('.col-sm-5');
      if (!leftCol || !rightCol) return;

      // --- LEFT COLUMN ---
      // Collect all text content from leftCol, including headings, paragraphs, and buttons
      const leftContent = document.createElement('div');
      // Include all content from leftCol (not just h2, teaser, cta)
      Array.from(leftCol.childNodes).forEach(child => {
        if (
          child.nodeType === Node.ELEMENT_NODE ||
          (child.nodeType === Node.TEXT_NODE && child.textContent.trim())
        ) {
          leftContent.appendChild(child.cloneNode(true));
        }
      });

      // --- RIGHT COLUMN ---
      // Collect all content from rightCol (not just images)
      const rightContent = document.createElement('div');
      Array.from(rightCol.childNodes).forEach(child => {
        if (
          child.nodeType === Node.ELEMENT_NODE ||
          (child.nodeType === Node.TEXT_NODE && child.textContent.trim())
        ) {
          rightContent.appendChild(child.cloneNode(true));
        }
      });

      tableRows.push([leftContent, rightContent]);
    });
  });

  // Table header
  const headerRow = ['Columns (columns136)'];
  const cells = [headerRow, ...tableRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
