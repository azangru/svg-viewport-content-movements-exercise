import { ReactiveController, LitElement } from 'lit';

export class DragController implements ReactiveController {
  host: LitElement;

  drag_x_start = 0;
  shift_x = 0;

  constructor(host: LitElement) {
    this.host = host;
    this.host.addController(this);
  }
  hostConnected() {
    this.host.addEventListener('mousedown', this.onMouseDown);
  }

  hostDisconnected() {
    this.host.removeEventListener('mousedown', this.onMouseDown);
    console.log('host disconnected');
  }

  onMouseDown = (event: MouseEvent) => {
    this.drag_x_start = event.pageX;
    this.host.addEventListener('mousemove', this.onDrag);
    this.host.addEventListener('mouseup', this.onDragEnd);
  }

  onDrag = (event: MouseEvent) => {
    const x = event.pageX;
    this.shift_x = x - this.drag_x_start;
    this.host.requestUpdate();
  }

  onDragEnd = () => {
    this.host.removeEventListener('mousemove', this.onDrag);
    this.host.removeEventListener('mouseup', this.onDragEnd);

    const dragStopEvent = new CustomEvent('drag-stop', { detail: this.shift_x });
    this.host.dispatchEvent(dragStopEvent);
  };

}
