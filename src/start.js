// Copiar el contenido del servidor de express y subirlo al Iaas.

import SftpClient from 'ssh2-sftp-client'
import path from 'path'
import fs from 'fs'
import SshClient from 'ssh-promise'
import upload from './upload'

export default async function start (config) {
  //Funcion que realiza un sftp para subir los archivos al servidor del iaas y además realiza una conexión ssh para dejar express abierto.
  let sftp = new SftpClient();

  let dirLocal = path.resolve(__dirname, '../iaasserver')

  const connectConfig = {
      host: config.host,
      port: '22',
      username: config.username,
      privateKey: fs.readFileSync(config.privateKey, {encoding: 'utf8'})
  }

  const serverConfig = JSON.stringify(config, undefined, 2)

  fs.writeFileSync(path.resolve(__dirname, '../iaasserver/config.json'), serverConfig)

  try {
    await sftp.connect(connectConfig)
    await upload(sftp, dirLocal, config.directorioIaas)
    console.log('He terminado de subir el fichero')
    await sftp.end()
  } catch(err) {
    console.error('Hubo un error intentando subir los ficheros')
    console.log(`Error al subir ${dirLocal}`)
    await sftp.end()
    throw err
  }

  try {
    const ssh = new SshClient(connectConfig);

    const commands = [
      `cd ${config.directorioIaas} && npm i && screen -d -m npm start` // screen -RR y nos reconectamos al servidor que se quedó abierto
    ]

    await ssh.exec(commands)

  } catch(err) {
    console.error('Hubo un errror!!')
    throw err
  }
}
