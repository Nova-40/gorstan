const { Project, SyntaxKind } = require('ts-morph');
const path = require('path');
const fs = require('fs');

const project = new Project({ tsConfigFilePath: path.join(__dirname, '..', 'tsconfig.json') });
const roomsDir = path.join(__dirname, '..', 'src', 'rooms');
const publicImages = path.join(__dirname, '..', 'public', 'images');
const publicAudio = path.join(__dirname, '..', 'public', 'audio');

const files = fs.readdirSync(roomsDir).filter((f) => f.endsWith('.ts'));
let failed = false;

files.forEach((file) => {
  const sf = project.addSourceFileAtPath(path.join(roomsDir, file));
  const defaultExport = sf.getDefaultExportSymbol();
  if (!defaultExport) return;
  const decl = defaultExport.getDeclarations()[0];
  const obj = decl.getFirstDescendantByKind(SyntaxKind.ObjectLiteralExpression);
  if (!obj) return;

  const imageProp = obj.getProperty('image');
  const audioProp = obj.getProperty('ambientAudio');

  const checkProp = (prop, folder, kind) => {
    if (!prop) return;
    const init = prop.getFirstDescendantByKind(SyntaxKind.StringLiteral);
    if (!init) return;
    const filename = init.getLiteralValue();
    if (!fs.existsSync(path.join(folder, filename))) {
      console.error(`Missing ${kind} for ${file}: ${filename}`);
      failed = true;
    }
  };

  checkProp(imageProp, publicImages, 'image');
  checkProp(audioProp, publicAudio, 'audio');
});

if (failed) {
  console.error('Asset verification failed');
  process.exit(2);
} else {
  console.log('Asset verification passed');
}
