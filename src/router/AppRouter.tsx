import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import MainLayout
    from "@/layouts/MainLayout";

import ProtectedRoute
    from "@/router/ProtectedRoute";

import HomePage
    from "@/pages/HomePage";

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

import DashboardPage
    from "@/pages/DashboardPage";

import {
    CompanyProvider
} from "@/context/CompanyContext";

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
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <HomePage />
                                </ProtectedRoute>
                            }
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

                    </Route>

                </Routes>

            </CompanyProvider>

        </BrowserRouter>
    );
}

export default AppRouter;