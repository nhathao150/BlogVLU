import EventForm from "@/components/EventForm";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase.from('events').select('*').eq('id', id).single();

  if (!event) notFound();
  return <EventForm initialData={event} />;
}