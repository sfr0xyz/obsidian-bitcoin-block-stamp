import { Stamp } from '@src/stamp';
import type { BbsPluginSettings } from '@src/settings-data';
import type { Replacements, BlockExplorer, BlockHeightFormat, MoscowTimeFormat, StampKind, StampSource, UnixTimestamp } from '@utils/types';

export interface CustomStampRequest {
  unixTimestamp: UnixTimestamp;
  stampKind: StampKind;
  blockHeightFormat: BlockHeightFormat;
  moscowTimeFormat: MoscowTimeFormat;
  blockExplorer: BlockExplorer;
}

export class StampGenerator {
  constructor (private source: StampSource) {}

  async currentBlockHeight (settings: BbsPluginSettings): Promise<string> {
    return this.createStamp().blockHeight(settings.formats.blockHeight, settings.blockExplorer);
  }

  async currentMoscowTime (settings: BbsPluginSettings): Promise<string> {
    return this.createStamp().moscowTime(settings.formats.moscowTime);
  }

  async currentMoscowTimeAtBlockHeight (settings: BbsPluginSettings): Promise<string> {
    return this.createStamp().moscowTimeAtBlockHeight(settings.formats.moscowTime, settings.formats.blockHeight, settings.blockExplorer);
  }

  async customStamp (request: CustomStampRequest): Promise<string> {
    const stamp = this.createStamp(request.unixTimestamp);

    switch (request.stampKind) {
      case 'block-height':
        return stamp.blockHeight(request.blockHeightFormat, request.blockExplorer);
      case 'moscow-time':
        return stamp.moscowTime(request.moscowTimeFormat);
      case 'moscow-time_at_block-height':
        return stamp.moscowTimeAtBlockHeight(request.moscowTimeFormat, request.blockHeightFormat, request.blockExplorer);
    }
  }

  async placeholderReplacements (settings: BbsPluginSettings): Promise<Replacements> {
    const stamp = this.createStamp();
    const [blockHeight, moscowTime] = await Promise.all([
      stamp.blockHeight(settings.formats.blockHeight, settings.blockExplorer),
      stamp.moscowTime(settings.formats.moscowTime)
    ]);

    return {
      [settings.placeholders.blockHeight]: blockHeight,
      [settings.placeholders.moscowTime]: moscowTime,
      [settings.placeholders.moscowTimeAtBlockHeight]: `${moscowTime} @ ${blockHeight}`
    };
  }

  private createStamp (unixTimestamp?: UnixTimestamp): Stamp {
    return new Stamp(unixTimestamp, this.source);
  }
}
