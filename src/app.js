App = {
  loading: false,
  contracts:{},
  load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
  },

  loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },

  loadAccount: async() => {
      App.account =web3.eth.accounts[0]
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const timeLock = await $.getJSON('TimeLock.json')
    App.contracts.TimeLock = TruffleContract(timeLock)
    App.contracts.TimeLock.setProvider(App.web3Provider)

    App.timeLock = await App.contracts.TimeLock.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },
  
  generatePublicKey: async () => {
    App.setLoading(true)
    const content=$('#newSeed').val()
    await App.timeLock.generatePublicKey(content)
    window.location.reload()
  },

  testPrivateKey: async () => {
    App.setLoading(true)
    const content=$('#testPrivateKey').val()
    console.log(content);
    await App.timeLock.testPrivateKey(content)
    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },

  renderTasks: async () => {
    // Load from the blockchain
    const publicKey = await App.timeLock.publicKey()
    const publicKeyNumber = publicKey.toNumber()

    const privateKey = await App.timeLock.privateKey()
    const privateKeyNumber = privateKey.toNumber()

    const $pubKeyTemplate = $('.KeyTemplate')
    const $newpubKeyTemplate = $pubKeyTemplate.clone()
    $newpubKeyTemplate.find('.publicKeyContent').html(publicKeyNumber)
    
    $('#publicKeyList').append($newpubKeyTemplate)

    const $newprivKeyTemplate = $pubKeyTemplate.clone()
    $newprivKeyTemplate.find('.publicKeyContent').html(privateKeyNumber)
    
    $('#privateKeyList').append($newprivKeyTemplate)
    
    $newpubKeyTemplate.show()
    $newprivKeyTemplate.show()


  },    
}
$(() => {
    $(window).load(() => {
        App.load()
    })

})