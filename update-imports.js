import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Files that need to be updated
const filesToUpdate = [
  'src/main.js',
  'src/docs/pages/CollapsibleItemPage.js',
  'src/docs/pages/CollapsibleListPage.js',
  'src/components/organisms/selection-menu/docs.html',
  'src/components/organisms/image-collection/ImageCollection.js',
  'src/components/molecules/collapsible-list/__tests__/CollapsibleList.test.js',
  'src/components/molecules/collapsible-list/doc.html',
  'src/components/index.js'
];

// Update each file
filesToUpdate.forEach(filePath => {
  try {
    const fullPath = join(__dirname, filePath);
    if (existsSync(fullPath)) {
      let content = readFileSync(fullPath, 'utf8');
      
      // Update import paths
      content = content.replace(
        /from ['"](?:\.\.\/)*components\/atoms\/collapsible-item\/CollapsibleItem(?:['"])?/g,
        match => {
          // For relative paths, adjust the number of ../ to maintain correct path
          if (match.includes('../../atoms/collapsible-item')) {
            return match.replace('../../atoms/collapsible-item', '../../../molecules/collapsible-item');
          } else if (match.includes('../atoms/collapsible-item')) {
            return match.replace('../atoms/collapsible-item', '../molecules/collapsible-item');
          } else if (match.includes('atoms/collapsible-item')) {
            return match.replace('atoms/collapsible-item', 'molecules/collapsible-item');
          }
          return match;
        }
      );
      
      // Update any other occurrences of the path
      content = content.replace(
        /['"]\.\.\/atoms\/collapsible-item\//g,
        "'../molecules/collapsible-item/"
      );
      
      writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    } else {
      console.log(`Skipped (not found): ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
});

console.log('Import updates complete!');
