import { Editor, Notice, requestUrl } from 'obsidian';
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
		try {
			const blockParams = await this.getBlockHeight(unixTimestamp);
			const blockHeightString = await this.blockHeightString(...blockParams);
			
			this.editor.replaceSelection(blockHeightString);
		} catch (error) {
			new Notice(`An error occurred:\n${error.message}`);
		}
	}

	async insertMoscowTime (unixTimestamp?: string) {
		try {
			const BTCUSD = await this.getBitcoinPrice(unixTimestamp);
			const moscowTimeString = this.moscowTimeString(BTCUSD);

			this.editor.replaceSelection(moscowTimeString);
		} catch (error) {
			new Notice(`An error occurred:\n${error.message}`);
		}
	}

	async insertMoscowTimeAtBlockHeight (unixTimestamp?: string) {
		try {
			const BTCUSD = await this.getBitcoinPrice(unixTimestamp);
			const blockParams = await this.getBlockHeight(unixTimestamp);
			
			const moscowTimeString = this.moscowTimeString(BTCUSD);
			const blockHeightString = await this.blockHeightString(...blockParams);

			this.editor.replaceSelection(`${moscowTimeString} @ ${blockHeightString}`);
		} catch (error) {
			new Notice(`An error occurred:\n${error.message}`);
		}
	}

	private async blockHeightString (blockHeight: number, blockHash?: string) {	
		type sepOptions = { [key: string]: string }
		const separator: sepOptions = {
			plain: '',
			comma: ',',
			period: '.',
			space: ' ',
			underscore: '_',
			apostrophe: '\''
		}

		const blockHeightFormat: string = separator[this.plugin.settings.blockHeightFormat]

		const formattedBlockHeight: string = blockHeight.toLocaleString('en-US')
			.replace(/,/g, blockHeightFormat);

		let blockHeightString: string;
		switch (this.plugin.settings.blockExplorer) {
			case 'mempool_space': {
				if (typeof blockHash === 'undefined') {
					blockHash = await this.getBlockHash(blockHeight);
				}
				blockHeightString = `[${formattedBlockHeight}](https://mempool.space/block/${blockHash})`;	
				break;
			}
			case 'blockstream_info': {
				blockHeightString = `[${formattedBlockHeight}](https://blockstream.info/block-height/${blockHeight})`;
				break;
			}
			case 'timechaincalendar_com': {
				blockHeightString = `[${formattedBlockHeight}](https://timechaincalendar.com/en/block/${blockHeight})`;
				break;
			}
			default: {
				blockHeightString = formattedBlockHeight;
				break;
			}
		}
	
		return blockHeightString;
	}

	private moscowTime (BTCUSD: number) {
		const BTCSATS = 100000000;
		const USDSATS = Math.round(BTCSATS / BTCUSD);
	
		return USDSATS;
	}

	private moscowTimeString (BTCUSD: number) {
		const moscowTime: number = this.moscowTime(BTCUSD);

		type sepOptions = { [key: string]: string }
		const separator: sepOptions = {
			plain: '',
			colon: ':',
			period: '.',
		}

		const moscowTimeFormat: string = separator[this.plugin.settings.moscowTimeFormat];

		const moscowTimeString: string = moscowTime.toString()
			.padStart((moscowTimeFormat === '') ? 0 : 4, '0')
			.split('').reverse().join('')
			.split(/(\d{2})/g)
			.filter(v => v !== '')
			.reverse().join(moscowTimeFormat);

		return moscowTimeString;
	}
	
	private async getBitcoinPrice (unixTimestamp?: string, currency = 'USD') {
		let btcPrice: number;

		if (typeof unixTimestamp !== 'undefined') {
			if (!isValidUnixTimestamp(unixTimestamp)[0]) { throw new Error(`Invalid timestamp: ${unixTimestamp}`) }

			const response = await requestUrl(`https://mempool.space/api/v1/historical-price?currency=${currency}&timestamp=${unixTimestamp}`);
			const json = await response.json;

			btcPrice = await json.prices[0][currency];
		} else {
			const response = await requestUrl('https://mempool.space/api/v1/prices');
			const json = await response.json;

			btcPrice = await json[currency];
		}

		return btcPrice;
	}
	
	private async getBlockHeight (unixTimestamp?: string) {
		let blockParams: [height: number, hash?: string];

		if (typeof unixTimestamp !== 'undefined') {
			if (!isValidUnixTimestamp(unixTimestamp)[0]) { throw new Error(`Invalid timestamp: ${unixTimestamp}`) }

			const response = await requestUrl(`https://mempool.space/api/v1/mining/blocks/timestamp/${unixTimestamp}`);			
			const json = await response.json;

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

function isValidUnixTimestamp (unixTimestamp: string) {
	const genesisBlockTimestamp = '1231006505';
	let isValid = true;
	let problemMessage = '';
	if (unixTimestamp.length !== 10) {
		problemMessage = 'Invalid date';
		isValid = false;
	}
	if (unixTimestamp < genesisBlockTimestamp) {
		problemMessage = 'Date lies before Genesis block';
		isValid = false;
	}
	return [isValid, problemMessage];
}
