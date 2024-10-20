class ArcClock extends HTMLElement {
	connectedCallback() {
		let date = new Date();
		let startTime =
			(date.getHours() % 12) * 3_600 +
			(date.getMinutes() * 60 + date.getSeconds());

		this.style.setProperty("--arc-clock--start-time", startTime);

		this.toggleAttribute("started");
	}
}

customElements.define("arc-clock", ArcClock);
