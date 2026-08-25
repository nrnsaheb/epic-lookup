"use strict";

/* =========================================================
   CONFIGURATION
   ========================================================= */

const INDEX_URL =
    "./data/epic_lookup_index_new.json";

const JSON_BASE_PATH =
    "./data/pdfs/";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const searchForm =
    document.getElementById("searchForm");

const epicInput =
    document.getElementById("epicInput");

const searchButton =
    document.getElementById("searchButton");

const clearButton =
    document.getElementById("clearButton");

const statusElement =
    document.getElementById("status");

const resultCard =
    document.getElementById("resultCard");

const resultEpic =
    document.getElementById("resultEpic");

const resultPart =
    document.getElementById("resultPart");

const resultName =
    document.getElementById("resultName");

const resultRelative =
    document.getElementById("resultRelative");

const resultRelation =
    document.getElementById("resultRelation");

const resultSerial =
    document.getElementById("resultSerial");

const resultAge =
    document.getElementById("resultAge");

const resultGender =
    document.getElementById("resultGender");

const resultHouse =
    document.getElementById("resultHouse");


/* =========================================================
   INDEX CACHE
   ========================================================= */

let epicIndex = null;


/* =========================================================
   LOAD EPIC INDEX
   ========================================================= */

async function loadEpicIndex() {

    if (epicIndex !== null) {
        return epicIndex;
    }

    const response =
        await fetch(INDEX_URL);

    if (!response.ok) {

        throw new Error(
            `Unable to load EPIC index. HTTP ${response.status}`
        );

    }

    epicIndex =
        await response.json();

    return epicIndex;
}


/* =========================================================
   NORMALIZE EPIC
   ========================================================= */

function normalizeEpic(value) {

    return value
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "");

}


/* =========================================================
   GET SOURCE JSON FILENAME
   ========================================================= */

function getJsonFilename(indexRecord) {

    /*
     * Current index format:
     *
     * {
     *     "pdf": "some-file.json",
     *     "serial": 11
     * }
     *
     * Also support "json" if used later.
     */

    return (
        indexRecord?.json ||
        indexRecord?.pdf ||
        null
    );

}


/* =========================================================
   FETCH SOURCE JSON
   ========================================================= */

async function fetchSourceJson(filename) {

    if (!filename) {

        throw new Error(
            "No source JSON filename was found in the EPIC index."
        );

    }

    /*
     * IMPORTANT:
     *
     * Only this one JSON file is fetched.
     *
     * The other 100+ JSON files are NOT downloaded.
     */

    const url =
        JSON_BASE_PATH +
        encodeURIComponent(filename);

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            `Unable to load source JSON. HTTP ${response.status}`
        );

    }

    return await response.json();

}


/* =========================================================
   FIND VOTER
   ========================================================= */

function findVoter(
    sourceData,
    epic,
    serial
) {

    if (
        !sourceData ||
        !Array.isArray(sourceData.voters)
    ) {

        return null;

    }


    const voters =
        sourceData.voters;


    /*
     * The EPIC index already gives us the serial number.
     *
     * Therefore we first locate the voter by serial.
     */

    let voter =
        voters.find(
            item =>
                Number(item.serial_number) ===
                Number(serial)
        );


    /*
     * Verify that the serial actually belongs
     * to the requested EPIC.
     */

    if (
        voter &&
        String(voter.epic_number)
            .trim()
            .toUpperCase() !== epic
    ) {

        voter = null;

    }


    /*
     * Fallback:
     *
     * If the serial did not locate the voter,
     * search the source JSON directly by EPIC.
     */

    if (!voter) {

        voter =
            voters.find(
                item =>
                    String(item.epic_number)
                        .trim()
                        .toUpperCase() === epic
            );

    }


    return voter || null;

}


/* =========================================================
   GET PART NUMBER
   ========================================================= */

function getPartNumber(sourceData) {

    return (
        sourceData?.metadata?.part_number ??
        "—"
    );

}


/* =========================================================
   DISPLAY RESULT
   ========================================================= */

function displayResult(
    epic,
    voter,
    sourceData
) {

    /* -----------------------------------------------------
       EPIC
       ----------------------------------------------------- */

    resultEpic.textContent =
        epic;


    /* -----------------------------------------------------
       PART NUMBER
       ----------------------------------------------------- */

    const partNumber =
        getPartNumber(sourceData);


    resultPart.textContent =
        `Part ${partNumber}`;


    /* -----------------------------------------------------
       NAME
       ----------------------------------------------------- */

    resultName.textContent =
        voter.name ??
        "—";


    /* -----------------------------------------------------
       RELATIVE NAME
       ----------------------------------------------------- */

    resultRelative.textContent =
        voter.relative_name ??
        "—";


    /* -----------------------------------------------------
       RELATION
       ----------------------------------------------------- */

    resultRelation.textContent =
        voter.relative_type ??
        "—";


    /* -----------------------------------------------------
       SERIAL NUMBER
       ----------------------------------------------------- */

    resultSerial.textContent =
        voter.serial_number ??
        "—";


    /* -----------------------------------------------------
       AGE
       ----------------------------------------------------- */

    resultAge.textContent =
        voter.age ??
        "—";


    /* -----------------------------------------------------
       GENDER
       ----------------------------------------------------- */

    resultGender.textContent =
        voter.gender ??
        "—";


    /* -----------------------------------------------------
       HOUSE NUMBER
       ----------------------------------------------------- */

    resultHouse.textContent =
        voter.house_number ??
        "—";


    /* -----------------------------------------------------
       SHOW RESULT
       ----------------------------------------------------- */

    resultCard.classList.remove(
        "hidden"
    );

}


/* =========================================================
   SHOW STATUS
   ========================================================= */

function showStatus(
    message,
    type = "error"
) {

    statusElement.textContent =
        message;

    statusElement.className =
        `status ${type}`;

}


/* =========================================================
   HIDE STATUS
   ========================================================= */

function hideStatus() {

    statusElement.textContent =
        "";

    statusElement.className =
        "status hidden";

}


/* =========================================================
   CLEAR RESULT
   ========================================================= */

function clearResult() {

    resultCard.classList.add(
        "hidden"
    );

    hideStatus();

    resultEpic.textContent =
        "";

    resultPart.textContent =
        "";

    resultName.textContent =
        "—";

    resultRelative.textContent =
        "—";

    resultRelation.textContent =
        "—";

    resultSerial.textContent =
        "—";

    resultAge.textContent =
        "—";

    resultGender.textContent =
        "—";

    resultHouse.textContent =
        "—";

}


/* =========================================================
   SEARCH EPIC
   ========================================================= */

async function searchEpic() {

    const epic =
        normalizeEpic(
            epicInput.value
        );


    clearResult();


    /* -----------------------------------------------------
       VALIDATION
       ----------------------------------------------------- */

    if (!epic) {

        showStatus(
            "Please enter an EPIC number."
        );

        epicInput.focus();

        return;

    }


    /* -----------------------------------------------------
       LOADING STATE
       ----------------------------------------------------- */

    searchButton.disabled =
        true;

    searchButton.textContent =
        "Searching...";


    try {

        /* =================================================
           STEP 1
           Load lightweight EPIC index
           ================================================= */

        const index =
            await loadEpicIndex();


        /* =================================================
           STEP 2
           Find EPIC in index
           ================================================= */

        const indexRecord =
            index[epic];


        if (!indexRecord) {

            showStatus(
                `EPIC "${epic}" was not found.`,
                "error"
            );

            return;

        }


        /* =================================================
           STEP 3
           Get source JSON filename
           ================================================= */

        const filename =
            getJsonFilename(
                indexRecord
            );


        if (!filename) {

            throw new Error(
                "The EPIC index does not contain a source JSON filename."
            );

        }


        /* =================================================
           STEP 4
           Fetch ONLY the required JSON
           ================================================= */

        const sourceData =
            await fetchSourceJson(
                filename
            );


        /* =================================================
           STEP 5
           Locate voter
           ================================================= */

        const voter =
            findVoter(
                sourceData,
                epic,
                indexRecord.serial
            );


        if (!voter) {

            showStatus(
                "The EPIC was found in the index, but the corresponding voter record could not be found in the source JSON.",
                "error"
            );

            return;

        }


        /* =================================================
           STEP 6
           Display
           ================================================= */

        displayResult(
            epic,
            voter,
            sourceData
        );


        showStatus(
            "Record found.",
            "success"
        );


    } catch (error) {

        console.error(
            "EPIC lookup error:",
            error
        );


        showStatus(
            error.message ||
            "Something went wrong while searching.",
            "error"
        );


    } finally {

        searchButton.disabled =
            false;

        searchButton.textContent =
            "Search";

    }

}


/* =========================================================
   SEARCH FORM
   ========================================================= */

searchForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        searchEpic();

    }
);


/* =========================================================
   CLEAR BUTTON
   ========================================================= */

clearButton.addEventListener(
    "click",
    () => {

        epicInput.value =
            "";

        clearResult();

        epicInput.focus();

    }
);


/* =========================================================
   INPUT
   ========================================================= */

epicInput.addEventListener(
    "input",
    () => {

        epicInput.value =
            epicInput.value.toUpperCase();

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        epicInput.focus();

    }
);