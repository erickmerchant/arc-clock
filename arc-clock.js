class ArcClock extends HTMLElement {
	static #sheet = new CSSStyleSheet();

	static {
		window.CSS.registerProperty({
			name: "--arc-clock--time",
			syntax: "<percentage>",
			inherits: true,
			initialValue: "0%",
		});

		customElements.define("arc-clock", ArcClock);

		this.#sheet.replaceSync(`
			@keyframes cycle {
				0% {
					--arc-clock--time: 0%;
				}

				100% {
					--arc-clock--time: 100%;
				}
			}

			:host {
				grid-template-columns: var(--template);
				grid-template-rows: var(--template);
				gap: var(--arc-clock--gap);
				--color: var(--arc-clock--hours-color);
				--template: repeat(3, var(--arc-clock--size)) auto
					repeat(3, var(--arc-clock--size));
				--duration: var(--hours-duration);
				--delay: var(--hours-delay);

				&,
				&::before,
				&::after {
					will-change: var(--arc-clock--time);
					border-radius: 100%;
					display: grid;
					aspect-ratio: 1;
					background: radial-gradient(
							closest-side,
							white,
							white calc(100% - var(--arc-clock--size)),
							oklab(0% 0 0 / 0) calc(100% - var(--arc-clock--size)),
							oklab(0% 0 0 / 0)
						),
						conic-gradient(
							var(--color),
							var(--color) var(--arc-clock--time),
							white var(--arc-clock--time)
						);
					animation-timing-function: linear;
					animation-name: cycle;
					animation-duration: var(--duration);
					animation-delay: var(--delay);
					animation-iteration-count: infinite;
				}

				&::before,
				&::after {
					content: "";
					grid-column: var(--col-row);
					grid-row: var(--col-row);
				}

				&::before {
					--color: var(--arc-clock--minutes-color);
					--col-row: 2 / -2;
					--duration: 3600s;
					--delay: var(--minutes-delay);
				}

				&::after {
					--color: var(--arc-clock--seconds-color);
					--col-row: 3 / -3;
					--duration: 60s;
					--delay: var(--seconds-delay);
				}
			}
		`);
	}

	connectedCallback() {
		let shadow = this.attachShadow({mode: "open"});
		let totalHours = Number(this.getAttribute("total-hours"));

		if (!totalHours || Number.isNaN(totalHours)) {
			totalHours = 24;
		}

		let date = new Date();
		let seconds = date.getSeconds();
		let minutes = date.getMinutes() * 60 + seconds;
		let hours = (date.getHours() % totalHours) * 3_600 + minutes;
		let instance = new CSSStyleSheet();

		instance.replaceSync(`:host {
			--hours-duration: ${totalHours * 3_600}s;
			--hours-delay: ${-1 * hours}s;
			--minutes-delay: ${-1 * minutes}s;
			--seconds-delay: ${-1 * seconds}s;
		}`);

		shadow.adoptedStyleSheets = [ArcClock.#sheet, instance];
	}
}
