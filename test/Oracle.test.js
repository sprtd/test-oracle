
const Oracle = artifacts.require('Oracle')
// const truffleAssert = require('truffle-assertions')
let  oracle,  deployer, addr1, addr2, addr3, addr4



contract('Oracle Contract', async payloadAccounts => {

  const TEST_ORACLE_COUNT = 5

  deployer = payloadAccounts[0]
  addr1 = payloadAccounts[1]
  addr2 = payloadAccounts[2]
  addr3 = payloadAccounts[3]
  addr4 = payloadAccounts[4]


  beforeEach(async() => {
    oracle = await Oracle.deployed()
 
  })


  contract('Oracle Registration', () => {
    it('Allows oracle to register ', async () => {    
      let registrationFee = await oracle.REGISTRATION_FEE.call()
        
      for(i=1; i<TEST_ORACLE_COUNT; i++) {
        // await oracle.registerOracle({from: from, value: value })        
        await oracle.registerOracle({from: addr1, value: registrationFee, gas:  3000000 })        
        const result = await oracle.getOracle(addr1) 
        console.log('status here', result )     

        const oracleBal = await web3.eth.getBalance(oracle.address)
        console.log('oracle balance', oracleBal)
        
      }
    })
  })

})