import { Editor, Notice, requestUrl, moment, TFile } from 'obsidian';
import BbsPlugin from 'main';

export default class BbsCore {
	plugin: BbsPlugin
	editor: Editor

	constructor (plugin: BbsPlugin, editor?: Editor) {
		this.plugin = plugin;
		if (editor) { this.editor = editor; }
	}

	async insertBlockHeight (unixTimestamp?: string, blockHeightFormat: string = this.plugin.settings.blockHeightFormat) {
		try {
			const blockParams: [number, string] = await this.getBlockHeight(unixTimestamp);
			const blockHeightString: string = await this.blockHeightString(blockParams[0], blockParams[1], blockHeightFormat);
			
			this.editor.replaceSelection(blockHeightString);
		} catch (error) {
			new Notice(`An error occurred:\n${error.message}`);
			console.log(error.message);
		}
	}

	async insertMoscowTime (unixTimestamp?: string, moscowTimeFormat: string = this.plugin.settings.moscowTimeFormat) {
		try {
			const BTCUSD: number = await this.getBitcoinPrice(unixTimestamp);
			const moscowTimeString: string = this.moscowTimeString(BTCUSD, moscowTimeFormat);

			this.editor.replaceSelection(moscowTimeString);
		} catch (error) {
			new Notice(`An error occurred:\n${error.message}`);
			console.log(error.message);
		}
	}

	async insertMoscowTimeAtBlockHeight (unixTimestamp?: string, moscowTimeFormat: string = this.plugin.settings.moscowTimeFormat, blockHeightFormat: string = this.plugin.settings.blockHeightFormat) {
		try {
			const BTCUSD: number = await this.getBitcoinPrice(unixTimestamp);
			const blockParams: [number, string] = await this.getBlockHeight(unixTimestamp);
			
			const moscowTimeString:string = this.moscowTimeString(BTCUSD,moscowTimeFormat);
			const blockHeightString: string = await this.blockHeightString(blockParams[0], blockParams[1], blockHeightFormat);

			this.editor.replaceSelection(`${moscowTimeString} @ ${blockHeightString}`);
		} catch (error) {
			new Notice(`An error occurred:\n${error.message}`);
			console.log(error.message);
		}
	}

	async replacePlaceholders (file: TFile) {
		const { vault } = this.plugin.app;
		console.log('vault', vault);
		console.log('file', file);

		const fileContent = await vault.read(file);
		const newFileContent = fileContent
			.replace(/{{blockheight}}/g, '000000')
			.replace(/{{moscowtime}}/g, '2121')
			.replace(/{{mt@bh}}/g, '2121 @ 000000')


		vault.modify(file, newFileContent);
	}

	private async blockHeightString (blockHeight: number, blockHash: string, blockHeightFormat: string = this.plugin.settings.blockHeightFormat) {	
		type sepOptions = { [key: string]: string }
		const separator: sepOptions = {
			plain: '',
			comma: ',',
			period: '.',
			space: ' ',
			underscore: '_',
			apostrophe: '\''
		}

		blockHeightFormat = separator[blockHeightFormat]

		const formattedBlockHeight: string = blockHeight.toLocaleString('en-US')
			.replace(/,/g, blockHeightFormat);

		let blockHeightString: string;
		switch (this.plugin.settings.blockExplorer) {
			case 'mempool_space': {
				if (!blockHash) { blockHash = await this.getBlockHash(blockHeight); }
				
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
		const USDSATS: number = Math.round(BTCSATS / BTCUSD);
	
		return USDSATS;
	}

	private moscowTimeString (BTCUSD: number, moscowTimeFormat: string = this.plugin.settings.moscowTimeFormat) {
		const moscowTime: number = this.moscowTime(BTCUSD);

		type sepOptions = { [key: string]: string }
		const separator: sepOptions = {
			plain: '',
			colon: ':',
			period: '.',
		}

		moscowTimeFormat = separator[moscowTimeFormat];

		const moscowTimeString: string = moscowTime.toString()
			.padStart((moscowTimeFormat === '') ? 0 : 4, '0')
			.split('').reverse().join('')
			.split(/(\d{2})/g)
			.filter(v => v !== '')
			.join(moscowTimeFormat)
			.split('').reverse().join('');

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
		let blockParams: [height: number, hash: string];

		if (typeof unixTimestamp !== 'undefined') {
			if (!isValidUnixTimestamp(unixTimestamp)[0]) { throw new Error(`Invalid timestamp: ${unixTimestamp}`) }

			const response = await requestUrl(`https://mempool.space/api/v1/mining/blocks/timestamp/${unixTimestamp}`);			
			const json = await response.json;

			blockParams = [json.height, json.hash];
		} else {
			const response = await requestUrl('https://mempool.space/api/blocks/tip/height');
			const json = await response.json;

			blockParams = [json, ''];
		}

		return blockParams;
	}

	private async getBlockHash (blockHeight: number) {
		//const response = await requestUrl(`https://mempool.space/api/block-height/${blockHeight}`);
		//const json = await response.json;
		const response = await requestUrl(`https://mempool.space/api/v1/mining/blocks/timestamp/${moment().format('X')}`);			
		const json = await response.json;

		return json.hash;
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
