class ArcClock extends HTMLElement {
	static #sheet = new CSSStyleSheet();

	static {
		window.CSS.registerProperty({
			name: "--time",
			syntax: "<percentage>",
			inherits: true,
			initialValue: "0%",
		});

		customElements.define("arc-clock", ArcClock);

		this.#sheet.replaceSync(`
			@keyframes cycle {
				0% {
					--time: 0%;
				}

				100% {
					--time: 100%;
				}
			}

			div {
				grid-template-columns: var(--template);
				grid-template-rows: var(--template);
				gap: var(--gap);
				--color: var(--hours-color);
				--template: repeat(3, var(--size)) auto
					repeat(3, var(--size));
				--duration: var(--hours-duration);
				--delay: var(--hours-delay);

				&,
				&::before,
				&::after {
					will-change: var(--time);
					border-radius: 100%;
					display: grid;
					aspect-ratio: 1;
					background: radial-gradient(
							closest-side,
							white,
							white calc(100% - var(--size)),
							oklab(0% 0 0 / 0) calc(100% - var(--size)),
							oklab(0% 0 0 / 0)
						),
						conic-gradient(
							var(--color),
							var(--color) var(--time),
							white var(--time)
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
					--color: var(--minutes-color);
					--col-row: 2 / -2;
					--duration: 3600s;
					--delay: var(--minutes-delay);
				}

				&::after {
					--color: var(--seconds-color);
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

		shadow.append(document.createElement("div"));
	}
}
