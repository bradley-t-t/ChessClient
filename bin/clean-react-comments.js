#!/usr/bin/env node

const { Command } = require('commander');
const { glob } = require('glob');
const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const babelGenerator = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;

const program = new Command();

program
  .name('clean-react-comments')
  .description('CLI tool that removes comments from JavaScript, TypeScript, and JSX/TSX files')
  .version('1.0.0')
  .argument('<directory>', 'directory to process')
  .option('--exclude <glob>', 'exclude files matching the pattern', 'node_modules,dist')
  .option('--only-code-comments', 'remove only // and /* */ comments, preserving JSDoc & JSX', false)
  .option('--keep-jsdoc', 'preserve JSDoc comments (/** ... */)', true)
  .option('--remove-all-jsx-comments', 'remove all JSX comments ({/* ... */})', false)
  .option('--remove-tag-jsx-comments', 'remove JSX comments wrapping tags ({/* <div>...</div> */})', true)
  .option('--remove-annotations', 'remove annotation comments like // TODO, // FIXME', false);

program.parse();

const [directory] = program.args;
const options = program.opts();

const excludePatterns = options.exclude.split(',').map(p => p.trim());

const annotationPatterns = [
  /\/\/\s*TODO/i,
  /\/\/\s*FIXME/i,
  /\/\/\s*HACK/i,
  /\/\/\s*XXX/i,
  /\/\/\s*REVIEW/i,
  /\/\/\s*OPTIMIZE/i,
  /\/\/\s*CHANGED/i,
  /\/\/\s*NOTE/i,
  /\/\/\s*WARNING/i
];

function shouldRemoveComment(comment, options) {
  if (options.onlyCodeComments) {
    return comment.type === 'CommentLine' || comment.type === 'CommentBlock';
  }

  if (options.keepJsdoc && comment.type === 'CommentBlock' && comment.value.startsWith('*')) {
    return false;
  }

  if (!options.removeAnnotations) {
    const fullComment = `//${comment.value}`.toLowerCase();
    if (annotationPatterns.some(pattern => pattern.test(fullComment))) {
      return false;
    }
  }

  return true;
}

function shouldRemoveJSXComment(node, options) {
  if (options.removeAllJsxComments) {
    return true;
  }

  if (options.removeTagJsxComments) {
    // Check if the comment contains JSX tags
    if (node.expression && node.expression.innerComments) {
      const commentValue = node.expression.innerComments.map(c => c.value).join('');
      return /<[^>]+>/.test(commentValue);
    }
  }

  return false;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const ext = path.extname(filePath).toLowerCase();

  if (!['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
    return;
  }

  try {
    const ast = babelParser.parse(content, {
      sourceType: 'module',
      plugins: [
        'jsx',
        ext === '.tsx' ? 'typescript' : null
      ].filter(Boolean),
      attachComment: true
    });

    // Remove regular comments
    if (ast.comments) {
      ast.comments = ast.comments.filter(comment => !shouldRemoveComment(comment, options));
    }

    // Traverse AST to remove JSX comments
    traverse(ast, {
      JSXExpressionContainer(path) {
        const node = path.node;
        if (node.expression.type === 'JSXEmptyExpression' && node.expression.innerComments) {
          if (shouldRemoveJSXComment(node, options)) {
            path.remove();
          }
        }
      }
    });

    const output = babelGenerator(ast, {
      retainLines: true,
      comments: true
    });

    fs.writeFileSync(filePath, output.code, 'utf-8');
    console.log(`Processed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  const pattern = path.join(dir, '**/*.{js,jsx,ts,tsx}');
  const files = glob.sync(pattern, {
    ignore: excludePatterns.map(p => `**/${p}/**`)
  });

  files.forEach(processFile);
}

if (!fs.existsSync(directory)) {
  console.error(`Directory does not exist: ${directory}`);
  process.exit(1);
}

processDirectory(directory);
console.log('Done!');