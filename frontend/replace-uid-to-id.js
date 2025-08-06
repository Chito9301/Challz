const fs = require('fs');
const path = require('path');

const ROOT_DIR = './frontend';  // Cambiado a la carpeta frontend
const FILE_EXTENSIONS = ['.tsx', '.ts'];

/**
 * Recorre directorios y devuelve archivos con extensiones indicadas
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
 * Filtra archivos que contienen la cadena 'user.uid'
 */
function findFilesWithUserUid(files) {
  return files.filter((file) => {
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('user.uid');
  });
}

/**
 * Reemplaza solo las ocurrencias exactas de 'user.uid' por 'user.id' en los archivos indicados
 */
function replaceUserUidByUserId(files) {
  files.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    const regex = /(\buser)\.uid\b/g;
    const updatedContent = content.replace(regex, '$1.id');

    if (updatedContent !== content) {
      fs.writeFileSync(file, updatedContent, 'utf8');
      console.log(`Reemplazado 'user.uid' por 'user.id' en: ${file}`);
    }
  });
}

function main() {
  console.log('Buscando archivos .tsx y .ts dentro de ./frontend...');
  const allFiles = walk(ROOT_DIR);

  console.log('Buscando archivos que contienen "user.uid"...');
  const filesWithUserUid = findFilesWithUserUid(allFiles);

  if (filesWithUserUid.length === 0) {
    console.log('No se encontraron archivos con "user.uid"');
    return;
  }

  console.log('Archivos que contienen "user.uid":');
  filesWithUserUid.forEach((f) => console.log(f));

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question('¿Deseas reemplazar "user.uid" por "user.id" en estos archivos? (s/n): ', (answer) => {
    if (answer.toLowerCase() === 's') {
      replaceUserUidByUserId(filesWithUserUid);
      console.log('Reemplazo completado.');
    } else {
      console.log('Reemplazo cancelado.');
    }
    readline.close();
  });
}

main();
