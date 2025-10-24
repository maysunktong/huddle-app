"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ActivityLogsType, getActivityLogs } from "../utils/supabase/queries";
import { NoPostElement } from "./NoPostElement";
import { Card, CardTitle, CardContent } from "./ui/card";

export default function ActivityLogs({ logs }: { logs: ActivityLogsType }) {
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
    initialData: logs,
    refetchOnMount: "always",
    refetchInterval: 3000,
    staleTime: 10000,
    enabled: !!currentUserId,
  });

  if (error)
    return <p className="text-red-500 text-center">Error loading posts</p>;
  if (!data || data.length === 0)
    return (
      <>
        <NoPostElement
          title="No Activity Logs"
          subtext="You haven't created any actions in logs"
        />
      </>
    );

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full px-8 max-w-5xl">
        <CardTitle className="text-center">Activity Logs</CardTitle>
        <CardContent>
          <div className="overflow-x-auto w-full">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="px-4 py-2 border-b">Date</th>
                  <th className="px-4 py-2 border-b">Action</th>
                  <th className="px-4 py-2 border-b">Entity</th>
                  <th className="px-4 py-2 border-b">Entity ID</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 text-sm ">
                      <td className="px-4 py-2 border-b text-muted-foreground">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border-b text-muted-foreground">
                        {item.action}
                      </td>
                      <td className="px-4 py-2 border-b text-muted-foreground">
                        {item.entity}
                      </td>
                      <td className="px-4 py-2 border-b text-muted-foreground">
                        {item.entity_id}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
