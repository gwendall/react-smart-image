React = require('react');
_ = require('underscore');

WatcherMixin = {
  _setupWatchers(cycle, props, state) {
    let watchers = (cycle === 'before') ? this.watch.before : this.watch.after;
    if (watchers.props) {
      _.each(watchers.props, function(hook, p) {
        if (this.props[p] !== props[p]) hook.apply(this, [this.props[p], props[p]]);
      }.bind(this));
    }
    if (watchers.state) {
      _.each(watchers.state, function(hook, s) {
        if (this.state[s] !== state[s]) hook.apply(this, [this.state[s], state[s]]);
      }.bind(this));
    }
  },
  componentWillUpdate(nextProps, nextState) {
    if (!this.watch || !this.watch.before) return;
    this._setupWatchers('before', nextProps, nextState);
  },
  componentDidUpdate(prevProps, prevState) {
    if (!this.watch || !this.watch.after) return;
    this._setupWatchers('after', prevProps, prevState);
  }
};

ImgMixin = {
  getInitialState() {
    return {
      src: this.props.src,
      src_fallback: this.srcFallback(),
      opacity: 0,
      status: 'loading'
    };
  },
  srcFallback() {
    if (this.props.srcFallback) return this.props.srcFallback;
    var style = this.props.style || {};
    var width = this.props.width || style.width || 100;
    var height = this.props.height || style.height || 100;
    return 'http://lorempixel.com/' + width + '/' + height + '/cats?v=' + _.random(100);
  },
  loadImage(src, callbacks) {
    var img = document.createElement('IMG');
    img.src = src;
    img.onload = callbacks.onload;
    img.onerror = callbacks.onerror;
  },
  renderImage() {
    this.setState({ status: 'loading' });
    this.loadImage(this.props.src, {
      onload: function() {
        this.setState({ src: this.props.src, opacity: 1, status: 'loaded' });
      }.bind(this),
      onerror: function() {
        this.loadImage(this.state.src_fallback, {
          onload: function() {
            this.setState({ src: this.state.src_fallback });
            setTimeout(function() {
              this.setState({ opacity: 1, status: 'error' });
            }.bind(this), 100);
          }.bind(this),
          onerror: function() {}
        });
      }.bind(this)
    });
  },
  componentDidMount() {
    this.renderImage();
  },
  componentWillUpdate(props, state) {
    if (this.props.src !== props.src) {
      this.setState({ src: null, opacity: 0, status: 'loading' });
    }
  },
  componentDidUpdate(props, state) {
    if (this.props.src !== props.src) {
      this.renderImage();
    }
  }
};

Img = React.createClass({
  mixins: [ImgMixin],
  attrs() {
    return _.extend(_.omit(this.props, 'src') || {}, {
      src: this.state.src,
      className: [this.props.className, 'img-' + this.state.status].join(' '),
      style: _.extend(this.props.style || {}, {
        opacity: this.state.opacity,
        transition: 'opacity 0.6s ease'
      })
    });
  },
  render() {
    return React.DOM.img(this.attrs());
  }
});

BgMixin = {
  attrs() {
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
  },
};

DivBg = React.createClass({
  mixins: [ImgMixin, BgMixin],
  render() {
    return (<div {...this.attrs()}>{this.props.children}</div>);
  }
});

ABg = React.createClass({
  mixins: [ImgMixin, BgMixin],
  render() {
    return (<a {...this.attrs()}>{this.props.children}</a>);
  }
});

module.exports = { Img, DivBg, ABg };
