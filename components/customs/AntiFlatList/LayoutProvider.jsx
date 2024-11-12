import {GridLayoutProvider} from "recyclerlistview";

const MAX_SPAN = 4;
const ViewTypes = {
    FULL: 0
};
export default class LayoutProviderCustom extends GridLayoutProvider{
    constructor(colSpan) {
        super(MAX_SPAN,
            (index) => {
                return ViewTypes.FULL;
            },
            (index) => {
                return colSpan;
            },
            (index) => {
                return 200;
            },
        );
    }
}