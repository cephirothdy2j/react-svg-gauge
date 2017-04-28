import React, { Component } from 'react';

export default class Gauge extends Component {
	static defaultProps = {
		label: "React SVG Gauge",
		size: 100, // the width in pixels. all other values are calculated off of this
		min: 0,
		max: 100,
		value: 40,
		includeShadow: false,
		color: '#fe0400',
		backgroundColor: "#edebeb",
		valueLabelColor: "#000000",
		minMaxLabelColor: "#999999"
	};

	_getHeight(size) {
		return size / 5 * 4;
	}

	_getValueFontSize(size) {
		return Math.max(size / 5, 12);
	}

	_getMinMaxLabelFontSize(size) {
		return Math.max(size / 15, 8);
	}

	_getPathValues = (value) => {
		var width = this.props.size;
		var height = this._getHeight(width);
		if (value < this.props.min) value = this.props.min;
		if (value > this.props.max) value = this.props.max;

		var dx = 0;
		var dy = 0;
		var gws = 1;

		var alpha = (1 - (value - this.props.min) / (this.props.max - this.props.min)) * Math.PI;
		var Ro = width / 2;
		var Ri = Ro - width / 4;

		var Cx = width / 2 + dx;
		var Cy = height / 1.25 + dy;

		var Xo = width / 2 + dx + Ro * Math.cos(alpha);
		var Yo = height - (height - Cy) - Ro * Math.sin(alpha);
		var Xi = width / 2 + dx + Ri * Math.cos(alpha);
		var Yi = height - (height - Cy) - Ri * Math.sin(alpha);

		return { alpha, Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi };
	};

	_getPath = (value) => {
		var dx = 0;
		var dy = 0;
		var gws = 1;

		var { alpha, Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi } = this._getPathValues(value);

		var path = "M" + (Cx - Ri) + "," + Cy + " ";
		path += "L" + (Cx - Ro) + "," + Cy + " ";
		path += "A" + Ro + "," + Ro + " 0 0 1 " + Xo + "," + Yo + " ";
		path += "L" + Xi + "," + Yi + " ";
		path += "A" + Ri + "," + Ri + " 0 0 0 " + (Cx - Ri) + "," + Cy + " ";
		path += "Z ";

		return path;
	};

	render() {
		var width = this.props.size;
		var height = this._getHeight(width);
		var labelStyle = {textAnchor: "middle", fill:"#010101", stroke: "none", fontStyle: "normal", fontVariant: "normal", fontWeight: 'normal', fontStretch: 'normal', lineHeight: 'normal', fillOpacity: 1};
		var valueLabelStyle = Object.assign({}, labelStyle, {fill: this.props.valueLabelColor, fontSize: this._getValueFontSize(width)});
		var minMaxLabelStyle = Object.assign({}, labelStyle, {fill: this.props.minMaxLabelColor, fontSize: this._getMinMaxLabelFontSize(width)});

		var { Cx, Ro, Ri, Xo, Cy, Xi } = this._getPathValues(this.props.max);
		return (
				<svg height="100%" version="1.1" width="100%" xmlns="http://www.w3.org/2000/svg" style={{width: width, height: height, overflow: 'hidden', position: 'relative', left: 0, top: 0}}>
					{this.props.includeShadow ? (
						<defs>
							<filter id="g3-inner-shadow">
								<feOffset dx="0" dy="3" />
								<feGaussianBlur result="offset-blur" stdDeviation="5" />
								<feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
								<feFlood floodColor="black" floodOpacity="0.2" result="color" />
								<feComposite operator="in" in="color" in2="inverse" result="shadow" />
								<feComposite operator="over" in="shadow" in2="SourceGraphic" />
							</filter>
						</defs>
					) : null}
					<path fill={this.props.backgroundColor} stroke="none" d={this._getPath(this.props.max)} filter={this.props.includeShadow ? "url(#g3-inner-shadow)" : undefined} />
					<path fill={this.props.color} stroke="none" d={this._getPath(this.props.value)} filter={this.props.includeShadow ? "url(#g3-inner-shadow)" : undefined} />
					<text x={width / 2} y={height / 5 * 4} textAnchor="middle" style={valueLabelStyle}>
						{ this.props.value }
					</text>
					<text x={((Cx - Ro) + (Cx - Ri)) / 2} y={Cy + minMaxLabelStyle.fontSize * 1.2} textAnchor="middle" style={minMaxLabelStyle}>
						{this.props.min}
					</text>
					<text x={(Xo + Xi)/2} y={Cy + minMaxLabelStyle.fontSize * 1.2} textAnchor="middle" style={minMaxLabelStyle}>
						{this.props.max}
					</text>
				</svg>
		);
	}
}
