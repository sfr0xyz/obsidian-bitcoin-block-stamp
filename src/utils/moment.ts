import { moment as obsidianMoment } from 'obsidian';

type MomentLike = {
  format: (format: string) => string;
};

type MomentFactory = {
  (): MomentLike;
  (input: string, format: string): MomentLike;
};

export const moment = obsidianMoment as unknown as MomentFactory;
