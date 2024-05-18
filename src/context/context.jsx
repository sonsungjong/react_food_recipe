import { createContext, useState } from "react";

export const GlobalContext = createContext(null);     // useContext로 가져다 쓸 수 있음
console.log('context render');

// 리덕스 대신에 전역적으로 사용할 state (index.js에서 App 컴포넌트를 감싸줘야함 (리덕스와 유사) )
export default function GlobalState({children})
{
  // 검색값 state
  let [searchParam, setSearchParam] = useState("");
  // 음식리스트 state
  let [foodList, setFoodList] = useState([]);
  // 음식 상세데이터 state
  let [foodDetailData, setFoodDetailData] = useState(null);
  // 즐겨찾기 등록 리스트 state
  let [favoritesList, setFavoritesList] = useState([]);

  // 제공할 함수
  // 검색을 하면 검색명으로 get요청
  async function hSubmit(event) {
    event.preventDefault();     // 부모까지 이벤트가 버블링 되는 것을 막는다(전달되는것 막음)
    try     // 실패할수도 있는 함수는 try{} catch(e){} 로 감싸준다
    {
      const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParam}`);     // get요청 (REST API의 GET요청)
      const information = await res.json();      // REST API는 JSON문자열로 전달하니깐 사용할 수 있는 자료형으로 변경

      console.log(information);
      if(information?.data.recipes){
        setFoodList(information?.data.recipes);
        setSearchParam('');
      }
    }catch(e){
      console.log(e);
    }
  }

  // favoritesList 즐겨찾기 등록 리스트 state의 배열을 수정(추가/삭제)
  // state의 배열은 직접 수정X ==> ...으로 분리하고 []로 감싸서 카피본으로 수정 [...]
  // 변수를 안쓰고 useState를 사용하는 이유가 데이터값이 바뀌면 화면도 같이 갱신해주려고
  function hAddToFavorite(getCurItem)
  {
    let copyFavoritesList = [...favoritesList];       // 배열 통째로 분해했다가 다시 배열로 만들어서 대입
    //let copyFavoritesList = favoritesList;          // 주소값(공간의 위치)만 들어감...

    // 동일한 ID가 있는지 검사 (getCurItem의 ID와 favoritesList의 ID들을 비교)
    const index = copyFavoritesList.findIndex(e=>e.id === getCurItem.id);     // 하나씩 비교해서 못찾으면 -1, 찾으면 해당 위치 return

    if(index === -1)
    {
      copyFavoritesList.push(getCurItem);       // 즐겨찾기 리스트에 없으면 추가
    }
    else{
      copyFavoritesList.splice(index);        // 즐겨찾기 리스트에 있었으면 제거
    }

    // 새로 만든 배열을 state에 엎어친다 (한개의 값만 수정하면 화면이 안바뀌니깐 배열째로 엎어침)
    setFavoritesList(copyFavoritesList);
  }

  return(
    <GlobalContext.Provider value={{searchParam, setSearchParam, hSubmit, foodList, setFoodList, foodDetailData, setFoodDetailData, favoritesList, hAddToFavorite}}>
      {children}
    </GlobalContext.Provider>
  )
}