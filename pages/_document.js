// pages/_document.js

import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="id">
        <Head />
        <body className="h-100 bg-dark">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
