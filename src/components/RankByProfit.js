import axios from "@/libs/axios";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);
const useGetProfit = () => {
    const {
        data: profit,
        error,
        isValidating,
    } = useSWR(`/api/get-rank-by-profit`, fetcher, {
        revalidateOnFocus: true, // Refetch data when the window is focused
        dedupingInterval: 60000, // Avoid duplicate requests for the same data within 1 minute
        fallbackData: [], // Optional: you can specify default data here while it's loading
    });

    if (error) return { error: error.response?.data?.errors || ["Something went wrong."] };
    if (!profit && !isValidating) return { loading: true };

    return { profit, loading: isValidating, error: error?.response?.data?.errors };
};

export default useGetProfit;
