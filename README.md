node-ansi
=========

ANSI CSI library for node.js

---

 	Node.JS Frame Library 					
 	mcmlxxix (2013)	

DESCRIPTION:

 	this library is meant to be used in conjunction with other libraries that
 	store display data in a Frame() object or objects
 	this allows for "windows" that can be hidden, moved, closed, etc...
	without destroying the data behind them.

 	the object itself takes the following parameters:

 		x: 			the coordinate representing the top left corner of the frame (horiz)
 		y: 			the coordinate representing the top left corner of the frame (vert)
 		width: 		the horizontal width of the frame 
 		height: 	the vertical height of the frame
 		attr:		the default color attributes of the frame
		parent:		a frame object representing the parent of the new frame
		
METHODS:

	frame.open()				//populate frame contents in character canvas
	frame.close()				//remove frame contents from character canvas
	frame.delete()				//delete this frame (remove from screen buffer, destroy internal references)
	frame.invalidate()			//clear screen buffer to redraw contents on cycle() or draw()
	frame.draw()				//open frame (if not open) move to top (if not on top) and cycle()
	frame.cycle()				//check the display matrix for updated characters and displays them 
	frame.refresh()				//flag all frame sectors for potential update
	frame.load(filename)		//load a binary graphic (.BIN) or ANSI graphic (.ANS) file
	frame.bottom()				//push frame to bottom of display stack
	frame.top()					//pull frame to top of display stack
	frame.scroll(x,y)			//scroll frame n spaces in any direction
	frame.scrollTo(x,y)			//scroll frame to absolute offset
	frame.move(x,y)				//move frame n spaces in any direction
	frame.moveTo(x,y)			//move frame to absolute position
	frame.end()					//opposite of frame.home()
	frame.screenShot(file,append)
								//capture the contents of a frame to file
	frame.getData(x,y,use_offset)
								//return the character and attribute located at x,y in frame.data (optional scroll offset)
	frame.setData(x,y,ch,attr,use_offset)
								//modify the character and attribute located at x,y in frame.data (optional scroll offset)
	frame.clearData(x,y,use_offset)
								//delete the character and attribute located at x,y in frame.data (optional scroll offset)
	frame.clearline(attr)		//see http://synchro.net/docs/jsobjs.html#console
	frame.cleartoeol(attr)
	frame.putmsg(str,attr)
	frame.clear(attr)
	frame.home()
	frame.center(str,attr)
	frame.crlf()
	frame.getxy()
	frame.gotoxy(x,y)
	frame.pushxy()
	frame.popxy()
	
PROPERTIES:

	frame.x						//x screen position
	frame.y						//y screen position
	frame.width					//frame width
	frame.height				//frame height
	frame.data					//frame data matrix 
	frame.data_height			//true height of frame contents (READ ONLY)
	frame.data_width			//true width of frame contents (READ ONLY)
	frame.attr					//default attributes for frame
	frame.checkbounds			//toggle true/false to restrict/allow frame movement outside display
	frame.lf_strict				//toggle true/false to force newline after a crlf-terminated string
	frame.v_scroll				//toggle true/false to enable/disable vertical scrolling
	frame.h_scroll				//toggle true/false to enable/disable horizontal scrolling
	frame.scrollbars			//toggle true/false to show/hide scrollbars
	frame.transparent			//toggle true/false to enable transparency mode 
								//(do not display frame sectors where char == undefined)
	frame.offset				//current offset object {x,y}
	frame.cursor				//current cursor object {x,y}
	frame.parent				//the parent frame of a frame
	frame.id					//a unique identifier (e.g. "0.1.1.2.3")
	frame.is_open				//return true is frame is opened in screen buffer

USAGE:

	//create a new frame object at screen position 1,1. 80 characters wide by 24 tall
 	load("frame.js");
 	var frame = new Frame(1,1,80,24,BG_BLUE);
	
	//add frame to the display canvas
	frame.open();
 
	//add a new frame within the frame object that will display on top at position 10,10
	var subframe = new Frame(10,10,10,10,BG_GREEN,frame);
	
	//add subframe to the display canvas
	subframe.open();
	
	//place cursor at position x:5 y:5 relative to subframe's coordinates
	subframe.gotoxy(5,5);

	//beware this sample infinite loop
 	while(!js.terminated) { 
		//print a message into subframe
		subframe.putmsg("1");
		
		//on first call this will draw the entire initial frame, 
		//as triggered by the open() method call.
		//on subsequent calls this will draw only areas that have changed
		frame.cycle();
		//NOTE: if frames are linked, only one frame needs to be cycled
		//		for all frames to update
	}
	
	//close out the entire frame tree
	frame.close();
	
