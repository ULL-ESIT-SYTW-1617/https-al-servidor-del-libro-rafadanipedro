const pem = require('pem')

function createPrivateKey(options) {
  if (!options) options = {}
  options.keyBitsize = options.keyBitsize || '4096'
  options.ciphers = options.ciphers || 'aes256'

  return new Promise((res, rej) => {
    pem.createPrivateKey(options, (err, key) => {
      if (err) return rej(err)
      res(key)
    })
  })
}

function createCertificate(options) {
  if (!options) options = {}
  options.days = options.days || 1
  options.selfSigned = options.selfSigned || true
  options.country = options.country || 'ES'
  options.state = options.state || 'SC de Tenerife'
  options.locality = options.locality || 'La Laguna'
  options.organization = options.organization || 'rafadanipedro'
  options.commonName = options.commonName || 'rafadanipedro'

  return new Promise((res, rej) => {
    pem.createCertificate(options, (err, keys) => {
      if (err) return rej(err)
      res(keys)
    })
  })
}

module.exports = (keyConfig, certConfig) => {
  return createPrivateKey(keyConfig).then(({key}) => {
    certConfig.serviceKey = key
    return createCertificate(certConfig)
  })
}
