class Meter {
	constructor(beats, division, subdivision) {

		this.beats = beats;
		this.division = division;
		this.subdivision = subdivision;
	}
	get beatSeries() {
		return this.calcBeatSeries();
	}

	calcBeatSeries() {
		var seriesLength = this.beats;
		var divisions = parseFloat(1 / this.division);
		var sum = 1;
		var array = [];

		for (var i = 1; i <= seriesLength + 1 - divisions; i = i + divisions) {
			sum = parseFloat(i.toFixed(2));
			array.push(sum);
		}

		return array;
	}
}

module.exports = Meter; 