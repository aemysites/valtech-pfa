/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content container (usually col-sm-12)
  const mainCol = element.querySelector('.col-sm-12') || element;

  // Find heading
  const heading = mainCol.querySelector('h2');

  // Find all paragraphs
  const allPs = Array.from(mainCol.querySelectorAll('p'));
  // Find all accordion toggler paragraphs (headers)
  const togglers = allPs.filter(p => p.classList.contains('accordions__toggler'));
  // Find all accordion content elements
  const accordionContents = Array.from(mainCol.querySelectorAll('.accordions__element'));

  // Find intro paragraphs (before first toggler)
  const introParas = [];
  for (const p of allPs) {
    if (p.classList.contains('accordions__toggler')) break;
    if (p.textContent.trim() && p.innerHTML.trim() !== '&nbsp;') {
      introParas.push(p);
    }
  }

  // Find outro paragraphs (after last accordion)
  const outroParas = [];
  let afterAccordions = false;
  for (const p of allPs) {
    if (afterAccordions) {
      if (p.textContent.trim() && p.innerHTML.trim() !== '&nbsp;') {
        outroParas.push(p);
      }
    }
    if (accordionContents.length && p === accordionContents[accordionContents.length - 1].nextElementSibling) {
      afterAccordions = true;
    }
  }
  // Defensive: If no outro found, try last non-empty paragraph
  if (!outroParas.length && allPs.length) {
    const lastP = allPs[allPs.length - 1];
    if (lastP.textContent.trim() && lastP.innerHTML.trim() !== '&nbsp;') {
      outroParas.push(lastP);
    }
  }

  // Build table rows: header row, then each accordion item as [title, content]
  const rows = [];
  rows.push(['Accordion (accordion9)']);

  for (let i = 0; i < togglers.length && i < accordionContents.length; i++) {
    rows.push([togglers[i], accordionContents[i]]);
  }

  // Create fragment to hold everything
  const fragment = document.createDocumentFragment();

  // Add heading and intro paragraphs (if present)
  if (heading) fragment.appendChild(heading);
  if (introParas.length) {
    introParas.forEach(p => fragment.appendChild(p));
  }

  // Add the accordion table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  fragment.appendChild(table);

  // Add outro paragraphs (if present)
  if (outroParas.length) {
    outroParas.forEach(p => fragment.appendChild(p));
  }

  // Replace original element
  element.replaceWith(fragment);
}
