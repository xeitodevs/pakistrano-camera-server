'use strict'

const config = require('./../config')
const uuidGen = require('uuid/v4')
const sqlite = require('sqlite')
const { CameraNotFoundException } = require('./CameraNotFoundException')
const connection = sqlite.open(config.database, { Promise })
const cameraTable = 'camera'

async function getCameraListing () {
  const db = await connection
  return db.all(`SELECT uuid, name, host, user, password, created_at AS createdAt, updated_at AS updatedAt FROM ${cameraTable}`)
}

async function retrieveCamera (name) {
  const db = await connection
  const result = await db.get(`SELECT uuid, name, host, user, password, created_at AS createdAt, updated_at AS updatedAt FROM ${cameraTable} WHERE name=?`, [name])
  if (!result) {
    throw new CameraNotFoundException()
  }
  return result
}

async function saveCamera ({ name, host, user, password }) {
  const db = await connection
  const uuid = uuidGen()
  await db.run(`INSERT INTO ${cameraTable} (uuid, name, host, user, password, created_at) VALUES (?, ?, ?, ?, ?, ?)`, [uuid, name, host, user, password, new Date()])
  return uuid
}

async function deleteCameras () {
  const db = await connection
  db.run(`DELETE FROM ${cameraTable}`)
}

module.exports = {
  getCameraListing,
  retrieveCamera,
  saveCamera,
  deleteCameras
}