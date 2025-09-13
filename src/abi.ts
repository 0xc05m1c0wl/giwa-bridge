import { erc20Abi, parseAbi } from 'viem';

import { ADDRESSES } from '@/config';

export const L1_TOKEN = ADDRESSES.L1_TOKEN;
export const L2_TOKEN = ADDRESSES.L2_TOKEN;
export const L1_STANDARD_BRIDGE = ADDRESSES.L1_BRIDGE;
export const L2_STANDARD_BRIDGE = ADDRESSES.L2_BRIDGE;

export const testTokenAbi = [
  ...erc20Abi,
  ...parseAbi(['function claimFaucet() external']),
] as const;

export const l1StandardBridgeAbi = parseAbi([
  'function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) external',
]);

export const l2StandardBridgeAbi = parseAbi([
  'function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) external',
]);
