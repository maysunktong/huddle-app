"use client";

import { error } from "console";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ActivityLogs from "../../../components/ActivityLogs";
import { NoPostElement } from "../../../components/NoPostElement";
import {
  ActivityLogsType,
  getActivityLogs,
} from "../../../utils/supabase/queries";
import { createClient } from "../../../utils/supabase/client";

export default function ActivityLogsPage() {
  const supabase = createClient();
  const [logs, setLogs] = useState<ActivityLogsType>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;
      setCurrentUserId(user?.id!);
      if (!userId) {
        toast.error("User not logged in");
        return;
      }
      const { data: logs, error } = await getActivityLogs(
        supabase,
        userId
      );
      if (error) throw new Error(error.message);
      setLogs(logs);
    };

    fetchPosts();
  }, [supabase]);

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
