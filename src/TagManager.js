import Snippets from './Snippets'

const TagManager = {
  dataScript: function (dataLayer) {
    const script = document.createElement('script')
    script.innerHTML = dataLayer
    script.defer = true
    return script
  },
  gtm: function (args) {
    const snippets = Snippets.tags(args)

    const noScript = () => {
      const noscript = document.createElement('noscript')
      noscript.innerHTML = snippets.iframe
      return noscript
    }

    const script = () => {
      const script = document.createElement('script')
      script.innerHTML = snippets.script
      script.defer = true
      return script
    }

    const dataScript = this.dataScript(snippets.dataLayerVar)

    return {
      noScript,
      script,
      dataScript
    }
  },
  initialize: function ({ gtmId, gtmSrc='https://www.googletagmanager.com', events = {}, dataLayer, dataLayerName = 'dataLayer', auth = '', preview = '' }) {
    const gtm = this.gtm({
      id: gtmId,
      src: gtmSrc,
      events: events,
      dataLayer: dataLayer || undefined,
      dataLayerName: dataLayerName,
      auth,
      preview
    })
    if (dataLayer) document.head.appendChild(gtm.dataScript)
    document.head.insertBefore(gtm.script(), document.head.childNodes[0])
    document.body.insertBefore(gtm.noScript(), document.body.childNodes[0])
  },
  dataLayer: function ({dataLayer, dataLayerName = 'dataLayer'}) {
    if (window[dataLayerName]) return window[dataLayerName].push(dataLayer)
    const snippets = Snippets.dataLayer(dataLayer, dataLayerName)
    const dataScript = this.dataScript(snippets)
    document.head.insertBefore(dataScript, document.head.childNodes[0])
  }
}

module.exports = TagManager
