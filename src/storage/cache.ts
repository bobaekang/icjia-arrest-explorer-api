import sqlite3 from 'sqlite3'
import * as data from './../data'

type Storage = {
  getTable: (tableName: string) => data.Table
}

export async function fetchFromDB(
  db: sqlite3.Database,
  tableName: string,
): Promise<data.Table> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(`SELECT * FROM "${tableName}"`, (err: Error, tbl) => {
        if (err) reject(err)
        else resolve(tbl)
      })
    })
  })
}

async function fetchTables(
  db: sqlite3.Database,
): Promise<{ [key: string]: data.Table }> {
  return {
    arrests: await fetchFromDB(db, 'Arrests'),
    arrestsByOffenseClass: await fetchFromDB(db, 'ArrestsByOffenseClass'),
  }
}

export async function NewStorage(pathDB: string): Promise<Storage> {
  const sqlite3 = require('sqlite3').verbose()
  const db = new sqlite3.Database(pathDB)

  const tables = await fetchTables(db)

  db.close()

  return {
    getTable: (tableName: string): data.Table => tables[tableName],
  }
}
