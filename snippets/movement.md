## Movement

### Install CLI

Install Aptos CLI:
<br>
[https://aptos.dev/tools/aptos-cli/install-cli/](https://aptos.dev/tools/aptos-cli/install-cli/)

### Console Account Operations

Use the Aptos CLI:
<br>
[https://aptos.dev/tools/aptos-cli/use-cli/use-aptos-cli](https://aptos.dev/tools/aptos-cli/use-cli/use-aptos-cli)

```bash
# init aptos acct
$ aptos init --network custom --rest-url https://aptos.testnet.porto.movementlabs.xyz/v1 --profile movement_acct_1
# init aptos acct without faucet
$ aptos init --profile testnet --skip-faucet
# get more faucet
$ aptos account fund-with-faucet --account [acct]
# by alias
$ aptos account fund-with-faucet --account default
# query balance
$ aptos account list --query balance --account default
# list resources
$ aptos account list --query resources --account default
# list package info
$ aptos move list --account 0x873580a421643181bbfe4fc34e85a4aadf951df045fd53a1f1b0663a495d8593 --url https://fullnode.testnet.aptoslabs.com
# list account
$ aptos account list
# list modules
$ aptos account list --query modules
# token transfer
$ aptos account transfer --account superuser --amount 100
```

### Console Module(Contract) Operations

interact with aptos modules.
<br>
[https://aptos.dev/tutorials/first-move-module](https://aptos.dev/tutorials/first-move-module)

```bash
# compile module
$ aptos move compile --named-addresses hello_blockchain=default
# deploy module
$ aptos move publish --named-addresses hello_blockchain=default
# interact with module
$ aptos move run --function-id 'default::message::set_message' --args 'string:hello, blockchain' --profile=testnet
# view function
aptos move view --function-id 0x873580a421643181bbfe4fc34e85a4aadf951df045fd53a1f1b0663a495d8593::hero::test_func --profile=testnet

```

### Scaffold-Movement

use scaffold-move to generate `dApp`.
<br>
[https://github.com/NonceGeek/scaffold-move](https://github.com/NonceGeek/scaffold-move)
<br>
[https://github.com/rootmud/scaffold-move-examples](https://github.com/NonceGeek/scaffold-move-examples)

```bash
# install
$ yarn
# modify the configuration
$ vim .env.local
# start with dev mode
$ yarn dev
# buidl
$ yarn build
```

### Awesome Movement projects!

//TODO

### Prompts 

the prompts for buidling smart contract & dApps.
