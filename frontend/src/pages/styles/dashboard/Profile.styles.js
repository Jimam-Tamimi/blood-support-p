import { Link } from "react-router-dom";
import styled from "styled-components";
import { Flex } from "../../../globalStyles";


export const ProfileImgDiv = styled.div`
    width: 100%;
    position: relative;
    ${Flex}
`

export const ReviewWrap = styled.div`
    ${Flex}
    flex-direction: column;
`

export const ReviewDiv = styled(Link)`
    width: 100%;
    height: 120px;
    padding: 0px 5%;
    ${Flex}
    justify-content: flex-start;
    position: relative;
    background: var(--secendory-color);
    &:hover {
        background: var(--secendory-hover-color);
    }
    margin: 10px 0px;
    border-radius: 10px;
`

export const ReviewContent = styled.div`
    margin-left: 20px;
    ${Flex}
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    height: 55% ;
`