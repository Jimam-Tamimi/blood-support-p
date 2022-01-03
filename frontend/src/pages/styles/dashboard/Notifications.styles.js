import { Link } from "react-router-dom";
import styled from "styled-components";
import { Flex } from "../../../globalStyles";



export const NotificationsWrapper = styled.div`
    max-width: 60%;
    margin: auto;
    ${Flex}
    flex-direction: column;
    margin: 30px auto;
`;

export const Notification = styled(Link)`
    ${Flex} 
    width: 100%;
    height: 100px;
    background-color: var(--secendory-color);
    &:hover {
        background-color: var(--secendory-hover-color);
    }
    justify-content: flex-start;
    padding: 0px 10%;
    border-radius: 6px;
    margin: 10px 0px;
    position: relative;


` 
export const NotificationContent = styled.p`
    color: var(--secendory-text-color);
    margin-left: 20px;
`
 