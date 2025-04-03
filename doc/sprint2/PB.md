# 👨 Bart's Feature Requests

Bart would like the following features added to the **Inspirational Quote Website**:

---

## 🔊 Sound Cue on New Quote  
**“I want an option for the website to play a sound cue when a new quote is given, so I know when something has changed.”**

**✅ Implementation Ideas:**
- Add a sound file (e.g., `ping.mp3`) to the project assets.
- Play the sound when a new quote is displayed.
- Include a toggle switch in the settings to **enable/disable** the sound cue.

## 🤖 AI-Generated Quotes from Prompt  
**“I want to get AI-generated quotes based on my prompt.”**

**✅ Implementation Ideas:**
- Add an input field for users to enter a custom prompt.
- Send the prompt to an AI API (like OpenAI or a custom backend).
- Display the generated quote with a note like _“AI-generated based on your prompt.”_

---

## ✨ Enable/Disable Floating Animation  
**“I want to enable and disable the floating animation.”**

**✅ Implementation Ideas:**
- Add a setting to toggle the floating animation effect (e.g., quote box bobbing or floating).
- Use a CSS class like `.floating` and apply/remove it based on the setting.
- Store the preference in local storage or user settings.





# 👩 Diana's Feature Requests

Diana would like the following features added to the **Inspirational Quote Website**:

---

## 🔄 Transition Style for Quote Changes  
**“I want to be able to choose how quotes are cycled – whether it is a hard change, fade, or another type of transition.”**

**✅ Implementation Ideas:**
- Add transition effects (e.g., fade, slide, zoom) using CSS or animation libraries.
- Include a dropdown or setting for users to select their preferred transition style.
- Smoothly animate between quotes to enhance visual experience.

---

## 🖼️ Visuals to Accompany Quotes  
**“I want quotes to be accompanied by a relaxing or visually pleasing image, something nice to accompany the quote.”**

**✅ Implementation Ideas:**
- Display a background image or an image next to the quote.
- Use APIs like Unsplash or Pexels for high-quality, relaxing visuals.
- Option to turn the images on or off via settings.

---

## 🔁 Avoid Repeated Quotes  
**“I want to avoid seeing the same quotes multiple times in a short span of time, so every time I receive a new quote, I get to see something new and fresh.”**

**✅ Implementation Ideas:**
- Keep a short-term history of recently displayed quotes.
- Exclude recently shown quotes from being selected again.
- Shuffle or randomly select from unseen quotes before resetting the cycle.

---

## 🔐 Login with Registered Credentials  
**“I want to log in using the credentials I signed up with.”**

**✅ Implementation Ideas:**
- Implement authentication using email and password (Firebase Auth, JWT, etc.).
- Provide login and signup forms.
- Secure password storage and validation.
- Keep users logged in across sessions using cookies or local storage.
