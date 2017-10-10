export const threads = state => state.threads

export const currentThread = state => {
  return state.currentThreadID
    ? state.threads[state.currentThreadID]
    : {}
}

export const currentMessages = state => {
  const thread = currentThread(state)
  return thread.messages
    ? thread.messages.map(id => state.messages[id])
    : []
}

export const getSelectors = state => {
  return state.selectors
}

export const getSessions = state => {
  return state.sessions
}
