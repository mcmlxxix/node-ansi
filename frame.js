var ansi = require('./ansi');
var screen_rows = 24;
var screen_columns = 80;

function Frame(x,y,width,height,attr,parent) {

	/* private properties */
	var properties = {
		x:undefined,
		y:undefined,
		width:undefined,
		height:undefined,
		attr:undefined,
		display:undefined,
		data:[],
		open:false,
		curr_attr:undefined,
		id:0
	};
	var settings = {
		v_scroll:true,
		h_scroll:false,
		scrollbars:false,
		lf_strict:true,
		checkbounds:true,
		transparent:false,
		word_wrap:false
	};
	var relations = {
		parent:undefined,
		child:[]
	};
	var position = {
		cursor:new Cursor(0,0,this),
		offset:new Offset(0,0,this),
		stored:new Cursor(0,0,this)
	};
		
	/* protected properties */
	this.__defineGetter__("child", function() {
		return relations.child;
	});
	this.__defineSetter__("child", function(frame) {
		if(frame instanceof Frame)
			relations.child.push(frame);
		else
			throw("child not an instance of Frame()");
	});
	this.__defineGetter__("attr", function() {
		return properties.attr;
	});
	this.__defineSetter__("attr", function(attr) {
		if(attr !== undefined && attr[0] !== '\033')
			throw("invalid attribute: " + attr);
		properties.attr = attr;
	});
	this.__defineGetter__("x", function() { 
		if(properties.x == undefined)
			return properties.display.x; 
		return properties.x;
	});
	this.__defineSetter__("x", function(x) {
		if(x == undefined)
			return;
		if(!checkX(x))
			throw("invalid x coordinate: " + x);
		properties.x = Number(x);
	});
	this.__defineGetter__("y", function() { 
		if(properties.y == undefined)
			return properties.display.y; 
		return properties.y;
	});
	this.__defineSetter__("y", function(y) {
		if(y == undefined)
			return;
		if(!checkY(y))
			throw("invalid y coordinate: " + y);
		properties.y = Number(y);
	});
	this.__defineGetter__("width", function() {
		if(properties.width == undefined)
			return properties.display.width;
		return properties.width;
	});
	this.__defineSetter__("width", function(width) {
		if(width == undefined)
			return;
		if(!checkWidth(this.x,Number(width)))
			throw("invalid width: " + width);
		properties.width = Number(width);
	});
	this.__defineGetter__("height", function() {
		if(properties.height == undefined)
			return properties.display.height;
		return properties.height;
	});
	this.__defineSetter__("height", function(height) {
		if(height == undefined)
			return;
		if(!checkHeight(this.y,Number(height)))
			throw("invalid height: " + height);
		properties.height = Number(height);
	});

	/* read-only properties */
	this.__defineGetter__("cursor",function() {
		return position.cursor;
	});
	this.__defineGetter__("offset",function() {
		return position.offset;
	});
	this.__defineGetter__("id", function() {
		return properties.id;
	});
	this.__defineGetter__("parent", function() {
		return relations.parent;
	});
	this.__defineGetter__("display", function() {
		return properties.display;
	});
	this.__defineGetter__("data_height", function() {
		return properties.data.length;
	});
	this.__defineGetter__("data_width", function() {
		return properties.data[0].length;
	});
	this.__defineGetter__("data", function() {
		return properties.data;
	});
	
	/* protected settings */
	this.__defineGetter__("checkbounds", function() {
		return settings.checkbounds;
	});
	this.__defineSetter__("checkbounds", function(bool) {
		if(typeof bool == "boolean")
			settings.checkbounds=bool;
		else
			throw("non-boolean checkbounds: " + bool);
	});
	this.__defineGetter__("transparent", function() {
		return settings.transparent;
	});
	this.__defineSetter__("transparent", function(bool) {
		if(typeof bool == "boolean")
			settings.transparent=bool;
		else
			throw("non-boolean transparent: " + bool);
	});	this.__defineGetter__("lf_strict", function() {
		return settings.lf_strict;
	});
	this.__defineSetter__("lf_strict", function(bool) {
		if(typeof bool == "boolean")
			settings.lf_strict=bool;
		else
			throw("non-boolean lf_strict: " + bool);
	});
	this.__defineGetter__("scrollbars", function() {
		return settings.scrollbars;
	});
	this.__defineSetter__("scrollbars", function(bool) {
		if(typeof bool == "boolean")
			settings.scrollbars=bool;
		else
			throw("non-boolean scrollbars: " + bool);
	});
	this.__defineGetter__("v_scroll", function() {
		return settings.v_scroll;
	});
	this.__defineSetter__("v_scroll", function(bool) {
		if(typeof bool == "boolean")
			settings.v_scroll=bool;
		else
			throw("non-boolean v_scroll: " + bool);
	});
	this.__defineGetter__("word_wrap", function() {
		return settings.word_wrap;
	});
	this.__defineSetter__("word_wrap", function(bool) {
		if(typeof bool == "boolean")
			settings.word_wrap=bool;
		else
			throw("non-boolean word_wrap: " + bool);
	});
	this.__defineGetter__("h_scroll", function() {
		return settings.h_scroll;
	});
	this.__defineSetter__("h_scroll", function(bool) {
		if(typeof bool == "boolean")
			settings.h_scroll=bool;
		else
			throw("non-boolean h_scroll: " + bool);
	});
	this.__defineGetter__("is_open",function() {
		return properties.open;
	});
	
	/* public methods */
	this.getData = function(x,y,use_offset) {
		var px = x;
		var py = y;
		if(use_offset) {
			px += position.offset.x;
			py += position.offset.y;
		}
		// if(!properties.data[py] || !properties.data[py][px])
			// throw("Frame.getData() - invalid coordinates: " + px + "," + py);
		if(!properties.data[py] || !properties.data[py][px])
			return new Char();
		return properties.data[py][px];
	}
	this.setData = function(x,y,ch,attr,use_offset) {
		var px = x;
		var py = y;
		if(use_offset) {
			px += position.offset.x;
			py += position.offset.y;
		}
		//I don't remember why I did this, but it was probably important at the time
		//if(!properties.data[py] || !properties.data[py][px])
			// throw("Frame.setData() - invalid coordinates: " + px + "," + py);
		if(!properties.data[py]) 
			properties.data[py] = [];
		if(!properties.data[py][px]) 
			properties.data[py][px] = {};
		if(properties.data[py][px].ch == ch && properties.data[py][px].attr == attr)
			return;
		if(ch)
			properties.data[py][px].ch = ch;
		if(attr)
			properties.data[py][px].attr = attr;
		if(properties.open) 
			properties.display.updateChar(this,x,y);
	}
	this.clearData = function(x,y,use_offset) {
		var px = x;
		var py = y;
		if(use_offset) {
			px += position.offset.x;
			py += position.offset.y;
		}
		if(!properties.data[py] || !properties.data[py][px])
			return;
		else if(properties.data[py][px].ch == undefined && properties.data[py][px].attr == undefined)
			return;
		properties.data[py][px].ch = undefined;
		properties.data[py][px].attr = undefined;
		if(properties.open) 
			properties.display.updateChar(this,x,y);
	}
	this.bottom = function() {
		if(properties.open) {
			for(var c in relations.child) 
				relations.child[c].bottom();
			properties.display.bottom(this);
		}
	}
	this.top = function() {
		if(properties.open) {
			properties.display.top(this);
			for(var c in relations.child) 
				relations.child[c].top();
		}
	}
	this.open = function() {
		if(!properties.open) {
			properties.display.open(this);
			properties.open = true;
		}
		for(var c in relations.child) {
			relations.child[c].open();
		}
	}
	this.refresh = function() {
		if(properties.open) {
			properties.display.updateFrame(this);
			for(var c in relations.child) 
				relations.child[c].refresh();
		}
	}
	this.close = function() {
		for(var c in relations.child) 
			relations.child[c].close();
		if(properties.open) {
			properties.display.close(this);
			properties.open = false;
		}
	}
	this.delete = function(id) {
		if(id == undefined) {
			this.close();
			if(relations.parent) {
				relations.parent.delete(this.id);
			}
		}
		else {
			for(var c=0;c<relations.child.length;c++) {
				if(relations.child[c].id == id) {
					relations.child.splice(c--,1);
					break;
				}
			}
		}
	}
	this.move = function(x,y) {
		var nx = undefined;
		var ny = undefined;
		if(checkX(this.x+x) && checkWidth(this.x+x,this.width))
			nx = this.x+x;
		if(checkY(this.y+y) && checkHeight(this.y+y,this.height))
			ny = this.y+y;
		if(nx == undefined && ny == undefined)
			return;
		properties.display.updateFrame(this);
		if(nx !== undefined)
			this.x=nx;
		if(ny !== undefined)
			this.y=ny;
		properties.display.updateFrame(this);
		for (var c in relations.child) 
			relations.child[c].move(x,y);
	}
	this.moveTo = function(x,y) {
		for(var c in relations.child) {
			var cx = (x + (relations.child[c].x-this.x));
			var cy = (y + (relations.child[c].y-this.y));
			relations.child[c].moveTo(cx,cy);
		}
		var nx = undefined;
		var ny = undefined;
		if(checkX(x))
			nx = x;
		if(checkY(y))
			ny = y;
		if(nx == undefined && ny == undefined)
			return;
		properties.display.updateFrame(this);
		if(nx !== undefined)
			this.x=nx;
		if(ny !== undefined)
			this.y=ny;
		properties.display.updateFrame(this);
	}
	this.draw = function() {
		if(properties.open)
			this.refresh();
		else
			this.open();
		this.cycle();
	}
	this.cycle = function() {
		return properties.display.cycle();
	}
	this.load = function(filename,width,height) {
		var f=new File(filename);
		switch(file_getext(filename).substr(1).toUpperCase()) {
		case "ANS":
			if(!(f.open("r",true,4096)))
				return(false);
			var lines=f.readAll(4096);
			f.close();
			
			var attr = this.attr;
			var bg = ansi.bg.black;
			var fg = ansi.fg.lightgray;
			
			var i = 0;
			var y = 0;
			var saved = {};
			
			while(lines.length > 0) {	
				var x = 0;
				var line = lines.shift();
				while(line.length > 0) {
					/* parse an attribute sequence*/
					var m = line.match(/^\x1b\[(\d*);?(\d*);?(\d*)m/);
					if(m !== null) {
						line = line.substr(m.shift().length);
						if(m[0] == 0) {
							bg = ansi.bg.black;
							fg = ansi.fg.lightgray;
							i = 0;
							m.shift();
						}
						if(m[0] == 1) {
							/* TODO: i = HIGH; */
							m.shift();
						}
						if(m[0] >= 40) {
							switch(Number(m.shift())) {
							case 40:
								bg = ansi.bg.black;
								break;
							case 41:
								bg = ansi.bg.red;
								break;
							case 42: 
								bg = ansi.bg.green;
								break;
							case 43:
								bg = ansi.bg.brown;
								break;
							case 44:
								bg = ansi.bg.blue;
								break;
							case 45:
								bg = ansi.bg.magenta;
								break;
							case 46:
								bg = ansi.bg.cyan;
								break;
							case 47:
								bg = ansi.bg.lightgray;
								break;
							}
						}
						if(m[0] >= 30) {
							switch(Number(m.shift())) {
							case 30:
								fg = ansi.fg.black;
								break;
							case 31:
								fg = ansi.fg.red;
								break;
							case 32:
								fg = ansi.fg.green;
								break;
							case 33:
								fg = ansi.fg.brown;
								break;
							case 34:
								fg = ansi.fg.blue;
								break;
							case 35:
								fg = ansi.fg.magenta;
								break;
							case 36:
								fg = ansi.fg.cyan;
								break;
							case 37:
								fg = ansi.fg.lightgray;
								break;
							}
						}
						attr = bg + fg + i;
						continue;
					}
					
					/* parse absolute character position */
					var m = line.match(/^\x1b\[(\d*);?(\d*)[Hf]/);
					if(m !== null) {
						line = line.substr(m.shift().length);
						
						if(m.length==0) {
							x=0;
							y=0;
						}
						else {
							if(m[0])
								y = Number(m.shift())-1;
							if(m[0])
								x = Number(m.shift())-1;
						}
						continue;
					}
					
					/* ignore a bullshit sequence */
					var n = line.match(/^\x1b\[\?7h/);
					if(n !== null) {
						line = line.substr(n.shift().length);
						continue;
					}
					
					/* parse an up positional sequence */
					var n = line.match(/^\x1b\[(\d*)A/);
					if(n !== null) {
						line = line.substr(n.shift().length);
						var chars = n.shift();
						if(chars < 1)
							y-=1;
						else
							y-=Number(chars);
						continue;
					}
					
					/* parse a down positional sequence */
					var n = line.match(/^\x1b\[(\d*)B/);
					if(n !== null) {
						line = line.substr(n.shift().length);
						var chars = n.shift();
						if(chars < 1)
							y+=1;
						else
							y+=Number(chars);
						continue;
					}
					
					/* parse a forward positional sequence */
					var n = line.match(/^\x1b\[(\d*)C/);
					if(n !== null) {
						line = line.substr(n.shift().length);
						var chars = n.shift();
						if(chars < 1)
							x+=1;
						else
							x+=Number(chars);
						continue;
					}
					
					/* parse a backward positional sequence */
					var n = line.match(/^\x1b\[(\d*)D/);
					if(n !== null) {
						line = line.substr(n.shift().length);
						var chars = n.shift()
						if(chars < 1)
							x-=1;
						else
							x-=Number(chars);
						continue;
					}
					
					/* parse a clear screen sequence */
					var n = line.match(/^\x1b\[2J/);
					if(n !== null) {
						line = line.substr(n.shift().length);
						continue;
					}
					
					/* parse save cursor sequence */
					var n = line.match(/^\x1b\[s/);
					if(n !== null) {
						line = line.substr(n.shift().length);
						saved.x = x;
						saved.y = y;
						continue;
					}

					/* parse restore cursor sequence */
					var n = line.match(/^\x1b\[u/);
					if(n !== null) {
						line = line.substr(n.shift().length);
						x = saved.x;
						y = saved.y;
						continue;
					}

					/* set character and attribute */
					var ch = line[0];
					line = line.substr(1);
					
					/* validate position */
					if(y<0) 
						y=0; 
					if(x<0)
						x=0;
					if(x>=this.width) {
						x=0;
						y++;
					}
					/* set character and attribute */
					if(!properties.data[y])
						properties.data[y]=[];
					properties.data[y][x]=new Char(ch,attr);
					x++;
				}
				y++;
			}			
			break;
		case "BIN":
			if(width == undefined || height == undefined)
				throw("unknown graphic dimensions");
			if(!(f.open("rb",true,4096)))
				return(false);
			for(var y=0; y<height; y++) {
				for(var x=0; x<width; x++) {
					var c = new Char();
					if(f.eof)
						return(false);
					c.ch = f.read(1);
					if(f.eof)
						return(false);
					c.attr = f.readBin(1);
					c.id = this.id;
					if(!properties.data[y])
						properties.data[y]=[];
					properties.data[y][x] = c;
				}
			}
			f.close();
			break;
		case "TXT":
			if(!(f.open("r",true,4096)))
				return(false);
			var lines=f.readAll(4096);
			f.close();
			while(lines.length > 0)
				this.putmsg(lines.shift() + "\r\n");
			break;
		default:
			throw("unsupported filetype");
			break;
		}
	}
	this.scroll = function(x,y) {
		var update = false;
		/* default: add a new line to the data matrix */
		if(x == undefined && y == undefined) {
			if(settings.v_scroll) {
				var newrow = [];
				for(var x = 0;x<this.width;x++) {
					for(var y = 0;y<this.height;y++) 
						properties.display.updateChar(this,x,y);
					newrow.push(new Char());
				}
				properties.data.push(newrow);
				position.offset.y++;
				update = true;
			}
		}
		/* otherwise, adjust the x/y offset */
		else {
			if(typeof x == "number" && x !== 0 && settings.h_scroll) {
				position.offset.x += x;
				update = true;
			}
			if(typeof y == "number" && y !== 0 && settings.v_scroll) {
				position.offset.y += y;
				update = true;
			}
			if(update)
				this.refresh();
		}
		return update;
	}
	this.scrollTo = function(x,y) {
		var update = false;
		if(typeof x == "number") {
			if(settings.h_scroll) {
				position.offset.x = x;
				update = true;
			}
		}
		if(typeof y == "number") {
			if(settings.v_scroll) {
				position.offset.y = y;
				update = true;
			}
		}
		if(update)
			this.refresh();
	}
	this.insertLine = function(y) {
		if(properties.data[y])
			properties.data.splice(y,0,[]);
		else
			properties.data[y] = [];
		this.refresh();
		return properties.data[y];
	}
	this.deleteLine = function(y) {
		var l = undefined;
		if(properties.data[y]) {
			l = properties.data.splice(y,1);
			this.refresh();
		}
		return l;
	}
	this.screenShot = function(file,append) {
		return properties.display.screenShot(file,append);
	}
	this.invalidate = function() {
		properties.display.invalidate();
		this.refresh();
	}
	
	/* ansi method emulation */
	this.home = function() {
		position.cursor.x = 0;
		position.cursor.y = 0;
		return true;
	}
	this.end = function() {
		position.cursor.x = this.width-1;
		position.cursor.y = this.height-1;
		return true;
	}
	this.pagedown = function() {
		position.offset.y += this.height-1;
		if(position.offset.y >= this.data_height)
			position.offset.y = this.data_height - this.height;
		this.refresh();
	}
	this.pageup = function() {
		position.offset.y -= this.height-1;
		if(position.offset.y < 0)
			position.offset.y = 0;
		this.refresh();
	}
	this.clear = function(attr) {
		if(attr == undefined)
			attr = this.attr;
		for(var y=0;y<properties.data.length;y++) {
			if(!properties.data[y])
				continue;
			for(var x=0;x<properties.data[y].length;x++) {	
				if(properties.data[y][x]) {
					properties.data[y][x].ch = undefined;
					properties.data[y][x].attr = attr;
				}
			}
		}
		for(var y=0;y<this.height;y++) {
			for(var x=0;x<this.width;x++) {
				properties.display.updateChar(this,x,y);
			}
		}
		this.home();
		return true;
	}
	this.clearline = function(attr) {
		if(attr == undefined)
			attr = this.attr;
		if(!properties.data[position.cursor.y])
			return false;
		for(var x=0;x<properties.data[position.cursor.y].length;x++) {
			if(properties.data[position.cursor.y][x]) {
				properties.data[position.cursor.y][x].ch = undefined;
				properties.data[position.cursor.y][x].attr = attr;
			}
		}
		for(var x=0;x<this.width;x++) {
			properties.display.updateChar(this,x,position.cursor.y);
		}
		return true;
	}
	this.cleartoeol = function(attr) {
		if(attr == undefined)
			attr = this.attr;
		if(!properties.data[position.cursor.y])
			return false;
		for(var x=position.cursor.x;x<properties.data[position.cursor.y].length;x++) {
			if(properties.data[position.cursor.y][x]) {
				properties.data[position.cursor.y][x].ch = undefined;
				properties.data[position.cursor.y][x].attr = attr;
			}
		}
		for(var x=position.cursor.x;x<this.width;x++) {
			properties.display.updateChar(this,x,position.cursor.y);
		}
		return true;
	}
	this.crlf = function() {
		position.cursor.x = 0;
		if(position.cursor.y < this.height-1) 
			position.cursor.y += 1;
		else {}
	}
	this.write = function(str,attr) {
		if(str == undefined)
			return;
		if(settings.word_wrap) 
			str = word_wrap(str,this.width);
		str = str.toString().split('');
		
		if(attr)
			properties.curr_attr = attr;
		else
			properties.curr_attr = this.attr;
		var pos = position.cursor;
		while(str.length > 0) {
			var ch = str.shift();
			putChar.call(this,ch,properties.curr_attr);
			pos.x++;
		}
	}
	this.putmsg = function(str,attr) {
		if(str == undefined)
			return;
		// if(settings.word_wrap) 
		// 	str = word_wrap(str,this.width);
		str = str.toString().split('');
		
		if(attr)
			properties.curr_attr = attr;
		else
			properties.curr_attr = this.attr;
		var pos = position.cursor;
		
		while(str.length > 0) {
			/* handle ansi */
			
			var ch = str.shift();
			switch(ch) {
			case '\033':
				var cReg = /^\[\d+(;\d\d?)?m/;
				var aReg = /^\[(s|u|\d+[ABCDJKLMPSTXZn])/;
				var s = str.join('');
				var match = s.match(cReg);
				if(match) {
					properties.curr_attr += ch + match[0];
				}
				else {
					match = s.match(aReg);
				}
				if(match) {
					str = str.slice(match[0].length);
				}
				break;
			case '\7':		/* Beep */
				break;
			case '\x7f':	/* DELETE */
				break;
			case '\b':
				if(pos.x > 0) {
					pos.x--;
					putChar.call(this," ",properties.curr_attr);
				}
				break;
			case '\r':
				pos.x=0;
				break;
			case '\t':
				pos.x += 4;
				break;
			case '\n':
				pos.y++;
				if(settings.lf_strict && pos.y >= this.height) {	
					this.scroll();
					pos.y--;
				}
				break;
			default:
				putChar.call(this,ch,properties.curr_attr);
				pos.x++;
				break;
			}
		}
	}
	this.center = function(str,attr) {
		position.cursor.x = Math.ceil(this.width/2) - Math.ceil(ansi.strlen(str)/2);
		if(position.cursor.x < 0)
			position.cursor.x = 0;
		this.putmsg(str,attr);
	}
	this.gotoxy = function(x,y) {
		if(typeof x == "object" && x.x && x.y) {
			if(validateCursor.call(this,x.x-1,x.y-1)) {
				position.cursor.x = x.x-1;
				position.cursor.y = x.y-1;
				return true;
			}
			return false;
		}
		if(validateCursor.call(this,x-1,y-1)) {
			position.cursor.x = x-1;
			position.cursor.y = y-1;
			return true;
		}
		return false;
	}
	this.getxy = function() {
		return {
			x:position.cursor.x+1,
			y:position.cursor.y+1
		};
	}
	this.pushxy = function() {
		position.stored.x = position.cursor.x;
		position.stored.y = position.cursor.y;
	}
	this.popxy = function() {
		position.cursor.x = position.stored.x;
		position.cursor.y = position.stored.y;
	}
	this.up = function(n) {
		if(position.cursor.y == 0 && position.offset.y == 0)
			return false;
		if(isNaN(n))
			n = 1;
		while(n > 0) {
			if(position.cursor.y > 0) {
				position.cursor.y--;
				n--;
			}
			else break;
		}
		if(n > 0) 
			this.scroll(0,-(n));
		return true;
	}
	this.down = function(n) {
		if(position.cursor.y == this.height-1 && position.offset.y == this.data_height - this.height)
			return false;
		if(isNaN(n))
			n = 1;
		while(n > 0) {
			if(position.cursor.y < this.height - 1) {
				position.cursor.y++;
				n--;
			}
			else break;
		}
		if(n > 0)
			this.scroll(0,n);
		return true;
	}
	this.left = function(n) {
		if(position.cursor.x == 0 && position.offset.x == 0)
			return false;
		if(isNaN(n))
			n = 1;
		while(n > 0) {
			if(position.cursor.x > 0) {
				position.cursor.x--;
				n--;
			}
			else break;
		}
		if(n > 0) 
			this.scroll(-(n),0);
		return true;
	}
	this.right = function(n) {
		if(position.cursor.x == this.width-1 && position.offset.x == this.data_width - this.width)
			return false;
		if(isNaN(n))
			n = 1;
		while(n > 0) {
			if(position.cursor.x < this.width - 1) {
				position.cursor.x++;
				n--;
			}
			else break;
		}
		if(n > 0) 
			this.scroll(n,0);
		return true;
	}
	
	/* private functions */
	function checkX(x) {
		if(	isNaN(x) || (settings.checkbounds &&  
			(x > properties.display.x + properties.display.width || 
			x < properties.display.x)))
			return false;
		return true;
	}
	function checkY(y) {
		if( isNaN(y) || (settings.checkbounds && 
			(y > properties.display.y + properties.display.height || 
			y < properties.display.y)))
			return false;
		return true;
	}
	function checkWidth(x,width) {
		if(	width < 1 || isNaN(width) || (settings.checkbounds && 
			x + width > properties.display.x + properties.display.width))
			return false;
		return true;
	}
	function checkHeight(y,height) {
		if( height < 1 || isNaN(height) || (settings.checkbounds && 
			y + height > properties.display.y + properties.display.height))
			return false;
		return true;
	}
	function validateCursor(x,y) {
		if(x >= this.width) 
			return false;
		if(y >= this.height) 	
			return false;
		return true;
	}
	function putChar(ch,attr) {
		if(position.cursor.x >= this.width) {
			position.cursor.x=0;
			position.cursor.y++;
		}
		if(position.cursor.y >= this.height) {	
			this.scroll();
			position.cursor.y--;
		}
		this.setData(position.cursor.x,position.cursor.y,ch,attr,true);
	}
	function init(x,y,width,height,attr,parent) {
		if(parent instanceof Frame) {
			properties.id = parent.display.nextID;
			properties.display = parent.display;
			settings.checkbounds = parent.checkbounds;
			relations.parent = parent;
			parent.child = this;
		}
		else {
			properties.display = new Display(x,y,width,height);
		}
		
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.attr = attr;
	}
	init.apply(this,arguments);
}

/* frame reference object */
function Canvas(frame,display) {
	this.frame = frame;
	this.display = display;
	this.__defineGetter__("xoff",function() {
		return this.frame.x - this.display.x;
	});
	this.__defineGetter__("yoff",function() {
		return this.frame.y - this.display.y;
	});
	this.hasData = function(x,y) {
		var xpos = x-this.xoff;
		var ypos = y-this.yoff;
		
		if(xpos < 0 || ypos < 0)
			return undefined;
		if(xpos >= this.frame.width || ypos >= this.frame.height)
			return undefined;
		if(this.frame.transparent && this.frame.getData(xpos,ypos).ch == undefined)
			return undefined;
		return true;
	}
}

/* object representing screen positional and dimensional limits and canvas stack */
function Display(x,y,width,height) {
	/* private properties */
	var properties = {
		x:undefined,
		y:undefined,
		width:undefined,
		height:undefined,
		canvas:{},
		update:{},
		buffer:{},
		count:0
	}

	/* protected properties */
	this.__defineGetter__("x", function() {
		return properties.x;
	});
	this.__defineSetter__("x", function(x) {
		if(x == undefined)
			properties.x = 1;
		else if(isNaN(x))
			throw("invalid x coordinate: " + x);
		else 
			properties.x = Number(x);
	});
	this.__defineGetter__("y", function() {
		return properties.y;
	});
	this.__defineSetter__("y", function(y) {
		if(y == undefined)
			properties.y = 1;
		else if(isNaN(y) || y < 1 || y > screen_rows)
			throw("invalid y coordinate: " + y);
		else 
			properties.y = Number(y);
	});
	this.__defineGetter__("width", function() {
		return properties.width;
	});
	this.__defineSetter__("width", function(width) {
		if(width == undefined)
			properties.width = screen_columns;
		else if(isNaN(width) || (this.x + Number(width) - 1) > (screen_columns))
			throw("invalid width: " + width);
		else 
			properties.width = Number(width);
	});
	this.__defineGetter__("height", function() {
		return properties.height;
	});
	this.__defineSetter__("height", function(height) {
		if(height == undefined)
			properties.height = screen_rows;
		else if(isNaN(height) || (this.y + Number(height) - 1) > (screen_rows))
			throw("invalid height: " + height);
		else
			properties.height = Number(height);
	});
	this.__defineGetter__("nextID",function() {
		return ++properties.count;
	});
	
	/* public methods */
	this.cycle = function() {
		var updates = getUpdateList();
		if(updates.length > 0) {
			var lasty = undefined;
			var lastx = undefined;
			var lastf = undefined;
			for(var update in updates) {
				var u = updates[update];
				if(lasty !== u.y || lastx == undefined || (u.x - lastx) !== 1)
					ansi.gotoxy(u.px,u.py);
				if(lastf !== u.id)
					ansi.attributes = undefined;
				drawChar(u.ch,u.attr,u.px,u.py);
				lastx = u.x;
				lasty = u.y;
				lastf = u.id;
			}
			ansi.attributes=undefined;
			return true;
		}
		return false;
	}
	this.draw = function() {
		for(var y = 0;y<this.height;y++) {
			for(var x = 0;x<this.width;x++) {
				updateChar(x,y);
			}
		}
		this.cycle();
	}
	this.open = function(frame) {
		var canvas = new Canvas(frame,this);
		properties.canvas[frame.id] = canvas;
		this.updateFrame(frame);
	}
	this.close = function(frame) {
		this.updateFrame(frame);
		delete properties.canvas[frame.id];
	}
	this.top = function(frame) {
		var canvas = properties.canvas[frame.id];
		delete properties.canvas[frame.id];
		properties.canvas[frame.id] = canvas;
		this.updateFrame(frame);
	}
	this.bottom = function(frame) {
		for(var c in properties.canvas) {
			if(c == frame.id)
				continue;
			var canvas = properties.canvas[c];
			delete properties.canvas[c];
			properties.canvas[c] = canvas;
		}
		this.updateFrame(frame);
	}
	this.updateFrame = function(frame) {
		var xoff = frame.x - this.x;
		var yoff = frame.y - this.y;
		for(var y = 0;y<frame.height;y++) {
			for(var x = 0;x<frame.width;x++) {
				updateChar(xoff + x,yoff + y/*,data*/);
			}
		}
	}
	this.updateChar = function(frame,x,y) {
		var xoff = frame.x - this.x;
		var yoff = frame.y - this.y;
		updateChar(xoff + x,yoff + y);
	}
	this.screenShot = function(file,append) {
		var f = new File(file);
		if(append) 
			f.open('ab',true,4096);
		else
			f.open('wb',true,4096) ;
		if(!f.is_open)
			return false;
			
		for(var y = 0;y<this.height;y++) {
			for(var x = 0;x<this.width;x++) {
				var c = getTopCanvas(x,y);
				var d = getData(c,x,y);
				if(d.ch)
					f.write(d.ch);
				else
					f.write(" ");
				if(d.attr)
					f.writeBin(d.attr,1);
				else
					f.writeBin(0,1);
			}
		}
		
		f.close();
		return true;
	}
	this.invalidate = function() {
		properties.buffer = {};
	}
	
	/* private functions */
	function updateChar(x,y/*,data*/) {
		//ToDo: maybe store char update so I dont have to retrieve it later?
		if(!properties.update[y])
			properties.update[y] = {};
		properties.update[y][x] = 1; /*data; */
	}
	function getUpdateList() {
		var list = [];
		for(var y in properties.update) {
			for(var x in properties.update[y]) {
				var c = getTopCanvas(x,y);
				var d = getData(c,x,y);
				
				if(d.px < 1 ||  d.py < 1 || d.px > screen_columns || d.py > screen_rows)
					continue;
				if(!properties.buffer[x]) {
					properties.buffer[x] = {};
					properties.buffer[x][y] = d;
					list.push(d);
				}
				else if(properties.buffer[x][y] == undefined ||
					properties.buffer[x][y].ch != d.ch || 
					properties.buffer[x][y].attr != d.attr) {
					properties.buffer[x][y] = d;
					list.push(d);
				}
			}
		}
		properties.update={};
		// if(list.length > 0)
			// console.logStamp("end getUpdateList");
		return list.sort(updateSort);
	}
	function getData(c,x,y) {
		var cd = {
			x:Number(x),
			y:Number(y),
			px:Number(x) + properties.x,
			py:Number(y) + properties.y
		};
		if(c) {
			var d = c.frame.getData(x-c.xoff,y-c.yoff,true);
			cd.id = c.frame.id;
			cd.ch = d.ch;
			if(d.attr)
				cd.attr = d.attr;
			else
				cd.attr = c.frame.attr;
		}
		return cd;
	}
	function updateSort(a,b) {
		if(a.y == b.y)
			return a.x-b.x;
		return a.y-b.y;
	}
	function drawChar(ch,attr,xpos,ypos) {
		if(attr)
			ansi.attributes = attr;
		if(xpos == screen_columns && ypos == screen_rows) 
			ansi.cleartoeol();
		else if(ch == undefined) {
			ansi.write(" ");
		}	
		else {
			ansi.write(ch);
		}
	}
	function getTopCanvas(x,y) {
		var top = undefined;
		for (var prop in properties.canvas) {
			var c = properties.canvas[prop];
			if(c.hasData(x,y))
				top = c;
		}
		return top;
	}

	/* initialize display properties */
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

/* character/attribute pair representing a screen position and its contents */
function Char(ch,attr) {
	this.ch = ch;
	this.attr = attr;
}

/* self-validating cursor position object */
function Cursor(x,y,frame) {
	var properties = {
		x:undefined,
		y:undefined,
		frame:undefined
	}
	this.__defineGetter__("x", function() { 
		return properties.x;
	});
	this.__defineSetter__("x", function(x) {
		if(isNaN(x))
			throw("invalid x coordinate: " + x);
		properties.x = x;
	});
	this.__defineGetter__("y", function() { 
		return properties.y;
	});
	this.__defineSetter__("y", function(y) {
		if(isNaN(y))
			throw("invalid y coordinate: " + y);
		properties.y = y;
	});
	
	if(frame instanceof Frame)
		properties.frame = frame;
	else
		throw("the frame is not a frame");
		
	this.x = x;
	this.y = y;
}

/* self-validating scroll offset object */
function Offset(x,y,frame) {
	var properties = {
		x:undefined,
		y:undefined,
		frame:undefined
	}
	this.__defineGetter__("x", function() { 
		return properties.x;
	});
	this.__defineSetter__("x", function(x) {
		if(x == undefined)
			throw("invalid x offset: " + x);
		else if(x < 0)
			x = 0;
		else if(x > properties.frame.data_width - properties.frame.width)	
			x = properties.frame.data_width - properties.frame.width;
		properties.x = x;
	});
	this.__defineGetter__("y", function() { 
		return properties.y;
	});
	this.__defineSetter__("y", function(y) {
		if(y == undefined)
			throw("invalid y offset: " + y);
		else if(y < 0)
			y = 0;
		else if(y > properties.frame.data_height - properties.frame.height)
			y = properties.frame.data_height - properties.frame.height;
		properties.y = y;
	});
	
	if(frame instanceof Frame)
		properties.frame = frame;
	else
		throw("the frame is not a frame");
		
	this.x = x;
	this.y = y;
}

/* exports */
module.exports = Frame;
