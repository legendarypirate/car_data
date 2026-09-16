"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { SoftAction } from "@/components/table-actions";
import { api } from "@/lib/api";
import type { Inquiry, InquiryStatus } from "@/lib/types";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setInquiries(await api<Inquiry[]>("/api/inquiries"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Хүсэлт ачаалж чадсангүй");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(inquiry: Inquiry, status: InquiryStatus) {
    try {
      await api(`/api/inquiries/${inquiry.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success("Хүсэлт шинэчлэгдлээ");
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Шинэчилж чадсангүй");
    }
  }

  async function remove(inquiry: Inquiry) {
    if (!confirm(`${inquiry.name}-ийн хүсэлтийг устгах уу?`)) return;
    try {
      await api(`/api/inquiries/${inquiry.id}`, { method: "DELETE" });
      toast.success("Хүсэлт устгалаа");
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Устгаж чадсангүй");
    }
  }

  return (
    <DataTable
      rows={inquiries}
      loading={loading}
      emptyText="Хүсэлт алга."
      searchPlaceholder="Нэр, имэйл, машин хайх"
      searchKeys={["name", "email", "phone", "car", "notes"]}
      onDelete={remove}
      extraActions={(inquiry) => (
        <>
          {inquiry.status !== "contacted" && (
            <SoftAction title="Холбогдсон" onClick={() => updateStatus(inquiry, "contacted")}>
              <Check className="size-4" />
            </SoftAction>
          )}
          {inquiry.status !== "closed" && (
            <SoftAction title="Хаах" onClick={() => updateStatus(inquiry, "closed")}>
              <X className="size-4" />
            </SoftAction>
          )}
        </>
      )}
      columns={[
        { key: "name", label: "Харилцагч" },
        { key: "email", label: "Имэйл" },
        { key: "phone", label: "Утас" },
        { key: "car", label: "Машин" },
        { key: "notes", label: "Тэмдэглэл" },
        {
          key: "status",
          label: "Төлөв",
          render: (inquiry) => (
            <Badge variant={inquiry.status === "new" ? "default" : "secondary"}>
              {inquiry.status === "new"
                ? "Шинэ"
                : inquiry.status === "contacted"
                  ? "Холбогдсон"
                  : "Хаасан"}
            </Badge>
          ),
        },
      ]}
    />
  );
}
