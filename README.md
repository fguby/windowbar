# windowbar

Emulate window title bar in three different styles. See the [demo](http://katacarbix.xyz/windowbar/demo/index.html).

`npm install windowbar`

NOTE: A React component version is available [here](https://github.com/katacarbix/windowbar/tree/windowbar-react).

# Usage

For use in browserify, electron, or a similar environment. Plain javascript:

```javascript
var windowbar = require('windowbar');

var wb = new windowbar({'style':'mac', 'dblClickable':false})
	.on('close', console.log('close'))
	.on('minimize', console.log('minimize'))
	.on('fullscreen', console.log('fullscreen'))
	.on('maximize', console.log('maximize'))
	.appendTo(document.body);
```

The returned instance emits four events: `close`, `minimize`, `maximize`, and `fullscreen`. Note: `maximize` can also be triggered in the Mac style by alt-clicking fullscreen.

The constructor accepts an options object with these properties:

* `dark` (default `false`): Dark theme.
* `dblClickable` (default `true`): Allows double clicking windowbar to trigger maximize event.
* `draggable` (default `true`): Enables/disables the [-webkit-app-region](https://developer.chrome.com/apps/app_window) CSS property on the root element. Allows frameless windows to be dragged in an `electron` application.
* `fixed` (default `false`): Affixes the windowbar at the top of the page.
* `style` (defaults to current OS, or `default` if unrecognized): Possible values are `mac`, `win`, or `default`.
* `title`: Sets the title. Can be changed later with `updateTitle(t)`.
* `transparent` (default `false`): Transparent background for an overlayed effect.



# To do

* Update react component
* ~~Add default style~~
