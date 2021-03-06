// 로그인화면
// quiz login 페이지
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { accessTokenState } from "../../../src/commons/store";

const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      accessToken
    }
  }
`;

export default function LoginPage() {
  const [, setAccessToken] = useRecoilState(accessTokenState);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser] = useMutation(LOGIN_USER);

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChlickPassword = (event) => {
    setPassword(event.target.value);
  };

  const onClickLogin = async () => {
    const result = await loginUser({
      variables: {
        email: email,
        password: password,
      },
    });
    console.log(result);
    const accessToken = result.data.loginUser.accessToken;
    setAccessToken(accessToken);
    console.log(accessToken);
    alert("로그인에 성공하였습니다.");
    alert("비회원으로 담긴 게시물 장바구니가 존재합니다. 이동하시겠습니까?");
    router.push("/quiz26/basket/");
  };

  return (
    <div>
      이메일: <input type="text" onChange={onChangeEmail}></input>
      <br />
      비밀번호: <input type="password" onChange={onChlickPassword}></input>
      <br />
      <button onClick={onClickLogin}>로그인하기</button>
    </div>
  );
}
