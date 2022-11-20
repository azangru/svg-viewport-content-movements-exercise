import { LitElement, css, html, svg } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ViewportLocationController } from './viewportLocationController';

const width = 800;
const height = 600;


@customElement('my-element')
export class MyElement extends LitElement {

  static styles = css`
    .stage {
      width: 800px;
      height: 600px;
      border: 1px solid black;
    }
  `

  private viewportLocation: ViewportLocationController = new ViewportLocationController(this);

  constructor () {
    super();
  }

  firstUpdated() {
    super.connectedCallback();
    const svg = this.shadowRoot?.querySelector('svg');
    this.viewportLocation.setLocationAndElement({
      start: 32314002,
      end: 32318799,
      element: svg as unknown as HTMLElement
    });
  }

  render() {
    return html`
      <div class="stage">
        ${this.renderSvg()}
      </div>
    `;
  }

  renderSvg() {
    return html`
      <svg viewBox="0 0 ${width} ${height}">
        ${this.renderRect()}
      </svg>`;
  }

  renderRect () {
    const scale = this.viewportLocation.scale;

    if (!scale) {
      return null;
    }
    const start = 32314002;
    const end = 32318799;

    const relativeStart = Math.max(0, start - (this.viewportLocation.start as number));
    const relativeEnd = Math.max(0, end - (this.viewportLocation.start as number));

    const x = scale(relativeStart);
    const width = scale(relativeEnd);

    return svg`<rect width=${width} height="10" x=${x} y=${height / 2}></rect>`;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
