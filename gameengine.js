/*
 * made by romasan 2013
 */
var time = 2 * 60
var timer = function() {
	time -= 1;
	var _m = (time / 60)|0,
		_s = time % 60
		_m = (_m > 9)?_m:'0' + _m
		_s = (_s > 9)?_s:'0' + _s
	if(time > 0) {
		$('#time').html(_m + '-' + _s)
		setTimeout(function(){timer()}, 1000)
	
	} else {
		splash(scaling().w / 2, scaling().h / 2, 'score : ' + points, function(){document.location.reload()}, 1000)
	}
}
//------------------------------------------------------------------------------------------
var splash = function(x, y, s, f, t) {
	t = (typeof t == 'undefined') ? 0 : t;
	$('body').append(
		$('<div>')
			.css({
				position      : 'absolute',
				top           : y - 50 + 'px',
				left          : x - 150 + 'px',
				width         : '300px',
				height        : '100px',
				color         : '#fff',
				'text-shadow' : '0px 1px #000',
				'text-align'  : 'center',
				'line-height' : '100px',
				'font-size'   : '1pt',
			})
			.html(s)
			.attr({
				id : 'splash'
			})
			.animate({
				'font-size' : '27pt'
			}, function() {
				setTimeout(function() {
					$('#splash')
						.animate({
							'font-size' : '1pt'
						}, function() {
							$('#splash').remove()
							if(typeof f == 'function') {f()}
						})
				}, t)
			})
	)
}
//-----------------------------------------------------------------------------------------
var a = 0xff, b = 0, c = 0
var points = 0
var color0 = '',
	color = ''
function randbg() {
	if(a > 0xff) {a = 0xff}
    if(b > 0xff) {b = 0xff}
    if(c > 0xff) {c = 0xff}
	var _a = ((a < 0x10)?'0':'') + (a).toString(16)
	var _b = ((b < 0x10)?'0':'') + (b).toString(16)
	var _c = ((c < 0x10)?'0':'') + (c).toString(16)
    if(a < 0) {a = 0}
    if(b < 0) {b = 0}
    if(c < 0) {c = 0}
	//alert('#' + _a + _b + _c)
	$('body').css({background : color0})
	color0 = '#' + _a + _b + _c
	color = '#' +
		(((0xff - a) < 0x10)?'0':'') + (0xff - a).toString(16) +
		(((0xff - b) < 0x10)?'0':'') + (0xff - b).toString(16) +
		(((0xff - c) < 0x10)?'0':'') + (0xff - c).toString(16)
	$('#bar').css({color : color})
	if(typeof Game.ctx != 'undefined') {
		Game.redraw()
	}
    a = parseInt(a)
    b = parseInt(b)
    c = parseInt(c)
    if(a == 0xff && b < 0xff  && c == 0   ) {b += 1}
	if(a > 0     && b == 0xff && c == 0   ) {a -= 1}
	if(a == 0    && b == 0xff && c < 0xff ) {c += 1}
	if(a == 0    && b > 0     && c == 0xff) {b -= 1}
	if(a < 0xff  && b == 0    && c == 0xff) {a += 1}
	if(a == 0xff && b == 0    && c > 0    ) {c -= 1}
	setTimeout(function(){
		randbg()
	}, 0)
}
var level = 0;
//-----------------------------------------------------------------------------------------
function scaling(i) {
	var _w = document.body.clientWidth,
		_h = document.body.clientHeight,
		SCALINGFACTOR = _w / ((_w > _h)?480:320); 
	if(typeof i == 'undefined') {return {w : _w, h : _h}}
	return i * SCALINGFACTOR;
}
//-----------------------------------------------------------------------------------------
/*
var f = function() {
	this.test = 7;
	this.t = function() {
		return this.test;
	}
}
f.prototype.tt = function() {
	return this.test;
}
*/
colors = ['#f00', '#0f0', '#00f']
Game = {
	name : 'points1',
	start : function() {
		this.draw();
	},
	maxg : 6,
	maxv : 8,
	radius : 17,
	margin : 30,
	//distance : 0,
	//radius : 0,
	step : {},
	checknextstep : function(a) {
		//if(b.length == 0) {return false}
		//var step = this.step
		if(
			(a.x == this.step.x     && a.y == this.step.y + 1) ||
			(a.x == this.step.x     && a.y == this.step.y - 1) ||
			(a.x == this.step.x + 1 && a.y == this.step.y    ) ||
			(a.x == this.step.x - 1 && a.y == this.step.y    )
		) {
			return true;
		}
		return false;
	},
	notin : function(a ,b) {
		for(i in b) {
			if(b[i].x == a.x && b[i].y == a.y) {
				return false
			}
		}
		return true
	},
	cur : {},
	addtopatch : function(a) {
		if(!this.m) {
			console.log('not started');
			return
		}
		//console.log(this.step)
		a.color = this.map[a.y][a.x].color
		_l = this.patch.length
		//console.log('***', _b, this.patch, _l);
		if(_l == 0) {
			if(this.notin(a, this.patch)) {	
				this.patch.push(a)
				this.step = a
				this.map[a.y][a.x].removed = true
				//$('#bar').html('A ' + a.y + ' ' + a.x)
			}
		} else {
			if(this.checknextstep(a) && this.step.color == a.color) {
				if(this.notin(a, this.patch)) {	
//					console.log('*', a, this.patch.length);
					this.patch.push(a)
					this.step = a
					this.map[a.y][a.x].removed = true
					//$('#bar').html('B ' + a.y + ' ' + a.x + ' length ' + this.patch.length)
				}
			}
		}
		this.redraw()
	},
	checkpoint : function(c) {
		this.cur = {x : c.x, y : c.y}
		//this.radius
		for(var y = 0; y < this.maxv; y++) {
			for(var x = 0; x < this.maxg; x++) {
				_x  = this.margin + this.radius + (this.distance + 2 * this.radius) * x
				_y  = this.margin + this.radius + (this.distance + 2 * this.radius) * y
				//_xx = c.x - _x
				//_yy = c.y - _y
				//_rr = Math.sqrt(_xx * _xx + _yy * _yy)
				//if(this.radius >= _rr) {return {x : x, y : y}}
				if(
					c.x > _x - this.radius && c.x < _x + this.radius && 
					c.y > _y - this.radius && c.y < _y + this.radius
				) {
					return {x : x, y : y}
				}
			}
		}
		return false
	},
	m : false,
	mdown : function() {
		this.m = true
		this.patch = []
	},
	mmove : function() {
		//point = this.checkpoint(c)
		//if(point) {
		//	this.addtopatch(point)
		//}
	},
	mup : function() {
//		console.log('***')
		this.m = false
		if(this.patch.length > 2) {
			splash(this.cur.x, this.cur.y - scaling(50), '+' + this.patch.length)
			for(var x = 0; x < this.maxg; x++) {
				var counter = 0
				for(y = this.maxv - 1; y >= 0; y--) {
					if(this.map[y][x].removed) {
						counter += 1
					} else {
						if(counter > 0) {
							this.map[y + counter][x].color = this.map[y][x].color
							this.map[y][x].removed = true
							this.map[y + counter][x].removed = false
						}
					}
					
				}
			}
			this.redraw()
			for(var x = 0; x < this.maxg; x++) {
				for(var y = 0; y < this.maxv; y++) {
					if(this.map[y][x].removed) {
						this.map[y][x].color = (Math.random()*colors.length)|0
						points += 1
						this.map[y][x].removed = false
					}
				}
			}
			$('#points').html(points)
		}
		for(var y = 0; y < this.maxv; y++) {
			for(var x = 0; x < this.maxg; x++) {
				this.map[y][x].removed = false;
			}
		}
		this.patch = []
		this.redraw()
		//remove points in patch
		/*
		*/
	},
	
	//fall animation
	drawpoint : function(_x, _y, _c, _f) {
		this.ctx.beginPath()
			this.ctx.arc(_x, _y, this.radius, 0, 2 * Math.PI, false)
			this.ctx.fillStyle = colors[_c]
			this.ctx.fill()
			this.ctx.lineWidth = scaling((_f)?3:1)
			this.ctx.strokeStyle = (_f)?'#fff':color
		this.ctx.stroke()
	},
	redraw : function() {
		this.ctx.clearRect(0, 0, scaling().w, scaling().h)
		this.ctx.beginPath()
		for(i in this.patch) {
			var _x = this.margin + this.radius + (this.distance + 2 * this.radius) * this.patch[i].x,
				_y = this.margin + this.radius + (this.distance + 2 * this.radius) * this.patch[i].y
			if(i == 0) {
				this.ctx.moveTo(_x, _y)
			} else {
				this.ctx.lineWidth = scaling(9)
				this.ctx.strokeStyle = '#fff'
				//this.ctx.lineWidth = 3
				//this.ctx.strokeStyle = colors[this.step.color]
				this.ctx.lineTo(_x, _y)
				//this.ctx.quadraticCurveTo(45, 310, 70, 120)
				//this.ctx.bezierCurveTo(45, 310, 70, 120, 150, 400)
				//this.ctx.strokeStyle = "#138CCB"
			}
		}
		this.ctx.lineTo(this.cur.x, this.cur.y)
		this.ctx.stroke()
		for(var y = 0; y < this.maxv; y++) {
			for(var x = 0; x < this.maxg; x++) {
				_x = this.margin + this.radius + (this.distance + 2 * this.radius) * x
				_y = this.margin + this.radius + (this.distance + 2 * this.radius) * y
				_c = this.map[y][x].color,
				_f = this.map[y][x].removed
				//console.log('***', _f);
				this.drawpoint(_x, _y, _c, _f)
			}
		}
		this.ctx.beginPath()
		for(i in this.patch) {
			var _x = this.margin + this.radius + (this.distance + 2 * this.radius) * this.patch[i].x,
				_y = this.margin + this.radius + (this.distance + 2 * this.radius) * this.patch[i].y
			if(i == 0) {
				this.ctx.moveTo(_x, _y)
			} else {
				this.ctx.lineWidth = scaling(3)
				this.ctx.strokeStyle = colors[this.step.color]
				this.ctx.lineTo(_x, _y)
			}
		}
		this.ctx.lineTo(this.cur.x, this.cur.y)
		this.ctx.stroke()
	},
	draw : function( ) {
		//$('body').css({
		//	background : '#' + (0xFFFFF + (Math.random() * 0xF00000)|0).toString(16)
		//})
		randbg()
		timer()
		this.margin   = scaling(this.margin)
		this.w        = scaling().w - 2 * this.margin
		this.h        = scaling().h - 2 * this.margin
		this.radius   = scaling(this.radius)
		this.distance = (this.w - this.radius * 2 * this.maxg) / (this.maxg - 1)
//		this.map = $('<canvas>')
//						.attr({
//							id     : 'map',
//							width  : this.w,
//							height : this.h
//						})
		this.canvas = document.createElement('canvas')
		this.canvas.width  = scaling().w
		this.canvas.height = scaling().h
//		$('body')
//			.children().remove()
//			.html(
//				this.map
//			);
		this.ctx = this.canvas.getContext("2d")
		this.ctx.clearRect(0, 0, scaling().w, scaling().h)
		this.map = []
		for(var y = 0; y < this.maxv; y++) {
			this.map[y] = []
			for(var x = 0; x < this.maxg; x++) {
				var _x = this.margin + this.radius + (this.distance + 2 * this.radius) * x,
					_y = this.margin + this.radius + (this.distance + 2 * this.radius) * y,
					_c = (Math.random()*colors.length)|0
				this.map[y][x] = {color : _c, removed : false}
				this.drawpoint(_x, _y, _c)
				/*
				$('body').append(
					$('<div>').css({
						position : 'absolute',
						left     : _x - this.radius + 'px',
						top      : _y - this.radius + 'px',
						width    : 2 *  this.radius + 'px',
						height   : 2 *  this.radius + 'px',
						//border : '1px dashed #fff'
					})
					.data({x : x, y : y})
					.attr({x : x, y : y})
				)
				*/
			}
		}
		//------------------
		//this.ctx.beginPath()
		//this.ctx.moveTo(10, 10)
		//this.ctx.lineTo(100, 100)
		//this.ctx.quadraticCurveTo(45, 310, 70, 120)
		//this.ctx.bezierCurveTo(45, 310, 70, 120, 150, 400)
		//this.ctx.strokeStyle = "#138CCB"
		//this.ctx.stroke()
		//------------------
		document.body.appendChild(this.canvas)
		this.debug_counter = 0
		this.debug_swipe   = true;
		$('body').swipe({
			swipeStatus : function(event, phase, direction, distance, duration, fingers) {
				if(event.pageX == 0) {Game.debug_swipe = false}
				if(Game.debug_swipe == false) {return}
				//var _x = parseInt($(event.target).attr('x')),
				//	_y = parseInt($(event.target).attr('y'))
				if(phase == 'start') {
					Game.mdown()
				}
				//if((_x).toString() != 'NaN' && (_y).toString() != 'NaN') {
				//	Game.addtopatch({x : _x, y : _y})
				//	Game.debug_counter += 1
				//}
				
				var _c = Game.checkpoint({x : event.pageX, y : event.pageY})
				if(_c){
					Game.addtopatch({x : _c.x, y : _c.y})
				}
				if(phase == 'end') {
					Game.mup()
				}
			}
		})
		//---------------------------------
		document.body.addEventListener('touchstart', function(e) {
			//$('#bar').html('start')
			Game.mdown()
		})
		document.body.addEventListener('touchmove', function(e) {
			//if (event.targetTouches.length == 1) {
			var touch = event.targetTouches[0]
			var _c = Game.checkpoint({x : touch.pageX, y : touch.pageY})
			if(_c){
				Game.addtopatch({x : _c.x, y : _c.y})
			}
			//$('#bar').html('(' + touch.pageX + ' : ' + touch.pageY + ') ')
			//}
		})
		document.body.addEventListener('touchend', function(e) {
			Game.mup()
			//$('#bar').html('end')
		})
		/*
		$('body').append(
			$('<div>')
			.draggable({
				revert : true
			})
			.addClass('drug')
			.css({
				width    : scaling().w + 'px',
				height   : scaling().h + 'px',
				border : '1px dashed #fff',
				//background : '#f00',
				//opacity : '.5'
			})
		)
		*/
		$('body').append(
			$('<div>')
				.css({
					position      : 'absolute',
					top           : (scaling(3)|0)  + 'px',
					left          : (scaling(10)|0) + 'px',
					width         : '100%',
					height        : '50px',
					color         : '#fff',
					'font-size'   : (scaling(16)|0) + 'pt',
					//'text-shadow' : '0px 1px #000'
				})
				.attr({id : 'bar'})
				.append('points : ')
				.append($('<span>').attr({id : 'points'}).html('0'))
				.append(' time : ')
				.append($('<span>').attr({id : 'time'}).html('00-00'))
		)
		//---------------------------------
		console.log('draw canvas', scaling().w, scaling().h)
	}
}
//-----------------------------------------------------------------------------------------
$(document).ready(function(){
	Game.start();
});