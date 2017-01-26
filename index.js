const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;
const Menu = electron.Menu;

var onTop;
var keepOnTop = function(theWindow){
	var onTop = setInterval(function(){
		try {
			theWindow.setAlwaysOnTop(true);
		} catch (e) {
			clearInterval(onTop);
		}
	},1);
};

function createWindow() {
    mainWindow = new BrowserWindow({
        title: "Mac Key Symbols",
        width: 250,
        height: 197,
        frame: false
    });
	keepOnTop(mainWindow);
	var onTop = setInterval(function(){

	},100);

    mainWindow.setAspectRatio(250 / 197);
    mainWindow.setMinimumSize(175, 138);
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    // mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}
let template = [];

function addUpdateMenuItems(items, position) {
    if (process.mas) return;
    const version = electron.app.getVersion();

    items.splice.apply(items, [position, 0]);
}

function findReopenMenuItem() {
    const menu = Menu.getApplicationMenu();
    if (!menu) return;
    let reopenMenuItem;
    menu.items.forEach(function(item) {
        if (item.submenu) {
            item.submenu.items.forEach(function(item) {
                if (item.key === 'reopenMenuItem') {
                    reopenMenuItem = item;
                }
            });
        }
    });
    return reopenMenuItem;
}
if (process.platform === 'darwin') {
    const name = electron.app.getName();
    template.unshift({
        label: name,
        submenu: [

		{
            label: `Close`,
            accelerator: 'Command+W',
            role: 'close'
        },
		{
            label: `Minimize`,
            accelerator: 'Command+M',
            role: 'minimize'
        },
		{
            label: `Hide`,
            accelerator: 'Command+H',
            role: 'hide'
        },
        {
            label: 'Hide Others',
            accelerator: 'Command+Alt+H',
            role: 'hideothers'
        },
        {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function() {
                app.quit();
            }
        }]
    });
    addUpdateMenuItems(template[0].submenu, 1);
}
app.on('ready', function() {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    createWindow();
});
app.on('activate', function() {
    let reopenMenuItem = findReopenMenuItem();
    if (reopenMenuItem) reopenMenuItem.enabled = false;
    if (mainWindow === null) {
        createWindow();
    }
});
app.on('window-all-closed', function() {
    let reopenMenuItem = findReopenMenuItem();
    if (reopenMenuItem) reopenMenuItem.enabled = true;
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
