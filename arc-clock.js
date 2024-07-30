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

		this.#sheet.replaceSync("");

		let cssUrl = new URL("./arc-clock.css", import.meta.url);

		fetch(cssUrl)
			.then((res) => res.text())
			.then((css) => {
				this.#sheet.replaceSync(css);
			});
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
		let div = document.createElement("div");

		div.style.setProperty("--hours-duration", `${totalHours * 3_600}s`);
		div.style.setProperty("--hours-delay", `${-1 * hours}s`);
		div.style.setProperty("--minutes-delay", `${-1 * minutes}s`);
		div.style.setProperty("--seconds-delay", `${-1 * seconds}s`);

		shadow.adoptedStyleSheets = [ArcClock.#sheet];

		shadow.append(div);
	}
}
