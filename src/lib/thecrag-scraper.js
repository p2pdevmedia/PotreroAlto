const DEFAULT_THECRAG_URL = 'https://www.thecrag.com/en/climbing/argentina/area/6574670919';

function normalizeLabel(value, fallback) {
  const normalized = String(value ?? '').replace(/\s+/g, ' ').trim();
  return normalized || fallback;
}

async function loadPlaywrightChromium() {
  try {
    const dynamicImport = new Function('moduleName', 'return import(moduleName);');
    const playwrightModule = await dynamicImport('playwright');
    return playwrightModule.chromium;
  } catch (error) {
    throw new Error('Playwright no está instalado en este entorno para ejecutar scraping.');
  }
}

export async function scrapeTheCragArea(rawUrl = DEFAULT_THECRAG_URL) {
  const targetUrl = String(rawUrl ?? DEFAULT_THECRAG_URL).trim() || DEFAULT_THECRAG_URL;
  const chromium = await loadPlaywrightChromium();
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(4000);

    const pageTitle = await page.title();
    if (/cloudflare|attention required/i.test(pageTitle)) {
      throw new Error('TheCrag devolvió una validación anti-bots (Cloudflare). Probá nuevamente desde un servidor con salida habilitada.');
    }

    const extracted = await page.evaluate(() => {
      const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
      const routeLinks = Array.from(document.querySelectorAll('a[href*="/route/"]'));

      const groups = new Map();

      const findSubsectorName = (anchor) => {
        const containers = [
          anchor.closest('article'),
          anchor.closest('section'),
          anchor.closest('li'),
          anchor.closest('div')
        ].filter(Boolean);

        for (const container of containers) {
          const localAreaLink = container.querySelector('a[href*="/area/"]');
          if (localAreaLink) {
            const label = clean(localAreaLink.textContent);
            if (label) return label;
          }

          const heading = container.querySelector('h1, h2, h3, h4');
          if (heading) {
            const label = clean(heading.textContent);
            if (label) return label;
          }
        }

        const headingSibling = anchor.closest('li, article, section, div')?.previousElementSibling;
        if (headingSibling) {
          const heading = headingSibling.querySelector?.('h1, h2, h3, h4') ?? headingSibling;
          const label = clean(heading.textContent);
          if (label) return label;
        }

        return 'Subsector sin nombre';
      };

      for (const routeLink of routeLinks) {
        const routeName = clean(routeLink.textContent);
        if (!routeName) continue;

        const subsectorName = findSubsectorName(routeLink);
        const current = groups.get(subsectorName) ?? [];
        if (!current.includes(routeName)) {
          current.push(routeName);
        }
        groups.set(subsectorName, current);
      }

      const subsectors = Array.from(groups.entries())
        .map(([name, routes]) => ({
          name,
          routes: routes.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
        }))
        .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

      return {
        title: document.title,
        subsectors,
        routeCount: subsectors.reduce((sum, item) => sum + item.routes.length, 0)
      };
    });

    return {
      sourceUrl: targetUrl,
      sourceTitle: normalizeLabel(extracted.title, 'TheCrag'),
      subsectors: extracted.subsectors,
      subsectorCount: extracted.subsectors.length,
      routeCount: extracted.routeCount,
      generatedAt: new Date().toISOString()
    };
  } finally {
    await browser.close();
  }
}

export { DEFAULT_THECRAG_URL };
