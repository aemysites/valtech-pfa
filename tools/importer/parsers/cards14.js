/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract card content from a panel element
  function extractCard(panel, color) {
    let img = panel.querySelector('.panel__image img');
    let body = panel.querySelector('.panel__body');
    if (!img && panel.parentElement) {
      img = panel.parentElement.querySelector('.panel__image img');
    }
    let imageCell = '';
    if (img) {
      imageCell = img;
    } else if (color) {
      // Use a color swatch for cards with color background but no image
      const swatch = document.createElement('div');
      swatch.style.width = '48px';
      swatch.style.height = '48px';
      swatch.style.background = color;
      swatch.style.borderRadius = '8px';
      swatch.style.display = 'inline-block';
      swatch.title = 'Color card';
      imageCell = swatch;
    }
    return [imageCell, body];
  }

  const rows = [['Cards (cards14)']];

  // Hero card (image)
  const heroPanel = element.querySelector('.narrow-hero__panel--desktop');
  if (heroPanel) {
    rows.push(extractCard(heroPanel));
  }

  // Standard cards (with images)
  const cardPanels = element.querySelectorAll('.col-sm-6.col-md-4 > a.panel.panel--image');
  cardPanels.forEach(panel => {
    rows.push(extractCard(panel));
  });

  // News card (panel--news), gray color block
  const newsPanel = element.querySelector('.panel--news');
  if (newsPanel) {
    rows.push(extractCard(newsPanel, '#f5f5f5'));
  }

  // Links card (panel--shortcuts-secondary), dark color block
  const linksPanel = element.querySelector('.panel--shortcuts-secondary');
  if (linksPanel) {
    rows.push(extractCard(linksPanel, '#222'));
  }

  // Green card (panel--green), teal color block
  const greenPanel = element.querySelector('.panel--green');
  if (greenPanel) {
    rows.push(extractCard(greenPanel, '#00787a'));
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
