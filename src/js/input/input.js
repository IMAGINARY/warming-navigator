import EventEmitter from 'events';

export default class Input extends EventEmitter {
  handleDecreaseYear() {
    this.emit('decrease-year');
  }

  handleIncreaseYear() {
    this.emit('increase-year');
  }

  handleDecreaseRegion() {
    this.emit('decrease-region');
  }

  handleIncreaseRegion() {
    this.emit('increase-region');
  }
}
