/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row (block name)
  const headerRow = ['Accordion (accordion37)'];
  const rows = [headerRow];

  // 2. Gather all content before the first accordion toggler (heading + intro paragraphs)
  const allChildren = Array.from(element.children);
  let firstTogglerIdx = allChildren.findIndex(child => child.classList && child.classList.contains('accordions__toggler'));
  let introContent = [];
  if (firstTogglerIdx > 0) {
    for (let i = 0; i < firstTogglerIdx; i++) {
      introContent.push(allChildren[i]);
    }
    if (introContent.length) {
      // Put ALL intro content (heading + paragraphs) into a single cell as a row before accordions
      // Use the heading text as the label for the row
      let headingText = '';
      for (let node of introContent) {
        if (node.tagName && node.tagName.match(/^H/i)) {
          headingText = node.textContent.trim();
          break;
        }
      }
      if (!headingText) headingText = 'Intro';
      rows.push([headingText, introContent]);
    }
  }

  // 3. Find all accordion toggler/content pairs
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach((toggler) => {
    // Find the content element: next sibling with class .accordions__element
    let content = toggler.nextElementSibling;
    while (content && !content.classList.contains('accordions__element')) {
      content = content.nextElementSibling;
    }
    if (!content || !content.classList.contains('accordions__element')) return;
    rows.push([toggler, content]);
  });

  // 4. Find CTA button (should be included in a separate row after all accordions)
  const cta = element.querySelector('a.cta-btn');
  if (cta) {
    rows.push([cta.textContent.trim(), cta]);
  }

  // Replace the element with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
