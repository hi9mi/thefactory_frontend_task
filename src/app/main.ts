import { bootstrap } from './bootstrap'

main()

function main() {
  const { BASE_URL, PROD, DEV } = import.meta.env
  const app = bootstrap({
    baseUrl: BASE_URL,
    strict: !PROD,
    performance: DEV,
  })

  app.isReady.then(() => app.mount('#app'))
  app.isReady.catch(error => console.error(error))
}
