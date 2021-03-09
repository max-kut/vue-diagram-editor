const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = exports.resolve = dir => (
  path.join(__dirname, '../..', dir)
);

const packageJSON = require(resolve('package.json'));

exports.eslintLoader = dir => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve(dir)],
  options: {
    formatter: require('eslint-friendly-formatter'),
    cache: true,
  },
});

exports.styleLoaders = (options = {}) => {
  const loaders = ['cache-loader', {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      sourceMap: options.sourceMap,
    },
  }, {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
    },
  }, {
    loader: 'sass-loader',
    options: {
      sourceMap: options.sourceMap,
    },
  }];

  // These should go before `cache-loader`.
  if (options.extract) {
    loaders.unshift(MiniCssExtractPlugin.loader);
  } else {
    loaders.unshift('vue-style-loader');
  }

  return {
    test: /\.(css|scss)$/,
    use: loaders,
  };
};

exports.withCacheLoader = rule => {
  // Disable cache-loader when running tests.
  if (process.env.NODE_ENV === 'testing') {
    return rule;
  }

  const {loader, options, use, ...rest} = rule;
  const loaders = Array.isArray(use)
    ? use
    : typeof loader === 'string' && !options
      ? [loader]
      : [{loader, options}];

  return {
    use: ['cache-loader', ...loaders],
    ...rest,
  };
};

exports.handlebarsLoader = () => ({
  test: /\.(hbs|handlebars)$/,
  loader: "handlebars-loader"
});

exports.ReplaceLinkAssetsPlugin = class {
  apply(compiler) {
    const pluginName = 'HeadersAnchorPlugin';
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        pluginName, // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          data.html = data.html.replace(/(['"])\/static\//mg, '$1' + packageJSON.homepage + '/static/');
          cb(null, data);
        });
    });
  }
};
