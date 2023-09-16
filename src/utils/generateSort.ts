import { CrudSorting } from "@refinedev/core";

export const generateSort = (sorters?: CrudSorting) => {
    if (sorters && sorters.length > 0) {
        const _sort: string[] = [];
        const _order: string[] = [];
        let _sortString = "";

        sorters.map((item) => {
            _sort.push(item.field);
            _order.push(item.order);
        });

        _sort.forEach((item, index) => {
            _sortString += `${item} ${_order[index]}, `
            if (index === _sort.length - 1) {
                _sortString = _sortString.slice(0, -2);
            }
        })

        return _sortString;
    }
    //     const _sort: string[] = [];
    //     const _order: string[] = [];
    //
    //     sorters.map((item) => {
    //         _sort.push(item.field);
    //         _order.push(item.order);
    //     });
    //
    //     return {
    //         _sort,
    //         _order,
    //     };
    // }

    return;
};