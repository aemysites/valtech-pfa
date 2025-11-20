/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns85)'];

  // Find the main row that contains the columns
  let columnsRow = element.querySelector('.row.teasers > .col-sm-12 > .row');
  if (!columnsRow) {
    columnsRow = element.querySelector('.row.teasers > .col-sm-12');
  }

  // Find column containers
  let colDivs = [];
  if (columnsRow) {
    colDivs = Array.from(columnsRow.querySelectorAll('.col-xs-12.col-sm-6'));
    if (colDivs.length === 0) {
      colDivs = Array.from(columnsRow.children).filter((child) =>
        child.classList.contains('col-xs-12') || child.classList.contains('col-sm-6')
      );
    }
  }
  if (colDivs.length === 0) {
    colDivs = Array.from(element.querySelectorAll('.col-xs-12.col-sm-6'));
  }

  // If columns not found, fallback to teasers__teaser blocks
  if (colDivs.length === 0) {
    colDivs = Array.from(element.querySelectorAll('.teasers__teaser'));
  }

  // Compose content for each column, ensuring all text is included
  const contentRow = colDivs.map((col) => {
    // If .teasers__teaser exists, use its children
    const teaser = col.classList.contains('teasers__teaser') ? col : col.querySelector('.teasers__teaser');
    const source = teaser || col;
    let cellContent = [];

    // Collect heading(s)
    const h2 = source.querySelector('h2');
    if (h2) cellContent.push(h2.cloneNode(true));
    const h3 = source.querySelector('h3');
    if (h3) cellContent.push(h3.cloneNode(true));

    // Collect all non-empty paragraphs
    Array.from(source.querySelectorAll('p')).forEach(p => {
      if (p.textContent.trim()) cellContent.push(p.cloneNode(true));
    });

    // Collect iframe (video)
    const iframe = source.querySelector('iframe');
    if (iframe) {
      // Replace iframe with a link to the video
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = iframe.title ? iframe.title : 'Se video';
      cellContent.push(link);
    }

    // If no content found, fallback to all children with text
    if (cellContent.length === 0) {
      Array.from(source.children).forEach(child => {
        if (child.textContent.trim()) {
          cellContent.push(child.cloneNode(true));
        }
      });
    }

    // If still empty, fallback to textContent
    if (cellContent.length === 0 && source.textContent.trim()) {
      cellContent.push(document.createTextNode(source.textContent.trim()));
    }

    // If only one element, don't wrap in array
    return cellContent.length === 1 ? cellContent[0] : cellContent;
  });

  // Build table rows
  const tableRows = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
