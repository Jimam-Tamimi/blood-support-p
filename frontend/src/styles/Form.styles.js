import styled from "styled-components";
import { Flex } from "../globalStyles";




export const FormWrap = styled.div`
width: 100%;
`;

export const Form = styled.form`
${Flex}
justify-content: space-between;
flex-wrap: wrap;
`;

export const InputDiv = styled.div`
width: ${({ size = 12 }) => `calc(${(100 / 12) * size}% - 10px)`};
margin-bottom: 20px;
@media only screen and (max-width: 748px) {
  & {
    width: 100%;
  }
}
${({ left }) => (left ? `margin-left: auto;` : "")}
${({ height }) => (height ? `height: ${height};` : "")}

${({ flex }) => (flex ? `${Flex}` : "")}
`;

export const Input = styled.input`
padding: 10px 15px;
border-radius: 4px;
font-size: 17px;
background: var(--input-bg-color);
border: none;
outline: none;
width: 100%;
height: 100%;
color: var(--secendory-text-color);
height: 48px;
margin: 10px 0px;

${({disabled}) => disabled && `opacity: .5; cursor: not-allowed;`}

`;

export const TextArea = styled.textarea`
padding: 10px 15px;
border-radius: 4px;
font-size: 17px;
background: var(--input-bg-color);
border: none;
outline: none;
min-width: 100%;
max-width: 100%;
min-height: 100px;
color: var(--secendory-text-color);
height: 48px;
margin: 10px 0px;
`;

export const Label = styled.label`
font-size: 18px;
border: none;
color: var(--secendory-text-color);
font-weight: 600;
text-transform: capitalize;
&::after {
  ${({showAlert}) => showAlert && `
  
  content: "This field is requires *" ;
  font-size: 14px;
    font-weight: 800;
    display: inline;
    margin-left: 7px;
    color: var(--primary-color);

  `}

}

`;





// custom styling for React Select Component
export const customStyles = {
 
    control: (provided) => ({
      ...provided,
      height: "48px",
      margin: "10px 0px",
      background: "var(--secendory-color)",
      border: "none",
      position: "relative",
    }),
    container: () => ({
      width: "100%",
      height: "100%",
      position: "relative",
    }),
    menu: (provided) => {
      console.log(provided);
      return {
        ...provided,
      };
    },
    singleValue: (provided, state) => ({
      ...provided,
      color: "var(--secendory-text-color)",
      transition: "var(--main-transition)",
    }),
    option: (provided, state) => ({
      ...provided,
      background: !state.isSelected
        ? "var(--secendory-hover-color)"
        : "var(--primary-color)",
      transition: "var(--main-transition)",
    }),
  };
  