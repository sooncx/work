import Cookies from 'js-cookie'

const SessionIdKey = 'sessionId'
const userDataKey = 'userData'

export function getSessionId() {
  return Cookies.get(SessionIdKey)
}

export function setSessionId(token) {
  return Cookies.set(SessionIdKey, token)
}

export function removeSessionId() {
  return Cookies.remove(SessionIdKey)
}

export function getUserData() {
  return JSON.parse(localStorage.getItem(userDataKey) || '{}')
}

export function setUserData(userData) {
  if (typeof userData === 'object') {
    userData = JSON.stringify(userData)
  }
  return localStorage.setItem(userDataKey, userData)
}

export function removeUserData() {
  return localStorage.removeItem(userDataKey)
}
