import Cookies from 'js-cookie'
const TokenKey = 'TokenKey';
const expires = {
  expires: new Date(new Date().getTime() + 1000 * 60 *60 * 24 *30),
  SameSite: 'strict',
}

export function getToken() {
  return window.sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return window.sessionStorage.setItem(TokenKey, token)
}

export function removeToken(name) {
  return window.sessionStorage.removeItem(TokenKey);
}

export function setLocalStorage(name, value) {
  return window.localStorage.setItem(name, value)
}

export function getLocalStorage(name, value) {
  return window.localStorage.getItem(name, value)
}

export function removeLocalStorage(name) {
  return window.localStorage.removeItem(name)
}

export function setCookie(name, value) {
  return Cookies.set(name, value, expires)
}

export function getCookie(name) {
  return Cookies.get(name)
}

export function removeCookie(name) {
  return Cookies.remove(name)
}

export function setSessionStorage(name, value) {
	return window.sessionStorage.setItem(name, value)
}
export function getSessionStorage(name) {
	return window.sessionStorage.getItem(name)
}
export function removeSessionStorage(name) {
	return window.sessionStorage.removeItem(name)
}

export const uploadHaders = () => {
  return {
    'Authorization': getToken()
  }
};