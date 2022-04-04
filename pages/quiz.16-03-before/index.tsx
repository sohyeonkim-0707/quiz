// 클래스 컴포넌트를 함수형 컴포넌트로 변경해 보세요.

import Router from "next/router";
import { Component, createRef } from "react";

export default class MyComponent extends Component {
  state = {
    count: 0,
  };

  inputRef = createRef<HTMLInputElement>();

  componentDidMount() {
    console.log("컴포넌트가 마운트됐습니다~");
    this.inputRef.current?.focus();
  }

  componentDidUpdate() {
    console.log("컴포넌트가 변경됐습니다~");
  }

  componentWillUnmount() {
    alert("컴포넌트가 제거됩니다~");
  }

  onClickButton = () => {
    this.setState((prev: { count: number }) => ({ count: prev.count + 1 }));
  };

  onClickMove = () => {
    Router.push("/");
  };

  render() {
    console.log("마운트 시작");
    return (
      <>
        <input type="password" ref={this.inputRef} />
        <div>카운트: {this.state.count}</div>
        <button onClick={this.onClickButton}>카운트(+1)</button>
        <button onClick={this.onClickMove}>이동하기</button>
      </>
    );
  }
}
