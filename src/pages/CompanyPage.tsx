import {
    Box,
    Button,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "react-router-dom";

import type {
    CompanyDto,
    CompanyMembershipDto,
    CompanyRoleDto,
} from "@/types/company";

import {
    getCompany,
    getCompanyMembers,
    getCompanyRoles,
} from "@/api/companyApi";

import CompanyHeader
    from "@/components/company/CompanyHeader";

import CompanyMembers
    from "@/components/company/CompanyMembers";

import InviteMemberDialog
    from "@/components/company/InviteMemberDialog";

function CompanyPage() {

    const { id } = useParams();

    const [company, setCompany] =
        useState<CompanyDto | null>(
            null
        );

    const [members, setMembers] =
        useState<
            CompanyMembershipDto[]
        >([]);

    const [roles, setRoles] =
        useState<
            CompanyRoleDto[]
        >([]);

    const [inviteOpen,
        setInviteOpen] =
        useState(false);

    useEffect(() => {

        let active = true;

        async function loadData() {

            if (!id) {
                return;
            }

            const companyId =
                Number(id);

            const [
                companyData,
                membersData,
                rolesData,
            ] = await Promise.all([
                getCompany(companyId),
                getCompanyMembers(
                    companyId
                ),
                getCompanyRoles(
                    companyId
                ),
            ]);

            if (!active) {
                return;
            }

            setCompany(companyData);

            setMembers(membersData);

            setRoles(rolesData);
        }

        void loadData();

        return () => {
            active = false;
        };

    }, [id]);

    if (!company) {
        return null;
    }

    return (
        <Box
            sx={{
                p: 5,
            }}
        >

            <CompanyHeader
                company={company}
            />

            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "flex-end",
                    mb: 3,
                }}
            >

                <Button
                    variant="contained"
                    onClick={() =>
                        setInviteOpen(true)
                    }
                >
                    Пригласить участника
                </Button>

            </Box>

            <CompanyMembers
                members={members}
            />

            <InviteMemberDialog
                open={inviteOpen}
                onClose={() =>
                    setInviteOpen(false)
                }
                companyId={company.id}
                roles={roles}
            />

        </Box>
    );
}

export default CompanyPage;