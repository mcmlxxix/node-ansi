/* ANSI colors */
module.exports.fg = {
	black:'\033[30m',
	red:'\033[31m',
	green:'\033[32m',
	yellow:'\033[33m',
	blue:'\033[34m',
	magenta:'\033[35m',
	cyan:'\033[36m',
	lightgray:'\033[37m',
	darkgray:'\033[30;1m',
	lightred:'\033[31;1m',
	lightgreen:'\033[32;1m',
	lightyellow:'\033[33;1m',
	lightblue:'\033[34;1m',
	lightmagenta:'\033[35;1m',
	lightcyan:'\033[36;1m',
	white:'\033[37;1m',
};
module.exports.bg = {
	black:'\033[40m',
	red:'\033[41m',
	green:'\033[42m',
	yellow:'\033[43m',
	blue:'\033[44m',
	magenta:'\033[45m',
	cyan:'\033[46m',
	white:'\033[47m',
};
module.exports.normal = '\033[0m';


/* internal variables */
var csi = '\033[';
var xy = {};


/* functions */
function gotoxy(x,y) {
	process.stdout.write('\033['+x+';'+y+'H');
}
function getxy() {
	process.stdout.write('\033[6n');
}
function pushxy(name,x,y) {
	if(!name) {
		process.stdout.write('\033[s');
	}
	else if(x && y) {
		xy[name.toLowerCase()] = {x:x,y:y};
	}
}
function popxy(name) {
	if(!name) {
		process.stdout.write('\033[u');
	}
	else if(xy[name.toLowerCase()]){
		gotoxy(xy[name.toLowerCase()].x,xy[name.toLowerCase()].y);
	}
}
function ins(n) {
	process.stdout.write('\033['+n+'@');
}
function del(n) {
	process.stdout.write('\033['+n+'P');
}
function right(n) {
	process.stdout.write('\033['+n+'C');
}
function left(n) {
	process.stdout.write('\033['+n+'D');
}
function up(n) {
	process.stdout.write('\033['+n+'A');
}
function down(n) {
	process.stdout.write('\033['+n+'B');
}
function clear() {
	process.stdout.write('\033[0J');
}

/* export that shit */
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
