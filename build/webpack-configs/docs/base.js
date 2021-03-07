/* eslint-disable no-console */

const merge = require('webpack-merge');
const config = require('../../config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {parse} = require('node-html-parser');

// Table of contents generator
class TableOfContentsPlugin {
  apply(compiler) {
    const pluginName = 'TableOfContentsPlugin';
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        pluginName, // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          const TOC_placeholder = '<!--[TOC]-->';
          if (data.html.includes(TOC_placeholder)) {
            const matches = data.html.match(/<h([23])[^>]*>[\s\S]+?<\/h\1>/igm);
            if (matches && Array.isArray(matches) && matches.length) {
              let toc = [];
              matches.forEach(el => {
                const $el = parse(el);
                const id = (() => {
                  const match = el.match(/id=(['"])(\S+?)\1/i);
                  return match ? match[2] : null;
                })();
                const isRoot = el.indexOf('<h2') === 0;
                if (id) {
                  if (isRoot) {
                    toc.push({
                      title: $el.text.trim(),
                      anchor: id,
                      children: []
                    });
                  } else {
                    toc[toc.length - 1].children.push({
                      title: $el.text.trim(),
                      anchor: id,
                    });
                  }
                }
              });

              const mapper = link => {
                let children = '';
                if (link.children && link.children.length) {
                  children = '<ul>' + link.children.map(mapper).join('') + '</ul>';
                }
                return `<li><a href="#${link.anchor}">${link.title}</a>${children}</li>`;
              };
              let nav = '<ul>' + toc.map(mapper).join('') + '</ul>';
              data.html = data.html.replace(TOC_placeholder, nav);
            }
          }

          cb(null, data);
        }
      );
    });
  }
}

class HeadersAnchorPlugin {
  apply(compiler) {
    const pluginName = 'HeadersAnchorPlugin';
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        pluginName, // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          data.html = data.html.replace(/<h([23])[^>]*>[\s\S]+?<\/h\1>/igm, match => {
            const matchId = match.match(/id=(['"])(\S+?)\1/i);
            const id = matchId ? matchId[2] : null;
            return id
              ? match.replace(
                '</h',
                `<a class="anchor" href="#${id}"><anchor class="js-vue"></anchor></a></h`
              )
              : match;
          });
          cb(null, data);
        });
    });
  }
}

module.exports = merge(require('../base'), {
  output: {
    path: config.docs.assetsRoot,
  },
  plugins: [
    new TableOfContentsPlugin(),
    new HeadersAnchorPlugin()
  ]
});
