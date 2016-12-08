const Dropbox = require('dropbox')
const path = '/db.json'

let dbx
let db = {}

function getDB () {
  return new Promise((res, rej) => {
    dbx.filesDownload({ path }).then(data => {
      db = JSON.parse(data.fileBinary)
      res(db)
    }).catch(rej)
  })
}

function uploadDB (data = {}) {
  return new Promise((res, rej) => {
    dbx.filesUpload({contents: JSON.stringify(db, undefined, 2), path, mode: {".tag": "overwrite"}}).then(() => {
      res('Done')
    }).catch(rej)
  })
}

function connect(token) {
  return new Promise((res, rej) => {
    try {
      dbx = new Dropbox({ accessToken: token })
    } catch(err) {
      return rej(err)
    }
    getDB().then(data => {
      res('Conectado a la BBDD!')
    }).catch(() => {
      uploadDB().then(() => {
        res('Conectado a la BBDD!')
      }).catch(rej)
    })
  })
}

class Schema {
  constructor (params, modelName) {
    this.modelName = modelName
    this.params = params
    this.id = parseInt(Math.random()*10000000000000000)
  }

  save () {
    if (!db[this.modelName]) db[this.modelName] = []
    let collection = db[this.modelName]
    let doc = collection.find(doc => doc.id === this.id)
    if (!doc) {
      collection.push({content: this.params, id: this.id})
    } else {
      doc.content = this.params
    }
    return uploadDB(db)
  }
}

function findByIdRaw (modelName, id) {
  return new Promise((res, rej) => {
    getDB().then(db => {
      if(!db[modelName]) db[modelName] = []
      res(db[modelName].find(doc => doc.id === id))
    }).catch(rej)
  })
}

function findRaw (modelName, params = {}) {
  return new Promise((res, rej) => {
    getDB().then(db => {
      if(!db[modelName]) db[modelName] = []

      let docs = []

      for (let doc of db[modelName]) {
        let ok = true
        for (let key of Object.keys(params)) {
          if (doc.content[key] !== params[key]) {
            ok = false
            break
          }
        }
        if (ok) {
          docs.push(doc)
        }
      }

      res(docs)
    }).catch(rej)
  })
}

function findOneRaw (modelName, params = {}) {
  return new Promise((res, rej) => {
    findRaw(modelName, params).then(docs => {
      if(!docs.length) return res(null)
      return res(docs[0])
    }).catch(rej)
  })
}

function findOneUpdateRaw (modelName, Child, params, mod) {
  return new Promise((res, rej) => {
    findOneRaw(modelName, params).then(doc => {
      if(doc) {
        for (let key of Object.keys(mod)) {
          doc.content[key] = mod[key]
        }
        let child = new Child(doc.content)
        child.id = doc.id
        return child.save().then(res).catch(rej)
      }
      return res(doc)
    }).catch(rej)
  })
}

module.exports = {
  connect,
  Schema,
  findByIdRaw,
  findRaw,
  findOneRaw,
  findOneUpdateRaw
}

/*
Ejemplo de dropbosee!!

dropbosee.connect('gcIDmUe91mMAAAAAAAA9BNTsNxfaUGZ_gr_GrmjNKUT-mHiQ8NqSoYbcb_iJQXyf').then(() => {
  console.log('Conectado con la base de datos!!')

  let users = [
    new User({email: 'rafa@rafa.com', password: '1234'}),
    new User({email: 'daniel@daniel.com', password: 'patata'}),
    new User({email: 'pedro@pedro.com', password: 'yoloo'})
  ]

  let proms = users.map(user => user.save())

  Promise.all(proms).then(() => console.log('Hecho!'))
})*/