import React from "react";

import DetailedItems from "@/components/detailed-item/detailed-item.component";


const ItemPage:React.FC<{params:{itemsID:string}}> = ({ params }) => {

    return (
        <DetailedItems params={params} />
    )
}

export default ItemPage;