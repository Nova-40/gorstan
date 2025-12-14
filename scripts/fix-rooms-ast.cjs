const { Project, SyntaxKind } = require('ts-morph');
const path = require('path');
const fs = require('fs');

const roomsDir = path.join(__dirname, '..', 'src', 'rooms');
const project = new Project({ tsConfigFilePath: path.join(__dirname, '..', 'tsconfig.json') });

function ensureDescriptionArray(obj) {
  const prop = obj.getProperty('description');
  if (!prop) {
    obj.addPropertyAssignment({ name: 'description', initializer: '[]' });
    return;
  }
  const init = prop.getFirstChildByKind(SyntaxKind.PropertyAssignment).getInitializer();
  if (!init) return;
  if (init.getKind() === SyntaxKind.StringLiteral) {
    const val = init.getLiteralValue();
    init.replaceWithText(`[${JSON.stringify(val)}]`);
  }
}

function normalizeItems(obj) {
  const prop = obj.getProperty('items');
  if (!prop) {
    obj.addPropertyAssignment({ name: 'items', initializer: '[]' });
    return;
  }
  const init = prop.getFirstChildByKind(SyntaxKind.PropertyAssignment).getInitializer();
  if (!init) return;
  if (init.getKind() === SyntaxKind.ArrayLiteralExpression) {
    const elems = init.getElements();
    const needsTransform = elems.some((e) => e.getKind() === SyntaxKind.StringLiteral || e.getKind() === SyntaxKind.Identifier);
    if (needsTransform) {
      const newElems = elems.map((e) => {
        if (e.getKind() === SyntaxKind.StringLiteral) {
          return `{ id: ${JSON.stringify(e.getLiteralValue())} }`;
        }
        if (e.getKind() === SyntaxKind.Identifier) {
          return `{ id: ${e.getText()} }`;
        }
        return e.getText();
      });
      init.replaceWithText(`[${newElems.join(', ')}]`);
    }
  }
}

function normalizeInteractables(obj) {
  const prop = obj.getProperty('interactables');
  if (!prop) {
    obj.addPropertyAssignment({ name: 'interactables', initializer: '{}' });
    return;
  }
  const init = prop.getFirstChildByKind(SyntaxKind.PropertyAssignment).getInitializer();
  if (!init) return;
  if (init.getKind() === SyntaxKind.ArrayLiteralExpression) {
    const elems = init.getElements();
    const mappings = elems.map((el, idx) => {
      // find id property inside el
      const idProp = el.getFirstDescendant((n) => n.getKind() === SyntaxKind.PropertyAssignment && n.getName && n.getName() === 'id');
      let id = `item_${idx}`;
      if (idProp) {
        const idInit = idProp.getFirstChildByKind(SyntaxKind.PropertyAssignment).getInitializer();
        if (idInit && idInit.getKind() === SyntaxKind.StringLiteral) {
          id = idInit.getLiteralValue();
        }
      }
      return `'${id}': ${el.getText()}`;
    });
    init.replaceWithText(`{ ${mappings.join(', ')} }`);
  }
  if (init.getKind() === SyntaxKind.ObjectLiteralExpression) {
    // ok
    return;
  }
}

function processFile(filePath) {
  const sf = project.addSourceFileAtPath(filePath);
  const def = sf.getDefaultExportSymbol();
  if (!def) return;
  const decl = def.getDeclarations()[0];
  const obj = decl.getFirstDescendantByKind(SyntaxKind.ObjectLiteralExpression);
  if (!obj) return;

  ensureDescriptionArray(obj);
  normalizeItems(obj);
  normalizeInteractables(obj);

  sf.saveSync();
}

function run() {
  const files = fs.readdirSync(roomsDir).filter((f) => f.endsWith('.ts'));
  files.forEach((f) => {
    try {
      processFile(path.join(roomsDir, f));
      console.log('Processed:', f);
    } catch (e) {
      console.error('Error processing', f, e && e.message);
    }
  });
}

run();
