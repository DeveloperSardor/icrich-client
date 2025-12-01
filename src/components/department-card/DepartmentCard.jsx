import React from 'react'
import './style.css'
import { useContext } from 'react'
import Context from '../../context/Context'

const DepartmentCard = ({data}) => {
  const contextDatas = useContext(Context);

  const currentLang = contextDatas.currentLang;
  return (
    <div className='department-card'>
      <img src={data?.img} alt='yunesko'/>
      <h3 className='title_'>{ currentLang == 'uz' ? data.title_uz : currentLang == 'ru' ? data.title_ru : data.title_en}</h3>
      {/* <p>{data.role.name_en}</p> */}
    </div>
  )
}

export default DepartmentCard
