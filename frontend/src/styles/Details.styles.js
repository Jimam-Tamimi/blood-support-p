import styled from "styled-components"
import {Flex} from "../globalStyles"

export const AllDetails = styled.div`
    padding: 35px 50px; 
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 95%;
    margin: auto;
    @media only screen and (max-width: 800px){
        &{
            padding: 10px; 
        }
    }



`



export const DetailsDiv = styled.div`
${Flex}
flex-direction: column;
justify-content: space-between;
align-items: flex-start; 


`
export const DetailHeader = styled.h4`
font-size: 21px;
margin: 10px 0px;
color: var(--secendory-text-color);

text-decoration: underline;
`


export const Detail = styled.div`
${Flex}
justify-content: space-between;
margin: 5px 0px;
margin-left: 10px; 
`

export const DetailField = styled.p`
margin-right: 8px;
color: var(--secendory-text-color);


`

export const DetailFieldValue = styled.p`
font-weight: 600;
color: var(--secendory-text-color);
`


        

export const DetailsMap = styled.div`
    width: 100%;
    
`


export const ActionDiv = styled.div`
    
`

export const Action = styled.div`
    position: relative;
    margin: 10px 0px;
`
  

