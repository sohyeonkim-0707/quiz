import { gql, useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useForm } from "react-hook-form";

const InputBar = styled.input`
  width: 300px;
  font-size: 20px;
`;

const Error = styled.p`
  color: red;
  font-size: 12px;
`;

export const WrapperTableHeader = styled.div`
  display: grid;
  width: 100%;
  height: auto;
  grid-template-columns: 20% 20% 40% 20%;
  grid-template-rows: repeat(1, 50px);
  border-top: 1px solid black;
  border-bottom: 1px solid #bdbdbd;
`;

export const WrapperTableBody = styled.div`
  display: grid;
  width: 100%;
  height: auto;
  grid-template-columns: 20% 20% 40% 20%;
  grid-template-rows: repeat(1, 50px);
  border-bottom: 1px solid black;
`;

export const HearderBox = styled.div`
  font-family: "Noto Sans CJK KR";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 48px;
  text-align: center;
  color: #000000;
`;

export const BodyBox = styled.div`
  border-bottom: 1px solid gray;
  font-family: "Noto Sans CJK KR";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 50px;
  text-align: center;
  color: #4f4f4f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const FETCH_BOARDS = gql`
  query fetchBoards {
    fetchBoards {
      _id
      writer
      title
      contents
    }
  }
`;

const DELETE_BOARD = gql`
  mutation deleteBoard($boardId: ID!) {
    deleteBoard(boardId: $boardId)
  }
`;

const CREATE_BOARD = gql`
  mutation createBoard($createBoardInput: CreateBoardInput!) {
    createBoard(createBoardInput: $createBoardInput) {
      _id
      writer
      title
      contents
    }
  }
`;

interface IFormvalues {
  writer?: string;
  title?: string;
  contents?: string;
  password?: string;
}

export default function ApolloCacheStatePage() {
  const [deleteBoard] = useMutation(DELETE_BOARD);
  const [createBoard] = useMutation(CREATE_BOARD);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const { data } = useQuery(FETCH_BOARDS);

  // async ?????? ?????? ????????? ?????? ???????????????
  const onClickDelete = (boardId: string) => async () => {
    // ??????????????????
    await deleteBoard({
      variables: { boardId },
      // data = cache?????? ????????? data
      refetchQueries: [
        {
          query: FETCH_BOARDS,
          variables: {
            page: 1,
          },
        },
      ],
    });
  };

  const onClickSubmit = async (data: IFormvalues) => {
    console.log(data.writer);
    // ??????????????????
    await createBoard({
      variables: {
        createBoardInput: {
          writer: data.writer,
          password: data.password,
          title: data.title,
          contents: data.contents,
        },
      },
      update(cache, { data }) {
        // data.createBoard;
        cache.modify({
          fields: {
            fetchBoards: (prev) => {
              return [data.createBoard, ...prev];
            },
          },
        });
      },
    });
  };

  return (
    <>
      <WrapperTableHeader>
        <HearderBox>?????????</HearderBox>
        <HearderBox>??????</HearderBox>
        <HearderBox>??????</HearderBox>
        <HearderBox>??????</HearderBox>
      </WrapperTableHeader>
      {data?.fetchBoards.map((el) => (
        // <div key={el._id}>
        <WrapperTableBody key={el._id}>
          <BodyBox>{el.writer}</BodyBox>
          <BodyBox>{el.title}</BodyBox>
          <BodyBox>{el.contents}</BodyBox>
          <button onClick={onClickDelete(el._id)}>X</button>
        </WrapperTableBody>
        // </div>
      ))}

      <form onSubmit={handleSubmit(onClickSubmit)}>
        <div>
          ?????????:
          <InputBar
            placeholder="??????2?????? ?????? ??????????????????"
            type="text"
            {...register("writer", {
              required: "???????????? ?????????????????????.",
              minLength: {
                value: 2,
                message: "??????2?????? ?????? ?????????????????????.",
              },
            })}
          />
          {errors.writer && <Error>{errors.writer.message}</Error>}
        </div>
        <div>
          ????????????:
          <InputBar
            placeholder="??????8?????? ?????? ??????????????????"
            type="password"
            {...register("password", {
              required: "??????????????? ?????????????????????.",
              minLength: {
                value: 8,
                message: "??????8?????? ?????? ?????????????????????.",
              },
            })}
          />
          {errors.password && <Error>{errors.password.message}</Error>}
        </div>
        <div>
          ??????:
          <InputBar
            placeholder="????????? ??????????????????"
            type="text"
            {...register("title", {
              required: "????????? ?????????????????????.",
            })}
          />
          {errors.title && <Error>{errors.title.message}</Error>}
        </div>
        <div>
          ??????:{" "}
          <InputBar
            placeholder="????????? ??????????????????"
            type="text"
            {...register("contents", {
              required: "????????? ?????????????????????.",
            })}
          />
          {errors.contents && <Error>{errors.contents.message}</Error>}
        </div>
        <button>????????????</button>
      </form>
    </>
  );
}
