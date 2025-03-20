# Sprint 1 Meeting #
## Meeting Attendance ##
- **Participants:** Nathan, Quan, Manav, Brett

## Task Breakdown ##
### Frontend ###
- **Manav & Quan**
### Backend ###
- **Nathan & Brett**

## Sprint Goals ##
The goal of sprint 1 is to implement the most important features and to get the website in a working state. Specifically, the intent if for a user to be able to access the website, create an account and then be able to view quotes with the basic functionality of the website. The user should also be able to set their preferences in regards to how quotes are displayed to them, and if need be- the user should also be able to delete their account.

The frontend of the website will be implemented using React, and the backend will be implemented using a _Flask_ app, connecting to a database hosted on _SupaBase_

## Handling User Stories ##

### Diana ###
- I recommend this website to all sorts of people. I want an easy-to-use design that anyone can pick up and understand. 
    > The website is designed so that buttons are clearly visible and are intuitive to use.
- Buttons and menus should clearly indicate their purpose and be designed intuitively. 
    > All buttons are labelled with text, or contain an image that clearly expresses its purpose.
- I want to be able to choose between a **light and dark mode** for the user interface, to better suit different lighting environments.
    > Light and dark mode options are availible.
- The design and UI should be **unobtrusive and non-distracting**; the website's purpose is to add inspiration, not to take up too much time.
    > The website's design is clean and minimal.
- I want the option to **add new interests** or **edit my existing preferences**.
    > Options tab exists so the user can change their preferences.
- I want to **control how often** I see new quotes so that the content feels dynamic.
    > Implemented a quote delay slider so the user can choose how often quotes are presented to them.
- My preferences and interests should be **stored persistently**, so I don’t need to reconfigure them every time I log in.  
    > The website is connected to a databse hosted on _Supabase_, so user information is stored and loaded accordingly.

### Bart ###
- When glancing at the website, I don't want to be distracted by buttons or unnecessary text. I want a toggle for menu or UI elements so the main focus can be on the quote.
    > Certain aesthetic elements that some may consider obtrusive or distracting can be toggled on or off.
- I want the quotes to be **tailored to my interests**, covering a broad range of people and topics I know.  
    > Quotes shown to the user are curated from a list of preferences that the user themself chooses.
- I want **customization options** for content display, including **text size and positioning**.  
    > In the options tab, there exists a slider so that the user can adjust the size of text.
- My preferences should be **transferable between devices** (e.g., home and work laptop).
    > The implementation of accounts allows for user data to be loaded to and from any device.
- I want to **create an account** to sign in from any device and retain access to my preferences and interests.
    > You may sign in using Github / Google / etc. to store your preferences and genres on the database.
- My **username should be unique**, and my information should be **securely stored** so that only I have access to my preferences.
    > The user's email acts as the 'primary key' for the database, so that no two accounts can be created using the same email.
