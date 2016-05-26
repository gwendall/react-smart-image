'use strict';

var React = require('react');

var Img = React.createClass({
  render: function() {
    return (React.createElement('img', this.props));
  }
});

var DivBg = React.createClass({
  render: function() {
    return (React.createElement('div', this.props, this.props.children));
  }
});

var ABg = React.createClass({
  render: function() {
    return (React.createElement('a', this.props, this.props.children));
  }
});

module.exports = { Img: Img, DivBg: DivBg, ABg: ABg };
