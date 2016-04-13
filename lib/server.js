React = require('react');

Img = React.createClass({displayName: "Img",
  render() {
    return React.createElement("img", React.__spread({},  this.props))
  }
});

DivBg = React.createClass({displayName: "DivBg",
  render() {
    return React.createElement("div", React.__spread({},  this.props), this.props.children)
  }
});

ABg = React.createClass({displayName: "ABg",
  render() {
    return React.createElement("a", React.__spread({},  this.props), this.props.children)
  }
});

module.exports = { Img, DivBg, ABg };
