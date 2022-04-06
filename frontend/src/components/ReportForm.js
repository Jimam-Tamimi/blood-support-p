import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { report } from '../apiCalls'
import useModal from '../hooks/useModal'
import alert from '../redux/alert/actions'
import { hideModalAction } from '../redux/modal/actions'
import { Form, FormWrap, InputDiv, Label, TextArea } from '../styles/Form.styles'

export default function ReportForm({formId, data={}, onSuccess=() => ''} ) {
    const [formData, setFormData] = useState({
        description: '',
    })
    const { description } = formData
    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log('submit')
      try{
        const res = await report(formData, formId, data)
        console.log({res})
        if(res.status === 200){
          dispatch(alert(res?.data?.message, 'success'))
          dispatch(hideModalAction())
          onSuccess()
        } 
      } catch (error) { 
      }
    }

    const dispatch = useDispatch()
  return (
    <FormWrap>
    <Form onSubmit={onSubmit} id={formId}>
    <InputDiv>
      <Label htmlFor="desc">
        Why you are reporting this
      </Label>
      <TextArea
      id={'desc'}
        required
        name="description"
        value={description}
        onChange={onChange}
        placeholder="Short Description"></TextArea>
    </InputDiv>

  </Form>
  </FormWrap>
  )
}
