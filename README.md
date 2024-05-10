# HIIT up2158529

## Key features

### SPA
The app tries to follow Single Page Application principles. All pages are written in index.html. Page show and hide was made with help of written router.js for page routing and css to hide and show them properly with animation.

### Home page with popular workouts
The homepage showcases customisable workout presets loaded dynamically from the database. Users can modify presets and save them as their own workouts.

### Workout editor
Workout editor asks for a name for your workout, gives you to choose exercises from the database, specify time for that exercise and shows a brief description. Exercises could be deleted and moved using drag-and-drop.

### Workout page
Workout page shows name of the exercise, description, timer and buttons. One button is used to start, pause or resume workout alongside with stop workout and next exercise buttons.

### Timer
The timer uses a timestamp and local storage. Both of them are needed to work in the background, regardless of the current page. The timer is protected from closing the page, reloading and exiting the web page.This applies both while the timer is running and during a pause. It's designed to prevent accidental closure during workout sessions.

### Workouts page
Workouts page shows your workouts. Add Workout button opens the workout editor to add a new workout. Created workout can be launched, edited using workout editor, deleted or shared with url that opens a pre-filled workout editor.

### Users
To separate sessions, localstorage stores user’s UUID. It can be seen on the settings page. You can click to copy it and save for future use. Also, there is input and a button to restore the session. That can be helpful to open your session on a bigger screen and plan future workouts.

### Soft alert box
Alert box shows alerts on top of the page and hides after 3 seconds.

### Custom events
Events are used to track the current page, as SPA makes it a bit tricky. With the help of CustomEvent, js files are able to track the current page and run tasks on their page open.

### Template
Templates helped to create dynamic elements. It was used for list elements in workout editor and dynamic workout cards on the home page. 


## AI

### Prompts to develop footer for mobile
A sequence of prompts helped me develop footer that hides on a big screen and shows on mobile:

>  workout web app html+css+js. I need footer on bottom with 3 buttons on mobile. If that is a pc move menu to left side

The response was proved using js for that, so I asked to do this only using CSS:

>  is it possible do only using css

The response was now in CSS, but still had issues on mobile device, as the Apple browser using different scaling.

>  doesnt work on iphone, scale is different

The suggestion worked, but still had to change and remove a huge amount of useless CSS provided. Helped to understand new CSS features such “@media only screen and (max-width: 768px)”


### Prompts to develop message box
A sequence of prompts did help me a bit, I found solution by myself:

>  web app html+css+js. template for alert box

The response was using old js features, and looked strange. I designed it by myself, and asked solution for auto-hiding as I was bored to think about it:

>  write js to show it and automatically close it after a few seconds

The provided response was with usage of template, but I thought that it will be better just to hide it in that case. Still, it reminded me about setTimeout function, so I used that to hide timer.

### Prompts to develop Home page
The idea of home page was to show popular workouts. I did have a personal view how to implement it, so I asked for a template for cards:

>  js html, high interval workout app, home screen. idea is to show cards with popular workouts, card should be with #218c5a border, border-radius: 5px; inside should be a photo, name, description and button to add such workout to personal 

The response was not really what I wanted, so I specified that I need a template for cards:

>  it should look like a card

The response was much better but position of picture was not correct, so I asked to move it on top:

>  make the picture on top without space between picture card border

My request was unclear, so the answer was not what I wanted. So I specified that I wanted to fill top of the card with picture:

>  can css and html crop a picture, I want it to fill the whole width of card but not exceed borders of the card

Answer was positive, but I had to remove useless CSS and modify border radius of the picture.
