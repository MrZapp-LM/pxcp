// Copies api/pixera_api.json next to the compiled server so dist/ is self-contained.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
fs.copyFileSync(path.join(root, '..', 'api', 'pixera_api.json'), path.join(root, 'dist', 'pixera_api.json'));
console.log('copied pixera_api.json -> dist/');
