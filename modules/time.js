class Time {
	constructor(bpm, division) {
		this.bpm = bpm;
		this.division = division
	}
		get beatsPerMin() {
			return this.calcBeatsPerMin();
		}
		// return beats per minute as milliseconds
		calcBeatsPerMin() {
			return ((60 / (this.bpm * this.division)) * 1000);
		}
}


module.exports =  Time;