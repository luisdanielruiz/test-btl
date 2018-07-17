/* 
This is a simplified jlos file, without using the filesystem for archiving data.
See jlos.js (http://pastebin.com/zKkZmJqG) for file system related funtionality...

jlos just creates an object with methods like save() which store your data into localStorage. 
What data? any json data you add to .data... eg..
 var examplevar = new jlos('examplevar')
 From there, you can treat examplevar.data as a regular json object and read write it as you will....
    DATA SHOULD ONLY BE PUT UNDER ".data"!!!!
examplevar.save saves it to localStorage['examplevar']

You can use this code freely with attribution under the MIT License... no guarantees of any sort given that it will not launch a nuclear missile if you use the wrong methods.
*/
/* Updated March 12 - Added valueAtInit option... When set, if the data is initialised for the first time (ie in the case where the localstorage file doesn't exist yet, examplevar.data is set to this initial value)...(Not yet reflected in the main jlos file
*/
function jlos(name, options) {
  this.name = name;
  this.initialize(options);
}

jlos.prototype.initialize = function (options) {
 this.meta = options? {'options': options} : {'options':null};
 if (localStorage["jlos-data-"+this.name] && localStorage["jlos-data-"+this.name].length>0){
	this.data = JSON.parse(localStorage["jlos-data-"+this.name]);
 } else if (options && options.valueAtInit) {
	this.data = options.valueAtInit; 
 } else {
	this.data = {};
 }
};

jlos.prototype.save = function () {
	localStorage["jlos-data-"+this.name]= JSON.stringify(this.data); 
};

jlos.prototype.remove = function () {
 localStorage.removeItem("jlos-data-"+this.name);
 this.data=null;
};