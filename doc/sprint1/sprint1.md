# 🚀 Sprint 1 Meeting  

---

## 📅 Meeting Attendance  
- **👥 Participants:** Nathan, Quan, Manav, Brett  

---

## 🛠️ Task Breakdown  

### 🎨 Frontend  
- 👨‍💻 **Manav & Quan**

### 🔧 Backend  
- 🧑‍💻 **Nathan & Brett**  

---

## 🎯 Sprint Goals  
The goal of Sprint 1 is to implement the most important features and get the website into a working state. Specifically, a user should be able to:  
- 🌐 Access the website  
- 📝 Create an account  
- 💬 View quotes with basic functionality  
- ⚙️ Set display preferences  
- ❌ Delete their account if needed  

The frontend will be developed using **React**, and the backend will be powered by a **_Flask_** app connected to a **_Supabase_** database.  

---

## 📋 Handling User Stories  

### 👩 Diana  
- ⭐ *I recommend this website to all sorts of people. I want an easy-to-use design that anyone can pick up and understand.*  
  > ✅ The website is designed with clearly visible, intuitive buttons.  

- 🔘 *Buttons and menus should clearly indicate their purpose and be designed intuitively.*  
  > ✅ All buttons are labeled with text or an expressive image/icon.  

- 🌗 *I want to be able to choose between a **light and dark mode** for the user interface.*  
  > ✅ Light and dark mode options are available.  

- 🧘 *The design and UI should be **unobtrusive and non-distracting**.*  
  > ✅ The website's layout is clean and minimal.  

- ➕ *I want the option to **add new interests** or **edit my existing preferences**.*  
  > ✅ An Options tab allows users to manage their preferences.  

- ⏱️ *I want to **control how often** I see new quotes.*  
  > ✅ A quote delay slider lets users customize quote timing.  

- 💾 *My preferences and interests should be **stored persistently**.*  
  > ✅ Connected to a **_Supabase_** database to save and load user data.  

---

### 👨 Bart  
- 👁️ *I don't want to be distracted by buttons or unnecessary text. I want a toggle for UI elements.*  
  > ✅ Obtrusive elements can be toggled on/off for a cleaner view.  

- 📚 *I want the quotes to be **tailored to my interests**.*  
  > ✅ Quotes are filtered based on user-selected preferences.  

- 🔠 *I want **customization options** for text size and positioning.*  
  > ✅ Text size slider is available in the Options tab.  

- 🔁 *Preferences should be **transferable between devices**.*  
  > ✅ User accounts allow data syncing across devices.  

- 🔐 *I want to **create an account** to retain access to my preferences.*  
  > ✅ Users can sign in with **GitHub**, **Google**, etc., to store preferences in the cloud.  

- 🆔 *My **username should be unique**, and my data securely stored.*  
  > ✅ Email acts as the **primary key**, ensuring account uniqueness and secure access.  
