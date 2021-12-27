import Reveal from 'reveal.js'

if (!window.Webflow) {
  window.Webflow = []
}
window.Webflow.push(() => {
  if (!window.Webflow.env('editor')) {
    console.log('Initializing...')
    Reveal.initialize()
  } else {
    const exitButton = document.createElement('button')
    exitButton.innerText = 'Remove editor'
    exitButton.classList.add('button-remove-editor')
    exitButton.addEventListener('click', () => {
      localStorage.removeItem('WebflowEditor')
      location.reload()
    })
    document.body.appendChild(exitButton)
  }
})
