<!-- start Simple Custom CSS and JS -->
<script type="text/javascript">
(function () {
  if (window.__wpcontentRewriterLoaded) return;
  window.__wpcontentRewriterLoaded = true;

  const NEEDLE = '/wp-content';

  // Hosts permitidos para o "corte" (apenas estes terão o domínio removido)
  const ALLOWED_HOSTS = [
    'evertecinc-com.plataformasegura.nubity.com',
    'evertecinc-com-stg-assets.s3.amazonaws.com'
  ];

  // Marca blocos "skip"
  function markSkipRoots(root = document) {
    if (!SKIP_COMBINED) return;
    root.querySelectorAll(SKIP_COMBINED).forEach(el => {
      el.setAttribute('data-wp-skip', '1');
    });
  }
  function isInsideSkip(el) {
    return !!(el && el.nodeType === 1 && el.closest('[data-wp-skip="1"]'));
  }
  function rootIsSkip(root) {
    return root && root.nodeType === 1 && (root.matches(SKIP_COMBINED) || root.hasAttribute('data-wp-skip'));
  }

  // === Detecta o prefixo real antes de /wp-content (ex.: "/trends") ===
  let WP_PREFIX = '';
  (function detectPrefix() {
    // Procura qualquer asset do PRÓPRIO host que tenha /wp-content com prefixo
    const candidates = [
      ...document.querySelectorAll('link[href*="/wp-content"]'),
      ...document.querySelectorAll('script[src*="/wp-content"]'),
      ...document.querySelectorAll('img[src*="/wp-content"]')
    ];
    for (const el of candidates) {
      const url = el.getAttribute('href') || el.getAttribute('src');
      if (!url) continue;
      try {
        const u = new URL(url, location.href);
        if (u.hostname !== location.hostname) continue; // só mesmo host
        const path = u.pathname;
        const i = path.indexOf(NEEDLE);
        if (i > 0) { // há algo antes de /wp-content
          WP_PREFIX = path.substring(0, i); // ex.: "/trends"
          break;
        }
      } catch {  }
    }
  })();

  const CSS_PROPS = [
    'backgroundImage',
    'maskImage',
    'webkitMaskImage',
    'listStyleImage',
    'borderImageSource'
  ];

  function isAllowed(url) {
    if (!url || typeof url !== 'string') return false;
    try {
      const u = new URL(url, location.href);
      if (u.protocol === 'data:') return false;
      return ALLOWED_HOSTS.includes(u.hostname);
    } catch { return false; }
  }

  // === NORMALIZE: só adiciona prefixo (ex.: "/trends") quando a URL começa com "/wp-content" ===
  function addPrefixIfNeeded(url) {
    if (!url || typeof url !== 'string') return url;
    if (!WP_PREFIX) return url;
    // já está prefixado? (ex.: "/trends/wp-content")
    if (url.startsWith(WP_PREFIX + NEEDLE)) return url;
    // precisa prefixar? (ex.: "/wp-content/...")
    if (url.startsWith(NEEDLE)) return WP_PREFIX + url;
    return url;
  }

  function normalizeAttr(el, attr) {
    const val = el.getAttribute(attr);
    if (!val) return;
    const newVal = addPrefixIfNeeded(val);
    if (newVal !== val) el.setAttribute(attr, newVal);
  }

  function normalizeSrcset(el) {
    const srcset = el.getAttribute('srcset');
    if (!srcset) return;
    const fixed = srcset
      .split(',')
      .map(part => {
        const [url, descriptor] = part.trim().split(/\s+/, 2);
        const newUrl = addPrefixIfNeeded(url);
        return descriptor ? `${newUrl} ${descriptor}` : newUrl;
      })
      .join(', ');
    if (fixed !== srcset) el.setAttribute('srcset', fixed);
  }

  function normalizeCssValue(value) {
    if (!value || !value.includes('url(')) return value;
    return value.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/gi, (m, q, u) => `url(${addPrefixIfNeeded(u)})`);
  }

  function normalizeCssOnEl(el) {
    // Inline style props
    CSS_PROPS.forEach(prop => {
      const val = el.style[prop];
      if (val && val.includes('url(')) el.style[prop] = normalizeCssValue(val);
    });
    // style="background: url(...)"
    const inlineStyle = el.getAttribute('style');
    if (inlineStyle && inlineStyle.includes('url(')) {
      const rewritten = normalizeCssValue(inlineStyle);
      if (rewritten !== inlineStyle) el.setAttribute('style', rewritten);
    }
  }

  // === CORTE: remove domínio antes de /wp-content apenas nos hosts permitidos (fora dos "skip") ===
  function cutFromWpContent(url) {
    if (!url || typeof url !== 'string') return url;
    const i = url.indexOf(NEEDLE);
    return i === -1 ? url : url.substring(i);
  }

  function rewriteUrlInCssValue(value) {
    if (!value || !value.includes('url(') || !value.includes(NEEDLE)) return value;
    return value.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/gi, (m, q, u) => {
      return isAllowed(u) ? `url(${cutFromWpContent(u)})` : m;
    });
  }

  function fixAttr(el, attr) {
    if (isInsideSkip(el)) return; // corte NÃO roda em skip
    const val = el.getAttribute(attr);
    if (!val || !val.includes(NEEDLE) || !isAllowed(val)) return;
    el.setAttribute(attr, cutFromWpContent(val));
  }

  function fixSrcset(el) {
    if (isInsideSkip(el)) return; // corte NÃO roda em skip
    const srcset = el.getAttribute('srcset');
    if (!srcset || !srcset.includes(NEEDLE)) return;
    const fixed = srcset
      .split(',')
      .map(part => {
        const [url, descriptor] = part.trim().split(/\s+/, 2);
        if (!isAllowed(url)) return part.trim();
        const newUrl = cutFromWpContent(url);
        return descriptor ? `${newUrl} ${descriptor}` : newUrl;
      })
      .join(', ');
    if (fixed !== srcset) el.setAttribute('srcset', fixed);
  }

  function fixCssUrls(el) {
    if (isInsideSkip(el)) return; // corte NÃO roda em skip
    const style = el.style;
    CSS_PROPS.forEach(prop => {
      const val = style[prop];
      if (val && val.includes(NEEDLE)) style[prop] = rewriteUrlInCssValue(val);
    });
    const cs = getComputedStyle(el);
    CSS_PROPS.forEach(prop => {
      const val = cs[prop];
      if (val && val.includes(NEEDLE)) {
        const rewritten = rewriteUrlInCssValue(val);
        if (rewritten !== val) style[prop] = rewritten;
      }
    });
    const inlineStyle = el.getAttribute('style');
    if (inlineStyle && inlineStyle.includes('url(') && inlineStyle.includes(NEEDLE)) {
      const rewritten = rewriteUrlInCssValue(inlineStyle);
      if (rewritten !== inlineStyle) el.setAttribute('style', rewritten);
    }
  }

  function fixElementorDataSettings(el) {
    if (isInsideSkip(el)) return; // corte NÃO roda em skip
    const raw = el.getAttribute('data-settings');
    if (!raw || !raw.includes(NEEDLE)) return;

    try {
      const jsonText = raw.replace(/&quot;/g, '"');
      const parsed = JSON.parse(jsonText);
      // aplica corte só em URLs permitidas
      function deepRewrite(obj) {
        if (!obj) return obj;
        if (typeof obj === 'string') return (obj.includes(NEEDLE) && isAllowed(obj)) ? cutFromWpContent(obj) : obj;
        if (Array.isArray(obj)) return obj.map(deepRewrite);
        if (typeof obj === 'object') {
          const out = {};
          for (const k in obj) out[k] = deepRewrite(obj[k]);
          return out;
        }
        return obj;
      }
      const rewritten = deepRewrite(parsed);
      const newJson = JSON.stringify(rewritten);
      if (newJson !== jsonText) el.setAttribute('data-settings', newJson);
    } catch {
      el.setAttribute(
        'data-settings',
        raw.replace(/https?:\/\/[^"' ]*?(\/wp-content[^\s"']+)/g, (m, p1) => {
          try {
            const full = m.match(/https?:\/\/[^"' ]+/)[0];
            const ok = isAllowed(full);
            return ok ? p1 : m;
          } catch { return m; }
        })
      );
    }
  }

  // === PASSO 1: NORMALIZE (roda em TODO lugar, inclusive dentro de "skip") ===
  function normalizeEverywhere(root = document) {
    // attrs padrão
    root.querySelectorAll('img[src], video[src], source[src], a[href], [poster], [data-src], [data-bg], [data-lazy], [data-original]').forEach(el => {
      ['src','href','poster','data-src','data-bg','data-lazy','data-original'].forEach(attr => {
        if (el.hasAttribute(attr)) normalizeAttr(el, attr);
      });
    });
    // srcset
    root.querySelectorAll('img[srcset], source[srcset]').forEach(normalizeSrcset);
    // CSS inline
    root.querySelectorAll('*').forEach(normalizeCssOnEl);
  }

  // === PASSO 2: CORTE (NÃO roda em "skip") ===
  function processCut(root = document) {
    if (rootIsSkip(root)) return;

    root.querySelectorAll('a[href*="/wp-content"]').forEach(a => fixAttr(a, 'href'));
    root.querySelectorAll('img[src*="/wp-content"]').forEach(img => fixAttr(img, 'src'));
    root.querySelectorAll('video[src*="/wp-content"]').forEach(v => fixAttr(v, 'src'));
    root.querySelectorAll('video[poster*="/wp-content"]').forEach(v => fixAttr(v, 'poster'));
    root.querySelectorAll('source[src*="/wp-content"]').forEach(s => fixAttr(s, 'src'));
    root.querySelectorAll('img[srcset*="/wp-content"], source[srcset*="/wp-content"]').forEach(fixSrcset);

    ['data-src', 'data-bg', 'data-lazy', 'data-original'].forEach(attr => {
      root.querySelectorAll(`[${attr}*="/wp-content"]`).forEach(el => fixAttr(el, attr));
    });

    root.querySelectorAll('svg use[href*="/wp-content"], svg use[xlink\\:href*="/wp-content"]').forEach(u => {
      if (u.hasAttribute('href')) fixAttr(u, 'href');
      if (u.hasAttribute('xlink:href')) fixAttr(u, 'xlink:href');
    });
    root.querySelectorAll('svg image[href*="/wp-content"], svg image[xlink\\:href*="/wp-content"]').forEach(img => {
      if (img.hasAttribute('href')) fixAttr(img, 'href');
      if (img.hasAttribute('xlink:href')) fixAttr(img, 'xlink:href');
    });

    root.querySelectorAll('*').forEach(fixCssUrls);

    root.querySelectorAll('.elementor, .elementor-section, .elementor-column, .elementor-widget, [class*="e-con"], [class*="jet-"]').forEach(el => {
      fixCssUrls(el);
      fixElementorDataSettings(el);
    });

    root.querySelectorAll('[data-settings*="/wp-content"]').forEach(fixElementorDataSettings);
  }

  // Primeira rodada
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      markSkipRoots(document);
      normalizeEverywhere(document);  // 1) prefixa /wp-content -> /<prefix>/wp-content
      processCut(document);           // 2) corta domínios permitidos fora dos "skip"
    });
  } else {
    markSkipRoots(document);
    normalizeEverywhere(document);
    processCut(document);
  }

  // Dinâmico
  const mo = new MutationObserver(muts => {
    for (const m of muts) for (const node of m.addedNodes) {
      if (node && node.nodeType === 1) {
        // normalize roda SEMPRE, inclusive em skip
        normalizeEverywhere(node);
        // corte só fora de skip
        if (!rootIsSkip(node)) {
          markSkipRoots(node);
          processCut(node);
        }
      }
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
</script>
<!-- end Simple Custom CSS and JS -->
