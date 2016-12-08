import path from 'path'
import fs from 'fs'

export default async function upload (sftp, pathLocal, pathRemoto) {
  // Funcion que actualiza el servidor remoto con los archivos locales.
  // process.stdout.write(`${pathLocal} -> ${pathRemoto}`)
  process.stdout.write('.')

  if (fs.lstatSync(path.join(pathLocal)).isDirectory()) {
    //console.log(' Creando directorio...')
    await sftp.mkdir(pathRemoto)
    let files = fs.readdirSync(pathLocal)
    let promises = []
    for (let file of files) {
      promises.push(upload(sftp, path.join(pathLocal, file), path.join(pathRemoto, file)))
    }
    return Promise.all(promises)
  }

  return sftp.put(path.resolve(pathLocal), path.resolve(pathRemoto))
  console.log(' OK!')
}
