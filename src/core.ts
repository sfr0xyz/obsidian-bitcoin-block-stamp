import { Editor } from 'obsidian';
import BbsPlugin from '../main';
import mempoolJS from '@mempool/mempool.js';

export default class BbsCore {
	plugin: BbsPlugin
	editor: Editor

	constructor (plugin: BbsPlugin, editor: Editor) {
		this.plugin = plugin;
		this.editor = editor;
	}

	async insertBlockHeight (unixTimestamp?: string) {
		const blockParams = await this.getBlock(unixTimestamp);
		const blockHeightString = await this.blockHeightString(...blockParams);
		
		this.editor.replaceSelection(blockHeightString);
	}

	private async blockHeightString (blockHeight: number, blockHash?: string) {	
		let blockHeightString: string;
	
		switch (this.plugin.settings.blockExplorer) {
			case 'mempool_space': {
				if (typeof blockHash === 'undefined') {
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
	
		return blockHeightString;
	}

	async insertMoscowTime (unixTimestamp?: string) {
		const BTCUSD = await this.getBitcoinPrice(unixTimestamp);
		const moscowTimeString = this.moscowTimeString(BTCUSD);

		this.editor.replaceSelection(moscowTimeString);
	}

	private moscowTime (BTCUSD: number) {
		const BTCSATS = 100000000;
		const USDSATS = Math.round(BTCSATS / BTCUSD);
	
		return USDSATS;
	}

	private moscowTimeString (BTCUSD: number) {
		const moscowTime = this.moscowTime(BTCUSD);
		return moscowTime.toString();
	}

	async insertMoscowTimeAtBlockHeight (unixTimestamp?: string) {
		const BTCUSD = await this.getBitcoinPrice(unixTimestamp);
		const blockParams = await this.getBlock(unixTimestamp);
		
		const moscowTimeString = this.moscowTimeString(BTCUSD);

		const blockHeightString = await this.blockHeightString(...blockParams);

		this.editor.replaceSelection(`${moscowTimeString} @ ${blockHeightString}`);
	}
	
	private async getBitcoinPrice (unixTimestamp?: string, currency = 'USD') {
		let btcPrice: number;
		if (typeof unixTimestamp !== 'undefined') {
			const response = await fetch(`https://mempool.space/api/v1/historical-price?currency=${currency}&timestamp=${unixTimestamp}`);
			const json = await response.json();
			btcPrice = await json.prices[0][currency];
		} else {
			const response = await fetch('https://mempool.space/api/v1/prices');
			const json = await response.json();
			btcPrice = await json[currency];
		}

		return btcPrice;
	}
	
	private async getBlock (unixTimestamp?: string) {
		let blockParams: [height: number, hash?: string];

		if (typeof unixTimestamp !== 'undefined') {
			const response = await fetch(`https://mempool.space/api/v1/mining/blocks/timestamp/${unixTimestamp}`);
			const json = await response.json();
			blockParams = [json.height, json.hash];
		} else {
			const { bitcoin: { blocks } } = mempoolJS({hostname: 'mempool.space', network: 'mainnet'});
			const blocksTipHeight = await blocks.getBlocksTipHeight();
			blockParams = [blocksTipHeight];
		}

		return blockParams;
	}

	private async getBlockHash (blockHeight: number) {
		const { bitcoin: { blocks } } = mempoolJS({hostname: 'mempool.space', network: 'mainnet'});
		const blockHash = await blocks.getBlockHeight({ height: blockHeight });
	
		return blockHash;
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
