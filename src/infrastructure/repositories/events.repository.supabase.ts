// import { IEventsRepository, InsertEvent } from "@/application/repositories/events.repository.interface";
// import type { Event } from "@/entities/models/event";
// import { supabaseAdmin } from "@/infrastructure/services/supabase.client";

// export class EventsRepositorySupabase implements IEventsRepository {
//   async create(event: InsertEvent): Promise<Event> {
//     const { data, error } = await supabaseAdmin
//       .from("event_logs")
//       .insert({
//         user_id: event.userId,                // number
//         session_id: event.sessionId,          // text
//         action_name: event.actionName,        // text
//         logged_at: event.loggedAt.toISOString(), // timestamptz
//         problem_id: event.problemId ?? null,  // number
//         method_id: event.methodId ?? null,    // number
//         step_id: event.stepId ?? null,        // number
//         payload: event.payload ?? null,       // text
//       })
//       .select()
//       .single();

//     if (error) throw error;

//     return {
//       id: data.id,                              // number (bigint/int)
//       userId: data.user_id,
//       sessionId: data.session_id,
//       actionName: data.action_name,
//       loggedAt: new Date(data.logged_at),
//       problemId: data.problem_id ?? undefined,
//       methodId: data.method_id ?? undefined,
//       stepId: data.step_id ?? undefined,
//       payload: data.payload ?? undefined,       // string | undefined
//     };
//   }
// }
