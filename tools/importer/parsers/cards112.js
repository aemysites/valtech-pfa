/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards112) block: 2 columns, multiple rows, each card = [video link, text]
  const headerRow = ['Cards (cards112)'];
  const rows = [headerRow];

  // Find all card containers (columns)
  const cardColumns = element.querySelectorAll('.col-xs-12.col-sm-6.col-md-6');

  cardColumns.forEach((col) => {
    // --- Extract embed (iframe) as link ---
    const iframeContainer = col.querySelector('iframe');
    let embedCell;
    if (iframeContainer) {
      const src = iframeContainer.getAttribute('src');
      const videoLink = document.createElement('a');
      videoLink.href = src;
      videoLink.textContent = 'Video';
      embedCell = videoLink;
    } else {
      embedCell = '';
    }

    // --- Extract title and description ---
    const titleEl = col.querySelector('h5');
    let descriptionEl = null;
    const teaserEls = col.querySelectorAll('.teasers__teaser');
    if (titleEl) {
      let foundTitle = false;
      teaserEls.forEach((teaser) => {
        if (teaser === titleEl) {
          foundTitle = true;
        } else if (foundTitle && !descriptionEl && teaser.textContent.trim()) {
          descriptionEl = teaser;
        }
      });
    }
    const textCellContent = [];
    if (titleEl) {
      textCellContent.push(titleEl);
    }
    if (descriptionEl) {
      textCellContent.push(descriptionEl);
    }
    const textCell = textCellContent.length ? textCellContent : [''];

    // Add row: [video link, text]
    rows.push([embedCell, textCell]);
  });

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
