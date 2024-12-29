# Scaffold-Move

 🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Move Chains. 
 
It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts. And...We are going to add AI Abilities for Move dApp Scaffold, to generate code automatically.

To `git checkout` for diff chains:

> git checkout main # Aptos
> 
> git checkout rooch # Rooch

See example that buidl based on Scaffold-Aptos(check the branches):

> Aptos:
> 
> https://github.com/rootmud/scaffold-move-examples

This project is referenced from:

> https://github.com/Amovane/aptos-NFT-marketplace

## Start Guide

1. `git clone https://github.com/rootMUD/scaffold-move.git`
2. `cd scaffold-move`
3. `yarn # Install the necessary front-end packages, pay attention to your local network environment`
4. Environment configuration, some global variables are in .env.local, which will be injected into the process started by yarn by default. Attention beginners, the testnet faucet url provided by aptos official website cannot be used directly.
5. `yarn dev`
6.`yarn build #compiled next.js application`

This project is maintained by [NonceGeek DAO](https://noncegeek.com/#/).
