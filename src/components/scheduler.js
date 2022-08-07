import React, { useState, useEffect, useRef } from "react";

const NoteLength = Object.freeze({
  whole: 1,
  half: 0.5,
  triple: 0.333333,
  quarter: 0.25,
  quintuplet: 0.2,
});

const temp = [NoteLength["half"], NoteLength["quarter"], NoteLength["quarter"]];

function Scheduler(props) {
  const [playing, setPlaying] = useState(false);
  // const audioContext = new AudioContext();
  var numberOfBeats = 4;
  var nextNoteTime = 0.0;
  var currentBarPercentage = 0;
  var scheduleAheadTime = 0.1;
  var lookahead = 25.0;
  // const timerWorker = useRef(props.worker);
  // const timerWorker = useRef(new Worker("./metronomeworker.js"));
  props.worker.onmessage = function (e) {
    if (e.data === "tick") {
      console.log("tick!");
      scheduler();
    } else console.log("message: " + e.data);
  };

  var tempo = 60;
  var noteLength = 0.05;
  const notesQueueReset = Array(4)
    .fill([...temp])
    .reduce((a, b) => b.concat(a));
  var globalNotesQueue = [...notesQueueReset];

  const nextNote = () => {
    // Advance current note and time
    var secondsPerBeat = 60.0 / props.tempo; // Notice this picks up the CURRENT
    // tempo value to calculate beat length.
    if (globalNotesQueue.length === 0) {
      currentBarPercentage = 0;
      console.log("notesQueueReset " + notesQueueReset);
      globalNotesQueue = [...notesQueueReset]; // this should really be react state
    }
    var nextNoteInterval = globalNotesQueue.shift();
    console.log("globalNotesQueue after shitfting " + globalNotesQueue);
    nextNoteTime += nextNoteInterval * secondsPerBeat; // Add beat length to last beat time

    currentBarPercentage += nextNoteInterval / numberOfBeats; // Advance the beat number, wrap to zero
    console.log(currentBarPercentage);
  };

  const scheduleNote = (time) => {
    // create an oscillator
    var osc = props.audioContext.createOscillator();
    osc.connect(props.audioContext.destination);
    console.log(
      "currentBarPercentage in scheduleNote: " + currentBarPercentage
    );
    // if (currentBarPercentage === 0)    // beat 0 == high pitch
    if (globalNotesQueue.length === 0) osc.frequency.value = 880.0;
    // else if (beatNumber % 4 === 0 )    // quarter notes = medium pitch
    //     osc.frequency.value = 440.0;
    // other 16th notes = low pitch
    else osc.frequency.value = 220.0;

    osc.start(time);
    osc.stop(time + noteLength);
  };

  const scheduler = () => {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime < props.audioContext.currentTime + scheduleAheadTime) {
      scheduleNote(nextNoteTime);
      nextNote();
    }
  };

  const play = () => {
    if (playing) {
      // start playing
      currentBarPercentage = 0;
      nextNoteTime = props.audioContext.currentTime;
      props.worker.postMessage("start");
    } else {
      props.worker.postMessage("stop");
    }
  };

  // useEffect(() => {
  //   var buffer = audioContext.createBuffer(1, 1, 22050);
  //   var node = audioContext.createBufferSource();
  //   node.buffer = buffer;
  //   node.start(0);
  //   props.worker.onmessage = function (e) {
  //     if (e.data === "tick") {
  //       console.log("tick!");
  //       scheduler();
  //     } else {
  //      console.log("message: " + e.data);
  //     }
  //   }
  //   props.worker.postMessage({ interval: lookahead });
  //   }, []);

  useEffect(() => {
    play();
  }, [playing]);

  return (
    <button onClick={() => setPlaying(!playing)}>
      {playing ? "Stop" : "Start"}
    </button>
  );
}

export default Scheduler;
