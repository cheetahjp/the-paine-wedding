"use client";

import AdminFrame from "@/components/admin/AdminFrame";
import AdminLoginCard from "@/components/admin/AdminLoginCard";
import ContentAdminPanel from "@/components/admin/ContentAdminPanel";
import { useAdminSession } from "@/components/admin/useAdminSession";

export default function AdminContentPage() {
    const { status, role, login, logout } = useAdminSession();

    if (status === "checking") {
        return <div className="min-h-screen bg-surface" />;
    }

    if (status !== "authenticated") {
        return <AdminLoginCard onLogin={login} />;
    }

    return (
        <AdminFrame
            section="content"
            role={role}
            title="Site Content"
            description="Edit text, images, and overlays across the wedding website. Changes take effect immediately — no redeploy needed."
            onLogout={logout}
        >
            <ContentAdminPanel />
        </AdminFrame>
    );
}
