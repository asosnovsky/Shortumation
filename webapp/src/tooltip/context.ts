import { createContext, useContext } from "react"

export interface TooltipSearchOption {
    searchObject: string;
    searchText: string;
    filterObjects: Record<string, string>; 
}
export interface TooltipState {
    domrect?: DOMRect;
    searchOptions?: TooltipSearchOption;
    onSelected?: (s: string) => void;
    searchResults: string[]; 
    updateState: (s: TooltipState) => void;
}
export const TooltipContext = createContext<TooltipState>({
    updateState(s) {},
    searchResults: [],
})

export const useToolTip = () => {
    const state = useContext(TooltipContext);

    return {
        setFocus(
            domrect: DOMRect, 
            searchOptions: TooltipSearchOption, 
            onSelected: (s: string) => void
        ){
            state.updateState({
                ...state,
                domrect, searchOptions, onSelected
            })
        },
        setSearchResults(searchResults: string[]){
            state.updateState({
                ...state,
                searchResults
            })
        },
    }
};