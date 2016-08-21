import {Util} from './impl/util';
import {Instant} from './instant';
import {Duration} from './duration';

export class Interval{

  constructor(start, end, opts = {openStart: false, openEnd: false}){
    //todo - break if start > end
    Object.defineProperty(this, "s", {value: start, enumerable: true});
    Object.defineProperty(this, "e", {value: end, enumerable: true});

    Object.defineProperty(this, 'openStart', {value: opts['openStart'] || false, enumerable: true});
    Object.defineProperty(this, 'openEnd', {value: opts['openEnd'] || false, enumerable: true});

    let firstTick = opts['openStart'] ? start : start.plus(1, 'millisecond'),
        lastTick = opts['openEnd'] ? end : end.minus(1, 'millisecond');

    Object.defineProperty(this, "firstTick", {value: firstTick, enumerable: false});
    Object.defineProperty(this, "lastTick", {value: lastTick, enumerable: false});
  }

  static fromInstants(start, end, opts = {}){
    return new Interval(start, end, opts);
  }

  static after(start, durationOrNumber, unit){
    let dur = Util.friendlyDuration(durationOrNumber, unit);
    return Interval.fromInstants(start, start.plus(dur));
  }

  static before(end, durationOrNumber, unit){
    let dur = Util.friendlyDuration(durationOrNumber, unit);
    return Interval.fromInstants(end.minus(dur), end);
  }

  toDuration(...units){
    return this.e.diff(this.s, ...units);
  }

  start(){
    return this.s;
  }

  end(){
    return this.e;
  }

  length(unit = 'milliseconds'){
    return this.toDuration(...[unit]).get(unit);
  }

  hasSame(unit){
    return this.firstTick.hasSame(this.lastTick, unit);
  }

  count(unit = 'milliseconds'){
    let start = this.start().startOf(unit),
        end = this.end().startOf(unit);
    return Math.floor(end.diff(start, unit).get(unit)) + 1;
  }

  split(arg){
  }

  overlaps(other){
    return this.lastTick > other.firstTick && this.firstTick < other.lastTick;
  }

  abutsStart(other){
    return +this.lastTick + 1 === +other.firstTick;
  }

  abutsEnd(other){
    return +other.lastTick + 1 === +this.firstTick;
  }

  engulfs(other){
    return this.firstTick <= other.firstTick && this.lastTick >= other.lastTick;
  }

  divideEqually(numberOfParts){
  }

  intersection(other){
    //needs to inherit this's endness
  }

  union(other){
    //needs to inherit this's endness
  }

  xor(other){
    //needs to inherit this's endness
  }

  equals(other){
    return this.s.equals(other.s)
      && this.e.equals(other.e)
      && this.openStart === other.openStart
      && this.openEnd === other.openEnd;
  }

  isEmpty(){
    if (this.openStart || this.openEnd){
      //open intervals always contain at least one millisecond
      return false;
    }
    else{
      return this.s.valueOf() === this.e.valueOf();
    }
  }

  isAfter(other){
    return this.firstTick > other;
  }

  isBefore(other){
    return this.lastTick < other;
  }

  contains(instant){
    return this.firstTick <= instant && this.lastTick >= instant;
  }

  toString(){}

  toISO(){}

  toFormatString(overallFormat, dateFormat){}

  toLocaleString(overallFormat){}
}
