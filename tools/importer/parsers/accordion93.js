/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion93)'];
  const rows = [headerRow];

  // Find the main content container
  const mainContainer = element.querySelector('.container-fluid') || element;

  // Get heading and description (visible content)
  const heading = mainContainer.querySelector('h3');
  const description = mainContainer.querySelector('h3 ~ p');

  // Find all accordion toggler elements and their corresponding content panels
  const togglers = Array.from(mainContainer.querySelectorAll('.accordions__toggler'));

  togglers.forEach((toggler, idx) => {
    // Find the next sibling that is an accordion element
    let content = toggler.nextElementSibling;
    while (content && !content.classList.contains('accordions__element')) {
      content = content.nextElementSibling;
    }
    if (content) {
      // For the first accordion, prepend heading and description to the content cell
      let contentCell;
      if (idx === 0) {
        // Create a wrapper div for heading, description, and content
        const wrapper = document.createElement('div');
        if (heading) wrapper.appendChild(heading.cloneNode(true));
        if (description) wrapper.appendChild(description.cloneNode(true));
        wrapper.appendChild(content.cloneNode(true));
        contentCell = wrapper;
      } else {
        contentCell = content;
      }
      rows.push([
        toggler.textContent.trim(), // Use toggler text for title cell
        contentCell
      ]);
    }
  });

  // Replace the original element with the new block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
