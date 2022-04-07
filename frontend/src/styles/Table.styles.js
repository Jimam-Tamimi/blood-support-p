import styled from "styled-components";
import { Flex } from "../globalStyles";

// table
export const HtmlTable = styled.table`
  width: 100%;
  border-collapse: collapse;

`;

export const Th = styled.th`
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: var(--primary-color);
  color: white;
  padding-left: 15px;
  @media only screen and (max-width: 960px) {
    font-size: 12px;
  }
`;

export const Tr = styled.tr`
height: 65px;
box-shadow: 0px 0px 3px 0px #00000061;
  background-color: var(--secendory-color);
  &:hover {
    background-color: var(--secendory-hover-color);
  }
  cursor: pointer;
  @media only screen and (max-width: 960px) {
    font-size: 12px;
  }
  position: relative;
  & div.table-row-badge {
    position: relative;

    position: absolute;
    width: max-content;
    right: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-around;

    align-items: flex-end;

    span {
      /* margin-bottom: 7px; */
      margin-right: 7px;
    }
  }
`;

export const Td = styled.td`
  text-align: left;
  color: var(--secendory-text-color);
  padding: 9px 0px;
  padding-left: 15px;
  a {
    width: fit-content;

  }
`;

// struct of table

export const TopSection = styled.div`
  ${Flex}
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;

`;

export const SearchForm = styled.form`
  /* margin-right: auto; */
`;

export const SearchInp = styled.input`
  padding: 10px 10px;
  border-radius: 4px;
  background: var(--secendory-color);
  border: none;
  outline: none;
  color: var(--secendory-text-color);
  width: 215px;

`;

export const OrderedBySection = styled.div`
  .filter-div{
    width: 200px;

  }
`;

export const Select = styled.select``;

export const Option = styled.option``;

export const BottomSection = styled.div`
  ${Flex}
  width: 100%;
  margin-top: 20px;
`;
