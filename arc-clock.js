window.CSS.registerProperty({
	name: "--time",
	syntax: "<percentage>",
	inherits: true,
	initialValue: "0%",
});

class ArcClock extends HTMLElement {
	connectedCallback() {
		let shadow = this.shadowRoot ?? this.attachShadow({mode: "open"});
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

		shadow.adoptedStyleSheets = [instance];

		shadow.append(document.createElement("div"));
	}
}

customElements.define("arc-clock", ArcClock);
