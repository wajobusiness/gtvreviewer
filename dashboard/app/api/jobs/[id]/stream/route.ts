import { NextRequest } from "next/server";
import { jobManager } from "@/lib/queue/jobManager";
import { getCurrentSession } from "@/lib/auth/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const initialJob = jobManager.getJob(id);

  if (!initialJob) {
    return new Response("Job not found", { status: 404 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial state immediately
      const initialPayload = `data: ${JSON.stringify(initialJob)}\n\n`;
      controller.enqueue(encoder.encode(initialPayload));

      if (initialJob.status === "COMPLETED" || initialJob.status === "FAILED") {
        controller.close();
        return;
      }

      // Subscribe to live job updates
      const unsubscribe = jobManager.subscribe(id, (updatedJob) => {
        try {
          const payload = `data: ${JSON.stringify(updatedJob)}\n\n`;
          controller.enqueue(encoder.encode(payload));

          if (updatedJob.status === "COMPLETED" || updatedJob.status === "FAILED") {
            unsubscribe();
            controller.close();
          }
        } catch {
          unsubscribe();
        }
      });

      // Cleanup if client closes connection
      request.signal.addEventListener("abort", () => {
        unsubscribe();
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

