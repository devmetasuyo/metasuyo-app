import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} {...props}>
    <path fill="#9fa8da" d="M11 24 25 2l14 22-14 8z" />
    <path fill="#7986cb" d="m25 2 14 22-14 8z" />
    <path fill="#9fa8da" d="m11 27 14 8 14-8-14 19z" />
    <path fill="#7986cb" d="m25 35 14-8-14 19zM11 24l14-6 14 6-14 8z" />
    <path fill="#5c6bc0" d="m25 18 14 6-14 8z" />
  </svg>
);
export { SvgComponent as EthereumIcon };
