const electron = require('electron');
const {app, Menu, shell} = electron;
const BrowserWindow = electron.BrowserWindow;
const url = require('url');
const path = require('path');
const windowStateKeeper = require('electron-window-state');

let mainWindow;

function createWindow () {
	// Load last window state
	let mainWindowState = windowStateKeeper({
	    defaultWidth: 1000,
	    defaultHeight: 800
	});

	// Create the browser window.
	mainWindow = new BrowserWindow({
		'x': mainWindowState.x,
		'y': mainWindowState.y,
		'width': mainWindowState.width,
		'height': mainWindowState.height,
		frame: true
	});

	mainWindow.setMenu(null);
	mainWindow.toggleDevTools();
	// and load the index.html of the app.
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'index.html'),
			protocol: 'file:',
			slashes: true
		})
	);

	mainWindow.once('ready-to-show', mainWindow.show);
	// Emitted when the window is closed.
	mainWindow.on('closed', function () {

		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

function initialize () {


	app.on('ready', createWindow);

	// Quit when all windows are closed.
	app.on('window-all-closed', function () {
		// On OS X it is common for applications and their menu bar
		// to stay active until the user quits explicitly with Cmd + Q
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', function () {
		// On OS X it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (mainWindow === null) {
			createWindow();
		}
	});
}

switch (process.argv[1]) {
	case '--squirrel-install':
		autoUpdater.createShortcut(function () { app.quit() })
		break
	case '--squirrel-uninstall':
		autoUpdater.removeShortcut(function () { app.quit() })
		break
	case '--squirrel-obsolete':
	case '--squirrel-updated':
		app.quit()
		break
	default:
		initialize()
}