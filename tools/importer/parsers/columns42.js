/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns42)'];

  // Get immediate children (columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Left column: image and caption
  const leftCol = columns[0];
  const leftContent = [];
  const img = leftCol.querySelector('img');
  if (img) leftContent.push(img);
  const caption = leftCol.querySelector('em, span');
  if (caption) leftContent.push(caption);

  // Right column: heading, paragraphs, links, button
  const rightCol = columns[1];
  const rightContent = [];
  const teaser = rightCol.querySelector('.teasers__teaser');
  if (teaser) {
    Array.from(teaser.children).forEach((child) => {
      // Omit empty elements (empty divs, empty paragraphs)
      if (
        (child.tagName === 'DIV' || child.tagName === 'P') &&
        !child.textContent.trim() &&
        child.querySelectorAll('a, strong, em, img').length === 0
      ) {
        return;
      }
      rightContent.push(child);
    });
  }
  // Get the button (cta-btn) and place it after meaningful content, inside its parent div if possible
  const btnDiv = rightCol.querySelector('.col-xs-12.text-center');
  if (btnDiv && btnDiv.querySelector('.cta-btn')) {
    // Only push the button div if it contains the button
    rightContent.push(btnDiv);
  }

  // Build the table rows
  const row1 = [leftContent, rightContent];
  const cells = [headerRow, row1];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
