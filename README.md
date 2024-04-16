# Bitcoin Block Stamp for Obsidian

![Version](https://img.shields.io/github/manifest-json/v/sfr0xyz/obsidian-bitcoin-block-stamp?style=flat-square) ![License](https://img.shields.io/github/license/sfr0xyz/obsidian-bitcoin-block-stamp?style=flat-square)

Stamp your notes with the Bitcoin block height and Moscow time. You can add the current stamp or the stamp for any time in the past up to the Genesis block.

<div align="center">
  <img src="./docs/bbs-demo.png" alt="BBS Demo" width="90%">
</div>

## Features

- Insert the current or historical _block height_.
- Insert the current or historical [_Moscow time_](https://thebitcoinmanual.com/btc-culture/glossary/moscow-time/).
- Insert the current or historical _Moscow time @ block height_, the [Moscow Time Bot](https://njump.me/npub1030jfcwftah37a242jv0qqvmuyje5ew8tt59rs3477c4e8ugurhqzdwcta) format.
- Add a link to your preferred block explorer for the block height.

## Usage

After you successfully [installed and enabled](#installation) the plugin, you should see a Bitcoin icon in the sidebar.

- The icon opens a window which lets you add a stamp for any historical point in time or the current time. Make sure you are in the editor mode to be able to insert the stamp.
  - Enter the date and time you wish the closest block height or Moscow time for.
  - Choose the stamp type.
  - Select **Stamp** to insert the stamp at your current curser position.
- Likewise you can open this window via the command view `Ctrl + P`. Search for "Bitcoin Block Stamp: Insert historical block stamp".
- In the command view `Ctrl + P` you can also quick add the current _Block height_ / _Moscow time_ / _Moscow time @ block height_. Search for "Bitcoin Block Stamp".

## Settings

- **Block explorer**: You can choose your preferred block explorer. The block height stamp will be inserted as a Markdown link to corresponding block in the selected block explorer.

## Third-party sources

The plugin uses the [mempool.space REST API](https://mempool.space/docs/api/rest) to get the Bitcoin blockchain data and the Bitcoin price data.

## Installation

### In Obsidian

Go to `Settings > Community plugins > "Browse" community plugins`, and search for "Bitcoin Block Stamp".

Select **Install** and after successful installation select **Enable**.

You should now see "Bitcoin Block Stamp" under "Community plugins" in your Settings view.

### Manually

Download the release files from the [latest release](https://github.com/sfr0xyz/obsidian-bitcoin-block-stamp/releases/latest).

Go to the plugins section in your vault folder `VaultFolder/.obsidian/plugins/`.

Create a new folder called "bitcoin-block-stamp" and copy and paste the the downloaded `main.js`, `styles.css`, and `manifest.json` files into it.

You should now have the files `main.js`, `styles.css`, and `manifest.json` in your vault at `VaultFolder/.obsidian/plugins/bitcoin-block-stamp/`.

Go to your Obsidian vault and enable the plugin by toggling "Bitcoin Block Stamp" under `Settings > Community plugins > Installed plugins`.

## Support me

If you like this plugin and want to support me, you can send me some sats via the Bitcoin Lightning Network. Visit my [Alby page](https://getalby.com/p/sefiro).

Lightning Address:

```txtNote: To allow specific HTML elements, use the allowed_elements parameter.
sefiro@getalby.com
```

I appreciate your support, thank you!

---

<div align="center">
Find me on nostr <a href="https://njump.me/npub19a6x8frkkn2660fw0flz74a7qg8c2jxk5v9p2rsh7tv5e6ftsq3sav63vp">@sefiro</a>
</div>
