import { AnchorHTMLAttributes } from "react";


export default function PencilIcon(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
    return <a className="icon" {...props}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512">
            <g>
                <path d="M358.752,51.159L70.113,339.798l102.063,102.064L455.088,158.95L512,0.282L358.752,51.159z M172.176,419.287
                    l-79.488-79.489L349.536,82.949l0.069,11.622l22.52-0.089l0.089,22.667l22.625,0.048l-0.048,22.691l22.467-0.271l0.27,22.847
                    l11.538-0.068L172.176,419.287z M442.648,146.351l-9.345,0.055l-0.27-22.946l-22.244,0.269l0.048-22.464l-22.721-0.048
                    l-0.091-22.764l-22.551,0.089l-0.068-11.463l1.963-1.963l75.812-25.169l4.761,23.811l22.704,4.541L442.648,146.351z
                        M461.506,50.195l-3.062-15.313l27.457-9.116l-9.808,27.346L461.506,50.195z"/>
                
                    <rect x="37.686" y="394.032" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 -97.0284 763.8365)" width="143.992" height="15.962"/>
                <path d="M10.388,399.522c-13.851,13.852-13.851,36.391,0,50.244l51.546,51.545c6.711,6.711,15.632,10.406,25.122,10.406
                    s18.412-3.696,25.122-10.406l37.073-37.073L47.462,362.45L10.388,399.522z M100.891,490.025
                    c-3.695,3.696-8.608,5.731-13.834,5.731s-10.139-2.036-13.834-5.731L21.676,438.48c-7.629-7.628-7.629-20.042,0-27.67
                    l25.785-25.785l79.215,79.216L100.891,490.025z"/>
            </g>
        </svg>
    </a>
}