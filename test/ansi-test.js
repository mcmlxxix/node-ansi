var csi = require('../ansi');

/* clear screen with green background */
csi.attributes = csi.bg.green;
csi.clear();

/* move cursor to x:40, y:10 */
csi.gotoxy(40,10);

/* display # in every foreground color */
for(var f in csi.fg) {
	csi.write(csi.fg[f] + "#");
}

/* move cursor to x:40, y:11 and reset colors to normal */
csi.gotoxy(40,11);
csi.write(csi.normal);

/* display # in every background color */
for(var b in csi.bg) {
	csi.write(csi.bg[b] + "#");
}

/* move cursor to position x:1,y:1 and reset colors */
csi.home();
csi.write(csi.normal);

/* move right, down, left, up and print the numbers 1-4 (note: printing a character also moves the cursor) */
csi.right(2);
csi.write("1");
csi.down(2);
csi.write("2");
csi.left(2);
csi.write("3");
csi.up(2);
csi.write("4");

/* move down 6 lines and clear the line with a blue background (from x:5) */
csi.down(6);
csi.attributes = csi.bg.blue;
csi.cleartoeol();

/* move cursor out of the way and reset colors */
csi.gotoxy(1,20);
csi.attributes = csi.bg.black;
