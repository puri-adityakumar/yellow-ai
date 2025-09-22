"use client";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import cx from "classnames";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { Chat } from "@/db/schema";
import { fetcher, getTitleFromChat } from "@/lib/utils";

import {
  InfoIcon,
  MenuIcon,
  MoreHorizontalIcon,
  PencilEditIcon,
  TrashIcon,
} from "./icons";
import { useProject } from "./project-context";
import { ProjectSelector } from "./project-selector";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

export const History = ({ user }: { user: User | undefined }) => {
  const { id } = useParams();
  const pathname = usePathname();
  const { selectedProject, setSelectedProject } = useProject();

  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const {
    data: history,
    isLoading,
    mutate,
  } = useSWR<Array<Chat>>(
    user ? `/api/history${selectedProject && selectedProject !== "VIEW_ALL" ? `?projectId=${selectedProject === "" ? "null" : selectedProject}` : ""}` : null, 
    fetcher, 
    {
      fallbackData: [],
    }
  );

  useEffect(() => {
    mutate();
  }, [pathname, selectedProject, mutate]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projects, setProjects] = useState<Array<{ id: string; name: string; description?: string }>>([]);
  const [showProjectAssignDialog, setShowProjectAssignDialog] = useState(false);
  const [assigningChatId, setAssigningChatId] = useState<string | null>(null);

  // Fetch projects for assignment dropdown
  useEffect(() => {
    if (user) {
      fetch('/api/projects')
        .then(res => res.json())
        .then(data => {
          if (data.projects) {
            setProjects(data.projects);
          }
        })
        .catch(error => console.error('Failed to fetch projects:', error));
    }
  }, [user]);

  const handleAssignToProject = async (chatId: string, projectId: string | null) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          projectId,
        }),
      });

      if (response.ok) {
        toast.success('Chat moved to project successfully');
        mutate(); // Refresh the chat list
        setShowProjectAssignDialog(false);
      } else {
        toast.error('Failed to move chat to project');
      }
    } catch (error) {
      console.error('Error assigning chat to project:', error);
      toast.error('Failed to move chat to project');
    }
  };

  const handleDelete = async () => {
    const deletePromise = fetch(`/api/chat?id=${deleteId}`, {
      method: "DELETE",
    });

    toast.promise(deletePromise, {
      loading: "Deleting chat...",
      success: () => {
        mutate((history) => {
          if (history) {
            return history.filter((h) => h.id !== id);
          }
        });
        return "Chat deleted successfully";
      },
      error: "Failed to delete chat",
    });

    setShowDeleteDialog(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className="p-1.5 h-fit"
        onClick={() => {
          setIsHistoryVisible(true);
        }}
      >
        <MenuIcon />
      </Button>

      <Sheet
        open={isHistoryVisible}
        onOpenChange={(state) => {
          setIsHistoryVisible(state);
        }}
      >
        <SheetContent side="left" className="p-3 w-80 bg-muted">
          <SheetHeader>
            <VisuallyHidden.Root>
              <SheetTitle className="text-left">History</SheetTitle>
              <SheetDescription className="text-left">
                {history === undefined ? "loading" : history.length} chats
              </SheetDescription>
            </VisuallyHidden.Root>
          </SheetHeader>

          <div className="text-sm flex flex-row items-center justify-between">
            <div className="flex flex-row gap-2">
              <div className="dark:text-zinc-300">History</div>

              <div className="dark:text-zinc-400 text-zinc-500">
                {history === undefined ? "loading" : history.length} chats
              </div>
            </div>
          </div>

          {/* Project Selector */}
          {user && (
            <div className="mt-6 mb-4">
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                PROJECT
              </div>
              <ProjectSelector
                selectedProject={selectedProject}
                onProjectChange={setSelectedProject}
              />
            </div>
          )}

          <div className="mt-6 flex flex-col">
            {user && (
              <Button
                className="font-normal text-sm flex flex-row justify-between text-white"
                asChild
              >
                <Link href="/">
                  <div>Start a new chat</div>
                  <PencilEditIcon size={14} />
                </Link>
              </Button>
            )}

            <div className="flex flex-col overflow-y-scroll p-1 h-[calc(100dvh-180px)]">
              {!user ? (
                <div className="text-zinc-500 h-dvh w-full flex flex-row justify-center items-center text-sm gap-2">
                  <InfoIcon />
                  <div>Login to save and revisit previous chats!</div>
                </div>
              ) : null}

              {!isLoading && history?.length === 0 && user ? (
                <div className="text-zinc-500 h-dvh w-full flex flex-row justify-center items-center text-sm gap-2">
                  <InfoIcon />
                  <div>No chats found</div>
                </div>
              ) : null}

              {isLoading && user ? (
                <div className="flex flex-col">
                  {[44, 32, 28, 52].map((item) => (
                    <div key={item} className="p-2 my-[2px]">
                      <div
                        className={`w-${item} h-[20px] rounded-md bg-zinc-200 dark:bg-zinc-600 animate-pulse`}
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              {history && selectedProject === "VIEW_ALL" && (() => {
                // Group chats by project when "View All" is selected
                const groupedChats = history.reduce((groups: Record<string, Chat[]>, chat) => {
                  const key = chat.projectId || 'No Project';
                  if (!groups[key]) groups[key] = [];
                  groups[key].push(chat);
                  return groups;
                }, {});

                return Object.entries(groupedChats).map(([projectName, chats]) => (
                  <div key={projectName} className="mb-4">
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 px-2">
                      {projectName === 'No Project' ? 'NO PROJECT' : 
                        projects.find(p => p.id === projectName)?.name?.toUpperCase() || projectName.toUpperCase()}
                    </div>
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        className={cx(
                          "flex flex-row items-center gap-6 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md pr-2",
                          { "bg-zinc-200 dark:bg-zinc-700": chat.id === id },
                        )}
                      >
                        <Button
                          variant="ghost"
                          className={cx(
                            "hover:bg-zinc-200 dark:hover:bg-zinc-700 justify-between p-0 text-sm font-normal flex flex-row items-center gap-2 pr-2 w-full transition-none",
                          )}
                          asChild
                        >
                          <Link
                            href={`/chat/${chat.id}`}
                            className="text-ellipsis overflow-hidden text-left py-2 pl-2 rounded-lg outline-zinc-900"
                          >
                            {getTitleFromChat(chat)}
                          </Link>
                        </Button>

                        <DropdownMenu modal={true}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="p-0 h-fit font-normal text-zinc-500 transition-none hover:bg-zinc-200 dark:hover:bg-zinc-700"
                              variant="ghost"
                            >
                              <MoreHorizontalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="left" className="z-[60]">
                            <DropdownMenuItem asChild>
                              <Button
                                className="flex flex-row gap-2 items-center justify-start w-full h-fit font-normal p-1.5 rounded-sm"
                                variant="ghost"
                                onClick={() => {
                                  setAssigningChatId(chat.id);
                                  setShowProjectAssignDialog(true);
                                }}
                              >
                                <PencilEditIcon />
                                <div>Add to Project</div>
                              </Button>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Button
                                className="flex flex-row gap-2 items-center justify-start w-full h-fit font-normal p-1.5 rounded-sm"
                                variant="ghost"
                                onClick={() => {
                                  setDeleteId(chat.id);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <TrashIcon />
                                <div>Delete</div>
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                ));
              })()}

              {history && selectedProject !== "VIEW_ALL" && 
                history.map((chat) => (
                  <div
                    key={chat.id}
                    className={cx(
                      "flex flex-row items-center gap-6 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md pr-2",
                      { "bg-zinc-200 dark:bg-zinc-700": chat.id === id },
                    )}
                  >
                    <Button
                      variant="ghost"
                      className={cx(
                        "hover:bg-zinc-200 dark:hover:bg-zinc-700 justify-between p-0 text-sm font-normal flex flex-row items-center gap-2 pr-2 w-full transition-none",
                      )}
                      asChild
                    >
                      <Link
                        href={`/chat/${chat.id}`}
                        className="text-ellipsis overflow-hidden text-left py-2 pl-2 rounded-lg outline-zinc-900"
                      >
                        {getTitleFromChat(chat)}
                      </Link>
                    </Button>

                    <DropdownMenu modal={true}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="p-0 h-fit font-normal text-zinc-500 transition-none hover:bg-zinc-200 dark:hover:bg-zinc-700"
                          variant="ghost"
                        >
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left" className="z-[60]">
                        <DropdownMenuItem asChild>
                          <Button
                            className="flex flex-row gap-2 items-center justify-start w-full h-fit font-normal p-1.5 rounded-sm"
                            variant="ghost"
                            onClick={() => {
                              setAssigningChatId(chat.id);
                              setShowProjectAssignDialog(true);
                            }}
                          >
                            <PencilEditIcon />
                            <div>Add to Project</div>
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Button
                            className="flex flex-row gap-2 items-center justify-start w-full h-fit font-normal p-1.5 rounded-sm"
                            variant="ghost"
                            onClick={() => {
                              setDeleteId(chat.id);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <TrashIcon />
                            <div>Delete</div>
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              chat and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showProjectAssignDialog} onOpenChange={setShowProjectAssignDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Chat to Project</AlertDialogTitle>
            <AlertDialogDescription>
              Select a project to assign this chat to, or choose &ldquo;No Project&rdquo; to remove it from any project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  if (assigningChatId) {
                    handleAssignToProject(assigningChatId, null);
                  }
                }}
              >
                No Project
              </Button>
              {projects.map((project) => (
                <Button
                  key={project.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    if (assigningChatId) {
                      handleAssignToProject(assigningChatId, project.id);
                    }
                  }}
                >
                  {project.name}
                  {project.description && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {project.description}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowProjectAssignDialog(false)}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
