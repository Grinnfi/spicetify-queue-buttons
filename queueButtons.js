// NAME: Queue Buttons
// AUTHOR: Grinnfi
// DESCRIPTION: Add buttons to move and remove tracks in the queue panel.

(function queueButtons() {
    const DEBUG = true; // Set to true to see full, verbose step-by-step logging
    const log = (() => {
        const getPrefix = () => `[${new Date().toISOString().slice(11, 23)}] [Queue Buttons]`;

        const debugFn = (...args) => {
            if (DEBUG) console.log(getPrefix(), ...args);
        };

        debugFn.info = (...args) => console.info(getPrefix(), ...args);
        debugFn.warn = (...args) => console.warn(getPrefix(), ...args);
        debugFn.error = (...args) => console.error(getPrefix(), ...args);

        return debugFn;
    })();

    log("Trying to start");
    if (!(Spicetify.Platform.PlayerAPI &&
        Spicetify.Queue &&
        Spicetify.Tippy &&
        Spicetify.TippyProps
    )) {
        log("Required Spicetify modules not loaded yet");
        setTimeout(queueButtons, 500);
        return;
    }

    log.info("Startup success");

    const TRASH_SVG = `
        <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.25 3v-.917C5.25.933 6.183 0 7.333 0h1.334c1.15 0 2.083.933 2.083 2.083V3h4.75v1.5h-.972l-1.257 9.544A2.25 2.25 0 0 1 11.041 16H4.96a2.25 2.25 0 0 1-2.23-1.956L1.472 4.5H.5V3h4.75zm1.5-.917V3h2.5v-.917a.583.583 0 0 0-.583-.583H7.333a.583.583 0 0 0-.583.583zM2.986 4.5l1.23 9.348a.75.75 0 0 0 .744.652h6.08a.75.75 0 0 0 .744-.652L13.015 4.5H2.985z"></path>
        </svg>
    `;

    const MOVE_SVG = `
        <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
            <!-- Base Queue Layer (Always visible, representing list/tracks) -->
            <path class="move-base-path" d="M 7.9661328 1 C 8.1214461 1.4742154 8.218495 1.9779842 8.2476172 2.4999609 L 13.503594 2.4999609 C 14.83693 2.4999609 14.83693 4.4999609 13.503594 4.4999609 L 7.9660156 4.5 C 7.7815712 5.0371203 7.5243301 5.5431129 7.1869922 6 L 13.500039 6 C 16.833622 6 16.833622 1 13.500039 1 L 7.9661328 1 z M 13.498516 7.5766016 L 11.204609 9.8710547 C 10.589633 10.445307 11.491956 11.345128 12.064219 10.731172 L 12.064727 10.731172 C 12.542825 10.253365 13.498516 9.2976172 13.498516 9.2976172 C 13.498516 9.2976172 14.456673 10.249676 14.932344 10.731172 C 15.506062 11.345759 16.406427 10.443075 15.792422 9.8710547 L 13.498516 7.5766016 z M 2.0000391 9.0000391 L 2.0000391 10.5 L 8.9134766 10.5 A 4.7646999 4.7654028 0 0 1 9.6380078 9.0000391 L 2.0000391 9.0000391 z M 15.395039 12.645547 C 15.239581 12.638551 15.075878 12.697449 14.932813 12.850938 L 14.932344 12.850938 C 14.454246 13.328745 13.498516 14.284492 13.498516 14.284492 C 13.498516 14.284492 12.540398 13.332434 12.064727 12.850938 C 11.491009 12.236351 10.590604 13.139035 11.204609 13.711055 L 13.498516 16.005508 L 15.792422 13.711055 C 16.253654 13.280366 15.861413 12.666534 15.395039 12.645547 z M 2.0000391 13.500039 L 2.0000391 15 L 9.9775 15 A 4.7646999 4.7654028 0 0 1 9.0522266 13.500039 L 2.0000391 13.500039 z"></path>
            
            <!-- Contextual Overlays -->
            <!-- Normal: Move to last in queue -->
            <path class="move-overlay move-overlay-normal" d= "M 2,2 V 0 h 1.5 v 2 h 2 v 1.5 h -2 v 2 H 2 v -2 H 0 V 2 Z"></path>
            
            <!-- Shift: Move to next in queue -->
            <path class="move-overlay move-overlay-shift" d= "M 1.2113588,0 V 5.5 L 5.7999304,2.75 Z"></path>
            
            <!-- Ctrl: Shuffle in queue -->
            <path class="move-overlay move-overlay-ctrl" d= "M 3.6644922 0.41496094 C 3.2015768 0.4359384 2.812526 1.0459815 3.2701172 1.4722656 L 4.0894531 2.2917188 L 2.5207031 2.2917188 C 1.628576 2.2917237 0.78157009 2.6868218 0.20785156 3.3704297 L 0 3.618125 L 0 5.4966406 L 1.1330469 4.1464453 C 1.4776658 3.7363 1.985392 3.4992092 2.52125 3.4992578 L 4.0885156 3.4992578 L 3.2696875 4.3187109 C 2.7401378 4.8872353 3.5560679 5.701774 4.1234766 5.1720312 L 6.4013672 2.8955078 L 4.1234375 0.61894531 C 3.9813426 0.46641495 3.8187973 0.40796845 3.6644922 0.41496094 z "></path>
        </svg>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
        /* Remove Button */
        .custom-trash-can {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-subdued);
            align-items: center;
        }
        [data-flip-id]:hover .custom-trash-can {
            display: flex;
        }
        .custom-trash-can:hover {
            color: var(--spice-button);
            transform: scale(var(--encore-button-hover-scale));
        }

        /* Dynamic Move Button */
        .custom-move-btn {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-subdued);
            align-items: center;
        }
        [data-flip-id]:hover .custom-move-btn {
            display: flex;
        }
        .custom-move-btn:hover {
            transform: scale(var(--encore-button-hover-scale));
        }
        
        /* Path Layers Configuration */
        .custom-move-btn .move-base-path {
            color: currentColor;
        }
        .custom-move-btn:hover .move-base-path {
            color: var(--text-subdued);
        }
        .custom-move-btn:hover .move-overlay {
            color: var(--spice-button);
        }

        /* Modifier Overlays Visibility */
        .custom-move-btn .move-overlay {
            display: none;
        }
        .custom-move-btn.state-normal .move-overlay-normal {
            display: inline;
        }
        .custom-move-btn.state-shift .move-overlay-shift {
            display: inline;
        }
        .custom-move-btn.state-ctrl .move-overlay-ctrl {
            display: inline;
        }
    `;
    document.head.appendChild(style);

    let isQueueOpen = false;
    let wasQueueOpen = false; // Tracks state transition
    let queueData = new Map(); // uid -> spotify:track URI
    let queuedList = []; // Array of {uid, uri} from the manual queue
    let currentModifier = "normal"; // "normal" | "shift" | "ctrl"

    function buildQueueMap(items) {
        return new Map(
            items
                .map(item => {
                    const track = item.contextTrack ?? item;

                    // Ignore non-track URIs (autoplay seeds, ads, metadata entries, etc.)
                    if (!track?.uri?.startsWith("spotify:track")) {
                        return null;
                    }
                    return [track.uid, track.uri];
                })
                .filter(Boolean)
        );
    }

    function updateModifierState(e) {
        let nextModifier = "normal";
        if (e.shiftKey) {
            nextModifier = "shift";
        } else if (e.ctrlKey || e.metaKey) {
            nextModifier = "ctrl";
        }

        if (nextModifier !== currentModifier) {
            currentModifier = nextModifier;
            updateButtonsUI();
        }
    }

    function updateButtonsUI() {
        const buttons = document.querySelectorAll(".custom-move-btn");
        buttons.forEach(btn => {
            btn.classList.remove("state-normal", "state-shift", "state-ctrl");
            btn.classList.add(`state-${currentModifier}`);

            if (btn._tippy) {
                let text = "Move to last in queue";
                if (currentModifier === "shift") {
                    text = "Move to next in queue";
                } else if (currentModifier === "ctrl") {
                    text = "Shuffle in queue";
                }
                btn._tippy.setContent(text);
            }
        });
    }

    window.addEventListener("keydown", updateModifierState);
    window.addEventListener("keyup", updateModifierState);
    window.addEventListener("blur", () => {
        if (currentModifier !== "normal") {
            currentModifier = "normal";
            updateButtonsUI();
        }
    });

    function createMoveButton(uri, uid) {
        const moveBtn = document.createElement("button");
        moveBtn.className = `custom-move-btn state-${currentModifier}`;
        moveBtn.innerHTML = MOVE_SVG;

        moveBtn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (moveBtn._tippy) {
                moveBtn._tippy.hide();
            }
            log(`Move button clicked [Mode: ${currentModifier}] | URI: ${uri} | UID: ${uid}`);

            try {
                if (currentModifier === "shift") {
                    // --- Move to next in queue (Top of manual queue) ---
                    if (queuedList.length > 0) {
                        if (queuedList[0].uid === uid) {
                            Spicetify.showNotification("Track is already at the top of the queue");
                            return;
                        }
                        await Spicetify.Platform.PlayerAPI.reorderQueue([{ uid }], {
                            before: {
                                uri: queuedList[0].uri,
                                uid: queuedList[0].uid
                            }
                        });
                    } else {
                        await Spicetify.Platform.PlayerAPI.removeFromQueue([{ uri, uid }]); // We can't reorder into the queue if there's no manual queue
                        await Spicetify.Platform.PlayerAPI.addToQueue([{ uri }]);
                    }
                    Spicetify.showNotification("Moved to next in queue");

                } else if (currentModifier === "ctrl") {
                    // --- Shuffle in queue (Random place in manual queue) ---
                    const currentIndex = queuedList.findIndex(t => t.uid === uid);
                    const isAlreadyOnQueue = currentIndex !== -1;
                    if (queuedList.length > 2) {
                        const validTargets = [];
                        const maxIndex = isAlreadyOnQueue ? queuedList.length : queuedList.length - 1;
                        for (let i = 1; i < maxIndex; i++) {
                            if (isAlreadyOnQueue && (i === currentIndex || i === currentIndex + 1)) {
                                continue;
                            }
                            validTargets.push(queuedList[i]);
                        }
                        if (validTargets.length > 0) {
                            const targetTrack = validTargets[Math.floor(Math.random() * validTargets.length)];
                            await Spicetify.Platform.PlayerAPI.reorderQueue([{ uid }], {
                                before: {
                                    uri: targetTrack.uri,
                                    uid: targetTrack.uid
                                }
                            })
                        }
                    } else if (queuedList.length === 2) {
                        if (!isAlreadyOnQueue) {
                            // Insert in the middle (before the second item, index 1)
                            await Spicetify.Platform.PlayerAPI.reorderQueue([{ uid }], {
                                before: {
                                    uri: queuedList[1].uri,
                                    uid: queuedList[1].uid
                                }
                            });
                        } else {
                            // Swap the two items
                            if (currentIndex === 0) {
                                await Spicetify.Platform.PlayerAPI.reorderQueue([{ uid }], {
                                    after: {
                                        uri: queuedList[1].uri,
                                        uid: queuedList[1].uid
                                    }
                                });
                            } else if (currentIndex === 1) {
                                await Spicetify.Platform.PlayerAPI.reorderQueue([{ uid }], {
                                    before: {
                                        uri: queuedList[0].uri,
                                        uid: queuedList[0].uid
                                    }
                                });
                            }
                        }
                    } else {
                        await Spicetify.Platform.PlayerAPI.removeFromQueue([{ uri, uid }]);
                        await Spicetify.Platform.PlayerAPI.addToQueue([{ uri }]);
                    }
                    Spicetify.showNotification("Shuffled in Queue");

                } else {
                    // --- Move to last in queue (Bottom of manual queue) ---
                    if (queuedList.length > 0) {
                        const lastIndex = queuedList.length - 1;
                        if (queuedList[lastIndex].uid === uid) {
                            Spicetify.showNotification("Track is already at the bottom of the queue");
                            return;
                        }
                        await Spicetify.Platform.PlayerAPI.reorderQueue([{ uid }], {
                            after: {
                                uri: queuedList[lastIndex].uri,
                                uid: queuedList[lastIndex].uid
                            }
                        });
                        Spicetify.showNotification("Moved to last in queue");
                    } else {
                        await Spicetify.Platform.PlayerAPI.addToQueue([{ uri }]);
                        await Spicetify.Platform.PlayerAPI.removeFromQueue([{ uri, uid }]);
                    }
                }
            } catch (err) {
                log.error(`Error performing queue movement in state: ${currentModifier}`, err);
                Spicetify.showNotification("Failed to move track. Check console.", true);
            }
        };

        let initialText = "Move to last in queue";
        if (currentModifier === "shift") {
            initialText = "Move to next in queue";
        } else if (currentModifier === "ctrl") {
            initialText = "Shuffle in queue";
        }

        Spicetify.Tippy(moveBtn, {
            ...Spicetify.TippyProps,
            content: initialText,
        });

        return moveBtn;
    }

    function createTrashButton(uri, uid) {
        const trashBtn = document.createElement("button");
        trashBtn.className = "custom-trash-can";
        trashBtn.innerHTML = TRASH_SVG;

        trashBtn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (trashBtn._tippy) {
                trashBtn._tippy.hide();
            }

            try {
                log(`Removing: URI: ${uri} | UID: ${uid}`);
                await Spicetify.Platform.PlayerAPI.removeFromQueue([{ uri, uid }]);
            } catch (err) {
                log.error("Error removing track from queue:", err);
            }
        };

        Spicetify.Tippy(trashBtn, {
            ...Spicetify.TippyProps,
            content: "Remove from queue",
        });

        return trashBtn;
    }

    function processRows() {
        log("Processing queue rows and inserting control interface elements");

        const rows = document.querySelectorAll("[data-flip-id]");

        // Skip index:
        // 0 -> "Now playing" header
        // 1 -> Currently playing track
        // 2 -> Next header
        for (let i = 3; i < rows.length; i++) {
            const row = rows[i];
            const uid = row.getAttribute("data-flip-id");

            const uri = queueData.get(uid);
            if (!uri) {
                if (!(uid.startsWith("section-header"))) {
                    log.error(`Couldn't find the uri on row ${i} | UID: ${uid}`);
                }
                continue;
            }

            const targetSlot = row.querySelector('button[aria-haspopup="menu"]')?.parentElement;
            if (!targetSlot) {
                log.error(`Button Target slot not found on row ${i} | UID: ${uid}`);
                continue;
            }
            // Inject Custom Trash Can Button if missing
            if (!row.querySelector(".custom-trash-can")) {
                targetSlot.prepend(createTrashButton(uri, uid));
            }

            // Inject Custom Move Button if missing
            if (!row.querySelector(".custom-move-btn")) {
                targetSlot.prepend(createMoveButton(uri, uid));
            }
        }
    }

    const globalObserver = new MutationObserver(() => {
        const tab = document.getElementById("queue-tab");
        const isActive = tab?.getAttribute("aria-selected") === "true";

        if (isActive === wasQueueOpen) return;

        wasQueueOpen = isActive;
        isQueueOpen = isActive;

        if (isActive) {
            log("Queue tab transitioned to ACTIVE. Processing layout modifications.");
            requestAnimationFrame(processRows);
        }
    });

    globalObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["aria-selected"]
    });

    Spicetify.Platform.PlayerAPI._queue._events.addListener(
        "queue_update",
        (event) => {
            log("queue_update received", event);
            const data = event?.data;
            queueData = buildQueueMap([
                ...data.queued,
                ...data.nextUp
            ]);
            queuedList = data.queued || [];
            log("queueData from queue_update:", queueData);
            log("queuedList from queue_update:", queuedList);

            if (isQueueOpen) {
                log("Queue is active. Syncing newly updated rows.");
                requestAnimationFrame(processRows);
            }
        }
    );

    // Initial load sync
    const tab = document.getElementById("queue-tab");
    isQueueOpen = tab?.getAttribute("aria-selected") === "true";
    wasQueueOpen = isQueueOpen;

    log.info("Initial queue state | Open:", isQueueOpen);
    queueData = buildQueueMap(Spicetify.Queue.nextTracks);
    log("queueData from nextTracks:", queueData);

    queuedList = Spicetify.Platform.PlayerAPI._queue._queueState?.queued || [];
    log("queuedList initialized from _queueState:", queuedList);

    if (isQueueOpen) {
        processRows();
    }
})();