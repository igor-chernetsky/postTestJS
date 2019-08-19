function wrapHtml(htmlToWrap) {
  return `
    <!DOCTYPE>
    <html>
      <head>
        <style>
          body {
            padding-bottom: 51px;
            position: relative;
          }
          hr {
            border-color: #F00;
          }
          nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            border-top: 1px solid #777;
            background: #fff;
          }
          nav a {
            color: #777;
            margin: 10px 20px;
            border: 1px solid #777;
            padding: 5px;
            border-radius: 3px;
          }
        </style>
      </head>
      <body>${htmlToWrap}</body>
    </html>
  `;
}

function renderArticles(stringResult, query) {
  const article = _getArticle(stringResult);
  const total = article.blocks.length;
  let navigationPanel;
  if (query.bnn && !Number.isNaN(query.bnn)) {
    let bnn = +query.bnn;
    let offset = query.offset ? +query.offset : 0;
    if (offset < 0) offset = 0;
    if (bnn < 0) bnn = 10;
    article.blocks = article.blocks.splice(offset, bnn);

    const nextButton = total > bnn + offset ?
      `<a href="/?bnn=${bnn}&offset=${offset+bnn}">Next</a>` : '';

    const prevOffset = offset-bnn;
    const prevButton = offset ?
      `<a href="/?bnn=${bnn}&offset=${prevOffset < 0 ? 0 : prevOffset}">Prev</a>` : '';
    navigationPanel = `<nav>${prevButton}${nextButton}</nav>`;
  }

  let result = article.blocks.map(b => {
    return `<article><h2>${b.title || 'Title Placeholder'}</h2>
    ${_renderText(b.text)}${_getImage(b, article.meta.id)}</article>`;
  }).join('<hr/>') + navigationPanel;

  return result;
}

function _renderText(blockText) {
  if (Array.isArray(blockText)) return blockText.join('');
  return blockText;
}

function _getImage(block, id) {
  if(block.image && block.image.name && id) {
    const imageUrl = `https://img.omgcheckitout.com/articles/${id}/${block.image.name}`;
    const result = `<img src="${imageUrl}" />`;
    return result;
  }
}

function _getArticle(stringResult) {
  // using fake window object to execute the code from the source since it returs data in such format
  // other option if parse it as a string, but I suppose such format was used deliberately.
  const window = {shinez: {}};
  eval(stringResult);
  return window.shinez.article;
}

module.exports = {
  renderArticles,
  wrapHtml
}
