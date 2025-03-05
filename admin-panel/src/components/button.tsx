import React, {ReactNode} from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant:"Primary"| "Secondary";
    children?: ReactNode,
}

function Button({variant,children, className,...props}:Props) {
        const variant_style=variant==='Primary'?"text-white  bg-blue-500 border-blue-500 hover:bg-blue-600":'text-blue-500 bg-white border-blue-500 hover:bg-gray-100'
    return (
        <button className={`border-[1px] font-bold   duration-100 cursor-pointer ${variant_style} ${className}`} {...props} style={{paddingLeft:7,paddingRight:7, margin:3,borderRadius:5}}>
            {
                children
            }
        </button>
    );
}

export default Button;