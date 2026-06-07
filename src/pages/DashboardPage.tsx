import {
    Box,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

import DashboardHeader
    from "@/components/dashboard/DashboardHeader";

import StatCard
    from "@/components/dashboard/StatCard";

import QuickActions
    from "@/components/dashboard/QuickActions";

import RecentBoards
    from "@/components/dashboard/RecentBoards";

import {useCompany} from "@/hooks/useCompany";

import {
    getBoards
} from "@/api/boardApi";

import type {
    BoardDto
} from "@/types/board";

import {
    getCompanyMembers
} from "@/api/companyApi";

function DashboardPage() {

    const {
        selectedCompany
    } = useCompany();

    const [boards,
        setBoards] =
        useState<BoardDto[]>([]);

    const [membersCount,
        setMembersCount] =
        useState(0);

    useEffect(() => {

        if (!selectedCompany) {
            return;
        }

        async function loadData() {

            try {

                const [
                    boardsData,
                    membersData,
                ] = await Promise.all([
                    getBoards(
                        selectedCompany.id
                    ),
                    getCompanyMembers(
                        selectedCompany.id
                    ),
                ]);

                setBoards(boardsData);

                setMembersCount(
                    membersData.length
                );

            } catch (error) {

                console.error(error);
            }
        }

        void loadData();

    }, [selectedCompany]);

    return (
        <Box
            sx={{
                p: 5,
            }}
        >

            <DashboardHeader />

            <Box
                sx={{
                    display: "flex",
                    gap: 3,
                    flexWrap: "wrap",
                    mb: 5,
                }}
            >

                <StatCard
                    title="Участники"
                    value={membersCount}
                />

                <StatCard
                    title="Доски"
                    value={boards.length}
                />

            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns:
                        "1fr 1fr",
                    gap: 4,
                }}
            >

                <RecentBoards
                    boards={boards}
                />

                <QuickActions />

            </Box>

        </Box>
    );
}

export default DashboardPage;