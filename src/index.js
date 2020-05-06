const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const domify = require('domify');
const defaultCss = require('defaultcss');
const classes = require('component-classes');

const ALT = 18;

const html = function(s = '', cb){
	const file = fs.readFileSync(path.join('dist', 'windowbar.html'), 'utf8');
	const html = domify(file);
	
	if (s === 'mac') return html.querySelector('.wb-mac');
	if (s === 'win') return html.querySelector('.wb-win');
	if (s === 'default') return html.querySelector('.wb-default');
	return '';
}
const css = fs.readFileSync(path.join('dist', 'style.css'), 'utf8');

class Windowbar extends EventEmitter {
	constructor(options = {}){
		super();
		
		// Get Options
		this.options = {
			dark: options.dark || false,
			draggable: ('draggable' in options ? options.draggable : true),
			fixed: options.fixed || false,
			style: options.style || '',
			title: options.title || '',
			tall: options.tall || false,
			transparent: options.transparent || false
		};
		
		// Set proper style
		if (!['mac','win','default'].includes(this.options.style)){
			if (process.platform === 'darwin') this.options.style = 'mac';
			else if (process.platform === 'win32') this.options.style = 'win';
			else this.options.style = 'default';
		}
		
		// Create Windowbar element
		this.element = html(this.options.style);
		
		// Set title
		this.updateTitle(this.options.title);
		
		// Register buttons
		this.minimizeButton = this.element.querySelector('.windowbar-minimize');
		this.maximizeButton = this.element.querySelector('.windowbar-maximize');
		this.closeButton = this.element.querySelector('.windowbar-close');
		
		// Add classes
		if (this.options.dark) classes(this.element).add('dark'); // Dark mode
		if (this.options.draggable) classes(this.element).add('draggable'); // Draggable
		if (this.options.fixed) classes(this.element).add('fixed'); // affix above content
		if (this.options.tall && this.options.style == 'mac') classes(this.element).add('tall'); // Tall bar (mac only)
		if (this.options.transparent) classes(this.element).add('transparent'); // Transparent
		
		// Add click events
		this.element.addEventListener('dblclick', event => this.onDblClick(event));
		this.minimizeButton.addEventListener('click', event => this.clickMinimize(event));
		this.maximizeButton.addEventListener('click', event => this.clickMaximize(event));
		this.closeButton.addEventListener('click', event => this.clickClose(event));
		
		// Show maximize svg while holding alt (mac only)
		if (this.options.style === 'mac'){
			var self = this;
			window.addEventListener('keydown', function(e){
				if(e.keyCode === ALT) classes(self.element).add('alt');
			});
			window.addEventListener('keyup', function(e){
				if(e.keyCode === ALT) classes(self.element).remove('alt');
			});
		}
	}
	
	clickClose(e){ this.emit('close', e); };
	
	clickMinimize(e){ this.emit('minimize', e); };
	
	clickMaximize(e){
		if (this.options.style === 'mac'){
			if (e.altKey && !classes(this.element).has('fullscreen')) this.emit('maximize', e);
			else {
				classes(this.element).toggle('fullscreen');
				this.emit('fullscreen', e);
			}
		} else {
			classes(this.element).toggle('fullscreen');
			this.emit('maximize', e);
		}
	};
	
	onDblClick(e){
		e.preventDefault;
		if (this.options.dblClickable && !(this.minimizeButton.contains(e.target) || this.maximizeButton.contains(e.target) || this.closeButton.contains(e.target))){
			this.clickMaximize(e);
			console.log('dblclick', e);
		}
	};
	
	updateTitle(t){
		this.options.title = t;
		this.element.querySelector('.windowbar-title').innerHTML = t;
	}
	
	appendTo(context = document.body){
		defaultCss('windowbar', css);
		context.appendChild(this.element);
		return this;
	};
	
	destroy(){
		parent.removeChild(this.element);
		return this;
	};
}

module.exports = Windowbar;
