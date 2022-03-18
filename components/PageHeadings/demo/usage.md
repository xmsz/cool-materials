---
title: Simple Usage
order: 1
---

本 Demo 演示一行文字的用法。

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PageHeadings from '@cool-in/material-page-headings';

class App extends Component {
  render() {
    return (
      <div>
        <PageHeadings />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
```
