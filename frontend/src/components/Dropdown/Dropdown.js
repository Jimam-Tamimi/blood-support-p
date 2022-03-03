import React, { useRef, useEffect, useState } from "react";
import {
  Wrap,
  DropdownMenu,
  DropdownLink,
  LinkIcon,
  LinkText,
} from "./Dropdown.styles";
import { Button, Badge, IconDiv } from "../../styles/Essentials.styles";
import { BsThreeDotsVertical } from "react-icons/bs";
import { VscSaveAll } from "react-icons/vsc";
import { IoMdOpen } from "react-icons/io";
import { FaRegCopy } from "react-icons/fa";
import { FaBan } from "react-icons/fa";
import Transition from "../Transition/Transition";

export default function Dropdown({ absolute, options, style }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <Wrap style={style}>
        <IconDiv
          onClick={(e) => setShowDropdown(!showDropdown)}
          style={{
            margin: "unset",
          }}
          scaleOnHover
          width="30px"
          fontSize="20px"
          height="30px"
        > 
          <BsThreeDotsVertical />
        </IconDiv>
        <Transition timeout={200} show={showDropdown} fade rightToLeft>
          <DropdownMenu
            onClick={(e) => (showDropdown ? setShowDropdown(false) : "")}
          >
            {options?.map((option, i ) => (
              <DropdownLink key={i} onClick={option.onClick}>
                <LinkIcon>
                  <FaBan />
                </LinkIcon>
                <LinkText>{option.name}</LinkText>
              </DropdownLink>
            ))}
          </DropdownMenu>
        </Transition>
      </Wrap>
    </>
  );
}
