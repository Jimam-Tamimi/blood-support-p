import React, {useEffect, useState} from 'react'
import styled, {keyframes} from 'styled-components'
import {Flex} from '../../globalStyles'
import signupImg from '../../assets/img/signup.svg'
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
import { hideLoader, showLoader } from '../../redux/loader/actions'; 
import { useHistory, useLocation } from 'react-router-dom'
import { signup } from '../../redux/auth/actions';

export default function Signup() {
    const [formData, setformData] = useState({
        email: '',
        password: '',
        cpassword: '',
    })
    const [showSubmit, setShowSubmit] = useState(false)
    const { email, password, cpassword } = formData
    const [checked, setChecked] = useState(true)

    // hooks
    const dispatch = useDispatch()
    const location = useLocation()
    const history = useHistory()


    const onSubmit = e => {
        e.preventDefault();
        if(password === cpassword) {
            dispatch(signup(email, password, cpassword, () => {
                const queryString = location.search;
                const urlParams = new URLSearchParams(queryString);
                const redirect_url = urlParams.get('redirect_url')
                history.push(redirect_url.replaceAll('[1234]', '/'))
            }))
        }
    }

    const changeFormData = e => setformData({ ...formData, [e.target.name]: e.target.value })

    useEffect(() => {
        console.log(formData)
        if(cpassword===password && password.length >= 4 && email.length >= 4 ) {
            setShowSubmit(true)
        } else {
            setShowSubmit(false)
        }
    }, [ formData])

    
    return (
        <>
           <FormCont>
                <FormPictureWrap>
                    <FromImg src={signupImg}/>
                </FormPictureWrap>
                <FormWrap>
                    <FormHeading>Please Enter Your Email And Password To Create An Account</FormHeading>
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
                        <InputDiv style={{ flexDirection: 'column', alignItems: 'flex-start' }} >
                            <Input minLength={4} required name="cpassword" onChange={changeFormData} type="password" placeholder="Confirm Password" />
                            {
                                password !== cpassword && cpassword !== '' && password !== '' ? <Text style={{ marginTop: '8px' }} error>Password and Confirm Password do not match</Text> : null

                                
                            }

                            
                        </InputDiv>
                         
                        <TextBox>
                            <Text>Don't Have An Account? <NewLink to="/signup/">Create An Account</NewLink> </Text>
                        </TextBox>
                        <TextBox>
                            <Text>Forgot Password? <NewLink to="/reset-password/">Reset Password</NewLink> </Text>
                        </TextBox>
                        { showSubmit?
                        <SubmitBtn  type="submit">Signup</SubmitBtn>
                        : 
                        <SubmitBtn disabled type="submit">Signup</SubmitBtn>
                        }
                        

                    </Form>
                </FormWrap>    
            </FormCont>


        </>
    )
}


