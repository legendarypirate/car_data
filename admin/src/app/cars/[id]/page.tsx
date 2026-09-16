"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CarForm } from "@/components/car-form";
import { api } from "@/lib/api";
import type { Car } from "@/lib/types";

export default function EditCarPage() {
  const params = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Car>(`/api/cars/${params.id}`)
      .then(setCar)
      .catch((err: Error) => setError(err.message));
  }, [params.id]);

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }
  if (!car) {
    return <p className="text-sm text-muted-foreground">Машин ачаалж байна...</p>;
  }

  return (
    <div className="w-full">
      <CarForm car={car} />
    </div>
  );
}
