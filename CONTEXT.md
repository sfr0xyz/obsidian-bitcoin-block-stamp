# Context

## Stamp

A text value inserted into an Obsidian note. A stamp can contain a Bitcoin block height, Moscow time, or Moscow time at a block height.

## Block height

The Bitcoin block height closest to a requested timestamp. Current block height uses the current timestamp.

## Moscow time

The number of sats per fiat unit. This plugin currently calculates Moscow time as sats per USD using mempool.space price data.

## Block explorer

A configured external website used to turn a block height stamp into a Markdown link.

## Placeholder

A configured marker in a note that is replaced with a generated current stamp.

## Stamp source

The module interface that provides block and price data used to generate stamps. `MempoolSpaceApi` is the production adapter for this interface.
