import { Notice, Editor } from 'obsidian';
import mempoolJS from '@mempool/mempool.js';

export async function insertBlockHeight (editor: Editor, blockExplorer: string) {
	const blockHeight = await getCurrentBlockHeight();

	let blockHeightString = blockHeight.toString();

	switch (blockExplorer) {
		case 'mempool_space': {
			const blockHash = await getBlockHash(blockHeight);
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

	editor.replaceSelection(blockHeightString);
}

export async function insertMoscowTime (editor: Editor) {
	const moscowTime = await getCurrentMoscowTime();

	editor.replaceSelection(moscowTime.toString());
}

export async function noteBlockHeight () {
	const blockheight = await getCurrentBlockHeight();

	new Notice('Block Height: ' + blockheight);
}

export async function noteMoscowTime () {
	const moscowTime = await getCurrentMoscowTime();

	new Notice('Moscow Time: ' + moscowTime.toString());
}

async function getCurrentBlockHeight () {
	const { bitcoin: { blocks } } = mempoolJS({
		hostname: 'mempool.space',
		network: 'mainnet'
	});

	const blocksTipHeight = await blocks.getBlocksTipHeight();

	return blocksTipHeight;
}

async function getCurrentPrices () {
	const result = await fetch('https://mempool.space/api/v1/prices');

	return result.json();
}

async function getCurrentMoscowTime () {
	const price = await getCurrentPrices();
	const satsPerUSD = Math.round(100000000 / price.USD);

	return satsPerUSD;
}

async function getBlockHash (blockHeight: number) {
	const { bitcoin: { blocks } } = mempoolJS({
		hostname: 'mempool.space',
		network: 'mainnet'
	});

	const blockHash = await blocks.getBlockHeight({ height: blockHeight });

	return blockHash;	
}

