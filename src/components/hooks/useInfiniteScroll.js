// hooks/useInfiniteScroll.ts
import { useEffect, useState, useCallback } from "react";



export function useInfiniteScroll({ fetchFunction, size = 10, dependencies = [], }) {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const newData = await fetchFunction({ page, size });

            if (newData.length < size) setHasMore(false); // no more data
            setData((prev) => [...prev, ...newData]);
        } catch (err) {
            // console.error("Pagination fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [page, size, hasMore, loading, fetchFunction]);

    useEffect(() => {
        setPage(1);
        setData([]);
        setHasMore(true);
    }, dependencies);

    useEffect(() => {
        loadData();
    }, [page, loadData]);

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
            !loading &&
            hasMore
        ) {
            setPage((prev) => prev + 1);
        }
    }, [loading, hasMore]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return { data, loading, hasMore };
}
