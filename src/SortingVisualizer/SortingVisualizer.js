import React from "react";
import "./SortingVisualizer.css";
import { getMergeSortAnimations } from "../SortingAlgorithms/MergeSort";
//Changing width,height accordingly with the browser
let WINDOW_WIDTH = window.innerWidth;
let WINDOW_HEIGHT = window.innerHeight;
let NUMBER_OF_ARRAY_BARS = parseInt((WINDOW_WIDTH - 200) / 50);

function reportWindowSize() {
  WINDOW_WIDTH = window.innerWidth;
  WINDOW_HEIGHT = window.innerHeight;
  NUMBER_OF_ARRAY_BARS = parseInt((WINDOW_WIDTH - 200) / 50);
}
window.onresize = reportWindowSize; //TBD -> find a way to update state also when resized

const PRIMARY_COLOR = "pink"; //Normal color of bars
const SECONDARY_COLOR = "brown"; //Color of bars when they are being compared
const ANIMATION_SPEED_MS = 100; //Animation Speed (how fast color changes, how fast height gets overwritten)

//Tooltips for buttons
const DISABLED_BUTTON = "Currently Disabled";
const ENABLED_BUTTON = {
  nlogn: "O(NlogN) Time Complexity",
  nSquare: "O(N^2) Time Complexity"
};

class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array: []
    };
  }
  componentDidMount() {
    this.resetArray();
  }
  //Generates new random array
  resetArray() {
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(25, WINDOW_HEIGHT - 30));
    }
    this.setState({ array: array });
    this.restoreStoreButtons();
  }
  disableSortButtons() {
    document.getElementById("mergeSort").disabled = true;
    let buttonStyle = document.getElementById("mergeSort").style;
    document.getElementById("mergeSort").title = DISABLED_BUTTON;
    buttonStyle.cursor = "default";
    buttonStyle.background = "#000000";
  }
  restoreStoreButtons() {
    document.getElementById("mergeSort").disabled = false;
    let buttonStyle = document.getElementById("mergeSort").style;
    document.getElementById("mergeSort").title = ENABLED_BUTTON.nlogn;
    buttonStyle.background = "#47535E";
    buttonStyle.cursor = "pointer";
  }
  //Sorting Algorithms
  mergeSort() {
    const [animations, sortArray] = getMergeSortAnimations(this.state.array);
    for (let i = 0; i < animations.length; i++) {
      const isColorChange = i % 3 !== 2;
      const arrayBars = document.getElementsByClassName("array-bar");
      if (isColorChange === true) {
        const [barOneIndex, barTwoIndex] = animations[i];
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        const barOneStyle = arrayBars[barOneIndex].style;
        const barTwoStyle = arrayBars[barTwoIndex].style;
        //If we don't multiply by the index then every animations[i] wait for exactly ANIMATION_SPEED_MS and immediately change into final state
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * ANIMATION_SPEED_MS);
      }
    }
    // this.setState({array: sortArray})
    const RESTORE_TIME = parseInt(
      (ANIMATION_SPEED_MS * animations.length) / 2 + 3000
    );
    setTimeout(() => this.restoreStoreButtons(), RESTORE_TIME);
  }

  render() {
    const array = this.state.array;
    const SORT_BUTTONS = 1;
    const TOTAL_BUTTONS = 1 + SORT_BUTTONS;
    return (
      <>
        <div
          className="array-container"
          style={{ position: "absolute", left: `200px` }}
        >
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                backgroundColor: PRIMARY_COLOR,
                height: `${value}px`
              }}
            ></div>
          ))}
        </div>
        <div className="buttons">
          <button
            title="Generates a new random array"
            style={{
              position: "relative",
              top: `${(0 * (WINDOW_HEIGHT - 20)) / TOTAL_BUTTONS}px`
            }}
            onClick={() => this.resetArray()}
          >
            Generate New Array
          </button>
          <button
            title="O(NlogN) Time Complexity"
            id="mergeSort"
            style={{
              position: "relative",
              top: `${(0.5 * (WINDOW_HEIGHT - 20)) / TOTAL_BUTTONS}px`
            }}
            onClick={() => this.mergeSort()}
          >
            Merge Sort
          </button>
        </div>
      </>
    );
  }
}

// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default SortingVisualizer;
