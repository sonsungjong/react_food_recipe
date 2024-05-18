import { useParams } from 'react-router-dom';
import './details.css';
import { useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/context';

export default function Details()
{
  // 아이디를 통해서 들어왔으니까 해당 아이디에 대한 데이터를 가져온다
  const {id} = useParams();
  // Context에서 사용할 state들을 받아온다
  // 상세보기에서 foodDetailData에 데이터를 받아오고,
  // 상세보기에서 즐겨찾기에 추가하게 한다
  const {foodDetailData, setFoodDetailData, favoritesList, hAddToFavorite} = useContext(GlobalContext);

  // 오래걸리는 작업은 useEffect로 별도처리
  useEffect(()=>{
    // 상세보기 화면에 들어오면 id를 기준으로 데이터를 요청한다
    async function getFoodDetail()
    {
      // 음식 레시피상세정보 받아오기
      // async 비동기를 썻으니까 await으로 완료될때까지 대기시키기가 가능
      const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);    // get요청으로 데이터를 서버에서 받아오자
      const data = await res.json();      // json문자열로 줄테니까 자바스크립트에 맞게 변환하자

      console.log(data);      // 변환 잘 됬는지 확인
      // 잘 들어왔으면 foodDetailData에 담자 (setFoodDetailData를 통해)
      if(data?.data)      // 잘 들어왔니?
      {
        setFoodDetailData(data?.data);      // 그럼 담자
      }
    }

    getFoodDetail();      // 만든 함수 사용

  }, [])      // useEffect가 처음 켜졌을때만 동작하게끔 [] 를 넣어준다 ([]안넣으면 바뀔때마다 update발동)
  // useEffect : mount, update, unmount ==> update에 대해서 동작을 안하게 하고 싶다하면 ,[]

  return(
    <div className='details-container'>
      {/* 이미지 */}
      <div className='img-container'>
        <div className='img-wrapper'>
          <img src={foodDetailData?.recipe?.image_url} className='img-style' alt='사진'/>
        </div>
      </div>
      {/* 글 */}
      <div className='content-container'>
        <span className='text-publisher'>{foodDetailData?.recipe?.publisher}</span>
        <h3 className='text-title'>{foodDetailData?.recipe?.title}</h3>
        {/* 즐겨찾기 추가 버튼 */}
        <div>
          <button onClick={()=>{hAddToFavorite(foodDetailData?.recipe)}} className='favorites-btn'>
            {
              /* 해당 아이디가 favoritesList에 없으면 '즐겨찾기에 추가', 있으면 '즐겨찾기에서 제거' */
              favoritesList && favoritesList.length > 0 && favoritesList.findIndedx(item=>item.id === foodDetailData.recipe?.id) !== -1 ? '즐겨찾기에서 제거' : '즐겨찾기에 추가'
            }
          </button>
        </div>
        {/* 레시피 내용 */}
        <div>
          <span className='recipe-title'>레시피:</span>
          <ul className='recipe-content'>
            {
              // map을 통해서 들어있는 만큼만 반복하며 li태그 생성
              foodDetailData?.recipe?.ingredients.map((ingredient, idx)=>{
                return(
                  // jsx
                  <li key={idx}>
                    <span>{ingredient.quantity} {ingredient.unit}</span>
                    <span>{ingredient.description}</span>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    </div>
  )
}