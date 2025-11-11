/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns26)'];
  const rows = [headerRow];

  const sections = element.querySelectorAll('.mat-card-content');

  // First section: risk filter (should have three columns)
  if (sections[0]) {
    const row = sections[0].querySelector('.cal-row');
    if (row) {
      const columns = row.querySelectorAll(':scope > .cal-column');
      if (columns.length >= 2) {
        // 1. Left label
        const leftLabel = columns[0].querySelector('h4');
        // 2. Left value + label
        const leftValueContainer = columns[1].querySelectorAll('.share-label-container')[0];
        // 3. Slider (ng5-slider)
        const slider = columns[1].querySelector('ng5-slider');
        // 4. Right value + label
        const rightValueContainer = columns[1].querySelectorAll('.share-label-container')[1];

        // Compose the three columns:
        // Column 1: left label
        // Column 2: left value + label
        // Column 3: slider + right value + label
        const col1 = leftLabel;
        const col2 = leftValueContainer;
        // For column 3, group slider and right value container together
        const col3 = [slider, rightValueContainer];
        rows.push([col1, col2, col3]);
      }
    }
  }

  // Second section: climate filter (should have three columns)
  if (sections[1]) {
    const row = sections[1].querySelector('.cal-row');
    if (row) {
      const columns = row.querySelectorAll(':scope > .cal-column');
      if (columns.length >= 2) {
        // 1. Left label
        const leftLabel = columns[0].querySelector('h4');
        // 2. Slider (ng5-slider)
        const slider = columns[1].querySelector('ng5-slider');
        // 3. Value (h4 with percentage)
        const value = columns[1].querySelector('h4.cal-filter__value');
        rows.push([leftLabel, slider, value]);
      }
    }
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
