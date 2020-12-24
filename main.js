const electron = require('electron');
const url = require('url'); // using this at line 15
const path = require('path'); // using this at line 16

const {app, BrowserWindow, Menu, ipcMain} = electron; // (5) Import Menu from electron

let mainWindow;
let addWindow; // (9)

// UNDERSTANDING path.join: The line below will print: "D:\Ammar\Github Repo\ElectronJS-Learning\add.html" basically the full path of the current directory. ------|
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
console.log(path.join(__dirname, 'add.html')) //-------------------------------------------------------------------------------------------------------------------|
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------|

// (1) Listen for app to be ready
app.on('ready', () => {
    // (2) Create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    // (3) Load HTML file into the window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'), // __dirname is the current directory.
        protocol: 'file:',
        slashes: true
    })); // This was just a fancy way of passing in the file path to loadURL() --- We're passing "file://__dirname/main.html"

    // (9) Quit the whole app when close
    mainWindow.on('closed', () => {
        app.quit();
    });

    // (6) Build menu from template 
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate); //
    // (7) Insert Menu
    Menu.setApplicationMenu(mainMenu);
});

// (8) Handle create add window
// Create a new window, with the same steps,
// - Add a new BrowserWindow
// - Load the HTML file using loadURL
function createAddWindow(){
    addWindow = new BrowserWindow({ // this time we'll provide it with some options like height, width etc;
        width: 400,
        height: 200,
        title: "Add Item",
        webPreferences: {
            nodeIntegration: true
        }
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'add.html'),
        protocol: 'file:',
        slashes: true
    }));

    // (10) Garbage Collection Handle - When we close the small window, we want to set the "addWindow" variable to null, because if we don't, it'll keep taking up memory space.
    addWindow.on('closed', () =>{
        addWindow = null;
    })
};

// Catch item:add << USE ipcMain.on('<id-of-item-to-catch>' , function) >> to catch a sent element
ipcMain.on('item:add', function(event, itemFromAddWindow) {
    mainWindow.webContents.send('item:add', itemFromAddWindow); // Comming from the addWindow -> Now sending it to the mainWindow
    addWindow.close(); // closing Add Window

    // Next step is to catch in the main-window, over at main.html
});


// (4) CREATE MENU TEMPLATE
// When you create a menu in electron, its just an array of objects
const mainMenuTemplate = [
    // first object is going to be the file
    {
        label: 'File', // the heading/label of the menu tab
        submenu:[
            {
                label: "Add Item", // When we 'click' add item, we call a function
                click() {
                    createAddWindow();
                }
            },
            {
                label: "Clear Items"
            },
            {
                label: "Quit", // Click File ---
                // adding an accelerator to define shortcuts to performing an action. 'darwin' is what we'd expect on a Mac and the shortcut would be Command+Q. 
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q', // This <expression> ? <do this> : <else do this> is called a turnary operator. Basically an if statement.
                click() { //                     --> Click Quit
                    app.quit(); 
                }
            },
        ]
    }
];

// The problem with mac is that, by default, regardless of what label you provide, it will show "electron" as the first menu tab. We fix that by...
// if the app is run on a mac, add empty object to menu, to prevent "electron" be printed as a tab instead of our own label: "File"
if (process.platform == 'darwin'){
    mainMenuTemplate.unshift({}) // unshift is an array method, which adds on to the begininng of the array. Here our mainMenuTeplate is the array (of objects)
};

// Add developer tools if not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: "Toggle Dev Tools",
                accelerator: "CmdOrCtrl+I",
                click(item, focusedWindow){ // passing focuesd window because we want the dev tools to open in the focused window (window we're currently on). Its also important to pass 'item' or you'll get an error.    
                    focusedWindow.toggleDevTools(); // toggleDevTools is a pre-defined function.
                }
            },
            {
                role: 'reload', // adding this object to the array has taken care of everything; from the label to reload's functionality aswell as the keyboard shortcut.
            }
        ]
    })
};