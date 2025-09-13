const MyHealthBuddy = (() => {
    const reminders = ["Drink water!", "Stretch your legs.", "Take a deep breath.", "Rest your eyes for 20 seconds.", "Smile 😄"];
    const tips = ["Sleep at least 7–8 hours.", "Stay hydrated.", "Take breaks while studying.", "Maintain good posture.", "Eat healthy snacks."];
    const quotes = ["Keep going. Everything you need will come at the perfect time.", "You are stronger than you think.", "Small steps every day lead to big results.", "Progress is progress, no matter how small."];
    const challenges = ["Drink a full glass of water right now!", "Stand up and stretch for 2 minutes.", "Take 5 deep breaths.", "Write down 3 things you're grateful for.", "Walk around for 5 minutes."];
    const miniExercises = ["10 jumping jacks", "Touch your toes 10 times", "Neck stretches 30 seconds", "Walk around for 2 minutes"];
    const quizzes = [
        { q: "What is 12+8?", a: "20" },
        { q: "Which color mixed with blue makes green?", a: "yellow" },
        { q: "What is the commercial city of Myanmar?", a: "Yangon" }
    ];

    function changeReminder() {
        const r = reminders[Math.floor(Math.random() * reminders.length)];
        document.getElementById("reminder-text").textContent = r;
        localStorage.setItem("lastReminder", r);
    }
    function autoUpdateReminder(interval = 600000) { changeReminder(); setInterval(changeReminder, interval); }
    function loadLastReminder() {
        const r = localStorage.getItem("lastReminder") || reminders[0];
        document.getElementById("reminder-text").textContent = r;
    }

    function showTip() {
        const i = Math.floor(Math.random() * tips.length);
        document.getElementById("tip-text").textContent = tips[i];
        localStorage.setItem("lastTipIndex", i);
    }
    function dailyTip() {
        const day = localStorage.getItem("lastTipDay");
        const today = new Date().toDateString();
        if (day !== today) { showTip(); localStorage.setItem("lastTipDay", today); }
        else {
            const i = localStorage.getItem("lastTipIndex") || 0;
            document.getElementById("tip-text").textContent = tips[i];
        }
    }

    function showQuote() {
        document.getElementById("quote-text").textContent = quotes[Math.floor(Math.random() * quotes.length)];
    }

    function showMoodMessage() {
        const sel = document.getElementById("mood-select");
        const msg = document.getElementById("mood-message");
        if (!sel || !msg) return;
        const m = sel.value;
        const text = { happy: "Great to hear you're happy! 😊", sad: "It's okay to feel sad. 💙", angry: "Try deep breathing 😌", calm: "Peaceful mind 🧘" }[m];
        msg.textContent = text;
    }
    function loadMoodLogs() {
        const logs = JSON.parse(localStorage.getItem("moodLog")) || [];
        const logElem = document.getElementById("mood-log");
        if (!logElem) return;
        logElem.innerHTML = "";
        logs.forEach(e => { const li = document.createElement("li"); li.textContent = e; logElem.appendChild(li); });
    }
    function logMood() {
        const sel = document.getElementById("mood-select");
        const logElem = document.getElementById("mood-log");
        if (!sel || !logElem) return;
        const entry = `${new Date().toLocaleDateString()}: ${sel.value}`;
        const li = document.createElement("li"); li.textContent = entry; logElem.appendChild(li);
        while (logElem.children.length > 5) logElem.removeChild(logElem.firstChild);
        const logs = JSON.parse(localStorage.getItem("moodLog")) || [];
        logs.push(entry); localStorage.setItem("moodLog", JSON.stringify(logs.slice(-5)));
    }
    function moodSummary() {
        const items = document.querySelectorAll("#mood-log li");
        const summary = { happy: 0, sad: 0, angry: 0, calm: 0 };
        items.forEach(i => { const m = i.textContent.split(": ")[1]; if (summary[m] !== undefined) summary[m]++; });
        alert(`Mood Summary:\nHappy:${summary.happy}\nSad:${summary.sad}\nAngry:${summary.angry}\nCalm:${summary.calm}`);
    }

    function startBreathing() { const circle = document.getElementById("breathing-circle"); if (!circle) return; circle.style.animation = "breath 8s ease-in-out infinite"; setTimeout(() => circle.style.animation = "", 32000); }
    function breathingCountdown(cycles = 4) { let t = cycles * 8; const display = document.getElementById("breathing-timer"); if (!display) return; display.textContent = `Time left: ${t}s`; startBreathing(); const timer = setInterval(() => { t--; display.textContent = `Time left: ${t}s`; if (t <= 0) clearInterval(timer); }, 1000); }

    function calculateWakeTime() {
        const bedtime = document.getElementById("bedtime").value;
        const hours = parseFloat(document.getElementById("sleep-hours").value);
        const display = document.getElementById("wake-time");
        if (!bedtime) { display.textContent = "Please enter your bedtime."; return; }
        if (isNaN(hours) || hours <= 0) { display.textContent = "Enter valid hours"; return; }
        const [hr, min] = bedtime.split(":").map(Number);
        const bed = new Date(); bed.setHours(hr, min, 0, 0);
        const wake = new Date(bed.getTime() + hours * 3600000);
        display.textContent = "You should wake up at: " + wake.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function showChallenge() {
        const i = Math.floor(Math.random() * challenges.length);
        document.getElementById("challenge-text").textContent = challenges[i];
        localStorage.setItem("lastChallengeIndex", i);
    }
    function loadLastChallenge() {
        const i = localStorage.getItem("lastChallengeIndex");
        if (i !== null) document.getElementById("challenge-text").textContent = challenges[i];
        else showChallenge();
    }

    function toggleDarkMode() { document.body.classList.toggle("dark-mode"); }

    function sendChatbotMessage() {
        const input = document.getElementById("chatbot-input");
        const msgs = document.getElementById("chatbot-messages");
        if (!input || !msgs) return; const text = input.value.trim(); if (!text) return;
        const userDiv = document.createElement("div"); userDiv.textContent = "👤 " + text; msgs.appendChild(userDiv);
        let response = "Sorry, I didn't understand that. Try asking for a health tip or breathing exercise.";
        const lower = text.toLowerCase();
        if (lower.includes("drink") || lower.includes("water") || lower.includes("exercise")) response = "💪 Moving your body helps! 10-min walk is great!";
        else if (lower.includes("food") || lower.includes("diet") || lower.includes("eat")) response = "🥗 Eat balanced meals with vegetables, protein, and healthy snacks.";
        else if (lower.includes("sad") || lower.includes("depressed")) response = "💙 It's okay to feel sad. Try journaling or talking to a friend.";
        else if (lower.includes("angry") || lower.includes("mad")) response = "😌 Take a deep breath and count to 10.";
        else if (lower.includes("happy") || lower.includes("joy")) response = "😊 Keep spreading that positive energy!";
        else if (lower.includes("lonely")) response = "🤝 You're not alone. Reach out to a friend.";
        else if (lower.includes("relax") || lower.includes("calm")) response = "🌿 Relax: listen to calming music or meditate 5 min.";
        else if (lower.includes("study") || lower.includes("focus")) response = "📚 Study in 25-min sessions with short breaks.";
        else if (lower.includes("headache")) response = "💆 Drink water, rest your eyes, take deep breaths.";

        const botDiv = document.createElement("div"); botDiv.textContent = "🤖 " + response; msgs.appendChild(botDiv);
        input.value = ""; msgs.scrollTop = msgs.scrollHeight;
    }
    function toggleChatbot() { const bot = document.getElementById("chatbot-container"); if (bot) bot.style.display = bot.style.display === "flex" ? "none" : "flex"; bot.style.flexDirection = "column"; }

    function addGratitude() {
        const input = document.getElementById("gratitude-input");
        const text = input.value.trim();
        if (!text) return alert("Enter something!");
        let log = JSON.parse(localStorage.getItem("gratitudeLog")) || [];
        log.push(`${new Date().toLocaleDateString()}: ${text}`);
        log = log.slice(-5);
        localStorage.setItem("gratitudeLog", JSON.stringify(log));
        displayGratitude(); input.value = "";
    }
    function displayGratitude() {
        const logElem = document.getElementById("gratitude-log"); if (!logElem) return;
        logElem.innerHTML = "";
        (JSON.parse(localStorage.getItem("gratitudeLog")) || []).forEach(e => { const li = document.createElement("li"); li.textContent = e; logElem.appendChild(li); });
    }

    function logActivity() {
        let count = parseInt(localStorage.getItem("activityCount")) || 0;
        count++; localStorage.setItem("activityCount", count);
        document.getElementById("activity-log").textContent = `Activities done today: ${count}`;
    }

    function randomExerciseReminder() { alert("Mini-exercise: " + miniExercises[Math.floor(Math.random() * miniExercises.length)]); }

    function suggestMusic() {
        const mood = document.getElementById("mood-select").value;
        const msg = { happy: "Play upbeat songs!", sad: "Try calming piano music.", angry: "Try relaxing ambient music.", calm: "Listen to soft instrumental tracks." }[mood];
        alert(msg);
    }

    function dailyQuiz() {
        const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
        const ans = prompt(quiz.q);
        if (ans?.toLowerCase() === quiz.a.toLowerCase()) alert("Correct! 🎉");
        else alert("Oops! Correct answer is " + quiz.a);
    }

    function resetAll() { localStorage.clear(); location.reload(); }

    function showSiteSummary() {
        const modal = document.getElementById("summary-modal");
        const body = document.getElementById("summary-body");
        if (!modal || !body) return;
        body.innerHTML = "";
        const sections = [
            { name: "Reminders", content: [localStorage.getItem("lastReminder") || "No reminder yet"] },
            { name: "Tips", content: [tips[localStorage.getItem("lastTipIndex") || 0]] },
            { name: "Challenges", content: [challenges[localStorage.getItem("lastChallengeIndex") || 0]] },
            { name: "Mood Log", content: JSON.parse(localStorage.getItem("moodLog") || "[]") },
            { name: "Gratitude Log", content: JSON.parse(localStorage.getItem("gratitudeLog") || "[]") },
            { name: "Activities Done", content: [localStorage.getItem("activityCount") || 0] }
        ];
        sections.forEach(s => {
            const secDiv = document.createElement("div"); secDiv.classList.add("summary-section");
            const header = document.createElement("div"); header.textContent = s.name; header.classList.add("summary-section-header");
            const bodyDiv = document.createElement("div"); bodyDiv.classList.add("summary-section-body");
            s.content.forEach(c => { const p = document.createElement("p"); p.textContent = c; bodyDiv.appendChild(p); });
            header.addEventListener("click", () => bodyDiv.classList.toggle("expanded"));
            secDiv.appendChild(header); secDiv.appendChild(bodyDiv); body.appendChild(secDiv);
        });
        modal.style.display = "flex";
    }

    function closeSummary() {
        const modal = document.getElementById("summary-modal");
        if (modal) modal.style.display = "none";
    }

    function init() {
        loadLastReminder();
        autoUpdateReminder();
        dailyTip();
        showQuote();
        loadMoodLogs();
        loadLastChallenge();
        displayGratitude();
        const darkBtn = document.getElementById("darkmode-toggle");
        if (darkBtn) darkBtn.addEventListener("click", toggleDarkMode);
        const chatBtn = document.getElementById("chatbot-toggle");
        if (chatBtn) chatBtn.addEventListener("click", toggleChatbot);
        const sendBtn = document.getElementById("chatbot-send");
        if (sendBtn) sendBtn.addEventListener("click", sendChatbotMessage);
        const summaryBtn = document.getElementById("summary-btn");
        if (summaryBtn) summaryBtn.addEventListener("click", showSiteSummary);
        const closeBtn = document.getElementById("close-summary");
        if (closeBtn) closeBtn.addEventListener("click", closeSummary);
        window.addEventListener("click", (e) => { if (e.target.id === "summary-modal") closeSummary(); });
    }

    return {
        changeReminder,
        showTip,
        showQuote,
        showMoodMessage,
        logMood,
        moodSummary,
        breathingCountdown,
        calculateWakeTime,
        showChallenge,
        toggleDarkMode,
        sendChatbotMessage,
        toggleChatbot,
        addGratitude,
        logActivity,
        randomExerciseReminder,
        suggestMusic,
        dailyQuiz,
        resetAll,
        showSiteSummary,
        init
    };
})();

window.addEventListener("DOMContentLoaded", MyHealthBuddy.init);

