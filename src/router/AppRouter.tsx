import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import MainLayout
    from "@/layouts/MainLayout";

import ProtectedRoute
    from "@/router/ProtectedRoute";

import LoginPage
    from "@/pages/LoginPage";

import RegisterPage
    from "@/pages/RegisterPage";

import ProfilePage
    from "@/pages/ProfilePage";

import CompaniesPage
    from "@/pages/CompaniesPage";

import CreateCompanyPage
    from "@/pages/CreateCompanyPage";

import CompanyPage
    from "@/pages/CompanyPage";

import BoardsPage
    from "@/pages/BoardsPage";

import BoardPage
    from "@/pages/BoardPage";

import CompanyProvider from "@/context/CompanyContext"
import CompanyMembersPage from "@/pages/CompanyMembersPage.tsx";
import CompanyRolesPage from "@/pages/CompanyRolesPage.tsx";
import CompanyProfilePage from "@/pages/CompanyProfilePage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import PasswordResetPage from "@/pages/PasswordResetPage.tsx";
import PasswordResetConfirmPage from "@/pages/PasswordResetConfirmPage.tsx";
import EditCompanyPage from "@/pages/EditCompanyPage.tsx";
import DeleteCompanyPage from "@/pages/DeleteCompanyPage.tsx";

function AppRouter() {

    return (
        <BrowserRouter>
            <CompanyProvider>
                <Routes>

                    <Route
                        element={<MainLayout />}
                    >
                        <Route
                            path="/"
                            element={<HomePage />}
                        />


                        <Route
                            path="/login"
                            element={<LoginPage />}
                        />

                        <Route
                            path="/register"
                            element={<RegisterPage />}
                        />

                        <Route
                            path="/password-reset"
                            element={
                                <PasswordResetPage />
                            }
                        />

                        <Route
                            path="/password-reset/confirm"
                            element={
                                <PasswordResetConfirmPage />
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/companies"
                            element={
                                <ProtectedRoute>
                                    <CompaniesPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/companies/create"
                            element={
                                <ProtectedRoute>
                                    <CreateCompanyPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/companies/:id"
                            element={
                                <ProtectedRoute>
                                    <CompanyPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/companies/:id/boards"
                            element={
                                <ProtectedRoute>
                                    <BoardsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/companies/:id/boards/:boardId"
                            element={
                                <ProtectedRoute>
                                    <BoardPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/companies/:id/members"
                            element={
                                <ProtectedRoute>
                                    <CompanyMembersPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/companies/:id/roles"
                            element={
                                <ProtectedRoute>
                                    <CompanyRolesPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/companies/:id/profile"
                            element={
                                <ProtectedRoute>
                                    <CompanyProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/companies/:id" element={<CompanyPage />} />
                        <Route path="/companies/:id/profile" element={<CompanyProfilePage />} />
                        <Route path="/companies/:id/edit" element={<EditCompanyPage />} />
                        <Route path="/companies/:id/delete" element={<DeleteCompanyPage />} />

                    </Route>
                </Routes>
            </CompanyProvider>
        </BrowserRouter>
    );
}

export default AppRouter;