import styled from "styled-components";


export const Wrap = styled.div`
    transition: all ${({ timeout }) => `${timeout / 1000}s`} ease !important;
 
    ${({ show, fade, leftToRight, rightToLeft,  topToBottom, bottomToTop, scale, zoom }) => (
        show ? (
            `
                ${fade? `opacity: 1;` :""}
                ${leftToRight? `transform: translateX(0);` :""}
                ${rightToLeft? `transform: translateX(0);` :""}
                ${topToBottom? `transform: translateY(0);` :""}
                ${bottomToTop? `transform: translateY(0);` :""}
                ${scale? `transform: scale(1);` :""}
                ${zoom? `transform: scale(1);` :""}
            `    

        ) : (   
            `
                ${fade? `opacity: 0;` :""}
                ${leftToRight? `transform: translateX(-15px);` :""}
                ${rightToLeft? `transform: translateX(15px);` :""}
                ${topToBottom? `transform: translateY(-15px);` :""}
                ${bottomToTop? `transform: translateY(15px);` :""}
                ${scale? `transform: scale(.9);` :""}
                ${zoom? `transform: scale(0);` :""}
            `
        )
    )
    }

`



