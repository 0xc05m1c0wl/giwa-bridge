import type { Brand } from '@/types/brand';

export type Wei = Brand<bigint, 'Wei'>;
export const asWei = (n: bigint): Wei => n as Wei;

export type ChainId = Brand<number, 'ChainId'>;
export const asChainId = (n: number): ChainId => n as ChainId;
