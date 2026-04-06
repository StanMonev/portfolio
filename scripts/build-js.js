const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const sourceDirectory = path.join(__dirname, '..', 'public', 'assets', 'javascript');
const outputDirectory = path.join(sourceDirectory, 'dist');

function getSourceFiles() {
  return fs.readdirSync(sourceDirectory, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.js'))
    .map(entry => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function getMinifiedFilename(filename) {
  return filename.replace(/\.js$/, '.min.js');
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;
  return `${kilobytes.toFixed(2)} KB`;
}

async function buildFile(filename) {
  const sourcePath = path.join(sourceDirectory, filename);
  const sourceCode = fs.readFileSync(sourcePath, 'utf8');
  const result = await minify(sourceCode, {
    compress: {
      passes: 2
    },
    mangle: {
      toplevel: false
    },
    format: {
      comments: false
    }
  });

  if (!result.code) {
    throw new Error(`Minification produced no output for ${filename}.`);
  }

  const outputFilename = getMinifiedFilename(filename);
  const outputPath = path.join(outputDirectory, outputFilename);
  fs.writeFileSync(outputPath, result.code, 'utf8');

  const originalSize = Buffer.byteLength(sourceCode, 'utf8');
  const minifiedSize = Buffer.byteLength(result.code, 'utf8');
  const savedBytes = originalSize - minifiedSize;

  console.log(`${filename} -> ${outputFilename} (${formatBytes(originalSize)} -> ${formatBytes(minifiedSize)}, saved ${formatBytes(savedBytes)})`);
}

async function main() {
  const sourceFiles = getSourceFiles();

  if (!sourceFiles.length) {
    throw new Error('No JavaScript files were found to minify.');
  }

  fs.rmSync(outputDirectory, { recursive: true, force: true });
  fs.mkdirSync(outputDirectory, { recursive: true });

  for (const filename of sourceFiles) {
    await buildFile(filename);
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
