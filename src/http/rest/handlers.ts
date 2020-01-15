import express from 'express'
import * as data from '../../data/'

function runQuery(
  tbl: data.Table,
  query: { [key: string]: string },
): data.Table {
  let result = tbl

  if ('minYear' in query) {
    result = data.filter(result, 'year', '>=', data.toInt(query.minYear))
  }

  if ('maxYear' in query) {
    result = data.filter(result, 'year', '<=', data.toInt(query.maxYear))
  }

  if ('sortBy' in query) {
    query.sortBy.split(' ').forEach(param => {
      const [by, orderRaw] = param.split(':')
      const order = orderRaw ? orderRaw.toLowerCase() : undefined
      result = data.sortBy(result, by, order as 'asc' | 'desc' | undefined)
    })
  }

  return result
}

export function createHandlerIndex() {
  return (req: express.Request, res: express.Response): void => {
    res.send('Hello World!')
  }
}

export function createHandlerArrestsAll(s: data.Service) {
  return (req: express.Request, res: express.Response): void => {
    let tbl = s.getArrestsAll()
    tbl = runQuery(tbl, req.query)

    const dto = data.flatten(tbl)

    res.send(dto)
  }
}

export function createHandlerArrestsByOffenseClass(s: data.Service) {
  return (req: express.Request, res: express.Response): void => {
    let tbl = s.getArrestsByOffenseClass()
    tbl = runQuery(tbl, req.query)

    const dto = data.flatten(tbl)

    res.send(dto)
  }
}
