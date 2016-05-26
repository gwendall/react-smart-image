'use strict';

var React = require('react');
var _ = require('underscore');

var ImgMixin = {
  _isMounted: false,
  getInitialState: function() {
    return {
      src: this.props.src,
      src_fallback: this.srcFallback(),
      opacity: 0,
      status: 'loading'
    };
  },
  srcFallback: function() {
    if (this.props.srcFallback) return this.props.srcFallback;
    var style = this.props.style || {};
    var width = this.props.width || style.width || 100;
    var height = this.props.height || style.height || 100;
    return 'http://lorempixel.com/' + width + '/' + height + '/cats?v=' + _.random(100);
  },
  loadImage: function(src, callbacks) {
    var img = document.createElement('IMG');
    img.src = src;
    img.onload = callbacks.onload;
    img.onerror = callbacks.onerror;
  },
  renderImage: function() {
    this._isMounted && this.setState({ status: 'loading' });
    this.loadImage(this.props.src, {
      onload: function() {
        this._isMounted && this.setState({ src: this.props.src, opacity: 1, status: 'loaded' });
      }.bind(this),
      onerror: function() {
        this.loadImage(this.state.src_fallback, {
          onload: function() {
            this._isMounted && this.setState({ src: this.state.src_fallback });
            setTimeout(function() {
              this._isMounted && this.setState({ opacity: 1, status: 'error' });
            }.bind(this), 100);
          },
          onerror: function() {}
        });
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this._isMounted = true;
    this.renderImage();
  },
  componentWillUpdate: function(props, state) {
    if (this.props.src !== props.src) {
      this._isMounted && this.setState({ src: null, opacity: 0, status: 'loading' });
    }
  },
  componentDidUpdate: function(props, state) {
    if (this.props.src !== props.src) {
      this.renderImage();
    }
  },
  componentWillUnmount: function(props, state) {
    this._isMounted = false;
  }
};

var Img = React.createClass({displayName: "Img",
  mixins: [ImgMixin],
  attrs: function() {
    return _.extend(_.omit(this.props, 'src') || {}, {
      src: this.state.src,
      className: [this.props.className, 'img-' + this.state.status].join(' '),
      style: _.extend(this.props.style || {}, {
        opacity: this.state.opacity,
        transition: 'opacity 0.6s ease'
      })
    });
  },
  render: function() {
    return React.DOM.img(this.attrs());
  }
});

var BgMixin = {
  attrs: function() {
    return _.extend(_.omit(this.props, 'src') || {}, {
      className: [this.props.className, 'div-bg-' + this.state.status].join(' '),
      style: _.extend(this.props.style || {}, {
        opacity: this.state.opacity,
        transition: 'opacity 0.6s ease',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(' + this.state.src + ')'
      })
    });
  }
};

var DivBg = React.createClass({displayName: "DivBg",
  mixins: [ImgMixin, BgMixin],
  render: function() {
    return (React.createElement('div', this.attrs(), this.props.children));
  }
});

var ABg = React.createClass({displayName: "ABg",
  mixins: [ImgMixin, BgMixin],
  render: function() {
    return (React.createElement('a', this.attrs(), this.props.children));
  }
});

module.exports = { Img: Img, DivBg: DivBg, ABg: ABg };
