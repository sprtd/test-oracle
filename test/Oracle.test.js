
const Oracle = artifacts.require('Oracle')
const truffleAssert = require('truffle-assertions')
let  oracle,  deployer, addr1, addr2, addr3, addr4



contract('Oracle Contract', async payloadAccounts => {

  const TEST_ORACLE_COUNT = 8

  deployer = payloadAccounts[0]
  addr1 = payloadAccounts[1]
  addr2 = payloadAccounts[2]
  addr3 = payloadAccounts[3]
  addr4 = payloadAccounts[4]


  beforeEach(async() => {
    oracle = await Oracle.deployed()
  
    // let events = await oracle.allEvents()
    // console.log('events here', { events })

    // events.watch((err, result) => {
    //   if(result.event === 'LogOracleRequest') {
    //     console.log(`\n\nOracle Requested: index: ${result.args.index.toNumber()}, flight: ${result.args.flight}, timestamp: ${result.args.timestamp.toNumber()}`)
    //   } else {
    //     console.log(`\n\nFlight Status Available: flight: ${result.args.flight}, timestamp: ${result.args.timestamp()}, status: ${result.args.delayStatus}, verified: ${result.args.verified}`)
    //   }
    // })
    
  })
  

  contract('Oracle Registration', () => {
    it('Allows oracle registration ', async () => {    
      let registrationFee = await oracle.REGISTRATION_FEE.call()
        
      
        await oracle.registerOracle({from: addr2, value: registrationFee, gas:  6000000 })        
   
      
        const result = await oracle.getOracle(addr2)
       
        console.log('generated indexes here', result )     

        
        const oracleBal = await web3.eth.getBalance(oracle.address)
        console.log('oracle balance', oracleBal)
        
      
    })
    
    it('Can request flight status', async() => {
      let flight = 'Alpha Test'
      let timestamp = Math.floor(Date.now() / 1000)
      
      const flightStatus = await oracle.fetchFlightStatus(flight, timestamp)
      
      truffleAssert.eventEmitted(flightStatus, 'LogOracleRequest', (ev) => {
        console.log(`\n\nOracle Requested: index: ${ev.index.toNumber()}, flight: ${ev.flight}, timestamp: ${ev.timestamp.toNumber()}`)
      })

      
      
      for(let i = 1; i < TEST_ORACLE_COUNT; i++) {
        let oracleIndexes  = await oracle.getOracle(addr2)
        
        for(let idx = 0; idx < 3; idx++) {
          try {
            await oracle.submitOracleResponse(oracleIndexes[idx], flight, timestamp, 10, {from: addr2})            
          } catch(err) {
            console.log('error here', err)
          }
        }
      }
    })
  })

})