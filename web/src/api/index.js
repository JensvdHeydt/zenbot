import request from 'axios'

const LATENCY = 16

export function loadAllSessions (cb) {
  return request.get('http://192.168.64.100:3002/sessions').then((response) => {
    setTimeout(() => {
      cb(response.data)
    }, LATENCY)
    // return {bootstrapData: response.data}
  })
}

export function loadAllSelectors (cb) {
  return request.get('http://192.168.64.100:3002/selectors').then((response) => {
    setTimeout(() => {
      cb(response.data)
    }, LATENCY)
    // return {bootstrapData: response.data}
  })
}

export function getAllMessages (cb) {
  setTimeout(() => {
    // cb(data)
  }, LATENCY)
}

export function createMessage ({text, thread}, cb) {
  const timestamp = Date.now()
  const id = 'm_' + timestamp
  const message = {
    id,
    text,
    timestamp,
    threadID: thread.id,
    threadName: thread.name,
    authorName: 'Evan'
  }
  setTimeout(function () {
    cb(message)
  }, LATENCY)
}
