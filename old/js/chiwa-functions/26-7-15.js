// CHIWA FUNCTIONS

/*
    Chiwa Functions is a custom JavaScript library used in ChiwaInori.top for better coding.

    Most of the functions included are original created by ChiwaInori.top owner Chiwa Inori.
    Chiwa Functions is coded for website developing, but some functions can be also used in Node.js environment.

    Chiwa Functions follows CC BY-NC-SA 4.0 International License.
    You can use Chiwa Functions with license followed, but notice Chiwa Functions is updating every time and we always keep the least compatibility.

    Originally called Inori Functions, name changed along with a major update (2025.1.17) related to HTML Elements.
    Originally called XTS Functions, name changed along with site owner's new name (2024.8.17) (xtsdcb69 -> Chiwa Inori).

    Index: (The "p" below means "prototype")

    Chiwa Basic (1): const chiwa
    Global Usage (24):
        Parameter Judgement (2): _type, _range
        Commands (3): sleep, overload, Object.p.nonEnum
        Website (5): siteId, navigate, seizure, bindKey, copyright
        URL Param (6): urlParam { set, get, getAll, remove, generate, clear }
        Storage (5): storage { set, get, getAll, remove, clear }
        Console Log (3): log, warn, error
        ProhibitedError extends Error
    JS Commands (18):
        Common (6): chance, Object.p.isolate, Array.p.add, Array.p.remove, String.p.getCountOf, Array.p.getCountOf
        Numeral (12):
            Get Numbers (3): rand, seed, String.p.getNum
            Modify Numbers (9): Number.p.close, Number.p.keep, Number.p.range, Number.p.percentage, Number.p.transit, Number.p.toRange, Number.p.keepRange, String.p.transBase, Number.p.toBase / BigInt.p.toBase
    HTML Elements (11):
        ChiwaSet (8): ChiwaSet { (accessible attributes), hide, unhide, toggleDisplay, transColor, fadeOut, fadeIn, event }, cw
        Accessibility (3): query, applyAll, fadeChange
    Save & Load (3): save, load, loadJSON
*/

/* eslint no-shadow: "off" */

// CHIWA BASIC

/**
 * Check if Chiwa Functions is available.
 * @example chiwa // If Chiwa Functions is available, get a version string in console.
 * @since xts.24-5-19
 * @version 25-1-21
*/
const chiwa = "26-7-15";
// Then update the backup in /old/js/.

// GLOBAL USAGE

// GLOBAL USAGE / PARAMETER JUDGEMENT

/**
 * Judge a parameter is in given type of not. If not, throw a TypeError.
 * @param {any} param - The parameter needed to be judged
 * @param {string} types - The given type (in lowercase) or instance (also accepts "array"; use "number | boolean" to accept multiple types)
 * @throws {TypeError} invalid-type - When the type of param isn't included in given types
 * @example _type("1", "number") // Throw a TypeError
 * @since inori.24-11-29-1
 * @version 25-6-5
*/
function _type(param, types) {
    const circularKey = {
        types: typeof types == "object" ? (() => { try { JSON.stringify(types); return null; } catch (e) { return e.message.match(/'(.*)' closes the circle/)[1]; } })() : null,
        param: typeof param == "object" ? (() => { try { JSON.stringify(param); return null; } catch (e) { return e.message.match(/'(.*)' closes the circle/)[1]; } })() : null
    };

    function returnError(required, received, checking) {
        const error = (() => {
            if (typeof received == "bigint") { return `${received}n`; }
            if (typeof received == "object") {
                if (circularKey[checking]) { return `a circular OBJECT (${circularKey[checking]}↺)`; }
            }
            if (typeof received == "function") { return "a FUNCTION"; }
            return JSON.stringify(received);
        })();
        throw Object.assign(new TypeError(`${required} required; received ${checking == "types" ? "target type is " : ""}${error}`), { cwErr: "invalid-type" });
    }

    if (typeof types != "string") { returnError("string", types, "types"); }

    for (const type of types.split(" | ")) {
        if (type == "any") { return; }
        if (type == "array" && Array.isArray(param)) { return; }
        if (type == typeof param) { return; }
        try { if (param instanceof eval(type)) { return; } } catch { continue; }
    }

    returnError(types, param, "param");
}

// When a number is need to be judged with a range, _type can be omitted. Its type will be judged in _range.

/**
 * Judge a number is in given range or not. If not, throw a RangeError.
 * @param {number | bigint} number - The number needed to be judged
 * @param {string} range - The given range ("N" means NATURAL NUMBER; "N+" means POSITIVE INTEGER; "%1=0" means INTEGER; others like JS expressions (">= 7", "< 1", ...); combination allowed (">= 1 | <= 2"))
 * @param {boolean} allowBigInt - Should the function allow bigint
 * @throws {RangeError} invalid-range - When the number isn't in given range
 * @example _range(0, ">= 1") // Throw a RangeError
 * @since inori.24-11-29-1
 * @version 25-6-5
 */
function _range(number, range, allowBigInt = false) {
    _type(number, `number${allowBigInt ? " | bigint" : ""}`);
    _type(range, "string");
    _type(allowBigInt, "boolean");

    for (const req of range.split(" | ")) {
        if (req == "N") {
            _range(number, "%1=0 | >= 0", allowBigInt);
        }

        if (req == "N+") {
            _range(number, "%1=0 | >= 1", allowBigInt);
        }

        if (req == "%1=0" && typeof number == "number" && number % 1 != 0) {
            throw Object.assign(new RangeError(`[%1=0] required; received ${number}`), { cwErr: "invalid-range" });
        }
        
        for (const operator of ["==", "!=", ">=", ">", "<=", "<"]) {
            if (req.includes(operator)) {
                if (!eval(`${number} ${operator} ${req.getNum()[0]}`)) {
                    throw Object.assign(new RangeError(`[${operator} ${req.getNum()[0]}] required; received ${typeof number == "bigint" ? `${number}n` : number}`), { cwErr: "invalid-range" });
                }
                break;
            }
        }
    }
}

// GLOBAL USAGE / COMMANDS

/**
 * Sleep a moment then execute following commands.
 * @param {number} time - (>= 0) Sleep time in milliseconds
 * @returns {Promise} A setTimeout promise
 * @example await sleep(1000) // Pause your commands for 1s (also: sleep(1000).then(() => { ... }))
 * @since xts.24-5-12
 * @version inori.24-11-29-3
 */
function sleep(time) {
    _range(time, ">= 0");
    if (time == 0) { return; }

    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Overload CPU to temporarily stop code for test. (Not recommended unless doing stress test)
 * @param {number} time - (>= 0) Overload time in milliseconds
 * @example overload(1000) // Overload CPU for 1s (Most of codes will be paused)
 * @since inori.24-10-1
 * @version inori.24-11-29-2
 */
function overload(time) {
    _range(time, ">= 0");
    if (time == 0) { return; }

    const startTime = Date.now();
    const endTime = startTime + time;

    while (Date.now() < endTime) {
        for (let i = 0; i < 1e8; i++) {
            Math.sqrt(i);
            if (Date.now() < endTime) { break; }
        }
    }
}

/**
 * Add a non-enumerable property to a object
 * @param {string} key - The key of the property
 * @param {any} value - The value of the property
 * @example obj.nonEnum("func", () => {}) // Add a non-enumerable function to obj
 * @since 25-1-17-2
 * @version 25-1-19-1
 */
Object.defineProperty(Object.prototype, "nonEnum", {
    value: function (key, value) {
        _type(key, "string");

        Object.defineProperty(this, key, { value, enumerable: false });
    },
    enumerable: false
});

// GLOBAL USAGE / WEBSITE

/**
 * Return a string of current page's site directory.
 * @returns {string} The site directory of current page in lowerCamelCase
 * @example siteId() // "mcOpcXts" if in https://chiwainori.top/mc/opc/xts/
 * @since 25-1-20
 * @version 25-3-21
 */
function siteId() {
    const url = window.location.pathname.split("/");
    let formatted = "";

    for (const part of url) {
        if (part == "") { continue; }
        const [first, later] = [part[0], part.slice(1)];
        formatted += `${formatted == "" ? first : first.toUpperCase()}${later}`;
    }

    return formatted.replaceAll(/([Ii]ndex|-|\..*$)/g, "") || "chiwa";
}

/**
 * Auto set the navigation bar for every pages loaded.
 * @example navigate() // Set the navigation bar automatically (You don't need to execute this function manually in most conditions.)
 * @since 25-5-16
 * @version 25-6-27
 */
async function navigate() {
    if (!cw("#cw-nav").el || siteId() == "chiwa") { return; }

    const page = {
        dir: ["ChiwaInori.top", ...window.location.href.replaceAll(/\?.*/g, "").split("/").slice(3, -1)],
        file: String(window.location.href.replaceAll(/\?.*/g, "").split("/").slice(-1)),
        isIndex: (/^\?|^index.html|^$/).test(String(window.location.href.split("/").slice(-1)))
    };

    const dir = await JSON.parse(await (await fetch("/dir.json")).text());

    let navHtml = "";

    page.dir.forEach((path, index) => {
        const name = dir.dict[path] || path;
        const notLast = index != page.dir.length - 1;
        const dirBack = "../".repeat(page.dir.length - index - 1) + (!page.isIndex && !notLast ? `../${path}` : "").replaceAll(/ChiwaInori\.top/g, "");

        if (dir.ignore.includes(path)) {
            navHtml += notLast ? `<span>${name}</span> &gt; `
                : page.isIndex ? `<span>${name}</span>`
                    : `<span>${name}</span> `;
        } else {
            navHtml += notLast ? `<a href="${dirBack}">${name}</a> &gt; `
                : page.isIndex ? `<span>${name}</span>`
                    : `<a href="${dirBack}">${name}</a> `;
        }
    });
    if (!page.isIndex) {
        navHtml += `<span>@ ${page.file}</span>`;
    }

    cw("#cw-nav").html = `<h6>${navHtml}</h6>`;
}
window.addEventListener("load", navigate);

/**
 * Pop up a seizure warning in page.
 * @param {any} cnText - The custom text in Chinese
 * @param {any} enText - The custom text in English
 * @param {any} jpText - The custom text in Japanese
 * @example seizure("本页面包含闪烁内容。", "This page includes flashing content.", "このページにはフラッシュのコンテンツがある。") // Create a seizure warning of specified text.
 * @since xts.24-6-7
 * @version 25-3-23
 */
async function seizure(cnText = "本页面包含可能会引起<strong>光敏性癫痫</strong>的内容。", enText = "This page include content that might cause <strong>photosensitive epilepsy.</strong>", jpText = "このページには、<strong>光感性てんかん</strong>を引き起こす可能性のある内容が含まれてるかも！") {
    const visited = storage.get("seizure");
    function preventScroll(event) {
        event.preventDefault();
    }

    if (cnText[0] == "_") {
        applyAll(".SEIZURE", el => el.close());
        if (cnText != "_close") {
            cw(`#${cnText.slice(3).toLowerCase()}Seizure`).el.showModal();
            storage.set("lang", cnText.slice(3).toLowerCase(), true);
        } else {
            document.body.style.overflow = "";
            window.removeEventListener("scroll", preventScroll);
            cw("#cw-main").style.filter = "brightness(1)";
            if (!visited) { storage.set("seizure", "1"); }
        }

        cw("#cnSeizureClose").text = "继续";
        cw("#enSeizureClose").text = "Continue";
        cw("#jpSeizureClose").text = "進む";
        return;
    }

    if (!cw("#cnSeizure").el) {
        cw("body").html += `<dialog id="cnSeizure" class="SEIZURE">
            <h3 style="color: var(--red);">! 光敏性癫痫警告 !</h3>
            <p>${cnText}</p>
            <p>极小部分人可能会在本页面上看到特定视觉图像（包括闪烁效果或图案）时<strong>出现癫痫症状</strong>。</p>
            <p>如果你的家人或任何家庭成员曾出现过类似症状，请在本页面进行操作前咨询你的医生。</p>
            <p>如果你出现<strong>头晕目眩、视力模糊、眼睛或面部抽搐、四肢抽搐、迷失方向感、精神错乱或短暂的意识丧失</strong>等症状，请<strong>立即停止浏览本页面并咨询医生</strong>。</p>
            <p style="text-align: right;"><strong>中文 | <span class="LNK" onclick="seizure('_toEN')">English</span> | <span class="LNK" onclick="seizure('_toJP')">日本語</span></strong></p>
            <p style="text-align: right;"><strong><span class="LNK" onclick="seizure('_close')">[<span id="cnSeizureClose" style="color: var(--activeColor-500)">继续</span>]</span></strong></p>
        </dialog>
        <dialog id="enSeizure" class="SEIZURE">
            <h3 style="color: var(--red);">! PHOTOSENSITIVE EPILEPSY WARNING !</h3>
            <p>${enText}</p>
            <p>A very small number of people may <strong>experience epilepsy symptoms</strong> when they see specific visual images (including flickering effects or patterns) on this page.</p>
            <p>If your family or any family member has experienced similar symptoms, please consult your doctor before proceeding with this page.</p>
            <p>If you experience symptoms such as <strong>dizziness, blurred vision, eye or facial twitching, limb twitching, disorientation, mental confusion, or brief loss of consciousness</strong>, please <strong>stop browsing this page IMMEDIATELY and consult a doctor</strong>.</p>
            <p style="text-align: right;"><strong><span class="LNK" onclick="seizure('_toCN')">中文</span> | English | <span class="LNK" onclick="seizure('_toJP')">日本語</span></strong></p>
            <p style="text-align: right;"><strong><span class="LNK" onclick="seizure('_close')">[<span id="enSeizureClose" style="color: var(--activeColor-500)">Continue</span>]</span></strong></p>
        </dialog>
        <dialog id="jpSeizure" class="SEIZURE">
            <h3 style="color: var(--red);">! 光感性てんかん注意 !</h3>
            <p>${jpText}</p>
            <p>ほんの一部の人が、特定のビジュアル（例えばピカピカした光や模様）を見たときに、<strong>てんかん症状が出ちゃう</strong>ことがあるんだ…。</p>
            <p>もし家族や身近な人に、似た症状が出たことがある人がいたら、このページを操作する前にお医者さんに相談してね！</p>
            <p>それから、自分で<strong>見ていてめまい、視界がぼやける、目や顔がピクピクする、手足がけいれんする、方向感覚がなくなる、混乱しちゃう、意識がなくなっちゃう…</strong>なんてことがあったら、<strong>すぐに閲覧をやめて、お医者さんに相談しようね</strong>！</p>
            <p>安全第一だよ、おにいちゃん (おねえちゃん)！<strong>(´；ω；\`)</strong></p>
            <p style="text-align: right;"><strong><span class="LNK" onclick="seizure('_toCN')">中文</span> | <span class="LNK" onclick="seizure('_toEN')">English</span> | 日本語</strong></p>
            <p style="text-align: right;"><strong><span class="LNK" onclick="seizure('_close')">[<span id="jpSeizureClose" style="color: var(--activeColor-500)">進む</span>]</span></strong></p>
        </dialog>`;
    }
    
    window.addEventListener("scroll", preventScroll, { passive: false });
    cw("body").style.overflow = "hidden";
    cw("#cw-main").style.filter = "brightness(0.7)";

    cw(`#${storage.get("lang", true) || "cn"}Seizure`).el.showModal();

    if (visited) {
        cw("#cnSeizureClose").text = "2.0s 后继续";
        cw("#enSeizureClose").text = "Continue in 2.0s";
        cw("#jpSeizureClose").text = "2.0s 後で進む";
        await sleep(500);
        if (!cw("#cnSeizureClose").text.includes("s")) { return; }
        cw("#cnSeizureClose").text = "1.5s 后继续";
        cw("#enSeizureClose").text = "Continue in 1.5s";
        cw("#jpSeizureClose").text = "1.5s 後で進む";
        await sleep(500);
        if (!cw("#cnSeizureClose").text.includes("s")) { return; }
        cw("#cnSeizureClose").text = "1.0s 后继续";
        cw("#enSeizureClose").text = "Continue in 1.0s";
        cw("#jpSeizureClose").text = "1.0s 後で進む";
        await sleep(500);
        if (!cw("#cnSeizureClose").text.includes("s")) { return; }
        cw("#cnSeizureClose").text = "0.5s 后继续";
        cw("#enSeizureClose").text = "Continue in 0.5s";
        cw("#jpSeizureClose").text = "0.5s 後で進む";
        await sleep(500);
        if (!cw("#cnSeizureClose").text.includes("s")) { return; }
        seizure("_close");
    }
}

/**
 * Set default key of button to page.
 * @param {HTMLElement | function} target - The element to click or function to execute when key is released (default)
 * @param {string} key - The key to set
 * @param {"keyup" | "keydown"} action -  The event type of key actions
 * @param {string} combine - Should combination required ("ctrl", "shift", "alt") or prohibited ("noCtrl", "noShift", "noAlt")
 * @since 25-3-21
 * @version 26-7-15
 */
function bindKey(target, key = "Enter", action = "keyup", combine = "") {
    _type(target, "HTMLElement | function");
    _type(key, "string");
    if (action != "keyup" && action != "keydown") { throw Object.assign(new TypeError(`method must be "keyup" or "keydown"`), { cwErr: "f-bindKey-invalidAction" }); }
    _type(combine, "string");

    document.addEventListener(action, e => {
        if (e.code == key) {
            if (combine.includes("ctrl") && !e.ctrlKey) { return; }
            if (combine.includes("shift") && !e.shiftKey) { return; }
            if (combine.includes("alt") && !e.altKey) { return; }
            if (combine.includes("noCtrl") && e.ctrlKey) { return; }
            if (combine.includes("noShift") && e.shiftKey) { return; }
            if (combine.includes("noAlt") && e.altKey) { return; }

            if (target instanceof HTMLElement) {
                target.click();
            }
            if (typeof target == "function") {
                target(e);
            }
        }
    });
}

/**
 * Create a copyright text in #copyright.
 * @param {number | bigint} startYear - (%1=0 | <= new Date().getFullYear()) The year that copyright starts
 * @param {any} signature - Who owns the copyright
 * @throws {ReferenceError} f-copyright-noEl - When html has no #copyright element
 * @example copyright(2021, "Anonymous") // Create a copyright owned by Anonymous, starting from 2021
 * @since xts.24-4-30
 * @version 25-6-5
 */
function copyright(startYear, signature = "<ruby>千和<rt>ちわ</rt></ruby> いのり") {
    _range(startYear, "%1=0", true);
    if (!cw("#copyright").el) { throw Object.assign(new ReferenceError("Cannot set a copyright without #copyright element"), { cwErr: "f-copyright-noEl" }); }

    const thisYear = new Date().getFullYear();
    _range(startYear, `<= ${thisYear}`, true);

    cw("#copyright").html = `Copyright &copy; ${startYear}${startYear == thisYear ? "" : `-${thisYear}`} ${signature}. All Rights Reserved.`;
}

// GLOBAL USAGE / URL PARAM
// You can access and modify URL Params with using urlParam functions in ChiwaInori.top.

// eslint-disable-next-line func-names
const urlParam = new function urlParam() {
    /**
     * Set or update the param to URL (.../...?key1=value1&key2=value2).
     * @param {string} key - The key of param
     * @param {any} value - The value being set
     * @returns {object} Use (...).reload() to set param with reload
     * @example urlParam.set("result", "abcdef") // Update URL bar to .../...?result=abcdef
     * @since xts.24-7-11-3
     * @version 25-3-2-2
     */
    this.nonEnum("set", (key, value) => {
        _type(key, "string");

        if (!window.location.href.includes(`${key}=`)) {
            history.replaceState(null, "", `${window.location.href}${!window.location.href.match(/\?/g) ? "?" : "&"}${key}=${value}`);
        } else {
            history.replaceState(null, "", `${window.location.href.replaceAll(new RegExp(`(\\?|&)${key}=[^&]*`, "g"), `$1${key}=${value}`)}`);
        }

        return { reload() { location.reload(); } };
    });

    /**
     * Get the param from URL (.../...?key1=value1&key2=value2).
     * @param {string} key - The param key to get from URL
     * @returns {string | null} The value of the param
     * @example urlParam.get("userID") // Return the value of ?userID=...
     * @since xts.24-7-11-1
     * @version 25-3-2-2
     */
    this.nonEnum("get", key => {
        _type(key, "string");

        return new URLSearchParams(window.location.search).get(key);
    });

    /**
     * Get all param from URL (.../...?key1=value1&key2=value2).
     * @param {string} url - The URL to get all params (current URL for default)
     * @returns {object} A object with all params
     * @example urlParam.getAll() // Return a object with all params
     * @since 25-1-17
     * @version 25-1-19
     */
    this.nonEnum("getAll", (url = window.location.href) => {
        const obj = {};

        if (url.includes("?")) {
            const paramList = url.split("?")[1].split("&");

            for (const keyValue of paramList) {
                obj[keyValue.split("=")[0]] = keyValue.split("=")[1];
            }
        }

        return obj;
    });

    /**
     * Remove a param from URL (.../...?key1=value1&key2=value2).
     * @param {string} key - The param key to remove from URL
     * @returns {object} Use (...).reload() to remove param with reload
     * @example urlParam.remove("result") // Update URL bar with "result" param removed
     * @since 25-1-17
     * @version 25-3-2-2
     */
    this.nonEnum("remove", key => {
        _type(key, "string");

        history.replaceState(null, "", `${window.location.href.replaceAll(new RegExp(`(\\?|&)${key}=[^&]*`, "g"), "").replaceAll(/\/&/g, "/?")}`);

        return { reload() { location.reload(); } };
    });

    /**
     * Generate a string of current URL and values in obj.
     * @param {object} obj  - The params to be added (overridden if already exists) to URL
     * @param {boolean} clearExist - Should generator clear existing params
     * @returns {string} A string with current URL added with values in obj
     * @throws {TypeError} f-urlParamGenerate-object2URL - When obj has an object (except array) as value
     * @example urlParam.generate({ result: "ok" }) // "https://chiwainori.top/?result=ok"
     * @since 25-1-17
     * @version 26-6-20
     */
    this.nonEnum("generate", (obj, clearExist = false) => {
        _type(obj, "object");
        
        let url = clearExist ? window.location.origin : window.location.href;
        for (const key in obj) {
            if (typeof obj[key] == "function" || typeof obj[key] == "object") {
                throw Object.assign(new TypeError("Cannot convert object value into URL"), { cwErr: "f-urlParamGenerate-object2URL" });
            }
            
            if (!url.includes(key)) {
                url += `${!url.includes("?") ? "?" : "&"}${key}=${obj[key].replaceAll(/ /g, "%20")}`;
            } else {
                url = url.replaceAll(new RegExp(`(\\?|&)${key}=[^&]*`, "g"), `$1${key}=${obj[key].replaceAll(/ /g, "%20")}`);
            }
        }

        return url;
    });

    /**
     * Clear all param from URL.
     * @example urlParam.clear() // All characters after "?" in URL bar will be removed
     * @returns {object} Use (...).reload() to clear param with reload
     * @since 25-1-17
     * @version 25-2-28
     */
    this.nonEnum("clear", () => {
        history.replaceState(null, "", `${window.location.href.split("?")[0]}`);

        return { reload() { location.reload(); } };
    });
}();

// GLOBAL USAGE / STORAGE
// You can access and modify Local Storage with using storage functions in ChiwaInori.top.
// Normally they will be auto-limited to access storage under current page. You can use global sign to access all stored values in ChiwaInori.top.

// eslint-disable-next-line func-names
const storage = new function storage() {
    /**
     * Set or update a value to localStorage.
     * @param {string} key - The key of storage
     * @param {any} value - The value being set
     * @param {boolean} global - If true, key name won't add siteId as default
     * @returns {object} Use (...).reload() to set storage with reload
     * @example storage.set("result", "abcdef") // Update a storage value result=abcdef
     * @since 25-3-1
     * @version 25-3-2-2
     */
    this.nonEnum("set", (key, value, global = false) => {
        _type(key, "string");
        _type(global, "boolean");

        localStorage.setItem(`${!global ? `${siteId()}_` : ""}${key}`, value);

        return { reload() { location.reload(); } };
    });

    /**
     * Get the stored value from localStorage.
     * @param {string} key - The key of storage
     * @param {boolean} global - If true, key name won't add siteId as default
     * @returns {string | null} The stored value
     * @example storage.get("userID") // Return the value of userID stored
     * @since 25-3-1
     * @version 25-3-2-2
     */
    this.nonEnum("get", (key, global = false) => {
        _type(key, "string");
        _type(global, "boolean");

        return localStorage.getItem(`${!global ? `${siteId()}_` : ""}${key}`);
    });

    /**
     * Get all stored value from localStorage.
     * @param {boolean} global - If true, all values under current domain will be gotten
     * @returns {object} All stored value
     * @example storage.getAll() // Get all stored values in current page
     * @since 25-3-1
     * @version 25-3-1
     */
    this.nonEnum("getAll", (global = false) => {
        _type(global, "boolean");

        const obj = {};
        for (const key in localStorage) {
            if ((global || key.includes(`${siteId()}_`)) && localStorage.getItem(key) != null) {
                obj[!global ? key.split("_")[1] : key] = localStorage.getItem(key);
            }
        }

        return obj;
    });

    /**
     * Remove a value from localStorage.
     * @param {string} key - The key of storage to remove from localStorage
     * @param {boolean} global - If true, key name won't add siteId as default
     * @returns {object} Use (...).reload() to remove value with reload
     * @example storage.remove("result") // Update localStorage with "result" removed
     * @since 25-3-1
     * @version 25-3-2-2
     */
    this.nonEnum("remove", (key, global = false) => {
        _type(key, "string");
        _type(global, "boolean");

        localStorage.removeItem(`${!global ? `${siteId()}_` : ""}${key}`);

        return { reload() { location.reload(); } };
    });

    /**
     * Clear stored values from localStorage.
     * @param {boolean} global - If true, all values under current domain will be cleared
     * @returns {object} Use (...).reload() to clear values with reload
     * @example storage.clear() // Clear all stored values in current page
     * @since 25-3-1
     * @version 25-3-1
     */
    this.nonEnum("clear", (global = false) => {
        _type(global, "boolean");

        for (const key in localStorage) {
            if (global || key.includes(`${siteId()}_`)) {
                localStorage.removeItem(key);
            }
        }

        return { reload() { location.reload(); } };
    });
}();

// GLOBAL USAGE / CONSOLE LOG

/**
 * Log variants in console by using less characters.
 * @param {any} args - The variant to output in console
 * @example log(score1, score2) // Output score1 and score2
 * @since xts.24-4-21
 * @version inori.24-11-29
 */
function log(...args) {
    console.log(...args);
}

/**
 * Output a warn with stack information.
 * @param {any} message - The content of warn message
 * @example warn("Dangerous variant.") // Output a warn with stack.
 * @since xts.24-7-11
 * @version inori.24-9-15
 */
function warn(message) {
    try {
        throw new Error();
    } catch (e) {
        console.warn(e.stack.replaceAll(/Error/g, `Warn: ${message}`)
            .replaceAll(/\n {4}at warn \(.*\)/g, "")
            .replaceAll(/https?:\/\/.*\//g, ""));
    }
}

/**
 * Output an error without stopping codes.
 * @param {Error} type - The type of error
 * @param {any} message - The content of warn message
 * @throws {TypeError} f-error-invalidType - When error type is invalid
 * @example error(ReferenceError, "No target found") // Output an error and let code continue.
 * @since 25-2-28
 * @version 25-6-5
 */
function error(type, message) {
    if (!(type.prototype instanceof Error)) {
        throw Object.assign(new TypeError(`${type} is not an available error type`), { cwErr: "f-error-invalidType" });
    }

    try {
        throw new Error();
    } catch (e) {
        console.error(e.stack.replaceAll(/Error/g, `Unstoppable ${String(type).match(/[A-Z].*?Error/)[0]}: ${message}`)
            .replaceAll(/\n {4}at error \(.*\)/g, "")
            .replaceAll(/https?:\/\/.*\//g, ""));
    }
}

// GLOBAL USAGE / PROHIBITED ERROR

class ProhibitedError extends Error {
    /**
     * Construct a ProhibitedError which extending from Error. Use it when some actions are prohibited due to reasons.
     * @param {any} message - The message of ProhibitedError
     * @returns {ProhibitedError} The ProhibitedError to throw
     * @example new ProhibitedError("Unauthorized action") // Throw a ProhibitedError
     * @since 25-2-28
     * @version 25-2-28
     */
    constructor(message) {
        super(message);
        this.name = "ProhibitedError";
    }
}

// JS COMMANDS / COMMON

/**
 * Return true in a specified chance.
 * @param {number} percent - The chance of returning true
 * @returns {boolean} true or false in specified chance
 * @example chance(0.6) // It has 60% chance to return true
 * @since xts.24-7-13-1
 * @version inori.24-11-29-1
 */
function chance(percent) {
    _type(percent, "number");

    return rand(0, 1, true) <= percent;
}

/**
 * Deep clone (isolate) an array / object.
 * @returns {object} The deep clone result
 * @example [1, 2, [3, {id: 4}, 5]].isolate() // [1, 2, [3, {id: 4}, 5]]
 * @since xts.24-7-30
 * @version 25-1-17-2
 */
Object.prototype.nonEnum("isolate", function () {
    const obj = this.valueOf();

    if (obj === null || typeof obj != "object") { // Neither an array nor an object
        return obj;
    }

    if (Array.isArray(obj)) { // Is an array
        const arrIsolated = [];
        obj.forEach((item, index) => {
            arrIsolated[index] = item.isolate();
        });
        return arrIsolated;
    }

    const objIsolated = {}; // Is an object
    Object.keys(obj).forEach(key => {
        objIsolated[key] = obj[key].isolate();
    });
    return objIsolated;
});

/**
 * Add specified value after an array n times
 * @param {any} value - The value to add
 * @param {number} n - (%1=0 | >= 0) The count of value to be added
 * @returns {array} The array after addition
 * @example [0, 6, 0, 1].add(0, 4) // [0, 6, 0, 1, 0, 0, 0, 0]
 * @since 25-3-15
 * @version 25-3-15
 */
Array.prototype.nonEnum("add", function (value, n = 1) {
    _range(n, "%1=0 | >= 0");

    const arr = this.isolate();

    for (let i = 1; i <= n; i++) {
        arr.push(value);
    }

    return arr;
});

/**
 * Return an array with the nth specified target removed.
 * @param {any} target - The target to remove
 * @param {number | bigint} nth - (%1=0 | >= 1) The nth specified target to remove
 * @returns {any[]} The array without (one of) the target(s)
 * @example [1, 2, 3, 4, 3].remove(3, 2) // [1, 2, 3, 4]
 * @since xts.24-7-30
 * @version 25-1-21-1
 */
Array.prototype.nonEnum("remove", function (target, nth = 1) {
    _range(nth, "%1=0 | >= 1", true);
    
    let n = 0;
    let index;
    for (let i = 0; i < this.length; i++) {
        if (this[i] == target) {
            n++;
        }
        if (n == nth) {
            index = i;
            break;
        }
        if (i == this.length - 1 && n < nth) {
            return this.isolate();
        }
    }

    const arr = [];

    for (let i = 0; i < index; i++) { // Push value that is before index
        arr.push(this[i]);
    }
    for (let i = index + 1; i < this.length; i++) { // Push value that is after index
        arr.push(this[i]);
    }

    return arr;
});

/**
 * Get the count of specified string in a string
 * @param {any} target - The target to count
 * @returns {number} How many targets are in the string
 * @example "Hello, World".getCountOf("l") // 3
 * @since xts.24-7-30
 * @version 25-1-21-1
 */
String.prototype.nonEnum("getCountOf", function (target) {
    return this.split(target).length - 1;
});

/**
 * Get the count of specified value in an array
 * @param {any} target - The target to count
 * @returns {number} How many targets are in the array
 * @example [0, 6, 0, 1].getCountOf(0) // 2
 * @since 25-3-14
 * @version 25-3-14
 */
Array.prototype.nonEnum("getCountOf", function (target) {
    let sum = 0;

    for (const value of this) {
        if (value === target) { sum++; }
    }

    return sum;
});

// JS COMMANDS / NUMERAL
/* Hint: In Chiwa Functions, these functions aren't affected by precision loss of JavaScript.
    seed
    String.p.transBase
    BigInt.p.toBase
*/

// JS COMMANDS / NUMERAL / GET NUMBERS

/**
 * Return a random integer.
 * @param {number} min - (<= max) The minimum value of the random integer
 * @param {number} max - (>= min) The maximum value of the random integer
 * @param {boolean} keepFloat - Should the function returns a float number instead of integer
 * @returns {number} The result of randomized number ( not keepFloat: [min, max] in integers; keepFloat: [min, max), specially when min == max, return min or max )
 * @example rand(1, 10, true) // Generate a random number (including fractions) in [1, 10)
 * @since xts.24-4-21
 * @version inori.24-11-29-1
 */
function rand(min, max, keepFloat = false) {
    _range(min, `<= ${max}`);
    _range(max, `>= ${min}`);
    _type(keepFloat, "boolean");

    let range;

    if (keepFloat) {
        range = max - min;
        return Math.random() * range + min;
    }

    range = max - min + 1;
    return Math.floor(Math.random() * range) + min;
}

/**
 * Return a seeded random number.
 * @param {any} value - The seed of random number
 * @param {number[]} key - The key to generate a random number
 * @returns {number} A seeded random number ranged in [0, 1)
 * @throws {TypeError} f-seed-emptyKey - When key is an empty array
 * @example seed("Hello", [2, 3, 5, 7]) // 0.19005963127801806 (A seeded random number)
 * @since inori.24-11-2
 * @version 25-7-15
 */
function seed(value, key = [18.9321, 45.8102, 33.9644, 13.5316, 26.0933, 36.2477, 10.3852, 34.6451, 35.6494, 15.1388, 13.6445, 21.7268, 41.8944, 12.3794, 15.0947, 26.2843]) {
    _type(key, "array");
    if (key.length == 0) { throw Object.assign(new TypeError(`key must be NOT EMPTY`), { cwErr: "f-seed-emptyKey" }); }
    for (const keyValue of key) { _type(keyValue, "number"); }

    const seedValue = typeof value == "bigint" ? JSON.stringify(`BIGINT_${String(value)}`) : JSON.stringify(value);

    let number = 0;
    for (let i = 0; i < seedValue.length; i++) {
        number += seedValue.charCodeAt(i) * key[i % key.length];
        if (number > Number.MAX_SAFE_INTEGER / Math.E || number < Number.MIN_SAFE_INTEGER / Math.E) { number = key[0]; }
    }

    return Math.abs(number * Math.E % 1);
}

/**
 * Return a selected number in a string.
 * @param {boolean} doNotNumber - Should the function return string array instead of number array (to avoid precision loss)
 * @returns {number[] | string[] | null} The number array from specified string
 * @example "589brg13d7.4gh,-2.6eru".getNum()[3] // 7.4 (It'll collect [589, 13, 7.4, -2.6])
 * @since xts.24-5-1-1
 * @version 25-1-17-2
 */
String.prototype.nonEnum("getNum", function (doNotNumber = false) {
    _type(doNotNumber, "boolean");

    const numbersList = this.match(/-?[0-9]+(\.[0-9]+)?/g);

    return numbersList && (doNotNumber ? numbersList : numbersList.map(Number));
});

// JS COMMANDS / NUMERAL / MODIFY NUMBERS

/**
 * Check if the given number's difference to target number is less than 1e-12.
 * @param {number} target - The target number to check
 * @returns {boolean} Is the two number close enough
 * @example (61).close(61.00000000000002) // true
 * @since 25-2-28
 * @version 25-2-28
 */
Number.prototype.nonEnum("close", function (target) {
    _type(target, "number");
    
    return Math.abs(this - target) < 1e-12;
});

/**
 * Keep a specified decimal place(s) to a number.
 * @param {number} digit - (%1=0) How many decimal places to keep (0 to parseInt, negative to keep at the left of decimal point)
 * @returns {number} The number kept specified decimal place(s)
 * @example (123.456).keep(2) // 123.46
 * @since inori.24-8-29-1
 * @version 26-6-18
 */
Number.prototype.nonEnum("keep", function (digit = 0) {
    _range(digit, "%1=0");
    
    if (this == 0 || this == Infinity || this == -Infinity || isNaN(this)) {
        return Number(this);
    }

    if (!Math.abs(this).range(1e-6, 1e21)) {
        const [mantissa, exponent] = String(this).getNum();

        return Number(`${mantissa.keep(digit)}e${exponent}`);
    }

    return Math.round(this * 10 ** digit) / 10 ** digit;
});

/**
 * Check the number is in given interval or not
 * @param {number | bigint} min - (<= max) The minimum value of interval
 * @param {number | bigint} max - (>= min) The maximum value of interval
 * @param {boolean} minType - The left border of interval (true: closed; false: open)
 * @param {boolean} maxType - The right border of interval (true: closed; false: open)
 * @returns {boolean} Is the number in the given interval
 * @example (5).range(0, 5, true, false) // false (not in [0, 5) range)
 * @since inori.24-10-2
 * @version 25-1-21-1
 */
Number.prototype.nonEnum("range", function (min, max, minType = true, maxType = true) {
    _range(min, `<= ${max}`, true);
    _range(max, `>= ${min}`, true);
    _type(minType, "boolean");
    _type(maxType, "boolean");

    return (minType ? this >= min : this > min) && (maxType ? this <= max : this < max);
});

/**
 * Scale a number to a percentage in given range. (The reverse function of Number.p.transit)
 * @param {number} from - The number where scales from
 * @param {number} to - The number where scales to
 * @param {boolean} disableRange - Should the function don't keep the percentage in [0, 1]
 * @returns {number} A percentage in range and specified number
 * @example (6).percentage(0, 10) // 0.6 (6 is the 60% in [0, 10])
 * @since inori.24-11-2
 * @version 25-1-17-2
 */
Number.prototype.nonEnum("percentage", function (from, to, disableRange = false) {
    _type(from, "number");
    _type(to, "number");
    _type(disableRange, "boolean");

    const range = to - from;

    return disableRange ? (this - from) / range : ((this - from) / range).toRange(0, 1);
});

/**
 * Scale a percentage to given range. (The reverse function of Number.p.percentage)
 * @param {number} from - The number where scales from
 * @param {number} to - The number where scales to
 * @param {boolean} disableRange - Should the function don't keep the percentage in [0, 1]
 * @returns {number} A number in range and specified percentage
 * @example (0.6).transit(0, 10) // 6 (The 60% of  [0, 10] is 6)
 * @since xts.24-7-13
 * @version 25-1-17-2
 */
Number.prototype.nonEnum("transit", function (from, to, disableRange = false) {
    _type(from, "number");
    _type(to, "number");
    _type(disableRange, "boolean");

    const range = to - from;

    return (disableRange ? this : this.toRange(0, 1)) * range + from;
});

/**
 * Return a number within given range.
 * If the number is out of range, a warning message can be provided.
 * @param {number | bigint} minBoundary - (<= maxBoundary) The boundary of minimum
 * @param {number | bigint} maxBoundary - (>= minBoundary) The boundary of maximum
 * @param {boolean} warnIfWorked - Should the function warn in console if itself worked
 * @returns {number} The number been parsed into range
 * @example (120).toRange(0, 100) // 100 (120 is out of [0, 100], so output 100)
 * @since xts.24-7-13
 * @version 25-1-21-1
 */
Number.prototype.nonEnum("toRange", function (minBoundary, maxBoundary, warnIfWorked = false) {
    _range(minBoundary, `<= ${maxBoundary}`, true);
    _range(maxBoundary, `>= ${minBoundary}`, true);
    _type(warnIfWorked, "boolean");
    
    if (warnIfWorked && (this < minBoundary || this > maxBoundary)) { warn(`Given number isn't between ${minBoundary} and ${maxBoundary} (received ${this}). Parsing it into given range.`); }
    
    return Math.min(Math.max(this, minBoundary), maxBoundary);
});

/**
 * Parse a number into given range with greater than (>) or less than (<).
 * @param {number | bigint} min - (<= max) The minimum value of interval
 * @param {number | bigint} max - (>= min) The maximum value of interval
 * @returns {string} The parsed number
 * @example (-1).keepRange(0, 10) // "<0"
 * @since 25-2-28
 * @version 25-2-28
 */
Number.prototype.nonEnum("keepRange", function (min, max) {
    _range(min, `<= ${max}`, true);
    _range(max, `>= ${min}`, true);

    return this < min ? `<${min}` : this > max ? `>${max}` : String(this);
});

/**
 * Parse a non-negative integer string from a base into another base. (BigInt used: no precision loss)
 * @param {number | bigint} fromBase - (%1=0 | >= 2 | <= 36) The original base
 * @param {number | bigint} toBase - (%1=0 | >= 2 | <= 36) The target base
 * @returns {string} The number string parsed into another base
 * @throws {TypeError} f-transBase-noOriginal - When toBase isn't defined
 * @throws {RangeError} f-transBase-outOfRange - When received number exceeds the base range (e.g. G in 16 base)
 * @example "CHIWACHIRASE".transBase(36, 10) // "1643534305147807070"
 * @since inori.24-12-8
 * @version 25-6-5
*/
String.prototype.nonEnum("transBase", function (fromBase, toBase) {
    if (toBase == undefined) { throw Object.assign(new TypeError("When using String.p.transBase, the ORIGINAL base MUST be declared."), { cwErr: "f-transBase-noOriginal" }); }
    if (this.match(/\.[0-9]/g)) { throw Object.assign(new RangeError(`%1=0 required; received ${this}`), { cwErr: "invalid-type" }); }
    if (this.match(/-[^0]/g)) { throw Object.assign(new RangeError(`>= 0 required; received ${this}`), { cwErr: "invalid-type" }); }
    _range(fromBase, "%1=0 | >= 2 | <= 36", true);
    _range(toBase, "%1=0 | >= 2 | <= 36", true);
    
    const numberList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    if (fromBase == 10) {
        const firstAlphabet = this.match(/[A-Za-z]/g)?.[0];
        if (firstAlphabet) { throw Object.assign(new RangeError(`Received number ${firstAlphabet} (${numberList.indexOf(firstAlphabet)}) when parsing from base ${fromBase}`), { cwErr: "f-transBase-outOfRange" }); }

        const modList = [];
        let nowRemaining = BigInt(this.toUpperCase().replaceAll(".", ""));
        
        while (nowRemaining != 0n) {
            modList.push(String(nowRemaining % BigInt(toBase)));
            nowRemaining /= BigInt(toBase);
        }
        if (!modList[0]) { modList.push(0); }
    
        modList.reverse();
        modList.forEach((number, index) => {
            modList[index] = numberList[number];
        });
    
        return modList.join("");
    }
    
    if (toBase == 10) {
        const digits = this.toUpperCase().replaceAll(".", "").split("");
        const equalDigits = [];
        const digitWeight = [];
        
        digits.forEach(digit => {
            const equalValue = BigInt(numberList.indexOf(digit));
            try { _range(equalValue, `< ${fromBase}`, true); } catch { throw Object.assign(new RangeError(`Received number ${digit}${numberList.indexOf(digit) >= 10 ? ` (${equalValue})` : ""} when parsing from base ${fromBase}`), { cwErr: "f-transBase-outOfRange" }); }
            
            equalDigits.push(equalValue);
        });
        for (let i = 0n; i < this.length; i++) {
            digitWeight.unshift(BigInt(fromBase) ** i);
        }
        
        let result = 0n;
        for (let i = 0; i < this.length; i++) {
            result += equalDigits[i] * digitWeight[i];
        }
        
        return String(result);
    }

    return this.valueOf().transBase(fromBase, 10).transBase(10, toBase);
});

/**
 * Parse a non-negative decimal integer into another base. (To prevent precision loss for large number, input BigInt)
 * This is actually String.p.transBase, but simplified for Number and BigInt.
 * @param {number | bigint} base - (%1=0 | >= 2 | <= 36) The target base
 * @param {undefined} _ - The param position to prevent mistyping
 * @returns {string} The number string parsed into another base
 * @throws {TypeError} f-toBase-hasOriginal - When more than 1 variant is given.
 * @example (601).toBase(16) // "259" (turned 601 into 0x259)
 * @since inori.24-12-8
 * @version 25-6-5
 */
Number.prototype.nonEnum("toBase", function (base, _) {
    if (_ != undefined) { throw Object.assign(new TypeError("When using Number.p.toBase, the ORIGINAL base MUSTN'T be declared (it can only be decimal)."), { cwErr: "f-toBase-hasOriginal" }); }
    _range(this.valueOf(), "%1=0 | >= 0");
    _range(base, "%1=0 | >= 2 | <= 36", true);
    
    if (this > Number.MAX_SAFE_INTEGER || this < Number.MIN_SAFE_INTEGER) { warn(`${this} reaches the safe integer, which may cause precision loss. If available, use BigInt or String instead.`); }
    
    return String(this).transBase(10, base);
});
BigInt.prototype.nonEnum("toBase", function (base, _) {
    if (_ != undefined) { throw Object.assign(new TypeError("When using BigInt.p.toBase, the ORIGINAL base MUSTN'T be declared (it can only be decimal)."), { cwErr: "f-toBase-hasOriginal" }); }
    _range(this.valueOf(), "%1=0 | >= 0", true);
    _range(base, "%1=0 | >= 2 | <= 36", true);
    
    return String(this).transBase(10, base);
});

// HTML ELEMENTS

// HTML ELEMENTS / CHIWASET
// ChiwaSet: A new class with custom information of a single element. Convenient for some specified values / functions.

class ChiwaSet {
    /**
     * Construct a ChiwaSet with a specified element.
     * @param {string | HTMLElement} element - An element's query selector or itself
     * @param {number | bigint} index - (%1=0 | >= 0) The index of element in query selector
     * @param {boolean} force - Should constructor force a targeted element instead of auto-fixing
     * @returns {ChiwaSet} A ChiwaSet with specified element
     * @throws {SyntaxError} f-cw-readOnly - When trying to modify read-only attributes
     * @example new ChiwaSet("p", 1) // A ChiwaSet with the index 1 (2nd) p element
     * @since 25-1-12
     * @version 25-7-15-1
     */
    constructor(element, index = 0, force = false) {
        _type(element, "string | HTMLElement");
        _range(index, "%1=0 | >= 0", true);

        if (element instanceof HTMLElement) {
            this.el = element;
        } else if (query(element)[index] || (/^[#.]/).test(element)) {
            this.el = query(element)[index] || null;
        } else if (!force && query(`#${element}`)[index]) {
            this.el = query(`#${element}`)[index];
            warn(`ChiwaSet of #${element} (index ${index}) was created since there was no ${element} (index ${index}) on the page. To prevent auto-fixes, set force to true.`);
        } else if (!force && query(`.${element}`)[index]) {
            this.el = query(`.${element}`)[index];
            warn(`ChiwaSet of .${element} (index ${index}) was created since there was no ${element} (index ${index}) on the page. To prevent auto-fixes, set force to true.`);
        } else {
            this.el = null;
        }
        
        if (this.el == null) { warn(`ChiwaSet of an inexistent element ${element} is created.`); }
    }

    // Get / Set Editable Attributes

    get html() { return this.el.innerHTML; }
    set html(value) { this.el.innerHTML = value; }

    get text() { return this.el.innerText; }
    set text(value) { this.el.innerText = value; }

    get style() { return this.el.style; }
    set style(value) { this.el.style = value; }

    get color() { return this.style.color; }
    set color(value) { this.style.color = value; }

    get value() { return this.el.value ?? null; }
    set value(value) { this.el.value = value; }

    get checked() { return this.el.checked ?? null; }
    set checked(value) { this.el.checked = value; }

    get disabled() { return this.el.disabled ?? null; }
    set disabled(value) { this.el.disabled = value; }
    
    // Get Uneditable Attributes

    get hidden() { return this.style.display == "none" || this.style.opacity == "0" || this.el.hidden && this.style.display == ""; }
    set hidden(value) { throw Object.assign(new TypeError("ChiwaSet.hidden is read-only. Use ChiwaSet.hide or ChiwaSet.unhide."), { cwErr: "f-cw-readOnly" }); }

    // Element Functions
    // These are functions to modify element in ChiwaSet, while they were originally independent function in Inori Functions

    /**
     * Hide the element.
     * @example { ChiwaSet }.hide() // Hide the element
     * @since xts.24-4-21
     * @version 25-1-12
     */
    hide = () => {
        this.style.display = "none";
    };

    /**
     * Show the element with expected display method.
     * @param {string} display - The type of display
     * @example { ChiwaSet }.unhide("inline") // Show the element as "inline"
     * @since xts.24-4-21
     * @version 25-1-12
     */
    unhide = (display = "block") => {
        _type(display, "string");

        this.style.display = display;
    };

    /**
     * Hide or unhide an element by condition.
     * @param {any} condition - The condition to hide or unhide the element (if true, unhide)
     * @param {string} display - The type of display if unhide
     * @example { ChiwaSet }.toggleDisplay(judgment) // If judgment is true, unhide; else, hide
     * @since inori.24-12-31
     * @version 25-1-17
     */
    toggleDisplay = (condition, display = "block") => {
        _type(display, "string");

        if (condition) {
            this.unhide(display);
        } else {
            this.hide();
        }
    };

    /**
     * Turn an element's current color to another in transition.
     * @param {string} color - The target color of transition
     * @param {number} time -（>= 0) The time length of transition in milliseconds
     * @example { ChiwaSet }.transColor("var(--green)") // Turn the color to green in transition.
     * @since xts.24-5-1-1
     * @version 25-1-19
     */
    transColor = async (color, time = 100) => {
        _type(color, "string");
        _range(time, ">= 0");

        if (time == 0) {
            this.color = color;
            return;
        }

        let id = 1;
        while (cw(`style#temp${id}`).el) {
            log(id);
            id++;
        }
        const styleElement = document.createElement("style");
        styleElement.textContent = `.tempTransColor${id} { transition: color ${time / 1000}s var(--transit); }`;
        document.head.appendChild(styleElement);

        this.el.classList.add(`tempTransColor${id}`);
        this.color = color;

        await sleep(time / 1000);

        this.el.classList.remove(`tempTransColor${id}`);
        document.head.removeChild(styleElement);
    };

    /**
     * Fade out an element.
     * @param {boolean} doNotHide - Do not hide the element after fading out (keep a blank space for the element)
     * @param {number} time - (>= 0) The time length of fade out
     * @example { ChiwaSet }.fadeOut(undefined, 200) // Fade out in 0.2s.
     * @since xts.24-5-19-3
     * @version 25-1-19
     */
    fadeOut = async (doNotHide = false, time = 100) => {
        _type(doNotHide, "boolean");
        _range(time, ">= 0");

        if (time == 0) {
            if (!doNotHide) {
                this.hide();
            }
            this.style.opacity = 0;
        }

        let nowOpacity = this.style.opacity != "" ? Number(this.style.opacity) : 1;

        while (nowOpacity > 0) {
            nowOpacity -= 0.05;
            this.style.opacity = nowOpacity;
            await sleep(time / 20);
        }
        if (nowOpacity <= 0) {
            if (!doNotHide) {
                this.hide();
            }
            this.style.opacity = 0;
        }
    };

    /**
     * Fade in an element.
     * @param {string} display - The type of display
     * @param {number} time - (>= 0) The time length of fade in
     * @example { ChiwaSet }.fadeIn("block", 200) // Fade in in 0.2s.
     * @since xts.24-5-19-3
     * @version 25-1-19
     */
    fadeIn = async (display = "block", time = 100) => {
        _type(display, "string");
        _range(time, ">= 0");

        if (time == 0) {
            this.unhide(display);
            return;
        }

        let nowOpacity = this.style.opacity != "" ? Number(this.style.opacity) : 0;

        if (this.style.display == "none" || this.el.hidden) {
            this.unhide(display);
            this.style.opacity = 0;
        }

        while (nowOpacity < 1) {
            nowOpacity += 0.05;
            this.style.opacity = nowOpacity;
            await sleep(time / 20);
        }
    };

    /**
     * Add a event listener to the element.
     * @param {string} e - The event to be listened
     * @param {function} listener - The event function
     * @example { ChiwaSet }.event("input", update) // Add a event listener "input" and update()
     * @since 25-3-22
     * @version 26-6-20-1
     */
    event = (e, listener) => {
        _type(e, "string");
        _type(listener, "function");

        this.el.addEventListener(e, listener);
    };
}

/**
 * Get a ChiwaSet of target element.
 * @param {...*} args - See ChiwaSet constructor for more details.
 * @returns {ChiwaSet} A ChiwaSet with specified element
 * @example cw("p", 1) // A ChiwaSet with the index 1 (2nd) p element
 * @since 25-1-12
 * @version 25-6-29
 */
function cw(...args) {
    return new ChiwaSet(...args);
}

// HTML ELEMENTS / ACCESSIBILITY
// ChiwaSet can only be used for a single element. To apply changes to multiple elements, use accessibility functions below.

/**
 * Return queried element(s) in HTML.
 * @param {string} element - The query input of target element
 * @returns {NodeList} The element(s) in HTML
 * @example query(".paragraph") // List out all elements of .paragraph
 * @since xts.24-7-15
 * @version inori.24-11-29-1
 */
function query(element) {
    _type(element, "string");

    return document.querySelectorAll(element);
}

/**
 * Apply modifications to all queried element(s). It has same actions to query(element).forEach.
 * @param {string} element - The query input of target element
 * @param {function} callback - What should all queried elements do
 * @example applyAll("p", (el, i) => cw(el).text = `${i + 1}. ${cw(el).text}`) // Add a index number to all <p>
 * @since inori.24-9-8
 * @version 25-1-21
 */
function applyAll(element, callback) {
    _type(element, "string");
    _type(callback, "function");

    const queried = query(element);

    for (let i = 0; i < queried.length; i++) {
        callback(queried[i], i);
    }
}

/**
 * Fade out an element and fade in another element.
 * @param {string} outElement - The id of target element to fade out
 * @param {string} inElement - The id of target element to fade in
 * @param {string} display - The type of display
 * @param {number} time - (>= 0) The total time length of whole change session
 * @example fadeChange("title", "secondTitle", 500) // Fade out #cw-title in 0.25s and fade in #secondTitle in 0.25s.
 * @since xts.24-5-19-3
 * @version 25-1-19
 */
async function fadeChange(outElement, inElement, display = "block", time = 200) {
    _type(outElement, "string");
    _type(inElement, "string");
    _range(time, ">= 0");

    if (time == 0) {
        cw(`#${outElement}`).hide();
        cw(`#${inElement}`).unhide(display);
        return;
    }

    cw(`#${outElement}`).fadeOut(undefined, time / 2);
    await sleep(time / 2 + 20);
    cw(`#${inElement}`).fadeIn(display, time / 2);
}

// SAVE & LOAD

/**
 * Download a file with expected content.
 * @param {string} fileName - The name of the file to be downloaded
 * @param {any} content - The content of the file
 * @example save("readme.txt", "Please read this file.") // It'll download a file named readme.txt with "Please read this file."
 * @since xts.24-4-21
 * @version inori.24-11-29-1
 */
function save(fileName, content) {
    _type(fileName, "string");

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
 * @since xts.24-4-21
 * @version 25-1-21
 */
function load(inputId, element = "file-content") {
    _type(inputId, "string");
    _type(element, "string");

    cw(`#${inputId}`).el.addEventListener("change", event => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = event => {
                cw(`#${element}`).el.textContent = event.target.result;
            };
            reader.readAsText(file);
        } else {
            cw(`#${element}`).el.textContent = "";
        }
    });
}

/**
 * Load a JSON file from input and return an object.
 * @param {string} inputId - The id of input where the file receives
 * @returns {Promise} The promise included JSON
 * @throws {SyntaxError} f-loadJSON-invalid - When JSON file is invalid
 * @throws {SyntaxError} f-loadJSON-empty - When no file is selected in given target ID
 * @example try { content = await loadJSON("fileInput"); } catch (e) { if (e.cwErr == "f-loadJSON-invalid") { ... } } // Load JSON from #fileInput and copy the JSON object to content, and catch error from loadJSON
 * @example loadJSON("fileInput").then(json => content = json).catch(e => { if (e.message.includes("Invalid") { ... } }) // Same function but async isn't required
 * @since inori.24-8-19
 * @version 25-6-29
*/
function loadJSON(inputId) {
    _type(inputId, "string");

    return new Promise((resolve, reject) => {
        const fileInput = cw(`#${inputId}`).el;
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = event => {
                try {
                    resolve(JSON.parse(event.target.result));
                } catch (e) {
                    reject(Object.assign(new SyntaxError(`Invalid JSON file was selected in #${inputId}: ${e.message.replaceAll(/Syntax error: /g, "")}`), { cwErr: "f-loadJSON-invalid" }));
                }
            };
            reader.readAsText(file);
        } else {
            reject(Object.assign(new ReferenceError(`No file was selected in #${inputId}`), { cwErr: "f-loadJSON-empty" }));
        }
    });
}