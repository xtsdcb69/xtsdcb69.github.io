// XTS FUNCTIONS

/**
 * Check if XTS Functions are available.
 */
function xts() {
    console.log("XTS Functions are available in current session.");
}

// GLOBAL USAGE

/**
 * Sleep a moment then execute following commands.
 * [ASYNC] Only available in async functions.
 * @param {number} time - (>= 1) Sleep time in milliseconds
 * @example sleep(1000) // Pause your commands for 1s
 */
function sleep(time) {
    if (typeof time != "number") { throw new Error(`time must be a NUMBER`); }
    if (time < 1) { throw new Error("Cannot sleep less than 1 milliseconds"); }

    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Create a copyright text in #copyright.
 * @param {number} startYear - (>= thisYear) The year that copyright starts
 * @param {string} signature - Who own the copyright
 * @example copyright(2021, "Anonymous") // Create a copyright owned by Anonymous, starting from 2024
 */
function copyright(startYear, signature = "xtsdcb69") {
    if (typeof startYear != "number") { throw new Error(`startYear must be a NUMBER`); }
    if (typeof signature != "string") { throw new Error(`signature must be a STRING`); }
    if (document.getElementById("copyright") == null) { throw new Error("Cannot set a copyright without #copyright element"); }

    const date = new Date();
    const thisYear = date.getFullYear();
    if (thisYear < parseInt(startYear)) { throw new Error("Cannot set a copyright starting from future"); }

    if (thisYear == parseInt(startYear)) {
        copyTo("copyright", `Copyright &copy; ${startYear} ${signature}. All Rights Reserved.`);
    } else {
        copyTo("copyright", `Copyright &copy; ${startYear}-${thisYear} ${signature}. All Rights Reserved.`);
    }
}

// NUMERAL COMMANDS

/**
 * Return a random number.
 * @param {number} min - (<= max) The minimum value of the random integer
 * @param {number} max - (>= min) The maximum value of the random integer
 * @param {boolean} keepFloat - Keep the decimal point or not
 * @return {number} The result of randomized number
 * @example rand(1, 10, true) // Generate a random number (including fractions) in [1, 10]
 */
function rand(min, max, keepFloat = false) {
    if (typeof min != "number") { throw new Error(`min must be a NUMBER`); }
    if (typeof max != "number") { throw new Error(`max must be a NUMBER`); }
    if (typeof keepFloat != "boolean") { throw new Error(`keepFloat must be a BOOLEAN`); }
    if (min > max) { throw new Error(`Invalid minimum / maximum integer; minimum (${min}) should be less than maximum (${max})`); }

    let range;

    if (!keepFloat) {
        range = max - min + 1;
        return Math.floor(Math.random() * range) + min;
    } else {
        range = max - min;
        return Math.random() * range + min;
    }
}

/**
 * Return a selected number in a string.
 * @param {string} string - The text that gets number from it
 * @param {number} order (>= 1) Which part of number you want
 * @return {number} The number from specified string in specified order
 * @example getNum("589brg13d7.4gh,-2.6eru", 3) // 7.4 (It'll collect ["589", "13", "7.4", "-2.6"])
 */
function getNum(string, order = 1) {
    if (typeof string != "string") { throw new Error(`string must be a STRING`); }
    if (typeof order != "number") { throw new Error(`order must be a NUMBER`); }
    if (order <= 0) { throw new Error("Order cannot less than 1"); }

    return parseFloat(string.match(/-?[0-9]+(\.[0-9]+)?/g)[order - 1]);
}


/**
 * Return a number within given range and percentage.
 * @param {number} from - The number where calculates from
 * @param {number} to - The number where calculates to
 * @param {number} percentage - ([0, 1]) The percentage of number of transit
 * @return {number} A number in range and specified percentage
 * @example transit(0, 10, 0.6) // 6 (The number in [0, 10] and 60% of its range is 6)
 */
function transit(from, to, percentage) {
    if (typeof from != "number") { throw new Error(`from must be a NUMBER`); }
    if (typeof to != "number") { throw new Error(`to must be a NUMBER`); }
    if (typeof percentage != "number") { throw new Error(`percentage must be a NUMBER`); }
    if (percentage > 1 || percentage < 0) { throw new Error("Percentage must between 0 and 1"); }

    const range = to - from;
    return percentage * range + from;
}

// CONSOLE LOG

/**
 * Log variants in console.
 * @param {any} variant - The variant of log output
 * @example log(score1, score2) // Output score1 and score2
 */
function log(...args) {
    console.log(args);
}

// HTML ELEMENTS

/**
 * Return an element in HTML.
 * @param {string} element - The id of target element
 * @return {HTMLElement} The element in HTML
 * @example target("title").addEventListener(...) // Add an event listener to #title
 */
function target(element) {
    if (typeof element != "string") { throw new Error(`element must be a STRING`); }
    if (document.getElementById(element) == null) { throw new ReferenceError(`${element} is not defined`); }

    return document.getElementById(element);
}

/**
 * @param {string} element
 */
function copyFrom(element) {
    if (typeof element != "string") { throw new Error(`element must be a STRING`); }

    return target(element).innerHTML;
}

/**
 * Copy something to an element's innerHTML.
 * @param {string} element - The id of target element
 * @param {any} content - The content to copy to the element
 * @example copyTo("p1", "Hello") // Copy "Hello" to #p1
 */
function copyTo(element, content) {
    if (typeof element != "string") { throw new Error(`element must be a STRING`); }

    target(element).innerHTML = content;
}

/**
 * Apply styles to an element.
 * @param {string} element - The id of target element
 * @param {string} style - The style to apply to the element
 * @param {"id" | "class" | "query"} method - The method of getting elements. If "query" is used, type element like CSS (for example, "#target *")
 * @example styleTo(".main title", "margin-left: 64px;", "query") // The left margin of <title> in <... class="main"> will be 64px
 */
function styleTo(element, style, method = "id") {
    if (typeof element != "string") { throw new Error(`element must be a STRING`); }
    if (typeof style != "string") { throw new Error(`style must be a STRING`); }
    if (method != "id" && method != "class" && method != "query") { throw new Error(`method must be "id" or "class" or "query"`); }

    if (method == "id") {
        target(element).style = style;
    }
    if (method == "class") {
        for (let i = 0; i < document.getElementsByClassName(element).length; i++) {
            document.getElementsByClassName(element)[i].style = style;
        }
    }
    if (method == "query") {
        for (let i = 0; i < document.querySelectorAll(element).length; i++) {
            document.querySelectorAll(element)[i].style = style;
        }
    }
}

/**
 * Change the color of an element.
 * @param {string} element - The id of target element
 * @param {string} color - The color to apply to the element
 * @param {"id" | "class" | "query"} method - The method of getting elements. If "query" is used, type element like CSS (for example, "#target *")
 * @example colorTo(".main title", "#ff0000", "query") // The color of <title> in <... class="main"> will be red
 */
function colorTo(element, color, method = "id") {
    if (typeof element != "string") { throw new Error(`element must be a STRING`); }
    if (typeof color != "string") { throw new Error(`color must be a STRING`); }
    if (method != "id" && method != "class" && method != "query") { throw new Error(`method must be "id" or "class" or "query"`); }

    if (method == "id") {
        target(element).style.color = color;
    }
    if (method == "class") {
        for (let i = 0; i < document.getElementsByClassName(element).length; i++) {
            document.getElementsByClassName(element)[i].style.color = color;
        }
    }
    if (method == "query") {
        for (let i = 0; i < document.querySelectorAll(element).length; i++) {
            document.querySelectorAll(element)[i].style.color = color;
        }
    }
}

/**
 * Hide an element.
 * @param {string} element - The id of target element
 * @param {"id" | "class" | "query"} method - The method of getting elements. If "query" is used, type element like CSS (for example, "#target *")
 * @example hide(".main title", "query") // <title> in <... class="main"> will be hidden
 */
function hide(element, method = "id") {
    if (typeof element != "string") { throw new Error(`element must be a STRING`); }
    if (method != "id" && method != "class" && method != "query") { throw new Error(`method must be "id" or "class" or "query"`); }

    if (method == "id") {
        target(element).style.display = "none";
    }
    if (method == "class") {
        for (let i = 0; i < document.getElementsByClassName(element).length; i++) {
            document.getElementsByClassName(element)[i].style.display = "none";
        }
    }
    if (method == "query") {
        for (let i = 0; i < document.querySelectorAll(element).length; i++) {
            document.querySelectorAll(element)[i].style.display = "none";
        }
    }
}

/**
 * Show an element with expected display method.
 * @param {string} element - The id of target element
 * @param {string} display - The type of display
 * @param {"id" | "class" | "query"} method - The method of getting elements. If "query" is used, type element like CSS (for example, "#target *")
 * @example unhide(".main title", "inline-block", "query") // Show <title> in <... class="main"> in inline-block
 */
function unhide(element, display = "block", method = "id") {
    if (typeof element != "string") { throw new Error(`element must be a STRING`); }
    if (typeof display != "string") { throw new Error(`display must be a STRING`); }
    if (method != "id" && method != "class" && method != "query") { throw new Error(`method must be "id" or "class" or "query"`); }

    if (method == "id") {
        target(element).style.display = display;
    }
    if (method == "class") {
        for (let i = 0; i < document.getElementsByClassName(element).length; i++) {
            document.getElementsByClassName(element)[i].style.display = display;
        }
    }
    if (method == "query") {
        for (let i = 0; i < document.querySelectorAll(element).length; i++) {
            document.querySelectorAll(element)[i].style.display = display;
        }
    }
}

/**
 * Turn an element's current color to another in transition.
 * @param {string} element - The id of target element
 * @param {string} color - The target color of transition
 * @param {number} time - （>= 1) The time length of transition in milliseconds
 * @example transColor("title", "#00dd00") // Turn the color of title to green in transition.
 */
async function transColor(element, color, time = 100) {
    if (typeof element != "string") { throw new Error(`element must be a STRING`); }
    if (typeof color != "string") { throw new Error(`color must be a STRING`); }
    if (typeof time != "number") { throw new Error(`time must be a NUMBER`); }
    if (time < 1) { throw new Error("Cannot change color in less than 1 milliseconds"); }

    const preset = { // Same as --textColor in global.css
        r: 102,
        g: 102,
        b: 102
    }
    let fromColor;
    let toColor;
    let nowColor;

    if (target(element).style.color != "") {
        fromColor = {
            r: getNum(target(element).style.color, 1),
            g: getNum(target(element).style.color, 2),
            b: getNum(target(element).style.color, 3)
        }
    } else {
        fromColor = preset;
    }

    if (color.indexOf("#") >= 0) {
        toColor = {
            r: parseInt(color.substring(1, 3), 16),
            g: parseInt(color.substring(3, 5), 16),
            b: parseInt(color.substring(5, 7), 16)
        }
    }
    if (color.indexOf("rgb(") >= 0) {
        toColor = {
            r: getNum(color, 1),
            g: getNum(color, 2),
            b: getNum(color, 3)
        }
    }

    const diff = {
        r: (toColor.r - fromColor.r) / 20,
        g: (toColor.g - fromColor.g) / 20,
        b: (toColor.b - fromColor.b) / 20
    }

    for (let i = 1; i <= 21; i++) {
        if (target(element).style.color != "") {
            nowColor = {
                r: getNum(target(element).style.color, 1),
                g: getNum(target(element).style.color, 2),
                b: getNum(target(element).style.color, 3)
            }
        } else {
            nowColor = preset;
        }
        if (i <= 20) {
            colorTo(element, `rgb(${nowColor.r + diff.r}, ${nowColor.g + diff.g}, ${nowColor.b + diff.b})`);
            await sleep(time / 20);
        } else {
            colorTo(element, color);
        }
    }
}

/**
 * Fade out an element.
 * @param {string} element - The id of target element
 * @param {number} time - (>= 1) The time length of fade out
 * @example fadeOut("title", 200) // Fade out #title in 0.2s.
 */
async function fadeOut(element, time = 100) {
    if (typeof element != "string") { throw new Error(`element must be a STRING`); }
    if (typeof time != "number") { throw new Error(`time must be a NUMBER`); }
    if (time < 1) { throw new Error("Cannot fade out in less than 1 milliseconds"); }

    let nowOpacity;

    if (target(element).style.opacity != "") {
        nowOpacity = parseFloat(target(element).style.opacity);
    } else {
        nowOpacity = 1;
    }
    while (nowOpacity > 0) {
        nowOpacity = nowOpacity - 0.05;
        target(element).style.opacity = nowOpacity;
        await sleep(time / 20);
    }
    if (nowOpacity <= 0) {
        hide(element);
        target(element).style.opacity = 0;
    }
}

/**
 * Fade in an element.
 * @param {string} element - The id of target element
 * @param {number} time - (>= 1) The time length of fade out
 * @example fadeOut("title", 200) // Fade in #title in 0.2s.
 */
async function fadeIn(element, time = 100) {
    if (typeof element != "string") { throw new Error(`element must be a STRING`); }
    if (typeof time != "number") { throw new Error(`time must be a NUMBER`); }
    if (time < 1) { throw new Error("Cannot fade in in less than 1 milliseconds"); }

    let nowOpacity;

    unhide(element);
    if (target(element).style.opacity != "") {
        nowOpacity = parseFloat(target(element).style.opacity);
    } else {
        nowOpacity = 0;
    }
    while (nowOpacity < 1) {
        nowOpacity = nowOpacity + 0.05;
        target(element).style.opacity = nowOpacity;
        await sleep(time / 20);
    }
}

/**
 * Fade out an element and fade in another element.
 * @param {string} outElement - The id of target element to fade out
 * @param {string} inElement - The id of target element to fade in 
 * @param {number} time - (>= 1) The total time length of whole change session
 * @example fadeChange("title", "secondTitle", 500) // Fade out #title in 0.25s and fade in #secondTitle in 0.25s.
 */
async function fadeChange(outElement, inElement, time = 200) {
    if (typeof outElement != "string") { throw new Error(`outElement must be a STRING`); }
    if (typeof inElement != "string") { throw new Error(`inElement must be a STRING`); }
    if (typeof time != "number") { throw new Error(`time must be a NUMBER`); }
    if (time < 1) { throw new Error("Cannot fade change in than 1 milliseconds"); }

    fadeOut(outElement, time / 2);
    await sleep(time / 2 + 20);
    fadeIn(inElement, time / 2);
}

// SAVE & LOAD

/**
 * Download a file with expected content.
 * @param {string} fileName - The name of the file to be downloaded
 * @param {any} content - The content of the file
 * @example save("readme.txt", "Please read this file.") // It'll download a file named readme.txt with "Please read this file."
 */
function save(fileName, content) {
    if (typeof fileName != "string") { throw new Error(`fileName must be a STRING`); }

    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

/**
 * Keeps copy the content from file in <input id="inputId" /> to an expected position.
 * @param {string} inputId - The id of input where the file receives
 * @param {string} element - The place to copy the file content
 * @example load("top-file", "fileInfo") // When a file is selected in <input id="top-file" />, its content will be copied to #fileInfo.
 */
function load(inputId, element = "file-content") {
    if (typeof inputId != "string") { throw new Error(`inputId must be a STRING`); }
    if (typeof element != "string") { throw new Error(`element must be a STRING`); }

    document.getElementById(inputId).addEventListener('change', (event) => {
        const fileInput = event.target;
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const fileContent = event.target.result;
                target(element).textContent = fileContent;
            };
            reader.readAsText(file);
        }
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

