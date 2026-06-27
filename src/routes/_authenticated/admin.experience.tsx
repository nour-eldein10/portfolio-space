import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";
import { TYPES } from "@/lib/admin-schema";

export const Route = createFileRoute("/_authenticated/admin/experience")({
  component: () => <CrudPage def={TYPES.experience} />,
});