/* global WebImporter */
export default function parse(element, { document }) {
  // Extract hero/banner text
  let heroText = '';
  const heroHeadline = element.querySelector('.panel__headline');
  if (heroHeadline) {
    heroText = heroHeadline.textContent.trim();
  }

  // Extract section heading
  let sectionHeading = '';
  const sectionH2 = element.querySelector('.job-listing > h2');
  if (sectionH2) {
    sectionHeading = sectionH2.textContent.trim();
  }

  // Find the job-listing table (print or responsive version)
  let jobTable = element.querySelector('table.show-in-print');
  if (!jobTable) {
    const responsive = element.querySelector('.table-responsive');
    if (responsive) {
      jobTable = responsive.querySelector('table');
    }
  }
  if (!jobTable) return;

  // Compose the block table
  const headerRow = ['Table (striped, tableStriped63)'];
  const tableHeader = [];
  const ths = jobTable.querySelectorAll('thead tr th');
  ths.forEach(th => {
    tableHeader.push(th.textContent.trim());
  });

  // Extract job rows, including ALL text content from the job title cell (including toggler and accordion details)
  const jobRows = [];
  const tbodies = jobTable.querySelectorAll('tbody');
  tbodies.forEach((tbody) => {
    tbody.querySelectorAll('tr').forEach((tr) => {
      const cells = tr.querySelectorAll('td');
      if (cells.length === 3) {
        // Compose job cell with toggler text, arrow icon, and accordion details (if present)
        let jobCellContent = '';
        const toggler = cells[0].querySelector('.accordions__toggler');
        if (toggler) {
          jobCellContent += '\u25BC ';
          jobCellContent += toggler.textContent.replace(/\s+/g, ' ').trim();
        }
        const accordion = cells[0].querySelector('.accordions__element .job-listing__target-inner');
        if (accordion) {
          jobCellContent += '\n' + accordion.textContent.replace(/\s+/g, ' ').trim();
        }
        if (!jobCellContent) {
          jobCellContent = cells[0].textContent.replace(/\s+/g, ' ').trim();
        }
        const deadline = cells[1].textContent.replace(/\s+/g, ' ').trim();
        const cta = cells[2].querySelector('a');
        let ctaBtn = null;
        if (cta) {
          ctaBtn = cta;
        }
        jobRows.push([jobCellContent, deadline, ctaBtn]);
      }
    });
  });

  // Compose all rows: header, table header, job rows
  const cellsArr = [
    headerRow,
    [...tableHeader], // ensure this is a simple array of strings
    ...jobRows
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cellsArr, document);

  // Prepend hero and section heading above the table
  const wrapper = document.createElement('div');
  if (heroText) {
    const heroEl = document.createElement('h1');
    heroEl.textContent = heroText;
    wrapper.appendChild(heroEl);
  }
  if (sectionHeading) {
    const sectionEl = document.createElement('h2');
    sectionEl.textContent = sectionHeading;
    wrapper.appendChild(sectionEl);
  }
  wrapper.appendChild(block);

  // Replace the original element
  element.replaceWith(wrapper);
}
