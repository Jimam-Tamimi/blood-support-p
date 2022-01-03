import React, { useEffect, useState } from 'react'
import LoginImg from '../../assets/img/login.svg'
import Switch from "react-switch";
import {
    FormWrap,
    FormPictureWrap,
    FromImg,
    FormHeading,
    Form,
    InputDiv,
    Input,
    Label,
    SubmitBtn,
    FormCont,
    NewLink,
    Text,
    TextBox,
} from './Account.styles'

import { useDispatch } from 'react-redux'; 
import { login } from '../../redux/auth/actions';


export default function Login() {
    const [formData, setformData] = useState({
        email: '',
        password: '', 
    })
    const [showSubmit, setShowSubmit] = useState(false)
    const { email, password } = formData
    const [checked, setChecked] = useState(true)
    const dispatch = useDispatch()

    const onSubmit = e => {
        e.preventDefault(); 
            dispatch(login(email, password)) 
    }

    const changeFormData = e => setformData({ ...formData, [e.target.name]: e.target.value })

    useEffect(() => {
        console.log(formData)
        if(password.length >= 4 && email.length >= 4 ) {
            setShowSubmit(true)
        } else {
            setShowSubmit(false)
        }
    }, [ formData])

    

    return (
        <>
            <FormCont>

                <FormPictureWrap>
                    <FromImg src={LoginImg} />
                </FormPictureWrap>
                <FormWrap>
                    <FormHeading>Please Enter Your Email And Password To Login</FormHeading>
                    <Form onSubmit={onSubmit}>
                        <InputDiv>
                            <Input required name="email" onChange={changeFormData} type="email" placeholder="Email" />
                        </InputDiv>
                        <InputDiv  style={{ flexDirection: 'column', alignItems: 'flex-start' }} >
                            <Input minLength={4} required name="password" onChange={changeFormData} type="password" placeholder="Password" />
                            {
                                password.length<4 && password !== '' ? <Text style={{ marginTop: '8px' }} error>Password must be at least 4 characters</Text> : null
                            }
                        </InputDiv>
  
                        <TextBox>
                            <Label>Keep Me Logged In</Label>
                            <Switch
                                onColor="#dc3545"
                                onHandleColor="#ffffff"
                                handleDiameter={25}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                height={25}
                                width={45}
                                checked={checked}
                                onChange={e => setChecked(!checked)}

                            />
                        </TextBox>
                        <TextBox>
                            <Text>Don't Have An Account? <NewLink to="/signup/">Create An Account</NewLink> </Text>
                        </TextBox>
                        <TextBox>
                            <Text>Forgot Password? <NewLink to="/reset-password/">Reset Password</NewLink> </Text>
                        </TextBox>
                        { showSubmit?
                        <SubmitBtn  type="submit">Login</SubmitBtn>
                        : 
                        <SubmitBtn disabled type="submit">Login</SubmitBtn>
                        }
                        

                    </Form>
                </FormWrap> 

            </FormCont>

        </>
    )
}
