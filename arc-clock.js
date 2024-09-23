window.CSS.registerProperty({
	name: "--arc-clock--time",
	syntax: "<percentage>",
	inherits: true,
	initialValue: "0%",
});

class ArcClock extends HTMLElement {
	connectedCallback() {
		let shadow = this.shadowRoot;
		let totalHours = Number(this.getAttribute("total-hours"));
		let div = shadow.querySelector("div");

		if (!totalHours || Number.isNaN(totalHours)) {
			totalHours = 24;
		}

		let date = new Date();
		let seconds = date.getSeconds();
		let minutes = date.getMinutes() * 60 + seconds;
		let hours = (date.getHours() % totalHours) * 3_600 + minutes;

		div.style.setProperty("--hours-duration", `${totalHours * 3_600}s`);
		div.style.setProperty("--hours-delay", `${-1 * hours}s`);
		div.style.setProperty("--minutes-delay", `${-1 * minutes}s`);
		div.style.setProperty("--seconds-delay", `${-1 * seconds}s`);
	}
}

customElements.define("arc-clock", ArcClock);
