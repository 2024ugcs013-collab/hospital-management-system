import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(19,165,127,0.15),_transparent_38%),linear-gradient(180deg,_#f8fafc_0%,_#eef7f5_100%)]">
      <Outlet />
    </main>
  );
}

