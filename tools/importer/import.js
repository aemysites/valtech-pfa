/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import hero2Parser from './parsers/hero2.js';
import columns3Parser from './parsers/columns3.js';
import columns6Parser from './parsers/columns6.js';
import columns7Parser from './parsers/columns7.js';
import columns4Parser from './parsers/columns4.js';
import accordion8Parser from './parsers/accordion8.js';
import accordion10Parser from './parsers/accordion10.js';
import accordion9Parser from './parsers/accordion9.js';
import cards11Parser from './parsers/cards11.js';
import accordion12Parser from './parsers/accordion12.js';
import columns14Parser from './parsers/columns14.js';
import accordion13Parser from './parsers/accordion13.js';
import columns16Parser from './parsers/columns16.js';
import columns15Parser from './parsers/columns15.js';
import columns18Parser from './parsers/columns18.js';
import columns17Parser from './parsers/columns17.js';
import cards1Parser from './parsers/cards1.js';
import accordion19Parser from './parsers/accordion19.js';
import hero22Parser from './parsers/hero22.js';
import cards21Parser from './parsers/cards21.js';
import columns24Parser from './parsers/columns24.js';
import columns23Parser from './parsers/columns23.js';
import columns26Parser from './parsers/columns26.js';
import accordion20Parser from './parsers/accordion20.js';
import accordion28Parser from './parsers/accordion28.js';
import columns27Parser from './parsers/columns27.js';
import columns29Parser from './parsers/columns29.js';
import accordion31Parser from './parsers/accordion31.js';
import cards25Parser from './parsers/cards25.js';
import columns30Parser from './parsers/columns30.js';
import accordion32Parser from './parsers/accordion32.js';
import accordion35Parser from './parsers/accordion35.js';
import accordion33Parser from './parsers/accordion33.js';
import columns38Parser from './parsers/columns38.js';
import accordion36Parser from './parsers/accordion36.js';
import cards34Parser from './parsers/cards34.js';
import accordion39Parser from './parsers/accordion39.js';
import columns41Parser from './parsers/columns41.js';
import columns42Parser from './parsers/columns42.js';
import columns43Parser from './parsers/columns43.js';
import hero40Parser from './parsers/hero40.js';
import columns44Parser from './parsers/columns44.js';
import cards45Parser from './parsers/cards45.js';
import accordion46Parser from './parsers/accordion46.js';
import columns48Parser from './parsers/columns48.js';
import accordion47Parser from './parsers/accordion47.js';
import columns52Parser from './parsers/columns52.js';
import hero51Parser from './parsers/hero51.js';
import accordion54Parser from './parsers/accordion54.js';
import columns53Parser from './parsers/columns53.js';
import hero50Parser from './parsers/hero50.js';
import accordion55Parser from './parsers/accordion55.js';
import accordion58Parser from './parsers/accordion58.js';
import accordion57Parser from './parsers/accordion57.js';
import tableStripedBordered56Parser from './parsers/tableStripedBordered56.js';
import columns60Parser from './parsers/columns60.js';
import columns61Parser from './parsers/columns61.js';
import columns62Parser from './parsers/columns62.js';
import columns59Parser from './parsers/columns59.js';
import search64Parser from './parsers/search64.js';
import columns65Parser from './parsers/columns65.js';
import tableStriped63Parser from './parsers/tableStriped63.js';
import columns67Parser from './parsers/columns67.js';
import hero68Parser from './parsers/hero68.js';
import cardsNoImages69Parser from './parsers/cardsNoImages69.js';
import tableStriped66Parser from './parsers/tableStriped66.js';
import tabs71Parser from './parsers/tabs71.js';
import columns72Parser from './parsers/columns72.js';
import tabs73Parser from './parsers/tabs73.js';
import tableStriped70Parser from './parsers/tableStriped70.js';
import columns75Parser from './parsers/columns75.js';
import cards74Parser from './parsers/cards74.js';
import columns77Parser from './parsers/columns77.js';
import columns80Parser from './parsers/columns80.js';
import hero81Parser from './parsers/hero81.js';
import tableBordered78Parser from './parsers/tableBordered78.js';
import cards79Parser from './parsers/cards79.js';
import accordion83Parser from './parsers/accordion83.js';
import cards84Parser from './parsers/cards84.js';
import columns86Parser from './parsers/columns86.js';
import columns82Parser from './parsers/columns82.js';
import columns88Parser from './parsers/columns88.js';
import columns89Parser from './parsers/columns89.js';
import columns87Parser from './parsers/columns87.js';
import columns85Parser from './parsers/columns85.js';
import accordion90Parser from './parsers/accordion90.js';
import cards92Parser from './parsers/cards92.js';
import accordion93Parser from './parsers/accordion93.js';
import columns94Parser from './parsers/columns94.js';
import columns95Parser from './parsers/columns95.js';
import columns97Parser from './parsers/columns97.js';
import columns91Parser from './parsers/columns91.js';
import columns98Parser from './parsers/columns98.js';
import columns96Parser from './parsers/columns96.js';
import accordion99Parser from './parsers/accordion99.js';
import columns102Parser from './parsers/columns102.js';
import cards101Parser from './parsers/cards101.js';
import columns104Parser from './parsers/columns104.js';
import cards103Parser from './parsers/cards103.js';
import cards105Parser from './parsers/cards105.js';
import cards107Parser from './parsers/cards107.js';
import hero100Parser from './parsers/hero100.js';
import columns109Parser from './parsers/columns109.js';
import tableNoHeader106Parser from './parsers/tableNoHeader106.js';
import columns111Parser from './parsers/columns111.js';
import cards112Parser from './parsers/cards112.js';
import columns113Parser from './parsers/columns113.js';
import cards110Parser from './parsers/cards110.js';
import cards108Parser from './parsers/cards108.js';
import columns115Parser from './parsers/columns115.js';
import accordion114Parser from './parsers/accordion114.js';
import hero118Parser from './parsers/hero118.js';
import hero117Parser from './parsers/hero117.js';
import columns119Parser from './parsers/columns119.js';
import columns120Parser from './parsers/columns120.js';
import accordion122Parser from './parsers/accordion122.js';
import accordion121Parser from './parsers/accordion121.js';
import columns123Parser from './parsers/columns123.js';
import columns125Parser from './parsers/columns125.js';
import hero116Parser from './parsers/hero116.js';
import columns124Parser from './parsers/columns124.js';
import cards126Parser from './parsers/cards126.js';
import columns127Parser from './parsers/columns127.js';
import columns129Parser from './parsers/columns129.js';
import columns130Parser from './parsers/columns130.js';
import accordion132Parser from './parsers/accordion132.js';
import accordion131Parser from './parsers/accordion131.js';
import columns128Parser from './parsers/columns128.js';
import accordion135Parser from './parsers/accordion135.js';
import cards133Parser from './parsers/cards133.js';
import accordion137Parser from './parsers/accordion137.js';
import accordion138Parser from './parsers/accordion138.js';
import columns136Parser from './parsers/columns136.js';
import tableStripedBordered134Parser from './parsers/tableStripedBordered134.js';
import accordion140Parser from './parsers/accordion140.js';
import accordion141Parser from './parsers/accordion141.js';
import accordion143Parser from './parsers/accordion143.js';
import accordion142Parser from './parsers/accordion142.js';
import columns139Parser from './parsers/columns139.js';
import tableStriped144Parser from './parsers/tableStriped144.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  hero2: hero2Parser,
  columns3: columns3Parser,
  columns6: columns6Parser,
  columns7: columns7Parser,
  columns4: columns4Parser,
  accordion8: accordion8Parser,
  accordion10: accordion10Parser,
  accordion9: accordion9Parser,
  cards11: cards11Parser,
  accordion12: accordion12Parser,
  columns14: columns14Parser,
  accordion13: accordion13Parser,
  columns16: columns16Parser,
  columns15: columns15Parser,
  columns18: columns18Parser,
  columns17: columns17Parser,
  cards1: cards1Parser,
  accordion19: accordion19Parser,
  hero22: hero22Parser,
  cards21: cards21Parser,
  columns24: columns24Parser,
  columns23: columns23Parser,
  columns26: columns26Parser,
  accordion20: accordion20Parser,
  accordion28: accordion28Parser,
  columns27: columns27Parser,
  columns29: columns29Parser,
  accordion31: accordion31Parser,
  cards25: cards25Parser,
  columns30: columns30Parser,
  accordion32: accordion32Parser,
  accordion35: accordion35Parser,
  accordion33: accordion33Parser,
  columns38: columns38Parser,
  accordion36: accordion36Parser,
  cards34: cards34Parser,
  accordion39: accordion39Parser,
  columns41: columns41Parser,
  columns42: columns42Parser,
  columns43: columns43Parser,
  hero40: hero40Parser,
  columns44: columns44Parser,
  cards45: cards45Parser,
  accordion46: accordion46Parser,
  columns48: columns48Parser,
  accordion47: accordion47Parser,
  columns52: columns52Parser,
  hero51: hero51Parser,
  accordion54: accordion54Parser,
  columns53: columns53Parser,
  hero50: hero50Parser,
  accordion55: accordion55Parser,
  accordion58: accordion58Parser,
  accordion57: accordion57Parser,
  tableStripedBordered56: tableStripedBordered56Parser,
  columns60: columns60Parser,
  columns61: columns61Parser,
  columns62: columns62Parser,
  columns59: columns59Parser,
  search64: search64Parser,
  columns65: columns65Parser,
  tableStriped63: tableStriped63Parser,
  columns67: columns67Parser,
  hero68: hero68Parser,
  cardsNoImages69: cardsNoImages69Parser,
  tableStriped66: tableStriped66Parser,
  tabs71: tabs71Parser,
  columns72: columns72Parser,
  tabs73: tabs73Parser,
  tableStriped70: tableStriped70Parser,
  columns75: columns75Parser,
  cards74: cards74Parser,
  columns77: columns77Parser,
  columns80: columns80Parser,
  hero81: hero81Parser,
  tableBordered78: tableBordered78Parser,
  cards79: cards79Parser,
  accordion83: accordion83Parser,
  cards84: cards84Parser,
  columns86: columns86Parser,
  columns82: columns82Parser,
  columns88: columns88Parser,
  columns89: columns89Parser,
  columns87: columns87Parser,
  columns85: columns85Parser,
  accordion90: accordion90Parser,
  cards92: cards92Parser,
  accordion93: accordion93Parser,
  columns94: columns94Parser,
  columns95: columns95Parser,
  columns97: columns97Parser,
  columns91: columns91Parser,
  columns98: columns98Parser,
  columns96: columns96Parser,
  accordion99: accordion99Parser,
  columns102: columns102Parser,
  cards101: cards101Parser,
  columns104: columns104Parser,
  cards103: cards103Parser,
  cards105: cards105Parser,
  cards107: cards107Parser,
  hero100: hero100Parser,
  columns109: columns109Parser,
  tableNoHeader106: tableNoHeader106Parser,
  columns111: columns111Parser,
  cards112: cards112Parser,
  columns113: columns113Parser,
  cards110: cards110Parser,
  cards108: cards108Parser,
  columns115: columns115Parser,
  accordion114: accordion114Parser,
  hero118: hero118Parser,
  hero117: hero117Parser,
  columns119: columns119Parser,
  columns120: columns120Parser,
  accordion122: accordion122Parser,
  accordion121: accordion121Parser,
  columns123: columns123Parser,
  columns125: columns125Parser,
  hero116: hero116Parser,
  columns124: columns124Parser,
  cards126: cards126Parser,
  columns127: columns127Parser,
  columns129: columns129Parser,
  columns130: columns130Parser,
  accordion132: accordion132Parser,
  accordion131: accordion131Parser,
  columns128: columns128Parser,
  accordion135: accordion135Parser,
  cards133: cards133Parser,
  accordion137: accordion137Parser,
  accordion138: accordion138Parser,
  columns136: columns136Parser,
  tableStripedBordered134: tableStripedBordered134Parser,
  accordion140: accordion140Parser,
  accordion141: accordion141Parser,
  accordion143: accordion143Parser,
  accordion142: accordion142Parser,
  columns139: columns139Parser,
  tableStriped144: tableStriped144Parser,
  ...customParsers,
};

const transformers = [
  cleanupTransformer,
  imageTransformer,
  linkTransformer,
  sectionsTransformer,
  ...(Array.isArray(customTransformers)
    ? customTransformers
    : Object.values(customTransformers)),
];

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  replaceWithErrorBlock: (element, message) => {
    if (!element || !element.parentElement) return;
    const headerRow = ['Columns (exc-import-error)'];
    const rows = [headerRow, [message]];

    const errorElement = WebImporter.DOMUtils.createTable(rows, document);
    try {
      element.replaceWith(errorElement);
    } catch (e) {
      console.warn(`Failed to replace element with error element: ${message}`, e);
    }
  },
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    transformers.forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

const ReportBuilder = () => {
  const report = { 'Has Failed Parser': 'false', 'Failed Parsers': [] };
  return {
    getReport: () => report,
    addFailedParser: (parserName) => {
      report['Has Failed Parser'] = 'true';
      report['Failed Parsers'].push(parserName);
    },
  };
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL }, reportBuilder } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }))
    .filter((block) => block.element);

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, document.body, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const emptyElement = document.createElement('div');
      const { element = emptyElement, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];

      let parserElement = element;
      if (typeof parserElement === 'string') {
        parserElement = document.body.querySelector(parserElement);
      }
      const originalContent = parserElement.innerHTML;
      try {
        main.append(parserElement);
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        if (parserFn) {
          // parse the element
          parserFn.call(this, parserElement, { ...source });
          if (parserElement.parentElement && parserElement.innerHTML === originalContent) {
            WebImporter.Import.replaceWithErrorBlock(parserElement, `Failed to parse content into block - please check the parser ${parserName}`);
            reportBuilder.addFailedParser(parserName);
          }
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
        WebImporter.Import.reaplceWithErrorBlock(parserElement, `Failed to parse content into block with exception: "${e.message}" - please check the parser ${parserName}`);
        if (parserFn) {
          reportBuilder.addFailedParser(parserName);
        }
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, {
  fragment, inventory, publishUrl, ...source
}) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth, publishUrl,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (payload) => {
    const { document, params: { originalURL } } = payload;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    const reportBuilder = ReportBuilder();
    const sourceBody = document.body;
    const main = document.createElement('div');

    // before transform hook
    WebImporter.Import.transform(
      TransformHook.beforeTransform,
      sourceBody,
      { ...payload, inventory },
    );

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      transformFragment(main, {
        ...payload, fragment, inventory, publishUrl, reportBuilder,
      });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...payload, inventory, reportBuilder });
      path = generateDocumentPath(payload, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(
      TransformHook.afterTransform,
      main,
      { ...payload, inventory },
    );

    return [{
      element: main,
      path,
      report: reportBuilder.getReport(),
    }];
  },
};
