"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { DeleteAction, EditAction } from "@/components/table-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type DataColumn<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
};

export function DataTable<T extends { id: number | string }>({
  rows,
  columns,
  loading,
  emptyText,
  searchPlaceholder = "Хайх утга оруулна уу",
  searchKeys,
  toolbar,
  onEdit,
  onDelete,
  extraActions,
}: {
  rows: T[];
  columns: DataColumn<T>[];
  loading?: boolean;
  emptyText: string;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  toolbar?: React.ReactNode;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  extraActions?: (row: T) => React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const q = applied.trim().toLowerCase();
    let list = rows;
    if (q) {
      list = rows.filter((row) => {
        if (searchKeys?.length) {
          return searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q));
        }
        return Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(q));
      });
    }
    if (sortKey) {
      list = [...list].sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sortKey] ?? "");
        const bv = String((b as Record<string, unknown>)[sortKey] ?? "");
        return sortDir === "asc" ? av.localeCompare(bv, "mn") : bv.localeCompare(av, "mn");
      });
    }
    return list;
  }, [rows, applied, searchKeys, sortKey, sortDir]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const pages = visiblePages(currentPage, totalPages);

  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-foreground/10">
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setApplied(query);
              setPage(1);
            }
          }}
          placeholder={searchPlaceholder}
          className="h-10 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        {toolbar}
        <Button
          size="icon"
          className="rounded-full"
          onClick={() => {
            setApplied(query);
            setPage(1);
          }}
        >
          <Search />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-[#f8fafc]">
            <TableHead className="w-12">№</TableHead>
            <TableHead className="w-24">Үйлдэл</TableHead>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.sortable === false ? (
                  column.label
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1"
                    onClick={() => toggleSort(column.key)}
                  >
                    {column.label}
                    <ArrowUpDown className="size-3.5 text-muted-foreground" />
                  </button>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="py-10 text-center text-muted-foreground">
                Ачаалж байна...
              </TableCell>
            </TableRow>
          )}
          {!loading && paged.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="py-10 text-center text-muted-foreground">
                {emptyText}
              </TableCell>
            </TableRow>
          )}
          {paged.map((row, index) => (
            <TableRow key={String(row.id)}>
              <TableCell className="text-muted-foreground">
                {(currentPage - 1) * pageSize + index + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {extraActions?.(row)}
                  {onEdit && <EditAction onClick={() => onEdit(row)} />}
                  {onDelete && <DeleteAction onClick={() => onDelete(row)} />}
                </div>
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render
                    ? column.render(row, index)
                    : String((row as Record<string, unknown>)[column.key] ?? "—")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          Бүгд {total} мөр, {currentPage}-р хуудас / нийт {totalPages} хуудас
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            « Өмнөх
          </Button>
          {pages.map((item) => (
            <Button
              key={item}
              size="icon-sm"
              variant={item === currentPage ? "default" : "outline"}
              onClick={() => setPage(item)}
            >
              {item}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Дараах »
          </Button>
        </div>
      </div>
    </div>
  );
}

function visiblePages(current: number, total: number) {
  const pages: number[] = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(total, start + 4);
  for (let i = Math.max(1, end - 4); i <= end; i += 1) pages.push(i);
  return pages;
}
