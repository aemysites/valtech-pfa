/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as specified
  // Must be a single cell, not two columns
  const headerRow = ['Accordion (accordion28)'];

  // Extract heading and paragraph (intro content)
  const heading = element.querySelector('h2, h1');
  const introParagraph = element.querySelector('h2 ~ p, h1 ~ p');
  let introContent = [];
  if (heading) introContent.push(heading.cloneNode(true));
  if (introParagraph) introContent.push(introParagraph.cloneNode(true));

  // Find accordion toggler and content
  const toggler = element.querySelector('.accordions__toggler');
  const accordionContent = element.querySelector('.accordions__element, .accordion__element');

  // Compose table data: header row, then each accordion item as [title, content]
  const tableData = [headerRow];
  if (toggler && accordionContent) {
    tableData.push([
      toggler.textContent,
      accordionContent
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // If intro content exists, insert it before the block table
  if (introContent.length) {
    const introDiv = document.createElement('div');
    introContent.forEach(el => introDiv.appendChild(el));
    element.replaceWith(introDiv);
    introDiv.insertAdjacentElement('afterend', block);
  } else {
    element.replaceWith(block);
  }
}
