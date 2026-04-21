import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import MentorProfilePage from "@/pages/MentorProfilePage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import PaymentPage from "@/pages/PaymentPage";
import AboutPage from "@/pages/AboutPage";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

import UserSyncTrigger from "@/components/UserSyncTrigger";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import MentorManagement from "@/pages/admin/MentorManagement";
import SubjectManagement from "@/pages/admin/SubjectManagement";
import SessionManagement from "@/pages/admin/SessionManagement";
import StudentManagement from "@/pages/admin/StudentManagement";

function App() {
  return (
    <BrowserRouter>
      <SignedIn>
        <UserSyncTrigger />
      </SignedIn>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/mentor/:id" element={<MentorProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <DashboardPage />
                </SignedIn>
                <SignedOut>
                  <LoginPage />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/payment/:sessionId"
            element={
              <>
                <SignedIn>
                  <PaymentPage />
                </SignedIn>
                <SignedOut>
                  <LoginPage />
                </SignedOut>
              </>
            }
          />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="mentors" element={<MentorManagement />} />
            <Route path="subjects" element={<SubjectManagement />} />
            <Route path="sessions" element={<SessionManagement />} />
            <Route path="students" element={<StudentManagement />} />
          </Route>

          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
