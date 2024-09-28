window.CSS.registerProperty({
	name: "--arc-clock--time",
	syntax: "<percentage>",
	inherits: true,
	initialValue: "0%",
});

class ArcClock extends HTMLElement {
	connectedCallback() {
		let totalHours = Number(this.getAttribute("total-hours"));

		if (!totalHours || Number.isNaN(totalHours)) {
			totalHours = 24;
		}

		let date = new Date();
		let seconds = date.getSeconds();
		let minutes = date.getMinutes() * 60 + seconds;
		let hours = (date.getHours() % totalHours) * 3_600 + minutes;

		this.style.setProperty("--hours-duration", `${totalHours * 3_600}s`);
		this.style.setProperty("--hours-delay", `${-1 * hours}s`);
		this.style.setProperty("--minutes-delay", `${-1 * minutes}s`);
		this.style.setProperty("--seconds-delay", `${-1 * seconds}s`);
	}
}

customElements.define("arc-clock", ArcClock);
