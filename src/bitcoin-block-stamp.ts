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

	async insertHistoricalBlockHeight (unixTimestamp: string) {
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

	async insertCurrentMoscowTime () {
		const BTCPrices = await this.getCurrentPrices();
		const BTCUSD = BTCPrices.USD;
		const moscowTime = this.moscowTime(BTCUSD);

		this.insertMoscowTime(moscowTime.toString());
	}

	async insertHistoricalMoscowTime (unixTimestamp: string) {
		const result = await this.getPriceAtTimestamp(unixTimestamp);
		const BTCUSD = result.prices[0].USD;
		const moscowTime = this.moscowTime(BTCUSD);

		this.insertMoscowTime(moscowTime.toString());
	}
	
	insertMoscowTime (moscowTime: string) {
		this.editor.replaceSelection(moscowTime);
	}

	async insertCurrentMoscowTimeAtBlockHeight () {
		const BTCPrices = await this.getCurrentPrices();
		const BTCUSD = BTCPrices.USD;
		const moscowTime = this.moscowTime(BTCUSD);

		const blockHeight = await this.getCurrentBlockHeight();

		this.insertMoscowTimeAtBlockHeight(moscowTime.toString(), blockHeight);
	}

	async insertHistoricalMoscowTimeAtBlockHeight (unixTimestamp: string) {
		const result = await this.getPriceAtTimestamp(unixTimestamp);
		const BTCUSD = result.prices[0].USD;
		const moscowTime = this.moscowTime(BTCUSD);

		const block = await this.getBlockFromTimestamp(unixTimestamp);

		this.insertMoscowTimeAtBlockHeight(moscowTime.toString(), block.height);
	}

	insertMoscowTimeAtBlockHeight (moscowTime: string, blockHeight: number) {
		this.editor.replaceSelection(`${moscowTime} @ ${blockHeight}`);
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

	async getPriceAtTimestamp (unixTimestamp: string, currency = 'USD') {
		// `unixTimestamp` needs to be in UNIX format, e.g. 1712685519
		const result = await fetch(`https://mempool.space/api/v1/historical-price?currency=${currency}&timestamp=${unixTimestamp}`);

		return result.json();
	}

	moscowTime (BTCUSD: number) {
		const BTCSATS = 100000000;
		const USDSATS = Math.round(BTCSATS / BTCUSD);
	
		return USDSATS;
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
