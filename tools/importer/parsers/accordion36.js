/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: extract only top-level accordion items (title + content)
  const headerRow = ['Accordion (accordion36)'];
  const rows = [headerRow];

  // Find the main heading (h2) and preserve it
  const heading = element.querySelector('h2');

  // Only select direct children togglers and their immediate content siblings
  let child = element.firstElementChild;
  while (child) {
    if (
      child.classList &&
      child.classList.contains('accordions__toggler') &&
      child.parentElement === element
    ) {
      // Find the next sibling that is an accordion content element
      let contentEl = child.nextElementSibling;
      while (
        contentEl &&
        (!contentEl.classList || !contentEl.classList.contains('accordions__element') || contentEl.parentElement !== element)
      ) {
        contentEl = contentEl.nextElementSibling;
      }
      if (contentEl) {
        // Instead of extracting only text, include all content nodes (children) for full flexibility
        // This ensures all text, tables, links, and nested elements are included
        const contentNodes = Array.from(contentEl.childNodes).filter(node => {
          // Filter out empty text nodes and whitespace-only nodes
          return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
        });
        // If there are no child nodes, fallback to textContent
        let cellContent;
        if (contentNodes.length > 0) {
          cellContent = contentNodes;
        } else {
          cellContent = contentEl.textContent.trim();
        }
        rows.push([child.textContent.trim(), cellContent]);
      }
    }
    child = child.nextElementSibling;
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // If heading exists, insert it before the block
  if (heading) {
    heading.remove();
    element.parentNode.insertBefore(heading, element);
    heading.parentNode.insertBefore(block, heading.nextSibling);
    element.remove();
  } else {
    element.replaceWith(block);
  }
}
