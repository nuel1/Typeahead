/**
 * Creating a type ahead reusable feature
 */

// Container element for our content array items;
const span = document.querySelector("span");
const textCursor = document.querySelector("#textcursor");

/**
 *
 * @param {*} element element to add the class name value
 * @param {*} classN class name to be added to the element
 */
const addClassName = (element, classN) => {
  element.className = classN;
};

const removeClassName = (element) => {
  element.className = "";
};

const data = span.getAttribute("data-rotate");

const strToArr = (str) => {
  return str.replace(/]|\[|"/g, "").split(",");
};

const content = strToArr(data);

let intervalId;

let iteratorConstructor = content[Symbol.iterator]();

const source = () => {
  return {
    word: "",
    set loadWord(value) {
      this.word = typeof value === "string" ? value : null;
    },
    get splited() {
      return this.word
        ? this.word.split("")
        : new Error(`${this.word} not a string`);
    },
  };
};

let pause = false;

const typing = (word) => {
  if (!("[Symbol.call]" in typing)) {
    Object.defineProperty(typing, "[Symbol.call]", {
      value: source(),
    });
  }

  typing["[Symbol.call]"].loadWord = word;

  if (typing["[Symbol.call]"].splited instanceof Error) {
    throw new Error(`${word} is not of type "string"`);
  }

  const strArr = typing["[Symbol.call]"].splited;

  /**
   Property description: {
   * typing.s: 'recieves a splited string stored in an array';
   * typing.i: 'hold an array iterator object for a known array'
   * }
   */
  if (typing.s && typing.s.join("") !== strArr.join("")) {
    typing.s = strArr;
    typing.i = typing.s.values();
  } else {
    typing.s = typing.s || strArr;
    typing.i = typing.i || typing.s.values();
  }

  let iterator = typing.i.next();

  if (!iterator.done) {
    span.textContent += iterator.value;
    return iterator.done;
  }

  return iterator.done;
};

const clearing = (word) => {
  if (!("text" in clearing)) {
    Object.defineProperty(clearing, "text", {
      value: word,
      writable: true,
    });
  }

  //storing the value of the function parameter into
  // a cache
  clearing.cache = clearing.cache || word;

  // Reasigning the value of <clearing.cache> and <clearing.text>
  // after the argument of the word parameter is changed
  if (clearing.cache !== word) {
    clearing.cache = word;
    clearing.text = word;
  }

  const str = clearing.text;

  if (!str) {
    return true;
  }

  clearing.text = str.substring(str.length - 1, -1);
  span.textContent = clearing.text;

  return false;
};

let typed = false;
let cleared = false;

const runScript = () => {
  runScript.iterator = runScript.iterator || iteratorConstructor.next();
  const word = runScript.iterator.value;

  if (!typed) {
    typed = typing(word);
    pause = false;
  } else {
    if (!pause) {
      addClassName(textCursor, "blink");
      setTimeout(() => {
        pause = true;
        removeClassName(textCursor);
      }, 2000);
    } else {
      cleared = clearing(word);
    }
  }

  if (typed === true && cleared === true) {
    runScript.iterator = iteratorConstructor.next();
    (typed = false), (cleared = false);
  }

  if (runScript.iterator.done) {
    iteratorConstructor = content[Symbol.iterator]();
    runScript.iterator = iteratorConstructor.next();
  }
};

let speed = 150;
intervalId = setInterval(runScript, speed);
