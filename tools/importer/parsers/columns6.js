/* global WebImporter */
export default function parse(element, { document }) {
  // Columns (columns6) block header
  const headerRow = ['Columns (columns6)'];

  // Find the main .row elements inside the footer
  const mainRows = element.querySelectorAll('.row');
  if (!mainRows || mainRows.length === 0) return;

  // The first .row contains three columns (.col-md-4)
  const linkCols = mainRows[0].querySelectorAll('.col-md-4');
  // The address/social column is .col-md-3 (outside the first .row)
  const infoCol = element.querySelector('.col-md-3');
  if (linkCols.length !== 3 || !infoCol) return;

  // Column 1: PFA
  const col1 = document.createElement('div');
  col1.appendChild(linkCols[0].querySelector('.footer__heading'));
  col1.appendChild(linkCols[0].querySelector('.footer__wrapper'));

  // Column 2: Genveje
  const col2 = document.createElement('div');
  col2.appendChild(linkCols[1].querySelector('.footer__heading'));
  col2.appendChild(linkCols[1].querySelector('.footer__wrapper'));

  // Column 3: Øvrige
  const col3 = document.createElement('div');
  col3.appendChild(linkCols[2].querySelector('.footer__heading'));
  col3.appendChild(linkCols[2].querySelector('.footer__wrapper'));

  // Column 4: Company info and social
  const col4 = document.createElement('div');
  // Heading
  const heading = infoCol.querySelector('.footer__heading');
  if (heading) col4.appendChild(heading);
  // Address
  const address = infoCol.querySelector('address');
  if (address) col4.appendChild(address);
  // Social links
  const socials = infoCol.querySelector('.share--footer');
  if (socials) col4.appendChild(socials);

  // Build the table rows
  const cells = [
    headerRow,
    [col1, col2, col3, col4]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
