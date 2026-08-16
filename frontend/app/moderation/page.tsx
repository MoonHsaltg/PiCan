"use client";

import Image from "next/image";
import { AlertTriangle, CheckCircle2, ChevronRight, Clock3, Flag, Info, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";

const statuses = {
  reviewing: { icon: Clock3, label: "Đang chờ cộng đồng xem xét", className: "status-reviewing" },
  clear: { icon: CheckCircle2, label: "Không phát hiện tương đồng đáng kể", className: "status-clear" },
  flagged: { icon: AlertTriangle, label: "Cần xem xét thêm", className: "status-flagged" },
};

export default function ModerationPage() {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <AppShell>
      <main className="standard-page moderation-page">
        <header className="standard-page-header">
          <div>
            <p className="section-kicker">Minh bạch tác phẩm</p>
            <h1>Kiểm tra & báo cáo</h1>
            <p className="page-description">AI chỉ gắn cờ dấu hiệu tương đồng. Con người luôn là người xem xét ngữ cảnh và đưa ra quyết định cuối cùng.</p>
          </div>
          <div className="header-symbol"><ShieldCheck size={28} /></div>
        </header>

        <section className="moderation-summary">
          <div className="moderation-score">
            <span>Điểm tương đồng</span>
            <strong>38%</strong>
            <small>Mức cần xem xét, chưa phải kết luận vi phạm.</small>
          </div>
          <div className="moderation-steps">
            {Object.entries(statuses).map(([key, status], index) => {
              const Icon = status.icon;
              return <div className={`${status.className} ${index === 0 ? "is-current" : ""}`} key={key}><Icon size={19} /><span>{status.label}</span>{index === 0 ? <small>Bước hiện tại</small> : null}</div>;
            })}
          </div>
        </section>

        <section className="comparison-section">
          <div className="section-heading-row">
            <div><span className="section-kicker">Đối chiếu trực quan</span><h2>Hai tác phẩm đang được xem</h2></div>
            <button className="button button-secondary" onClick={() => setReportOpen(true)} type="button"><Flag size={17} /> Gửi báo cáo</button>
          </div>
          <div className="comparison-grid">
            <article><div className="comparison-image"><Image alt="Tác phẩm được báo cáo" fill priority sizes="45vw" src="/art/color-study.png" /></div><span>Tác phẩm được báo cáo</span><h3>Nhịp màu số 04</h3></article>
            <article><div className="comparison-image"><Image alt="Tác phẩm tham chiếu" fill sizes="45vw" src="/art/sketchbook-notes.png" /></div><span>Tác phẩm tham chiếu</span><h3>Nghiên cứu hình và nét</h3></article>
          </div>
        </section>

        <section className="review-transparency">
          <div><Info size={20} /><div><h2>Điều gì sẽ được công khai?</h2><p>PiCan chỉ công khai trạng thái, tiêu chí được xem xét và kết luận tổng hợp. Nhận xét thô được ẩn danh và kiểm duyệt để hạn chế công kích cá nhân.</p></div></div>
          <button type="button">Xem nguyên tắc đánh giá <ChevronRight size={18} /></button>
        </section>
      </main>

      {reportOpen ? (
        <div className="dialog-backdrop" onMouseDown={() => setReportOpen(false)}>
          <section className="report-dialog" onMouseDown={(event) => event.stopPropagation()}>
            <span className="notification-icon notification-yellow"><Flag size={21} /></span>
            <h2>Báo cáo tác phẩm</h2>
            <p>Hãy mô tả dấu hiệu bạn nhận thấy. Báo cáo không đồng nghĩa với kết luận vi phạm.</p>
            <label><span>Lý do</span><select defaultValue="similar"><option value="similar">Nghi ngờ tương đồng cao</option><option value="source">Không ghi nguồn tham khảo</option><option value="other">Lý do khác</option></select></label>
            <label><span>Mô tả ngắn</span><textarea placeholder="Điểm nào khiến bạn thấy hai tác phẩm giống nhau?" rows={4} /></label>
            <label className="report-private"><input defaultChecked type="checkbox" /> Ẩn danh người báo cáo với tác giả</label>
            <div className="dialog-actions"><button className="button button-secondary" onClick={() => setReportOpen(false)} type="button">Hủy</button><button className="button button-primary" onClick={() => setReportOpen(false)} type="button">Gửi để xem xét</button></div>
          </section>
        </div>
      ) : null}
    </AppShell>
  );
}
