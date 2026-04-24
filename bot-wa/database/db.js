import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import config from '../config.js'

const dbPath = config.databasePath

// Default data structures
const defaults = {
  store: {
    products: [],
    payment: [],
    jeda: false,
    doneTemplate: '',
    prosesTemplate: '',
  },
  users: {},
  groups: {},
  bot: {
    name: config.botName,
    storeName: config.storeName,
    info: '',
    sewa: [],
  },
  wording: {
    list: '',
    list2: '',
    list3: '',
    formatKeys: {},
  },
}

/**
 * Baca database JSON
 */
export function loadDB(name) {
  const filePath = join(dbPath, `${name}.json`)
  try {
    if (!existsSync(filePath)) {
      const defaultData = defaults[name] || {}
      saveDB(name, defaultData)
      return defaultData
    }
    const raw = readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error(`[DB] Error loading ${name}:`, err.message)
    return defaults[name] || {}
  }
}

/**
 * Simpan database JSON
 */
export function saveDB(name, data) {
  const filePath = join(dbPath, `${name}.json`)
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error(`[DB] Error saving ${name}:`, err.message)
  }
}

/**
 * Get store data
 */
export function getStore() {
  return loadDB('store')
}

/**
 * Save store data
 */
export function setStore(data) {
  saveDB('store', data)
}

/**
 * Get user data
 */
export function getUsers() {
  return loadDB('users')
}

/**
 * Save user data
 */
export function setUsers(data) {
  saveDB('users', data)
}

/**
 * Get/set user role
 */
export function getUserRole(jid) {
  const users = getUsers()
  return users[jid]?.role || 'user'
}

export function setUserRole(jid, role) {
  const users = getUsers()
  if (!users[jid]) users[jid] = {}
  users[jid].role = role
  setUsers(users)
}

/**
 * Get group data
 */
export function getGroup(groupId) {
  const groups = loadDB('groups')
  if (!groups[groupId]) {
    groups[groupId] = {
      welcome: false,
      goodbye: false,
      welcomeMsg: '',
      welcomeTitle: '',
      welcomeBody: '',
      leftMsg: '',
      leftTitle: '',
      leftBody: '',
      antilink: false,
      antilink2: false,
      antiwame: false,
      antiwame2: false,
      openMsg: '',
      closeMsg: '',
      sewa: null,
    }
    saveDB('groups', groups)
  }
  return groups[groupId]
}

/**
 * Save group data
 */
export function setGroup(groupId, data) {
  const groups = loadDB('groups')
  groups[groupId] = { ...groups[groupId], ...data }
  saveDB('groups', groups)
}

/**
 * Get bot data
 */
export function getBot() {
  return loadDB('bot')
}

/**
 * Save bot data
 */
export function setBot(data) {
  saveDB('bot', data)
}

/**
 * Get wording data
 */
export function getWording() {
  return loadDB('wording')
}

/**
 * Save wording data
 */
export function setWording(data) {
  saveDB('wording', data)
}
