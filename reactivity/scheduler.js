const p = Promise.resolve()

export const jobQueue = new Set()

let isFlushing = false

export function flushJob() {
  if (isFlushing)
    return

  isFlushing = true
  p.then(() => {
    jobQueue.forEach(job => job())
  }).finally(() => isFlushing = false)
}
