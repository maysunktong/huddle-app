"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "../utils/supabase/queries";

export default function ActivityLogs() {
  const supabase = createClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
    };
    getUser();
  });

  const { data, error } = useQuery({
    queryKey: ["activity-logs", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const { data, error } = await getActivityLogs(supabase, currentUserId);
      if (error) throw new Error(error.message);
      return data;
    },
    refetchOnMount: "always",
    refetchInterval: 3000,
    staleTime: 10000,
  });
  return <div>Hello</div>;
}
