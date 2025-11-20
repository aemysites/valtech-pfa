/* global WebImporter */
export default function parse(element, { document }) {
  // Only process nav.anchors elements
  if (!element.matches('nav.anchors')) return;

  // Block header row as required
  const headerRow = ['Tabs (tabs71)'];
  const rows = [headerRow];

  // Extract tab labels from anchors
  const tabLinks = Array.from(element.querySelectorAll('ul > li > a'));
  tabLinks.forEach((a) => {
    // Tab label from anchor text
    const label = a.textContent.trim();
    // Tab content: nothing in source html, so leave cell empty
    rows.push([label, '']);
  });

  // Create the table using DOMUtils
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
