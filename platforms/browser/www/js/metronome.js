var sounds = [
	new Howl({ src: ["sounds/clave1.wav"] }),
	new Howl({ src: ["sounds/clave2.wav"] }),
	new Howl({ src: ["sounds/clave3.wav"]})
];

class Time {
	constructor(bpm, division) {
		this.bpm = bpm;
		this.division = division;
	}
	get beatsPerMin() {
		return this.calcBeatsPerMin();
	}
	calcBeatsPerMin() {
		return (60 / (this.bpm * this.division)) * 1000;
	}
}

class Meter {
	constructor(beats, division) {
		this.beats = beats;
		this.division = division;
	}
	get beatSeries() {
		return this.calcBeatSeries();
	}

	calcBeatSeries() {
		var seriesLength = this.beats;
		var divisions = parseFloat((1 / this.division).toPrecision(5));
		var sum = 1;
		var array = [];

		for (var i = 1; i <= seriesLength + 1 - divisions; i = parseFloat((i + divisions).toPrecision(5))) {
			sum = parseFloat(i.toFixed(2));
			array.push(sum);
		}

		return array;
	}
}

$(function() {
	var nestedBeatArray = [];
	var beatSeries = [];
	var soundMap = [];
	var count = 1;
	var pointer = 0;
	var playing;
	var num_beats = parseInt($("#beats").val());
	var division = parseInt($("#division").val());
	var tempo = parseInt($("#tempo").val());
	var m;
	var t;
	var timer;

	$("#start").on("click", function() {
		playing = true;
		instantiateNewMeter();
		startMetronome();
		$("#start").hide();
		$("#stop").show();
	});

	$("#stop").on("click", function() {
		stopPlaying();
		$("#stop").hide();
		$("#start").show();
	});

	$("#division").change(function() {
		division = parseInt($("#division").val());
		instantiateNewMeter();
	});

	$("#beats").change(function() {
		num_beats = parseInt($("#beats").val());
		instantiateNewMeter();
	});

	$("#tempo").change(function() {
		tempo = parseInt($("#tempo").val());
		instantiateNewMeter();
	});

	function startMetronome() {
		playing = true;
		setTimeout(whilePlaying, t.beatsPerMin);
	}

	function whilePlaying() {
		if (playing == true) {
			var sound = soundMap[pointer];
			try {
				sounds[sound].play();
			}
			catch(err) {
				sounds[0].play();
				pointer = 0;
			}
			$("#counter").text(beatSeries[pointer]);
			pointer = pointer + 1;

			if (pointer == beatSeries.length) {
				count = count + 1;
				pointer = 0;
			}
			setTimeout(whilePlaying, t.beatsPerMin);
		}
	}

	function stopPlaying() {
		playing = false;
		nestedBeatArray = [];
		beatSeries = [];
		count = 1;
		pointer = 0;
	}

	function instantiateNewMeter() {
		m = null;
		t = null;
		m = new Meter(num_beats, division);
		t = new Time(tempo, division);
		// each nested array represents a unit of our meter
		nestedBeatArray = m.beatSeries;

		// flatten the nested time array to prepare for playing
		beatSeries = [].concat(...nestedBeatArray);
		mapSounds(beatSeries);
	}

	function mapSounds(beatSeries) {
		soundMap = [];
		for (i = 0; i < beatSeries.length; i++) {
			if (beatSeries[i] == 1) {
				soundToMap = 0;
			}
			else if (beatSeries[i] % 1 != 0) {
				soundToMap = 1;
			}
			else {
				soundToMap = 2;
			}
			soundMap.push(soundToMap);
		}
		console.log(beatSeries);
		console.log(soundMap);
	};
});
