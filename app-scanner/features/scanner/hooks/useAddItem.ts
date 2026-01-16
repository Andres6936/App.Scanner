import { useQueryClient } from "@tanstack/react-query";

// Actions
import { ShowModalAddItem } from "@/features/scanner/actions/ShowModalAddItem.Action";

const useAddItem = () => {
    const queryClient = useQueryClient();

    const show = async () => {
        await ShowModalAddItem();
        queryClient.invalidateQueries({
            queryKey: ['/products']
        })
    }

    return {
        show
    }
};

export { useAddItem }