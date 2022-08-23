# Token swap

My first solidity project, a playground.

It comes with:

- simple ERC721 and ERC20 contracts for minting
- an Offer smart contract (a token swap)
- tests
- deploy script

### Test setup

```
$ npx hardhat test
$ npx hardhat coverage
```

### Local node

If you want to deploy contracts locally and interact from the console , run:

```
$ npx hardhat node
$ npx hardhat run --network localhost scripts/deploy.ts
$ npx hardhat console
```
