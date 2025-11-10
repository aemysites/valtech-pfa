/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Columns (columns29)'];

  // Find the main row with two columns
  const layoutRow = element.querySelector('.col-sm-12 > .row');
  if (!layoutRow) return;

  // Find left and right columns
  const leftCol = layoutRow.querySelector('.col-sm-8');
  const rightCol = layoutRow.querySelector('.col-sm-4');

  // Defensive: If columns are missing, fallback to children
  let leftContent, rightContent;

  if (leftCol) {
    // Grab all children of leftCol (heading, paragraphs, button)
    leftContent = Array.from(leftCol.children);
  } else {
    // Fallback: use first child
    leftContent = [layoutRow.children[0]];
  }

  if (rightCol) {
    // Grab all children of rightCol (should be image)
    rightContent = Array.from(rightCol.children);
  } else {
    // Fallback: use second child
    rightContent = [layoutRow.children[1]];
  }

  // Remove empty paragraphs from leftContent
  leftContent = leftContent.filter(el => {
    if (el.tagName === 'P') {
      return el.textContent.trim().length > 0 && el.innerHTML.trim() !== '&nbsp;';
    }
    return true;
  });

  // Remove empty nodes from rightContent
  rightContent = rightContent.filter(el => {
    if (el.tagName === 'IMG') return true;
    if (el.textContent.trim().length > 0) return true;
    return false;
  });

  // Compose the content row (two columns)
  const contentRow = [leftContent, rightContent];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
