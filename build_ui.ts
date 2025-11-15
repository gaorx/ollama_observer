// build UI with Bun's build system

async function build() {
  await Bun.build({
    entrypoints: ['./ui/index.html'],
    outdir: './ui/dist',
    publicPath: '/o/',
    naming: {
      chunk: '[name].[ext]',
      asset: '[name].[ext]',
    },
    target: 'browser',
    minify: true,
    sourcemap: true,
    define: {
      'process.env.NODE_ENV': '"production"',
    },
    env: 'BUN_PUBLIC_*',
  });
}

(async () => {
  await build();
})();
