const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') && !fullPath.includes('Login.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Upgrade cards to have hover effects
      content = content.replace(/className=\"([^\"]*bg-white [^\"]*shadow-sm [^\"]*rounded-xl[^\"]*)\"/g, (match, classes) => {
        if (!classes.includes('transition-')) {
          return 'className=\"' + classes + ' hover:shadow-md hover:-translate-y-0.5 transition-all duration-300\"';
        }
        return match;
      });

      fs.writeFileSync(fullPath, content);
    }
  }
}
processDir(path.join(__dirname, 'src', 'pages'));
