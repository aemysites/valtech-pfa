/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container-fluid
  const container = element.querySelector('.container-fluid');
  if (!container) return;

  // Find all direct child .row elements in container
  const rows = Array.from(container.querySelectorAll(':scope > .row'));
  if (rows.length < 2) return;

  // --- First row: Heading, description, illustration ---
  const topRow = rows[0];
  const topCols = Array.from(topRow.children); // .col-sm-10 and .col-sm-2

  // Left column: heading + description
  const leftCol = topCols[0];
  const heading = leftCol.querySelector('h2');
  const descriptionBlock = leftCol.querySelector('.teasers__teaser');

  // Right column: illustration image
  const rightCol = topCols[1];
  const illustrationBlock = rightCol.querySelector('.teasers__teaser');
  const illustrationImg = illustrationBlock && illustrationBlock.querySelector('img');

  // --- Second row: Portrait image, blockquote ---
  const bottomRow = rows[1];
  const bottomCols = Array.from(bottomRow.children); // .col-sm-4 and .col-sm-8

  // Left: portrait image
  const portraitCol = bottomCols[0];
  const portraitBlock = portraitCol.querySelector('.teasers__teaser');
  const portraitImg = portraitBlock && portraitBlock.querySelector('img');

  // Right: blockquote testimonial
  const testimonialCol = bottomCols[1];
  const testimonialBlock = testimonialCol.querySelector('.teasers__teaser');
  const blockquote = testimonialBlock && testimonialBlock.querySelector('blockquote');

  // --- Build table rows ---
  const headerRow = ['Columns (columns129)'];

  // First content row: heading/description | illustration
  const firstContentCell = document.createElement('div');
  if (heading) firstContentCell.appendChild(heading.cloneNode(true));
  if (descriptionBlock) {
    Array.from(descriptionBlock.children).forEach((child) => {
      firstContentCell.appendChild(child.cloneNode(true));
    });
  }
  const firstRow = [
    firstContentCell,
    illustrationImg ? illustrationImg.cloneNode(true) : ''
  ];

  // Second content row: portrait image | testimonial
  const secondRow = [
    portraitImg ? portraitImg.cloneNode(true) : '',
    blockquote ? blockquote.cloneNode(true) : ''
  ];

  // Create table
  const cells = [
    headerRow,
    firstRow,
    secondRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
