export default class Blind {
  id: number;
  sb: number;
  bb: number;
  ante: number;
  time: number;
  constructor(
    id: number,
    sb: number,
    bb: number,
    ante: number,
    time: number
  ) {
    this.id = id;
    this.sb = sb;
    this.bb = bb;
    this.ante = ante;
    this.time = time;
  }
  isBreak(): boolean {
    return this.sb <= 0;
  }
}
