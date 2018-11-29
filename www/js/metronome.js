var sound = new Howl({
	src: ["sounds/woodblock.mp3"]
});

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

$(function() {
	var nestedBeatArray = [];
	var beatSeries = [];
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
	timer = setInterval(function() {
		whilePlaying();
	}, t.beatsPerMin);
};

	function stopPlaying() {
		clearInterval(timer);
		nestedBeatArray = [];
		beatSeries = [];
		count = 1;
		pointer = 0;
	};

	function whilePlaying() {
		sound.play();
		$("#counter").text(beatSeries[pointer]);
		console.log(count, beatSeries[pointer]);
		pointer = pointer + 1;

		if (pointer == beatSeries.length) {
			count = count + 1;
			pointer = 0;
		}
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
	}
});
