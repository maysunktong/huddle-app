"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import ActivityLogs from "../../../components/ActivityLogs";
import { NoPostElement } from "../../../components/NoPostElement";
import {
  ActivityLogsType,
  getActivityLogs,
} from "../../../utils/supabase/queries";
import { createClient } from "../../../utils/supabase/client";
import { Spinner } from "../../../components/ui/spinner";

export default function ActivityLogsPage() {
  const supabase = createClient();
  const [logs, setLogs] = useState<ActivityLogsType>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const userId = user?.id;
        if (!userId) {
          toast.error("User not logged in");
          return;
        }
        const { data: usersLogs, error } = await getActivityLogs(supabase, userId);
        if (error) throw new Error(error.message);
        setLogs(usersLogs);
      } catch (err: any) {
        console.error("Error loading logs:", err.message);
        toast.error("Failed to load activity logs.");
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [supabase]);

  if (loading)
    return (
      <div className="w-full h-full py-8 flex justify-center items-center flex-1">
        <Spinner className="size-8" />
      </div>
    );
  if (!logs || logs.length === 0)
    return (
      <>
        <NoPostElement
          title="No Activity Logs"
          subtext="You haven't created any actions in logs"
        />
      </>
    );

  return (
    <div>
      <ActivityLogs logs={logs!} />
    </div>
  );
}
