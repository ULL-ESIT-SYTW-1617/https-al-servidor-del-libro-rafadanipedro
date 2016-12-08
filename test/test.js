import * as pluginIaas from '../src'



//Datos de prueba:

async function testStart () {
  let configPruebas = await pluginIaas.config()
  console.log(JSON.stringify(configPruebas, null, 2))
  await pluginIaas.start(configPruebas)
}
/*
async function testDeploy () {
  //let configPruebas = await pluginIaas.config()
  //await pluginIaas.start(configPruebas)
  await pluginIaas.deploy(configPruebas)
}*/

testStart().catch(console.error)