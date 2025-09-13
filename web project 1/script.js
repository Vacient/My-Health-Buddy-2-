document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // CHAT MODE TOGGLE
    // =========================
    const chatModeToggleBtn = document.getElementById("chatbot-chatmode-toggle");
    if (chatModeToggleBtn && chatbotContainer) {
        chatModeToggleBtn.addEventListener("click", () => {
            chatbotContainer.classList.toggle("chat-mode");
        });
    }
    // =========================
    // USER LOGIN / PROFILE HANDLING
    // =========================
    let users = JSON.parse(localStorage.getItem("users")) || {};
    const loggedInIdentifier = localStorage.getItem("loggedInUser");
    let loggedInUser = null;

    if (loggedInIdentifier) {
        if (users[loggedInIdentifier]) loggedInUser = users[loggedInIdentifier];
        else {
            for (let email in users) {
                if (users[email].phoneNumber === loggedInIdentifier) {
                    loggedInUser = users[email];
                    break;
                }
            }
        }
    }

    // Profile modal
    const profileBtn = document.getElementById("profile-btn");
    const profileBox = document.getElementById("profile-modal");
    const saveProfileBtn = document.getElementById("save-profile");
    const savedMsg = document.getElementById("profile-saved-msg");
    const closeProfileBtn = document.getElementById("close-profile");

    profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileBox.classList.add("show");
        document.getElementById("profile-name").value = loggedInUser?.name || "";
        document.getElementById("profile-email").value = loggedInIdentifier || "";
        document.getElementById("profile-phone").value = loggedInUser?.phoneNumber || "";
        document.getElementById("profile-age").value = loggedInUser?.age || "";
        document.getElementById("profile-gender").value = loggedInUser?.gender || "";
    });

    closeProfileBtn.addEventListener("click", () => profileBox.classList.remove("show"));
    window.addEventListener("click", (e) => { if (e.target.id === "profile-modal") profileBox.classList.remove("show"); });

    saveProfileBtn.addEventListener("click", () => {
        loggedInUser.name = document.getElementById("profile-name").value.trim();
        loggedInUser.phoneNumber = document.getElementById("profile-phone").value.trim();
        loggedInUser.age = document.getElementById("profile-age").value.trim();
        loggedInUser.gender = document.getElementById("profile-gender").value.trim();
        users[loggedInIdentifier] = loggedInUser;
        localStorage.setItem("users", JSON.stringify(users));

        savedMsg.classList.add("show");
        setTimeout(() => savedMsg.classList.remove("show"), 2000);
        profileBox.classList.remove("show");

        const headerNav = document.querySelector(".header-nav span");
        if (headerNav) headerNav.textContent = `Welcome, ${loggedInUser.name}!`;
    });

    // Logout
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        alert("You have been logged out.");
        window.location.href = "indexLoginForm.html";
    });

    // Hamburger
    document.getElementById("navi-toggle").addEventListener("click", () => {
        document.getElementById("navi-list").classList.toggle("show");
    });

    // =========================
    // SETTINGS DROPDOWN
    // =========================
    const settingsBtn = document.querySelector(".dropbtn");
    const settingsMenu = document.querySelector(".dropdown-content");

    settingsBtn.addEventListener("click", e => {
        e.stopPropagation();
        settingsMenu.classList.toggle("show");
        settingsBtn.classList.toggle("active");
    });

    settingsMenu.addEventListener("click", e => e.stopPropagation());
    window.addEventListener("click", () => {
        settingsMenu.classList.remove("show");
        settingsBtn.classList.remove("active");
    });

    // =========================
    // NIGHT MODE (Improved)
    // =========================
    const nightModeBtn = document.getElementById("darkmode-toggle");

    // Load saved mode on page load
    if (localStorage.getItem("nightMode") === "enabled") {
        document.body.classList.add("night-mode");
        nightModeBtn.textContent = "☀️ Day Mode";
    } else {
        nightModeBtn.textContent = "🌙 Night Mode";
    }

    nightModeBtn.addEventListener("click", () => {
        document.body.classList.toggle("night-mode");
        if (document.body.classList.contains("night-mode")) {
            nightModeBtn.textContent = "☀️ Day Mode";
            localStorage.setItem("nightMode", "enabled");
        } else {
            nightModeBtn.textContent = "🌙 Night Mode";
            localStorage.setItem("nightMode", "disabled");
        }
    });

    // =========================
    // SUMMARY MODAL
    // =========================
    const summaryBtn = document.getElementById("summary-btn");
    const summaryModal = document.getElementById("summary-modal");
    const closeSummaryBtn = document.getElementById("close-summary");
    const summaryBody = document.getElementById("summary-body");

    function formatLogWithTime(logArray) {
        if (!logArray.length) return "None";
        return logArray.map(item => `${item.entry} (${item.time})`).join(", ");
    }

    summaryBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        summaryBody.innerHTML = "";
        const moodLogWithTime = JSON.parse(localStorage.getItem("moodLogWithTime") || "[]");
        const gratitudeLogWithTime = JSON.parse(localStorage.getItem("gratitudeLogWithTime") || "[]");
        const activityCount = localStorage.getItem("activityCount") || 0;
        const activityLogWithTime = JSON.parse(localStorage.getItem("activityLogWithTime") || "[]");
        const diaryLogWithTime = JSON.parse(localStorage.getItem("diaryLogWithTime") || "[]");

        const lastReminder = localStorage.getItem("lastReminder") || "None";
        const lastTip = localStorage.getItem("lastTip") || "None";
        const lastQuote = localStorage.getItem("lastQuote") || "None";
        const lastChallenge = localStorage.getItem("lastChallenge") || "None";

        const lastReminderTime = localStorage.getItem("lastReminderTime") || "N/A";
        const lastTipTime = localStorage.getItem("lastTipTime") || "N/A";
        const lastQuoteTime = localStorage.getItem("lastQuoteTime") || "N/A";
        const lastChallengeTime = localStorage.getItem("lastChallengeTime") || "N/A";

        const sections = {
            "Last Reminder": `${lastReminder} (at ${lastReminderTime})`,
            "Last Tip": `${lastTip} (at ${lastTipTime})`,
            "Last Quote": `${lastQuote} (at ${lastQuoteTime})`,
            "Last Challenge": `${lastChallenge} (at ${lastChallengeTime})`,
            "Mood Log": formatLogWithTime(moodLogWithTime),
            "Gratitude Log": formatLogWithTime(gratitudeLogWithTime),
            "Activities Done": activityCount,
            "Activity Log": formatLogWithTime(activityLogWithTime),
            "Diary": formatLogWithTime(diaryLogWithTime)
        };

        for (let title in sections) {
            const div = document.createElement("div");
            div.style.marginBottom = "1rem";
            div.innerHTML = `<h4>${title}</h4><p>${sections[title]}</p>`;
            summaryBody.appendChild(div);
        }

        summaryModal.style.display = "flex";
    });

    closeSummaryBtn.addEventListener("click", () => summaryModal.style.display = "none");
    window.addEventListener("click", (e) => { if (e.target.id === "summary-modal") summaryModal.style.display = "none"; });

    // =========================
    // RESET DATA
    // =========================
    document.getElementById("reset-btn").addEventListener("click", () => {
        if (confirm("Reset all data?")) {
            // Simple prompt for password
            const input = prompt("Please enter your password to reset all data:");
            if (!loggedInUser || !loggedInUser.password) {
                alert("No password found for this user.");
                return;
            }
            if (input === loggedInUser.password) {
                localStorage.clear();
                alert("All data has been reset.");
                location.reload();
            } else if (input !== null) {
                alert("Incorrect password. Data was not reset.");
            }
        }
    });

    // =========================
    // LOGBOOK MODAL
    // =========================
    const logbookBtn = document.getElementById("logbook-btn");
    const logbookModal = document.getElementById("logbook-modal");
    const closeLogbookBtn = document.getElementById("close-logbook");
    const logbookContent = document.getElementById("logbook-content");
    const bookmarkBtns = document.querySelectorAll(".bookmark-btn");

    function formatLogEntries(logArray) {
        if (!logArray.length) return "<p>No entries found.</p>";
        return "<ul>" + logArray.map(item => `<li>${item.entry} <small>(${item.time})</small></li>`).join("") + "</ul>";
    }

    function loadLogbook(type = "all") {
        let contentHTML = "";
        if (type === "all" || type === "mood") {
            const moodLogWithTime = JSON.parse(localStorage.getItem("moodLogWithTime") || "[]");
            if (type === "mood") contentHTML += `<h3>Mood Log</h3>${formatLogEntries(moodLogWithTime)}`;
            else contentHTML += `<h3>Mood Log</h3>${formatLogEntries(moodLogWithTime)}`;
        }
        if (type === "all" || type === "gratitude") {
            const gratitudeLogWithTime = JSON.parse(localStorage.getItem("gratitudeLogWithTime") || "[]");
            if (type === "gratitude") contentHTML = `<h3>Gratitude Log</h3>${formatLogEntries(gratitudeLogWithTime)}`;
            else contentHTML += `<h3>Gratitude Log</h3>${formatLogEntries(gratitudeLogWithTime)}`;
        }
        if (type === "all" || type === "activity") {
            const activityLogWithTime = JSON.parse(localStorage.getItem("activityLogWithTime") || "[]");
            if (type === "activity") contentHTML = `<h3>Activity Log</h3>${formatLogEntries(activityLogWithTime)}`;
            else contentHTML += `<h3>Activity Log</h3>${formatLogEntries(activityLogWithTime)}`;
        }
        if (type === "all" || type === "diary") {
            const diaryLogWithTime = JSON.parse(localStorage.getItem("diaryLogWithTime") || "[]");
            if (type === "diary") contentHTML = `<h3>Diary Log</h3>${formatLogEntries(diaryLogWithTime)}`;
            else contentHTML += `<h3>Diary Log</h3>${formatLogEntries(diaryLogWithTime)}`;
        }
        logbookContent.innerHTML = contentHTML || "<p>No logs available.</p>";
    }

    logbookBtn.addEventListener("click", e => {
        e.stopPropagation();
        loadLogbook("all");
        logbookModal.style.display = "flex";
    });

    closeLogbookBtn.addEventListener("click", () => logbookModal.style.display = "none");
    window.addEventListener("click", e => { if (e.target.id === "logbook-modal") logbookModal.style.display = "none"; });

    bookmarkBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            bookmarkBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            loadLogbook(btn.dataset.type);
        });
    });

    // =========================
    // JOURNAL TOGGLE
    // =========================
    const journal = document.querySelector(".journal-container");
    const toggleBtn = document.getElementById("journal-toggle");
    if (journal && toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            journal.classList.toggle("open");
            journal.classList.toggle("closed");
        });
    }

    // =========================
    // MyHealthBuddy FUNCTIONS
    // =========================
    window.MyHealthBuddy = (() => {
        const reminders = ["Drink water 💧", "Stretch your legs 🦵", "Take a deep breath 🌬️"];
        const tips = ["Take breaks every hour", "Eat balanced meals", "Sleep at least 7h"];
        const quotes = ["Stay positive!", "You are stronger than you think.", "Small steps = big changes"];
        const challenges = ["Do 10 push-ups", "Write 3 things you're grateful for", "Meditate for 5 minutes"];
        const exercises = ["Jumping jacks", "Squats", "Push-ups", "Stretching"];
        const music = ["Relaxing Lo-fi 🎶", "Focus Beats 🎧", "Nature Sounds 🌿"];
        const quizQuestions = [
            { q: "What is 5 + 7?", a: "12" },
            { q: "What is the capital of France?", a: "Paris" },
            { q: "What color do you get by mixing blue and yellow?", a: "Green" },
            { q: "How many hours of sleep are recommended for adults?", a: "7" }
        ];

        // Helper to show info modal with text
        function showInfoModal(text) {
            const modal = document.getElementById("info-modal");
            const modalText = document.getElementById("info-modal-text");
            modalText.textContent = text;
            modal.classList.add("show");
        }

        // Helper to close info modal
        document.getElementById("close-info-modal").addEventListener("click", () => {
            document.getElementById("info-modal").classList.remove("show");
        });
        window.addEventListener("click", e => {
            if (e.target.id === "info-modal") document.getElementById("info-modal").classList.remove("show");
        });

        // Reminders, Tips, Quotes, Challenges with modal and timestamp
        function changeReminder() {
            const r = reminders[Math.floor(Math.random() * reminders.length)];
            localStorage.setItem("lastReminder", r);
            localStorage.setItem("lastReminderTime", new Date().toLocaleString());
            showInfoModal(r);
        }
        function showTip() {
            const t = tips[Math.floor(Math.random() * tips.length)];
            localStorage.setItem("lastTip", t);
            localStorage.setItem("lastTipTime", new Date().toLocaleString());
            showInfoModal(t);
        }
        function showQuote() {
            const q = quotes[Math.floor(Math.random() * quotes.length)];
            localStorage.setItem("lastQuote", q);
            localStorage.setItem("lastQuoteTime", new Date().toLocaleString());
            showInfoModal(q);
        }
        function showChallenge() {
            const c = challenges[Math.floor(Math.random() * challenges.length)];
            localStorage.setItem("lastChallenge", c);
            localStorage.setItem("lastChallengeTime", new Date().toLocaleString());
            showInfoModal(c);
        }

        // Exercise modal
        function showExerciseModal() {
            const e = exercises[Math.floor(Math.random() * exercises.length)];
            const modal = document.getElementById("exercise-modal");
            const modalText = document.getElementById("exercise-modal-text");
            modalText.textContent = `Try: ${e}`;
            modal.classList.add("show");
        }
        document.getElementById("close-exercise-modal").addEventListener("click", () => {
            document.getElementById("exercise-modal").classList.remove("show");
        });
        window.addEventListener("click", e => {
            if (e.target.id === "exercise-modal") document.getElementById("exercise-modal").classList.remove("show");
        });

        // Music modal
        function showMusicModal() {
            const m = music[Math.floor(Math.random() * music.length)];
            const modal = document.getElementById("music-modal");
            const modalText = document.getElementById("music-modal-text");
            modalText.textContent = `Today's music: ${m}`;
            modal.classList.add("show");
        }
        document.getElementById("close-music-modal").addEventListener("click", () => {
            document.getElementById("music-modal").classList.remove("show");
        });
        window.addEventListener("click", e => {
            if (e.target.id === "music-modal") document.getElementById("music-modal").classList.remove("show");
        });

        // Quiz modal logic (Improved to allow multiple questions)
        const quizModal = document.getElementById("quiz-modal");
        const quizQuestionContainer = document.getElementById("quiz-question-container");
        const quizNextBtn = document.getElementById("quiz-next-btn");
        const quizFinishBtn = document.getElementById("quiz-finish-btn");
        const quizFeedback = document.getElementById("quiz-feedback");

        let currentQuizIndex = 0;
        let correctCount = 0;

        function showQuizModal() {
            currentQuizIndex = 0;
            correctCount = 0;
            quizFeedback.textContent = "";
            quizFinishBtn.style.display = "none";
            quizNextBtn.style.display = "inline-block";
            quizModal.classList.add("show");
            showQuizQuestion();
        }

        function showQuizQuestion() {
            const q = quizQuestions[currentQuizIndex];
            quizQuestionContainer.innerHTML = `
                <p><strong>Q${currentQuizIndex + 1}:</strong> ${q.q}</p>
                <input type="text" id="quiz-answer" placeholder="Your answer here" autocomplete="off" />
            `;
            quizFeedback.textContent = "";
            document.getElementById("quiz-answer").focus();
        }

        quizNextBtn.addEventListener("click", () => {
            const answerInput = document.getElementById("quiz-answer");
            if (!answerInput.value.trim()) {
                quizFeedback.textContent = "Please enter an answer.";
                return;
            }
            const userAnswer = answerInput.value.trim().toLowerCase();
            const correctAnswer = quizQuestions[currentQuizIndex].a.toLowerCase();
            if (userAnswer === correctAnswer) {
                correctCount++;
                quizFeedback.textContent = "Correct! 🎉";
            } else {
                quizFeedback.textContent = `Wrong. Correct answer: ${quizQuestions[currentQuizIndex].a}`;
            }
            quizNextBtn.style.display = "none";
            quizFinishBtn.style.display = "inline-block";
        });

        quizFinishBtn.addEventListener("click", () => {
            if (currentQuizIndex < quizQuestions.length - 1) {
                currentQuizIndex++;
                showQuizQuestion();
                quizNextBtn.style.display = "inline-block";
                quizFinishBtn.style.display = "none";
                quizFeedback.textContent = "";
            }
                        else {
                quizModal.classList.remove("show");
                alert(`Quiz finished! You got ${correctCount} out of ${quizQuestions.length} correct.`);
            }
        });

        document.getElementById("close-quiz-modal").addEventListener("click", () => {
            quizModal.classList.remove("show");
        });

        window.addEventListener("click", e => {
            if (e.target.id === "quiz-modal") quizModal.classList.remove("show");
        });

        // Mood functions with modal summary
        function showMoodMessage() {
            const mood = document.getElementById("mood-select").value;
            updateText("mood-message", "You are feeling " + mood);
        }

        function logMood() {
            const mood = document.getElementById("mood-select").value;
            const log = JSON.parse(localStorage.getItem("moodLog") || "[]");
            const logWithTime = JSON.parse(localStorage.getItem("moodLogWithTime") || "[]");
            const now = new Date();

            log.push(mood);
            logWithTime.push({ entry: mood, time: now.toLocaleString() });

            localStorage.setItem("moodLog", JSON.stringify(log));
            localStorage.setItem("moodLogWithTime", JSON.stringify(logWithTime));

            const ul = document.getElementById("mood-log");
            const li = document.createElement("li");
            li.textContent = `${mood} (${now.toLocaleTimeString()})`;
            ul.appendChild(li);
        }

        // New: Mood summary modal
        function moodSummary() {
            const moodLogWithTime = JSON.parse(localStorage.getItem("moodLogWithTime") || "[]");
            const modalId = "mood-summary-modal";

            // Create modal if not exists
            let modal = document.getElementById(modalId);
            if (!modal) {
                modal = document.createElement("div");
                modal.id = modalId;
                modal.style.position = "fixed";
                modal.style.top = "0";
                modal.style.left = "0";
                modal.style.width = "100%";
                modal.style.height = "100%";
                modal.style.backgroundColor = "rgba(0,0,0,0.6)";
                modal.style.display = "flex";
                modal.style.justifyContent = "center";
                modal.style.alignItems = "center";
                modal.style.zIndex = "10000";

                const content = document.createElement("div");
                content.style.backgroundColor = "#fff";
                content.style.color = "#000";
                content.style.padding = "20px";
                content.style.borderRadius = "10px";
                content.style.maxWidth = "400px";
                content.style.width = "90%";
                content.style.maxHeight = "80vh";
                content.style.overflowY = "auto";
                content.style.fontFamily = "'Open Sans', sans-serif";
                content.style.boxShadow = "0 0 15px rgba(0,0,0,0.3)";
                content.id = "mood-summary-content";

                const closeBtn = document.createElement("button");
                closeBtn.textContent = "Close";
                closeBtn.style.marginBottom = "10px";
                closeBtn.style.padding = "8px 15px";
                closeBtn.style.border = "none";
                closeBtn.style.backgroundColor = "#2e7d32";
                closeBtn.style.color = "#fff";
                closeBtn.style.borderRadius = "5px";
                closeBtn.style.cursor = "pointer";
                closeBtn.addEventListener("click", () => {
                    modal.style.display = "none";
                });

                content.appendChild(closeBtn);

                const title = document.createElement("h3");
                title.textContent = "Mood Summary";
                title.style.marginBottom = "15px";
                content.appendChild(title);

                const list = document.createElement("ul");
                list.style.listStyle = "none";
                list.style.padding = "0";

                if (moodLogWithTime.length === 0) {
                    const noEntry = document.createElement("p");
                    noEntry.textContent = "No mood entries found.";
                    content.appendChild(noEntry);
                } else {
                    moodLogWithTime.forEach(item => {
                        const li = document.createElement("li");
                        li.style.padding = "5px 0";
                        li.textContent = `${item.entry} — ${item.time}`;
                        list.appendChild(li);
                    });
                    content.appendChild(list);
                }

                modal.appendChild(content);
                document.body.appendChild(modal);

                // Close modal on outside click
                modal.addEventListener("click", (e) => {
                    if (e.target === modal) {
                        modal.style.display = "none";
                    }
                });
            } else {
                // Update list if modal exists
                const list = modal.querySelector("ul");
                list.innerHTML = "";
                if (moodLogWithTime.length === 0) {
                    list.innerHTML = "<p>No mood entries found.</p>";
                } else {
                    moodLogWithTime.forEach(item => {
                        const li = document.createElement("li");
                        li.style.padding = "5px 0";
                        li.textContent = `${item.entry} — ${item.time}`;
                        list.appendChild(li);
                    });
                }
                modal.style.display = "flex";
            }
        }

        // Gratitude functions
        function addGratitude() {
            const input = document.getElementById("gratitude-input").value.trim();
            if (!input) return;
            const log = JSON.parse(localStorage.getItem("gratitudeLog") || "[]");
            const logWithTime = JSON.parse(localStorage.getItem("gratitudeLogWithTime") || "[]");
            const now = new Date();

            log.push(input);
            logWithTime.push({ entry: input, time: now.toLocaleString() });

            localStorage.setItem("gratitudeLog", JSON.stringify(log));
            localStorage.setItem("gratitudeLogWithTime", JSON.stringify(logWithTime));

            const ul = document.getElementById("gratitude-log");
            const li = document.createElement("li");
            li.textContent = `${input} (${now.toLocaleTimeString()})`;
            ul.appendChild(li);
            document.getElementById("gratitude-input").value = "";
        }

        // Activity functions
        function logActivity() {
            let count = parseInt(localStorage.getItem("activityCount") || "0", 10);
            count++;
            localStorage.setItem("activityCount", count);

            const logWithTime = JSON.parse(localStorage.getItem("activityLogWithTime") || "[]");
            logWithTime.push({ entry: "Activity completed", time: new Date().toLocaleString() });
            localStorage.setItem("activityLogWithTime", JSON.stringify(logWithTime));

            updateText("activity-log", "Activities done today: " + count);
        }

        // Diary functions
        function addDiaryEntry() {
            const entry = document.getElementById("diary-input").value.trim();
            if (!entry) return;
            const log = JSON.parse(localStorage.getItem("diaryLog") || "[]");
            const logWithTime = JSON.parse(localStorage.getItem("diaryLogWithTime") || "[]");
            const now = new Date();

            log.push(entry);
            logWithTime.push({ entry: entry, time: now.toLocaleString() });

            localStorage.setItem("diaryLog", JSON.stringify(log));
            localStorage.setItem("diaryLogWithTime", JSON.stringify(logWithTime));

            const ul = document.getElementById("diary-log");
            const li = document.createElement("li");
            li.textContent = `${entry} (${now.toLocaleTimeString()})`;
            ul.appendChild(li);
            document.getElementById("diary-input").value = "";
        }

        // Helper to update text content
        function updateText(id, text) {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        }

        // Breathing exercise timer and animation with text cycle
        let breathingInterval = null;
        let breathingTimeLeft = 30;
        let breathingPhaseIndex = 0;
        const breathingPhases = [
            { text: "Inhale", duration: 4000 },
            { text: "Hold", duration: 7000 },
            { text: "Exhale", duration: 8000 }
        ];

        const breathingTimerEl = document.getElementById("breathing-timer");
        const startBreathingBtn = document.getElementById("start-breathing-btn");
        const stopBreathingBtn = document.getElementById("stop-breathing-btn");
        const breathingCircle = document.getElementById("breathing-circle");
        const breathingText = document.getElementById("breathing-text");

        function updateBreathingTimer() {
            const minutes = Math.floor(breathingTimeLeft / 60).toString().padStart(2, "0");
            const seconds = (breathingTimeLeft % 60).toString().padStart(2, "0");
            breathingTimerEl.textContent = `${minutes}:${seconds}`;
        }

        function cycleBreathingText() {
            if (!breathingInterval) return;
            breathingText.textContent = breathingPhases[breathingPhaseIndex].text;
            setTimeout(() => {
                breathingPhaseIndex = (breathingPhaseIndex + 1) % breathingPhases.length;
                cycleBreathingText();
            }, breathingPhases[breathingPhaseIndex].duration);
        }

        function startBreathing() {
            if (breathingInterval) return; // already running
            breathingTimeLeft = 30;
            breathingPhaseIndex = 0;
            updateBreathingTimer();
            startBreathingBtn.disabled = true;
            stopBreathingBtn.disabled = false;
            breathingCircle.classList.remove("stopped");
            cycleBreathingText();

            breathingInterval = setInterval(() => {
                breathingTimeLeft--;
                updateBreathingTimer();
                if (breathingTimeLeft <= 0) {
                    clearInterval(breathingInterval);
                    breathingInterval = null;
                    alert("Breathing exercise complete! Well done.");
                    startBreathingBtn.disabled = false;
                    stopBreathingBtn.disabled = true;
                    breathingCircle.classList.add("stopped");
                    breathingText.textContent = "Done!";
                }
            }, 1000);
        }

        function stopBreathing() {
            if (breathingInterval) {
                clearInterval(breathingInterval);
                breathingInterval = null;
            }
            startBreathingBtn.disabled = false;
            stopBreathingBtn.disabled = true;
            breathingTimeLeft = 30;
            updateBreathingTimer();
            breathingCircle.classList.add("stopped");
            breathingText.textContent = "Stopped";
        }

        startBreathingBtn.addEventListener("click", startBreathing);
        stopBreathingBtn.addEventListener("click", stopBreathing);

        return {
            changeReminder,
            showTip,
            showQuote,
            showChallenge,
            showExerciseModal,
            showMusicModal,
            showQuizModal,
            showMoodMessage,
            logMood,
            moodSummary,
            addGratitude,
            logActivity,
            addDiaryEntry
        };
    })();

    // =========================
    // CHATBOT
    // =========================
    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotContainer = document.getElementById("chatbot-container");
    const chatbotClose = document.getElementById("chatbot-close");
    const chatbotSend = document.getElementById("chatbot-send");
    const chatbotMessages = document.getElementById("chatbot-messages");
    const chatbotInput = document.getElementById("chatbot-input");

    const botResponses = {
            greetings: [
                "Hello! How can I help you today?",
                "Hi there! What would you like to do?",
                "Hey! I'm your HealthBuddy assistant.",
                "Welcome! Ready to improve your health?",
                "Greetings! How can I assist you on your wellness journey?",
                "Hi! Let's make today a healthy one together."
            ],
            water: [
                "Don't forget to drink water 💧",
                "Stay hydrated! 💦",
                "A glass of water can boost your energy.",
                "Water is essential for your body. Have some now!",
                "Hydration helps your mind stay sharp.",
                "Sip some water and feel refreshed!"
            ],
            exercise: [
                "Time for a quick stretch 🦵",
                "Try 10 jumping jacks!",
                "How about a short walk to get your blood flowing?",
                "Exercise is great for your mood. Want a tip?",
                "A few squats can energize your day!",
                "Let's do a mini workout together!"
            ],
            mood: [
                "Remember to log your mood today 😊",
                "How are you feeling? You can tell me!",
                "Your feelings matter. Want to talk about it?",
                "Mood tracking helps you understand yourself better.",
                "Share your emotions—I'm here to listen.",
                "Let's reflect on your day together."
            ],
            thanking: [
                "My Pleasure 🥰",
                "You're welcome😌",
                "Glad I could help!",
                "Anytime! Your health is my priority.",
                "Happy to assist you.",
                "Thank you for chatting with me!"
            ],
            default: [
                "Interesting! Can you tell me more?",
                "I see. Tell me more!",
                "Hmm, let's talk about something healthy!",
                "I'm here to help with any health questions.",
                "Let's explore wellness together.",
                "Feel free to ask me anything about health or habits."
            ]

    };

    chatbotToggle.addEventListener("click", () => {
        chatbotContainer.classList.toggle("show");
        chatbotInput.focus();
    });
    chatbotClose.addEventListener("click", () => chatbotContainer.classList.remove("show"));

    function scrollChat() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function botReply(userText) {
           const text = userText.toLowerCase();
           let responseList = botResponses.default;
           if (/\b(hi|hello|hey)\b/.test(text)) responseList = botResponses.greetings;
           else if (/\b(i am tired|i feel fatigue|tired|fatigue|exhausted)\b/.test(text)) responseList = botResponses.water;
           else if (/\b(exercise|workout|suggest exercise|what exercise|which exercises should i do|suggest me to do workout|i want to make exercise)\b/.test(text)) responseList = botResponses.exercise;
           else if (/\b(mood|feelings|share my feelings|how am i feeling|log mood|emotion|emotions)\b/.test(text)) responseList = botResponses.mood;
           else if (/\b(thank you|thanks|thank)\b/.test(text)) responseList = botResponses.thanking;
           // Pick a random response from the selected list
           return responseList[Math.floor(Math.random() * responseList.length)];
    }

    function sendMessage() {
        const text = chatbotInput.value.trim();
        if (!text) return;
        const userP = document.createElement("p");
        userP.classList.add("user-msg");
        userP.innerHTML = `<b>You:</b> ${text}`;
        chatbotMessages.appendChild(userP);
        const botP = document.createElement("p");
        botP.classList.add("bot-msg");
        botP.innerHTML = `<b>Bot:</b> ...`;
        chatbotMessages.appendChild(botP);
        scrollChat();
        setTimeout(() => {
            botP.innerHTML = `<b>Bot:</b> ${botReply(text)}`;
            scrollChat();
        }, 700 + Math.random() * 500);
        chatbotInput.value = "";
    }

    chatbotInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });
    chatbotSend.addEventListener("click", sendMessage);

    // Load existing logs into journal lists on page load
    function loadLogs() {
        const moodLog = JSON.parse(localStorage.getItem("moodLog") || "[]");
        const moodUl = document.getElementById("mood-log");
        moodUl.innerHTML = "";
        moodLog.slice(-3).reverse().forEach(mood => {
            const li = document.createElement("li");
            li.textContent = mood;
            moodUl.appendChild(li);
        });

        const gratitudeLog = JSON.parse(localStorage.getItem("gratitudeLog") || "[]");
        const gratitudeUl = document.getElementById("gratitude-log");
        gratitudeUl.innerHTML = "";
        gratitudeLog.slice(-3).reverse().forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            gratitudeUl.appendChild(li);
        });

            // Diary log: show only latest 3, truncate to 50 chars
            const diaryLog = JSON.parse(localStorage.getItem("diaryLog") || "[]");
            const diaryUl = document.getElementById("diary-log");
            diaryUl.innerHTML = "";
            diaryLog.slice(-3).reverse().forEach(entry => {
                const li = document.createElement("li");
                let truncated = entry.length > 50 ? entry.slice(0, 50) + "..." : entry;
                li.textContent = truncated;
                diaryUl.appendChild(li);
            });

        const activityCount = localStorage.getItem("activityCount") || 0;
        updateText("activity-log", "Activities done today: " + activityCount);
    }

    loadLogs();

    // Helper to update text content
    function updateText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }
});




