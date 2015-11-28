var base = '../';
var dest = base + 'static';
var src = base + 'src';

module.exports = {
  sass: {
    src: src + '/styles/**/*.{sass,scss,css}',
    dest: dest + '/styles',
    settings: {
      sourcemap: true,
      outputStyle: 'compressed',
      indentedSyntax: false, // Enable .sass syntax?
      imagePath: '/images' // Used by the image-url helper
    }
  },
  js: {
    src: [
      src + '/js/**/*.js'
    ],
    dest: dest + '/js'
  },
  jshint: {
    src: src + '/js/**/*.js'
  },
  scsslint: {
    src: src + '/styles/**/*.*',
    exclude: src + '/styles/vendor/*.*',
    config: src + '/scss-lint.yml',
    maxBuffer: 1000000
  },
  kss: {
    src: src + '/styles/**/*.scss',
    dest: src + '/styleguide',
    overview: base + '/styleguide.md',
    template: base + 'src/styleguide/template',
    publicDir: base + 'src/styleguide/public'
  },
  watch: {
    kss: {
      src: src + '/styles/**/*.scss',
      dest: src + '/styleguide',
      overview: base + '/styleguide.md',
      template: base + 'src/styleguide/template',
      publicDir: base + 'src/styleguide/public'
    },
    js: {
      src: src + '/js/**/*.js',
      dest: dest + '/js'
    },
    jshint: {
      src: src + '/js/**/*.js'
    },
    scss: {
      src: src + '/styles/**/*.*',
      dest: dest + '/styles'
    },
    scsslint: {
      src: src + '/styles/**/*.*',
      exclude: src + '/styles/vendor/*.*',
      config: src + '/scss-lint.yml',
      maxBuffer: 1000000
    },
    tasks: ['build']
  }
};
