/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // 1. Get tab labels
  const tabNav = element.querySelector('.panel__tab-toggler');
  const tabLabels = tabNav ? Array.from(tabNav.querySelectorAll('li > a')) : [];

  // 2. Get tab panels
  const tabContent = element.querySelector('.panel__tab-content');
  const tabPanes = tabContent ? Array.from(tabContent.querySelectorAll('.tab-pane')) : [];

  // Defensive: Ensure tabLabels and tabPanes match
  const numTabs = Math.min(tabLabels.length, tabPanes.length);

  // 3. Build rows: first row is header
  const rows = [ ['Tabs (tabs73)'] ];

  for (let i = 0; i < numTabs; i++) {
    // Tab label
    const label = tabLabels[i];
    // Tab pane
    const pane = tabPanes[i];

    // For tab content, we want to preserve the two-column layout
    // Get the row inside the pane
    const rowDiv = pane.querySelector('.row');
    let leftCol = null;
    let rightCol = null;
    if (rowDiv) {
      // Find left and right columns by class
      const cols = getDirectChildren(rowDiv, 'div');
      // Left: col-xs-12 col-sm-8
      leftCol = cols.find(col => col.className.includes('col-sm-8'));
      // Right: col-xs-12 col-sm-4
      rightCol = cols.find(col => col.className.includes('col-sm-4'));
    }
    // Compose tab content cell
    let tabContentCell = [];
    if (leftCol) tabContentCell.push(leftCol);
    if (rightCol) tabContentCell.push(rightCol);
    // If neither found, fallback to pane itself
    if (tabContentCell.length === 0) tabContentCell = [pane];

    // Each row: [tab label text, tab content]
    rows.push([
      label.textContent.trim(),
      tabContentCell
    ]);
  }

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
