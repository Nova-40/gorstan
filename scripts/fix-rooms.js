const { Project, SyntaxKind } = require('ts-morph');
const path = require('path');
const fs = require('fs');

const roomsDir = path.join(__dirname, '..', 'src', 'rooms');

const project = new Project({ tsConfigFilePath: path.join(__dirname, '..', 'tsconfig.json') });

function normalizeRoom(filePath) {
  const sourceFile = project.addSourceFileAtPath(filePath);
  const defaultExport = sourceFile.getDefaultExportSymbol();
  if (!defaultExport) return;

  const declarations = defaultExport.getDeclarations();
  const obj = declarations[0].getFirstChildByKind(SyntaxKind.VariableDeclaration) || declarations[0];
  const initializer = obj.getFirstDescendantByKind(SyntaxKind.ObjectLiteralExpression);
  if (!initializer) return;

  // description: if string -> array
  const descProp = initializer.getProperty('description');
  if (descProp) {
    const val = descProp.getFirstChildByKind(SyntaxKind.PropertyAssignment).getInitializer();
    if (val && val.getKind() === SyntaxKind.StringLiteral) {
      const str = val.getText();
      val.replaceWithText(`[${str}]`);
    }
  }

  // items: convert string[] to array of objects {id: '...'}
  const itemsProp = initializer.getProperty('items');
  if (itemsProp) {
    const val = itemsProp.getFirstChildByKind(SyntaxKind.PropertyAssignment).getInitializer();
    if (val && val.getKind() === SyntaxKind.ArrayLiteralExpression) {
      const elements = val.getElements();
      let needsFix = false;
      elements.forEach((el) => {
        if (el.getKind() === SyntaxKind.StringLiteral) needsFix = true;
      });

      if (needsFix) {
        const newElems = elements.map((el) => {
          if (el.getKind() === SyntaxKind.StringLiteral) {
            const text = el.getText();
            return `{ id: ${text} }`;
          }
          return el.getText();
        });

        val.replaceWithText(`[${newElems.join(', ')}]`);
      }
    }
  }

  // interactables: if array -> convert to record
  const interProp = initializer.getProperty('interactables');
  if (interProp) {
    const val = interProp.getFirstChildByKind(SyntaxKind.PropertyAssignment).getInitializer();
    if (val && val.getKind() === SyntaxKind.ArrayLiteralExpression) {
      const elements = val.getElements();
      const mappings = elements.map((el, idx) => {
        // try to find id property inside
        const idNode = el.getFirstDescendantByKind(SyntaxKind.PropertyAssignment);
        let idText = `item_${idx}`;
        if (idNode) {
          const nameNode = el.getProperty('id');
          if (nameNode) {
            const initializer = nameNode.getFirstChildByKind(SyntaxKind.PropertyAssignment).getInitializer();
            if (initializer) idText = initializer.getText().replace(/['"]/g, '');
          }
        }
        return `'${idText}': ${el.getText()}`;
      });

      val.replaceWithText(`{ ${mappings.join(', ')} }`);
    }
  }

  sourceFile.saveSync();
}

function fixAllRooms() {
  const files = fs.readdirSync(roomsDir).filter((f) => f.endsWith('.ts'));
  files.forEach((f) => {
    try {
      normalizeRoom(path.join(roomsDir, f));
      console.log('Fixed:', f);
    } catch (e) {
      console.error('Failed to process', f, e);
    }
  });
}

fixAllRooms();
