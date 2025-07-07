const ghpages = require('gh-pages');
const path = require('path');

const options = {
  branch: 'gh-pages',
  repo: 'https://github.com/mad-js-dev/generic-webcomponents.git',
  message: 'chore: update GitHub Pages',
  dotfiles: true,
  add: true,
  history: true,
  user: {
    name: 'GitHub Actions',
    email: 'actions@github.com'
  }
};

console.log('Publishing to GitHub Pages...');

ghpages.publish('docs', options, (err) => {
  if (err) {
    console.error('Error publishing to GitHub Pages:', err);
    process.exit(1);
  }
  console.log('Successfully published to GitHub Pages!');
});
