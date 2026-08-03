const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { 
      results.push(file);
    }
  });
  return results;
}
const files = walk('C:\\Users\\abdoulaahmad\\Documents\\shias\\apps\\web\\src');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('import { format } from "date-fns"') || content.includes("import { format } from 'date-fns'")) {
    const updated = content.replace(/import\s+\{\s*format\s*\}\s+from\s+["']date-fns["']/g, 'import { format } from "@/lib/date-fns"');
    fs.writeFileSync(f, updated, 'utf8');
    console.log('Updated ' + f);
  }
});
