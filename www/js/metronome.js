var sounds = [
	new Howl({ src: ["sounds/clave1.wav"] }),
	new Howl({ src: ["sounds/clave2.wav"] }),
	new Howl({ src: ["sounds/clave3.wav"] })
];

class Time {

	constructor(bpm, division) {

		// Beats per minute
		this.bpm = bpm;

		// Each beat can be divided into quarter, eighth, triplet, or sixteenths
		this.division = division;
	}

	get beatsPerMin() {
		return this.calcBeatsPerMin();
	}

	calcBeatsPerMin() {

		/* 	The number of beats that will occur in one minute
			80 BPM subdivided into eigth notes would be
			(60 / (80 * 2)) * 1000 = the number of milliseconds
			needed for our timeout function
		*/
		return (60 / (this.bpm * this.division)) * 1000;
	}
}

class Meter {

	constructor(beats, division) {
		//Currently, a meter can have 1,2,3,4, or 5 beats
		this.beats = beats;
		// Divisions can be 1, 2, 3, or 4
		this.division = division;
	}

	get beatDivisions() {
		return this.calcBeatDivisions();
	}

	calcBeatDivisions() {
		var seriesLength = this.beats;

		/* 	Division size is the subdivision of each beat
			If we are subdividing by 16th notes, each beat is broken up into 4
			divisionSize = 1 / 4 or 0.25

			We want to return an array that represents each division of the beat
			So we will return [1, 1.25, 1.5, 1.75, 2...]
		*/
		var divisionSize = parseFloat((1 / this.division).toPrecision(5));
		var beat = 1;
		var array = [];

		for (
			var i = 1;
			i <= seriesLength + 1 - divisionSize;
			i = parseFloat((i + divisionSize).toPrecision(5))
		) {
			beat = parseFloat(i.toFixed(2));
			array.push(beat);
		}

		return array;
	}
}

$(function() {
	var nestedBeatArray = [];
	var beatDivisions = [];
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
			} catch (err) {
				sounds[0].play();
				pointer = 0;
			}
			$("#counter").text(beatDivisions[pointer]);
			pointer = pointer + 1;

			if (pointer == beatDivisions.length) {
				count = count + 1;
				pointer = 0;
			}
			setTimeout(whilePlaying, t.beatsPerMin);
		}
	}

	function stopPlaying() {
		playing = false;
		nestedBeatArray = [];
		beatDivisions = [];
		count = 1;
		pointer = 0;
	}

	function instantiateNewMeter() {
		m = null;
		t = null;
		m = new Meter(num_beats, division);
		t = new Time(tempo, division);
		/* 
			Not doing this yet, but mixed meter will essentially be
			two meters squashed together [[1,1.5],[1,1.33,1.67]]
			So we'll squash these together so we get one flat array 
		*/
		nestedBeatArray = m.beatDivisions;

		// flatten the nested time array to prepare for playing
		beatDivisions = [].concat(...nestedBeatArray);

		// for each subdivision, we want to map the appropriate sound
		mapSounds(beatDivisions);
	}

	function mapSounds(beatDivisions) {
		soundMap = [];

		/*
			Basically, for each subdivision in the array,
			check if it is the first beat. If so, give it the
			strong sound.

			If it is divisable by 1, without a remainder, give it
			the slight-strong beat.

			If it is evenly divisable by 1, give it the weak beat sound.
			
		*/
		for (i = 0; i < beatDivisions.length; i++) {
			if (beatDivisions[i] == 1) {
				soundToMap = 0;
			} else if (beatDivisions[i] % 1 != 0) {
				soundToMap = 1;
			} else {
				soundToMap = 2;
			}
			soundMap.push(soundToMap);
		}
		console.log(beatDivisions);
		console.log(soundMap);
	}
});
