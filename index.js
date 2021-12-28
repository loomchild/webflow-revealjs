import OriginalReveal from 'reveal.js'

if (!window.Webflow) {
  window.Webflow = []
}

async function waitForWebflow () {
  return new Promise((resolve, reject) => {
    window.Webflow.push(() => {
      resolve()
    })
  })
}

async function isEditor () {
  await waitForWebflow()
  return window.Webflow.env('editor')
}

function updateOptionsFromProperties (options) {
  if (!options) {
    options = {}
  }

  const newOptions = {}
  const rootStyle = window.getComputedStyle(document.documentElement)

  const width = rootStyle.getPropertyValue('--deck-width')
  if (width && width.includes('px')) {
    newOptions.width = Number(width.replace('px', ''))
  }

  const height = rootStyle.getPropertyValue('--deck-height')
  if (height && height.includes('px')) {
    newOptions.height = Number(height.replace('px', ''))
  }

  const margin = rootStyle.getPropertyValue('--deck-margin')
  if (margin) {
    newOptions.margin = Number(margin)
  }

  return newOptions
}

async function injectButtonIfEditor () {
  if (await isEditor()) {
    const exitButton = document.createElement('button')
    exitButton.innerText = 'Remove editor'
    exitButton.classList.add('button-remove-editor')
    exitButton.addEventListener('click', () => {
      localStorage.removeItem('WebflowEditor')
      location.reload()
    })
    document.body.appendChild(exitButton)
  }
}
injectButtonIfEditor()

class WebflowReveal extends OriginalReveal {
  constructor (options = {}) {
    super(updateOptionsFromProperties(options))
  }

  async initialize (options) {
    if (!await isEditor()) {
      super.initialize(updateOptionsFromProperties(options))
    }
  }

  async configure (options) {
    if (!await isEditor()) {
      super.configure(updateOptionsFromProperties(options))
    }
  }
}

WebflowReveal.initialize = async options => {
  if (!await isEditor()) {
    OriginalReveal.initialize(updateOptionsFromProperties(options))
  }
}

WebflowReveal.configure = async options => {
  if (!await isEditor()) {
    OriginalReveal.configure(updateOptionsFromProperties(options))
  }
}

window.Reveal = WebflowReveal

export { WebflowReveal as Reveal }
