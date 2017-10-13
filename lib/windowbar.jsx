import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import platform from 'platform';

import './windowbar.scss';

const getPlatformName = () => {
	let os = platform.os.family || '';
	os = os.toLowerCase().replace(/ /g, '');
	if (/\bwin/.test(os)) {
		os = 'windows';
	} else if (/darwin|osx/.test(os)) {
		os = 'mac';
	} else {
		os = 'other';
	}
	return os;
}

const ALT = 18;

const Windowbar = React.createClass({
	defaultProps: {
		style: null,
		transparent: false,
		draggable: true,
		dark: false,
		dblClickable: true,
	},
	
	getInitialState(){
		return {
			keyAltDown: false,
			fullscreen: false,
		}
	},
	
	componentDidMount(){
		if (this.props.style === 'mac'){
			document.body.addEventListener('keydown', this.handleKeyDown);
			document.body.addEventListener('keyup', this.handleKeyUp);
		}
	},
	
	componentWillUnMount(){
		if (this.props.style === 'mac'){
			document.body.removeEventListener('keydown', this.handleKeyDown);
			document.body.removeEventListener('keyup', this.handleKeyUp);
		}
	},
	
	handleKeyDown(e){
		if (this.props.style === 'mac' && e.keyCode === ALT){
			this.setState({
				keyAltDown: true,
			});
		}
	},
	
	handleKeyUp(e){
		if (this.props.style === 'mac' && e.keyCode === ALT){
			this.setState({
				keyAltDown: false,
			});
		}
	},
	
	handleMaximize(e){
		var { onMaximize, onFullscreen } = this.props;
		var { keyAltDown, fullscreen } = this.state;
		
		if (this.props.style === 'mac'){
			if (keyAltDown && !fullscreen){ onMaximize(e); }
			else {
				this.setState({ fullscreen: !this.state.fullscreen });
				onFullscreen(e);
			}
		} else {
			this.setState({ fullscreen: !this.state.fullscreen });
			onMaximize(e);
		}
	},
	
	handleDblClick(e){
		e.preventDefault;
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		
		if (this.state.dblClickable){
			this.handleMaximize(e);
		}
	},
	
	render(){
		var style = this.props.style || getPlatformName();
		
		var {
			draggable,
			transparent,
			dark,
			onClose,
			onMinimize,
		} = this.props;
		var { keyAltDown, fullscreen } = this.state;
		
		var classes = classNames({
			windowbar: true,
			'wb-mac': style === 'mac',
			'wb-win': style === 'win',
			draggable,
			transparent,
			dark,
			fullscreen,
			alt: keyAltDown,
		});
		
		if (style === 'mac'){
			return (
				<div className={classes} onDoubleClick={this.handleDblClick}>
					<div className="windowbar-controls">
						<div className="windowbar-close" onClick={onClose}>
							<svg x="0px" y="0px" viewBox="0 0 6 6">
								<polygon fill="#860006" points="6,1 6,0 5,0 3,2 1,0 0,0 0,1 2,3 0,5 0,6 1,6 3,4 5,6 6,6 6,5 4,3" />
							</svg>
						</div>
						<div className="windowbar-minimize" onClick={onMinimize}>
							<svg x="0px" y="0px" viewBox="0 0 7 2">
								<rect fill="#9d5615" width={7} height={2} />
							</svg>
						</div>
						<div className="windowbar-maximize" onClick={this.handleMaximize}>
							<svg className="fullscreen-svg" x="0px" y="0px" viewBox="0 0 6 6">
								<path fill="#006413" d="M0,1.4v3.8c0.4,0,0.8,0.3,0.8,0.8h3.8L0,1.4z" />
								<path fill="#006413" d="M6,4.6V0.8C5.6,0.8,5.2,0.4,5.2,0H1.4L6,4.6z" />
							</svg>
							<svg className="exit-fullscreen-svg" x="0px" y="0px" viewBox="0 0 6 6">
								<path fill="#006413" d="M3,0v2.5c0.3,0,0.5,0.2,0.5,0.5H6L3,0z" />
								<path fill="#006413" d="M3,6V3.5C2.7,3.5,2.5,3.3,2.5,3H0L3,6z" />
							</svg>
							<svg className="maximize-svg" x="0px" y="0px" viewBox="0 0 7.9 7.9">
								<polygon fill="#006413" points="7.9,4.5 7.9,3.4 4.5,3.4 4.5,0 3.4,0 3.4,3.4 0,3.4 0,4.5 3.4,4.5 3.4,7.9 4.5,7.9 4.5,4.5" />
							</svg>
						</div>
					</div>
				</div>
				
			);
		} else if (style === 'win'){
			return (
			
				<div className={classes} onDoubleClick={this.handleDblClick}>
					<div className="windowbar-controls">
						<div className="windowbar-minimize" onClick={onMinimize}>
							<svg x="0px" y="0px" viewBox="0 0 10 1">
								<rect fill="#000000" width={10} height={1} />
							</svg>
						</div>
						<div className="windowbar-maximize" onClick={this.handleMaximize}>
							<svg className="maximize-svg" x="0px" y="0px" viewBox="0 0 10 10">
								<path fill="#000000" d="M 0 0 L 0 10 L 10 10 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 9 L 1 9 L 1 1 z " />
							</svg>
							<svg className="unmaximize-svg" x="0px" y="0px" viewBox="0 0 10 10">
								<mask id="Mask">
									<rect fill="#ffffff" width={10} height={10} />
									<path fill="#000000" d="M 3 1 L 9 1 L 9 7 L 8 7 L 8 2 L 3 2 L 3 1 z" />
									<path fill="#000000" d="M 1 3 L 7 3 L 7 9 L 1 9 L 1 3 z" />
								</mask>
								<path fill="#000000" d="M 2 0 L 10 0 L 10 8 L 8 8 L 8 10 L 0 10 L 0 2 L 2 2 L 2 0 z" mask="url(#Mask)" />
							</svg>
						</div>
						<div className="windowbar-close" onClick={onClose}>
							<svg x="0px" y="0px" viewBox="0 0 12 12">
								<polygon fill="#000000" points="12,1 11,0 6,5 1,0 0,1 5,6 0,11 1,12 6,7 11,12 12,11 7,6" />
							</svg>
						</div>
					</div>
				</div>
			
			);
		} else {
			return ( <div>Generic windowbar coming soon</div> );
		}
	}
});

Windowbar.propTypes = {
	style: PropTypes.string,
	transparent: PropTypes.bool,
	dark: PropTypes.bool,
	draggable: PropTypes.bool,
	dblClickable: PropTypes.bool,
	onClose: PropTypes.func,
	onMinimize: PropTypes.func,
	onMaximize: PropTypes.func,
	onFullscreen: PropTypes.func
};

module.exports = Windowbar;
