const Oracle = artifacts.require('Oracle')


module.exports = async deployer => {

  try {
    await deployer.deploy(Oracle)
    const oracle = await Oracle.deployed()
    console.log('oracle address: ', oracle.address)
    
  } catch(err) {
    console.log('deploy error: ', err)
    
  }
  
  
}