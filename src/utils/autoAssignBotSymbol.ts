export const autoAssignBotSymbol = (
  player1Symbol: string,
  symbols: string[]
): string => {
  return symbols.filter((s) => s !== player1Symbol)[0];
};
