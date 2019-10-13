// import React from 'react';

function CommonHoc<T extends {new(...arg: any[]): any}> (component: T) {
  return class CommonHocs extends component {
    public handleClick = (): void => {
      console.log(11)
    };

    render() {
      const render = super.render();
      return render;
    }
  }
}

export default CommonHoc
