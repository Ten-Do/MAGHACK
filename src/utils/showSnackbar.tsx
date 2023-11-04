export const showSnackbar = (message: string): void => {
  const snackbar = document.createElement('div')
  snackbar.setAttribute('id', 'snackbar')
  document.body.appendChild(snackbar)
  snackbar.className = 'show'
  snackbar.textContent = message
  setTimeout(() => {
    document.body.removeChild(snackbar)
    // snackbar.className = snackbar.className.replace('show', '')
  }, 3000)
}