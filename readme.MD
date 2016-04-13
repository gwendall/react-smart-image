React Smart Image
==========================

A smart img component for React.
[Demo](http://gwen.cc)

Installation  
------------

``` sh
npm install react-smart-image
```

Details
-------

This package provides an enhanced IMG component, allowing to display a placeholder whilst your image loads and a fallback image if it fails loading.

Example
-------  

``` javascript
import React from 'react';
import { Img } from 'react-smart-image';

class MyImage extends React.Component {
  render() {
    return (
      <Img src='/my_wanted_image.png' srcFallback='/my_fallback_image.png' />
    )
  }
}
```

That's it.

Components included
-------

Img: An enhanced Img component
DivBG: A DIV component rendering a vertically + horizontally centered image
ABg: Like DivBG, with an A component
