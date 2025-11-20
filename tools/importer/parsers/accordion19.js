/* global WebImporter */
export default function parse(element, { document }) {
  // Find the visible heading (not the hidden one)
  let heading = null;
  const h2s = Array.from(element.querySelectorAll('h2'));
  heading = h2s.find(h => h.style.display !== 'none');
  if (!heading && h2s.length) heading = h2s[0];

  // Find the accordion toggler (title)
  const toggler = element.querySelector('.accordions__toggler');
  // Find the accordion content
  const content = element.querySelector('.accordions__element, .accordion__element');
  // Find the CTA button
  const cta = element.querySelector('.cta-btn');

  // Build rows for the accordion table
  const headerRow = ['Accordion (accordion19)'];
  const rows = [headerRow];
  if (toggler && content) {
    // Clone content and append CTA if present
    const contentClone = content.cloneNode(true);
    if (cta) {
      contentClone.appendChild(cta.cloneNode(true));
    }
    rows.push([
      toggler,
      contentClone
    ]);
  }

  // Create the accordion table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with heading + table
  if (heading) {
    heading.remove();
    element.replaceWith(heading);
    heading.after(table);
  } else {
    element.replaceWith(table);
  }
}
