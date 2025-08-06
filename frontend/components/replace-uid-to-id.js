const fs = require('fs');
const path = require('path');

const ROOT_DIR = './'; // Carpeta raíz donde buscar (puedes cambiarla)
const FILE_EXTENSIONS = ['.tsx', '.ts']; // Extensiones a revisar

/**
 * Función que recorre directorios y devuelve archivo que cumplan filtro
 */
function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, filelist);
    } else if (FILE_EXTENSIONS.includes(path.extname(file))) {
      filelist.push(filepath);
    }
  });
  return filelist;
}

/**
 * Detecta en qué archivos está la palabra 'uid'
 */
function findFilesWithUid(files) {
  return files.filter((file) => {
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('uid');
  });
}

/**
 * Reemplaza todas las apariciones de uid por id en los archivos seleccionados
 */
function replaceUidById(files) {
  files.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    // Evitar reemplazos indeseados (puedes ajustar la expresión regular)
    // Reemplazamos sólo: .uid o uid (como propiedad) por .id o id, respetando formatos más comunes
    // Aquí hacemos reemplazo global para todo uid
    const updatedContent = content.replace(/\buid\b/g, 'id');
    if (updatedContent !== content) {
      fs.writeFileSync(file, updatedContent, 'utf8');
      console.log(`Reemplazado en: ${file}`);
    }
  });
}

function main() {
  console.log('Buscando archivos con extensión .tsx y .ts...');
  const allFiles = walk(ROOT_DIR);

  console.log('Buscando archivos que contienen "uid"...');
  const filesWithUid = findFilesWithUid(allFiles);

  if (filesWithUid.length === 0) {
    console.log('No se encontraron archivos con "uid".');
    return;
  }

  console.log(`Archivos que contienen "uid":`);
  filesWithUid.forEach((f) => console.log(f));

  // Confirma antes de reemplazar
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question('¿Deseas reemplazar "uid" por "id" en estos archivos? (s/n): ', (answer) => {
    if (answer.toLowerCase() === 's') {
      replaceUidById(filesWithUid);
      console.log('Reemplazo completado.');
    } else {
      console.log('Reemplazo cancelado.');
    }
    readline.close();
  });
}

main();
