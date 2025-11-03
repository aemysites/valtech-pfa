/* global WebImporter */
export default function parse(element, { document }) {
  // Find heading and description paragraphs (before the accordion toggler)
  const heading = element.querySelector('h2');
  const allPs = Array.from(element.querySelectorAll('p'));
  const toggler = element.querySelector('.accordions__toggler');
  const togglerIdx = allPs.findIndex(p => p === toggler);
  // All paragraphs before the toggler are description
  const descriptionPs = togglerIdx > 0 ? allPs.slice(0, togglerIdx) : [];

  // Compose a fragment for heading + description
  const introFragment = document.createElement('div');
  if (heading) introFragment.appendChild(heading.cloneNode(true));
  descriptionPs.forEach(p => introFragment.appendChild(p.cloneNode(true)));

  // Find the accordion content element (the next .accordions__element after toggler)
  const accordionContent = element.querySelector('.accordions__element');
  if (!toggler || !accordionContent) return;

  // Build the block table
  const headerRow = ['Accordion (accordion3)'];
  const rows = [headerRow];

  // First row: toggler as title, heading+description+accordion content as content
  const contentFragment = document.createElement('div');
  if (introFragment.childNodes.length) contentFragment.appendChild(introFragment);
  contentFragment.appendChild(accordionContent.cloneNode(true));

  rows.push([
    toggler.cloneNode(true),
    contentFragment
  ]);

  // Replace original element with block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
