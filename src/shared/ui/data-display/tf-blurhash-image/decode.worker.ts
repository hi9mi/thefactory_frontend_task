import { decode } from 'blurhash'

self.addEventListener('message', (event: MessageEvent<{ payload: { blurhash: string, width: number, height: number } }>) => {
  const { payload } = event.data
  const pixels = decode(payload.blurhash, payload.width, payload.height)
  self.postMessage({ payload: { pixels } })
})
