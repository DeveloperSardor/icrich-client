import React from 'react'
import './style.css'
import DepartmentCard from '../../components/department-card/DepartmentCard'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useEffect } from 'react'

const Departments = () => {

  const [t, i18n] = useTranslation('global')
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [departments, setDepartments] = useState([])

  async function GetDepartments() {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/department`)
      setDepartments(data.data)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    GetDepartments();

  }, [])
  return (
    <div className='department-page'>
      <div className='container_'>
        <h2 className='title__'>{t('navbar.aboutUs.departments')}</h2>
        <div className='cards_wrp'>
          {departments?.map((el, idx) => (
            <DepartmentCard data={el} />
          ))}

        </div>
      </div>
    </div>
  )
}

export default Departments
