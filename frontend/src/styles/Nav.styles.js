import styled from "styled-components";
import { Flex } from "../globalStyles";
import { NavLink } from "react-router-dom";

export const NavWrap = styled.div`
  ${Flex}
  justify-content: flex-start;
  margin-bottom: 15px;
  box-shadow: 0px 1px 3px 0px #83838314;
`;

export const NavTab = styled(NavLink)`
  padding: 10px 15px;
  color: var(--secendory-text-color);

  border: 1px solid transparent;
  border: 3px solid transparent;
  position: relative;

  &.active {
    border-bottom: 3px solid var(--primary-color);
  }

  &::after {
   ${({ count }) => (  count && `content: "${count}";`  )}
    background: var(--primary-color);
    color: var(--primary-text-color);
    position: absolute;
    top: -4px;
    right: -10px;
    border-radius: 100%;
    padding: 1px 7px;
    font-size: 13px;
    font-weight: 600;
  }

  ${({ info }) =>
    info
      ? `    
  `
      : ""}
  ${({ sm }) =>
    sm
      ? `
  `
      : ""}
`;
