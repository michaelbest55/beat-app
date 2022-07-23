import "./App.css";
import React, { Component } from "react";
import Scheduler from "./components/scheduler";

class App extends Component {
  render() {
    return (
      <div className="App">
        <p>This is a beat generator app.</p>
        <Scheduler></Scheduler>
      </div>
    );
  }
}

export default App;
