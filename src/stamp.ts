import { MempoolSpaceApi } from '@apis/rest';
import { BLOCK_EXPLORERS, SEPARATORS } from '@utils/constants';
import { UnixTimestamp, Api, BlockId, MoscowTimeFormat, BlockHeightFormat, BlockExplorer } from '@utils/types';

export class Stamp {
  private source: Api
  private unixTimestamp?: UnixTimestamp

  constructor (unixTimestamp?: UnixTimestamp) {
    this.source = new MempoolSpaceApi();
    if (unixTimestamp) { this.unixTimestamp = unixTimestamp; }
  }

  async blockHeight(format: BlockHeightFormat='plain', blockExplorer: BlockExplorer=''): Promise<string> {
    const block: BlockId = await this.getBlock();

    let sBlockHeight: string = block.height.toLocaleString('en-US')
      .replace(/,/g, SEPARATORS[format]);

    if (blockExplorer) {
      sBlockHeight = `[${sBlockHeight}](${BLOCK_EXPLORERS[blockExplorer]})`
        .replace(/{{height}}/g, block.height.toString())
        .replace(/{{hash}}/g,block.hash.toString());
    }

    return sBlockHeight;
  }

  async moscowTime(format: MoscowTimeFormat='plain'): Promise<string> {
    const moscowTime: number = await this.getMoscowTime();
    const separator = SEPARATORS[format]
    const sMoscowTime: string = moscowTime.toString()
			.padStart((separator) ? 4 : 0, '0')
			.split('').reverse().join('')
			.split(/(\d{2})/g)
			.filter(v => v !== '')
			.join(separator)
			.split('').reverse().join('');
    return sMoscowTime
  }

  async moscowTimeAtBlockHeight (moscowTimeFormat: MoscowTimeFormat='plain', blockHeightFormat: BlockHeightFormat='plain', blockExplorer: BlockExplorer=''): Promise<string> {
    const moscowTime: string = await this.moscowTime(moscowTimeFormat);
    const blockHeight: string = await this.blockHeight(blockHeightFormat, blockExplorer);

    return moscowTime + ' @ ' + blockHeight;
  }

  private async getBlock (): Promise<BlockId> {
    const block: BlockId = await this.source.getBlockId(this?.unixTimestamp);
    return block;
  }

  private async getMoscowTime (): Promise<number> {
    const satsPerBtc = 100000000;
    const btcPrice: number = await this.source.getPrice(this?.unixTimestamp);
    const satsPerUsd: number = Math.round(satsPerBtc / btcPrice);
    return satsPerUsd;
  }
}
