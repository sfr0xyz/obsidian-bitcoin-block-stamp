import { Editor } from 'obsidian';
import BbsPlugin from '../main';
import mempoolJS from '@mempool/mempool.js';

export default class Bbs {
	plugin: BbsPlugin
	editor: Editor

	constructor (plugin: BbsPlugin, editor: Editor) {
		this.plugin = plugin;
		this.editor = editor;
	}

	async insertCurrentBlockHeight () {
		const blockHeight = await this.getCurrentBlockHeight();
		this.insertBlockHeight(blockHeight);
	}

	async insertBlockHeightAtTimestamp (unixTimestamp: string) {
		const block = await this.getBlockFromTimestamp(unixTimestamp);
		this.insertBlockHeight(block.height, block.hash);
	}

	async insertBlockHeight (blockHeight: number, blockHash = '_EMPTY_') {	
		let blockHeightString: string;
	
		switch (this.plugin.settings.blockExplorer) {
			case 'mempool_space': {
				if (blockHash === '_EMPTY_') {
					blockHash = await this.getBlockHash(blockHeight);
				}
				blockHeightString = `[${blockHeight}](https://mempool.space/block/${blockHash})`;	
				break;
			}
			case 'blockstream_info': {
				blockHeightString = `[${blockHeight}](https://blockstream.info/block-height/${blockHeight})`;
				break;
			}
			case 'timechaincalendar_com': {
				blockHeightString = `[${blockHeight}](https://timechaincalendar.com/en/block/${blockHeight})`;
				break;
			}
			default: {
				blockHeightString = blockHeight.toString();
				break;
			}
		}
	
		this.editor.replaceSelection(blockHeightString);
	}
	
	async insertMoscowTime () {
		const moscowTime = await this.getCurrentMoscowTime();
	
		this.editor.replaceSelection(moscowTime.toString());
	}

	async getCurrentBlockHeight () {
		const { bitcoin: { blocks } } = mempoolJS({
			hostname: 'mempool.space',
			network: 'mainnet'
		});
	
		const blocksTipHeight = await blocks.getBlocksTipHeight();
	
		return blocksTipHeight;
	}
	
	async getCurrentPrices () {
		const result = await fetch('https://mempool.space/api/v1/prices');
	
		return result.json();
	}
	
	async getCurrentMoscowTime () {
		const price = await this.getCurrentPrices();
		const satsPerUSD = Math.round(100000000 / price.USD);
	
		return satsPerUSD;
	}
	
	async getBlockHash (blockHeight: number) {
		const { bitcoin: { blocks } } = mempoolJS({
			hostname: 'mempool.space',
			network: 'mainnet'
		});
	
		const blockHash = await blocks.getBlockHeight({ height: blockHeight });
	
		return blockHash;	
	}
	
	async getBlockFromTimestamp (unixTimestamp: string) {
		// `unixTimestamp` needs to be in UNIX format, e.g. 1712685519
		const result = await fetch(`https://mempool.space/api/v1/mining/blocks/timestamp/${unixTimestamp}`);
	
		return result.json();
	}
}

/** 
export async function noteBlockHeight () {
	const blockheight = await getCurrentBlockHeight();

	new Notice('Block Height: ' + blockheight);
}

export async function noteMoscowTime () {
	const moscowTime = await getCurrentMoscowTime();

	new Notice('Moscow Time: ' + moscowTime.toString());
}
*/
