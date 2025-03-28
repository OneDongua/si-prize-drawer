import React from 'react';
import ReactDOM from 'react-dom';
import PrizeDrawer from './PrizeDrawer';

const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <PrizeDrawer />
    </React.StrictMode>,
    document.getElementById('root')
  );
};

render();

// 添加热加载支持
if (module.hot) {
  module.hot.accept('./PrizeDrawer', () => {
    console.log('Hot reloading PrizeDrawer...');
    render();
  });
}