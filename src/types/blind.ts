export default class Blind {
  level: number | 'BREAK';
  sb: number | null;
  bb: number | null;
  ante: number | null;
  time: number;
  constructor(
    level: number | 'BREAK',
    sb: number | null,
    bb: number | null,
    ante: number | null,
    time: number
  ) {
    this.level = level;
    this.sb = sb;
    this.bb = bb;
    this.ante = ante;
    this.time = time;
  }
}
