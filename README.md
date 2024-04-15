# Obsidian Bitcoin Block Stamp

Stamp your document with the Bitcoin block height and Moscow time. You can add the current stamp or the stamp for any time in the past up to the Genesis block.

## Usage

After you installed and enabled the plugin, you should see a Bitcoin icon in the ribbon bar.

- The ribbon icon opens a window which lets you add a stamp for any historical point in time or the current time. Make sure you are in the editor mode to be able to insert the stamp.
- Enter the date and time you wish the closest block height / Moscow time for.
- Select the stamp type "Block height" / "Moscow time" / "Moscow time @ block height".
- Click "Stamp" to insert the stamp at your current curser position.
- Likewise you can open this window via the command view `Ctrl + P` and searching for _"Bitcoin Block Stamp: Insert historical block stamp"_.
  - There you can also quick add the current "Block height", "Moscow time", or "Moscow time @ block height".

## Settings

In the plugin settings you can select a block explorer.

If you choose "None" the block height will be inserted as a simple text.

If you choose one of the three block explorers, the block height text will be inserted as a Markdown link linking to the block height's block in the selected block explorer.

## Installation

### In Obsidian

Go to `Settings > Community plugins > "Browse" community plugins`, and search for "Bitcoin Block Stamp".

Click "Install" and as soon as it's installed hit "Enable".

You should now see "Bitcoin Block Stamp" under "Community plugins" in your Settings view.

### Manually

Go to [Releases](https://github.com/sfr0xyz/obsidian-bitcoin-block-stamp/releases) and download the release files .

Head over to the plugins sections in your vault folder `VaultFolder/.obsidian/plugins/`.

Create a new folder called "obsidian-bitcoin-block-stamp" and copy and paste the the downloaded `main.js`, `styles.css`, and `manifest.json` files into it.

You should now have the files `main.js`, `styles.css`, and `manifest.json` in your vault at `VaultFolder/.obsidian/plugins/obsidian-bitcoin-block-stamp/`.

Then head into your Obsidian and enable the plugin under `Settings > Community plugins > Installed plugins > Toggle "Bitcoin Block Stamp"`.

## Support Me

You can support me with Bitcoin via the Lightning Network.

My Lightning Address:

```txt
sefiro@getably.com
```
