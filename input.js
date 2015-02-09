/**
*	PandaJS Canvas Input Plugin
*	@author	ThanosS (FishTFM on GitHub)
*
*	Port of CanvasInput 1.1.6 by GoldFire Studios
*	http://goldfirestudios.com/blog/108/CanvasInput-HTML5-Canvas-Text-Input
*
*	MIT License
**/

game.module(
	'plugins.input'
)
.body(function() {
	game.createClass('Input', {
		// Create a buffer that stores all inputs so that tabbing between them is made possible.
		inputs: [],

		// Initialise the Canvas Input.
		init: function(settings)
		{
			settings = settings ? settings : {};

			// Setup the defaults.
			this._x = settings.x || 0;
			this._y = settings.y || 0;
			this._extraX = settings.extraX || 0;
			this._extraY = settings.extraY || 0;
			this._fontSize = settings.fontSize || 14;
			this._fontFamily = settings.fontFamily || 'Arial';
			this._fontColor = settings.fontColor || '#000000';
			this._fontWeight = settings.fontWeight || 'normal';
			this._fontStyle = settings.fontStyle || 'normal';
			this._placeholder = settings.placeholder || '';
			this._placeholderColor = settings.placeholderColor || '#bfbebd';
			this._readonly = settings.readonly || false;
			this._maxlength = settings.maxlength || null;
			this._width = settings.width || 150;
			this._height = settings.height || this._fontSize;
			this._padding = settings.padding >= 0 ? settings.padding : 5;
			this._borderWidth = settings.borderWidth >= 0 ? settings.borderWidth : 1;
			this._borderColor = settings.borderColor || '#959595';
			this._borderRadius = settings.borderRadius >= 0 ? settings.borderRadius : 3;
			this._backgroundColor = settings.backgroundColor || '#ffffff';
			this._backgroundImage = settings.backgroundImage || '';
			this._boxShadow = settings.boxShadow || '1px 1px 0px rgba(255, 255, 255, 1)';
			this._innerShadow = settings.innerShadow || '0px 0px 4px rgba(0, 0, 0, 0.4)';
			this._selectionColor = settings.selectionColor || 'rgba(179, 212, 253, 0.8)';
			this._value = (settings.value || this._placeholder) + '';
			this._cursor = false;
			this._cursorPos = 0;
			this._hasFocus = false;
			this._selection = [0, 0];
			this._wasOver = false;

			this._onsubmit = settings.onsubmit || function() {};
			this._onkeydown = settings.onkeydown || function() {};
			this._onkeyup = settings.onkeyup || function() {};
			this._onfocus = settings.onfocus || function() {};
			this._onblur = settings.onblur || function() {};

			// Parse box shadow.
			this.boxShadow(this._boxShadow, true);

			// Setup main events.
			this.mousemove = function(e) { e = e || window.event; this.mousemove(e, this); };
			this.mousedown = function(e) { e = e || window.event; this.mousedown(e, this); };
			this.mouseup = function(e) { e = e || window.event; this.mouseup(e, this); };

			// Create the hidden input element.
			this._hiddenInput = document.createElement('input');
			this._hiddenInput.type = 'text';
			this._hiddenInput.style.position = 'absolute';
			this._hiddenInput.style.opacity = 0;
			this._hiddenInput.style.pointerEvents = 'none';
			this._hiddenInput.style.left = (this._x + this._extraX + (this._canvas ? this._canvas.offsetLeft : 0)) + 'px';
			this._hiddenInput.style.top = (this._y + this._extraY + (this._canvas ? this._canvas.offsetTop : 0)) + 'px';
			this._hiddenInput.style.width = this._width + 'px';
			this._hiddenInput.style.height = this._height + 'px';
			this._hiddenInput.style.zIndex = 0;

			if (this._maxlength)
				this._hiddenInput.maxLength = this._maxlength;

			document.body.appendChild(this._hiddenInput);
			this._hiddenInput.value = this._value;

			// Setup the keydown listener.
			this._hiddenInput.addEventListener('keydown', function(e)
			{
				e = e || window.event;
				
				if (this._hasFocus)
					this.keydown(e, this);
			});

			// Setup the keyup listener.
			this._hiddenInput.addEventListener('keyup', function(e)
			{
				e = e || window.event;

				// Update the canvas input state information from the hidden input.
				this._value = this._hiddenInput.value;
				this._cursorPos = this._hiddenInput.selectionStart;
				this.render();

				if (this._hasFocus)
					this._onkeyup(e, this);
			});

			// Add this to the buffer.
			this.inputs.push(this);
			this._inputsIndex = inputs.length - 1;

			// Draw the text box.
			this.render();
		},

		x: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._x = data;
				return self.render();
			}
	  		else
				return self._x;
		},

		y: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._y = data;
				return self.render();
			}
			else
				return self._y;
		},

		extraX: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._extraX = data;
				return self.render();
			}
			else
				return self._extraX;
		},

		extraY: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._extraY = data;
				return self.render();
			}
			else
				return self._extraY;
		},

		fontSize: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._fontSize = data;
				return self.render();
			}
			else
				return self._fontSize;
		},

		fontFamily: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._fontFamily = data;
				return self.render();
			}
			else
				return self._fontFamily;
		},

		fontColor: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._fontColor = data;
				return self.render();
			}
			else
				return self._fontColor;
		},

		fontWeight: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._fontWeight = data;
				return self.render();
			}
			else
				return self._fontWeight;
		},

		fontStyle: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._fontStyle = data;
				return self.render();
			}
			else
				return self._fontStyle;
		},

		placeholderColor: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._placeholderColor = data;
				return self.render();
			}
			else
				return self._placeholderColor;
		},

		width: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._width = data;
				self._calcWH();
				self._updateCanvasWH();

				return self.render();
			}
			else
				return self._width;
		},

		height: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._height = data;
				self._calcWH();
				self._updateCanvasWH();

				return self.render();
			}
			else
				return self._height;
		},

		padding: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._padding = data;
				self._calcWH();
				self._updateCanvasWH();

				return self.render();
			}
			else
				return self._padding;
		},

		borderWidth: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._borderWidth = data;
				self._calcWH();
				self._updateCanvasWH();

				return self.render();
			}
			else
				return self._borderWidth;
		},

		borderColor: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._borderColor = data;
				return self.render();
			}
			else
				return self._borderColor;
		},

		borderRadius: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._borderRadius = data;
				return self.render();
			}
			else
				return self._borderRadius;
		},

		backgroundColor: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._backgroundColor = data;
				return self.render();
			}
			else
				return self._backgroundColor;
		},

		boxShadow: function(data, doReturn)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				// parse box shadow
				var boxShadow = data.split('px ');
				self._boxShadow = {
					x: self._boxShadow === 'none' ? 0 : parseInt(boxShadow[0], 10),
					y: self._boxShadow === 'none' ? 0 : parseInt(boxShadow[1], 10),
					blur: self._boxShadow === 'none' ? 0 : parseInt(boxShadow[2], 10),
					color: self._boxShadow === 'none' ? '' : boxShadow[3]
				};

				// take into account the shadow and its direction
				if (self._boxShadow.x < 0)
				{
					self.shadowL = Math.abs(self._boxShadow.x) + self._boxShadow.blur;
					self.shadowR = self._boxShadow.blur + self._boxShadow.x;
				}
				else
				{
					self.shadowL = Math.abs(self._boxShadow.blur - self._boxShadow.x);
					self.shadowR = self._boxShadow.blur + self._boxShadow.x;
				}

				if (self._boxShadow.y < 0)
				{
					self.shadowT = Math.abs(self._boxShadow.y) + self._boxShadow.blur;
					self.shadowB = self._boxShadow.blur + self._boxShadow.y;
				}
				else
				{
					self.shadowT = Math.abs(self._boxShadow.blur - self._boxShadow.y);
					self.shadowB = self._boxShadow.blur + self._boxShadow.y;
				}

				self.shadowW = self.shadowL + self.shadowR;
				self.shadowH = self.shadowT + self.shadowB;

				self._calcWH();

				if (!doReturn)
				{
					self._updateCanvasWH();
					return self.render();
				}
			}
			else
				return self._boxShadow;
		},

		innerShadow: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._innerShadow = data;
				return self.render();
			}
			else
				return self._innerShadow;
		},

		selectionColor: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._selectionColor = data;
				return self.render();
			}
			else
				return self._selectionColor;
		},

		placeholder: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._placeholder = data;
				return self.render();
			}
			else
				return self._placeholder;
		},

		value: function(data)
		{
			var self = this;

			if (typeof data !== 'undefined')
			{
				self._value = data + '';
				self._hiddenInput.value = data + '';

				// Update the cursor position.
				self._cursorPos = self._clipText().length;
				self.render();

				return self;
			}
			else
				return (self._value === self._placeholder) ? '' : self._value;
		},

		onsubmit: function(fn)
		{
			var self = this;

			if (typeof fn !== 'undefined')
			{
				self._onsubmit = fn;

				return self;
			}
			else
				self._onsubmit();
		},

		onkeydown: function(fn)
		{
			var self = this;

			if (typeof fn !== 'undefined')
			{
				self._onkeydown = fn;

				return self;
			}
			else
				self._onkeydown();
		},

		onkeyup: function(fn)
		{
			var self = this;

			if (typeof fn !== 'undefined')
			{
				self._onkeyup = fn;

				return self;
			}
			else
				self._onkeyup();
		},

		focus: function(pos)
		{
			var self = this;

			// If this is readonly, don't allow it to get focus.
			if (self._readonly)
				return;

			// Only fire the focus event when going from unfocussed.
			if (!self._hasFocus)
			{
				self._onfocus(self);

				// Remove focus from all other inputs.
				for (var i = 0; i < self.inputs.length; i++)
				{
					if (self.inputs[i]._hasFocus)
						self.inputs[i]._blur();
				}
			}

			// Remove selection.
			if (!self._selectionUpdated)
				self._selection = [0, 0];
			else
				delete self._selectionUpdated;

			// Update the cursor position.
			self._cursorPos = (typeof pos === 'number') ? pos : self._clipText().length;

			// Clear the placeholder.
			if (self._placeholder === self._value)
			{
				self._value = '';
				self._hiddenInput.value = '';
			}

			self._hasFocus = true;
			self._cursor = true;

			// Setup cursor interval.
			if (self._cursorInterval)
				clearInterval(self._cursorInterval);

			self._cursorInterval = setInterval(function()
			{
				self._cursor = !self._cursor;
				self.render();
			}, 500);

			// Move the real focus to the hidden input.
			var hasSelection = (self._selection[0] > 0 || self._selection[1] > 0);
			self._hiddenInput.focus();
			self._hiddenInput.selectionStart = hasSelection ? self._selection[0] : self._cursorPos;
			self._hiddenInput.selectionEnd = hasSelection ? self._selection[1] : self._cursorPos;

			return self.render();
		},

		blur: function(_this)
		{
			var self = _this || this;

			self._onblur(self);

			if (self._cursorInterval)
				clearInterval(self._cursorInterval);

			self._hasFocus = false;
			self._cursor = false;
			self._selection = [0, 0];
			self._hiddenInput.blur();

			// Fill the placeholder.
			if (self._value === '')
				self._value = self._placeholder;

			return self.render();
		},

		keydown: function(e, self)
		{
			var keyCode = e.which,
				isShift = e.shiftKey,
				key 	= null,
				startText, endText;

			// Make sure the correct text field is being updated.
			if (!self._hasFocus)
				return;

			// Fire custom user event.
			self._onkeydown(e, self);

			// Add support for Ctrl/Cmd + A selection.
			if (keyCode === 65 && (e.ctrlKey || e.metaKey))
			{
				self._selection = [0, self._value.length];
				self._hiddenInput.selectionStart = 0;
				self._hiddenInput.selectionEnd = self._value.length;
				e.preventDefault();

				return self.render();
			}

			// Block key that shouldn't be processed.
			if (keyCode === 17 || e.metaKey || e.ctrlKey)
				return self;

			if (keyCode === 13) // Enter key.
			{
				e.preventDefault();
				self._onsubmit(e, self);
			}
			else if (keyCode === 9) // Tab key.
			{
				e.preventDefault();
				if (self.inputs.length > 1)
				{
					var next = (self.inputs[self._inputsIndex + 1]) ? self._inputsIndex + 1 : 0;
					self.blur();
					setTimeout(function()
					{
						self.inputs[next].focus();
					}, 10);
				}
			}

			// Update the canvas input state information from the hidden input.
			self._value = self._hiddenInput.value;
			self._cursorPos = self._hiddenInput.selectionStart;
			self._selection = [0, 0];

			return self.render();
		},

		click: function(e, self)
		{
			var mouse = self._mousePos(e),
				x 	  = mouse.x,
				y 	  = mouse.y;

			if (self._endSelection)
			{
				delete self._endSelection;
				delete seld._selectionUpdated;

				return;
			}

			if (self._overInput(x, y))
			{
				if (self._mouseDown)
				{
					self._mouseDown = false;
					self.click(e, self);

					return self.focus(self._clickPos(x, y));
				}
			}
			else
			{
				return self.blur();
			}
		},

		mousemove: function(e, self)
		{
			var mouse = self._mousePos(e),
				x 	  = mouse.x,
				y 	  = mouse.y,
				isOver= self._overInput(x, y);

			if (self._hasFocus && self._selectionStart >= 0)
			{
				var curPos = self._clickPos(x, y),
				start = Math.min(self._selectionStart, curPos),
				end = Math.max(self._selectionStart, curPos);

				if (!isOver)
				{
					self._selectionUpdated = true;
					self._endSelection = true;
					delete self._selectionStart;
					self.render();
				
					return;
				}

				if (self._selection[0] !== start || self._selection[1] !== end)
				{
					self._selection = [start, end];
					self.render();
				}
			}
		},

		mousedown: function(e, self)
		{
	  		var mouse = self._mousePos(e),
				x 	  = mouse.x,
				y 	  = mouse.y,
				isOver= self._overInput(x, y);

			// Setup the 'click' event.
			self._mouseDown = isOver;

			// Start the selection drag if inside the input.
			if (self._hasFocus && isOver)
				self._selectionStart = self._clickPos(x, y);
		},

		mouseup: function(e, self)
		{
			var mouse = self._mousePos(e),
				x 	  = mouse.x,
				y 	  = mouse.y;

			// Update selection if a drag has happened.
			var isSelection = self._clickPos(x, y) !== self._selectionStart;
			if (self._hasFocus && self._selectionStart >= 0 && self._overInput(x, y) && isSelection)
			{
				self._selectionUpdated = true;
				delete self._selectionStart;
				self.render();
			}
			else
				delete self._selectionStart;

			self.click(e, self);
		},

		render: function()
		{
			var self = this,
				w 	 = self._outerW,
				h 	 = self._outerH,
				br 	 = self._borderRadius,
				bw 	 = self._borderWidth,
				sw 	 = self._shadowW,
				sh 	 = self._shadowH;

			// TODO: Make the end of the render function.
		}

	});
});
