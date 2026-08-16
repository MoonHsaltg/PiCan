"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Compass,
  Home,
  ImageIcon,
  Menu,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  currentUser?: string;
};

const navigation = [
  { href: "/", label: "Canvas chung", icon: Home },
  { href: "/explore", label: "Khám phá", icon: Compass },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/notifications", label: "Thông báo", icon: Bell },
];

export function AppShell({ children, currentUser = "Bạn" }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="side-navigation">
        <Link className="brand" href="/" aria-label="PiCan - Canvas chung">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>PiCan</span>
        </Link>

        <nav className="side-navigation-links" aria-label="Điều hướng chính">
          {navigation.map(({ href, icon: Icon, label }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link className={isActive ? "is-active" : ""} href={href} key={href}>
                <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="studio-note">
          <Sparkles aria-hidden="true" size={18} />
          <p>Mỗi nét nhỏ đều có thể mở ra một ý tưởng lớn.</p>
        </div>

        <Link className="profile-shortcut" href="/profile/me">
          <span className="avatar avatar-coral">PH</span>
          <span>
            <strong>{currentUser}</strong>
            <small>Xem hồ sơ</small>
          </span>
          <UserRound aria-hidden="true" size={18} />
        </Link>
      </aside>

      <div className="app-main">
        <header className="mobile-header">
          <button className="icon-button" type="button" aria-label="Mở menu">
            <Menu aria-hidden="true" size={21} />
          </button>
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">P</span>
            <span>PiCan</span>
          </Link>
          <Link className="icon-button" href="/explore" aria-label="Tìm kiếm">
            <Search aria-hidden="true" size={21} />
          </Link>
        </header>

        {children}
      </div>

      <nav className="mobile-navigation" aria-label="Điều hướng di động">
        {navigation.map(({ href, icon: Icon, label }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link className={isActive ? "is-active" : ""} href={href} key={href}>
              <Icon aria-hidden="true" size={21} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
