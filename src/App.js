import "./App.css";
import React from "react";
import Scheduler from "./components/scheduler";

const audioContext = new AudioContext();
const timerWorker = new Worker("metronomeworker.js");
var buffer = audioContext.createBuffer(1, 1, 22050);
var node = audioContext.createBufferSource();
node.buffer = buffer;
node.start(0);
timerWorker.postMessage({ interval: 25.0 });



function App() {
  return (
    <div className="App">
      <p>This is a beat generator app.</p>
      <Scheduler worker={timerWorker} audioContext={audioContext} tempo={60}></Scheduler>
    </div>
  );
}

export default App;
