import { useState } from "react";
import { supabase } from "../../../lib/spabase";
import { useToast } from "@chakra-ui/react";
import useSWR from "swr";

export type Todo = {
  id: string;
  value: string;
  is_completed: boolean;
  created_at: string;
};

const fetchTodos = async (): Promise<Todo[] | null> => {
  const { data, error } = await supabase.from<Todo>("todos").select("*");

  if (error) {
    throw error;
  }

  return data;
};

export const useTodo = () => {
  const { data: todos, error, mutate } = useSWR("todos", fetchTodos);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const add = async (value: string, params: { onComplete?: () => void }) => {
    const task = value.trim();

    if (!task.length) return;

    setIsLoading(true);

    const { data, error } = await supabase
      .from<Todo>("todos")
      .insert({ value: task, is_completed: false })
      .single();

    if (data) {
      mutate();
      toast({ status: "success", title: "タスクを追加しました" });
      params.onComplete?.();
    }
    if (error) {
      toast({
        status: "error",
        title: "タスクの追加に失敗しました",
        description: error.message,
      });
    }

    setIsLoading(false);
  };

  const remove = async (todo: Todo) => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from<Todo>("todos")
      .delete()
      .eq("id", todo.id)
      .single();

    if (data) {
      mutate();
      toast({ status: "success", title: "タスクを削除しました" });
    }

    if (error) {
      toast({
        status: "error",
        title: "タスクの削除に失敗しました",
        description: error.message,
      });
    }

    setIsLoading(false);
  };

  const toggle = async (todo: Todo) => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from<Todo>("todos")
      .update({ is_completed: !todo.is_completed })
      .eq("id", todo.id)
      .single();

    if (data) {
      mutate();
      toast({ status: "success", title: "タスクを更新しました" });
    }
    if (error) {
      toast({
        status: "error",
        title: "タスクの更新に失敗しました",
        description: error.message,
      });
    }

    setIsLoading(false);
  };
  console.log(todos);

  return { todos, error, add, remove, toggle, isLoading };
};
