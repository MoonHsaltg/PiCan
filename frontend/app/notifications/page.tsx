"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, CheckCheck, Heart, MessageCircle, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";

const initialNotifications = [
  { id: 1, icon: Heart, tone: "coral", title: "Hà My và 12 người khác đã yêu thích tranh của bạn", time: "6 phút", image: "/art/sunlit-studio.png", unread: true },
  { id: 2, icon: MessageCircle, tone: "blue", title: "Minh An để lại một lời nhắn: “Mình thích cách bạn giữ khoảng trống ở góc phải.”", time: "28 phút", image: "/art/color-study.png", unread: true },
  { id: 3, icon: UserPlus, tone: "green", title: "Thu Phương bắt đầu theo dõi bạn", time: "2 giờ", unread: false },
  { id: 4, icon: ShieldCheck, tone: "yellow", title: "Bản kiểm tra tương đồng đã hoàn tất. Không phát hiện trùng khớp đáng kể.", time: "Hôm qua", image: "/art/sketchbook-notes.png", unread: false },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  return (
    <AppShell>
      <main className="standard-page notifications-page">
        <header className="standard-page-header">
          <div>
            <p className="section-kicker">Cập nhật</p>
            <h1>Thông báo</h1>
            <p className="page-description">Những phản hồi mới quanh góc sáng tạo của bạn.</p>
          </div>
          <button className="button button-secondary" onClick={() => setNotifications((items) => items.map((item) => ({ ...item, unread: false })))} type="button">
            <CheckCheck size={18} /> Đánh dấu đã đọc
          </button>
        </header>

        <section className="notification-list">
          {notifications.map(({ id, icon: Icon, image, time, title, tone, unread }) => (
            <article className={`notification-item ${unread ? "is-unread" : ""}`} key={id}>
              <span className={`notification-icon notification-${tone}`}><Icon size={20} /></span>
              <div className="notification-copy">
                <p>{title}</p>
                <time>{time}</time>
              </div>
              {image ? <Link className="notification-thumbnail" href="/gallery"><Image alt="Tác phẩm liên quan" fill sizes="72px" src={image} /></Link> : <Bell className="notification-quiet-icon" size={19} />}
              {unread ? <span className="unread-dot" aria-label="Chưa đọc" /> : null}
            </article>
          ))}
        </section>
      </main>
    </AppShell>
  );
}
