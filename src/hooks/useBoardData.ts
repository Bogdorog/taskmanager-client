import { useQuery } from "@tanstack/react-query";
import { getBoard } from "@/api/boardApi";
import { getCompanyMembers } from "@/api/companyApi";

export function useBoardData(companyId: number, boardId: number) {
    return useQuery({
        queryKey: ["boardPage", companyId, boardId],
        queryFn: async () => {
            const [membersData, boardData] = await Promise.all([
                getCompanyMembers(companyId),
                getBoard(boardId)
            ]);
            return { companyUsers: membersData, board: boardData };
        },
        enabled: !isNaN(companyId) && !isNaN(boardId) && boardId > 0,
        staleTime: 30 * 1000, // 30 секунд
    });
}