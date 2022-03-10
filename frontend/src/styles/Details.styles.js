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

    div.action-badge {
        position: absolute;
    top: 20px;
    right: 0;
    ${Flex}
    flex-direction: column;
    justify-content: center;
    align-items: flex-end ;
    span {
        margin: 5px 0px;
    }

    }
`
  


export const NotAvailableWrap = styled.div`
    ${Flex}
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 180px);
    border: 1px dashed white;
    border-radius: 2px;
    * {
    text-align: center;

        font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    }
`



export const DetailsAlert = styled.div`
    width: 100%;
    height: 43px;
    background-color: ${({type}) => type === 'info'? 'rgb(195, 221, 253)' : type==='danger'? 'rgb(251, 213, 213)' : '#BCF0DA'};
    margin: 0 0 15px 0px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    p {
        /* color: ${({type}) => type==="info"? 'rgb(30, 66, 159)' : type==='danger'? 'rgb(155, 28, 28)' :  'black' }; */
        color:black ;
    margin: 0.5rem 0.7rem;
    font-size: .9rem;
    font-weight: 500;
        }
`