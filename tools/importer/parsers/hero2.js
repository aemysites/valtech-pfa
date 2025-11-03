/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero panel
  const panel = element.querySelector('.panel--hero');
  if (!panel) return;

  // Extract image from .panel__image
  const imageWrapper = panel.querySelector('.panel__image');
  let image = null;
  if (imageWrapper) {
    image = imageWrapper.querySelector('img');
  }

  // Extract text content from .panel__body
  const body = panel.querySelector('.panel__body');
  let kicker = null, headline = null;
  if (body) {
    kicker = body.querySelector('.panel__kicker');
    headline = body.querySelector('.panel__headline');
  }

  // Compose content cell for row 3, preserving semantic structure
  const contentCell = document.createElement('div');
  if (kicker) {
    const kickerEl = document.createElement('p');
    kickerEl.textContent = kicker.textContent;
    contentCell.appendChild(kickerEl);
  }
  if (headline) {
    const headlineEl = document.createElement('h1');
    headlineEl.innerHTML = headline.innerHTML;
    contentCell.appendChild(headlineEl);
  }

  // Table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [image ? image : ''];
  const contentRow = [contentCell];

  const cells = [headerRow, imageRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
