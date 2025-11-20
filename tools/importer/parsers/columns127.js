/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // --- LEFT COLUMN ---
  const left = columns[0];
  const teaser = left.querySelector('.teasers__teaser');
  const leftContent = [];

  // Heading (skip empty h3 and whitespace-only h3)
  const heading = Array.from(teaser.querySelectorAll('h3'))
    .map(h => h.textContent.trim())
    .find(text => text.length > 0);
  if (heading) {
    const h3 = document.createElement('h3');
    h3.textContent = heading;
    leftContent.push(h3);
  }

  // List
  const list = teaser.querySelector('ul');
  if (list) leftContent.push(list);

  // Accordion toggler (button-like)
  const toggler = teaser.querySelector('.accordions__toggler');
  if (toggler) leftContent.push(toggler);

  // Accordion content (must be included for full text content)
  const accordionContent = teaser.querySelector('.accordions__element');
  if (accordionContent) leftContent.push(accordionContent);

  // --- RIGHT COLUMN ---
  const right = columns[1];
  const rightTeaser = right.querySelector('.teasers__teaser');
  const rightContent = [];
  if (rightTeaser) {
    const img = rightTeaser.querySelector('img');
    if (img) rightContent.push(img);
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns127)'];
  const tableRows = [headerRow, [leftContent, rightContent]];

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(table);
}
