const electron = require('electron');
const url = require('url'); // using this at line 15
const path = require('path'); // using this at line 16

const {app, BrowserWindow, Menu} = electron; // (5) Import Menu from electron

let mainWindow;

// (1) Listen for app to be ready
app.on('ready', function() {
    // (2) Create new window
    mainWindow = new BrowserWindow({});

    // (3) Load HTML file into the window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'), // __dirname is the current directory.
        protocol: 'file:',
        slashes: true
    })); // This was just a fancy way of passing in the file path to loadURL() --- We're passing "file://__dirname/main.html"

    // (6) Build menu from template 
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate); //
    // (7) Insert Menu
    Menu.setApplicationMenu(mainMenu)
});

// (4) CREATE MENU TEMPLATE
// When you create a menu in electron, its just an array of objects
const mainMenuTemplate = [
    // first object is going to be the file
    {
        label: 'File', // the heading/label of the menu tab
        submenu:[
            {
                label: "Add Item"
            },
            {
                label: "Clear Items"
            },
            {
                label: "Quit", // Click File ---
                click() {//                     --> Click Quit
                    app.quit(); 
                }
            }
        ]
    }
];

