import React, { useState } from 'react'
import { CgClose } from 'react-icons/cg';


interface ModalProps {
  children: React.ReactNode
  isActive?: boolean;
  clickHandler ?: ()=> void;
  colorType?: string;
}

function Modal({children, isActive, clickHandler, colorType}: ModalProps) {
  const COLOR = colorType === "tp" ?  "bg-dark-600" : colorType === "dark" ? `bg-[rgba(0,0,0,.9)]` : "bg-dark-600"

  return (
    
    <div data-name="modal-cont" className={`w-full ${isActive ? "h-screen" : "h-0"} overflow-hidden z-[100] ${COLOR} fixed top-0 left-0 flex flex-col items-center justify-center `}>
      {typeof clickHandler !== "undefined" && <button
        className="absolute scale-[.60] top-4 right-2 px-4 py-4 flex flex-row items-center justify-center rounded-[50%] bg-red-900 opacity-[.5] text-[15px] "
        onClick={clickHandler}
      >
        <CgClose className="text-[25px] text-red-200 " />
      </button>}

      {children}
    </div>
  )
}

export default Modal
