import * as pluginIaas from '../src'



//Datos de prueba:

const configPruebas = require('../iaasserver/config.json')



async function testStart () {
  //let configPruebas = await pluginIaas.config()
  await pluginIaas.start(configPruebas)
}
/*
async function testDeploy () {
  //let configPruebas = await pluginIaas.config()
  //await pluginIaas.start(configPruebas)
  await pluginIaas.deploy(configPruebas)
}*/

testStart().catch(console.error)