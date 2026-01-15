import NiceModal from "@ebay/nice-modal-react";

import { TypeCurrency } from "@/constants/Types";
import { db } from "@/services/sqlite/createClient";
import { ProductsTable } from "@/services/sqlite/schema";
import ModalAddItem, { Props as ModalAddItemProps } from "@/modals/ModalAddItem";

const ShowModalAddItem = async () => {
    try {
        await NiceModal.show(ModalAddItem, {
            defaultValues: {
                SKU: "",
                TypeBarCode: "",
            },
            onConfirm: async ({values}) => {
                await db.insert(ProductsTable).values({
                    SKU: values.SKU,
                    TypeBarCode: values.TypeBarCode,
                    Name: values.Name,
                    Amount: values.Amount,
                    Value: values.Value,
                    Currency: TypeCurrency.COP,
                })
            },
        } satisfies ModalAddItemProps)
    } catch (e) {
        // Ignored
    }
}

export { ShowModalAddItem }