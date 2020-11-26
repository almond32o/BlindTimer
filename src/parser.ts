import Blind from '@/blind';

type ItemType = 'BREAK' | number | null;

export function dump(blinds: Array<Blind>): string {
  const header = 'LEVEL,SB,BB,ANTE,TIME\n';
  const str = blinds.map((blind: Blind): string => {
    return Object.entries(blind).map((item: [string, ItemType]): string => {
      if (item[1] === null) return '';
      else if (item[1] == 'BREAK') return 'B';
      else return item[1].toString();
    }).join();
  }).join('\n');
  return header + str;
}

export function parse(input: string): Array<Blind> {
  return input
    .split('\n')
    .splice(1)
    .filter((str: string): boolean => str.length > 0)
    .map((str: string): Blind => {
      const item = str.split(',').map((str: string): ItemType => {
        if (str === '') return null;
        else if (str[0] === 'B') return 'BREAK';
        else return Number.parseInt(str);
      })
      return new Blind(
        item[0] as 'BREAK' | number,
        item[1] as number | null,
        item[2] as number | null,
        item[3] as number | null,
        item[4] as number
      );
    })
}
