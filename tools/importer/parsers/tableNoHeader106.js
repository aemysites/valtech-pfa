/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Table (no header, tableNoHeader106)'];

  // Extract main heading and intro
  const heading = element.querySelector('h2');
  const intro = heading ? heading.nextElementSibling : null;

  // Extract accordions
  const accordionTitles = Array.from(element.querySelectorAll('.accordions__toggler'));
  const accordionContents = Array.from(element.querySelectorAll('.accordions__element'));

  // Extract subheading and description
  const subheading = element.querySelector('h5');
  const subDesc = subheading ? subheading.nextElementSibling : null;

  // Extract legend (color-coded labels)
  const legend = Array.from(element.querySelectorAll('p')).find(p => p.textContent.match(/Familien|Børn|Ægtefælle|Fri testationsret/));

  // Extract footnote
  const footnote = Array.from(element.querySelectorAll('span')).find(span => span.textContent.includes('samlevertestamente'));
  const footnoteParent = footnote ? footnote.parentElement : null;

  // Compose the table grid: 2 rows x 5 columns (pie chart cells)
  // Since the pie charts are a single image, we represent the grid as 2 rows x 5 columns, each cell containing a placeholder for the pie chart
  // We will use the image and visually split it for each cell
  // Column labels
  const columnLabels = [
    'Ugift, ingen børn',
    'Ugift, med 3 børn',
    'Gift, ingen børn',
    'Gift, med børn',
    'Gift, med 3 børn'
  ];
  // Row labels
  const rowLabels = [
    'Uden testamente',
    'Med testamente'
  ];
  // Find the grid image (pie charts)
  const gridImg = element.querySelector('img');

  // Compose rows
  const rows = [headerRow];
  if (heading) rows.push([heading]);
  if (intro && intro.tagName === 'P') rows.push([intro]);
  accordionTitles.forEach((titleEl, idx) => {
    const contentEl = accordionContents[idx];
    rows.push([[titleEl, contentEl]]);
  });
  if (subheading) rows.push([subheading]);
  if (subDesc && subDesc.tagName === 'P') rows.push([subDesc]);

  // Add the grid/table: first row is column labels
  rows.push(['', ...columnLabels]);
  // Add the two grid rows, each with row label and pie chart image for each column
  if (gridImg) {
    rows.push([
      rowLabels[0],
      ...Array(5).fill(gridImg.cloneNode(true))
    ]);
    rows.push([
      rowLabels[1],
      ...Array(5).fill(gridImg.cloneNode(true))
    ]);
  }

  // Add legend
  if (legend) rows.push([legend]);
  // Add footnote
  if (footnoteParent) rows.push([footnoteParent]);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
