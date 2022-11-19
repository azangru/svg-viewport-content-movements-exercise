import { LitElement, css, html, svg } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { DragController } from './dragController';

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

  private drag: DragController = new DragController(this);

  @state()
  private x = 0;

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('drag-stop', this.updateX)
  }

  updateX = () => {
    this.x = this.x + this.drag.shift_x;
    this.drag.shift_x = 0;
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
      <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        ${this.renderRect()}
      </svg>`;
  }

  renderRect () {
    const x = this.x + this.drag.shift_x;
    return svg`<rect width=${width / 4} height="10" x=${x} y=${height / 2}></rect>`;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
