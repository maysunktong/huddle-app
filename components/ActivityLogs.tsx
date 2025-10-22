"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "../utils/supabase/queries";
import { NoPostElement } from "./NoPostElement";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import { User, Badge } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

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

  if (error)
    return <p className="text-red-500 text-center">Error loading posts</p>;
  if (!data) return;
  if (data.length === 0)
    return (
      <NoPostElement
        title="No Activity Logs"
        subtext="You haven't created any actions in logs"
      />
    );

  return (
    <Card className="w-full px-8">
      <CardTitle>Activity Logs</CardTitle>
      <CardContent>
        <div className="w-full space-y-2 pr-2 flex flex-col items-start">
          {data &&
            data.map((item) => (
              <div key={item.id}>
                <div className="flex gap-2">
                  <div className="flex gap-3 text-sm">
                    <div className="text-muted-foreground">
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                    <div className="flex gap-2">
                      <p className="text-muted-foreground">{item.action} --</p>
                      <p className="font-medium">{item.entity}</p>
                      <p className="text-muted-foreground">
                        {" "}
                        ID: {item.entity_id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
