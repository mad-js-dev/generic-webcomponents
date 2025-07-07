// This plugin ensures that all asset URLs in the built files include the correct base URL
// for GitHub Pages deployment

export default function baseUrlPlugin() {
  return {
    name: 'base-url-plugin',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html) {
      // Add base URL to all asset paths
      return html.replace(/(href|src)="\/([^"#?]+)"/g, (match, p1, p2) => {
        // Skip if already has base URL
        if (p2.startsWith('generic-webcomponents/')) {
          return match;
        }
        // Don't modify external URLs
        if (p2.startsWith('http://') || p2.startsWith('https://') || p2.startsWith('//')) {
          return match;
        }
        // Add base URL
        return `${p1}="/generic-webcomponents/${p2}"`;
      });
    },
    transform(code, id) {
      // Only process JS files
      if (!id.endsWith('.js')) return;
      
      // Replace asset paths in JS files
      return code.replace(/(['"])(\/assets\/[^'"?#]+)(['"])/g, (match, p1, p2, p3) => {
        return `${p1}/generic-webcomponents${p2}${p3}`;
      });
    }
  };
}
