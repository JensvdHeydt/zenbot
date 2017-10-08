import * as api from '../api'
import * as types from './mutation-types'

export const loadAllSelectors = ({ commit }) => {
  api.loadAllSelectors(selectors => {
    commit(types.RECEIVE_ALL_SELECTORS, {
      selectors
    })
  })
}

export const loadAllSessions = ({ commit }) => {
  api.loadAllSessions(sessions => {
    commit(types.RECEIVE_ALL_SESSIONS, {
      sessions
    })
  })
}

export const getAllMessages = ({ commit }) => {
  api.getAllMessages(messages => {
    commit(types.RECEIVE_ALL, {
      messages
    })
  })
}

export const sendMessage = ({ commit }, payload) => {
  api.createMessage(payload, message => {
    commit(types.RECEIVE_MESSAGE, {
      message
    })
  })
}

export const switchThread = ({ commit }, payload) => {
  commit(types.SWITCH_THREAD, payload)
}
