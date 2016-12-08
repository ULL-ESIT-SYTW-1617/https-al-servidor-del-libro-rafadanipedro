// TODO: devolver una promesa
  // Copiar el gitbook generado (los html) y...
  // Usar sftp-client (https://www.npmjs.com/package/ssh2-sftp-client) para:
  // * Borrar las cosas generadas antiguas en el Iaaas...
  // * Subir las cosas generadas local al remoto

import SftpClient from 'ssh2-sftp-client'
import path from 'path'
import upload from './upload'
import fs from 'fs'

//funcion que realiza el despliegue del libro en el servidor Iaas, subiendo los archivos generados y actualizando el servidor.
export default async function deploy (config) {

  const connectConfig = {
    host: config.host,
    port: '22',
    username: config.username,
    privateKey: fs.readFileSync(config.privateKey, {encoding: 'utf8'})
  }

  const localGHpages = path.resolve(process.cwd(), 'gh-pages')
  const remoteGHpages = path.resolve(config.directorioIaas, 'gh-pages')

  console.log(localGHpages)
  console.log(remoteGHpages)

  let sftp = new SftpClient()

  try {
    await sftp.connect(connectConfig)
    await sftp.rmdir(remoteGHpages, true)
    await upload(sftp, localGHpages, remoteGHpages)
    console.log('He terminado de subir el fichero')
    await sftp.end()
  } catch(err) {
    console.error('Hubo un error intentando subir los ficheros')
    console.error(err)
    await sftp.end()
    throw err
  }
}


