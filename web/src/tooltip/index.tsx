import { TooltipState } from "./context";

export default function Tooltip({
    domrect, 
    searchOptions,
    searchResults=[], 
    onSelected=()=>{},
    updateState,
}: TooltipState) {

    // state alias
    const rootClassName = !!domrect && !!searchOptions ? "tooltip show" : "tooltip hide";
    let tooltipStyle = {};
    if (domrect) {
        const {left=0, top=0, height=0, width=0} = domrect;
        tooltipStyle = {
            top: `${top + height}px`,
            left: `${left}px`,
            width: `${width}px`,
        }
    }
    const unFocus = () => updateState({
        updateState, 
        onSelected,
        searchResults: [],
    });

    return <div className={rootClassName}>
        <div className="tooltip-bg" onClick={() => unFocus()}></div>
        <ul style={tooltipStyle}>
            {searchResults.map((r, i) => <li key={i} onClick={() => {
                onSelected(r);
                unFocus();
            }}>
                {r}
            </li>)}
            {searchResults.length === 0 ? <li onClick={() => unFocus()}>No Options...</li> : ""}
        </ul>
    </div>
}