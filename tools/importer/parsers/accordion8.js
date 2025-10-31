/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all main accordion sections and their nested Q&A
  function extractAccordionItems(teaser) {
    const items = [];
    // Find all top-level toggler paragraphs (accordion headers)
    const togglers = Array.from(teaser.children).filter(child => child.matches('p.accordions__toggler'));
    togglers.forEach((toggler) => {
      // The content is the next sibling .accordions__element
      let content = toggler.nextElementSibling;
      if (content && content.classList.contains('accordions__element')) {
        // Collect all nested toggler/content pairs inside this content
        const nestedRows = [];
        let node = content.firstElementChild;
        while (node) {
          if (node.matches('p.accordions__toggler')) {
            // Find its content
            let nestedContent = node.nextElementSibling;
            if (nestedContent && nestedContent.classList.contains('accordions__element')) {
              // Gather all non-empty children
              const nestedContentNodes = Array.from(nestedContent.childNodes).filter(n => n.nodeType === 1 && n.textContent.trim());
              nestedRows.push([
                node,
                nestedContentNodes.length ? nestedContentNodes : nestedContent
              ]);
              node = nestedContent.nextElementSibling;
              continue;
            }
          }
          node = node.nextElementSibling;
        }
        // If there are nested rows, use them as the content cell
        // Otherwise, use all non-empty children of content
        if (nestedRows.length) {
          items.push([
            toggler,
            nestedRows.map(row => {
              // Wrap each nested Q&A in a div for clarity
              const wrapper = document.createElement('div');
              wrapper.appendChild(row[0].cloneNode(true));
              if (Array.isArray(row[1])) {
                row[1].forEach(n => wrapper.appendChild(n.cloneNode(true)));
              } else {
                wrapper.appendChild(row[1].cloneNode(true));
              }
              return wrapper;
            })
          ]);
        } else {
          // Gather all non-empty children
          const contentNodes = Array.from(content.childNodes).filter(n => n.nodeType === 1 && n.textContent.trim());
          items.push([
            toggler,
            contentNodes.length ? contentNodes : content
          ]);
        }
      }
    });
    return items;
  }

  // Find all teasers__teaser blocks in both columns
  const teasers = Array.from(element.querySelectorAll('.teasers__teaser'));
  let rows = [['Accordion (accordion8)']];
  teasers.forEach(teaser => {
    rows = rows.concat(extractAccordionItems(teaser));
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
