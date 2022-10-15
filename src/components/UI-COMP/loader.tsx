import React from 'react'
import Modal from './modal';


interface LoaderProps{
    size?: number | string;
    color?: string;
    text?: string;
}

export function LoaderScreen({size, color, text}: LoaderProps){

    const Size = typeof size === "undefined" ? " w-[30px] h-[30px] " : ` w[${size}px] h-[${size}px] `

    const Color = typeof color === "undefined" ? "border-t-blue-200 border-r-transparent border-l-blue-200 border-b-transparent" : `border-[${color}] border-r-transparent border-b-transparent`

    return (
        <Modal isActive={true}>
            <span id="payrill-spinner" className={` rounded-[50%] ${Size} border-[3px] ${Color}  `}></span>
            <p className="text-white-300 mt-3">{text}</p>
        </Modal>
    )
}

export function Spinner({size, color}: LoaderProps){

    const Size = typeof size === "undefined" ? " w-[30px] h-[30px] " : ` w[${size}px] h-[${size}px] `

    const Color = typeof color === "undefined" ? "border-t-blue-200 border-r-transparent border-l-blue-200 border-b-transparent" : `border-[${color}] border-r-transparent border-b-transparent`

    return (
        <span id="payrill-spinner" className={`rounded-[50%] ${Size} border-[3px] ${Color}  `}></span>
    )
}