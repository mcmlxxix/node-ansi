var csi = require('../ansi');

/* clear screen with green background */
csi.attributes = csi.bg.green;
csi.clear();

/* should see 2 $$ sign only at x:40 y:15 */
csi.gotoxy(40,15);
csi.write("$$$$$$$");
csi.gotoxy(42,15,true);

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

csi.attributes = csi.bg.black;
csi.gotoxy(3,5);

// Check if CSI is supported by overwriting the “not” if it works
var text = 'SCP not supported';
csi.pushxy();
csi.write( text );
csi.down(1);
csi.left(text.length);
csi.write('SCP = Store Cursor Position');
csi.popxy();
csi.right('SCP'.length);
csi.write(' -->');

/* move cursor out of the way and reset colors */
csi.gotoxy(1,20);
