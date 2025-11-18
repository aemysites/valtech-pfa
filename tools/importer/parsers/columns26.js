/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Columns (columns26)'];
  const cells = [headerRow];

  // Find both filter sections
  const cardContents = Array.from(element.querySelectorAll('mat-card-content'));

  // Helper: create a cell with left label, slider, right label (risk filter)
  function getRiskRow(riskSection) {
    const row = riskSection.querySelector('.cal-row');
    if (!row) return null;
    const leftCol = row.querySelector('.cal-column--lg-35');
    const rightCol = row.querySelector('.cal-column--lg-65');
    if (!leftCol || !rightCol) return null;
    // Heading (left)
    const heading = leftCol.querySelector('h4');
    // Left value/label
    const labelContainers = rightCol.querySelectorAll('.share-label-container');
    let leftValue = '';
    let rightValue = '';
    if (labelContainers.length > 0) {
      leftValue = labelContainers[0].cloneNode(true);
    }
    if (labelContainers.length > 1) {
      rightValue = labelContainers[1].cloneNode(true);
    }
    // Slider (center)
    const slider = rightCol.querySelector('ng5-slider');
    // Compose slider cell: left label, slider, right label
    const sliderCell = document.createElement('div');
    if (leftValue) sliderCell.appendChild(leftValue);
    if (slider) sliderCell.appendChild(slider.cloneNode(true));
    if (rightValue) sliderCell.appendChild(rightValue);
    return [heading ? heading.textContent.trim() : '', sliderCell];
  }

  // Helper: create a cell with slider and right label (climate filter)
  function getClimateRow(climateSection) {
    const row = climateSection.querySelector('.cal-row');
    if (!row) return null;
    const leftCol = row.querySelector('.cal-column--lg-35');
    const rightCol = row.querySelector('.cal-column--lg-65');
    if (!leftCol || !rightCol) return null;
    // Heading (left)
    const heading = leftCol.querySelector('h4');
    // Slider (center)
    const slider = rightCol.querySelector('ng5-slider');
    // Right value/label
    const rightValue = rightCol.querySelector('h4.cal-filter__value');
    // Compose slider cell: slider, right label
    const sliderCell = document.createElement('div');
    if (slider) sliderCell.appendChild(slider.cloneNode(true));
    if (rightValue) sliderCell.appendChild(document.createTextNode(rightValue.textContent.trim()));
    return [heading ? heading.textContent.trim() : '', sliderCell];
  }

  // Always use 2 columns for all rows after header
  const riskSection = cardContents.find(c => c.classList.contains('risk-filter'));
  if (riskSection) {
    const riskRow = getRiskRow(riskSection);
    if (riskRow) cells.push(riskRow);
  }
  const climateSection = cardContents.find(c => c.classList.contains('climate-filter'));
  if (climateSection) {
    const climateRow = getClimateRow(climateSection);
    if (climateRow) cells.push(climateRow);
  }

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
