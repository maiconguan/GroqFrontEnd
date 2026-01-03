const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const modelList = document.getElementById("modelList");

let selectedModel = "llama-3.1-8b-instant";
let messages = [];


const API_URL = "https://groqbackend-production.up.railway.app/chat";
// const API_URL = "http://localhost:3000/chat";



/* MODEL SELECT */
modelList.addEventListener("click", e => {
  if (e.target.tagName === "LI") {
    document.querySelectorAll("#modelList li")
      .forEach(li => li.classList.remove("active"));

    e.target.classList.add("active");
    selectedModel = e.target.dataset.model;
  }
});

/* AUTO RESIZE TEXTAREA */
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 96) + "px";
});

/* SEND MESSAGE */
sendBtn.onclick = send;
input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});

function appendMessage(role, content) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  //div.textContent = content;
  div.innerHTML = `<div class="innerMessage">${content}</div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function send() {
  const text = input.value.trim();
  if (!text) return;

  appendMessage("user", text);
  input.value = "";
  input.style.height = "auto";

  messages.push({ role: "system", content: text });

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: selectedModel,
      messages
    })
  });

  const data = await res.json();

  const reply = data.choices?.[0]?.message?.content || "❌ Error";

    const htmlReply = marked.parse(reply);
  appendMessage("ai", htmlReply);

  messages.push({ role: "assistant", content: reply });
}
