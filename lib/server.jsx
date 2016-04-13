React = require('react');

Img = React.createClass({
  render() {
    return <img {...this.props} />
  }
});

DivBg = React.createClass({
  render() {
    return <div {...this.props}>{this.props.children}</div>
  }
});

ABg = React.createClass({
  render() {
    return <a {...this.props}>{this.props.children}</a>
  }
});

module.exports = { Img, DivBg, ABg };
