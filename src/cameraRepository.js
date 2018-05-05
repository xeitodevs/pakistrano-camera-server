'use strict'

const config = require('./../config')
const uuidGen = require('uuid/v4')
const sqlite = require('sqlite')
const { DuplicatedCameraException } = require('./DuplicatedCameraException')
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
    throw new CameraNotFoundException(name)
  }
  return result
}

async function saveCamera ({ name, host, user, password }) {

  try {
    const db = await connection
    const uuid = uuidGen()
    await db.run(`INSERT INTO ${cameraTable} (uuid, name, host, user, password, created_at) VALUES (?, ?, ?, ?, ?, ?)`, [uuid, name, host, user, password, new Date()])
    return uuid
  } catch (e) {
    if (e.errno === 19) {
      throw new DuplicatedCameraException(name)

    }
  }
}

async function deleteCamera (name) {
  const db = await connection
  const result = await db.run(`DELETE FROM ${cameraTable} WHERE name='${name}'`)
  if (result.changes !== 1) {
    throw new CameraNotFoundException(name)
  }
}

async function deleteCameras () {
  const db = await connection
  db.run(`DELETE FROM ${cameraTable}`)
}

module.exports = {
  getCameraListing,
  retrieveCamera,
  saveCamera,
  deleteCamera,
  deleteCameras
}