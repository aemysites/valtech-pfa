/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero118) block: 1 column, 3 rows
  const headerRow = ['Hero (hero118)'];

  // No image found in source html, so image row is empty
  const imageRow = [''];

  // Find the main content column (col-sm-10)
  const contentCol = element.querySelector('.col-sm-10');

  // Collect all relevant content: heading, paragraph, CTA
  const contentCell = [];

  // Heading
  const heading = contentCol.querySelector('h2');
  if (heading) {
    contentCell.push(heading.cloneNode(true));
  }

  // Paragraph(s)
  const paragraphs = contentCol.querySelectorAll('p');
  paragraphs.forEach((p) => {
    contentCell.push(p.cloneNode(true));
  });

  // CTA button
  const cta = contentCol.querySelector('a.cta-btn');
  if (cta) {
    contentCell.push(cta.cloneNode(true));
  }

  // Table rows
  const cells = [
    headerRow,
    imageRow,
    [contentCell]
  ];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
