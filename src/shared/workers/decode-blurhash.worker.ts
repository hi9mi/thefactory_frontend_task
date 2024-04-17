import { decode } from 'blurhash'

self.addEventListener('message', (event: MessageEvent<{ payload: { blurhash: string | null, width: number, height: number, id: string } }>) => {
  const { width, height, id, blurhash } = event.data.payload
  if (!blurhash)
    return

  const offscreenCanvas = new OffscreenCanvas(width, height)
  const ctx = offscreenCanvas.getContext('2d')
  if (!ctx)
    return

  const pixels = decode(blurhash, width, height)
  const imageData = ctx.createImageData(width, height)
  imageData.data.set(pixels)
  ctx.putImageData(imageData, 0, 0)
  const bitmap = offscreenCanvas.transferToImageBitmap()
  self.postMessage({ payload: { bitmap, id } }, { transfer: [bitmap] })
})
