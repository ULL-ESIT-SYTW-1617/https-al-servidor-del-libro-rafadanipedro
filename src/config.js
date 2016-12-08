import inquirer from 'inquirer'
import path from 'path'
import fs from 'fs'

const questions = [
  {
    type: 'input',
    name: 'username',
    message: 'Cual es tu username del Iaas'
  },
  {
    type: 'input',
    name: 'privateKey',
    default: '~/.ssh/id_rsa',
    message: 'Cual es la ruta de tu clave privada',
    filter: async (ruta) => {
      if (ruta[0] === '~') ruta = `${process.env.HOME}${ruta.substr(1)}`
      try {
        fs.accessSync(path.resolve(ruta))
        return ruta
      } catch(err) {
        throw err.message
      }
    }
  },
  {
    type: 'input',
    name: 'directorioIaas',
    message: 'Cual es el directorio del Iaas',
    validate: ruta => {
      if(ruta.match(/^(\/.+?)+$/)) return true
      return 'Introduce una ruta absoluta hasta el directorio, ejemplo: /home/usuario/servidorGitbook'
    }
  },
  {
    type: 'input',
    name: 'host',
    message: 'Cual es tu direccion ip'
  },
  {
    type: 'checkbox',
    name: 'tipoAutenticacion',
    message: '¿De que manera quieres autenticarte?',
    choices: ['Github','Local','BaseDatos']
  }
]

const emailRegex = /\w+@\w+?\.[a-zA-Z]{2,8}/g

const authQuestions = {
  Github: [
    {
      type: 'input',
      name: 'creaApp',
      message: 'Entre en esta direccion para crear una OauthApplication en Github https://github.com/settings/developers y escribe "confirmar" para continuar',
      validate: conf => conf === 'confirmar'
    },
    {
      type: 'input',
      name: 'clientID',
      message: 'Cual es el clientID',
      validate: ruta => {
        if(ruta.match(/^[0-9A-F]+$/i)) return true
        return 'El clientID no tiene un formato correcto, revisalo'
      }
    },
    {
      type: 'input',
      name: 'clientSecret',
      message: 'Cual es el clientSecret',
      validate: ruta => {
        if(ruta.match(/^[0-9A-F]+$/i)) return true
        return 'El clientSecret no tiene un formato correcto, revísalo'
      }
    },
    {
      type: 'input',
      name: 'organizacion',
      message: 'Cual es la organizacion a la que perteneces',
      default: 'ULL-ESIT-GRADOII-DSI'
    }
  ],
  Local: [
    {
      type: 'input',
      name: 'lectores',
      message: 'Escribe los correos separados por comas',
      default: 'alguien@algo.com, otro@algo.com',
      filter: async (email) => {
        let res = email.match(emailRegex)
        if (res) return res
        throw 'Email no valido'
      }
    },
    {
      type: 'input',
      name: 'tokenDropbox',
      message: 'Entre en esta direccion para crear una OauthApplication enDropbox https://www.dropbox.com/developers/apps y escribe "confirmar" para continuar',
      validate: conf => conf === 'confirmar'
    },
    {
      type: 'input',
      name: 'token',
      message: 'Cual es el token generado'
    }
  ],
  BaseDatos:
    {
      type: 'input',
      name: 'lectores',
      message: 'Escribe los correos separados por comas',
      default: 'alguien@algo.com, otro@algo.com',
      filter: async (email) => {
        let res = email.match(emailRegex)
        if (res) return res
        throw 'Email no valido'
      }
    }
}

export default async function config () {
  let cfg = await inquirer.prompt(questions)
  if (cfg.privateKey[0] === '~') cfg.privateKey = `${process.env.HOME}${cfg.privateKey.substr(1)}`

  for(let auth of cfg.tipoAutenticacion) {
    let newCfg = await inquirer.prompt(authQuestions[auth])
    cfg[auth] = newCfg
  }

  return cfg
}