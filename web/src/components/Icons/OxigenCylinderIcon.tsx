import * as React from "react";
import { IconProps } from "./IconProps";

interface OxigenCylindernProps extends IconProps {
  isActive?: boolean;
}

export function OxigenCylinderIcon(props: OxigenCylindernProps) {
  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 45 45"
      className={props.className}
    >
      <g transform="translate(13.125 0)">
      <g  transform="translate(0 5.259)">
        <path
          d="M1854.6,347.92a1.391,1.391,0,0,1-.894-1.295v-1.9a1.822,1.822,0,0,0-1.82-1.824h-3.751a1.822,1.822,0,0,0-1.82,1.824v1.9a1.391,1.391,0,0,1-.894,1.295,9.065,9.065,0,0,0-5.773,8.449V376.68a5.951,5.951,0,0,0,5.944,5.958h8.837a5.951,5.951,0,0,0,5.944-5.958V356.369A9.064,9.064,0,0,0,1854.6,347.92Zm-3.743,18.744a4.672,4.672,0,0,1-6.3,0,6.4,6.4,0,0,1-.914-3.82,6.608,6.608,0,0,1,.914-3.863,4.554,4.554,0,0,1,6.3,0,6.61,6.61,0,0,1,.915,3.863A6.4,6.4,0,0,1,1850.86,366.664Zm5.518,3.367h-3.792v-1.039l1.249-1.27a10.336,10.336,0,0,0,.926-1.048,1.311,1.311,0,0,0,.26-.777.7.7,0,0,0-.216-.581.983.983,0,0,0-.616-.169,8.7,8.7,0,0,0-1.293.107l-.213.027-.062-.95a6.093,6.093,0,0,1,1.8-.266q1.861,0,1.861,1.678a2.191,2.191,0,0,1-.284,1.137,5.611,5.611,0,0,1-1.028,1.163l-1.019.923h2.428Z"
          transform="translate(-1839.651 -342.897)"
          fill={props.isActive ? "#3e404d" : "#e7e7ea"}
        />
        <path
          d="M1851.116,368.713a1.633,1.633,0,0,0-1.585.809,5.786,5.786,0,0,0-.433,2.592,5.522,5.522,0,0,0,.426,2.542,2.049,2.049,0,0,0,3.182,0,5.524,5.524,0,0,0,.426-2.542,5.794,5.794,0,0,0-.433-2.592A1.635,1.635,0,0,0,1851.116,368.713Z"
          transform="translate(-1843.055 -352.159)"
          fill={props.isActive ? "#3e404d" : "#e7e7ea"}
        />
      </g>
      <rect width="4.912" height="2.897" rx="1.449" transform="translate(5.447 2.108) rotate(90)"   fill={props.isActive ? "#3e404d" : "#e7e7ea"}/>
      <rect width="4.198" height="7.391" rx="2.099" transform="translate(14.058 0) rotate(90)"   fill={props.isActive ? "#3e404d" : "#e7e7ea"}/>
      </g>
    </svg>
  );
}
