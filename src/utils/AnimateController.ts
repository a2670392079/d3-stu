class AnimateController {
  draw: (...arg: Array<any>) => void;
  animateId: number = 0;
  timeController: TimeController;
  constructor(
    duration: number,
    frame: (num:number) => number,
    draw: (frame:number) => void
  ) {
    this.draw = draw;
    this.timeController = new TimeController(duration, frame);
  }

  public paly() {
    this.run(this.timeController.startTimer());
  }

  public run(time: number): any {
    if (this.timeController.isStop(time)) {
      return;
    }
    this.draw(this.timeController.getProcess(time));
    return (this.animateId = requestAnimationFrame(this.run.bind(this)));
  }

  public pause() {
    this.timeController.pause();
    cancelAnimationFrame(this.animateId);
  }

  public reverse() {
    this.timeController.reverseTimer();
  }

  public playRate(fast: number) {
    this.timeController.setFast(fast);
  }

  public cancle() {
    this.timeController.cancel();
  }
}

class TimeController {
  duration: number;
  start: number;
  frame: (num:number) => number;
  fast: number;
  reverse: boolean = false;
  end: boolean;
  pauseStart: number;
  constructor(duration: number, frame: (num:number) => number) {
    this.start = 0;
    this.duration = duration;
    this.frame = frame;
    this.fast = 1;
    this.end = false;
    this.pauseStart = 0;
  }

  public reverseTimer() {
    this.reverse = !this.reverse;
  }

  public startTimer() {
    this.end = false;
    if (this.pauseStart) {
      const temp = this.pauseStart;
      this.pauseStart = 0;
      return (this.start = performance.now() + (performance.now() - temp));
    }
    return (this.start = performance.now());
  }
  public isStop(time: number) {
    const res = time - this.start > this.duration;
    if (res) {
      this.end = true;
      return res;
    }
    return false;
  }

  public pause() {
    this.pauseStart = performance.now();
  }

  public getProcess(time: number) {
    const timeSlice = this.reverse
      ? this.duration - (time - this.start)
      : time - this.start;
    return this.frame((this.end ? 1 : timeSlice / this.duration) * this.fast);
  }
  public reset() {
    this.start = 0;
  }

  public cancel() {
    this.end = true;
  }

  public setFast(num: number = 1) {
    this.fast = num;
  }
}
