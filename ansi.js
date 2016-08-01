/* internal variables */
var csi = '\033[';
var attributes = undefined;
var output = process.stdout.write.bind(process.stdout);
var xy = {};

/* ANSI colors */
var fg = {
	black:csi+'30m',
	red:csi+'31m',
	green:csi+'32m',
	yellow:csi+'33m',
	blue:csi+'34m',
	magenta:csi+'35m',
	cyan:csi+'36m',
	lightgray:csi+'37m',
	darkgray:csi+'30;1m',
	lightred:csi+'31;1m',
	lightgreen:csi+'32;1m',
	lightyellow:csi+'33;1m',
	lightblue:csi+'34;1m',
	lightmagenta:csi+'35;1m',
	lightcyan:csi+'36;1m',
	white:csi+'37;1m',
};
var bg = {
	black:csi+'40m',
	red:csi+'41m',
	green:csi+'42m',
	yellow:csi+'43m',
	blue:csi+'44m',
	magenta:csi+'45m',
	cyan:csi+'46m',
	white:csi+'47m',
};
var normal = csi+'0m';

/* functions */
function gotoxy(x,y) {
	output(csi+y+';'+x+'H');
}
function getxy() {
	output(csi+'6n');
}
function pushxy(name,x,y) {
	if(!name) {
		output(csi+'s');
	}
	else if(x && y) {
		xy[name.toLowerCase()] = {x:x,y:y};
	}
}
function popxy(name) {
	if(!name) {
		output(csi+'u');
	}
	else if(xy[name.toLowerCase()]){
		gotoxy(xy[name.toLowerCase()].x,xy[name.toLowerCase()].y);
	}
}
function ins(n) {
	output(csi+n+'@');
}
function del(n) {
	output(csi+n+'P');
}
function right(n) {
	output(csi+n+'C');
}
function left(n) {
	output(csi+n+'D');
}
function up(n) {
	output(csi+n+'A');
}
function down(n) {
	output(csi+n+'B');
}
function clear() {
	output(csi+'0J');
}
function cleartoeol() {
	output(csi+'0K');
}
function home() {
	gotoxy(1,1);
}
function write(str) {
	output(str);
}
function strlen(str) {
	return str.replace(/\033(s|u|\d+[ABCDJKLMPSTXZn]|\d+(;\d\d?)?[Hfm])/g,'').length;
}

/* methods */
module.exports.gotoxy = gotoxy;
module.exports.getxy = getxy;
module.exports.pushxy = pushxy;
module.exports.popxy = popxy;
module.exports.up = up;
module.exports.down = down;
module.exports.left = left;
module.exports.right = right;
module.exports.ins = ins;
module.exports.del = del;
module.exports.clear = clear;
module.exports.cleartoeol = cleartoeol;
module.exports.home = home;
module.exports.write = write;
module.exports.strlen = strlen;

/* colors */
module.exports.fg = fg;
module.exports.bg = bg;
module.exports.normal = normal;

/* attributes */
module.exports.__defineSetter__("attributes",function(attr) {
	if(attr !== undefined)
		output(attr);
	attributes = attr;
});
module.exports.__defineGetter__("attributes",function() {
	return attributes;
});
module.exports.__defineSetter__("output",function(func) {
	if(typeof func == 'function')
		output = func;
	else if(func instanceof Array)
		output = func.push;
	else if(typeof func == "string")
		output = function(str) {
			func += str;
		};
});
module.exports.__defineGetter__("output",function() {
	return output;
});
