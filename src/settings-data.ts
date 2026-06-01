import { BlockExplorer, BlockHeightFormat, MoscowTimeFormat } from '@utils/types';

export interface StampFormats {
  blockHeight: BlockHeightFormat,
  moscowTime: MoscowTimeFormat
}

export interface StampPlaceholders {
  blockHeight: string,
  moscowTime: string,
  moscowTimeAtBlockHeight: string
}

export interface BbsPluginSettings {
  blockExplorer: BlockExplorer
  formats: StampFormats
  placeholders: StampPlaceholders
}

type LegacyBbsPluginSettings = Partial<BbsPluginSettings> & {
  blockHeightFormat?: BlockHeightFormat,
  moscowTimeFormat?: MoscowTimeFormat
}

export const DEFAULT_SETTINGS: BbsPluginSettings = {
  blockExplorer: '',
  formats: {
    blockHeight: 'plain',
    moscowTime: 'plain'
  },
  placeholders: {
    blockHeight: '{{blockheight}}',
    moscowTime: '{{moscowtime}}',
    moscowTimeAtBlockHeight: '{{moscowtime@blockheight}}'
  }
}

export function normalizeSettings (loadedSettings: unknown): BbsPluginSettings {
  const settings = isRecord(loadedSettings) ? loadedSettings as LegacyBbsPluginSettings : {};

  return {
    blockExplorer: settings.blockExplorer ?? DEFAULT_SETTINGS.blockExplorer,
    formats: {
      blockHeight: settings.formats?.blockHeight ?? settings.blockHeightFormat ?? DEFAULT_SETTINGS.formats.blockHeight,
      moscowTime: settings.formats?.moscowTime ?? settings.moscowTimeFormat ?? DEFAULT_SETTINGS.formats.moscowTime
    },
    placeholders: {
      blockHeight: settings.placeholders?.blockHeight ?? DEFAULT_SETTINGS.placeholders.blockHeight,
      moscowTime: settings.placeholders?.moscowTime ?? DEFAULT_SETTINGS.placeholders.moscowTime,
      moscowTimeAtBlockHeight: settings.placeholders?.moscowTimeAtBlockHeight ?? DEFAULT_SETTINGS.placeholders.moscowTimeAtBlockHeight
    }
  }
}

function isRecord (value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
