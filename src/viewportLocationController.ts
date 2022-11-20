import { ReactiveController, LitElement } from 'lit';

export class ViewportLocationController implements ReactiveController {
  host: LitElement;

  start: number | null = null;
  end: number | null = null;
  scale: Scale | null = null;

  startAtDragStart = 0;
  endAtDragStart = 0;

  drag_x_start = 0;

  constructor(host: LitElement) {
    this.host = host;
    this.host.addController(this);
  }

  setLocationAndElement<T extends HTMLElement>(
    { start, end, element }: { start: number, end: number, element: T }
  ) {
    this.start = start;
    this.end = end;
    const { width } = element.getBoundingClientRect();

    console.log({ start, end, width });
    this.scale = createScale({
      domain: [0, end - start],
      range: [0, width]
    });
    this.host.requestUpdate();
  };

  hostConnected() {
    this.host.addEventListener('mousedown', this.onMouseDown);
  }

  hostDisconnected() {
    this.host.removeEventListener('mousedown', this.onMouseDown);
    console.log('host disconnected');
  }

  onMouseDown = (event: MouseEvent) => {
    this.drag_x_start = event.pageX;
    this.startAtDragStart = this.start as number;
    this.endAtDragStart = this.end as number;

    this.host.addEventListener('mousemove', this.onDrag);
    this.host.addEventListener('mouseup', this.onDragEnd);
  }

  onDrag = (event: MouseEvent) => {
    const x = event.pageX;
    const deltaX = Math.abs(x - this.drag_x_start);
    let deltaLocation = this.scale!.invert(deltaX);

    const deltaCoefficient = x >= this.drag_x_start
      ? 1
      : -1;
    deltaLocation = deltaLocation * deltaCoefficient;

    this.start = this.startAtDragStart + deltaLocation;
    this.end = this.endAtDragStart + deltaLocation;

    this.host.requestUpdate();
  }

  onDragEnd = () => {
    this.host.removeEventListener('mousemove', this.onDrag);
    this.host.removeEventListener('mouseup', this.onDragEnd);

    this.startAtDragStart = 0;
    this.endAtDragStart = 0;
  };

}


type Scale = {
  (x: number): number;
  invert: (x: number) => number;
};

const createScale = ({ domain, range }: {
  domain: [number, number],
  range: [number, number]
}) => {
  const domainInterval = Math.abs(domain[1] - domain[0]);
  const rangeInterval = Math.abs(range[1] - range[0]);

  console.log({ domainInterval, rangeInterval });

  const directCoefficient = rangeInterval / domainInterval;
  const inverseCoefficient = domainInterval / rangeInterval;

  const directScale = (x: number) => Math.round(x * directCoefficient);
  const inverseScale = (x: number) => Math.round(x * inverseCoefficient);

  const scale = <Scale>(directScale);
  scale.invert = inverseScale;

  return scale;
}