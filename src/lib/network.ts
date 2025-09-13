export function chainName(chainId?: number | null): string {
  if (!chainId) return '-';
  switch (chainId) {
    case 11155111:
      return 'Ethereum Sepolia (L1)';
    case 91342:
      return 'GIWA Sepolia (L2)';
    default:
      return String(chainId);
  }
}
