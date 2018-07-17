/* JLoS - JSON Local Stortage Micro-library Overview

At its simplest, JLoS just automates saving a variable content in local storage...
 var examplevar = new jlos('examplevar')
 From there, you can treat examplevar.data as a regular json object and read write it as you will....
    DATA SHOULD ONLY BE PUT UNDER ".data"!!!!
 
 examplevar.save saves it to localStorage['examplevar']

 When a program is initialised, the dta is fetched from localStorage
 
 All that is very simple.
 
 If you don't need to "archive' the data in a text file, you can use jlos-simple http://pastebin.com/1SACKR1n.
 
 But you also have the option of using the file system to either 'archive' your object (ie in the file system), or use the options to autoarchive (archive automatically to file system when save is called, or just use 'filesysonly'... 
 

*/
/* Options...
Currently, options are:
	- 'autoarchive': Saves to file system when save() is called
	- 'filesysonly': Doesn't use localstorage - just uses file system
	- 'getdatafromfile': Upon initialisation, it gets the data from the file system. It is upto the progam to make sure that the data gets archived after any changes.
Options under consideration:
	- KeepChangelog - log all changes to the items
	- imposeSchema - impose rules on JSON schema

Additional methods under consideration - more JSON related than jlos related:
	- query(expressionlist, path)
	- JSON viewer

Archiving functionality is now specific to Phonegap but can be adapted to other systems quite easily - 
To use the local file system... there has to be a Directory Entry jlosDir initiated. You can call  getAppPath, use you rown function to set jlosDir.

*/
/* 
Note - This micro-library is in severe need of exception handling. ;) May come with demand!!
Alo note: THis has not been production tested... 
*/

var jlosDir; // directory object for where jlos files are stored - can be created with getAppPath
var ioQueue = {'initdir':{'file':''}, 'readqueue':[], 'status':''}; 
// List Queue of things that need to be done using the filessystem
var doOnJlosInit = null;

function jlos(name, options) {
  this.name = name;
  this.initialize(options);
}

jlos.prototype.initialize = function (options) {
 this.meta = options? options : {};
 if (localStorage["jlos-data-"+this.name] && !options.getdatafromfile) {
	this.data = JSON.parse(unescape(localStorage["jlos-data-"+this.name]));
 } else if (options.autoarchive || options.getdatafromfile || options.filesysonly) {
	this.data = {}; // 
	ioQueue['readqueue'].push({'name': this.name})
	if (jlosDir && ioQueue['status']!='inProcess') {manageioQueue();} // start manageioQueue process, unless it is ialready running (ie if its status is inProcess) - that is, it is in the middle of initializing
 } else {
	this.data = {};
 }
};

jlos.prototype.save = function () {
 if (!this.meta.filesysonly) {
	localStorage["jlos-data-"+this.name]= escape(JSON.stringify(this.data)); 
 }
 if (this.meta.filesysonly || this.meta.autoarchive) {
	this.archive();
 } 
};

jlos.prototype.remove = function () {
 this.data=null;
 if (localStorage["jlos-data-"+this.name]) {
	localStorage.removeItem("jlos-data-"+this.name);
 }
 if (jlosDir) {
	jlosDir.getFile("jlos-data-"+this.name+".txt", {create: false}, jlosGotFileForDelete, null);
 }
};

jlos.prototype.archive = function () {
	console.log('going to Archive '+this.name+' in the file system');
	jlosDir.getFile("jlos-data-"+this.name+".txt", {create: true}, jlosGotFileforReWrite, jlosFailgetFileForReWrite);
};

function jlosGotFileforReWrite(fileEntry){
	fileEntry.createWriter(jlosGotFileWriter, jlosFailgetFileForReWrite);
}
function jlosGotFileWriter(writer){
		writer.onwrite = function(evt) {
            console.log("write success");
        };
		var varname = writer.fileName.split('jlos-data-')[1].slice(0,-4)
		console.log('writing content: '+JSON.stringify(window[varname].data));
		var formattedContent = escape(JSON.stringify(window[varname].data));
        writer.write(formattedContent);
		//writer.truncate(formattedContent.length);
}
function jlosFailgetFileForReWrite(evt){
	alert('error writing to ile system.');
	console.log(evt.target.error.code);
}

var getAppPath = function(AppName) {
	ioQueue['status']='inProcess';
	ioQueue['initdir'] = {'file':AppName}; // this is always called at the beginning so it is already empty
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, jlosOnInitalFileSysemSuccess, jlosFilesystemfail);
};
function jlosOnInitalFileSysemSuccess(fileSystem) {
	var dirname = ioQueue['initdir'].file;
	fileSystem.root.getDirectory(dirname, {create: true, exclusive: false}, jlosGotDirectorySuccess, jlosFilesystemfail2);
}
function jlosFilesystemfail() {
	alert('Error nitializing the local file system.');
}
function jlosFilesystemfail2(e) {
	alert('Error nitializing the local file system 2.'+e);
}
function jlosGotDirectorySuccess(DirEnt) {
	jlosDir = DirEnt;
	manageioQueue();
}
function manageioQueue() {
	ioQueue['status']='inProcess';
	if(ioQueue['readqueue'].length > 0 && jlosDir) {
		ioQueue['readqueue'][0].status='loading';
		jlosDir.getFile("jlos-data-"+ioQueue['readqueue'][0].name+".txt", {create: true}, jlosGotFileEntry, jlosFailFileEntry);
	} else {
		ioQueue['status']='';
		if (doOnJlosInit) {doOnJlosInit();}
	}
}
function jlosFailFileEntry(evt) {
	console.log('error reading files');
	console.log(evt.target.error.code);
	ioQueue['readqueue'] = ioQueue['readqueue'].length==1? [] : ioQueue['readqueue'].slice(1);
	manageioQueue();
}
function jlosGotFileEntry(file)	{
	var datareader = new FileReader();
	datareader.onloadend = function(evt) {
		varname = file.name.slice(10,-4);
		console.log('Read from file system '+varname+ ' from path '+file.name);
		//console.log('read file content '+evt.target.result)
		if (evt.target.result.length > 0) {
			window[varname].data = JSON.parse(unescape(evt.target.result));
		} else {
			window[varname].data = {}
		}
		//console.log('var '+varname+':'+window[varname].data);
		ioQueue['readqueue'] = ioQueue['readqueue'].length==1? [] : ioQueue['readqueue'].slice(1);
		manageioQueue();
	}
	datareader.readAsText(file);	
	console.log('Reading '+"jlos-data-"+ioQueue['readqueue'][0].name+".txt");
}

function jlosGotFileForDelete(file) {
	file.remove();
}